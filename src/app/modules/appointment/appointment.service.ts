import { Prisma, userRole } from '@prisma/client';
import { calculagePagination } from '../../../helpers/pagination.helper';
import { prisma } from '../../../shared/prisma';
import { TAuthUser } from '../../interfaces/common';
import { v4 as uuidv4 } from 'uuid';

const CreateAnAppointment = async (
  user: TAuthUser,
  payload: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  const doctorScheduleData = await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });
    // company name date time,
    const today = new Date();
    const transactionId = 'PH-HealthCare' + today;
    await tx.payment.create({
      data: {
        appointtmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId: transactionId,
      },
    });
    return appointmentData;
  });
  return result;
};
const getMyAppointment = async (user: TAuthUser, filter: any, options: any) => {
  const { limit, page, skip, sortBy, sortOrder } = calculagePagination(options);
  const { ...filterData } = filter;
  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === userRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === userRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: 'desc' },
    include:
      user?.role === userRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: {
                medicalReports: true,
                patientHealthData: true,
              },
            },
            schedule: true,
          },
  });
  const total = await prisma.appointment.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const appointmentService = {
  CreateAnAppointment,
  getMyAppointment,
};

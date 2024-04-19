import { Prisma } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { TAuthUser } from '../../interfaces/common';
import { TPagination } from '../../interfaces/pagination';
import { calculagePagination } from '../../../helpers/pagination.helper';

const createDoctorSchedule = async (
  user: TAuthUser,
  paylod: { schedulesIds: string[] }
) => {
  const doctorData = await prisma.doctor.findFirstOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorScheduleData = paylod.schedulesIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
    isBooked: false,
  }));
  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });
  return result;
};
const getMySchedule = async (
  filters: any,
  options: TPagination,
  user: TAuthUser
) => {
  const { limit, page, skip, sortBy, sortOrder } = calculagePagination(options);
  console.log({ limit, page });
  const addCondition: Prisma.DoctorScheduleWhereInput[] = [];
  const { startDate, endDate, ...filterData } = filters;

  if (startDate && endDate) {
    addCondition.push({
      AND: [
        {
          schedule: {
            startDate: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDate: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'true'
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === 'string' &&
      filterData.isBooked === 'false'
    ) {
      filterData.isBooked = false;
    }
    addCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    AND: addCondition,
  };

  const result = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
  });
  const total = await prisma.doctorSchedule.count({
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
const deleteDocSchedule = async () => {};
export const doctorScheduleService = {
  createDoctorSchedule,
  getMySchedule,
  deleteDocSchedule,
};

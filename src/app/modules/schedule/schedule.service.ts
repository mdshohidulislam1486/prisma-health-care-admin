import { addHours, addMinutes, format } from 'date-fns';
import { prisma } from '../../../shared/prisma';
import { Prisma, Schedule } from '@prisma/client';
import { TPagination } from '../../interfaces/pagination';
import { calculagePagination } from '../../../helpers/pagination.helper';
import { TAuthUser } from '../../interfaces/common';

const createSchedule = async (paylod: any): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = paylod;
  const interValTime = 30;
  const schedules = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startFullDate = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyyy-MM-dd')}`,
          Number(startTime.split(':')[0])
        ),
        Number(startTime.split(':')[1])
      )
    );
    const endFullDate = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, 'yyyy-MM-dd')}`,
          Number(endTime.split(':')[0])
        ),
        Number(endTime.split(':')[1])
      )
    );

    while (startFullDate < endFullDate) {
      const scheduleData = {
        startDate: startFullDate,
        endDate: addMinutes(startFullDate, interValTime),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }
      startFullDate.setMinutes(startFullDate.getMinutes() + interValTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const getAllSchedule = async (
  filters: { startDate?: string | undefined; endDate?: string | undefined },
  options: TPagination,
  user: TAuthUser
) => {
  const { limit, page, skip, sortBy, sortOrder } = calculagePagination(options);
  console.log({ limit, page });
  const { startDate, endDate, ...filterData } = filters;

  const addCondition: Prisma.ScheduleWhereInput[] = [];

  if (startDate && endDate) {
    addCondition.push({
      AND: [
        {
          startDate: {
            gte: startDate,
          },
        },
        {
          endDate: {
            lte: endDate,
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
    addCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
          mode: 'insensitive',
        },
      })),
    });
  }
  const whereConditions: Prisma.ScheduleWhereInput = { AND: addCondition };

  const doctorSchedule = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  const doctorSelecteSchedule = doctorSchedule.map(
    (schedule) => schedule.scheduleId
  );
  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorSelecteSchedule,
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: 'desc' },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorSelecteSchedule,
      },
    },
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

export const scheduleService = {
  createSchedule,
  getAllSchedule,
};

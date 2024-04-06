import { addHours, addMinutes, format } from 'date-fns';
import { prisma } from '../../../shared/prisma';
import { Schedule } from '@prisma/client';

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

export const scheduleService = {
  createSchedule,
};

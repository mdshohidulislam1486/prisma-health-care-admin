import { addHours, format } from 'date-fns';

const createSchedule = async (paylod: any) => {
  const { startDate, endDate, startTime, endTime } = paylod;

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  console.log({ startTime });
  while (currentDate <= lastDate) {
    const startFullDate = new Date(
      addHours(
        `${format(currentDate, 'yyyy-MM-dd')}`,
        Number(startTime.split(':')[0])
      )
    );
    const endFullDate = new Date(
      addHours(
        `${format(lastDate, 'yyyy-MM-dd')}`,
        Number(endTime.split(':')[0])
      )
    );
    console.log({ startFullDate, endFullDate });
  }
};

export const scheduleService = {
  createSchedule,
};

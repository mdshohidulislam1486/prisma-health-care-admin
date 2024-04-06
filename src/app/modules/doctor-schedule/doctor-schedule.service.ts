import { prisma } from '../../../shared/prisma';
import { TAuthUser } from '../../interfaces/common';

const createDoctorSchedule = async (user: TAuthUser, paylod: string[]) => {
  const doctorData = await prisma.doctor.findFirstOrThrow({
    where: {
      email: user?.email,
    },
  });

  console.log({ paylod });
};

export const doctorScheduleService = {
  createDoctorSchedule,
};

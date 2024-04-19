import { Prisma } from '@prisma/client';
import { calculagePagination } from '../../../helpers/pagination.helper';
import { prisma } from '../../../shared/prisma';
import { TAuthUser } from '../../interfaces/common';
import { TPagination } from '../../interfaces/pagination';

const updateSingleDoctr = async (id: string, paylod: any) => {
  const { specialties, ...doctorData } = paylod;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transctionClient) => {
    await transctionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });
    const deleteSpeciiltesIds = specialties.filter(
      (specilty) => specilty.isDeleted
    );
    for (const specilty of deleteSpeciiltesIds) {
      await transctionClient.doctorSpecilities.deleteMany({
        where: {
          doctroId: doctorInfo.id,
          specilitiesId: specilty.speciltiesId,
        },
      });
    }
    // create specilities  on doc
    if (specialties && specialties.length > 0) {
      const createSpecilites = specialties.filter(
        (specilty) => !specilty.isDeleted
      );
      for (const specilty of createSpecilites) {
        await transctionClient.doctorSpecilities.create({
          data: {
            doctroId: doctorInfo.id,
            specilitiesId: specilty.speciltiesId,
          },
        });
      }

      // delete specilties
    }
    const result = await prisma.doctor.findUniqueOrThrow({
      where: {
        id: doctorInfo.id,
      },
      include: {
        doctorSpecialites: {
          include: {
            specility: true,
          },
        },
      },
    });
    return result;
  });

  return result;
};

export const doctorService = {
  updateSingleDoctr,
};

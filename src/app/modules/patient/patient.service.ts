import { userInfo } from 'os';
import { prisma } from '../../../shared/prisma';
import { Patient } from '@prisma/client';
import { PatientPaylod } from './patient.constant';

const updateSinglePtient = async (
  id: string,
  payload: any
): Promise<Patient | null> => {
  const { patientHealthData, medicalReports, ...patientData } = payload;
  console.log({ patientHealthData, medicalReports });

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transctionClient) => {
    const updatedPatient = await transctionClient.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReports: true,
      },
    });
    if (patientHealthData) {
      const createPatientHealthData =
        await transctionClient.patientHealthData.upsert({
          where: {
            patientId: patientInfo.id,
          },
          update: patientHealthData,
          create: { ...patientHealthData, patientId: id },
        });
      console.log({ createPatientHealthData });
    }
    if (medicalReports) {
      const createPatientHealthData =
        await transctionClient.medicalReport.create({
          data: { ...medicalReports, patientId: patientInfo.id },
        });
    }
    const responseData = await prisma.patient.findUnique({
      where: {
        id: patientInfo.id,
      },
      include: {
        patientHealthData: true,
        medicalReports: true,
      },
    });

    return responseData;
  });

  return result;
};

const deletePatient = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    await tx.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });
    const deletedPatinet = await tx.patient.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: deletedPatinet.email,
      },
    });
    return deletedPatinet;
  });

  return result;
};

export const patientService = {
  updateSinglePtient,
  deletePatient,
};

import { Request } from 'express';
import { uploadToCludionary } from '../../../helpers/file-uploader';
import { prisma } from '../../../shared/prisma';
import { TUploadedFileInfo } from '../../interfaces/file';

const createASpecility = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadData = await uploadToCludionary(file);
    req.body.icon = uploadData?.secure_url;
  }
  const result = await prisma.specialist.create({
    data: req.body,
  });
  return result;
};

const getAllSepcilities = async () => {
  const result = prisma.specialist.findMany();
  return result;
};

const deleteSepecilities = async (id: string) => {
  const findId = prisma.specialist.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = prisma.specialist.delete({
    where: {
      id,
    },
  });
  return null;
};
export const specilitiesService = {
  createASpecility,
  getAllSepcilities,
  deleteSepecilities,
};

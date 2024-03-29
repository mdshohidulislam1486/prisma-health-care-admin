import { PrismaClient, userRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import config from '../../../config';
import { uploadToCludionary } from '../../../helpers/file-uploader';
import { TUploadedFileInfo } from '../../interfaces/file';
const prisma = new PrismaClient();

const createAdmin = async (req: any) => {
  let data = req.body;
  const file: TUploadedFileInfo = req?.file;
  console.log(req.body);
  if (file) {
    const uploadedFile = await uploadToCludionary(file);
    data.admin.profilePhoto = uploadedFile?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(
    data.password,
    Number(config.salt_round) as number
  );

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: userRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transctionCleint) => {
    const createdUserData = await transctionCleint.user.create({
      data: userData,
    });
    const createdAdminData = await transctionCleint.admin.create({
      data: data.admin,
    });
    return createdAdminData;
  });

  return result;
};

const createDoctor = async (req: any) => {
  let data = req.body;
  const file: TUploadedFileInfo = req?.file;
  console.log(req.body);
  if (file) {
    const uploadedFile = await uploadToCludionary(file);
    data.doctor.profilePhoto = uploadedFile?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(
    data.password,
    Number(config.salt_round) as number
  );

  const userData = {
    email: data.doctor.email,
    password: hashedPassword,
    role: userRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transctionCleint) => {
    const createdUserData = await transctionCleint.user.create({
      data: userData,
    });
    const createDoctorData = await transctionCleint.doctor.create({
      data: data.doctor,
    });
    return createDoctorData;
  });

  return result;
};

export const userService = {
  createAdmin,
  createDoctor,
};

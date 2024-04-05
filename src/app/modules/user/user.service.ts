import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  PrismaClient,
  userRole,
  userStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import config from '../../../config';
import { upload, uploadToCludionary } from '../../../helpers/file-uploader';
import { TUploadedFileInfo } from '../../interfaces/file';
import { TPagination } from '../../interfaces/pagination';
import { calculagePagination } from '../../../helpers/pagination.helper';
import { userFilterableFields, userSearchableFields } from './user.constant';
import { TAuthUser } from '../../interfaces/common';
const prisma = new PrismaClient();

const createAdmin = async (req: any): Promise<Admin> => {
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

const createDoctor = async (req: any): Promise<Doctor> => {
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
const createPatient = async (req: any): Promise<Patient> => {
  let data = req.body;
  const file: TUploadedFileInfo = req?.file;
  console.log(req.body);
  if (file) {
    const uploadedFile = await uploadToCludionary(file);
    data.patient.profilePhoto = uploadedFile?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(
    data.password,
    Number(config.salt_round) as number
  );

  const userData = {
    email: data.patient.email,
    password: hashedPassword,
    role: userRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transctionCleint) => {
    const createdUserData = await transctionCleint.user.create({
      data: userData,
    });
    const createPatientData = await transctionCleint.patient.create({
      data: data.patient,
    });
    return createPatientData;
  });

  return result;
};

const getAllUserFromDB = async (params: any, options: TPagination) => {
  const { limit, page, skip, sortBy, sortOrder } = calculagePagination(options);
  console.log({ limit, page });
  const { searchTerm, ...filterData } = params;
  const addCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    addCondition.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  console.log({ filterData });
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

  const whereConditions: Prisma.UserWhereInput = { AND: addCondition };
  console.dir({ whereConditions }, { depth: Infinity });
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
    /*  include: {
      admin: true,
      patient: true,
      doctor: true,
    }, */
  });
  const total = await prisma.user.count({
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

const changeUserProfileStatus = async (
  id: string,
  status: { status: userStatus }
) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });

  const updateStatus = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: status,
  });
  return updateStatus;
};

const getMyProfile = async (user: TAuthUser) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: userStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  let profileInfo;
  if (userInfo.role === userRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === userRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === userRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === userRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }
  return { ...userInfo, ...profileInfo };
};
const updateMyProfile = async (user: TAuthUser, req: any) => {
  const paylod = req.body;
  const file: TUploadedFileInfo = req.file;

  if ((req.body, file)) {
    const uploadFile = await uploadToCludionary(file);

    req.body.profilePhoto = uploadFile?.secure_url;
  }
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: userStatus.ACTIVE,
    },
    /* select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
      createdAt: true,
    }, */
  });
  let profileInfo;
  if (userInfo.role === userRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: paylod,
    });
  } else if (userInfo.role === userRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: paylod,
    });
  } else if (userInfo.role === userRole.DOCTOR) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: paylod,
    });
  } else if (userInfo.role === userRole.PATIENT) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: paylod,
    });
  }
  return { ...profileInfo };
};
export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  changeUserProfileStatus,
  getAllUserFromDB,
  getMyProfile,
  updateMyProfile,
};

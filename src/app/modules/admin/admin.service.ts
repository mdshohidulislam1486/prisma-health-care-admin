import { Admin, Prisma, PrismaClient, userStatus } from '@prisma/client';
import { adminSearchFields, aminFilterFields } from './admin.constant';
import { calculagePagination } from '../../../helpers/pagination.helper';
import { prisma } from '../../../shared/prisma';
import { TAdminFilterRequest } from './admin.interface';
import { TPagination } from '../../interfaces/pagination';

const getAllAdminFromDB = async (
  params: TAdminFilterRequest,
  options: TPagination
) => {
  const { limit, page, skip, sortBy, sortOrder } = calculagePagination(options);
  console.log({ limit, page });
  const { searchTerm, ...filterData } = params;
  const addCondition: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    addCondition.push({
      OR: adminSearchFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
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
  addCondition.push({
    isDeleted: false,
  });
  const whereConditions: Prisma.AdminWhereInput = { AND: addCondition };
  console.log({ whereConditions });
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: 'desc' },
  });
  const total = await prisma.admin.count({
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

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });

  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id, isDeleted: false },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.$transaction(async (transictionClient) => {
    const adminDeletedDaata = await transictionClient.admin.delete({
      where: { id },
    });
    const deletedUserData = await transictionClient.user.delete({
      where: {
        email: adminDeletedDaata.email,
      },
    });
    return adminDeletedDaata;
  });

  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.$transaction(async (transictionClient) => {
    const adminDeletedDaata = await transictionClient.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    const deletedUserData = await transictionClient.user.update({
      where: {
        email: adminDeletedDaata.email,
      },
      data: {
        status: userStatus.DELETED,
      },
    });
    return adminDeletedDaata;
  });

  return result;
};

export const adminServices = {
  getAllAdminFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

/* 
   [
        {
          name: {
            contains: params.searchTerm,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: params.searchTerm,
            mode: 'insensitive',
          },
        },
      ],
  */

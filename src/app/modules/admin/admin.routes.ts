import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';
import { AnyZodObject, z } from 'zod';
import { validateRequest } from '../../middlewares/validateRequest';
import { adminDataupdate } from './admin.validate';
import { userRole } from '@prisma/client';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router
  .get(
    '/',
    auth(userRole.ADMIN, userRole.SUPER_ADMIN),
    AdminController.getAllAdmin
  )
  .get(
    '/:id',
    auth(userRole.ADMIN, userRole.SUPER_ADMIN),
    AdminController.getByIdFromDb
  )
  .patch(
    '/:id',
    auth(userRole.ADMIN, userRole.SUPER_ADMIN),
    validateRequest(adminDataupdate),
    AdminController.uddateIntoDB
  )
  .delete(
    '/:id',
    auth(userRole.ADMIN, userRole.SUPER_ADMIN),
    AdminController.deleteAdminFromDB
  )
  .delete(
    '/soft/:id',
    auth(userRole.ADMIN, userRole.SUPER_ADMIN),
    AdminController.softDeleteFromDB
  );

export const adminRoutes = router;

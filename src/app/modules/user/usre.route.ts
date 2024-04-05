import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { userRole } from '@prisma/client';

import { auth } from '../../middlewares/auth';
import { upload } from '../../../helpers/file-uploader';
import { userValidation } from './user.validation';
import { json } from 'stream/consumers';

const router = express.Router();

router
  .get(
    '/me',
    auth(
      userRole.ADMIN,
      userRole.DOCTOR,
      userRole.SUPER_ADMIN,
      userRole.PATIENT
    ),
    userController.getmyProfile
  )
  .get('/', auth(userRole.ADMIN, userRole.ADMIN), userController.getAllusers)
  .patch(
    '/:id/status',
    auth(userRole.SUPER_ADMIN, userRole.ADMIN),
    userController.changeProfileStatus
  )
  .post(
    '/create-admin',
    auth(userRole.ADMIN, userRole.SUPER_ADMIN),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createAdminValidate.parse(
        JSON.parse(req.body.data)
      );
      return userController.createAdmin(req, res, next);
    }
  )
  .post(
    '/create-doctor',
    auth(userRole.ADMIN, userRole.SUPER_ADMIN),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
      return userController.createDoctor(req, res, next);
    }
  )
  .post(
    '/create-patient',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
      return userController.createPatient(req, res, next);
    }
  )
  .post(
    '/update-my-profile',
    auth(
      userRole.ADMIN,
      userRole.DOCTOR,
      userRole.SUPER_ADMIN,
      userRole.PATIENT
    ),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      return userController.updateMyProfile(req, res, next);
    }
  );

export const userRoutes = router;

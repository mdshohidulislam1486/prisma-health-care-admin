import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { userRole } from '@prisma/client';

import { auth } from '../../middlewares/auth';
import { upload } from '../../../helpers/file-uploader';
import { userValidation } from './user.validation';
import { json } from 'stream/consumers';

const router = express.Router();

router
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
  );

export const userRoutes = router;

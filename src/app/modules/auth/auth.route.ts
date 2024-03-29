import express from 'express';
import { authController } from './auth.controller';
import { userRole } from '@prisma/client';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router
  .post('/login', authController.loginUser)
  .post('/refresh-token', authController.validateAccessToken)
  .post(
    '/change-password',
    auth(
      userRole.ADMIN,
      userRole.SUPER_ADMIN,
      userRole.PATIENT,
      userRole.DOCTOR
    ),
    authController.changePassword
  )
  .post('/forgot-password', authController.forgotPassword)
  .post('/reset-password', authController.resetPassord);

export const AuthRoutes = router;

import express from 'express';
import { appointmentController } from './appointment.controller';
import { auth } from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/my-appointment',
  auth(userRole.PATIENT, userRole.DOCTOR),
  appointmentController.getMyAppointment
);
router.post(
  '/',
  auth(userRole.PATIENT),
  appointmentController.CreateAnAppointment
);

export const AppointmentRoutes = router;

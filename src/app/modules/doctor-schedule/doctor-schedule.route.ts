import express from 'express';
import { doctorScheduleController } from './doctor-schedule.controller';
import { auth } from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();
router
  .get(
    '/my-schedule',
    auth(userRole.DOCTOR),
    doctorScheduleController.getMySchedule
  )
  .delete(
    '/:id',
    auth(userRole.DOCTOR),
    doctorScheduleController.deleteDocSchedule
  )
  .post(
    '/',
    auth(userRole.DOCTOR),
    doctorScheduleController.createDoctorSchedule
  );

export const DoctorScheduleRouter = router;

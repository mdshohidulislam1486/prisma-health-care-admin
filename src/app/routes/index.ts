import express from 'express';
import { userRoutes } from '../modules/user/usre.route';
import { adminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { SpecilitiesRoutes } from '../modules/specitilites/specitilities.routes';
import { doctorRoutes } from '../modules/doctor/doctor.route';
import { PatientRouter } from '../modules/patient/patient.routes';
import { ScheduleRouter } from '../modules/schedule/schedule.routes';
import { DoctorScheduleRouter } from '../modules/doctor-schedule/doctor-schedule.route';

const router = express.Router();

const modueRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/specilities',
    route: SpecilitiesRoutes,
  },
  {
    path: '/doctor',
    route: doctorRoutes,
  },
  {
    path: '/patient',
    route: PatientRouter,
  },
  {
    path: '/schedule',
    route: ScheduleRouter,
  },
  {
    path: '/doctor-schedule',
    route: DoctorScheduleRouter,
  },
];

modueRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

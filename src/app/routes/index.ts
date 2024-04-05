import express from 'express';
import { userRoutes } from '../modules/user/usre.route';
import { adminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { SpecilitiesRoutes } from '../modules/specitilites/specitilities.routes';

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
];

modueRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

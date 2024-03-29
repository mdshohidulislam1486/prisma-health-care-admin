import express from 'express';
import { userRoutes } from '../modules/user/usre.route';
import { adminRoutes } from '../modules/admin/admin.routes';
import { AuthRoutes } from '../modules/auth/auth.route';

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
];

modueRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

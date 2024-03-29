import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../../helpers/jwt-helpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../errors/apiError';
import httpStatus from 'http-status';

export const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      const varifiedUser = verifyToken(token, config.jwt.jst_secret as Secret);
      req.user = varifiedUser;
      if (roles.length > 0 && !roles.includes(varifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

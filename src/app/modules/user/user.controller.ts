import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import * as bcrypt from 'bcrypt';
import { sendResponse } from '../../../helpers/send-response';
import httpStatus from 'http-status';

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const result = await userService.createAdmin(req);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
};

const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.createDoctor(req);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Doctor created successfully',
    data: result,
  });
};

export const userController = {
  createAdmin,
  createDoctor,
};

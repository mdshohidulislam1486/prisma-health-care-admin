import { NextFunction, Request, RequestHandler, Response } from 'express';
import { userService } from './user.service';
import * as bcrypt from 'bcrypt';
import { sendResponse } from '../../../helpers/send-response';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { userFilterableFields } from './user.constant';
import { TAuthUser } from '../../interfaces/common';

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
const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.createPatient(req);
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Patient created successfully',
    data: result,
  });
};

const getAllusers = catchAsync(async (req: Request, res: Response) => {
  const fitlers = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await userService.getAllUserFromDB(fitlers, options);
  sendResponse(res, {
    statsuCode: 200,
    success: true,
    message: 'Users retrieved Successfully ',
    data: result.data,
    meta: result.meta,
  });
});

const changeProfileStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.changeUserProfileStatus(id, req.body);
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'User Profile status changed',
    data: result,
  });
};

const getmyProfile = async (
  req: Request & { user?: TAuthUser },
  res: Response
) => {
  const user = req.user;

  const result = await userService.getMyProfile(user as TAuthUser);
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Profile data found ',
    data: result,
  });
};

const updateMyProfile = async (
  req: Request & { user?: TAuthUser },
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const result = await userService.updateMyProfile(user as TAuthUser, req);
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Profile data updated ',
    data: result,
  });
};
export const userController = {
  createAdmin,
  createPatient,
  createDoctor,
  getAllusers,
  changeProfileStatus,
  getmyProfile,
  updateMyProfile,
};

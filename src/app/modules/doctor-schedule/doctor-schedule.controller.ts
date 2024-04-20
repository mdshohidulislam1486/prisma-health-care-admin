import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../../helpers/send-response';
import { doctorScheduleService } from './doctor-schedule.service';
import httpStatus from 'http-status';
import ApiError from '../../errors/apiError';
import { verifyToken } from '../../../helpers/jwt-helpers';
import { TAuthUser } from '../../interfaces/common';
import { pick } from '../../../shared/pick';

const createDoctorSchedule = async (
  req: Request & { user?: TAuthUser },
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return;
  const paylod = req.body;
  const result = await doctorScheduleService.createDoctorSchedule(user, paylod);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Doctor schedule created successfully',
    data: result,
  });
};
const getMySchedule = async (
  req: Request & { user?: TAuthUser },
  res: Response
) => {
  const paylod = req.body;
  const user = req.user;
  const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await doctorScheduleService.getMySchedule(
    filters,
    options,
    user as TAuthUser
  );
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'My Schedule fetched successfully',
    data: result,
  });
};

const deleteDocSchedule = async (
  req: Request & { user?: TAuthUser },
  res: Response
) => {
  const user = req.user;
  const { id } = req.params;
  const result = await doctorScheduleService.deleteDocSchedule(
    user as TAuthUser,
    id
  );
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'My Schedule deleted successfully',
    data: result,
  });
};

export const doctorScheduleController = {
  createDoctorSchedule,
  getMySchedule,
  deleteDocSchedule,
};

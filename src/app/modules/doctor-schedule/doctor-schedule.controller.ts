import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../../helpers/send-response';
import { doctorScheduleService } from './doctor-schedule.service';
import httpStatus from 'http-status';
import ApiError from '../../errors/apiError';
import { verifyToken } from '../../../helpers/jwt-helpers';
import { TAuthUser } from '../../interfaces/common';

const createDoctorSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const paylod = req.body;
  const result = await doctorScheduleService.createDoctorSchedule(user, paylod);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Doctor schedule created successfully',
    data: result,
  });
};

export const doctorScheduleController = {
  createDoctorSchedule,
};

import { NextFunction, Request, Response } from 'express';
import { scheduleService } from './schedule.service';
import { sendResponse } from '../../../helpers/send-response';
import httpStatus from 'http-status';
import { pick } from '../../../shared/pick';
import { TAuthUser } from '../../interfaces/common';
import { doctorScheduleService } from '../doctor-schedule/doctor-schedule.service';

const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paylod = req.body;
  const result = await scheduleService.createSchedule(paylod);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Schedule created successfully',
    data: result,
  });
};

const getAllSchedule = async (
  req: Request & { user?: TAuthUser },
  res: Response
) => {
  const paylod = req.body;
  const user = req.user;
  const filters = pick(req.query, ['startDate', 'endDate']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await scheduleService.getAllSchedule(
    filters,
    options,
    user as TAuthUser
  );
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Schedule fetched successfully',
    data: result,
  });
};

export const scheduleController = {
  createSchedule,
  getAllSchedule,
};

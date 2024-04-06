import { NextFunction, Request, Response } from 'express';
import { scheduleService } from './schedule.service';
import { sendResponse } from '../../../helpers/send-response';
import httpStatus from 'http-status';

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

export const scheduleController = { createSchedule };

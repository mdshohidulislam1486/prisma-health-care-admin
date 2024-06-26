import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../../helpers/send-response';
import httpStatus from 'http-status';
import { doctorService } from './doctor.service';
import { TAuthUser } from '../../interfaces/common';
import { pick } from '../../../shared/pick';
import { doctorScheduleService } from '../doctor-schedule/doctor-schedule.service';

const updateSingleDoctr = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const paylod = req.body;
  const result = await doctorService.updateSingleDoctr(id, paylod);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Doctor updated successfully',
    data: result,
  });
};

export const doctroController = {
  updateSingleDoctr,
};

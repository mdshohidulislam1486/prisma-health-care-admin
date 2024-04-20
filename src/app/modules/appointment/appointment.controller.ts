import { NextFunction, Request, Response } from 'express';
import { appointmentService } from './appointment.service';
import httpStatus from 'http-status';
import { sendResponse } from '../../../helpers/send-response';
import { TAuthUser } from '../../interfaces/common';
import ApiError from '../../errors/apiError';
import { pick } from '../../../shared/pick';

const CreateAnAppointment = async (
  req: Request & { user?: TAuthUser },
  res: Response
) => {
  const user = req.user;
  if (!user)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'you are not authorized');
  const payload = req.body;
  const result = await appointmentService.CreateAnAppointment(
    user as TAuthUser,
    payload
  );

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Appointment Created',
    data: result,
  });
};

const getMyAppointment = async (
  req: Request & { user?: TAuthUser },
  res: Response
) => {
  const user = req.user;
  const fitler = pick(req.query, ['paymentStatus', 'status']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await appointmentService.getMyAppointment(
    user as TAuthUser,
    fitler,
    options
  );
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Get my appointment',
    data: result,
  });
};

export const appointmentController = {
  CreateAnAppointment,
  getMyAppointment,
};

import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/send-response';
import { paymentService } from './payment.service';
import httpStatus from 'http-status';

const initPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await paymentService.initPayment(id);
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated',
    data: result,
  });
};

const validatePayment = async (req: Request, res: Response) => {
  const payload = req.query;
  const result = await paymentService.validatePayment(payload);
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Payment initiated',
    data: result,
  });
};

export const paymentController = {
  initPayment,
  validatePayment,
};

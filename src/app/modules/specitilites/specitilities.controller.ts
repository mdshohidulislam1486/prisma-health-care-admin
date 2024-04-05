import { Request, Response } from 'express';
import { sendResponse } from '../../../helpers/send-response';
import { catchAsync } from '../../../shared/catchAsync';
import { specilitiesService } from './specitilities.service';

const createASpecility = catchAsync(async (req: Request, res: Response) => {
  const result = await specilitiesService.createASpecility(req);
  sendResponse(res, {
    statsuCode: 200,
    success: true,
    message: 'Specilities created successfully ',
    data: result,
  });
});

export const specilitesController = {
  createASpecility,
};

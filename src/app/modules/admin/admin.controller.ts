import { NextFunction, Request, RequestHandler, Response } from 'express';
import { adminServices } from './admin.service';
import { pick } from '../../../shared/pick';
import { aminFilterFields } from './admin.constant';
import { sendResponse } from '../../../helpers/send-response';
import { catchAsync } from '../../../shared/catchAsync';

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const fitlers = pick(req.query, aminFilterFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await adminServices.getAllAdminFromDB(fitlers, options);
  sendResponse(res, {
    statsuCode: 200,
    success: true,
    message: 'Admin retrieved Successfully ',
    data: result.data,
    meta: result.meta,
  });
});

const getByIdFromDb = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminServices.getByIdFromDB(id);
  res.status(200).json({
    success: true,
    message: 'Single Admin found ',
    data: result,
  });
});

const uddateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminServices.updateIntoDB(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Single Admin updated ',
    data: result,
  });
});

const deleteAdminFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await adminServices.deleteFromDB(id);
    res.status(200).json({
      success: true,
      message: 'Single Admin deleted ',
      data: result,
    });
  }
);

const softDeleteFromDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await adminServices.softDeleteFromDB(id);
    res.status(200).json({
      success: true,
      message: 'Single Admin deleted ',
      data: result,
    });
  }
);

export const AdminController = {
  getAllAdmin,
  getByIdFromDb,
  deleteAdminFromDB,
  uddateIntoDB,
  softDeleteFromDB,
};

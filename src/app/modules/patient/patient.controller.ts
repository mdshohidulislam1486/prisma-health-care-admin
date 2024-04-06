import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../../helpers/send-response';
import { patientService } from './patient.service';
import httpStatus from 'http-status';

const updateSinglePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const paylod = req.body;
  const result = await patientService.updateSinglePtient(id, paylod);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Patient updated successfully',
    data: result,
  });
};

const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const paylod = req.body;
  const result = await patientService.deletePatient(id);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Patient deleted successfully',
    data: result,
  });
};
export const patientController = {
  updateSinglePatient,
  deletePatient,
};

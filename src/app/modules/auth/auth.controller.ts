import httpStatus from 'http-status';
import { sendResponse } from '../../../helpers/send-response';
import { catchAsync } from '../../../shared/catchAsync';
import { authServices } from './auth.service';
import { Request, Response } from 'express';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  console.log({ result });
  const { refreshToken, accessToken, needPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Logged in Successfully',
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const validateAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = await req.cookies;

  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Access token updated successfully',
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const paylod = req.body;
    const result = await authServices.changePassword(user, paylod);

    sendResponse(res, {
      statsuCode: httpStatus.OK,
      success: true,
      message: 'Password changed successfully',
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const paylod = req.body;
  const result = await authServices.forgetPassowrd(paylod);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Reset password token',
    data: result.resetToken,
  });
});

const resetPassord = catchAsync(async (req: Request, res: Response) => {
  const paylod = req.body;
  const token = req.headers.authorization || '';
  const result = await authServices.resetPassword(token, paylod);

  sendResponse(res, {
    statsuCode: httpStatus.OK,
    success: true,
    message: 'Password is changed',
    data: null,
  });
});

export const authController = {
  loginUser,
  validateAccessToken,
  changePassword,
  forgotPassword,
  resetPassord,
};

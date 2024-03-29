import { userRole, userStatus } from '@prisma/client';
import { generateToken, verifyToken } from '../../../helpers/jwt-helpers';
import { prisma } from '../../../shared/prisma';
import * as bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { emailSender } from './emailSender';
import ApiError from '../../errors/apiError';
import httpStatus from 'http-status';

const loginUser = async (paylod: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: paylod.email,
      status: userStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    paylod.password,
    userData.password
  );
  if (!isCorrectPassword) throw new Error('Password is incorrect');

  const tokenData = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = generateToken(
    tokenData,
    config.jwt.jst_secret as string,
    config.jwt.expire_in as string
  );
  const refreshToken = generateToken(
    tokenData,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expire as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, config.jwt.refresh_token_secret as string);
  } catch (error) {
    throw new Error('You are not authorized');
  }
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: userStatus.ACTIVE,
    },
  });

  const tokenData = {
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    tokenData,
    config.jwt.jst_secret as string,
    config.jwt.expire_in as string
  );
  return {
    accessToken,
    needPasswordChange: isUserExist.needPasswordChange,
  };
};

const changePassword = async (
  user: any,
  paylod: { newPassword: string; oldPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: userStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    paylod.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) throw new Error('Password is incorrect');
  console.log({ config });
  const hashPassword: string = await bcrypt.hash(
    paylod.newPassword,
    Number(config.salt_round) as number
  );
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: 'Password changed successfully',
  };
};

const forgetPassowrd = async (paylod: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: paylod.email,
      status: userStatus.ACTIVE,
    },
  });
  const tokenData = {
    email: userData.email,
    role: userData.role,
  };
  const resetToken = generateToken(
    tokenData,
    config.reset_pass_token as string,
    config.rest_pass_expire as string
  );
  const resetPassLink =
    config.reset_pass_link +
    `/forgot-password?email=${userData.email}&token=${resetToken}`;

  const html = `
  <div>
    <p> Dear User</p>
    <p> Your password reset link is given below</p>
    <a href=${resetPassLink}>
    <button>Reset Password</button>
    </a>
  </div>`;
  await emailSender(userData.email, html);
  return { resetToken };
};

const resetPassword = async (
  token: string,
  paylod: { email: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: paylod.email,
      status: userStatus.ACTIVE,
    },
  });
  const isValidToken = verifyToken(token, config.reset_pass_token as Secret);
  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are forbidden');
  }
  const hashPassword: string = await bcrypt.hash(
    paylod.password,
    Number(config.salt_round) as number
  );
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data:{
      password:hashPassword
    }
  });
};
export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassowrd,
  resetPassword,
};

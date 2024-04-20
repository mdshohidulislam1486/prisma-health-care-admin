// const SSLCommerzPayment = require('sslcommerz-lts');
import axios from 'axios';
import config from '../../../config';
import { prisma } from '../../../shared/prisma';
import { sslService } from '../ssl/ssl.service';
import ApiError from '../../errors/apiError';
import httpStatus from 'http-status';
import { PaymentStatus } from '@prisma/client';

const initPayment = async (id: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointtmentId: id,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const initPaymentData = {
    transactionId: paymentData.transactionId,
    amount: paymentData.amount,
    appointtmentId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    phoneNumber: paymentData.appointment.patient.contactNumber,
  };
  const result = await sslService.initPayment(initPaymentData);
  console.log({ result });
  return { paymentUrl: result.GatewayPageURL };
};

const validatePayment = async (payload: any) => {
  if (!payload || !payload.status || !(payload.status === 'VALID')) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Not valid');
  }

  const response = await sslService.validatePayment(payload);
  if (response?.status !== 'VALID') {
    return {
      message: 'Payment failed',
    };
  }

  await prisma.$transaction(async (tx) => {
    const updatedPaymentdata = await tx.payment.update({
      where: {
        transactionId: response?.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });
    await tx.appointment.update({
      where: {
        id: updatedPaymentdata.appointtmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return {
    message: 'Payment success',
  };
};
export const paymentService = {
  initPayment,
  validatePayment,
};

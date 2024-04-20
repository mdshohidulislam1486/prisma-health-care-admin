import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();

router
  .post('/init-payment/:id', paymentController.initPayment)
  .get('/ipn', paymentController.validatePayment);

export const PaymentRouts = router;

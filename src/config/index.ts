import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  salt_round: process.env.SOLT_ROUND,
  reset_pass_token: process.env.RESET_PASS_TOKEN,
  rest_pass_expire: process.env.RESET_TOKEN_EXPIRESIN,
  reset_pass_link: process.env.RESET_PASS_LINK,
  email: process.env.EMAIL,
  app_pass: process.env.APP_PASS,
  jwt: {
    jst_secret: process.env.JST_SECRET,
    expire_in: process.env.EXPIRE_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRESIN,
  },
  ssl: {
    storeId: process.env.STORE_ID,
    storePass: process.env.STORE_PASSWD,
    successUrl: process.env.SUCCESS_URL,
    cancelUrl: process.env.CANCEL_URL,
    failUrl: process.env.FIALED_URL,
    sslPaymentApi: process.env.SSL_PAYMENT_API,
    sslValidationApi: process.env.SSL_VALIDATION_API,
  },
};

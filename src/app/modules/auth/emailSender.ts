import nodemailer from 'nodemailer';
import config from '../../../config';

export const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.email,
      pass: config.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"PH Health care 👻" <mdshohidulislam1486@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Reset Password Link', // Subject line
    // text: 'Hello world?', // plain text body
    html,
  });

  console.log('Message sent: %s', info.messageId);
};

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
 
  async sendOTPEmail(toEmail: string, otp: number): Promise<any> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mailt6486@gmail.com',
          pass: process.env.APP_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: 'ARCADE <mailt6486@gmail.com>',
        to: toEmail,
        subject: 'Verification Code',
        html: `
          <p>This OTP is valid for a limited duration.</p>
  
          <p>Email: ${toEmail}</p>
          <p>OTP: ${otp}</p>
  
          <p>Thank you for your cooperation.</p>
        `,
      });

      console.log('Email sent successfully:', info.messageId);
      return otp;
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

}

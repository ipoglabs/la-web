import nodemailer from 'nodemailer';

export const sendEmailOTP = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify your Email - OTP',
    html: `<h2>Your OTP is <strong>${otp}</strong></h2>`,
  });
};

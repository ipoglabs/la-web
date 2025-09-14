import nodemailer from 'nodemailer';

export async function sendEmailOtp(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Email Verification',
    html: `<p>Your verification code is:</p><h2>${otp}</h2><p>This code will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

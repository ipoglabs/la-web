import nodemailer from "nodemailer";

export async function sendEmailOtp(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Email Verification",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Lokalads Verification Code</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
  .container { background-color: #ffffff; max-width: 480px; margin: 40px auto; padding: 24px 28px; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .header { display: flex; align-items: center; padding-bottom: 12px; margin-bottom: 22px; }
  .message { color: #333; font-size: 18px; line-height: 1.4; }
  .code { background: #f2f3f5; border-left: 4px solid #ff3366; padding: 10px 16px; font-size: 32px; font-weight: bold; color: #000; margin: 18px 0; letter-spacing: 2px; }
  .footer { margin-top: 28px; font-size: 16px; color: #777; border-top: 1px solid #d1d1d1; padding-top: 12px; line-height: 1.4; }
</style>
</head>

<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_DOMAIN}/la-logo-symbol-color.svg" alt="Lokalads Logo" style="width: 52px; height: 52px" />
      <img src="${process.env.NEXT_PUBLIC_DOMAIN}/la-text-black.svg" alt="Lokalads Text" style="width: 140px; height: auto; margin-left: 8px" />
    </div>

    <p class="message">
      Use this one-time passcode (OTP) to verify your email address for your Lokalads account.
    </p>

    <div class="code">${otp}</div>

    <p>This code will expire in 10 minutes.</p>

    <div class="footer">
      Please do not reply to this email — it's an automatic message.<br />
      © 2025 lokalads.com — All rights reserved.
    </div>
  </div>
</body>
</html>
`,
  };

  await transporter.sendMail(mailOptions);
}

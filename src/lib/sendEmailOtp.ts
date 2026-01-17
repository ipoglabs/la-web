// lib/sendEmailOtp.ts
import { getMailer, verifyMailerOnce } from "@/lib/mailer";

const EMAIL_USER = process.env.EMAIL_USER!;

function withTimeout<T>(p: Promise<T>, ms: number, label = "timeout"): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} after ${ms}ms`)), ms)
    ),
  ]);
}

export async function sendEmailOtp(email: string, otp: string) {
  // ✅ verify once (optional but helpful)
  await verifyMailerOnce();

  const transporter = getMailer();

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Your OTP for Email Verification",
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lokalads Verification Code</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f8f8f8;font-family:Arial,Helvetica,sans-serif;">
    <table style="border:0;width:100%;border-collapse:collapse;background-color:white;">
      <tr>
        <td style="border:0;padding:20px 20px 14px 20px;">
          <img src="https://www.lokalads.com/la-logo.png" style="width:190px;height:auto" />
        </td>
      </tr>
      <tr>
        <td style="border:0;padding:4px 20px 0 20px;">
          <p style="font-size:18px;color:#333;line-height:1.55;margin:0 0 18px 0;">
            Use this one-time passcode (OTP) to verify your email address for your lokalads account.
          </p>
          <p style="background-color:#f2f3f5;border-left:6px solid #ff3366;padding:14px 18px;font-size:32px;font-weight:bold;margin:0 0 8px 0;">
            ${otp}
          </p>
          <p style="font-size:16px;color:#777;font-style:italic;margin:0 0 16px 0;">
            For your security, do not share this code with anyone.
          </p>
          <p style="font-size:18px;color:#555;margin:0 0 18px 0;">
            This code will expire in <b>10 minutes</b>.
          </p>
          <hr style="border:none;border-top:1px solid #d1d1d1;margin:0;" />
        </td>
      </tr>
      <tr>
        <td style="border:none;padding:14px 20px;font-size:16px;color:#777;">
          <p style="margin:0 0 8px 0;">Please do not reply to this email – it’s an automatic message from an unmonitored account.</p>
          <p style="margin:0;">© 2025 lokalads.com – All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };

  // ✅ sendMail should finish fast (SMTP accepted). Delivery can still be delayed by Gmail.
  // ✅ add timeout so API doesn't hang
  const info = await withTimeout(transporter.sendMail(mailOptions), 15_000, "sendMail");
  return info; // info.messageId etc (optional)
}

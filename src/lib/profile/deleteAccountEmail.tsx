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

export async function sendDeleteAccountEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  await verifyMailerOnce();

  const transporter = getMailer();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const mailOptions = {
    from: EMAIL_USER,
    to: data.email,
    subject: "Your Account Has Been Deleted",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Account Deleted</title>
</head>

<body style="margin:0;padding:0;background-color:#f8f8f8;font-family:Arial,Helvetica,sans-serif;">
  <table style="width:100%;border-collapse:collapse;background-color:white;">
    
    <!-- Header -->
    <tr>
      <td style="padding:20px;">
        <img src="https://www.lokalads.com/la-logo.png" style="width:190px;height:auto" />
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding:10px 20px;">
        <p style="font-size:18px;color:#333;">
          Hi <b>${data.firstName} ${data.lastName}</b>,
        </p>

        <p style="font-size:16px;color:#555;">
          Your Lokalads account has been successfully deleted.
        </p>

        <p style="font-size:15px;color:#555;">
          We’re sorry to see you go and apologize for any inconvenience caused.
        </p>

        <p style="font-size:15px;color:#555;">
          If this was not you, please contact our support team immediately.
        </p>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:20px;">
        <a href="${appUrl}/"
          style="display:inline-block;background:#2563eb;color:white;padding:12px 18px;
          text-decoration:none;border-radius:6px;">
          Visit Lokalads
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:14px 20px;font-size:14px;color:#777;">
        <hr style="border:none;border-top:1px solid #ddd;" />
        <p>Please do not reply to this email – it’s an automated message.</p>
        <p>© 2026 Lokalads.com – All rights reserved.</p>
      </td>
    </tr>

  </table>
</body>
</html>`,
  };

  return await withTimeout(
    transporter.sendMail(mailOptions),
    15000,
    "sendMail"
  );
}
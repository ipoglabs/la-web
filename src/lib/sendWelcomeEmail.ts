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

export async function sendWelcomeEmail(data: {
  fullName: string;
  email: string;
  phone: string;
}) {
  await verifyMailerOnce();

  const transporter = getMailer();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const mailOptions = {
    from: EMAIL_USER,
    to: data.email,
    subject: "Welcome to Lokalads 🎉",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Lokalads</title>
</head>

<body style="margin:0;padding:0;background-color:#f8f8f8;font-family:Arial,Helvetica,sans-serif;">
  <table style="width:100%;border-collapse:collapse;background-color:white;">
    
    <!-- Header -->
    <tr>
      <td style="padding:20px;">
        <img src="https://www.lokalads.com/la-logo.png" style="width:190px;height:auto" />
      </td>
    </tr>

    <!-- Greeting -->
    <tr>
      <td style="padding:10px 20px;">
        <p style="font-size:18px;color:#333;margin:0 0 10px 0;">
          Hi <b>${data.fullName}</b>,
        </p>

        <p style="font-size:16px;color:#555;margin:0 0 15px 0;">
          🎉 Your Lokalads account has been successfully created!
        </p>

        <p style="font-size:15px;color:#555;margin:0 0 10px 0;">
          <b>Email:</b> ${data.email}<br/>
          <b>Phone:</b> ${data.phone}
        </p>
      </td>
    </tr>

    <!-- CTA Buttons -->
    <tr>
      <td style="padding:20px;">
        
        <a href="${appUrl}/post/select-category"
          style="display:inline-block;background:#2563eb;color:white;padding:12px 18px;
          text-decoration:none;border-radius:6px;margin-right:10px;">
          Post an Ad
        </a>

        <a href="${appUrl}/profile"
          style="display:inline-block;background:#16a34a;color:white;padding:12px 18px;
          text-decoration:none;border-radius:6px;margin-right:10px;">
          Update Profile
        </a>

        <a href="${appUrl}/"
          style="display:inline-block;background:#f59e0b;color:white;padding:12px 18px;
          text-decoration:none;border-radius:6px;">
          Search Ads
        </a>

      </td>
    </tr>

    <!-- Links -->
    <tr>
      <td style="padding:10px 20px;">
        <p style="font-size:14px;color:#555;">
          <a href="${appUrl}">Landing Page</a> |
          <a href="${appUrl}/privacy-policy">Privacy Policy</a> |
          <a href="${appUrl}/conditions">Terms & Conditions</a>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:14px 20px;font-size:14px;color:#777;">
        <hr style="border:none;border-top:1px solid #ddd;" />
        <p>Please do not reply to this email – it’s an automated message.</p>
        <p>© 2025 Lokalads.com – All rights reserved.</p>
      </td>
    </tr>

  </table>
</body>
</html>`,
  };

  const info = await withTimeout(
    transporter.sendMail(mailOptions),
    15000,
    "sendMail"
  );

  return info;
}
import { getMailer, verifyMailerOnce } from "@/lib/mailer";

const FROM = process.env.EMAIL_USER!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://lokalads.vercel.app";

export async function sendMessageNotificationEmail({
  toEmail,
  toName,
  senderName,
  messagePreview,
}: {
  toEmail:        string;
  toName:         string;
  senderName:     string;
  messagePreview: string;
}): Promise<void> {
  await verifyMailerOnce();

  const preview  = messagePreview.length > 120
    ? messagePreview.slice(0, 120) + "…"
    : messagePreview;
  const chatUrl  = `${APP_URL}/chat`;
  const mailer   = getMailer();

  await mailer.sendMail({
    from:    `"Lokalads" <${FROM}>`,
    to:      toEmail,
    subject: `New message from ${senderName} on Lokalads`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New message on Lokalads</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
  <table style="width:100%;border-collapse:collapse;">

    <!-- Header -->
    <tr>
      <td style="background:#0f172a;padding:20px 24px;">
        <img src="${APP_URL}/la-logo.png" style="height:32px;" alt="Lokalads" />
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:32px 24px;background:#ffffff;">
        <p style="font-size:16px;color:#1e293b;margin:0 0 8px 0;">
          Hi <strong>${toName}</strong>,
        </p>
        <p style="font-size:15px;color:#475569;margin:0 0 20px 0;">
          You have a new message from <strong>${senderName}</strong>:
        </p>

        <!-- Message preview -->
        <div style="border-left:4px solid #e2e8f0;background:#f8fafc;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:28px;">
          <p style="font-size:14px;color:#475569;margin:0;font-style:italic;">
            "${preview}"
          </p>
        </div>

        <!-- CTA -->
        <a href="${chatUrl}"
          style="display:inline-block;background:#0f172a;color:#ffffff;font-size:14px;
          font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;">
          Open Chat →
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding:20px 24px;background:#f1f5f9;">
        <p style="font-size:12px;color:#94a3b8;margin:0;">
          You're receiving this because you have a message on
          <a href="${APP_URL}" style="color:#64748b;">Lokalads</a>.
          Please do not reply to this email.
        </p>
        <p style="font-size:12px;color:#94a3b8;margin:8px 0 0 0;">
          © ${new Date().getFullYear()} Lokalads — All rights reserved.
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`,
  });
}

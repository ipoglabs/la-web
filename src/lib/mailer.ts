// lib/mailer.ts
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("EMAIL_USER / EMAIL_PASS not set");
}

declare global {
  // eslint-disable-next-line no-var
  var __mailer: nodemailer.Transporter | undefined;
  var __mailerVerified: boolean | undefined;
}

export function getMailer() {
  if (global.__mailer) return global.__mailer;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // 465 = implicit TLS
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },

    // ✅ reuse connections
    pool: true,
    maxConnections: 2,
    maxMessages: 100,

    // ✅ avoid hanging forever
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  global.__mailer = transporter;
  global.__mailerVerified = false;

  return transporter;
}

/**
 * Optional: verify the transporter once per process.
 * Call this before first send, but NOT on every request.
 */
export async function verifyMailerOnce() {
  const transporter = getMailer();
  if (global.__mailerVerified) return;

  try {
    await transporter.verify();
    global.__mailerVerified = true;
  } catch (e) {
    // don’t crash app on verify; sendMail will still give real error later
    console.error("Mailer verify failed:", e);
  }
}

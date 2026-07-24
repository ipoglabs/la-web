// ── Email Engine — Provider ───────────────────────────────────────────────────
// Thin wrapper around the email sending provider (Nodemailer + Gmail SMTP).
// This is the ONLY file that knows about Nodemailer/Gmail. Swap this file to change provider.
// All other engine files are provider-agnostic.
//
// To migrate to a different provider (e.g. Resend, Cloudflare Email Workers):
//   1. Replace the transporter/client below with the new provider's client
//   2. Adapt sendViaProvider() to match the new provider's send API shape
//   3. Zero changes needed in index.ts, renderer.ts, or any caller

import nodemailer, { type Transporter } from "nodemailer";
import type { EmailRenderResult, EmailSendResult } from "./types";

// ── Email format guard (task 2b) ─────────────────────────────────────────────
// Basic runtime check before we touch the provider.
// Catches obvious mistakes (empty string, missing @) without a heavy validation lib.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// ── Gmail SMTP transporter ────────────────────────────────────────────────────
// Lazily initialised — only created when first email is sent.
// Throws clearly if EMAIL_USER / EMAIL_PASS are missing rather than silently failing.
//
// TODO(dev — before first real send):
//   1. Turn on 2-Step Verification on the Gmail account you're sending from
//   2. Create an App Password: https://myaccount.google.com/apppasswords
//      (a regular Gmail password will NOT work here — Google blocks it)
//   3. Add to .env.local:
//        EMAIL_USER=youraddress@gmail.com
//        EMAIL_PASS=your16charapppassword   (no spaces)
//   4. Optionally add EMAIL_FROM if you want the "From" display name/address
//      to differ from EMAIL_USER, e.g. EMAIL_FROM="Lokalads <youraddress@gmail.com>"
let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!_transporter) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      throw new Error(
        "[EmailEngine] EMAIL_USER / EMAIL_PASS is not set. Add them to .env.local to send emails."
      );
    }

    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return _transporter;
}

// ── Send function ─────────────────────────────────────────────────────────────

export async function sendViaProvider(
  to: string,
  render: EmailRenderResult
): Promise<EmailSendResult> {
  // Runtime email format guard
  if (!isValidEmail(to)) {
    return { success: false, error: `Invalid recipient address: "${to}"` };
  }

  const from = process.env.EMAIL_FROM ?? process.env.EMAIL_USER ?? "no-reply@lokalads.com";

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from,
      to,
      subject: render.subject,
      html: render.html,
      text: render.text,
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown provider error";
    return { success: false, error: message };
  }
}
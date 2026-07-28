// ── Email Engine — Provider ───────────────────────────────────────────────────
// Thin wrapper around the email sending provider (Resend).
// This is the ONLY file that knows about Resend. Swap this file to change provider.
// All other engine files are provider-agnostic.
//
// Domain must be verified in Resend before sends succeed — see the DNS records
// (DKIM + SPF) added for lokalads.com. RESEND_API_KEY / RESEND_EMAIL_DOMAIN are
// set by the Vercel Marketplace Resend integration (`vercel env pull`).

import { Resend } from "resend";
import type { EmailRenderResult, EmailSendResult } from "./types";

// ── Email format guard (task 2b) ─────────────────────────────────────────────
// Basic runtime check before we touch the provider.
// Catches obvious mistakes (empty string, missing @) without a heavy validation lib.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// ── Resend client ─────────────────────────────────────────────────────────────
// Lazily initialised — only created when first email is sent.
let _client: Resend | null = null;

function getClient(): Resend {
  if (!_client) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error(
        "[EmailEngine] RESEND_API_KEY is not set. Run `vercel env pull` or add it to .env.local."
      );
    }

    _client = new Resend(apiKey);
  }
  return _client;
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

  const from = process.env.EMAIL_FROM ?? "no-reply@lokalads.com";

  try {
    const { error } = await getClient().emails.send({
      from,
      to,
      subject: render.subject,
      html: render.html,
      text: render.text,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown provider error";
    return { success: false, error: message };
  }
}

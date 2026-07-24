// ── Email Engine — Public API ─────────────────────────────────────────────────
// The ONLY file any caller in the app ever imports from.
// One function. One contract. Everything else is internal.
//
// Usage (from any app/api/ route handler only — never from components/pages):
//
//   import { sendEmail } from "@/lib/email";
//
//   const result = await sendEmail({
//     type: "OTP",
//     to: "user@example.com",
//     data: { code: "847291", expiresInMinutes: 10, purpose: "login" },
//   });
//
//   if (!result.success) {
//     console.error("[email]", result.error);
//   }

import { renderEmail } from "./renderer";
import { sendViaProvider } from "./provider";
import type { EmailEvent, EmailSendResult } from "./types";

// ── HOW TO WIRE UP ────────────────────────────────────────────────────────────
// TODO(dev): Call sendEmail() from an app/api/ route handler — NEVER from a
// page or component. Example — triggering an OTP email:
//
//   // app/api/auth/otp/route.ts
//   import { sendEmail } from "@/lib/email";
//
//   export async function POST(request: Request) {
//     const { email } = await request.json();
//     // ... generate OTP code, store in DB ...
//     const result = await sendEmail({
//       type: "OTP",
//       to: email,
//       data: { code, expiresInMinutes: 10, purpose: "login" },
//     });
//     if (!result.success) {
//       return Response.json({ error: "Email delivery failed" }, { status: 500 });
//     }
//     return Response.json({ ok: true });
//   }
//
// All 28 event types follow the same pattern — TypeScript enforces the correct
// data shape per type at compile time. Wrong shape = build error, not runtime.
// ─────────────────────────────────────────────────────────────────────────────

export async function sendEmail(event: EmailEvent): Promise<EmailSendResult> {
  try {
    const rendered = renderEmail(event);
    return await sendViaProvider(event.to, rendered);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error in email engine";
    // Log server-side — never expose internals to client
    console.error("[EmailEngine] Unhandled error:", message);
    return { success: false, error: message };
  }
}

// Re-export types for callers that need them (e.g. tests, API route type hints)
export type { EmailEvent, EmailSendResult } from "./types";

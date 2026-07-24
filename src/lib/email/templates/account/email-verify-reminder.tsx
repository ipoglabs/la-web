// ── Email Verify Reminder Template ───────────────────────────────────────────
// Sent ~24 h after sign-up if the user hasn't verified their email address yet.
// A single gentle nudge — not spammy. Keeps the OTP out of this email;
// the user must click the CTA to get a fresh OTP sent to them.
// Plain text fallback: emailVerifyReminderText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type EmailVerifyReminderData = {
  firstName: string;
};

export function EmailVerifyReminderEmail(data: EmailVerifyReminderData): string {
  const benefits = [
    { emoji: "📢", text: "Post listings visible to all buyers" },
    { emoji: "💬", text: "Send and receive messages" },
    { emoji: "🔔", text: "Get instant alert matches" },
    { emoji: "🔒", text: "Recover your account if you ever lose access" },
  ];
  const rows = benefits.map(({ emoji, text }) =>
    `<tr><td style="${s({ fontSize: 16, paddingRight: 10, paddingBottom: 8, verticalAlign: "top", width: 24 })}">${emoji}</td><td style="${s({ fontSize: 14, color: "#475569", paddingBottom: 8, lineHeight: 1.5 })}">${text}</td></tr>`
  ).join("");

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">✉️</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Hi ${esc(data.firstName)}, please verify your email</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">You're almost set up! One small step remaining — verify your email address to unlock everything LokalAds has to offer.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px 8px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 13, fontWeight: 600, color: "#334155", margin: "0 0 10px" })}">Why verify?</p>
  <table cellpadding="0" cellspacing="0" style="width:100%"><tbody>${rows}</tbody></table>
</div>
<div style="${s({ textAlign: "center", marginBottom: 20 })}">
  <a href="${APP_URL}/register/verify-email" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 32px", borderRadius: 8 })}">Verify My Email</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5, textAlign: "center" })}">Clicking the button will send a fresh verification code to this address. Codes expire in 10 minutes.</p>
`;
  return baseEmail(content, `${data.firstName}, one step left — verify your email address.`);
}

export function emailVerifyReminderText(data: EmailVerifyReminderData): string {
  return [
    `Hi ${data.firstName}, please verify your email address`,
    "",
    "You're almost set up! Verify your email to unlock all LokalAds features:",
    "- Post listings",
    "- Send and receive messages",
    "- Get instant alert matches",
    "- Recover your account if needed",
    "",
    `Verify now: ${APP_URL}/register/verify-email`,
    "",
    "A fresh verification code will be sent when you visit that page.",
  ].join("\n");
}

// ── Contact Changed Template ──────────────────────────────────────────────────
// Sent when a user updates their email address or phone number.
// Security notification — always sent to the OLD contact point.
// Plain text fallback: contactChangedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type ContactChangedData = {
  firstName: string;
  field: "email" | "phone";
};

const CONFIG = {
  email: {
    icon: "✉️",
    label: "email address",
    heading: "Your email address has been changed",
    intro:
      "The email address on your LokalAds account was successfully updated. You'll receive future emails at your new address.",
    preview: "Your LokalAds email address has been changed.",
  },
  phone: {
    icon: "📱",
    label: "phone number",
    heading: "Your phone number has been changed",
    intro:
      "The phone number on your LokalAds account was successfully updated. Your new number is now used for verification.",
    preview: "Your LokalAds phone number has been changed.",
  },
} as const;

export function ContactChangedEmail(data: ContactChangedData): string {
  const cfg = CONFIG[data.field];
  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">Hi ${esc(data.firstName)}, ${cfg.intro}</p>
<div style="${s({ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: "#92400e", margin: "0 0 4px" })}">Wasn't you?</p>
  <p style="${s({ fontSize: 14, color: "#92400e", margin: 0, lineHeight: 1.5 })}">If you didn't make this change, secure your account immediately by resetting your password.</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}/login" style="${s({ display: "inline-block", backgroundColor: "#d97706", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Secure My Account</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Need help? Contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a>.</p>
`;
  return baseEmail(content, cfg.preview);
}

export function contactChangedText(data: ContactChangedData): string {
  const cfg = CONFIG[data.field];
  return [
    `Hi ${data.firstName},`,
    "",
    cfg.heading,
    "",
    cfg.intro,
    "",
    "Wasn't you? Reset your password immediately:",
    `${APP_URL}/login`,
  ].join("\n");
}

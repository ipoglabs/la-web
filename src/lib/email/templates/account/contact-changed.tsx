// ── Contact Changed Template ──────────────────────────────────────────────────
// Sent when a user updates their email address or phone number.
// Security notification — always sent to the OLD contact point.
// Plain text fallback: contactChangedText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

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
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">${cfg.icon} ${cfg.heading}</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">Hi ${esc(data.firstName)}, ${cfg.intro}</p>
<div style="${s({ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: "#92400e", margin: "0 0 4px" })}">Wasn't you?</p>
  <p style="${s({ fontSize: 14, color: "#92400e", margin: 0, lineHeight: 1.5 })}">If you didn't make this change, secure your account immediately by resetting your password.</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton("Secure My Account", `${APP_URL}/login`, { bg: "#d97706" })}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">Need help? Contact us at <a href="${APP_URL}/support" style="${s(emailText.link)}">our support page</a>.</p>
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

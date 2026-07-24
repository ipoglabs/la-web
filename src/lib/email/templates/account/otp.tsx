// ── OTP Email Template ────────────────────────────────────────────────────────
// Handles all 4 OTP purposes: login, verify-email, verify-phone, password-reset
// Plain text fallback: otpText()

import { baseEmail, s, esc } from "../_base";

type OtpData = {
  code: string;
  expiresInMinutes: number;
  purpose: "login" | "verify-email" | "verify-phone" | "password-reset";
};

const COPY: Record<OtpData["purpose"], { heading: string; body: string }> = {
  "login": {
    heading: "Your login code",
    body: "Use the code below to sign in to your LokalAds account.",
  },
  "verify-email": {
    heading: "Verify your email address",
    body: "Use the code below to confirm your email address.",
  },
  "verify-phone": {
    heading: "Verify your phone number",
    body: "Use the code below to confirm your phone number.",
  },
  "password-reset": {
    heading: "Reset your password",
    body: "Use the code below to reset your LokalAds password.",
  },
};

export function OtpEmail(data: OtpData): string {
  const { heading, body } = COPY[data.purpose];
  const content = `
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", lineHeight: 1.3 })}">${esc(heading)}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 28px", lineHeight: 1.6 })}">${esc(body)}</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 24px", textAlign: "center", marginBottom: 24 })}">
  <span style="${s({ fontSize: 36, fontWeight: 800, color: "#0f172a", letterSpacing: "0.25em", fontFamily: "monospace" })}">${esc(data.code)}</span>
</div>
<p style="${s({ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 })}">This code expires in <strong>${data.expiresInMinutes}</strong> minutes. Do not share it with anyone.</p>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5, borderLeft: "3px solid #e2e8f0", paddingLeft: 12 })}">If you didn&#39;t request this, you can safely ignore this email. Your account is not at risk.</p>
`;
  return baseEmail(content, `Your code: ${data.code} — expires in ${data.expiresInMinutes} minutes`);
}

export function otpText(data: OtpData): string {
  const { heading, body } = COPY[data.purpose];
  return [
    `LokalAds — ${heading}`,
    "",
    body,
    "",
    `Your code: ${data.code}`,
    "",
    `This code expires in ${data.expiresInMinutes} minutes. Do not share it with anyone.`,
    "",
    "If you didn't request this, you can safely ignore this email.",
  ].join("\n");
}

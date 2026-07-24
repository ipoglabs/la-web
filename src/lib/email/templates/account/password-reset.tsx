// ── Password Reset Email Template ─────────────────────────────────────────────
// Sent when user triggers password reset flow.
// Contains a time-limited reset link — never a plain OTP code.
// Plain text fallback: passwordResetText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type PasswordResetData = {
  resetUrl: string;
  expiresInMinutes: number;
};

export function PasswordResetEmail(data: PasswordResetData): string {
  const content = `
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Reset your password</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 28px", lineHeight: 1.6 })}">We received a request to reset your LokalAds password. Click the button below to choose a new password.</p>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${esc(data.resetUrl)}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Reset Password</a>
</div>
<div style="${s({ backgroundColor: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "12px 16px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: "#92400e", margin: 0, lineHeight: 1.5 })}">&#9888;&#65039; This link expires in <strong>${data.expiresInMinutes}</strong> minutes. After that, you&#39;ll need to request a new one.</p>
</div>
<p style="${s({ fontSize: 13, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 })}">If you didn&#39;t request a password reset, ignore this email. Your password will not change. If you&#39;re concerned about your account security, <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">contact our support team</a>.</p>
<p style="${s({ fontSize: 12, color: "#94a3b8", margin: "0 0 4px", lineHeight: 1.5 })}">If the button doesn&#39;t work, copy and paste this link into your browser:</p>
<p style="${s({ fontSize: 11, color: "#94a3b8", margin: 0, wordBreak: "break-all", lineHeight: 1.4 })}">${esc(data.resetUrl)}</p>
`;
  return baseEmail(content, `Reset your LokalAds password — link expires in ${data.expiresInMinutes} minutes.`);
}

export function passwordResetText(data: PasswordResetData): string {
  return [
    "Reset your LokalAds password",
    "",
    "We received a request to reset your password.",
    "",
    `Reset link (expires in ${data.expiresInMinutes} minutes):`,
    data.resetUrl,
    "",
    "If you didn't request this, ignore this email. Your password will not change.",
    "",
    `Contact support if concerned: ${APP_URL}/support`,
  ].join("\n");
}

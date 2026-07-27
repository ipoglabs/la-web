// ── Password Reset Email Template ─────────────────────────────────────────────
// Sent when user triggers password reset flow.
// Contains a time-limited reset link — never a plain OTP code.
// Plain text fallback: passwordResetText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type PasswordResetData = {
  resetUrl: string;
  expiresInMinutes: number;
};

export function PasswordResetEmail(data: PasswordResetData): string {
  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">Reset your password</h1>
<p style="${s({ ...emailText.body, margin: "0 0 28px" })}">We received a request to reset your LokalAds password. Click the button below to choose a new password.</p>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton("Reset Password", esc(data.resetUrl))}
</div>
<div style="${s({ backgroundColor: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 8, padding: "12px 16px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: "#92400e", margin: 0, lineHeight: 1.5 })}">&#9888;&#65039; This link expires in <strong>${data.expiresInMinutes}</strong> minutes. After that, you&#39;ll need to request a new one.</p>
</div>
<p style="${s({ ...emailText.disclaimer, margin: "0 0 16px" })}">If you didn&#39;t request a password reset, ignore this email. Your password will not change. If you&#39;re concerned about your account security, <a href="${APP_URL}/support" style="${s(emailText.link)}">contact our support team</a>.</p>
<p style="${s({ ...emailText.disclaimer, margin: "0 0 4px" })}">If the button doesn&#39;t work, copy and paste this link into your browser:</p>
<p style="${s({ ...emailText.disclaimer, margin: 0, wordBreak: "break-all" })}">${esc(data.resetUrl)}</p>
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

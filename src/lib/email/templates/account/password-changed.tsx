// ── Password Changed Confirmation Template ────────────────────────────────────
// Sent after user successfully changes their password.
// Security notification — user must know even if they didn't initiate it.
// Plain text fallback: passwordChangedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type PasswordChangedData = {
  firstName: string;
};

export function PasswordChangedEmail(data: PasswordChangedData): string {
  const content = `
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Password changed, ${esc(data.firstName)}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">Your LokalAds password was successfully changed. You can now sign in with your new password.</p>
<div style="${s({ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: "14px 16px", marginBottom: 28 })}">
  <p style="${s({ fontSize: 14, color: "#9f1239", margin: 0, lineHeight: 1.6 })}">&#128274; <strong>Wasn&#39;t you?</strong> If you didn&#39;t change your password, your account may be compromised. Reset your password immediately and contact our support team.</p>
</div>
<table cellpadding="0" cellspacing="0" style="${s({ marginBottom: 28 })}"><tbody><tr>
  <td style="${s({ verticalAlign: "middle" })}"><a href="${APP_URL}/login" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "10px 22px", borderRadius: 8 })}">Sign In</a></td>
  <td style="width:12px"></td>
  <td style="${s({ verticalAlign: "middle" })}"><a href="${APP_URL}/support" style="${s({ display: "inline-block", backgroundColor: "#f1f5f9", color: "#334155", fontSize: 14, fontWeight: 600, textDecoration: "none", padding: "10px 22px", borderRadius: 8, border: "1px solid #e2e8f0" })}">Contact Support</a></td>
</tr></tbody></table>
<p style="${s({ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">This is an automated security notification. Please do not reply to this email.</p>
`;
  return baseEmail(content, "Your LokalAds password has been changed successfully.");
}

export function passwordChangedText(data: PasswordChangedData): string {
  return [
    `Password changed, ${data.firstName}`,
    "",
    "Your LokalAds password was successfully changed.",
    "",
    "Wasn't you? If you didn't change your password, your account may be compromised.",
    "Reset your password immediately and contact support.",
    "",
    `Sign in: ${APP_URL}/login`,
    `Contact support: ${APP_URL}/support`,
    "",
    "This is an automated security notification.",
  ].join("\n");
}

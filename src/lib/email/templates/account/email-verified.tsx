// ── Email Verified Template ───────────────────────────────────────────────────
// Sent after successful email OTP confirmation.
// Plain text fallback: emailVerifiedText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type EmailVerifiedData = {
  firstName: string;
};

export function EmailVerifiedEmail(data: EmailVerifiedData): string {
  const content = `
<div style="${s({ width: 52, height: 52, borderRadius: "50%", backgroundColor: "#dcfce7", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 })}">
  <span style="${s({ fontSize: 24, color: "#16a34a", fontWeight: 700, lineHeight: 1 })}">&#10003;</span>
</div>
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">Email verified, ${esc(data.firstName)}!</h1>
<p style="${s({ ...emailText.body, margin: "0 0 28px" })}">Your email address has been verified. Your account is fully active and you can now access all features of LokalAds.</p>
<div style="${s({ textAlign: "center", marginBottom: 28 })}">
  ${emailButton("Go to LokalAds", APP_URL)}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">If you didn&#39;t verify this email, please <a href="${APP_URL}/support" style="${s(emailText.link)}">contact support</a> immediately.</p>
`;
  return baseEmail(content, "Your email address has been verified successfully.");
}

export function emailVerifiedText(data: EmailVerifiedData): string {
  return [
    `Email verified, ${data.firstName}!`,
    "",
    "Your email address has been verified. Your account is fully active.",
    "",
    `Go to LokalAds: ${APP_URL}`,
    "",
    `If you didn't verify this email, contact support immediately: ${APP_URL}/support`,
  ].join("\n");
}

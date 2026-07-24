// ── Email Verified Template ───────────────────────────────────────────────────
// Sent after successful email OTP confirmation.
// Plain text fallback: emailVerifiedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type EmailVerifiedData = {
  firstName: string;
};

export function EmailVerifiedEmail(data: EmailVerifiedData): string {
  const content = `
<div style="${s({ width: 52, height: 52, borderRadius: "50%", backgroundColor: "#dcfce7", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20 })}">
  <span style="${s({ fontSize: 24, color: "#16a34a", fontWeight: 700, lineHeight: 1 })}">&#10003;</span>
</div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Email verified, ${esc(data.firstName)}!</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 28px", lineHeight: 1.6 })}">Your email address has been verified. Your account is fully active and you can now access all features of LokalAds.</p>
<div style="${s({ textAlign: "center", marginBottom: 28 })}">
  <a href="${APP_URL}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Go to LokalAds</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">If you didn&#39;t verify this email, please <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">contact support</a> immediately.</p>
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

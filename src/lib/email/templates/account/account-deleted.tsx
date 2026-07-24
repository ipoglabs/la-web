// ── Account Deleted Template ──────────────────────────────────────────────────
// Sent after user completes the delete-account journey and account is removed.
// Final communication — no CTAs back into the product except support.
// Plain text fallback: accountDeletedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type AccountDeletedData = {
  firstName: string;
};

export function AccountDeletedEmail(data: AccountDeletedData): string {
  const content = `
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Account deleted, ${esc(data.firstName)}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">Your LokalAds account has been permanently deleted. All your data, listings, and saved information have been removed from our systems.</p>
<div style="${s({ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: "#15803d", margin: 0, lineHeight: 2 })}">&#10003; Your account data has been deleted<br>&#10003; Your listings have been removed<br>&#10003; Your personal information has been erased</p>
</div>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">We&#39;re sorry to see you go. If you ever change your mind, you&#39;re always welcome to create a new account at LokalAds.</p>
<div style="${s({ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: "12px 16px", marginBottom: 20 })}">
  <p style="${s({ fontSize: 14, color: "#9f1239", margin: 0, lineHeight: 1.5 })}"><strong>Didn&#39;t request this?</strong> If you did not delete your account, contact our support team immediately.</p>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}"><a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">Contact Support</a> &middot; <a href="${APP_URL}" style="${s({ color: "#2563eb", textDecoration: "underline" })}">Create a New Account</a></p>
`;
  return baseEmail(content, "Your LokalAds account has been permanently deleted.");
}

export function accountDeletedText(data: AccountDeletedData): string {
  return [
    `Account deleted, ${data.firstName}`,
    "",
    "Your LokalAds account has been permanently deleted.",
    "All your data, listings, and saved information have been removed.",
    "",
    "What was removed:",
    "- Your account data",
    "- Your listings",
    "- Your personal information",
    "",
    "If you didn't request this, contact support immediately.",
    "",
    `Support: ${APP_URL}/support`,
    `Create a new account: ${APP_URL}`,
  ].join("\n");
}

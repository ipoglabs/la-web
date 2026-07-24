// ── Profile Updated Template ──────────────────────────────────────────────────
// Sent when a user saves changes to their profile (display name, bio, avatar etc).
// Plain text fallback: profileUpdatedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type ProfileUpdatedData = {
  firstName: string;
};

export function ProfileUpdatedEmail(data: ProfileUpdatedData): string {
  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">✅</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Profile updated successfully</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">Hi ${esc(data.firstName)}, your LokalAds profile has been updated. Your changes are now visible to other users.</p>
<div style="${s({ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: "#15803d", margin: 0, lineHeight: 1.5 })}">A complete, accurate profile builds trust with buyers and sellers — keep it up to date!</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}/profile" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">View My Profile</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Didn't make this change? <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">Contact support</a> immediately.</p>
`;
  return baseEmail(content, "Your LokalAds profile has been updated.");
}

export function profileUpdatedText(data: ProfileUpdatedData): string {
  return [
    `Hi ${data.firstName},`,
    "",
    "Your LokalAds profile has been updated successfully.",
    "",
    "Your changes are now visible to other users.",
    "",
    `View your profile: ${APP_URL}/profile`,
    "",
    `Didn't make this change? Contact support: ${APP_URL}/support`,
  ].join("\n");
}

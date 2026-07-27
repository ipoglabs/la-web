// ── Profile Updated Template ──────────────────────────────────────────────────
// Sent when a user saves changes to their profile (display name, bio, avatar etc).
// Plain text fallback: profileUpdatedText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type ProfileUpdatedData = {
  firstName: string;
};

export function ProfileUpdatedEmail(data: ProfileUpdatedData): string {
  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">✅ Profile updated successfully</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">Hi ${esc(data.firstName)}, your LokalAds profile has been updated. Your changes are now visible to other users.</p>
<div style="${s({ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: "#15803d", margin: 0, lineHeight: 1.5 })}">A complete, accurate profile builds trust with buyers and sellers — keep it up to date!</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton("View My Profile", `${APP_URL}/profile`)}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">Didn't make this change? <a href="${APP_URL}/support" style="${s(emailText.link)}">Contact support</a> immediately.</p>
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

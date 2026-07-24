// ── Milestone Template ────────────────────────────────────────────────────────
// Covers two milestone / delight moments:
//   first_sale        — seller closes their first deal on LokalAds
//   profile_reminder  — nudge to complete an incomplete profile
// Plain text fallback: milestoneText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type MilestoneData = {
  firstName: string;
  event: "first_sale" | "profile_reminder";
  listingTitle?: string;
  completionPercent?: number;
  profileUrl?: string;
};

export function MilestoneEmail(data: MilestoneData): string {
  if (data.event === "first_sale") {
    const tips = [
      { emoji: "⭐", text: "Ask the buyer to leave a review — it builds your reputation" },
      { emoji: "📸", text: "Post your next listing while you're on a roll" },
      { emoji: "💬", text: "Keep the conversation going — happy buyers come back" },
    ];
    const rows = tips.map(({ emoji, text }) =>
      `<tr><td style="${s({ fontSize: 16, paddingRight: 10, paddingBottom: 10, verticalAlign: "top", width: 24 })}">${emoji}</td><td style="${s({ fontSize: 14, color: "#475569", paddingBottom: 10, lineHeight: 1.5 })}">${text}</td></tr>`
    ).join("");

    const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 40 })}">🎉</span></div>
<h1 style="${s({ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", lineHeight: 1.3 })}">Congratulations on your first sale, ${esc(data.firstName)}!</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">You've just completed your first sale on LokalAds. That's a huge milestone — welcome to the community of successful sellers!</p>
${data.listingTitle ? `<div style="${s({ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}"><p style="${s({ fontSize: 12, fontWeight: 600, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Listing sold</p><p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 })}">${esc(data.listingTitle)}</p></div>` : ""}
<p style="${s({ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 10px" })}">Keep the momentum going:</p>
<table cellpadding="0" cellspacing="0" style="${s({ marginBottom: 24, width: "100%" })}"><tbody>${rows}</tbody></table>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}/post" style="${s({ display: "inline-block", backgroundColor: "#16a34a", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Post My Next Listing</a>
</div>
`;
    return baseEmail(content, `Congratulations on your first sale on LokalAds, ${data.firstName}!`);
  }

  // profile_reminder
  const percent = data.completionPercent ?? 60;
  const remaining = 100 - percent;
  const barFill = Math.round((percent / 100) * 400);
  const profileUrl = data.profileUrl
    ? (data.profileUrl.startsWith("http") ? data.profileUrl : `${APP_URL}${data.profileUrl}`)
    : `${APP_URL}/profile`;

  const missing = [
    percent < 70 && "Profile photo",
    percent < 80 && "Short bio",
    percent < 90 && "Verified phone number",
    percent < 100 && "Location set",
  ].filter(Boolean) as string[];

  const missingItems = missing.length > 0
    ? `<p style="${s({ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 8px" })}">Suggested next steps:</p><ul style="${s({ fontSize: 14, color: "#475569", margin: "0 0 24px", paddingLeft: 20, lineHeight: 1.8 })}">${missing.map(m => `<li>${m}</li>`).join("")}</ul>`
    : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">👤</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Hi ${esc(data.firstName)}, your profile is ${percent}% complete</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">A complete profile builds trust with buyers and sellers. You're almost there — just a few more steps to reach 100%.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px", marginBottom: 24 })}">
  <div style="${s({ display: "flex", justifyContent: "space-between", marginBottom: 8 })}">
    <span style="${s({ fontSize: 14, fontWeight: 600, color: "#334155" })}">Profile completion</span>
    <span style="${s({ fontSize: 14, fontWeight: 700, color: "#2563eb" })}">${percent}%</span>
  </div>
  <div style="${s({ backgroundColor: "#e2e8f0", borderRadius: 100, height: 10, overflow: "hidden" })}">
    <div style="${s({ backgroundColor: "#2563eb", borderRadius: 100, height: 10, width: `${barFill}px`, maxWidth: "100%" })}"></div>
  </div>
  <p style="${s({ fontSize: 12, color: "#94a3b8", margin: "8px 0 0" })}">${remaining}% left to complete</p>
</div>
${missingItems}
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${esc(profileUrl)}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Complete My Profile</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Sellers with complete profiles receive <strong>2× more inquiries</strong> than those with incomplete ones.</p>
`;
  return baseEmail(content, `Your LokalAds profile is ${percent}% complete — finish it in minutes.`);
}

export function milestoneText(data: MilestoneData): string {
  if (data.event === "first_sale") {
    return [
      `Congratulations on your first sale, ${data.firstName}!`,
      "",
      data.listingTitle ? `Listing sold: ${data.listingTitle}` : "",
      "",
      "Keep the momentum going:",
      "- Ask the buyer to leave a review",
      "- Post your next listing",
      "- Keep the conversation going",
      "",
      `Post next listing: ${APP_URL}/post`,
    ].filter(l => l !== undefined).join("\n");
  }
  const percent = data.completionPercent ?? 60;
  const profileUrl = data.profileUrl
    ? (data.profileUrl.startsWith("http") ? data.profileUrl : `${APP_URL}${data.profileUrl}`)
    : `${APP_URL}/profile`;
  return [
    `Hi ${data.firstName}, your profile is ${percent}% complete.`,
    "",
    `Finishing your profile helps buyers and sellers trust you more.`,
    "",
    `Complete your profile: ${profileUrl}`,
  ].join("\n");
}

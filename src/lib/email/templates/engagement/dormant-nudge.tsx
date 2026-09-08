// ── Dormant-User Nudge Template ──────────────────────────────────────────────
// Sent ONCE by the dormant-nudge cron job (lib/jobs/dormant-nudge.job.ts) when
// a user's `lastLoginAt` crosses the ~6-month (180-day) mark. A single warm,
// low-pressure "you've been away a while" note with one CTA back to the site.
// The job clears its own re-send guard on the user's next login, so a user who
// returns and later goes quiet again can receive this again — but never twice
// for the same dormancy spell.
// Plain text fallback: dormantNudgeText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type DormantNudgeData = {
  firstName: string;
  /** Whole months since last login — copy reads "about N months". Always ≥ 6. */
  monthsAway: number;
};

const highlights = [
  { emoji: "🔍", text: "Fresh listings are posted in your area every day" },
  { emoji: "🔔", text: "Your saved searches and alerts are still set up and waiting" },
  { emoji: "💬", text: "Your listings, chats and favourites are exactly where you left them" },
];

export function DormantNudgeEmail(data: DormantNudgeData): string {
  const rows = highlights
    .map(
      ({ emoji, text }) =>
        `<tr><td style="${s({ fontSize: 18, paddingRight: 12, paddingBottom: 10, verticalAlign: "top", width: 24 })}">${emoji}</td><td style="${s({ fontSize: 14, color: "#475569", paddingBottom: 10, lineHeight: 1.5 })}">${esc(text)}</td></tr>`,
    )
    .join("");

  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">👋 Hi ${esc(data.firstName)}, it's been a while</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">It's been about ${data.monthsAway} months since you last signed in to LokalAds. Your account is still active and everything on it is safe — we just wanted to check in and let you know what you've been missing.</p>
<table cellpadding="0" cellspacing="0" style="${s({ marginBottom: 20, width: "100%" })}"><tbody>${rows}</tbody></table>
<div style="${s({ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: "#1e40af", margin: "0 0 4px" })}">Pick up where you left off</p>
  <p style="${s({ fontSize: 14, color: "#1e40af", margin: 0, lineHeight: 1.5 })}">One tap gets you back in — no need to set anything up again.</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 16 })}">
  ${emailButton("Visit LokalAds", APP_URL, { bg: "#2563eb" })}
</div>
<p style="${s({ ...emailText.disclaimer, margin: "0 0 4px", textAlign: "center" })}">Or go straight to <a href="${APP_URL}" style="${s(emailText.link)}">${APP_URL.replace(/^https?:\/\//, "")}</a></p>
`;
  return baseEmail(content, `It's been about ${data.monthsAway} months — your LokalAds account is still here.`);
}

export function dormantNudgeText(data: DormantNudgeData): string {
  return [
    `Hi ${data.firstName}, it's been a while`,
    "",
    `It's been about ${data.monthsAway} months since you last signed in to LokalAds. Your account is still active and everything on it is safe.`,
    "",
    "What's waiting for you:",
    ...highlights.map((h) => `- ${h.text}`),
    "",
    `Visit LokalAds: ${APP_URL}`,
  ].join("\n");
}

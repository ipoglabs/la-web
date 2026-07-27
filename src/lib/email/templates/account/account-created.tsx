// ── Account Created — Welcome Email ──────────────────────────────────────────
// Sent immediately after successful registration.
// Plain text fallback: accountCreatedText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type AccountCreatedData = {
  firstName: string;
  country: string;
};

export function AccountCreatedEmail(data: AccountCreatedData): string {
  const tips = [
    { emoji: "🔍", text: "Browse listings in your area" },
    { emoji: "📢", text: "Post your first ad for free" },
    { emoji: "🔔", text: "Set up alerts for items you're looking for" },
  ];
  const tipRows = tips.map(({ emoji, text }) =>
    `<tr><td style="${s({ fontSize: 18, paddingRight: 12, paddingBottom: 10, verticalAlign: "top", width: 28 })}">${emoji}</td><td style="${s({ fontSize: 14, color: "#475569", paddingBottom: 10, lineHeight: 1.5 })}">${text}</td></tr>`
  ).join("");
  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">Welcome to LokalAds, ${esc(data.firstName)}!</h1>
<p style="${s({ ...emailText.body, margin: "0 0 28px" })}">Your account is ready. You&#39;re now part of the ${esc(data.country)} community &mdash; buy, sell, and connect with people right in your neighbourhood.</p>
<div style="${s({ textAlign: "center", marginBottom: 32 })}">
  ${emailButton("Start Exploring", `${APP_URL}/listings`)}
</div>
<p style="${s({ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 12px" })}">Here&#39;s what you can do:</p>
<table cellpadding="0" cellspacing="0" style="${s({ marginBottom: 28, width: "100%" })}"><tbody>${tipRows}</tbody></table>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">If you didn&#39;t create this account, please <a href="${APP_URL}/support" style="${s(emailText.link)}">contact our support team</a>.</p>
`;
  return baseEmail(content, `Welcome to LokalAds, ${data.firstName}! Your account is ready.`);
}

export function accountCreatedText(data: AccountCreatedData): string {
  return [
    `Welcome to LokalAds, ${data.firstName}!`,
    "",
    `Your account is ready. You're now part of the ${data.country} community.`,
    "",
    "Here's what you can do:",
    "- Browse listings in your area",
    "- Post your first ad for free",
    "- Set up alerts for items you're looking for",
    "",
    `Start exploring: ${APP_URL}/listings`,
    "",
    `If you didn't create this account, contact us: ${APP_URL}/support`,
  ].join("\n");
}

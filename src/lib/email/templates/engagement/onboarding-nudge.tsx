// ── Onboarding Nudge Template ─────────────────────────────────────────────────
// Sent at day 2 and day 3 after sign-up if the user hasn't posted a listing yet.
// Plain text fallback: onboardingNudgeText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type OnboardingNudgeData = {
  firstName: string;
  dayNumber: 2 | 3;
};

const CONFIG = {
  2: {
    heading: "Ready to post your first listing?",
    intro:
      "Thousands of buyers in your area are browsing LokalAds right now. Your first listing could sell today!",
    sub: "It only takes 2 minutes to create a listing.",
    preview: "Thousands of buyers are waiting — post your first listing today!",
  },
  3: {
    heading: "Don't miss out — buyers are searching now",
    intro:
      "You're one step away from reaching buyers near you. Listings on LokalAds get views within hours of going live.",
    sub: "Sellers who post their first listing within 3 days see 40% more early views.",
    preview: "Buyers near you are searching — post your listing before they find someone else.",
  },
} as const;

const benefits = [
  { emoji: "📍", title: "Local reach", desc: "Connect with buyers in your city" },
  { emoji: "⚡", title: "Fast & free", desc: "Post in under 2 minutes, no fees" },
  { emoji: "🔒", title: "Safe & secure", desc: "Verified profiles, in-app chat" },
];

export function OnboardingNudgeEmail(data: OnboardingNudgeData): string {
  const cfg = CONFIG[data.dayNumber];
  const benefitRows = benefits.map(({ emoji, title, desc }) =>
    `<tr>
      <td style="${s({ fontSize: 20, paddingRight: 12, paddingBottom: 12, verticalAlign: "top", width: 28 })}">${emoji}</td>
      <td style="${s({ paddingBottom: 12, verticalAlign: "top" })}">
        <p style="${s({ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" })}">${title}</p>
        <p style="${s({ fontSize: 13, color: "#64748b", margin: 0 })}">${desc}</p>
      </td>
    </tr>`
  ).join("");

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">🏪</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Hi ${esc(data.firstName)}, ${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 8px", lineHeight: 1.6 })}">${cfg.intro}</p>
<p style="${s({ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.5 })}">${cfg.sub}</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 20px 8px", marginBottom: 24 })}">
  <table cellpadding="0" cellspacing="0" style="width:100%"><tbody>${benefitRows}</tbody></table>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}/post" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 32px", borderRadius: 8 })}">Post My First Listing</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Have a question? Visit our <a href="${APP_URL}/faq" style="${s({ color: "#2563eb", textDecoration: "underline" })}">FAQ</a> or <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">contact support</a>.</p>
`;
  return baseEmail(content, cfg.preview);
}

export function onboardingNudgeText(data: OnboardingNudgeData): string {
  const cfg = CONFIG[data.dayNumber];
  return [
    `Hi ${data.firstName}, ${cfg.heading}`,
    "",
    cfg.intro,
    cfg.sub,
    "",
    "Why LokalAds?",
    "- Local reach — Connect with buyers in your city",
    "- Fast & free — Post in under 2 minutes, no fees",
    "- Safe & secure — Verified profiles, in-app chat",
    "",
    `Post your first listing: ${APP_URL}/post`,
  ].join("\n");
}

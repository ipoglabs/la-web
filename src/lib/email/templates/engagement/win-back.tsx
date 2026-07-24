// ── Win-Back Template ─────────────────────────────────────────────────────────
// Sent to inactive users at 30 and 60 days since last login.
// Tone: warm and low-pressure at 30 days, urgent but respectful at 60.
// Plain text fallback: winBackText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type WinBackData = {
  firstName: string;
  daysSince: 30 | 60;
};

const CONFIG = {
  30: {
    icon: "👋",
    heading: "We miss you, come back!",
    intro:
      "It's been a while since you last visited LokalAds. There's a lot going on — new listings, new buyers, and deals waiting to be made.",
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    noteHeading: "What's new since you left",
    note: "New listings are added every day in your area. Your saved alerts may have new matches waiting for you.",
    ctaLabel: "Check What's New", ctaBg: "#2563eb",
    extra: null,
    preview: "It's been a while — come back and see what's new on LokalAds!",
  },
  60: {
    icon: "💌",
    heading: "Your account is still here — we haven't forgotten you",
    intro:
      "You haven't logged in for a while, and we wanted to check in. Your listings, favourites, and alerts are all still saved and waiting for you.",
    noteBg: "#fffbeb", noteBorder: "#fde68a", noteColor: "#92400e",
    noteHeading: "A heads-up",
    note: "Inactive accounts and listings may be scheduled for cleanup after an extended period of inactivity. Log in to keep everything active.",
    ctaLabel: "Log Back In", ctaBg: "#d97706",
    extra: "This is our last nudge — we respect your inbox. If you'd rather unsubscribe, use the link below.",
    preview: "Your LokalAds account is still here — log back in before it expires.",
  },
} as const;

const highlights = [
  { emoji: "🔍", text: "New listings in your area added daily" },
  { emoji: "🔔", text: "Your saved alerts may have matches" },
  { emoji: "💬", text: "Buyers might be searching for what you're selling" },
];

export function WinBackEmail(data: WinBackData): string {
  const cfg = CONFIG[data.daysSince];
  const rows = highlights.map(({ emoji, text }) =>
    `<tr><td style="${s({ fontSize: 18, paddingRight: 12, paddingBottom: 10, verticalAlign: "top", width: 24 })}">${emoji}</td><td style="${s({ fontSize: 14, color: "#475569", paddingBottom: 10, lineHeight: 1.5 })}">${text}</td></tr>`
  ).join("");

  const extraBlock = cfg.extra
    ? `<p style="${s({ fontSize: 13, color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.5, textAlign: "center" })}">${cfg.extra}</p>`
    : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Hi ${esc(data.firstName)}, ${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">${cfg.intro}</p>
<table cellpadding="0" cellspacing="0" style="${s({ marginBottom: 20, width: "100%" })}"><tbody>${rows}</tbody></table>
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: cfg.noteColor, margin: "0 0 4px" })}">${cfg.noteHeading}</p>
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 16 })}">
  <a href="${APP_URL}" style="${s({ display: "inline-block", backgroundColor: cfg.ctaBg, color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${cfg.ctaLabel}</a>
</div>
${extraBlock}
`;
  return baseEmail(content, cfg.preview);
}

export function winBackText(data: WinBackData): string {
  const cfg = CONFIG[data.daysSince];
  const lines = [
    `Hi ${data.firstName}, ${cfg.heading}`,
    "",
    cfg.intro,
    "",
    "What's waiting for you:",
    ...highlights.map(h => `- ${h.text}`),
    "",
    cfg.noteHeading,
    cfg.note,
    "",
    `${cfg.ctaLabel}: ${APP_URL}`,
  ];
  if (cfg.extra) lines.push("", cfg.extra);
  return lines.join("\n");
}

// ── Account Status Template ───────────────────────────────────────────────────
// Sent when an admin suspends, reinstates, or permanently bans an account.
// Plain text fallback: accountStatusText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type AccountStatusData = {
  firstName: string;
  status: "suspended" | "reinstated" | "banned";
  reason?: string;
};

const CONFIG = {
  suspended: {
    icon: "⚠️",
    heading: "Your account has been suspended",
    intro: "Your LokalAds account has been temporarily suspended pending a review.",
    alertBg: "#fffbeb",
    alertBorder: "#fde68a",
    alertColor: "#92400e",
    alertNote: "During this period, your listings will not be visible and you cannot post new listings or send messages.",
    ctaLabel: "Appeal Suspension",
    ctaUrl: "/support",
    ctaBg: "#d97706",
    preview: "Your LokalAds account has been temporarily suspended.",
  },
  reinstated: {
    icon: "✅",
    heading: "Your account has been reinstated",
    intro: "Great news! Your LokalAds account has been reviewed and reinstated. All features are now available to you again.",
    alertBg: "#f0fdf4",
    alertBorder: "#bbf7d0",
    alertColor: "#15803d",
    alertNote: "Your listings have been restored and your profile is visible again. Welcome back!",
    ctaLabel: "Go to My Dashboard",
    ctaUrl: "/myads",
    ctaBg: "#16a34a",
    preview: "Your LokalAds account has been reinstated.",
  },
  banned: {
    icon: "🚫",
    heading: "Your account has been permanently closed",
    intro: "Your LokalAds account has been permanently closed for repeated or severe violations of our Terms of Service.",
    alertBg: "#fef2f2",
    alertBorder: "#fecaca",
    alertColor: "#991b1b",
    alertNote: "All your listings, messages, and data have been removed. This decision is final and cannot be reversed.",
    ctaLabel: "Review Our Terms",
    ctaUrl: "/terms",
    ctaBg: "#dc2626",
    preview: "Your LokalAds account has been permanently closed.",
  },
} as const;

export function AccountStatusEmail(data: AccountStatusData): string {
  const cfg = CONFIG[data.status];
  const reasonBlock = data.reason
    ? `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}"><p style="${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" })}">Reason</p><p style="${s({ fontSize: 14, color: "#334155", margin: 0, lineHeight: 1.5 })}">${esc(data.reason)}</p></div>`
    : "";
  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">Hi ${esc(data.firstName)}, ${cfg.intro}</p>
${reasonBlock}
<div style="${s({ backgroundColor: cfg.alertBg, border: `1px solid ${cfg.alertBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: cfg.alertColor, margin: 0, lineHeight: 1.5 })}">${cfg.alertNote}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}${cfg.ctaUrl}" style="${s({ display: "inline-block", backgroundColor: cfg.ctaBg, color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${cfg.ctaLabel}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">For more information, visit our <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">support page</a>.</p>
`;
  return baseEmail(content, cfg.preview);
}

export function accountStatusText(data: AccountStatusData): string {
  const cfg = CONFIG[data.status];
  const lines = [`Hi ${data.firstName},`, "", cfg.heading, "", cfg.intro];
  if (data.reason) lines.push("", `Reason: ${data.reason}`);
  lines.push("", cfg.alertNote, "", `${cfg.ctaLabel}: ${APP_URL}${cfg.ctaUrl}`);
  return lines.join("\n");
}

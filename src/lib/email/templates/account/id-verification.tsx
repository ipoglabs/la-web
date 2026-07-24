// ── ID Verification Template ──────────────────────────────────────────────────
// Sent to sellers when ID verification is requested or approved.
// Plain text fallback: idVerificationText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type IdVerificationData = {
  firstName: string;
  status: "requested" | "approved";
  reason?: string;
  actionUrl?: string;
};

const CONFIG = {
  requested: {
    icon: "🪪",
    heading: "ID verification required",
    intro: "To continue selling on LokalAds, we need to verify your identity. This is a one-time process that helps build trust with buyers.",
    noteBg: "#fffbeb", noteBorder: "#fde68a", noteColor: "#92400e",
    noteHeading: "Why verify?",
    note: "Verified sellers get a trust badge on their profile and listings, increasing buyer confidence and sales.",
    ctaLabel: "Start Verification", ctaBg: "#d97706",
    preview: "Action required: ID verification needed for your LokalAds seller account.",
  },
  approved: {
    icon: "✅",
    heading: "Your identity has been verified!",
    intro: "Congratulations! Your identity verification is complete. Your profile now shows a verified seller badge.",
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    noteHeading: "What's changed?",
    note: "Your listings and profile now display a verified badge, helping buyers trust you more and improving your chances of a sale.",
    ctaLabel: "View My Profile", ctaBg: "#16a34a",
    preview: "You're now a verified seller on LokalAds!",
  },
} as const;

export function IdVerificationEmail(data: IdVerificationData): string {
  const cfg = CONFIG[data.status];
  const ctaUrl = data.actionUrl
    ? (data.actionUrl.startsWith("http") ? data.actionUrl : `${APP_URL}${data.actionUrl}`)
    : `${APP_URL}/profile`;

  const reasonBlock = data.reason
    ? `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}"><p style="${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" })}">Note</p><p style="${s({ fontSize: 14, color: "#334155", margin: 0, lineHeight: 1.5 })}">${esc(data.reason)}</p></div>`
    : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Hi ${esc(data.firstName)}, ${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">${cfg.intro}</p>
${reasonBlock}
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: cfg.noteColor, margin: "0 0 4px" })}">${cfg.noteHeading}</p>
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${esc(ctaUrl)}" style="${s({ display: "inline-block", backgroundColor: cfg.ctaBg, color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${cfg.ctaLabel}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Questions? Contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a>.</p>
`;
  return baseEmail(content, cfg.preview);
}

export function idVerificationText(data: IdVerificationData): string {
  const cfg = CONFIG[data.status];
  const ctaUrl = data.actionUrl
    ? (data.actionUrl.startsWith("http") ? data.actionUrl : `${APP_URL}${data.actionUrl}`)
    : `${APP_URL}/profile`;
  const lines = [`Hi ${data.firstName}, ${cfg.heading}`, "", cfg.intro];
  if (data.reason) lines.push("", `Note: ${data.reason}`);
  lines.push("", cfg.noteHeading, cfg.note, "", `${cfg.ctaLabel}: ${ctaUrl}`);
  return lines.join("\n");
}

// ── Listing Appeal Template ───────────────────────────────────────────────────
// Covers the full appeal lifecycle for a removed/rejected listing:
//   submitted — appeal received, in queue
//   approved  — listing reinstated
//   rejected  — appeal denied, listing stays removed
// Plain text fallback: listingAppealText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type ListingAppealData = {
  listingTitle: string;
  listingId: string;
  status: "submitted" | "approved" | "rejected";
  reason?: string;
  listingUrl?: string;
};

const CONFIG = {
  submitted: {
    icon: "📋",
    heading: "Your appeal has been received",
    intro: "We've received your appeal for the listing below. Our moderation team will review it carefully and respond within 48 hours.",
    badgeBg: "#eff6ff", badgeColor: "#1d4ed8", badgeBorder: "#bfdbfe", badgeLabel: "Under Appeal",
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    note: "You don't need to take any further action right now. We'll email you as soon as a decision has been made.",
    ctaLabel: "Contact Support", ctaUrl: "/support", ctaBg: "#2563eb",
    preview: "Your listing appeal has been received — we'll be in touch within 48 hours.",
  },
  approved: {
    icon: "✅",
    heading: "Your appeal has been approved!",
    intro: "Great news — after reviewing your appeal, our team has decided to reinstate your listing. It is now live on LokalAds.",
    badgeBg: "#f0fdf4", badgeColor: "#15803d", badgeBorder: "#bbf7d0", badgeLabel: "Reinstated",
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    note: "Your listing is live again and visible to buyers. Thank you for your patience during the review.",
    ctaLabel: "View Your Listing", ctaUrl: "/myads", ctaBg: "#16a34a",
    preview: "Your listing appeal was approved — your listing is live again!",
  },
  rejected: {
    icon: "❌",
    heading: "Your appeal has been rejected",
    intro: "After a thorough review, our moderation team has upheld the original decision. Your listing remains removed from LokalAds.",
    badgeBg: "#fef2f2", badgeColor: "#dc2626", badgeBorder: "#fecaca", badgeLabel: "Appeal Rejected",
    noteBg: "#fef2f2", noteBorder: "#fecaca", noteColor: "#991b1b",
    note: "This is a final decision. If you have new evidence not previously considered, please contact our support team.",
    ctaLabel: "Contact Support", ctaUrl: "/support", ctaBg: "#dc2626",
    preview: "Your listing appeal has been reviewed — the original decision has been upheld.",
  },
} as const;

export function ListingAppealEmail(data: ListingAppealData): string {
  const cfg = CONFIG[data.status];
  const labelStyle = s({ ...emailText.eyebrow, margin: "0 0 4px" });
  const viewLink = data.status === "approved" && data.listingUrl
    ? (data.listingUrl.startsWith("http") ? data.listingUrl : `${APP_URL}${data.listingUrl}`)
    : `${APP_URL}${cfg.ctaUrl}`;
  const reasonBlock = data.reason
    ? `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}"><p style="${labelStyle}">Decision note</p><p style="${s({ fontSize: 14, color: "#334155", margin: 0, lineHeight: 1.5 })}">${esc(data.reason)}</p></div>`
    : "";

  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">${cfg.icon} ${cfg.heading}</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">${cfg.intro}</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${labelStyle}">Listing</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ ...emailText.disclaimer, margin: "0 0 12px" })}">ID: ${esc(data.listingId)}</p>
  <p style="${labelStyle}">Appeal status</p>
  <span style="${s({ ...emailText.badge, display: "inline-block", backgroundColor: cfg.badgeBg, color: cfg.badgeColor, border: `1px solid ${cfg.badgeBorder}`, borderRadius: 100, padding: "2px 10px" })}">${cfg.badgeLabel}</span>
</div>
${reasonBlock}
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton(cfg.ctaLabel, esc(viewLink), { bg: cfg.ctaBg })}
</div>
`;
  return baseEmail(content, cfg.preview);
}

export function listingAppealText(data: ListingAppealData): string {
  const cfg = CONFIG[data.status];
  const lines = [cfg.heading, "", cfg.intro, "", `Listing: ${data.listingTitle}`, `ID: ${data.listingId}`, `Status: ${cfg.badgeLabel}`];
  if (data.reason) lines.push("", `Note: ${data.reason}`);
  lines.push("", cfg.note, "", `${cfg.ctaLabel}: ${APP_URL}${cfg.ctaUrl}`);
  return lines.join("\n");
}

// ── Listing Status Template ───────────────────────────────────────────────────
// Covers 7 listing lifecycle events sent to sellers.
// Plain text fallback: listingStatusText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type ListingStatusData = {
  listingTitle: string;
  listingId: string;
  status:
    | "under_review"
    | "rejected"
    | "edited"
    | "expiring_soon"
    | "expired"
    | "removed_by_admin"
    | "marked_sold";
  reason?: string;
  expiresIn?: string;
  listingUrl?: string;
};

const CONFIG = {
  under_review: {
    icon: "🔍",
    heading: "Your listing is under review",
    intro: "We're reviewing your listing to make sure it meets our guidelines. This usually takes less than a few hours.",
    badgeBg: "#eff6ff", badgeColor: "#1d4ed8", badgeBorder: "#bfdbfe", badgeLabel: "Under Review",
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    note: "You'll receive an email as soon as your listing is approved and goes live.",
    ctaLabel: "View My Ads", ctaUrl: "/myads", ctaBg: "#2563eb",
    preview: "Your listing is currently under review.",
  },
  rejected: {
    icon: "❌",
    heading: "Your listing was not approved",
    intro: "Unfortunately, your listing did not meet our content guidelines and has not been published.",
    badgeBg: "#fef2f2", badgeColor: "#dc2626", badgeBorder: "#fecaca", badgeLabel: "Rejected",
    noteBg: "#fffbeb", noteBorder: "#fde68a", noteColor: "#92400e",
    note: "You can edit and resubmit your listing. Common reasons include prohibited items, misleading descriptions, or unclear photos.",
    ctaLabel: "Edit & Resubmit", ctaUrl: "/myads", ctaBg: "#d97706",
    preview: "Your listing was not approved — you can edit and resubmit.",
  },
  edited: {
    icon: "✏️",
    heading: "Your listing has been updated",
    intro: "Your listing changes have been saved and your listing remains live on LokalAds.",
    badgeBg: "#f0fdf4", badgeColor: "#15803d", badgeBorder: "#bbf7d0", badgeLabel: "Updated",
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    note: "Buyers can see your updated listing immediately.",
    ctaLabel: "View Your Listing", ctaUrl: "/myads", ctaBg: "#16a34a",
    preview: "Your listing has been updated successfully.",
  },
  expiring_soon: {
    icon: "⏰",
    heading: "Your listing is expiring soon",
    intro: "Your listing will expire soon. Renew it now to keep it visible to buyers.",
    badgeBg: "#fffbeb", badgeColor: "#d97706", badgeBorder: "#fde68a", badgeLabel: "Expiring Soon",
    noteBg: "#fffbeb", noteBorder: "#fde68a", noteColor: "#92400e",
    note: "Once expired, your listing will no longer appear in search results. Renew in one click.",
    ctaLabel: "Renew Listing", ctaUrl: "/myads", ctaBg: "#d97706",
    preview: "Your LokalAds listing is expiring soon — renew now.",
  },
  expired: {
    icon: "📅",
    heading: "Your listing has expired",
    intro: "Your listing has passed its expiry date and is no longer visible to buyers.",
    badgeBg: "#f8fafc", badgeColor: "#475569", badgeBorder: "#e2e8f0", badgeLabel: "Expired",
    noteBg: "#f8fafc", noteBorder: "#e2e8f0", noteColor: "#475569",
    note: "You can relist it from My Ads to make it visible to buyers again.",
    ctaLabel: "Relist Now", ctaUrl: "/myads", ctaBg: "#475569",
    preview: "Your LokalAds listing has expired.",
  },
  removed_by_admin: {
    icon: "🚫",
    heading: "Your listing has been removed",
    intro: "Your listing has been removed by our moderation team for violating our content guidelines.",
    badgeBg: "#fef2f2", badgeColor: "#dc2626", badgeBorder: "#fecaca", badgeLabel: "Removed",
    noteBg: "#fef2f2", noteBorder: "#fecaca", noteColor: "#991b1b",
    note: "If you believe this was an error, you can appeal the decision via our support page.",
    ctaLabel: "Appeal Decision", ctaUrl: "/support", ctaBg: "#dc2626",
    preview: "Your listing has been removed by our moderation team.",
  },
  marked_sold: {
    icon: "🎉",
    heading: "Congratulations — marked as sold!",
    intro: "Your listing has been marked as sold. Well done on the successful sale!",
    badgeBg: "#f0fdf4", badgeColor: "#15803d", badgeBorder: "#bbf7d0", badgeLabel: "Sold",
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    note: "Ready to sell something else? Post your next listing from My Ads.",
    ctaLabel: "Post Another Listing", ctaUrl: "/post", ctaBg: "#16a34a",
    preview: "Your listing has been marked as sold!",
  },
} as const;

export function ListingStatusEmail(data: ListingStatusData): string {
  const cfg = CONFIG[data.status];
  const labelStyle = s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" });
  const expiresRow = data.expiresIn
    ? `<p style="${labelStyle}">Expires</p><p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 12px" })}">${esc(data.expiresIn)}</p>`
    : "";
  const reasonBlock = data.reason
    ? `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}"><p style="${labelStyle}">Reason</p><p style="${s({ fontSize: 14, color: "#334155", margin: 0, lineHeight: 1.5 })}">${esc(data.reason)}</p></div>`
    : "";
  const viewLink = data.listingUrl
    ? `<p style="${s({ fontSize: 13, color: "#64748b", margin: "0 0 24px" })}">View your listing: <a href="${esc(data.listingUrl)}" style="${s({ color: "#2563eb", textDecoration: "underline" })}">here</a></p>`
    : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">${cfg.intro}</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${labelStyle}">Listing</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ fontSize: 12, color: "#94a3b8", margin: "0 0 12px" })}">ID: ${esc(data.listingId)}</p>
  <p style="${labelStyle}">Status</p>
  <span style="${s({ display: "inline-block", backgroundColor: cfg.badgeBg, color: cfg.badgeColor, border: `1px solid ${cfg.badgeBorder}`, borderRadius: 100, fontSize: 13, fontWeight: 600, padding: "2px 10px", marginBottom: data.expiresIn ? "12px" : 0 })}">${cfg.badgeLabel}</span>
  ${expiresRow}
</div>
${reasonBlock}
${viewLink}
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}${cfg.ctaUrl}" style="${s({ display: "inline-block", backgroundColor: cfg.ctaBg, color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${cfg.ctaLabel}</a>
</div>
`;
  return baseEmail(content, cfg.preview);
}

export function listingStatusText(data: ListingStatusData): string {
  const cfg = CONFIG[data.status];
  const lines = [cfg.heading, "", cfg.intro, "", `Listing: ${data.listingTitle}`, `ID: ${data.listingId}`, `Status: ${cfg.badgeLabel}`];
  if (data.expiresIn) lines.push(`Expires: ${data.expiresIn}`);
  if (data.reason) lines.push("", `Reason: ${data.reason}`);
  lines.push("", cfg.note, "", `${cfg.ctaLabel}: ${APP_URL}${cfg.ctaUrl}`);
  return lines.join("\n");
}

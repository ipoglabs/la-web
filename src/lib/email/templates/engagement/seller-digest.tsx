// ── Seller Digest Template ────────────────────────────────────────────────────
// Weekly performance summary for active sellers.
// Shows views, saves, and inquiry counts across all their active listings.
// Plain text fallback: sellerDigestText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type SellerDigestData = {
  firstName: string;
  period: string;
  stats: { views: number; saves: number; inquiries: number };
  activeListings: number;
  topListingTitle?: string;
  topListingUrl?: string;
};

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function SellerDigestEmail(data: SellerDigestData): string {
  const statCards = [
    { label: "Views", value: fmt(data.stats.views), emoji: "👁️", bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" },
    { label: "Saves", value: fmt(data.stats.saves), emoji: "❤️", bg: "#fdf2f8", border: "#f0abfc", color: "#a21caf" },
    { label: "Inquiries", value: fmt(data.stats.inquiries), emoji: "💬", bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
  ];

  const cards = statCards.map(({ label, value, emoji, bg, border, color }) =>
    `<td style="${s({ width: "33%", padding: "0 6px", textAlign: "center", verticalAlign: "top" })}">
      <div style="${s({ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "16px 8px" })}">
        <div style="${s({ fontSize: 24, marginBottom: 6 })}">${emoji}</div>
        <div style="${s({ fontSize: 24, fontWeight: 700, color, lineHeight: 1 })}">${value}</div>
        <div style="${s({ fontSize: 12, fontWeight: 600, color: "#64748b", marginTop: 4 })}">${label}</div>
      </div>
    </td>`
  ).join("");

  const topListingBlock = data.topListingTitle
    ? (() => {
        const url = data.topListingUrl
          ? (data.topListingUrl.startsWith("http") ? data.topListingUrl : `${APP_URL}${data.topListingUrl}`)
          : `${APP_URL}/myads`;
        return `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" })}">🏆 Top performing listing</p>
  <p style="${s({ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" })}">${esc(data.topListingTitle)}</p>
  <a href="${esc(url)}" style="${s({ fontSize: 13, color: "#2563eb", textDecoration: "underline" })}">View listing →</a>
</div>`;
      })()
    : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">📊</span></div>
<div style="${s({ display: "inline-block", backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 100, fontSize: 12, fontWeight: 600, padding: "3px 10px", marginBottom: 16 })}">Weekly Digest</div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", lineHeight: 1.3 })}">Hi ${esc(data.firstName)}, here's your week</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">Here's how your listings performed during <strong style="${s({ color: "#0f172a" })}">${esc(data.period)}</strong>. You have <strong style="${s({ color: "#0f172a" })}">${data.activeListings} active listing${data.activeListings !== 1 ? "s" : ""}</strong>.</p>
<table cellpadding="0" cellspacing="0" style="${s({ width: "100%", marginBottom: 24 })}">
  <tbody><tr style="${s({ marginLeft: -6, marginRight: -6 })}">${cards}</tr></tbody>
</table>
${topListingBlock}
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}/myads" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">View All My Listings</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">You're receiving this because you have active listings on LokalAds. Manage digest preferences in <a href="${APP_URL}/profile" style="${s({ color: "#2563eb", textDecoration: "underline" })}">your profile</a>.</p>
`;
  return baseEmail(content, `Your LokalAds weekly digest — ${data.period}`);
}

export function sellerDigestText(data: SellerDigestData): string {
  const lines = [
    `Weekly Digest — ${data.period}`,
    "",
    `Hi ${data.firstName}, here's how your ${data.activeListings} listing${data.activeListings !== 1 ? "s" : ""} performed:`,
    "",
    `👁️ Views:     ${fmt(data.stats.views)}`,
    `❤️ Saves:     ${fmt(data.stats.saves)}`,
    `💬 Inquiries: ${fmt(data.stats.inquiries)}`,
  ];
  if (data.topListingTitle) lines.push("", `🏆 Top listing: ${data.topListingTitle}`);
  lines.push("", `View all listings: ${APP_URL}/myads`);
  return lines.join("\n");
}

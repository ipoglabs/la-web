// ── Listing Renewed Template ──────────────────────────────────────────────────
// Sent when a seller successfully renews an expiring or expired listing.
// Confirms the new expiry date and links back to the listing.
// Plain text fallback: listingRenewedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type ListingRenewedData = {
  listingTitle: string;
  listingId: string;
  listingUrl: string;
  newExpiryDate: string;
};

export function ListingRenewedEmail(data: ListingRenewedData): string {
  const viewUrl = data.listingUrl.startsWith("http")
    ? data.listingUrl
    : `${APP_URL}${data.listingUrl}`;

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">🔄</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Your listing has been renewed!</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">Great — your listing is staying live. Buyers can still find it in search results.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Listing</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ fontSize: 12, color: "#94a3b8", margin: "0 0 16px" })}">ID: ${esc(data.listingId)}</p>
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Active until</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#16a34a", margin: 0 })}">${esc(data.newExpiryDate)}</p>
</div>
<div style="${s({ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: "#15803d", margin: 0, lineHeight: 1.5 })}">We'll send you a reminder 7 days before your listing expires again, so you never miss a renewal.</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${esc(viewUrl)}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">View Your Listing</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">You can manage all your listings from <a href="${APP_URL}/myads" style="${s({ color: "#2563eb", textDecoration: "underline" })}">My Ads</a>.</p>
`;
  return baseEmail(content, `Your listing "${data.listingTitle}" has been renewed until ${data.newExpiryDate}.`);
}

export function listingRenewedText(data: ListingRenewedData): string {
  const viewUrl = data.listingUrl.startsWith("http")
    ? data.listingUrl
    : `${APP_URL}${data.listingUrl}`;
  return [
    `Your listing has been renewed!`,
    "",
    `Listing: ${data.listingTitle}`,
    `ID: ${data.listingId}`,
    `Active until: ${data.newExpiryDate}`,
    "",
    "We'll remind you again 7 days before it expires.",
    "",
    `View your listing: ${viewUrl}`,
    `Manage all listings: ${APP_URL}/myads`,
  ].join("\n");
}

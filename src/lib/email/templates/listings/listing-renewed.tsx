// ── Listing Renewed Template ──────────────────────────────────────────────────
// Sent when a seller successfully renews an expiring or expired listing.
// Confirms the new expiry date and links back to the listing.
// Plain text fallback: listingRenewedText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

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
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">🔄 Your listing has been renewed!</h1>
<p style="${s({ ...emailText.body, margin: "0 0 24px" })}">Great — your listing is staying live. Buyers can still find it in search results.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ ...emailText.eyebrow, margin: "0 0 4px" })}">Listing</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ ...emailText.disclaimer, margin: "0 0 16px" })}">ID: ${esc(data.listingId)}</p>
  <p style="${s({ ...emailText.eyebrow, margin: "0 0 4px" })}">Active until</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#16a34a", margin: 0 })}">${esc(data.newExpiryDate)}</p>
</div>
<div style="${s({ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: "#15803d", margin: 0, lineHeight: 1.5 })}">We'll send you a reminder 7 days before your listing expires again, so you never miss a renewal.</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton("View Your Listing", esc(viewUrl))}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">You can manage all your listings from <a href="${APP_URL}/myads" style="${s(emailText.link)}">My Ads</a>.</p>
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

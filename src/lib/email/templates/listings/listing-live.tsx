// ── Listing Live Template ─────────────────────────────────────────────────────
// Sent when a seller's listing goes live on LokalAds.
// Plain text fallback: listingLiveText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type ListingLiveData = {
  listingTitle: string;
  listingUrl: string;
  listingId: string;
};

export function ListingLiveEmail(data: ListingLiveData): string {
  const fullUrl = data.listingUrl.startsWith("http") ? data.listingUrl : `${APP_URL}${data.listingUrl}`;
  const tips = [
    { emoji: "📸", text: "Add more photos if you haven&#39;t already" },
    { emoji: "💬", text: "Respond to inquiries quickly" },
    { emoji: "🏷️", text: "Share your listing on social media" },
  ];
  const tipRows = tips.map(({ emoji, text }) =>
    `<tr><td style="${s({ fontSize: 16, paddingRight: 10, paddingBottom: 8, verticalAlign: "top", width: 24 })}">${emoji}</td><td style="${s({ fontSize: 14, color: "#475569", paddingBottom: 8, lineHeight: 1.5 })}">${text}</td></tr>`
  ).join("");
  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">🎉</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Your listing is live!</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">Great news &mdash; your listing is now live on LokalAds and visible to buyers in your area.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" })}">Your listing</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ fontSize: 12, color: "#94a3b8", margin: 0 })}">ID: ${esc(data.listingId)}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 28 })}">
  <a href="${esc(fullUrl)}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">View Your Listing</a>
</div>
<p style="${s({ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 10px" })}">Tips to sell faster:</p>
<table cellpadding="0" cellspacing="0" style="${s({ marginBottom: 24, width: "100%" })}"><tbody>${tipRows}</tbody></table>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">You can manage your listings anytime from <a href="${APP_URL}/myads" style="${s({ color: "#2563eb", textDecoration: "underline" })}">My Ads</a>.</p>
`;
  return baseEmail(content, `Your listing "${data.listingTitle}" is now live on LokalAds.`);
}

export function listingLiveText(data: ListingLiveData): string {
  const fullUrl = data.listingUrl.startsWith("http")
    ? data.listingUrl
    : `${APP_URL}${data.listingUrl}`;
  return [
    "Your listing is live!",
    "",
    `"${data.listingTitle}" is now live on LokalAds (ID: ${data.listingId}).`,
    "",
    `View your listing: ${fullUrl}`,
    "",
    "Tips to sell faster:",
    "- Add more photos",
    "- Respond to inquiries quickly",
    "- Share your listing on social media",
    "",
    `Manage your listings: ${APP_URL}/myads`,
  ].join("\n");
}

// ── Listing Milestone Template ────────────────────────────────────────────────
// Sent to a seller when their listing hits a high-views milestone.
// Includes a soft upgrade / tips nudge.
// Plain text fallback: listingMilestoneText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type ListingMilestoneData = {
  listingTitle: string;
  listingId: string;
  viewCount: number;
  listingUrl: string;
};

export function ListingMilestoneEmail(data: ListingMilestoneData): string {
  const viewUrl = data.listingUrl.startsWith("http") ? data.listingUrl : `${APP_URL}${data.listingUrl}`;
  const tips = [
    { emoji: "💬", text: "Respond to messages quickly — buyers move fast" },
    { emoji: "📸", text: "Add more photos to stand out even more" },
    { emoji: "🏷️", text: "Consider adjusting your price to close the deal" },
  ];
  const tipRows = tips.map(({ emoji, text }) =>
    `<tr><td style="${s({ fontSize: 16, paddingRight: 10, paddingBottom: 10, verticalAlign: "top", width: 24 })}">${emoji}</td><td style="${s({ fontSize: 14, color: "#475569", paddingBottom: 10, lineHeight: 1.5 })}">${text}</td></tr>`
  ).join("");

  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">🔥 Your listing is getting noticed!</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">Great job — your listing has already received <strong style="${s({ color: "#0f172a" })}">${esc(String(data.viewCount))} views</strong>. Buyers are interested!</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ ...emailText.eyebrow, margin: "0 0 4px" })}">Your listing</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ ...emailText.disclaimer, margin: 0 })}">ID: ${esc(data.listingId)}</p>
</div>
<p style="${s({ fontSize: 14, fontWeight: 600, color: "#334155", margin: "0 0 10px" })}">Tips to convert views into a sale:</p>
<table cellpadding="0" cellspacing="0" style="${s({ marginBottom: 24, width: "100%" })}"><tbody>${tipRows}</tbody></table>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton("View Your Listing", esc(viewUrl))}
</div>
`;
  return baseEmail(content, `Your listing "${data.listingTitle}" has reached ${data.viewCount} views!`);
}

export function listingMilestoneText(data: ListingMilestoneData): string {
  const viewUrl = data.listingUrl.startsWith("http") ? data.listingUrl : `${APP_URL}${data.listingUrl}`;
  return [
    `Your listing is getting noticed!`,
    "",
    `"${data.listingTitle}" has reached ${data.viewCount} views.`,
    "",
    "Tips:",
    "- Respond to messages quickly",
    "- Add more photos",
    "- Consider adjusting your price",
    "",
    `View your listing: ${viewUrl}`,
  ].join("\n");
}

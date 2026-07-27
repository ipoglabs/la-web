// ── Listing Inquiry Template ──────────────────────────────────────────────────
// Sent to a seller when a buyer sends their first message about a listing.
// Plain text fallback: listingInquiryText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type ListingInquiryData = {
  listingTitle: string;
  listingId: string;
  buyerName: string;
  message: string;
  replyUrl: string;
};

export function ListingInquiryEmail(data: ListingInquiryData): string {
  const replyUrl = data.replyUrl.startsWith("http") ? data.replyUrl : `${APP_URL}${data.replyUrl}`;
  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">💬 New inquiry on your listing</h1>
<p style="${s({ ...emailText.body, margin: "0 0 24px" })}"><strong style="${s({ color: "#0f172a" })}">${esc(data.buyerName)}</strong> is interested in your listing and sent you a message.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ ...emailText.eyebrow, margin: "0 0 4px" })}">Your listing</p>
  <p style="${s({ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ ...emailText.disclaimer, margin: 0 })}">ID: ${esc(data.listingId)}</p>
</div>
<div style="${s({ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ ...emailText.eyebrow, margin: "0 0 8px" })}">Message from ${esc(data.buyerName)}</p>
  <p style="${s({ fontSize: 15, color: "#334155", margin: 0, lineHeight: 1.6, fontStyle: "italic" })}">&ldquo;${esc(data.message)}&rdquo;</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton(`Reply to ${esc(data.buyerName)}`, esc(replyUrl))}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">Sellers who reply within an hour are <strong>3× more likely</strong> to close a deal. Don't keep them waiting!</p>
`;
  return baseEmail(content, `${data.buyerName} is interested in your listing "${data.listingTitle}".`);
}

export function listingInquiryText(data: ListingInquiryData): string {
  const replyUrl = data.replyUrl.startsWith("http") ? data.replyUrl : `${APP_URL}${data.replyUrl}`;
  return [
    `New inquiry on your listing "${data.listingTitle}"`,
    "",
    `${data.buyerName} sent you a message:`,
    `"${data.message}"`,
    "",
    `Reply now: ${replyUrl}`,
  ].join("\n");
}

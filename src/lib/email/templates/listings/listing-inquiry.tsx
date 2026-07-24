// ── Listing Inquiry Template ──────────────────────────────────────────────────
// Sent to a seller when a buyer sends their first message about a listing.
// Plain text fallback: listingInquiryText()

import { baseEmail, s, esc, APP_URL } from "../_base";

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
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">💬</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">New inquiry on your listing</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}"><strong style="${s({ color: "#0f172a" })}">${esc(data.buyerName)}</strong> is interested in your listing and sent you a message.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Your listing</p>
  <p style="${s({ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ fontSize: 12, color: "#94a3b8", margin: 0 })}">ID: ${esc(data.listingId)}</p>
</div>
<div style="${s({ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" })}">Message from ${esc(data.buyerName)}</p>
  <p style="${s({ fontSize: 15, color: "#334155", margin: 0, lineHeight: 1.6, fontStyle: "italic" })}">&ldquo;${esc(data.message)}&rdquo;</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${esc(replyUrl)}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Reply to ${esc(data.buyerName)}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Sellers who reply within an hour are <strong>3× more likely</strong> to close a deal. Don't keep them waiting!</p>
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

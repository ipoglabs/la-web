// ── Listing Reported Template ─────────────────────────────────────────────────
// Sent to a seller when one of their listings has been reported.
// Informational only — admin review is underway, no action needed from seller.
// Plain text fallback: listingReportedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type ListingReportedData = {
  listingTitle: string;
  listingId: string;
};

export function ListingReportedEmail(data: ListingReportedData): string {
  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">🚩</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Your listing has been reported</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">We've received a report about one of your listings. Our moderation team is reviewing it and will take action if needed.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Reported listing</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" })}">${esc(data.listingTitle)}</p>
  <p style="${s({ fontSize: 12, color: "#94a3b8", margin: 0 })}">ID: ${esc(data.listingId)}</p>
</div>
<div style="${s({ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: "#1e40af", margin: "0 0 4px" })}">What happens next?</p>
  <p style="${s({ fontSize: 14, color: "#1e40af", margin: 0, lineHeight: 1.5 })}">Our team will review the report within 24 hours. Your listing will remain live while under review unless a serious violation is found. You'll receive an update by email.</p>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">If you believe this report is unfair, you can <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">contact our support team</a> with the listing ID above.</p>
`;
  return baseEmail(content, `A report has been filed on your listing "${data.listingTitle}".`);
}

export function listingReportedText(data: ListingReportedData): string {
  return [
    `Your listing has been reported`,
    "",
    `Listing: ${data.listingTitle}`,
    `ID: ${data.listingId}`,
    "",
    "Our moderation team is reviewing it. Your listing will remain live unless a violation is found.",
    "",
    `Contact support if this report is unfair: ${APP_URL}/support`,
  ].join("\n");
}

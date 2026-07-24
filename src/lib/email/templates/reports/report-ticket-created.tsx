// ── Report Ticket Created Template ────────────────────────────────────────────
// Sent to reporter when they submit a report-ad ticket.
// Confirms receipt and provides ticket ID for tracking.
// Plain text fallback: reportTicketCreatedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type ReportTicketCreatedData = {
  ticketId: string;
  reason: string;
  listingTitle: string;
};

export function ReportTicketCreatedEmail(data: ReportTicketCreatedData): string {
  const rowStyle = `${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", paddingBottom: 10, paddingRight: 16, verticalAlign: "top", width: 80 })}`;
  const valStyle = `${s({ fontSize: 14, color: "#334155", paddingBottom: 10, verticalAlign: "top", lineHeight: 1.4 })}`;
  const content = `
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Report received</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">Thank you for helping keep LokalAds safe. We&#39;ve received your report and our team will review it shortly.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <table cellpadding="0" cellspacing="0" style="width:100%"><tbody>
    <tr><td style="${rowStyle}">Ticket ID</td><td style="${valStyle}"><strong style="${s({ fontSize: 16, color: "#0f172a", fontFamily: "monospace" })}">#${esc(data.ticketId)}</strong></td></tr>
    <tr><td style="${rowStyle}">Listing</td><td style="${valStyle}">${esc(data.listingTitle)}</td></tr>
    <tr><td style="${rowStyle}">Reason</td><td style="${valStyle}">${esc(data.reason)}</td></tr>
  </tbody></table>
</div>
<p style="${s({ fontSize: 14, color: "#475569", margin: "0 0 16px", lineHeight: 1.6 })}">We aim to review all reports within 24 hours. You&#39;ll receive an email when the status of your report changes.</p>
<p style="${s({ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 })}">Keep your ticket ID <strong>#${esc(data.ticketId)}</strong> for reference. If you need to follow up, contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a>.</p>
`;
  return baseEmail(content, `Report received — Ticket #${data.ticketId}. We&#39;ll review it shortly.`);
}

export function reportTicketCreatedText(data: ReportTicketCreatedData): string {
  return [
    "Report received — Thank you",
    "",
    `Ticket ID:  #${data.ticketId}`,
    `Listing:    ${data.listingTitle}`,
    `Reason:     ${data.reason}`,
    "",
    "We aim to review all reports within 24 hours.",
    "You'll receive an email when the status changes.",
    "",
    `Support: ${APP_URL}/support`,
  ].join("\n");
}

// ── Counter Report Template ───────────────────────────────────────────────────
// Sent to the original reporter when the reported party disputes their report.
// Plain text fallback: counterReportText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type CounterReportData = {
  ticketId: string;
  listingTitle: string;
};

export function CounterReportEmail(data: CounterReportData): string {
  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">⚖️</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Your report has been disputed</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">The seller you reported for <strong style="${s({ color: "#0f172a" })}">${esc(data.listingTitle)}</strong> has disputed your report. Our team will review both sides before making a final decision.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Ticket</p>
  <p style="${s({ fontSize: 16, fontFamily: "monospace", fontWeight: 700, color: "#0f172a", margin: 0 })}">#${esc(data.ticketId)}</p>
</div>
<div style="${s({ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: "#1e40af", margin: "0 0 4px" })}">What happens next?</p>
  <p style="${s({ fontSize: 14, color: "#1e40af", margin: 0, lineHeight: 1.5 })}">Our moderation team will assess both the original report and the dispute. You'll receive an update by email once a final decision has been made — typically within 48 hours.</p>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">If you have additional evidence to support your report, contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a> and reference ticket <strong>#${esc(data.ticketId)}</strong>.</p>
`;
  return baseEmail(content, `Your report #${data.ticketId} has been disputed by the seller.`);
}

export function counterReportText(data: CounterReportData): string {
  return [
    `Your report has been disputed — Ticket #${data.ticketId}`,
    "",
    `The seller you reported for "${data.listingTitle}" has disputed your report.`,
    "",
    "Our team will review both sides and make a final decision within 48 hours.",
    "",
    `Need to add evidence? Contact us: ${APP_URL}/support`,
    `Reference ticket: #${data.ticketId}`,
  ].join("\n");
}

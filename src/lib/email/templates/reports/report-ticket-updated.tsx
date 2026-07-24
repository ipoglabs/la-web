// ── Report Ticket Updated Template ────────────────────────────────────────────
// Sent when an admin changes the status of a report ticket.
// Plain text fallback: reportTicketUpdatedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type ReportTicketUpdatedData = {
  ticketId: string;
  newStatus: string;
  resolution?: string;
};

// Status display config
const STATUS_STYLE: Record<string, { label: string; bg: string; color: string; border: string }> = {
  "under_review": { label: "Under Review",  bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "resolved":     { label: "Resolved",      bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  "dismissed":    { label: "Dismissed",     bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
  "escalated":    { label: "Escalated",     bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
};

const DEFAULT_STATUS = { label: "Updated", bg: "#f8fafc", color: "#334155", border: "#e2e8f0" };

export function ReportTicketUpdatedEmail(data: ReportTicketUpdatedData): string {
  const status = STATUS_STYLE[data.newStatus] ?? DEFAULT_STATUS;
  const labelStyle = s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", paddingBottom: 12, paddingRight: 16, verticalAlign: "middle", width: 80 });
  const valueStyle = s({ fontSize: 14, color: "#334155", paddingBottom: 12, verticalAlign: "middle", lineHeight: 1.4 });
  const badgeStyle = s({ display: "inline-block", backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}`, borderRadius: 100, fontSize: 13, fontWeight: 600, padding: "2px 10px" });
  const resolutionRow = data.resolution
    ? `<tr><td style="${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", paddingBottom: 0, paddingRight: 16, verticalAlign: "middle", width: 80 })}">Note</td><td style="${s({ fontSize: 14, color: "#334155", paddingBottom: 0, verticalAlign: "middle", lineHeight: 1.4 })}">${esc(data.resolution)}</td></tr>`
    : "";
  const content = `
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Your report has been updated</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">The status of your report has changed. Here are the latest details:</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <table cellpadding="0" cellspacing="0" style="width:100%"><tbody>
    <tr><td style="${labelStyle}">Ticket ID</td><td style="${valueStyle}"><strong style="${s({ fontSize: 16, color: "#0f172a", fontFamily: "monospace" })}">#${esc(data.ticketId)}</strong></td></tr>
    <tr><td style="${labelStyle}">Status</td><td style="${valueStyle}"><span style="${badgeStyle}">${status.label}</span></td></tr>
    ${resolutionRow}
  </tbody></table>
</div>
<p style="${s({ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 })}">If you have questions about this report, contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a> and reference ticket <strong>#${esc(data.ticketId)}</strong>.</p>
`;
  return baseEmail(content, `Your report #${data.ticketId} has been updated — Status: ${status.label}`);
}

export function reportTicketUpdatedText(data: ReportTicketUpdatedData): string {
  const status = STATUS_STYLE[data.newStatus] ?? DEFAULT_STATUS;
  const lines = [
    `Your report has been updated — Ticket #${data.ticketId}`,
    "",
    `Status: ${status.label}`,
  ];
  if (data.resolution) {
    lines.push(`Note:   ${data.resolution}`);
  }
  lines.push("", `Contact support: ${APP_URL}/support`);
  return lines.join("\n");
}

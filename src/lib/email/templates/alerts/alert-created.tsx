// ── Alert Created Template ────────────────────────────────────────────────────
// Sent immediately when a user saves a new alert — confirms what they'll be
// notified about and on which channel(s). Distinct from ALERT_MATCH (sent
// later, once a matching listing is actually found).
// Plain text fallback: alertCreatedText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type AlertCreatedData = {
  alertName: string;
  categoryLabel: string;
  subCategoryLabel: string;
  keywords?: string[];
  locationLabel?: string;
  notifyVia: string[];
  manageUrl: string;
};

function channelLabel(notifyVia: string[]): string {
  const labels = [];
  if (notifyVia.includes("email")) labels.push("Email");
  if (notifyVia.includes("whatsapp")) labels.push("WhatsApp");
  return labels.length > 0 ? labels.join(" + ") : "Email";
}

export function AlertCreatedEmail(data: AlertCreatedData): string {
  const fullUrl = data.manageUrl.startsWith("http") ? data.manageUrl : `${APP_URL}${data.manageUrl}`;
  const detailRows = [
    `<tr><td style="${s({ padding: "8px 0", color: "#64748b", fontSize: 14 })}">Category</td><td style="${s({ padding: "8px 0", color: "#0f172a", fontSize: 14, fontWeight: 600, textAlign: "right" })}">${esc(data.categoryLabel)} &rsaquo; ${esc(data.subCategoryLabel)}</td></tr>`,
    data.keywords && data.keywords.length > 0
      ? `<tr><td style="${s({ padding: "8px 0", color: "#64748b", fontSize: 14 })}">Keywords</td><td style="${s({ padding: "8px 0", color: "#0f172a", fontSize: 14, fontWeight: 600, textAlign: "right" })}">${esc(data.keywords.join(", "))}</td></tr>`
      : "",
    data.locationLabel
      ? `<tr><td style="${s({ padding: "8px 0", color: "#64748b", fontSize: 14 })}">Location</td><td style="${s({ padding: "8px 0", color: "#0f172a", fontSize: 14, fontWeight: 600, textAlign: "right" })}">${esc(data.locationLabel)}</td></tr>`
      : "",
    `<tr><td style="${s({ padding: "8px 0", color: "#64748b", fontSize: 14 })}">Notify me via</td><td style="${s({ padding: "8px 0", color: "#0f172a", fontSize: 14, fontWeight: 600, textAlign: "right" })}">${esc(channelLabel(data.notifyVia))}</td></tr>`,
  ].join("");

  const content = `
<div style="${s({ marginBottom: 16 })}">
  <span style="${s({ display: "inline-block", backgroundColor: "#dcfce7", color: "#166534", ...emailText.badge, padding: "4px 12px", borderRadius: 100, border: "1px solid #86efac" })}">✅ Alert Created</span>
</div>
<h1 style="${s({ ...emailText.h1, margin: "0 0 10px" })}">You&#39;re all set — we&#39;ll ping you</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">Your alert <strong>${esc(data.alertName)}</strong> is now live. We&#39;ll notify you the moment a matching listing goes up.</p>
<table style="${s({ width: "100%", borderCollapse: "collapse", marginBottom: 28, borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" })}">
  ${detailRows}
</table>
<div style="${s({ textAlign: "center", marginBottom: 28 })}">
  ${emailButton("Manage Your Alerts", esc(fullUrl))}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">Didn&#39;t create this alert, or want to change it? <a href="${fullUrl}" style="${s(emailText.link)}">Manage your alerts</a> — you can pause or delete it anytime.</p>
`;
  return baseEmail(content, `Your alert "${data.alertName}" is live — we'll notify you about new matches`);
}

export function alertCreatedText(data: AlertCreatedData): string {
  const fullUrl = data.manageUrl.startsWith("http") ? data.manageUrl : `${APP_URL}${data.manageUrl}`;
  const lines = [
    `Alert Created: ${data.alertName}`,
    "",
    `Your alert "${data.alertName}" is now live. We'll notify you the moment a matching listing goes up.`,
    "",
    `Category: ${data.categoryLabel} / ${data.subCategoryLabel}`,
  ];
  if (data.keywords && data.keywords.length > 0) lines.push(`Keywords: ${data.keywords.join(", ")}`);
  if (data.locationLabel) lines.push(`Location: ${data.locationLabel}`);
  lines.push(`Notify me via: ${channelLabel(data.notifyVia)}`, "", `Manage your alerts: ${fullUrl}`);
  return lines.join("\n");
}

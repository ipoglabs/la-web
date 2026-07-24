// ── Admin Message Template ────────────────────────────────────────────────────
// Sent when an admin sends a custom message to a user.
// Supports an optional action button.
// Plain text fallback: adminMessageText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type AdminMessageData = {
  firstName: string;
  subject: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
};

export function AdminMessageEmail(data: AdminMessageData): string {
  const actionBtn = data.actionUrl && data.actionLabel
    ? `<div style="${s({ textAlign: "center", marginBottom: 24 })}"><a href="${esc(data.actionUrl.startsWith("http") ? data.actionUrl : `${APP_URL}${data.actionUrl}`)}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${esc(data.actionLabel)}</a></div>`
    : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">📬</span></div>
<div style="${s({ display: "inline-block", backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 100, fontSize: 12, fontWeight: 600, padding: "3px 10px", marginBottom: 16 })}">Message from LokalAds Team</div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">${esc(data.subject)}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 4px", lineHeight: 1.5 })}">Hi ${esc(data.firstName)},</p>
<div style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.8 })}">${esc(data.body).replace(/\n/g, "<br>")}</div>
${actionBtn}
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">If you have questions, please visit our <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">support page</a>.</p>
`;
  return baseEmail(content, `Message from LokalAds: ${data.subject}`);
}

export function adminMessageText(data: AdminMessageData): string {
  const lines = [
    `Message from LokalAds Team`,
    "",
    data.subject,
    "",
    `Hi ${data.firstName},`,
    "",
    data.body,
  ];
  if (data.actionUrl && data.actionLabel) {
    const url = data.actionUrl.startsWith("http") ? data.actionUrl : `${APP_URL}${data.actionUrl}`;
    lines.push("", `${data.actionLabel}: ${url}`);
  }
  lines.push("", `Support: ${APP_URL}/support`);
  return lines.join("\n");
}

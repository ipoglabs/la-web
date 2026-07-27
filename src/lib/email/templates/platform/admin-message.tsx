// ── Admin Message Template ────────────────────────────────────────────────────
// Sent when an admin sends a custom message to a user.
// Supports an optional action button.
// Plain text fallback: adminMessageText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type AdminMessageData = {
  firstName: string;
  subject: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
};

export function AdminMessageEmail(data: AdminMessageData): string {
  const actionBtn = data.actionUrl && data.actionLabel
    ? `<div style="${s({ textAlign: "center", marginBottom: 24 })}">${emailButton(esc(data.actionLabel), esc(data.actionUrl.startsWith("http") ? data.actionUrl : `${APP_URL}${data.actionUrl}`))}</div>`
    : "";

  const content = `
<div style="${s({ ...emailText.badge, display: "inline-block", backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 100, padding: "3px 10px", marginBottom: 16 })}">Message from LokalAds Team</div>
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">📬 ${esc(data.subject)}</h1>
<p style="${s({ ...emailText.body, margin: "0 0 4px", lineHeight: 1.5 })}">Hi ${esc(data.firstName)},</p>
<div style="${s({ ...emailText.body, margin: "0 0 24px", lineHeight: 1.8 })}">${esc(data.body).replace(/\n/g, "<br>")}</div>
${actionBtn}
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">If you have questions, please visit our <a href="${APP_URL}/support" style="${s(emailText.link)}">support page</a>.</p>
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

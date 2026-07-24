// ── Account Deletion Pending Template ────────────────────────────────────────
// Sent immediately after a user requests account deletion.
// GDPR (UK / EU) mandates a cooling-off grace period — this email informs the
// user of the scheduled deletion date and provides a clear cancellation link.
// Plain text fallback: accountDeletionPendingText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type AccountDeletionPendingData = {
  firstName: string;
  coolOffDays: number;
  deletionDate: string;
  cancelUrl: string;
};

export function AccountDeletionPendingEmail(data: AccountDeletionPendingData): string {
  const cancelUrl = data.cancelUrl.startsWith("http")
    ? data.cancelUrl
    : `${APP_URL}${data.cancelUrl}`;

  const whatHappens = [
    { emoji: "📋", text: "Your listings will be unpublished immediately" },
    { emoji: "💬", text: "Your messages and chat history will be deleted" },
    { emoji: "🔔", text: "Your saved alerts and favourites will be removed" },
    { emoji: "👤", text: "Your profile and personal data will be permanently erased" },
  ];
  const rows = whatHappens.map(({ emoji, text }) =>
    `<tr><td style="${s({ fontSize: 16, paddingRight: 10, paddingBottom: 8, verticalAlign: "top", width: 24 })}">${emoji}</td><td style="${s({ fontSize: 14, color: "#991b1b", paddingBottom: 8, lineHeight: 1.5 })}">${text}</td></tr>`
  ).join("");

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">⚠️</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Account deletion scheduled</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">Hi ${esc(data.firstName)}, we've received your request to delete your LokalAds account. As required by data protection law, we apply a <strong style="${s({ color: "#0f172a" })}">${esc(String(data.coolOffDays))}-day cooling-off period</strong> before permanent deletion.</p>
<div style="${s({ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Scheduled deletion date</p>
  <p style="${s({ fontSize: 20, fontWeight: 700, color: "#dc2626", margin: "0 0 12px" })}">${esc(data.deletionDate)}</p>
  <p style="${s({ fontSize: 14, color: "#991b1b", margin: 0, lineHeight: 1.5 })}">On this date, the following will be <strong>permanently and irreversibly deleted:</strong></p>
</div>
<div style="${s({ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <table cellpadding="0" cellspacing="0" style="width:100%"><tbody>${rows}</tbody></table>
</div>
<div style="${s({ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "20px", marginBottom: 24, textAlign: "center" })}">
  <p style="${s({ fontSize: 15, fontWeight: 600, color: "#15803d", margin: "0 0 12px" })}">Changed your mind?</p>
  <p style="${s({ fontSize: 14, color: "#15803d", margin: "0 0 16px", lineHeight: 1.5 })}">You can cancel the deletion request any time before <strong>${esc(data.deletionDate)}</strong>. After that date, deletion is permanent and cannot be undone.</p>
  <a href="${esc(cancelUrl)}" style="${s({ display: "inline-block", backgroundColor: "#16a34a", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Cancel Deletion Request</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">For questions about your data rights, visit our <a href="${APP_URL}/privacy" style="${s({ color: "#2563eb", textDecoration: "underline" })}">Privacy Policy</a> or contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a>.</p>
`;
  return baseEmail(content, `Action required: your account is scheduled for deletion on ${data.deletionDate}.`);
}

export function accountDeletionPendingText(data: AccountDeletionPendingData): string {
  const cancelUrl = data.cancelUrl.startsWith("http")
    ? data.cancelUrl
    : `${APP_URL}${data.cancelUrl}`;
  return [
    `Account deletion scheduled — Hi ${data.firstName}`,
    "",
    `Your LokalAds account is scheduled for permanent deletion on: ${data.deletionDate}`,
    `(${data.coolOffDays}-day cooling-off period as required by data protection law)`,
    "",
    "On that date the following will be permanently deleted:",
    "- Your listings",
    "- Your messages and chat history",
    "- Your saved alerts and favourites",
    "- Your profile and all personal data",
    "",
    "Changed your mind? Cancel the deletion before that date:",
    cancelUrl,
    "",
    `Privacy Policy: ${APP_URL}/privacy`,
    `Support: ${APP_URL}/support`,
  ].join("\n");
}

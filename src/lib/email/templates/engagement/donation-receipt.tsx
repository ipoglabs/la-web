// ── Donation Receipt Template ─────────────────────────────────────────────────
// Sent when a user's donation is processed successfully.
// Plain text fallback: donationReceiptText()

import { baseEmail, s, esc, APP_URL, emailText } from "../_base";

type DonationReceiptData = {
  firstName: string;
  amount: string;
  currency: string;
  reference: string;
};

export function DonationReceiptEmail(data: DonationReceiptData): string {
  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">💝 Thank you for your donation!</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">Hi ${esc(data.firstName)}, your generosity helps us keep LokalAds free for everyone. Every contribution makes a real difference.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <table cellpadding="0" cellspacing="0" style="width:100%"><tbody>
    <tr>
      <td style="${s({ ...emailText.tableLabel, paddingBottom: 10, paddingRight: 16, verticalAlign: "middle", width: 100 })}">Amount</td>
      <td style="${s({ fontSize: 18, fontWeight: 700, color: "#0f172a", paddingBottom: 10, verticalAlign: "middle" })}">${esc(data.amount)} <span style="${s({ fontSize: 14, fontWeight: 500, color: "#64748b" })}">${esc(data.currency)}</span></td>
    </tr>
    <tr>
      <td style="${s({ ...emailText.tableLabel, paddingBottom: 0, paddingRight: 16, verticalAlign: "middle" })}">Reference</td>
      <td style="${s({ fontFamily: "monospace", fontSize: 14, color: "#334155", paddingBottom: 0, verticalAlign: "middle" })}">${esc(data.reference)}</td>
    </tr>
  </tbody></table>
</div>
<div style="${s({ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: "#15803d", margin: 0, lineHeight: 1.5 })}">Your donation supports server costs, development, and keeping LokalAds free for buyers and sellers everywhere. Thank you! 🙏</p>
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">This serves as your donation receipt. Keep it for your records. For any queries, visit our <a href="${APP_URL}/support" style="${s(emailText.link)}">support page</a>.</p>
`;
  return baseEmail(content, `Thank you for your donation of ${data.amount} ${data.currency}!`);
}

export function donationReceiptText(data: DonationReceiptData): string {
  return [
    `Thank you for your donation, ${data.firstName}!`,
    "",
    `Amount: ${data.amount} ${data.currency}`,
    `Reference: ${data.reference}`,
    "",
    "Your donation helps us keep LokalAds free for everyone.",
    "",
    `Support: ${APP_URL}/support`,
  ].join("\n");
}

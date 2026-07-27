// ── Donation Failed Template ──────────────────────────────────────────────────
// Sent when a donation payment fails.
// Plain text fallback: donationFailedText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type DonationFailedData = {
  firstName: string;
  amount: string;
  currency: string;
};

export function DonationFailedEmail(data: DonationFailedData): string {
  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">😔 Your donation couldn't be processed</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">Hi ${esc(data.firstName)}, unfortunately your donation of <strong style="${s({ color: "#0f172a" })}">${esc(data.amount)} ${esc(data.currency)}</strong> could not be processed. No charge has been made to your payment method.</p>
<div style="${s({ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: "#991b1b", margin: "0 0 6px" })}">Common reasons for payment failure:</p>
  <ul style="${s({ fontSize: 14, color: "#991b1b", margin: 0, paddingLeft: 18, lineHeight: 1.8 })}">
    <li>Insufficient funds or card limit reached</li>
    <li>Card details entered incorrectly</li>
    <li>Bank declined the transaction</li>
    <li>Expired card</li>
  </ul>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton("Try Again", `${APP_URL}/donate`)}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">Need help? Contact us at <a href="${APP_URL}/support" style="${s(emailText.link)}">our support page</a>.</p>
`;
  return baseEmail(content, `Your donation of ${data.amount} ${data.currency} could not be processed.`);
}

export function donationFailedText(data: DonationFailedData): string {
  return [
    `Hi ${data.firstName},`,
    "",
    `Your donation of ${data.amount} ${data.currency} could not be processed.`,
    "No charge has been made to your payment method.",
    "",
    "Common reasons: insufficient funds, incorrect card details, expired card, bank decline.",
    "",
    `Try again: ${APP_URL}/donate`,
    `Support: ${APP_URL}/support`,
  ].join("\n");
}

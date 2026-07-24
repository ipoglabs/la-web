// ── Donation Failed Template ──────────────────────────────────────────────────
// Sent when a donation payment fails.
// Plain text fallback: donationFailedText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type DonationFailedData = {
  firstName: string;
  amount: string;
  currency: string;
};

export function DonationFailedEmail(data: DonationFailedData): string {
  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">😔</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Your donation couldn't be processed</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">Hi ${esc(data.firstName)}, unfortunately your donation of <strong style="${s({ color: "#0f172a" })}">${esc(data.amount)} ${esc(data.currency)}</strong> could not be processed. No charge has been made to your payment method.</p>
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
  <a href="${APP_URL}/donate" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Try Again</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Need help? Contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a>.</p>
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

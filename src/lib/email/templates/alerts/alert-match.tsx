// ── Alert Match Template ──────────────────────────────────────────────────────
// Sent when a new listing matches a user's saved alert (instant notification).
// Plain text fallback: alertMatchText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type AlertMatchData = {
  alertName: string;
  count: number;
  previewUrl: string;
};

export function AlertMatchEmail(data: AlertMatchData): string {
  const fullUrl = data.previewUrl.startsWith("http") ? data.previewUrl : `${APP_URL}${data.previewUrl}`;
  const listingWord = data.count === 1 ? "listing" : "listings";
  const content = `
<div style="${s({ marginBottom: 16 })}">
  <span style="${s({ display: "inline-block", backgroundColor: "#fef3c7", color: "#92400e", ...emailText.badge, padding: "4px 12px", borderRadius: 100, border: "1px solid #fcd34d" })}">🔔 Alert Match</span>
</div>
<h1 style="${s({ ...emailText.h1, margin: "0 0 10px" })}">${data.count} new ${listingWord} for you</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">We found <strong>${data.count} new ${listingWord}</strong> matching your alert:</p>
<div style="${s({ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 16px", marginBottom: 28, display: "inline-block" })}">
  <span style="${s({ fontSize: 15, fontWeight: 700, color: "#1d4ed8" })}">${esc(data.alertName)}</span>
</div>
<div style="${s({ textAlign: "center", marginBottom: 28 })}">
  ${emailButton(`View ${data.count === 1 ? "the Listing" : "All Listings"}`, esc(fullUrl))}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">You&#39;re receiving this because you have an active alert for <strong>${esc(data.alertName)}</strong>. <a href="${APP_URL}/profile" style="${s(emailText.link)}">Manage your alerts</a>.</p>
`;
  return baseEmail(content, `${data.count} new ${listingWord} matching your alert for ${data.alertName}`);
}

export function alertMatchText(data: AlertMatchData): string {
  const fullUrl = data.previewUrl.startsWith("http")
    ? data.previewUrl
    : `${APP_URL}${data.previewUrl}`;
  const listingWord = data.count === 1 ? "listing" : "listings";
  return [
    `Alert Match: ${data.alertName}`,
    "",
    `We found ${data.count} new ${listingWord} matching your alert for "${data.alertName}".`,
    "",
    `View ${listingWord}: ${fullUrl}`,
    "",
    `Manage your alerts: ${APP_URL}/profile`,
  ].join("\n");
}

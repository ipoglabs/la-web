// ── Alert Match Template ──────────────────────────────────────────────────────
// Sent when a new listing matches a user's saved alert (instant notification).
// Plain text fallback: alertMatchText()

import { baseEmail, s, esc, APP_URL } from "../_base";

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
  <span style="${s({ display: "inline-block", backgroundColor: "#fef3c7", color: "#92400e", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 100, border: "1px solid #fcd34d" })}">🔔 Alert Match</span>
</div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 10px", lineHeight: 1.3 })}">${data.count} new ${listingWord} for you</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">We found <strong>${data.count} new ${listingWord}</strong> matching your alert:</p>
<div style="${s({ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 16px", marginBottom: 28, display: "inline-block" })}">
  <span style="${s({ fontSize: 15, fontWeight: 700, color: "#1d4ed8" })}">${esc(data.alertName)}</span>
</div>
<div style="${s({ textAlign: "center", marginBottom: 28 })}">
  <a href="${esc(fullUrl)}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">View ${data.count === 1 ? "the Listing" : "All Listings"}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">You&#39;re receiving this because you have an active alert for <strong>${esc(data.alertName)}</strong>. <a href="${APP_URL}/profile" style="${s({ color: "#2563eb", textDecoration: "underline" })}">Manage your alerts</a>.</p>
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

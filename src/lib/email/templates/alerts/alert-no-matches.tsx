// ── Alert No Matches Template ─────────────────────────────────────────────────
// Sent when a saved alert has had no matches for 14 days.
// Encourages the user to broaden their search or explore other listings.
// Plain text fallback: alertNoMatchesText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type AlertNoMatchesData = {
  alertName: string;
  alertId: string;
};

export function AlertNoMatchesEmail(data: AlertNoMatchesData): string {
  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">🔍</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">No new matches yet</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">Your alert <strong style="${s({ color: "#0f172a" })}">&ldquo;${esc(data.alertName)}&rdquo;</strong> hasn't had any new matches in the last 14 days.</p>
<div style="${s({ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: "#92400e", margin: "0 0 6px" })}">Try broadening your search</p>
  <p style="${s({ fontSize: 14, color: "#92400e", margin: 0, lineHeight: 1.5 })}">Widening the category, location radius, or price range often reveals more listings. You can edit your alert below.</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 16 })}">
  <a href="${APP_URL}/profile" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">Edit My Alert</a>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}/listings" style="${s({ display: "inline-block", backgroundColor: "transparent", color: "#475569", fontSize: 14, fontWeight: 500, textDecoration: "none", padding: "10px 24px", borderRadius: 8, border: "1px solid #e2e8f0" })}">Browse All Listings</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Alert ID: <code style="${s({ fontFamily: "monospace", fontSize: 12 })}">${esc(data.alertId)}</code></p>
`;
  return baseEmail(content, `No new matches in 14 days for your alert "${data.alertName}".`);
}

export function alertNoMatchesText(data: AlertNoMatchesData): string {
  return [
    `No new matches for "${data.alertName}"`,
    "",
    "Your alert hasn't had any new matches in the last 14 days.",
    "",
    "Try broadening your search — edit your alert:",
    `${APP_URL}/profile`,
    "",
    `Or browse all listings: ${APP_URL}/listings`,
  ].join("\n");
}

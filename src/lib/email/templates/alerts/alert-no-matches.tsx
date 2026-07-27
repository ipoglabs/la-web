// ── Alert No Matches Template ─────────────────────────────────────────────────
// Sent when a saved alert has had no matches for 14 days.
// Encourages the user to broaden their search or explore other listings.
// Plain text fallback: alertNoMatchesText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type AlertNoMatchesData = {
  alertName: string;
  alertId: string;
};

export function AlertNoMatchesEmail(data: AlertNoMatchesData): string {
  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">🔍 No new matches yet</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">Your alert <strong style="${s({ color: "#0f172a" })}">&ldquo;${esc(data.alertName)}&rdquo;</strong> hasn't had any new matches in the last 14 days.</p>
<div style="${s({ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: "#92400e", margin: "0 0 6px" })}">Try broadening your search</p>
  <p style="${s({ fontSize: 14, color: "#92400e", margin: 0, lineHeight: 1.5 })}">Widening the category, location radius, or price range often reveals more listings. You can edit your alert below.</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 16 })}">
  ${emailButton("Edit My Alert", `${APP_URL}/profile`)}
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton("Browse All Listings", `${APP_URL}/listings`, { bg: "transparent", color: "#475569", fontSize: 14, fontWeight: 500, padding: "10px 24px", border: "1px solid #e2e8f0" })}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">Alert ID: <code style="${s({ fontFamily: "monospace", fontSize: 14 })}">${esc(data.alertId)}</code></p>
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

// ── Alert Digest Template ─────────────────────────────────────────────────────
// Sent as a daily or weekly digest when there are new listings matching a saved alert.
// Plain text fallback: alertDigestText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type AlertDigestData = {
  alertName: string;
  count: number;
  previewUrl: string;
  frequency: "daily" | "weekly";
};

export function AlertDigestEmail(data: AlertDigestData): string {
  const url = data.previewUrl.startsWith("http") ? data.previewUrl : `${APP_URL}${data.previewUrl}`;
  const periodLabel = data.frequency === "daily" ? "today" : "this week";
  const freqLabel = data.frequency === "daily" ? "Daily Digest" : "Weekly Digest";
  const noun = data.count === 1 ? "listing" : "listings";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">🔔</span></div>
<div style="${s({ display: "inline-block", backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 100, fontSize: 12, fontWeight: 600, padding: "3px 10px", marginBottom: 16 })}">${freqLabel}</div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">${data.count} new ${noun} for your alert</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 24px", lineHeight: 1.6 })}">We found <strong style="${s({ color: "#0f172a" })}">${data.count} new ${noun}</strong> ${periodLabel} matching your saved alert.</p>
<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" })}">Your alert</p>
  <p style="${s({ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 })}">${esc(data.alertName)}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${esc(url)}" style="${s({ display: "inline-block", backgroundColor: "#2563eb", color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">View All ${data.count} ${data.count === 1 ? "Listing" : "Listings"}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">You can manage your alerts anytime from <a href="${APP_URL}/profile" style="${s({ color: "#2563eb", textDecoration: "underline" })}">your profile</a>.</p>
`;
  return baseEmail(content, `${data.count} new ${noun} matching "${data.alertName}" — ${freqLabel}`);
}

export function alertDigestText(data: AlertDigestData): string {
  const url = data.previewUrl.startsWith("http") ? data.previewUrl : `${APP_URL}${data.previewUrl}`;
  const periodLabel = data.frequency === "daily" ? "today" : "this week";
  const noun = data.count === 1 ? "listing" : "listings";
  return [
    `${data.frequency === "daily" ? "Daily" : "Weekly"} Alert Digest`,
    "",
    `${data.count} new ${noun} for "${data.alertName}" ${periodLabel}.`,
    "",
    `View them here: ${url}`,
  ].join("\n");
}

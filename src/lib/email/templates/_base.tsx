// ── Email Engine — Base Template ─────────────────────────────────────────────
// Master layout for ALL LokalAds transactional emails.
// Every template renders its content as children inside this wrapper.
// Never build a standalone HTML email outside this base — brand consistency is non-negotiable.
//
// Design decisions:
// - White card on light grey background — standard transactional email pattern
// - Logo: /public/la-logo-symbol-color.svg served via NEXT_PUBLIC_APP_URL (absolute URL required for email clients)
// - Max width 600px — universal email safe width
// - Font stack: system fonts only — web fonts not reliable across email clients
// - All styles inline — required for email client compatibility
// - Plain text version is handled separately in each template


export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://lokalads.com";

// ── String-based helpers (no react-dom/server) ────────────────────────────────
// Next.js 16 / Turbopack forbids react-dom/server anywhere in the App Router
// bundle. Templates now return HTML strings directly. These helpers replace JSX.

/** Unitless CSS properties — do not append px when numeric */
const UNITLESS = new Set([
  "fontWeight", "lineHeight", "opacity", "zIndex", "flex", "flexGrow", "flexShrink",
  "order", "tabSize", "columnCount", "fillOpacity", "animationIterationCount",
]);

/** Convert a camelCase style object to an inline CSS style string */
export function s(obj: Record<string, string | number>): string {
  return Object.entries(obj)
    .map(([k, v]) => {
      const prop = k.replace(/([A-Z])/g, "-$1").toLowerCase();
      const val = typeof v === "number" && v !== 0 && !UNITLESS.has(k) ? `${v}px` : v;
      return `${prop}:${val}`;
    })
    .join(";");
}

/** Escape user-supplied strings for safe HTML embedding */
export function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Wrap template content in the standard LokalAds email shell — returns full HTML string */
export function baseEmail(content: string, preview?: string): string {
  const year = new Date().getFullYear();
  const filler = "\u00A0\u200C".repeat(50);
  const previewHtml = preview
    ? `<div style="${s({ display: "none", overflow: "hidden", maxHeight: 0, opacity: 0, fontSize: 1, color: "#f1f5f9", lineHeight: 1 })}" aria-hidden="true">${esc(preview)}${filler}</div>`
    : "";

  const bodyStyle = s({
    backgroundColor: "#f1f5f9", margin: 0, padding: "32px 0",
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
    WebkitTextSizeAdjust: "100%", MozTextSizeAdjust: "100%",
  });
  const cardStyle = s({ backgroundColor: "#ffffff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", maxWidth: 600, width: "100%" });
  const headerStyle = s({ backgroundColor: "#ffffff", padding: "24px 32px 20px", borderBottom: "1px solid #e2e8f0" });
  const logoStyle = s({ display: "inline-block", verticalAlign: "middle", marginRight: 10 });
  const brandStyle = s({ display: "inline-block", verticalAlign: "middle", fontSize: 18, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" });
  const bodyContentStyle = s({ padding: "32px 32px 24px", color: "#334155", fontSize: 15, lineHeight: 1.6 });
  const dividerTdStyle = s({ padding: "0 32px" });
  const hrStyle = s({ border: "none", borderTop: "1px solid #e2e8f0", margin: 0 });
  const footerStyle = s({ padding: "20px 32px 28px", textAlign: "center" });
  const footerTextStyle = s({ fontSize: 12, color: "#94a3b8", margin: "0 0 4px", lineHeight: 1.5 });
  const footerLinkStyle = s({ color: "#94a3b8", textDecoration: "underline" });
  const logoUrl = `${APP_URL}/la-logo-symbol-color.svg`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>LokalAds</title>
</head>
<body style="${bodyStyle}">
${previewHtml}
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${s({ width: "100%", backgroundColor: "#f1f5f9" })}">
<tbody><tr><td align="center" style="${s({ padding: "0 16px" })}">
<table width="600" cellpadding="0" cellspacing="0" role="presentation" style="${cardStyle}">
<tbody>
<tr><td style="${headerStyle}">
<img src="${logoUrl}" alt="LokalAds" width="36" height="36" style="${logoStyle}">
<span style="${brandStyle}">LokalAds</span>
</td></tr>
<tr><td style="${bodyContentStyle}">
${content}
</td></tr>
<tr><td style="${dividerTdStyle}"><hr style="${hrStyle}"></td></tr>
<tr><td style="${footerStyle}">
<p style="${footerTextStyle}">You&#39;re receiving this email because you have an account with LokalAds.</p>
<p style="${footerTextStyle}"><a href="${APP_URL}/privacy" style="${footerLinkStyle}">Privacy Policy</a> &middot; <a href="${APP_URL}/terms" style="${footerLinkStyle}">Terms of Service</a> &middot; <a href="${APP_URL}/cookie" style="${footerLinkStyle}">Cookie Policy</a></p>
<p style="${s({ fontSize: 12, color: "#94a3b8", margin: "8px 0 0", lineHeight: 1.5 })}">&copy; ${year} LokalAds. All rights reserved.</p>
</td></tr>
</tbody>
</table>
</td></tr></tbody>
</table>
</body>
</html>`;
}
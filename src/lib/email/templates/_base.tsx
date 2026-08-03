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

// ── Shared Text Style Tokens ───────────────────────────────────────────────
// Every template's inline text styles must be built from these — never
// hardcode a font-size or text color inline. Enforces the accessibility
// floor: 14px minimum, slate-500 (#64748b) minimum for readable/hint text.
// Sign-off: Gopi, 2026-07-17 — floor every text role to 14px, replace
// slate-400 (#94a3b8) with slate-500 (#64748b) wherever text is meant to be read.
export const emailText = {
  /** Main H1 heading — 22-24px depending on template, kept as override */
  h1: { fontSize: 22, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 } as Record<string, string | number>,
  /** Standard intro/body paragraph */
  body: { fontSize: 15, color: "#0f172a", lineHeight: 1.6 } as Record<string, string | number>,
  /** Bold sub-label, e.g. "Here's what you can do:" */
  label: { fontSize: 14, fontWeight: 600, color: "#334155" } as Record<string, string | number>,
  /** Tip/list row text */
  listRow: { fontSize: 14, color: "#475569", lineHeight: 1.5 } as Record<string, string | number>,
  /** Table label cell, e.g. "Device", "Ticket ID" — was 13px/#94a3b8 */
  tableLabel: { fontSize: 14, fontWeight: 600, color: "#64748b" } as Record<string, string | number>,
  /** Table value cell */
  tableValue: { fontSize: 14, color: "#334155", lineHeight: 1.4 } as Record<string, string | number>,
  /** Uppercase eyebrow label, e.g. "Note", "Reason", "Was"/"Now" — was 12px/#94a3b8 */
  eyebrow: { fontSize: 14, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" } as Record<string, string | number>,
  /** Badge/pill text, e.g. "Weekly Digest" — was 12px */
  badge: { fontSize: 14, fontWeight: 600 } as Record<string, string | number>,
  /** Disclaimer/footnote — the most common role, was 13px (sometimes 11-12px) / #94a3b8 */
  disclaimer: { fontSize: 14, color: "#64748b", lineHeight: 1.5 } as Record<string, string | number>,
  /** Base shell footer text — was 12px/#94a3b8 */
  footer: { fontSize: 14, color: "#334155", lineHeight: 1.5 } as Record<string, string | number>,
  /** Inline text link — use for every in-copy `<a>` (support page, privacy, etc.) */
  link: { color: "#007AFF", textDecoration: "underline" } as Record<string, string | number>,
};

// ── Shared Brand Colors ───────────────────────────────────────────────────
// Single source of truth for the primary CTA color. To rebrand every button
// and link across all 34 templates, change `brand` here only.
export const emailColors = {
  brand: "#2563eb",
  brandContrast: "#ffffff",
};

/**
 * Standard centered CTA button — every template should call this instead of
 * hand-rolling `<a>` button HTML. Pass `opts.bg`/`opts.color` only for
 * context-specific buttons (e.g. a green "success" CTA); default is brand blue.
 * Sized to match LaButton's "default" variant (h-9/px-5/text-sm/font-medium/rounded-full).
 * Pass opts.fontSize/padding to bump up to "big" (16px/14px 24px) where more emphasis is needed.
 */
export function emailButton(
  label: string,
  href: string,
  opts?: { bg?: string; color?: string; fontSize?: number; fontWeight?: number; padding?: string; border?: string }
): string {
  const style = s({
    display: "inline-block",
    backgroundColor: opts?.bg ?? emailColors.brand,
    color: opts?.color ?? emailColors.brandContrast,
    fontSize: opts?.fontSize ?? 14,
    fontWeight: opts?.fontWeight ?? 500,
    textDecoration: "none",
    padding: opts?.padding ?? "10px 20px",
    borderRadius: 100,
    ...(opts?.border ? { border: opts.border } : {}),
  });
  return `<a href="${href}" style="${style}">${label}</a>`;
}

/** Wrap template content in the standard LokalAds email shell — returns full HTML string */
export function baseEmail(content: string, preview?: string): string {
  const year = new Date().getFullYear();
  const filler = "\u00A0\u200C".repeat(50);
  const previewHtml = preview
    ? `<div style="${s({ display: "none", overflow: "hidden", maxHeight: 0, opacity: 0, fontSize: 1, color: "#e2e8f0", lineHeight: 1 })}" aria-hidden="true">${esc(preview)}${filler}</div>`
    : "";

  const bodyStyle = s({
    backgroundColor: "#e2e8f0", margin: 0, padding: "32px 0",
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
    WebkitTextSizeAdjust: "100%", MozTextSizeAdjust: "100%",
  });
  const cardStyle = s({ backgroundColor: "#ffffff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", maxWidth: 600, width: "100%" });
  const headerStyle = s({ backgroundColor: "#ffffff", padding: "24px 32px 20px" });
  // Matches ProfilePageScreen.tsx's identity-card accent stripe exactly:
  // h-1.5 (6px) bg-linear-to-r from-rose-500 (#f43f5e) to-rose-400 (#fb7185).
  // backgroundColor is a solid fallback for Outlook, which can't render backgroundImage gradients.
  const accentBarStyle = s({ height: 6, fontSize: 0, lineHeight: "6px", backgroundColor: "#fb7185", backgroundImage: "linear-gradient(to right, #f43f5e, #fb7185)" });
  const logoStyle = s({ display: "inline-block", verticalAlign: "middle", marginRight: 8 });
  const wordmarkStyle = s({ display: "inline-block", verticalAlign: "middle" });
  const bodyContentStyle = s({ padding: "32px 32px 24px", color: "#334155", fontSize: 15, lineHeight: 1.6 });
  const dividerTdStyle = s({ padding: "0 32px" });
  const hrStyle = s({ border: "none", borderTop: "1px solid #e2e8f0", margin: 0 });
  const footerStyle = s({ backgroundColor: "#f5f5f4", padding: "20px 32px 28px", textAlign: "center" });
  const footerTextStyle = s({ ...emailText.footer, margin: "0 0 4px" });
  const footerLinkStyle = s(emailText.link);
  // Same logo assets as /login's MethodStep.tsx (symbol + wordmark image) — brand consistency
  const logoUrl = `${APP_URL}/assets/la-logo-symbol-color.svg`;
  const wordmarkUrl = `${APP_URL}/assets/la-text-black.svg`;

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
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="${s({ width: "100%", backgroundColor: "#e2e8f0" })}">
<tbody><tr><td align="center" style="${s({ padding: "0 16px" })}">
<table width="600" cellpadding="0" cellspacing="0" role="presentation" style="${cardStyle}">
<tbody>
<tr><td style="${headerStyle}">
<img src="${logoUrl}" alt="LokalAds" width="40" height="40" style="${logoStyle}">
<img src="${wordmarkUrl}" alt="lokalads" width="96" height="24" style="${wordmarkStyle}">
</td></tr>
<tr><td height="6" style="${accentBarStyle}">&nbsp;</td></tr>
<tr><td style="${bodyContentStyle}">
${content}
</td></tr>
<tr><td style="${dividerTdStyle}"><hr style="${hrStyle}"></td></tr>
<tr><td style="${footerStyle}">
<p style="${footerTextStyle}">You&#39;re receiving this email because you have an account with LokalAds.</p>
<p style="${footerTextStyle}"><a href="${APP_URL}/privacy" style="${footerLinkStyle}">Privacy Policy</a> &middot; <a href="${APP_URL}/terms" style="${footerLinkStyle}">Terms of Service</a> &middot; <a href="${APP_URL}/cookie" style="${footerLinkStyle}">Cookie Policy</a></p>
<p style="${s({ ...emailText.footer, margin: "8px 0 0" })}">&copy; ${year} LokalAds. All rights reserved.</p>
</td></tr>
</tbody>
</table>
</td></tr></tbody>
</table>
</body>
</html>`;
}
// ── GDPR Notice Template ──────────────────────────────────────────────────────
// Covers three GDPR / compliance events:
//   data_export_ready — user's data download is ready
//   unsubscribed      — confirmed opt-out from marketing emails
//   resubscribed      — confirmed opt back in
// Plain text fallback: gdprNoticeText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type GdprNoticeData = {
  firstName: string;
  event: "data_export_ready" | "unsubscribed" | "resubscribed";
  downloadUrl?: string;
  expiresIn?: string;
};

const CONFIG = {
  data_export_ready: {
    icon: "📦",
    heading: "Your data export is ready",
    intro:
      "As requested, we've prepared a copy of all the personal data associated with your LokalAds account. Your download link is ready.",
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    noteHeading: "What's included",
    note: "Profile information, listing history, saved searches, alert settings, and message metadata. Passwords and payment details are never included.",
    ctaLabel: "Download My Data",
    ctaBg: "#2563eb",
    showExpiry: true,
    preview: "Your LokalAds data export is ready to download.",
  },
  unsubscribed: {
    icon: "✉️",
    heading: "You've unsubscribed from marketing emails",
    intro:
      "We've received your request and you've been removed from our marketing mailing list. You will no longer receive promotional emails from LokalAds.",
    noteBg: "#f8fafc", noteBorder: "#e2e8f0", noteColor: "#475569",
    noteHeading: "What you'll still receive",
    note: "You will continue to receive transactional emails — such as OTP codes, listing status updates, and security alerts — as these are necessary to run your account.",
    ctaLabel: "Manage Email Preferences",
    ctaBg: "#475569",
    showExpiry: false,
    preview: "You've been unsubscribed from LokalAds marketing emails.",
  },
  resubscribed: {
    icon: "🎉",
    heading: "You're back on our mailing list!",
    intro:
      "Welcome back! You've successfully opted back in to LokalAds marketing emails. You'll now receive tips, product updates, and local deals.",
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    noteHeading: "What to expect",
    note: "We only send useful, relevant content — no spam. You can unsubscribe at any time using the link in any email footer.",
    ctaLabel: "Manage Email Preferences",
    ctaBg: "#16a34a",
    showExpiry: false,
    preview: "You've re-subscribed to LokalAds emails.",
  },
} as const;

export function GdprNoticeEmail(data: GdprNoticeData): string {
  const cfg = CONFIG[data.event];
  const expiryBlock =
    cfg.showExpiry && data.expiresIn
      ? `<div style="${s({ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 20px", marginBottom: 20 })}"><p style="${s({ fontSize: 14, color: "#92400e", margin: 0 })}">⚠️ This download link expires in <strong>${esc(data.expiresIn)}</strong>. After that, you'll need to submit a new request.</p></div>`
      : "";
  const ctaUrl = cfg.showExpiry && data.downloadUrl
    ? (data.downloadUrl.startsWith("http") ? data.downloadUrl : `${APP_URL}${data.downloadUrl}`)
    : `${APP_URL}/profile`;

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">Hi ${esc(data.firstName)}, ${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">${cfg.intro}</p>
${expiryBlock}
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: cfg.noteColor, margin: "0 0 6px" })}">${cfg.noteHeading}</p>
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${esc(ctaUrl)}" style="${s({ display: "inline-block", backgroundColor: cfg.ctaBg, color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${cfg.ctaLabel}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">For any data-related queries, contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a>.</p>
`;
  return baseEmail(content, cfg.preview);
}

export function gdprNoticeText(data: GdprNoticeData): string {
  const cfg = CONFIG[data.event];
  const ctaUrl = cfg.showExpiry && data.downloadUrl
    ? (data.downloadUrl.startsWith("http") ? data.downloadUrl : `${APP_URL}${data.downloadUrl}`)
    : `${APP_URL}/profile`;
  const lines = [`Hi ${data.firstName}, ${cfg.heading}`, "", cfg.intro];
  if (cfg.showExpiry && data.expiresIn) lines.push("", `Link expires: ${data.expiresIn}`);
  lines.push("", cfg.noteHeading, cfg.note, "", `${cfg.ctaLabel}: ${ctaUrl}`);
  return lines.join("\n");
}

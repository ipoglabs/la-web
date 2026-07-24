// ── Platform Notice Template ──────────────────────────────────────────────────
// Sent for three platform-level notifications:
// tos (Terms of Service updated), privacy (Privacy Policy updated),
// maintenance (scheduled downtime).
// Plain text fallback: platformNoticeText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type PlatformNoticeData = {
  type: "tos" | "privacy" | "maintenance";
  effectiveDate?: string;
  maintenanceWindow?: string;
  maintenanceDate?: string;
};

const CONFIG = {
  tos: {
    icon: "📜",
    heading: "Our Terms of Service have been updated",
    intro: "We've updated our Terms of Service. Please take a moment to review the changes.",
    noteHeading: "What you need to know",
    note: "By continuing to use LokalAds after the effective date, you agree to the updated Terms of Service.",
    ctaLabel: "Read Updated Terms", ctaUrl: "/terms", ctaBg: "#2563eb",
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    preview: "LokalAds Terms of Service have been updated.",
    dateLabel: "Effective date",
  },
  privacy: {
    icon: "🔒",
    heading: "Our Privacy Policy has been updated",
    intro: "We've updated our Privacy Policy to reflect changes in how we handle your data.",
    noteHeading: "Your privacy matters",
    note: "By continuing to use LokalAds after the effective date, you agree to the updated Privacy Policy.",
    ctaLabel: "Read Privacy Policy", ctaUrl: "/privacy", ctaBg: "#2563eb",
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    preview: "LokalAds Privacy Policy has been updated.",
    dateLabel: "Effective date",
  },
  maintenance: {
    icon: "🔧",
    heading: "Scheduled maintenance notice",
    intro: "We'll be performing scheduled maintenance to improve performance and reliability. LokalAds will be temporarily unavailable during this time.",
    noteHeading: "Plan ahead",
    note: "We apologise for any inconvenience. Maintenance windows are kept as short as possible.",
    ctaLabel: "View Status Page", ctaUrl: "/support", ctaBg: "#475569",
    noteBg: "#fffbeb", noteBorder: "#fde68a", noteColor: "#92400e",
    preview: "LokalAds scheduled maintenance coming up — plan ahead.",
    dateLabel: "Date",
  },
} as const;

export function PlatformNoticeEmail(data: PlatformNoticeData): string {
  const cfg = CONFIG[data.type];
  const dateValue = data.type === "maintenance" ? data.maintenanceDate : data.effectiveDate;
  const windowValue = data.type === "maintenance" ? data.maintenanceWindow : undefined;

  const dateBlock = dateValue
    ? `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
        <table cellpadding="0" cellspacing="0" style="width:100%"><tbody>
          <tr>
            <td style="${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", paddingBottom: windowValue ? 10 : 0, paddingRight: 16, verticalAlign: "middle", width: 120 })}">${cfg.dateLabel}</td>
            <td style="${s({ fontSize: 15, fontWeight: 600, color: "#0f172a", paddingBottom: windowValue ? 10 : 0, verticalAlign: "middle" })}">${esc(dateValue)}</td>
          </tr>
          ${windowValue ? `<tr><td style="${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", paddingRight: 16, verticalAlign: "middle" })}">Duration</td><td style="${s({ fontSize: 15, fontWeight: 600, color: "#0f172a", verticalAlign: "middle" })}">${esc(windowValue)}</td></tr>` : ""}
        </tbody></table>
      </div>`
    : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">${cfg.intro}</p>
${dateBlock}
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: cfg.noteColor, margin: "0 0 4px" })}">${cfg.noteHeading}</p>
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}${cfg.ctaUrl}" style="${s({ display: "inline-block", backgroundColor: cfg.ctaBg, color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${cfg.ctaLabel}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">Questions? Contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a>.</p>
`;
  return baseEmail(content, cfg.preview);
}

export function platformNoticeText(data: PlatformNoticeData): string {
  const cfg = CONFIG[data.type];
  const lines = [cfg.heading, "", cfg.intro];
  const dateValue = data.type === "maintenance" ? data.maintenanceDate : data.effectiveDate;
  if (dateValue) lines.push("", `${cfg.dateLabel}: ${dateValue}`);
  if (data.maintenanceWindow) lines.push(`Duration: ${data.maintenanceWindow}`);
  lines.push("", cfg.note, "", `${cfg.ctaLabel}: ${APP_URL}${cfg.ctaUrl}`);
  return lines.join("\n");
}

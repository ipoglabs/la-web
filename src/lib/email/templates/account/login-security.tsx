// ── Login Security Template ───────────────────────────────────────────────────
// Sent when a login is attempted from an unrecognised device, or when the
// account is locked after too many failed attempts.
// Plain text fallback: loginSecurityText()

import { baseEmail, s, esc, APP_URL } from "../_base";

type LoginSecurityData = {
  event: "unrecognised_device" | "account_locked";
  ip?: string;
  device?: string;
};

const CONFIG = {
  unrecognised_device: {
    icon: "🔒",
    heading: "New sign-in to your account",
    intro:
      "We noticed a sign-in to your LokalAds account from an unrecognised device or location. If this was you, no action is needed.",
    alertBg: "#fffbeb",
    alertBorder: "#fde68a",
    alertColor: "#92400e",
    alertHeading: "Wasn't you?",
    alertBody:
      "Secure your account immediately by changing your password and revoking any unfamiliar sessions.",
    cta: "Secure My Account",
    ctaUrl: "/profile",
    ctaBg: "#d97706",
    preview: "New sign-in detected on your LokalAds account.",
  },
  account_locked: {
    icon: "🚫",
    heading: "Your account has been locked",
    intro:
      "We've temporarily locked your account after several failed sign-in attempts. This is to protect your account from unauthorised access.",
    alertBg: "#fef2f2",
    alertBorder: "#fecaca",
    alertColor: "#991b1b",
    alertHeading: "What to do next",
    alertBody:
      "Reset your password using the button below. Your account will be unlocked once you set a new password.",
    cta: "Reset My Password",
    ctaUrl: "/login",
    ctaBg: "#dc2626",
    preview: "Your LokalAds account has been temporarily locked.",
  },
} as const;

export function LoginSecurityEmail(data: LoginSecurityData): string {
  const cfg = CONFIG[data.event];
  const detailRows = [
    data.device ? `<tr><td style="${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", paddingBottom: 8, paddingRight: 16, verticalAlign: "top", width: 80 })}">Device</td><td style="${s({ fontSize: 14, color: "#334155", paddingBottom: 8, lineHeight: 1.4 })}">${esc(data.device)}</td></tr>` : "",
    data.ip ? `<tr><td style="${s({ fontSize: 13, fontWeight: 600, color: "#94a3b8", paddingBottom: 8, paddingRight: 16, verticalAlign: "top", width: 80 })}">IP Address</td><td style="${s({ fontSize: 14, color: "#334155", paddingBottom: 8, lineHeight: 1.4 })}">${esc(data.ip)}</td></tr>` : "",
  ].filter(Boolean).join("");

  const detailBlock = detailRows
    ? `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}"><table cellpadding="0" cellspacing="0" style="width:100%"><tbody>${detailRows}</tbody></table></div>`
    : "";

  const content = `
<div style="${s({ marginBottom: 16 })}"><span style="${s({ fontSize: 32 })}">${cfg.icon}</span></div>
<h1 style="${s({ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.3 })}">${cfg.heading}</h1>
<p style="${s({ fontSize: 15, color: "#475569", margin: "0 0 20px", lineHeight: 1.6 })}">${cfg.intro}</p>
${detailBlock}
<div style="${s({ backgroundColor: cfg.alertBg, border: `1px solid ${cfg.alertBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: cfg.alertColor, margin: "0 0 6px" })}">${cfg.alertHeading}</p>
  <p style="${s({ fontSize: 14, color: cfg.alertColor, margin: 0, lineHeight: 1.5 })}">${cfg.alertBody}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  <a href="${APP_URL}${cfg.ctaUrl}" style="${s({ display: "inline-block", backgroundColor: cfg.ctaBg, color: "#ffffff", fontSize: 15, fontWeight: 600, textDecoration: "none", padding: "12px 28px", borderRadius: 8 })}">${cfg.cta}</a>
</div>
<p style="${s({ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 })}">If you need help, contact us at <a href="${APP_URL}/support" style="${s({ color: "#2563eb", textDecoration: "underline" })}">our support page</a>.</p>
`;
  return baseEmail(content, cfg.preview);
}

export function loginSecurityText(data: LoginSecurityData): string {
  const cfg = CONFIG[data.event];
  const lines = [cfg.heading, "", cfg.intro, ""];
  if (data.device) lines.push(`Device: ${data.device}`);
  if (data.ip) lines.push(`IP: ${data.ip}`);
  if (data.device || data.ip) lines.push("");
  lines.push(cfg.alertHeading, cfg.alertBody, "", `${cfg.cta}: ${APP_URL}${cfg.ctaUrl}`);
  return lines.join("\n");
}

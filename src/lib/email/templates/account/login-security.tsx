// ── Login Security Template ───────────────────────────────────────────────────
// Sent when a login is attempted from an unrecognised device, or when the
// account is locked after too many failed attempts.
// Plain text fallback: loginSecurityText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

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
    data.device ? `<tr><td style="${s({ ...emailText.tableLabel, paddingBottom: 8, paddingRight: 16, verticalAlign: "top", width: 80 })}">Device</td><td style="${s({ fontSize: 14, color: "#334155", paddingBottom: 8, lineHeight: 1.4 })}">${esc(data.device)}</td></tr>` : "",
    data.ip ? `<tr><td style="${s({ ...emailText.tableLabel, paddingBottom: 8, paddingRight: 16, verticalAlign: "top", width: 80 })}">IP Address</td><td style="${s({ fontSize: 14, color: "#334155", paddingBottom: 8, lineHeight: 1.4 })}">${esc(data.ip)}</td></tr>` : "",
  ].filter(Boolean).join("");

  const detailBlock = detailRows
    ? `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}"><table cellpadding="0" cellspacing="0" style="width:100%"><tbody>${detailRows}</tbody></table></div>`
    : "";

  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">${cfg.icon} ${cfg.heading}</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">${cfg.intro}</p>
${detailBlock}
<div style="${s({ backgroundColor: cfg.alertBg, border: `1px solid ${cfg.alertBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: cfg.alertColor, margin: "0 0 6px" })}">${cfg.alertHeading}</p>
  <p style="${s({ fontSize: 14, color: cfg.alertColor, margin: 0, lineHeight: 1.5 })}">${cfg.alertBody}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton(cfg.cta, `${APP_URL}${cfg.ctaUrl}`, { bg: cfg.ctaBg })}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">If you need help, contact us at <a href="${APP_URL}/support" style="${s(emailText.link)}">our support page</a>.</p>
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

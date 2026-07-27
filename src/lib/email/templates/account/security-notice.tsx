// ── Security Notice Template ──────────────────────────────────────────────────
// Covers two security confirmation events:
//   signed_out_all — user chose "sign out of all devices"
//   device_trusted  — user explicitly marked a device as trusted
// Plain text fallback: securityNoticeText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type SecurityNoticeData = {
  firstName: string;
  event: "signed_out_all" | "device_trusted";
  device?: string;
};

const CONFIG = {
  signed_out_all: {
    icon: "🔐",
    heading: "You've been signed out of all devices",
    intro:
      "As requested, you've been signed out of every device and session connected to your LokalAds account.",
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    noteHeading: "You're now secure",
    note: "Only the device you used to trigger this action remains active (if applicable). Sign in again on any device when you're ready.",
    alertBg: "#fffbeb", alertBorder: "#fde68a", alertColor: "#92400e",
    alertNote: "If you did not request this, your account may have been accessed without your knowledge. Reset your password immediately.",
    ctaLabel: "Reset My Password",
    ctaUrl: "/login",
    ctaBg: "#d97706",
    preview: "You've been signed out of all devices on your LokalAds account.",
  },
  device_trusted: {
    icon: "✅",
    heading: "Device saved as trusted",
    intro:
      "You've marked a device as trusted on your LokalAds account. Future sign-ins from this device won't require additional verification.",
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    noteHeading: "What does trusted mean?",
    note: "Trusted devices skip the unrecognised-device security check. Only mark devices you personally own and control.",
    alertBg: "#fffbeb", alertBorder: "#fde68a", alertColor: "#92400e",
    alertNote: "Didn't do this? Remove the device immediately from your security settings and reset your password.",
    ctaLabel: "Manage Trusted Devices",
    ctaUrl: "/profile",
    ctaBg: "#16a34a",
    preview: "A new device has been saved as trusted on your LokalAds account.",
  },
} as const;

export function SecurityNoticeEmail(data: SecurityNoticeData): string {
  const cfg = CONFIG[data.event];
  const deviceBlock = data.device
    ? `<div style="${s({ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
        <p style="${s({ ...emailText.eyebrow, margin: "0 0 4px" })}">Device</p>
        <p style="${s({ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: 0 })}">${esc(data.device)}</p>
      </div>`
    : "";

  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">${cfg.icon} Hi ${esc(data.firstName)}, ${cfg.heading}</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">${cfg.intro}</p>
${deviceBlock}
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 })}">
  <p style="${s({ fontSize: 14, fontWeight: 600, color: cfg.noteColor, margin: "0 0 4px" })}">${cfg.noteHeading}</p>
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ backgroundColor: cfg.alertBg, border: `1px solid ${cfg.alertBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: cfg.alertColor, margin: 0, lineHeight: 1.5 })}">${cfg.alertNote}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton(cfg.ctaLabel, `${APP_URL}${cfg.ctaUrl}`, { bg: cfg.ctaBg })}
</div>
<p style="${s({ ...emailText.disclaimer, margin: 0 })}">Need help? Contact us at <a href="${APP_URL}/support" style="${s(emailText.link)}">our support page</a>.</p>
`;
  return baseEmail(content, cfg.preview);
}

export function securityNoticeText(data: SecurityNoticeData): string {
  const cfg = CONFIG[data.event];
  const lines = [`Hi ${data.firstName}, ${cfg.heading}`, "", cfg.intro];
  if (data.device) lines.push("", `Device: ${data.device}`);
  lines.push("", cfg.note, "", cfg.alertNote, "", `${cfg.ctaLabel}: ${APP_URL}${cfg.ctaUrl}`);
  return lines.join("\n");
}

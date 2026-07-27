// ── Chat Notification Template ────────────────────────────────────────────────
// Sent for three chat events: new_message, reply_received, deal_confirmed.
// Plain text fallback: chatNotificationText()

import { baseEmail, s, esc, APP_URL, emailText, emailButton } from "../_base";

type ChatNotificationData = {
  firstName: string;
  senderName: string;
  listingTitle: string;
  previewText: string;
  chatUrl: string;
  event: "new_message" | "reply_received" | "deal_confirmed";
};

const CONFIG = {
  new_message: {
    icon: "💬",
    heading: (d: ChatNotificationData) => `${esc(d.senderName)} sent you a message`,
    intro: (d: ChatNotificationData) =>
      `You have a new message about <strong style="${s({ color: "#0f172a" })}">${esc(d.listingTitle)}</strong>.`,
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    note: "Reply quickly — buyers who get fast responses are more likely to complete a deal.",
    ctaLabel: "Reply Now", ctaBg: "#2563eb",
    preview: (d: ChatNotificationData) => `${d.senderName} sent you a message about "${d.listingTitle}".`,
  },
  reply_received: {
    icon: "↩️",
    heading: (d: ChatNotificationData) => `${esc(d.senderName)} replied to you`,
    intro: (d: ChatNotificationData) =>
      `You got a reply about <strong style="${s({ color: "#0f172a" })}">${esc(d.listingTitle)}</strong>.`,
    noteBg: "#eff6ff", noteBorder: "#bfdbfe", noteColor: "#1e40af",
    note: "Keep the conversation going — the deal is just a few messages away.",
    ctaLabel: "View Reply", ctaBg: "#2563eb",
    preview: (d: ChatNotificationData) => `${d.senderName} replied to your message.`,
  },
  deal_confirmed: {
    icon: "🤝",
    heading: () => `Deal confirmed!`,
    intro: (d: ChatNotificationData) =>
      `You and <strong style="${s({ color: "#0f172a" })}">${esc(d.senderName)}</strong> have confirmed a deal for <strong style="${s({ color: "#0f172a" })}">${esc(d.listingTitle)}</strong>. Congratulations!`,
    noteBg: "#f0fdf4", noteBorder: "#bbf7d0", noteColor: "#15803d",
    note: "Arrange a safe meeting place and inspect the item before exchanging payment.",
    ctaLabel: "View Chat", ctaBg: "#16a34a",
    preview: (d: ChatNotificationData) => `Deal confirmed with ${d.senderName} for "${d.listingTitle}"!`,
  },
} as const;

export function ChatNotificationEmail(data: ChatNotificationData): string {
  const cfg = CONFIG[data.event];
  const chatUrl = data.chatUrl.startsWith("http") ? data.chatUrl : `${APP_URL}${data.chatUrl}`;

  const content = `
<h1 style="${s({ ...emailText.h1, margin: "0 0 12px" })}">${cfg.icon} Hi ${esc(data.firstName)}, ${cfg.heading(data)}</h1>
<p style="${s({ ...emailText.body, margin: "0 0 20px" })}">${cfg.intro(data)}</p>
<div style="${s({ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 20px", marginBottom: 20 })}">
  <p style="${s({ ...emailText.eyebrow, margin: "0 0 8px" })}">Message preview</p>
  <p style="${s({ fontSize: 15, color: "#334155", margin: 0, lineHeight: 1.6, fontStyle: "italic" })}">&ldquo;${esc(data.previewText)}&rdquo;</p>
</div>
<div style="${s({ backgroundColor: cfg.noteBg, border: `1px solid ${cfg.noteBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 24 })}">
  <p style="${s({ fontSize: 14, color: cfg.noteColor, margin: 0, lineHeight: 1.5 })}">${cfg.note}</p>
</div>
<div style="${s({ textAlign: "center", marginBottom: 24 })}">
  ${emailButton(cfg.ctaLabel, esc(chatUrl), { bg: cfg.ctaBg })}
</div>
`;
  return baseEmail(content, cfg.preview(data));
}

export function chatNotificationText(data: ChatNotificationData): string {
  const cfg = CONFIG[data.event];
  const chatUrl = data.chatUrl.startsWith("http") ? data.chatUrl : `${APP_URL}${data.chatUrl}`;
  return [
    `Hi ${data.firstName}, ${cfg.heading(data)}`,
    "",
    cfg.intro(data).replace(/<[^>]+>/g, ""),
    "",
    `"${data.previewText}"`,
    "",
    `${cfg.ctaLabel}: ${chatUrl}`,
  ].join("\n");
}

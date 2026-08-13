/**
 * lib/whatsapp.ts
 *
 * Thin wrapper around Twilio's Messages API for sending WhatsApp alert
 * notifications. Separate from twilioVerify.ts (which only ever talks to
 * Twilio Verify for OTP codes) — this sends business-initiated messages
 * instead, so it needs the plain Messages resource.
 *
 * Only activates when TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
 * TWILIO_WHATSAPP_NUMBER and TWILIO_WHATSAPP_ALERT_CONTENT_SID are all set —
 * callers should check isWhatsAppConfigured() (or just call
 * sendWhatsAppMessage and check the boolean result) rather than assuming
 * delivery succeeded.
 *
 * WhatsApp Business messaging that isn't a reply within the 24h
 * customer-service window requires a Meta-approved message template — a
 * plain `body` string is rejected by Meta for business-initiated sends
 * like alert notifications. TWILIO_WHATSAPP_ALERT_CONTENT_SID must point to
 * an APPROVED Content template (Twilio console → Content Editor →
 * "alert_match_notification"); its body is:
 *   "LokalAds Alert: {{1}}. View the full listing here: {{2}}. Thanks for using LokalAds!"
 * {{1}} = `summary`, {{2}} = `url`. alert_match_notification_v3 was approved
 * by Meta on 2026-08-12 — TWILIO_WHATSAPP_ALERT_CONTENT_SID is set to its SID.
 */
import Twilio from "twilio";

let cachedClient: ReturnType<typeof Twilio> | null = null;

export function isWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_NUMBER &&
      process.env.TWILIO_WHATSAPP_ALERT_CONTENT_SID
  );
}

function getClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error("Twilio is not configured — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN.");
  }
  if (!cachedClient) cachedClient = Twilio(sid, token);
  return cachedClient;
}

/**
 * Sends a WhatsApp alert notification to `to` (must already be E.164, e.g.
 * "+6591234567") via the approved `alert_match_notification` Content
 * template — `summary` fills {{1}}, `url` fills {{2}}. Returns false
 * (instead of throwing) on any failure — callers treat WhatsApp delivery as
 * best-effort alongside email, not a hard dependency.
 */
export async function sendWhatsAppMessage(to: string, summary: string, url: string): Promise<boolean> {
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  const contentSid = process.env.TWILIO_WHATSAPP_ALERT_CONTENT_SID;
  if (!isWhatsAppConfigured() || !from || !contentSid) return false;

  try {
    await getClient().messages.create({
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
      contentSid,
      contentVariables: JSON.stringify({ "1": summary, "2": url }),
    });
    return true;
  } catch (err) {
    console.error("[whatsapp] send error:", err);
    return false;
  }
}

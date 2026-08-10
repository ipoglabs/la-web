/**
 * lib/whatsapp.ts
 *
 * Thin wrapper around Twilio's Messages API for sending WhatsApp alert
 * notifications. Separate from twilioVerify.ts (which only ever talks to
 * Twilio Verify for OTP codes) — this sends free-form, business-initiated
 * messages instead, so it needs the plain Messages resource.
 *
 * Only activates when TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and
 * TWILIO_WHATSAPP_NUMBER are all set — callers should check
 * isWhatsAppConfigured() (or just call sendWhatsAppMessage and check the
 * boolean result) rather than assuming delivery succeeded.
 *
 * NOTE: WhatsApp Business messaging that isn't a reply within the 24h
 * customer-service window requires a Meta-approved message template
 * (Twilio Content API `contentSid`/`contentVariables`) in production —
 * a plain `body` string only works in the Twilio sandbox or inside that
 * 24h window. Once a template is approved in the Twilio console, swap the
 * `body` param below for `contentSid`/`contentVariables`.
 */
import Twilio from "twilio";

let cachedClient: ReturnType<typeof Twilio> | null = null;

export function isWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER
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
 * Sends a WhatsApp text message to `to` (must already be E.164, e.g.
 * "+6591234567"). Returns false (instead of throwing) on any failure —
 * callers treat WhatsApp delivery as best-effort alongside email, not a
 * hard dependency.
 */
export async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!isWhatsAppConfigured() || !from) return false;

  try {
    await getClient().messages.create({
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
      body,
    });
    return true;
  } catch (err) {
    console.error("[whatsapp] send error:", err);
    return false;
  }
}

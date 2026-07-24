/**
 * lib/twilioVerify.ts
 *
 * Thin wrapper around Twilio's Verify API (the same approach la-web/develop
 * uses for phone OTP — see `app/api/sms/{send,verify}-otp` there) rather
 * than raw SMS + our own generated code: Twilio Verify owns code
 * generation, delivery, expiry, and attempt-limiting on their side, so
 * `otpService.ts` only needs to ask "send a code to this number" / "does
 * this code match" — no Mongo-stored code for the phone channel.
 *
 * Only activates when all three env vars are set (TWILIO_ACCOUNT_SID,
 * TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID) — see otpService.ts for the
 * fallback (dev-mode Mongo-generated code) when they're absent.
 */
import Twilio from "twilio";

let cachedClient: ReturnType<typeof Twilio> | null = null;

export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SID
  );
}

function getVerifyService() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = process.env.TWILIO_VERIFY_SID;

  if (!sid || !token || !verifySid) {
    throw new Error("Twilio is not configured — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID.");
  }

  if (!cachedClient) cachedClient = Twilio(sid, token);
  return cachedClient.verify.v2.services(verifySid);
}

/** Sends a 6-digit SMS code to `to` (must already be E.164, e.g. "+6591234567"). */
export async function sendVerificationSms(to: string): Promise<void> {
  try {
    await getVerifyService().verifications.create({ to, channel: "sms" });
  } catch (err) {
    console.error("Twilio verification send error:", err);
    // 60200 = invalid parameter (usually a malformed phone number)
    const code = (err as { code?: number })?.code;
    throw new Error(code === 60200 ? "Enter a valid phone number, including country code." : "Failed to send verification code.");
  }
}

/** True if `code` matches the most recently sent verification for `to`. */
export async function checkVerificationCode(to: string, code: string): Promise<boolean> {
  try {
    const result = await getVerifyService().verificationChecks.create({ to, code });
    return result.status === "approved";
  } catch (err) {
    console.error("Twilio verification check error:", err);
    const msg = String((err as { message?: string })?.message || "").toLowerCase();
    if (msg.includes("max check attempts")) throw new Error("Too many attempts. Request a new code.");
    if (msg.includes("not found") || msg.includes("expired")) throw new Error("This code has expired — request a new one.");
    throw new Error("Verification failed. Please try again.");
  }
}

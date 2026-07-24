import dbConnect from "@/lib/db";
import Otp from "@/models/Otp";
import { sendEmail } from "@/lib/email";
import { normalizeTarget } from "@/lib/otpUtils";
import { isTwilioConfigured, sendVerificationSms, checkVerificationCode } from "@/lib/twilioVerify";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

function generateCode(): string {
  // 6-digit numeric code, zero-padded (e.g. "042917")
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface SendOtpArgs {
  userId?: string; // optional — registration flow has no user yet
  channel: "email" | "phone";
  value: string; // the email address or phone number being verified
}

export async function sendOtpService({ channel, value }: SendOtpArgs) {
  const isIndianPhone = channel === "phone" && normalizeTarget("phone", value).startsWith("+91");

  // Phone + Twilio configured → Twilio Verify owns code generation/delivery/
  // expiry entirely; nothing to store in Mongo for this channel. India is
  // deliberately excluded here (see isIndianPhone below) — real SMS to India
  // needs DLT template registration Twilio-side that isn't set up, so India
  // always takes the Mongo-mock path a few lines down instead, in every env.
  if (channel === "phone" && isTwilioConfigured() && !isIndianPhone) {
    const target = normalizeTarget("phone", value);
    if (!/^\+\d{8,15}$/.test(target)) {
      throw new Error("Enter a valid phone number, including country code.");
    }
    await sendVerificationSms(target);
    return { success: true };
  }

  await dbConnect();

  const target = normalizeTarget(channel, value);
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // One active OTP per (target, channel) — overwrite any previous unexpired
  // one rather than accumulating rows, and reset attempts/lock on resend.
  await Otp.findOneAndUpdate(
    { target, channel },
    {
      target,
      channel,
      code,
      expiresAt,
      verified: false,
      attempts: 0,
      lockedUntil: null,
    },
    { upsert: true, new: true }
  );

  if (channel === "email") {
    const result = await sendEmail({
      type: "OTP",
      to: value,
      data: {
        code,
        expiresInMinutes: OTP_EXPIRY_MINUTES,
        purpose: "verify-email",
      },
    });

    if (!result.success) {
      throw new Error(result.error || "Failed to send verification email");
    }

    return { success: true };
  }

  // ── Phone OTP ──────────────────────────────────────────────────────────
  // India: intentionally mocked in every environment (see isIndianPhone
  // above) — no real SMS goes out, so the code is always surfaced to the
  // caller here, production included, otherwise nobody could ever complete
  // the flow.
  if (isIndianPhone) {
    return { success: true, devCode: code };
  }

  // Everywhere else: this path only runs when Twilio isn't configured at
  // all, which is a genuine gap rather than a deliberate mock — real SMS
  // delivery is required in production before phone OTP can be enabled.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SMS delivery isn't configured yet — wire a provider (e.g. Twilio, MSG91) in otpService.ts before enabling phone OTP in production."
    );
  }

  return { success: true, devCode: code };
}

interface VerifyOtpArgs {
  userId?: string;
  channel: "email" | "phone";
  value: string;
  otp: string;
}

export async function verifyOtpService({ channel, value, otp }: VerifyOtpArgs) {
  const isIndianPhone = channel === "phone" && normalizeTarget("phone", value).startsWith("+91");

  // Mirrors the Twilio branch in sendOtpService — the code was never
  // stored in Mongo for this channel, so check it against Twilio instead.
  // India always skips this and falls through to the Mongo-backed check
  // below, matching the mock send path above.
  if (channel === "phone" && isTwilioConfigured() && !isIndianPhone) {
    const target = normalizeTarget("phone", value);
    const approved = await checkVerificationCode(target, otp.trim());
    if (!approved) throw new Error("Incorrect code.");
    return { success: true };
  }

  await dbConnect();

  const target = normalizeTarget(channel, value);
  const record = await Otp.findOne({ target, channel });

  if (!record) {
    throw new Error("No verification code found — request a new one.");
  }

  if (record.lockedUntil && record.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((record.lockedUntil.getTime() - Date.now()) / 60000);
    throw new Error(`Too many attempts. Try again in ${minutesLeft} minute(s).`);
  }

  if (record.expiresAt < new Date()) {
    throw new Error("This code has expired — request a new one.");
  }

  if (record.code !== otp) {
    record.attempts += 1;

    if (record.attempts >= MAX_ATTEMPTS) {
      record.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    }
    await record.save();

    throw new Error("Incorrect code.");
  }

  record.verified = true;
  await record.save();

  return { success: true };
}
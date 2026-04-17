import User from "@/models/user";
import Otp from "@/models/Otp";
import { generateOtp } from "@/lib/generateOtp";
import { sendEmailOtp } from "@/lib/sendEmailOtp";
import {
  normalizeTarget,
  OTP_EXPIRE_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_LOCK_MINUTES,
} from "@/lib/otpUtils";

type Channel = "email" | "phone";

/* =========================================================
   SEND OTP (REGISTER + PROFILE)
========================================================= */
export async function sendOtpService({
  userId,
  channel,
  value,
}: {
  userId?: string;
  channel: Channel;
  value: string;
}) {
  const normalized = normalizeTarget(channel, value);
  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

  /* ================= STORE IN OTP COLLECTION ================= */
  await Otp.findOneAndUpdate(
    { target: normalized },
    {
      channel,
      code: otp,
      expiresAt,
      verified: false,
      attempts: 0,
      lockedUntil: null,
    },
    { upsert: true, new: true }
  );

  console.log("OTP:", normalized, otp);

  if (channel === "email") {
    await sendEmailOtp(normalized, otp);
  } else {
    console.log(`📱 OTP for ${normalized}: ${otp}`);
  }

  return { success: true };
}

/* =========================================================
   VERIFY OTP (REGISTER + PROFILE)
========================================================= */
export async function verifyOtpService({
  userId,
  channel,
  value,
  otp,
}: {
  userId?: string;
  channel: Channel;
  value: string;
  otp: string;
}) {
  const normalized = normalizeTarget(channel, value);

  const record: any = await Otp.findOne({ target: normalized });

  if (!record) {
    throw new Error("No OTP found. Please resend.");
  }

  /* ================= LOCK CHECK ================= */
  if (
    record.lockedUntil &&
    Date.now() < new Date(record.lockedUntil).getTime()
  ) {
    throw new Error("Too many attempts. Try later.");
  }

  /* ================= EXPIRY ================= */
  if (Date.now() > new Date(record.expiresAt).getTime()) {
    throw new Error("OTP expired.");
  }

  const ok = String(otp).trim() === record.code;

  if (!ok) {
    record.attempts = (record.attempts || 0) + 1;

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      record.lockedUntil = new Date(
        Date.now() + OTP_LOCK_MINUTES * 60 * 1000
      );
    }

    await record.save();

    throw new Error("Invalid OTP");
  }

  /* ================= SUCCESS ================= */
  record.verified = true;
  record.attempts = 0;
  record.lockedUntil = null;

  await record.save();

  return { success: true };
}
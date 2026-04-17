import User from "@/models/user";
import otpStore from "@/lib/otpStore";
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
   SEND OTP
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

  const expiresAt = Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000;

  /* ================= REGISTER FLOW ================= */
  if (!userId) {
    otpStore[normalized] = {
      otp,
      expiresAt,
      verified: false,
      attempts: 0,
      lockedUntil: null,
    };

    console.log("REGISTER OTP:", normalized, otp);

    if (channel === "email") {
      await sendEmailOtp(normalized, otp);
    }

    return { success: true };
  }

  /* ================= PROFILE FLOW ================= */
  const user: any = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.otp = {
    channel,
    target: normalized,
    code: otp,
    expiresAt: new Date(expiresAt),
    verified: false,
    attempts: 0,
    lockedUntil: null,
  };

  await user.save();

  if (channel === "email") {
    await sendEmailOtp(normalized, otp);
  } else {
    console.log(`📱 OTP for ${normalized}: ${otp}`);
  }

  return { success: true };
}

/* =========================================================
   VERIFY OTP
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

  /* ================= REGISTER FLOW ================= */
  if (!userId) {
    const rec = otpStore[normalized];

    if (!rec) throw new Error("No OTP found. Please resend.");

    if (Date.now() > rec.expiresAt) {
      throw new Error("OTP expired.");
    }

    const ok = String(otp).trim() === rec.otp;

    if (!ok) {
      rec.attempts = (rec.attempts || 0) + 1;

      if (rec.attempts >= OTP_MAX_ATTEMPTS) {
        rec.lockedUntil =
          Date.now() + OTP_LOCK_MINUTES * 60 * 1000;
      }

      throw new Error("Invalid OTP");
    }

    rec.verified = true;

    return { success: true };
  }

  /* ================= PROFILE FLOW ================= */
  const user: any = await User.findById(userId);

  if (!user || !user.otp) {
    throw new Error("No OTP found. Please resend.");
  }

  const stored = user.otp;

  if (stored.channel !== channel || stored.target !== normalized) {
    throw new Error("OTP mismatch. Please resend.");
  }

  if (
    stored.lockedUntil &&
    Date.now() < new Date(stored.lockedUntil).getTime()
  ) {
    throw new Error("Too many attempts. Try later.");
  }

  if (Date.now() > new Date(stored.expiresAt).getTime()) {
    throw new Error("OTP expired.");
  }

  const ok = String(otp).trim() === stored.code;

  if (!ok) {
    stored.attempts = (stored.attempts || 0) + 1;

    if (stored.attempts >= OTP_MAX_ATTEMPTS) {
      stored.lockedUntil = new Date(
        Date.now() + OTP_LOCK_MINUTES * 60 * 1000
      );
    }

    await user.save();

    throw new Error("Invalid OTP");
  }

  stored.verified = true;
  stored.attempts = 0;
  stored.lockedUntil = null;

  await user.save();

  return { success: true };
}
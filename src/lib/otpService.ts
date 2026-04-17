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

/* ================= SEND OTP ================= */
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

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000
  );

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

/* ================= VERIFY OTP ================= */
export async function verifyOtpService({
  channel,
  value,
  otp,
}: {
  userId?: string;
  channel: Channel;
  value: string;
  otp: string;
}) {
  if (!value || !otp) {
    throw new Error("Invalid request");
  }

  /* ================= NORMALIZE ================= */
  const normalized = normalizeTarget(channel, value);

  console.log("🔍 VERIFY START", {
    inputValue: value,
    normalized,
    inputOtp: otp,
  });

  /* ================= FETCH RECORD ================= */
  const record: any = await Otp.findOne({ target: normalized });

  if (!record) {
    console.log("❌ NO OTP RECORD FOUND", normalized);
    throw new Error("No OTP found. Please resend.");
  }

  console.log("📦 OTP RECORD", {
    storedOtp: record.code,
    expiresAt: record.expiresAt,
    attempts: record.attempts,
    lockedUntil: record.lockedUntil,
  });

  /* ================= LOCK CHECK ================= */
  if (
    record.lockedUntil &&
    Date.now() < new Date(record.lockedUntil).getTime()
  ) {
    console.log("⛔ LOCKED UNTIL", record.lockedUntil);
    throw new Error("Too many attempts. Try later.");
  }

  /* ================= EXPIRY ================= */
  if (Date.now() > new Date(record.expiresAt).getTime()) {
    console.log("⏰ OTP EXPIRED");
    throw new Error("OTP expired.");
  }

  /* ================= OTP MATCH ================= */
  const inputOtp = String(otp).trim();
  const storedOtp = String(record.code).trim(); // ✅ FIX

  const isValid = inputOtp === storedOtp;

  if (!isValid) {
    console.log("❌ OTP MISMATCH", {
      inputOtp,
      storedOtp,
      normalized,
    });

    record.attempts = (record.attempts || 0) + 1;

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      record.lockedUntil = new Date(
        Date.now() + OTP_LOCK_MINUTES * 60 * 1000
      );
      console.log("🔒 LOCKING USER UNTIL", record.lockedUntil);
    }

    await record.save();

    throw new Error("Invalid OTP");
  }

  /* ================= SUCCESS ================= */
  console.log("✅ OTP VERIFIED", normalized);

  record.verified = true;
  record.attempts = 0;
  record.lockedUntil = null;

  await record.save();

  return { success: true };
}
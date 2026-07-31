"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import Otp from "@/models/Otp";
import { getSession } from "@/lib/auth";
import { normalizeTarget } from "@/lib/otpUtils";
import { logActivity } from "@/lib/activityLog";

export async function updateContact({
  field,
  value,
}: {
  field:
    | "email"
    | "primaryNumber"
    | "secondaryNumber1"
    | "secondaryNumber2";
  value: string;
}) {
  await connectDB();

  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  const user: any = await User.findById(session.userId);
  if (!user || user.isDeleted) throw new Error("User not found");

  const trimmed = value.trim();
  if (!trimmed) throw new Error("Value is required");

  const channel = field === "email" ? "email" : "phone";
  const normalized = normalizeTarget(channel, trimmed);

  console.log("🔎 UPDATE CONTACT", {
    field,
    raw: value,
    normalized,
  });

  /* ================= HARD VALIDATION ================= */
  if (channel === "phone" && normalized.length <= 4) {
    throw new Error("Invalid phone number");
  }

  /* ================= OTP CHECK ================= */
  let otpRecord: any = await Otp.findOne({
    target: normalized,
    verified: true,
    expiresAt: { $gt: new Date() }, // ensure still valid
  });

  /* 🔁 RETRY (handles race condition: verify → immediate save) */
  if (!otpRecord) {
    await new Promise((r) => setTimeout(r, 200));

    otpRecord = await Otp.findOne({
      target: normalized,
      verified: true,
      expiresAt: { $gt: new Date() },
    });
  }

  /* ================= MOCK FALLBACK (optional) =================
     Allows +91 mock to proceed even if record timing failed.
     Keep only for NON-PROD.
  */
  const isIndiaMock =
    channel === "phone" &&
    process.env.NODE_ENV !== "production" &&
    /^\+91\d{10}$/.test(normalized);

  if (!otpRecord && !isIndiaMock) {
    console.log("❌ OTP NOT VERIFIED", normalized);
    throw new Error("OTP verification required");
  }

  /* ================= EMAIL ================= */
  if (field === "email") {
    const emailLower = trimmed.toLowerCase();

    // Even if it's the same email as before, an OTP was just verified for
    // it above — this is also the only path that can flip isEmailVerified
    // for an account that had none (e.g. phone_otp signups), so don't skip
    // the flag update just because the address string is unchanged.
    if (user.email === emailLower) {
      user.isEmailVerified = true;
      await user.save();
      await Otp.deleteOne({ target: normalized, verified: true });
      return { success: true };
    }

    const existing = await User.findOne({
      email: emailLower,
      _id: { $ne: user._id },
      accountStatus: { $ne: "Deleted" },
    });

    if (existing) throw new Error("Email already in use");

    user.email = emailLower;
    user.isEmailVerified = true;
  }

  /* ================= PRIMARY PHONE ================= */
  if (field === "primaryNumber") {
    // Same reasoning as email above — this is the only path that can flip
    // isPrimaryNumberVerified for accounts missing it (e.g. apple/google/
    // magic_link signups), so still persist it even if unchanged.
    if (user.primaryNumber === normalized) {
      user.isPrimaryNumberVerified = true;
      await user.save();
      await Otp.deleteOne({ target: normalized, verified: true });
      return { success: true };
    }

    const existing = await User.findOne({
      _id: { $ne: user._id },
      accountStatus: { $ne: "Deleted" },
      $or: [
        { primaryNumber: normalized },
        { secondaryNumber1: normalized },
        { secondaryNumber2: normalized },
      ],
    });

    if (existing) throw new Error("Phone number already in use");

    user.primaryNumber = normalized;
    user.isPrimaryNumberVerified = true;
  }

  /* ================= SECONDARY ================= */
  if (field === "secondaryNumber1" || field === "secondaryNumber2") {
    if (user[field] !== normalized) {
      const existing = await User.findOne({
        _id: { $ne: user._id },
        accountStatus: { $ne: "Deleted" },
        $or: [
          { primaryNumber: normalized },
          { secondaryNumber1: normalized },
          { secondaryNumber2: normalized },
        ],
      });

      if (existing) throw new Error("Phone number already in use");
    }

    user[field] = normalized;
  }

  /* ================= SAVE ================= */
  await user.save();

  if (field === "email") {
    await logActivity(user._id, "EMAIL_CHANGED");
  } else if (field === "primaryNumber") {
    await logActivity(user._id, "PHONE_CHANGED");
  }

  /* 🧹 CLEAN OTP (only verified one) */
  await Otp.deleteOne({
    target: normalized,
    verified: true,
  });

  return { success: true };
}
"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import Otp from "@/models/Otp";
import { getSession } from "@/lib/auth";
import { normalizeTarget } from "@/lib/otpUtils";

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

    if (user.email === emailLower) return { success: true };

    const existing = await User.findOne({
      email: emailLower,
      _id: { $ne: user._id },
      accountStatus: { $ne: "Deleted" },
    });

    if (existing) throw new Error("Email already in use");

    user.email = emailLower;
  }

  /* ================= PRIMARY PHONE ================= */
  if (field === "primaryNumber") {
    if (user.primaryNumber === normalized) return { success: true };

    const existing = await User.findOne({
      primaryNumber: normalized,
      _id: { $ne: user._id },
      accountStatus: { $ne: "Deleted" },
    });

    if (existing) throw new Error("Phone number already in use");

    user.primaryNumber = normalized;
  }

  /* ================= SECONDARY ================= */
  if (field === "secondaryNumber1" || field === "secondaryNumber2") {
    user[field] = normalized;
  }

  /* ================= SAVE ================= */
  await user.save();

  /* 🧹 CLEAN OTP (only verified one) */
  await Otp.deleteOne({
    target: normalized,
    verified: true,
  });

  return { success: true };
}
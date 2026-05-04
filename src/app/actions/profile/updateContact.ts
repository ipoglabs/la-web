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

  /* ================= OTP CHECK ================= */
  const otpRecord: any = await Otp.findOne({
    target: normalized,
    verified: true,
    expiresAt: { $gt: new Date() }, // ✅ ensure not expired
  });

  if (!otpRecord) {
    throw new Error("OTP verification required");
  }

  /* ================= EMAIL ================= */
  if (field === "email") {
    const emailLower = trimmed.toLowerCase();

    // skip if same
    if (user.email === emailLower) {
      return { success: true };
    }

    // duplicate check
    const existing = await User.findOne({
      $and: [
        { email: { $regex: `^${emailLower}$`, $options: "i" } },
        { _id: { $ne: user._id } },
        { accountStatus: { $ne: "Deleted" } },
      ],
    });

    if (existing) {
      throw new Error("Email already in use");
    }

    user.email = emailLower;
  }

  /* ================= PRIMARY NUMBER ================= */
  if (field === "primaryNumber") {
    // skip if same
    if (user.primaryNumber === normalized) {
      return { success: true };
    }

    // duplicate check
    const existing = await User.findOne({
      $and: [
        { primaryNumber: normalized },
        { _id: { $ne: user._id } },
        { accountStatus: { $ne: "Deleted" } },
      ],
    });

    if (existing) {
      throw new Error("Phone number already in use");
    }

    user.primaryNumber = normalized; // ✅ ALWAYS save normalized
  }

  /* ================= SECONDARY NUMBERS ================= */
  if (field === "secondaryNumber1" || field === "secondaryNumber2") {
    user[field] = normalized; // ✅ keep consistent format
  }

  /* ================= SAVE ================= */
  await user.save();

  /* ================= CLEAN OTP ================= */
  await Otp.deleteOne({ target: normalized });

  return { success: true };
}
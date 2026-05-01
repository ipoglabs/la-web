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
  const otpRecord: any = await Otp.findOne({ target: normalized });

  if (!otpRecord || !otpRecord.verified) {
    throw new Error("OTP verification required");
  }

  /* ================= SKIP IF SAME VALUE ================= */
  if (field === "email") {
    const emailLower = trimmed.toLowerCase();

    if (user.email === emailLower) {
      return { success: true }; // no change
    }
  }

  if (field === "primaryNumber") {
    if (user.primaryNumber === trimmed) {
      return { success: true }; // no change
    }
  }

  /* ================= DUPLICATE CHECK ================= */

  // 🔥 EMAIL
  if (field === "email") {
    const emailLower = trimmed.toLowerCase();

    const existing = await User.findOne({
      $and: [
        {
          email: { $regex: `^${emailLower}$`, $options: "i" },
        },
        {
          _id: { $ne: user._id },
        },
        {
          accountStatus: { $ne: "Deleted" }, // 🔥 ignore deleted users
        },
      ],
    });

    if (existing) {
      throw new Error("Email already in use");
    }

    user.email = emailLower;
  }

  // 🔥 PRIMARY NUMBER
  if (field === "primaryNumber") {
    const existing = await User.findOne({
      $and: [
        { primaryNumber: trimmed },
        { _id: { $ne: user._id } },
        { accountStatus: { $ne: "Deleted" } }, // 🔥 ignore deleted users
      ],
    });

    if (existing) {
      throw new Error("Phone number already in use");
    }

    user.primaryNumber = trimmed;
  }

  // 🔥 SECONDARY NUMBERS (no duplicate check needed)
  if (field === "secondaryNumber1" || field === "secondaryNumber2") {
    user[field] = trimmed;
  }

  /* ================= UPDATE ================= */
  await user.save();

  /* ================= CLEAN OTP ================= */
  await Otp.deleteOne({ target: normalized });

  return { success: true };
}
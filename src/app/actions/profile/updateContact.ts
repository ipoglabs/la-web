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

  /* ================= DUPLICATE CHECK ================= */
  if (field === "email") {
    const existing = await User.findOne({
      email: trimmed,
      _id: { $ne: user._id }, // exclude current user
    });

    if (existing) {
      throw new Error("Email already in use");
    }
  }

  if (field === "primaryNumber") {
    const existing = await User.findOne({
      primaryNumber: trimmed,
      _id: { $ne: user._id },
    });

    if (existing) {
      throw new Error("Phone number already in use");
    }
  }

  /* ================= UPDATE ================= */
  user[field] = trimmed;

  await user.save();

  /* ================= CLEAN OTP ================= */
  await Otp.deleteOne({ target: normalized });

  return { success: true };
}
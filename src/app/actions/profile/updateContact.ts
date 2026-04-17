// app/actions/profile/updateContact.ts
"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import Otp from "@/models/Otp";
import { getSession } from "@/lib/auth";
import { normalizeEmail, normalizePhone } from "@/lib/otpUtils";

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

  const rawValue = String(value || "").trim();
  if (!rawValue) throw new Error("Value is required");

  /* ================= NORMALIZE ================= */
  const channel = field === "email" ? "email" : "phone";

  const normalizedTarget =
    channel === "email"
      ? normalizeEmail(rawValue)
      : normalizePhone(rawValue);

  /* ================= VERIFY OTP (FROM DB) ================= */
  const otpRecord: any = await Otp.findOne({
    target: normalizedTarget,
    channel,
  });

  if (!otpRecord || !otpRecord.verified) {
    throw new Error("OTP verification required");
  }

  /* ================= UNIQUE CHECK ================= */
  if (field === "email") {
    const exists = await User.findOne({
      email: normalizedTarget,
      _id: { $ne: user._id },
    });

    if (exists) throw new Error("Email already exists");

    user.email = normalizedTarget;
    user.isEmailVerified = true;
  }

  if (field === "primaryNumber") {
    const exists = await User.findOne({
      primaryNumber: normalizedTarget,
      _id: { $ne: user._id },
    });

    if (exists) throw new Error("Phone already exists");

    user.primaryNumber = normalizedTarget;
    user.isPrimaryNumberVerified = true;
  }

  if (field === "secondaryNumber1") {
    user.secondaryNumber1 = normalizedTarget;
  }

  if (field === "secondaryNumber2") {
    user.secondaryNumber2 = normalizedTarget;
  }

  await user.save();

  /* ================= CLEANUP OTP ================= */
  await Otp.deleteOne({
    target: normalizedTarget,
    channel,
  });

  return { success: true };
}
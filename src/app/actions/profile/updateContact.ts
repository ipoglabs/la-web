// app/actions/profile/updateContact.ts
"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
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

  const channel = field === "email" ? "email" : "phone";
  const normalizedTarget =
    channel === "email" ? normalizeEmail(rawValue) : normalizePhone(rawValue);

  if (
    !user.otp ||
    !user.otp.verified ||
    user.otp.channel !== channel ||
    user.otp.target !== normalizedTarget
  ) {
    throw new Error("OTP verification required");
  }

  if (field === "email") {
    const nextEmail = normalizeEmail(rawValue);

    const exists = await User.findOne({
      email: nextEmail,
      _id: { $ne: user._id },
    });

    if (exists) throw new Error("Email already exists");

    user.email = nextEmail;
    user.isEmailVerified = true;
  }

  if (field === "primaryNumber") {
    const nextPhone = normalizePhone(rawValue);

    const exists = await User.findOne({
      primaryNumber: nextPhone,
      _id: { $ne: user._id },
    });

    if (exists) throw new Error("Phone already exists");

    user.primaryNumber = nextPhone;
    user.isPrimaryNumberVerified = true;
  }

  if (field === "secondaryNumber1") {
    user.secondaryNumber1 = normalizePhone(rawValue);
  }

  if (field === "secondaryNumber2") {
    user.secondaryNumber2 = normalizePhone(rawValue);
  }

  user.otp = null;
  await user.save();

  return { success: true };
}
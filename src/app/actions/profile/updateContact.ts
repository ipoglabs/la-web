"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import otpStore from "@/lib/otpStore";

const normalize = (v: string) => v.toLowerCase().trim();

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
  if (!session) throw new Error("Unauthorized");

  const user: any = await User.findById(session.userId);
  if (!user) throw new Error("User not found");

  const rawValue = String(value || "").trim();
  if (!rawValue) {
    throw new Error("Value is required");
  }

  const normalizedKey = normalize(rawValue);
  const rec = otpStore[normalizedKey];

  if (!rec || !rec.verified) {
    throw new Error("OTP verification required");
  }

  if (field === "email") {
    const nextEmail = normalizedKey;

    const exists = await User.findOne({
      email: nextEmail,
      _id: { $ne: user._id },
    });

    if (exists) throw new Error("Email already exists");

    user.email = nextEmail;
    user.isEmailVerified = true;
  }

  if (field === "primaryNumber") {
    const nextPhone = rawValue;

    const exists = await User.findOne({
      primaryNumber: nextPhone,
      _id: { $ne: user._id },
    });

    if (exists) throw new Error("Phone already exists");

    user.primaryNumber = nextPhone;
    user.isPrimaryNumberVerified = true;
  }

  if (field === "secondaryNumber1") {
    user.secondaryNumber1 = rawValue;
  }

  if (field === "secondaryNumber2") {
    user.secondaryNumber2 = rawValue;
  }

  await user.save();

  delete otpStore[normalizedKey];

  const updated = await User.findById(user._id).lean();

  return {
    success: true,
    updatedField: field,
    updatedValue:
      field === "email"
        ? updated?.email
        : field === "primaryNumber"
        ? updated?.primaryNumber
        : field === "secondaryNumber1"
        ? updated?.secondaryNumber1
        : updated?.secondaryNumber2,
  };
}
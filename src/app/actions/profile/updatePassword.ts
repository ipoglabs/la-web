"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";

import bcrypt from "bcryptjs";

export async function updatePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  await connectDB();

  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { userId, email } = session;

  /* ================= FIND USER ================= */
  let user: any = null;

  if (userId) {
    user = await User.findById(userId);
  } else if (email) {
    user = await User.findOne({ email });
  }

  if (!user) {
    throw new Error("User not found");
  }

  /* ================= VALIDATION ================= */

  if (!currentPassword?.trim()) {
    throw new Error("Current password is required");
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!/[A-Za-z]/.test(newPassword)) {
    throw new Error("Password must include at least one letter");
  }

  if (!/\d/.test(newPassword)) {
    throw new Error("Password must include at least one number");
  }

  if (!/[^A-Za-z0-9]/.test(newPassword)) {
    throw new Error("Password must include at least one special character");
  }

  /* ================= VERIFY CURRENT PASSWORD ================= */

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  /* ================= PREVENT SAME PASSWORD ================= */

  const isSame = await bcrypt.compare(newPassword, user.password);

  if (isSame) {
    throw new Error("New password must be different from current password");
  }

  /* ================= HASH NEW PASSWORD ================= */

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  return {
    success: true,
  };
}
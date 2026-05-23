"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { sendPasswordUpdateEmail } from "@/lib/profile/updatePasswordEmail";
import bcrypt from "bcryptjs";

export async function updatePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    await connectDB();

    /* ================= SESSION ================= */
    const session = await getSession();

    if (!session || !session.userId) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.userId;

    /* ================= FETCH USER (STRICT) ================= */
    const user: any = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    /* ================= VALIDATION ================= */
    if (!currentPassword?.trim()) {
      return { success: false, message: "Current password is required" };
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, message: "Password must be at least 8 characters" };
    }

    if (!/[A-Za-z]/.test(newPassword)) {
      return { success: false, message: "Password must include at least one letter" };
    }

    if (!/\d/.test(newPassword)) {
      return { success: false, message: "Password must include at least one number" };
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return { success: false, message: "Password must include at least one special character" };
    }

    /* ================= VERIFY CURRENT PASSWORD ================= */

    if (!user.password) {
      return { success: false, message: "Password not set" };
    }

    // ensure it's a bcrypt hash
    if (typeof user.password !== "string" || !user.password.startsWith("$2")) {
      console.error("Invalid password format in DB:", user.password);
      return {
        success: false,
        message: "Account issue. Please reset password.",
      };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return { success: false, message: "Current password is incorrect" };
    }

    /* ================= PREVENT SAME PASSWORD ================= */
    const isSame = await bcrypt.compare(newPassword, user.password);

    if (isSame) {
      return {
        success: false,
        message: "New password must be different from current password",
      };
    }

    /* ================= HASH NEW PASSWORD ================= */
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    /* ================= EMAIL ================= */
    try {
      if (user.email) {
        await sendPasswordUpdateEmail({
          fullName: user.fullName || "",
          email: user.email,
        });
      }
    } catch (err) {
      console.error("Password update email failed:", err);
    }

    return { success: true };

  } catch (err) {
    console.error("Update password error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
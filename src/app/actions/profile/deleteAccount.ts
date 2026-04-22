"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { sendDeleteAccountEmail } from "@/lib/profile/deleteAccountEmail";

export async function softDeleteAccount(feedback?: string) {
  await connectDB();

  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const user: any = await User.findById(session.userId);
  if (!user) throw new Error("User not found");

  // 🔒 prevent double delete
  if (user.isDeleted) {
    throw new Error("Account already deleted");
  }

  // ✅ Soft delete
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.deleteFeedback = feedback || "";

  // Optional
  user.accountStatus = "Suspended";
  user.isSuspended = true;

  // Optional audit
  user.audit.push({
    action: "ACCOUNT_DELETED",
    at: new Date(),
  });

  await user.save();

  /* ================= EMAIL ================= */
try {
  if (user.email) {
    await sendDeleteAccountEmail({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }
} catch (err) {
  console.error("Delete account email failed:", err);
}

  return { success: true };
}
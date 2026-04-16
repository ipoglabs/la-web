"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";

export async function softDeleteAccount(feedback?: string) {
  await connectDB();

  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const user: any = await User.findById(session.userId);
  if (!user) throw new Error("User not found");

  // ✅ Soft delete
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.deleteFeedback = feedback || "";

  // Optional (recommended)
  user.accountStatus = "Suspended";

  await user.save();

  return { success: true };
}
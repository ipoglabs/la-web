"use server";

import { cookies } from "next/headers";
import connectDB from "@/config/database";
import User from "@/models/user";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function changePassword(form: FormData) {
  await connectDB();

  const token = cookies().get("token")?.value?.replace(/^Bearer\s+/i, "") || "";
  const decoded = token ? verifyToken(token) : null;
  const userId = decoded?.id || decoded?.userId;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false, error: "Not authenticated" };
  }

  const currentPassword = (form.get("currentPassword") as string) || "";
  const newPassword = (form.get("newPassword") as string) || "";

  const user = await User.findById(userId);
  if (!user) return { ok: false, error: "User not found" };

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return { ok: false, error: "Current password is incorrect" };

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  return { ok: true };
}

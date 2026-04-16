"use server";

import connectDB from "@/config/database";
import User from "@/models/user";

export async function checkUserIdAvailability(userId: string, currentUserId?: string) {
  await connectDB();

  const existing = await User.findOne({ userId });

  if (!existing) return { available: true };

  // allow same user to keep same id
  if (currentUserId && existing.userId === currentUserId) {
    return { available: true };
  }

  return { available: false };
}
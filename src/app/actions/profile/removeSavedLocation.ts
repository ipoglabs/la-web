"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession } from "@/lib/auth";

export async function removeSavedLocation(locationId: string): Promise<{ success: true }> {
  await connectDB();

  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  const user: any = await User.findById(session.userId);
  if (!user || user.isDeleted) throw new Error("User not found");

  const target = user.savedLocations.id(locationId);
  if (!target) throw new Error("Location not found");

  const wasPrimary = target.primary;
  target.deleteOne();

  // Keep exactly one "primary" location when one remains — mirrors
  // removePhone's "reassign primary on removal" behaviour.
  if (wasPrimary && user.savedLocations.length > 0) {
    user.savedLocations[0].primary = true;
  }

  await user.save();
  return { success: true };
}

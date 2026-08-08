"use server";

import connectDB from "@/lib/db";
import User from "@/models/user";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

export async function removeSavedLocation(locationId: string): Promise<{ success: true }> {
  await connectDB();

  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthorized");

  const user: any = await User.findById(session.userId);
  if (!user || user.isDeleted) throw new Error("User not found");

  const target = user.savedLocations.id(locationId);
  if (!target) throw new Error("Location not found");

  const wasPrimary = target.primary;
  const title = [target.city, target.country].filter(Boolean).join(", ");
  target.deleteOne();

  // Keep exactly one "primary" location when one remains — mirrors
  // removePhone's "reassign primary on removal" behaviour.
  if (wasPrimary && user.savedLocations.length > 0) {
    user.savedLocations[0].primary = true;
  }

  await user.save();
  await logActivity(user._id, "SAVED_LOCATION_REMOVED", { title });
  return { success: true };
}

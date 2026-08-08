"use server";

import connectDB from "@/lib/db";
import Favourite from "@/models/Favourite";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

/** Removes a favourite for the signed-in user. Silently no-ops for guests. */
export async function removeFavourite(listingId: string): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session?.userId) return { ok: false };

  await connectDB();

  const removed = await Favourite.findOneAndDelete({
    userId: session.userId,
    listingId,
  }).lean();

  if (removed) {
    await logActivity(session.userId, "FAVOURITE_REMOVED", {
      listingId,
      title: removed.title,
    });
  }

  return { ok: true };
}

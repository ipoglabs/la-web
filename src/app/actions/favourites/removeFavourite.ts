"use server";

import connectDB from "@/lib/db";
import Favourite from "@/models/Favourite";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";

/**
 * Removes a favourite for the signed-in user.
 *
 * Returns `{ ok, persisted }`:
 *   - `persisted: false` — guest, no server row exists (nothing to undo);
 *     the client can drop its delete tombstone straight away.
 *   - `persisted: true`  — signed-in; the DB row is now gone. The client keeps
 *     its tombstone until a fresh server read confirms absence, so an
 *     in-flight `getMyFavourites()` snapshot can't resurrect it.
 *
 * Throws on a DB failure so the caller keeps the tombstone and retries.
 */
export async function removeFavourite(
  listingId: string
): Promise<{ ok: boolean; persisted: boolean }> {
  const session = await getSession();
  if (!session?.userId) return { ok: true, persisted: false };

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

  return { ok: true, persisted: true };
}

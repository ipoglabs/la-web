"use server";

import connectDB from "@/lib/db";
import Favourite from "@/models/Favourite";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activityLog";
import type { FavItem } from "@/lib/stores/favouritesStore";

/**
 * Persists a favourite for the signed-in user. Silently no-ops (not an
 * error) for guests — the client-side store already works without an
 * account, this just adds cross-device persistence on top for real users.
 */
export async function addFavourite(item: FavItem): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session?.userId) return { ok: false };

  await connectDB();

  await Favourite.findOneAndUpdate(
    { userId: session.userId, listingId: item.id },
    {
      userId: session.userId,
      listingId: item.id,
      image: item.image,
      priceLabel: item.priceLabel,
      priceSuffix: item.priceSuffix,
      title: item.title,
      detailsLabel: item.detailsLabel,
      locationLabel: item.locationLabel,
      postedAt: item.postedAt,
      status: item.status,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await logActivity(session.userId, "FAVOURITE_ADDED", {
    listingId: item.id,
    title: item.title,
  });

  return { ok: true };
}

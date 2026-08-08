"use server";

import connectDB from "@/lib/db";
import Favourite from "@/models/Favourite";
import { getSession } from "@/lib/auth";
import type { FavItem } from "@/lib/stores/favouritesStore";

/** The signed-in user's DB-persisted favourites — feeds store.syncFromServer() on login. */
export async function getMyFavourites(): Promise<FavItem[]> {
  const session = await getSession();
  if (!session?.userId) return [];

  await connectDB();

  const favourites = await Favourite.find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .lean();

  return favourites.map((f) => ({
    id: f.listingId,
    image: f.image,
    priceLabel: f.priceLabel,
    priceSuffix: f.priceSuffix,
    title: f.title,
    detailsLabel: f.detailsLabel,
    locationLabel: f.locationLabel,
    postedAt: f.postedAt,
    status: f.status,
  }));
}

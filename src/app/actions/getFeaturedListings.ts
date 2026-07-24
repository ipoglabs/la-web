"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";
import { mapPostToFeaturedItem, type FeaturedListingItem } from "@/lib/mapPostToFeaturedItem";

export async function getFeaturedListings(
  countryCode: string,
  section: "recent" | "top-picks",
  limit = 10,
): Promise<FeaturedListingItem[]> {
  await connectDB();

  // Country scoping via adsId prefix (e.g. "GB-00000123") since Post has no
  // dedicated country field yet. Consider adding a real `country` field to
  // the Post schema + backfilling, then filtering on that directly instead.
  const filter: Record<string, unknown> = {
    status: "active",
    adsId: { $regex: `^${countryCode.toUpperCase()}-` },
  };

  const sort =
    section === "recent"
      ? { createdAt: -1 as const }
      // "Top Picks" placeholder ranking: most recently bumped/boosted listings.
      // TODO: replace with a real quality signal (seller rating, view count,
      // manual editorial flag) once the backend team defines one.
      : { lastBumpedAt: -1 as const, createdAt: -1 as const };

  const items = await Post.find(filter)
    .sort(sort)
    .limit(limit)
    .lean()
    .exec();

  return items.map((p) => mapPostToFeaturedItem(p as any));
}
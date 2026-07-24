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

  // No moderation/approval step exists yet (nothing in this codebase ever
  // transitions a Post from "pending" to "active" — see addPost.ts/
  // updatePost.ts), so every real post is permanently "pending". Treating
  // "active" as the only visible status would mean this never returns
  // anything at all. Excludes only genuinely hidden/removed states.
  const filter: Record<string, unknown> = {
    status: { $nin: ["off", "expired", "deleted"] },
    // Country-scoped via the real `country` field (models/post.ts), set at
    // creation from the country cookie. Posts predating that field (or
    // created without a resolved cookie) have none — treat those as
    // visible in every market rather than nowhere.
    $or: [{ country: countryCode.toLowerCase() }, { country: { $exists: false } }],
  };

  const sort: Record<string, 1 | -1> =
    section === "recent"
      ? { createdAt: -1 }
      // "Top Picks" placeholder ranking: most recently bumped/boosted listings.
      // TODO: replace with a real quality signal (seller rating, view count,
      // manual editorial flag) once the backend team defines one.
      : { lastBumpedAt: -1, createdAt: -1 };

  const items = await Post.find(filter)
    .sort(sort)
    .limit(limit)
    .lean()
    .exec();

  return items.map((p) => mapPostToFeaturedItem(p as any));
}
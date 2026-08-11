"use server";

import connectDB from "@/lib/db";
import Post from "@/models/post";
import { mapPostToFeaturedItem, type FeaturedListingItem } from "@/lib/mapPostToFeaturedItem";
import { publicPostFilter } from "@/lib/postVisibility";
import { resolvePostSort } from "@/lib/postSort";

export async function getFeaturedListings(
  countryCode: string,
  section: "recent" | "top-picks",
  limit = 10,
): Promise<FeaturedListingItem[]> {
  await connectDB();

  const filter: Record<string, unknown> = {
    ...publicPostFilter(),
    // Country-scoped via the real `country` field (models/post.ts), set at
    // creation from the country cookie. Posts predating that field (or
    // created without a resolved cookie) have none — treat those as
    // visible in every market rather than nowhere.
    $or: [{ country: countryCode.toLowerCase() }, { country: { $exists: false } }],
  };

  const items = await Post.find(filter)
    .sort(resolvePostSort(section === "recent" ? "newest" : "top-picks"))
    .limit(limit)
    .lean()
    .exec();

  return items.map((p) => mapPostToFeaturedItem(p as any));
}
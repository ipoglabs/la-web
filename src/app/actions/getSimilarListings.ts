"use server";

import { Types } from "mongoose";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { mapPostToListing, type LeanOwner } from "@/lib/mapPostToListing";
import { publicPostFilter } from "@/lib/postVisibility";
import { getActiveListingCountsByOwner } from "@/lib/postActiveListingsCount";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
import type { Listing } from "@/types/listing";
import type { CountryCode } from "@/config";

/**
 * Real "Similar Listings" for the listing detail page's bottom row —
 * same subcategory preferred, whole category as fallback, excluding the
 * listing being viewed. Mirrors getPostByAdsId.ts's category/subcategory
 * label-vs-id matching (Post stores whatever the wizard submitted, not
 * necessarily the canonical id) and getFeaturedListings.ts's country
 * scoping. Returns [] (never throws) so the caller can fall back to
 * lib/mock/country-map.ts's getSimilarListings() — see listings/[listingId]/
 * page.tsx's SimilarListingsRow.
 */
export async function getSimilarPosts(
  cat: string,
  sub: string,
  excludeId: string,
  market: CountryCode | null,
  limit = 12,
): Promise<Listing[]> {
  await connectDB();

  const categoryLabel = CATEGORY_LABELS[cat];
  const baseQuery: Record<string, unknown> = {
    category: categoryLabel ? { $in: [cat, categoryLabel] } : cat,
    ...publicPostFilter(),
    adsId: { $ne: excludeId },
    // Country-scoped like every other public listings read path — posts
    // with no country (predating that field) are visible in every market.
    ...(market ? { $or: [{ country: market }, { country: { $exists: false } }] } : {}),
  };
  // _id only ever matches a real ObjectId — excludeId can also be a mock
  // catalog slug (viewing a legacy mock listing's page), which would throw
  // a Mongoose CastError if compared against _id.
  if (Types.ObjectId.isValid(excludeId)) {
    baseQuery._id = { $ne: excludeId };
  }

  const subLabel = sub ? SUBCATEGORY_LABELS[cat]?.[sub] : undefined;

  async function fetchAndMap(query: Record<string, unknown>): Promise<Listing[]> {
    const docs = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate<{ ownerId: LeanOwner | null }>(
        "ownerId",
        "userId fullName image publicRole isEmailVerified isPrimaryNumberVerified createdAt",
      )
      .lean();
    const activeCounts = await getActiveListingCountsByOwner(docs.map((d) => d.ownerId?._id));
    return docs.map(({ ownerId, ...post }) =>
      mapPostToListing(post, ownerId ?? null, ownerId?._id ? activeCounts.get(String(ownerId._id)) ?? 1 : 1),
    );
  }

  // Same subcategory first — same "prefer narrow, widen if thin" rule the
  // mock resolver used (see lib/mock/country-map.ts's getSimilarListings).
  if (sub) {
    const sameSub = await fetchAndMap({
      ...baseQuery,
      subcategory: subLabel ? { $in: [sub, subLabel] } : sub,
    });
    if (sameSub.length >= 2) return sameSub;
  }

  return fetchAndMap(baseQuery);
}

"use server";

import connectDB from "@/lib/db";
import { Types } from "mongoose";
import Post from "@/models/post";
import { mapPostToListing, type LeanOwner } from "@/lib/mapPostToListing";
import { publicPostFilter } from "@/lib/postVisibility";
import { isDynamicFormCategory } from "@/posting/form-schema/rollout";
import { getPostFormSchema } from "@/posting/form-schema/getPostFormSchema";
import { getActiveListingCountsByOwner } from "@/lib/postActiveListingsCount";
import { resolveCategoryId, resolveSubcategoryId } from "@/lib/category-map";
import type { Listing } from "@/types/listing";
import type { CountryCode } from "@/config";

const COUNTRY_CODES: CountryCode[] = ["in", "gb", "sg"];

/**
 * Looks up a real Post by its public id — `adsId` first (the normal case;
 * see resolvePostId in mapPostToFeaturedItem.ts for why a raw Mongo id is
 * also a valid fallback), then `_id` if the segment looks like one. Mirrors
 * lib/mock/country-map.ts's resolveListingContext() return shape so
 * listings/[listingId]/page.tsx can try this first and fall back to the
 * mock resolver with minimal branching.
 *
 * Returns null for anything not meant to be publicly visible (pending
 * approval, rejected, or suspended — see lib/postVisibility.ts).
 */
export async function resolvePostListingContext(publicId: string): Promise<{
  listing: Listing;
  cat: string;
  sub: string;
  market: CountryCode | null;
} | null> {
  if (!publicId) return null;
  await connectDB();

  const query = Types.ObjectId.isValid(publicId)
    ? { $or: [{ adsId: publicId }, { _id: publicId }] }
    : { adsId: publicId };

  const post = await Post.findOne({
    ...query,
    ...publicPostFilter(),
  })
    .populate<{ ownerId: LeanOwner | null }>(
      "ownerId",
      "userId fullName image publicRole isEmailVerified isPrimaryNumberVerified createdAt"
    )
    .lean();

  if (!post) return null;

  // Real page-view counter for /my-ads's MyAdCard — fire-and-forget, never
  // blocks the detail page render on a write.
  Post.updateOne({ _id: post._id }, { $inc: { viewCount: 1 } }).exec().catch((err) =>
    console.error("[resolvePostListingContext] viewCount increment failed:", err),
  );

  const { ownerId, ...rest } = post;
  const activeCounts = await getActiveListingCountsByOwner([ownerId?._id]);
  const activeListingsCount = ownerId?._id ? activeCounts.get(String(ownerId._id)) ?? 1 : 1;
  const schema =
    rest.country && isDynamicFormCategory(rest.category)
      ? (await getPostFormSchema(rest.category, rest.subcategory, rest.country)).schema
      : null;
  const listing = mapPostToListing(rest, ownerId ?? null, activeListingsCount, schema);

  const cat = resolveCategoryId(rest.category);
  const sub = resolveSubcategoryId(cat, rest.subcategory);
  const market = COUNTRY_CODES.includes((rest.country ?? "") as CountryCode)
    ? (rest.country as CountryCode)
    : null;

  return { listing, cat, sub, market };
}

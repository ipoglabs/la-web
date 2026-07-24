"use server";

import connectDB from "@/config/database";
import { Types } from "mongoose";
import Post from "@/models/post";
import { mapPostToListing, type LeanOwner } from "@/lib/mapPostToListing";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
import type { Listing } from "@/types/listing";
import type { CountryCode } from "@/config";

const COUNTRY_CODES: CountryCode[] = ["in", "gb", "sg"];

/**
 * Post.category/subcategory are stored as whatever the post wizard
 * submitted — in the data seen so far that's the display LABEL
 * ("Vehicles"), not the canonical id ("vehicles") the rest of the app
 * (breadcrumbs, CATEGORY_LABELS/SUBCATEGORY_LABELS lookups, similar-listings)
 * expects. Resolve whichever form is present back to a canonical id;
 * falls back to a best-effort slug if genuinely unrecognized rather than
 * throwing — a real but unmapped category shouldn't 404 the whole page.
 */
function resolveCategoryId(raw: string): string {
  if (raw in CATEGORY_LABELS) return raw;
  const lower = raw.toLowerCase();
  const match = Object.entries(CATEGORY_LABELS).find(([, label]) => label.toLowerCase() === lower);
  return match ? match[0] : raw.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function resolveSubcategoryId(catId: string, raw: string): string {
  const subs = SUBCATEGORY_LABELS[catId];
  if (!subs) return raw.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  if (raw in subs) return raw;
  const lower = raw.toLowerCase();
  const match = Object.entries(subs).find(([, label]) => label.toLowerCase() === lower);
  return match ? match[0] : raw.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

/**
 * Looks up a real Post by its public id — `adsId` first (the normal case;
 * see resolvePostId in mapPostToFeaturedItem.ts for why a raw Mongo id is
 * also a valid fallback), then `_id` if the segment looks like one. Mirrors
 * lib/mock/country-map.ts's resolveListingContext() return shape so
 * listings/[listingId]/page.tsx can try this first and fall back to the
 * mock resolver with minimal branching.
 *
 * Returns null for anything not meant to be publicly visible (see the
 * status filter note in getFeaturedListings.ts — same reasoning applies
 * here: no moderation step exists yet, so "pending" counts as visible).
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
    status: { $nin: ["off", "expired", "deleted"] },
  })
    .populate<{ ownerId: LeanOwner | null }>(
      "ownerId",
      "fullName image role isEmailVerified isPrimaryNumberVerified createdAt"
    )
    .lean();

  if (!post) return null;

  const { ownerId, ...rest } = post;
  const listing = mapPostToListing(rest, ownerId ?? null);

  const cat = resolveCategoryId(rest.category);
  const sub = resolveSubcategoryId(cat, rest.subcategory);
  const market = COUNTRY_CODES.includes((rest.country ?? "") as CountryCode)
    ? (rest.country as CountryCode)
    : null;

  return { listing, cat, sub, market };
}

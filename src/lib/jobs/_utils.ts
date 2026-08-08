/**
 * lib/jobs/_utils.ts
 *
 * Shared utilities for job query building.
 * Internal to lib/jobs/ — not exported outside this folder.
 */

import mongoose from "mongoose";
import Post from "@/models/post";
import User from "@/models/user";
import { publicPostFilter } from "@/lib/postVisibility";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
import type { IAlert } from "@/models/Alert";

/**
 * Escape special MongoDB regex characters in a user-supplied keyword.
 * Prevents keyword values like "c++" or "$100" from breaking the regex query.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface AlertMatch {
  _id: mongoose.Types.ObjectId;
  name: string;
}

/**
 * Live Post documents matching an alert's saved criteria — shared by
 * alert-match.job.ts and alert-digest.job.ts so both stay identical.
 *
 * Post.category/subcategory are stored as whatever the post wizard
 * submitted, which can be the canonical id OR the display label (same
 * caveat as api/listings/[category]/route.ts) — match either. Real posts
 * live in `Post`, never `Listing` (Listing is only ever populated by
 * seed/migration scripts, not real user activity — see docs/db-schemas.md).
 */
export async function findAlertMatches(
  alert: Pick<IAlert, "category" | "subCategory" | "location" | "priceMin" | "priceMax" | "keywords" | "lastMatchedListingIds">
): Promise<AlertMatch[]> {
  const categoryLabel = CATEGORY_LABELS[alert.category];
  const query: Record<string, unknown> = {
    ...publicPostFilter(),
    category: categoryLabel ? { $in: [alert.category, categoryLabel] } : alert.category,
    _id: { $nin: alert.lastMatchedListingIds },
  };

  if (alert.subCategory) {
    const subLabel = SUBCATEGORY_LABELS[alert.category]?.[alert.subCategory];
    query.subcategory = subLabel ? { $in: [alert.subCategory, subLabel] } : alert.subCategory;
  }

  if (alert.location) {
    query["location.address"] = { $regex: escapeRegex(alert.location), $options: "i" };
  }

  if (alert.priceMin !== undefined || alert.priceMax !== undefined) {
    const price: Record<string, number> = {};
    if (alert.priceMin !== undefined) price.$gte = alert.priceMin;
    if (alert.priceMax !== undefined) price.$lte = alert.priceMax;
    query.price = price;
  }

  if (alert.keywords && alert.keywords.length > 0) {
    const orPattern = alert.keywords.map((k) => escapeRegex(k)).join("|");
    query.$or = [
      { name: { $regex: orPattern, $options: "i" } },
      { description: { $regex: orPattern, $options: "i" } },
    ];
  }

  return Post.find(query).select("_id name").lean<AlertMatch[]>();
}

/** Real recipient email for an alert — returns null (caller should skip and
 * count an error) if the owning account has no email on file. */
export async function getAlertRecipientEmail(userId: mongoose.Types.ObjectId): Promise<string | null> {
  const user = await User.findById(userId).select("email").lean<{ email?: string } | null>();
  return user?.email || null;
}

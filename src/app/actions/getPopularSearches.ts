"use server";

import connectDB from "@/config/database";
import Post from "@/models/post";
import { SUBCATEGORY_LABELS } from "@/lib/category-map";

export interface PopularSearchItem {
  id: string;
  label: string;
  href: string;
}

/**
 * "Popular Searches" derived from real Post volume, not logged search terms —
 * this app doesn't track search queries anywhere. The category+subcategory
 * combination with the most live posts in a market is a reasonable stand-in
 * for "popular" until real search analytics exist.
 */
export async function getPopularSearches(
  countryCode: string,
  limit = 8,
): Promise<PopularSearchItem[]> {
  await connectDB();

  const groups = await Post.aggregate<{
    _id: { category: string; subcategory: string };
    count: number;
    sampleAddress: string | null;
  }>([
    {
      $match: {
        status: { $nin: ["off", "expired", "deleted"] },
        $or: [{ country: countryCode.toLowerCase() }, { country: { $exists: false } }],
      },
    },
    {
      $group: {
        _id: { category: "$category", subcategory: "$subcategory" },
        count: { $sum: 1 },
        sampleAddress: { $first: "$location.address" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);

  return groups.map(({ _id, sampleAddress }) => {
    const { category, subcategory } = _id;
    // Some post subcategory values predate/bypass config/categories (e.g.
    // "holiday_rental" isn't in property's current subcategory list) — fall
    // back to a title-cased version of the raw id rather than showing
    // "holiday_rental" verbatim.
    const subLabel =
      SUBCATEGORY_LABELS[category]?.[subcategory] ??
      subcategory.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const area = sampleAddress?.split(",")[0]?.trim();
    return {
      id: `${category}-${subcategory}`,
      label: area ? `${subLabel} · ${area}` : subLabel,
      href: `/${countryCode.toLowerCase()}/listings?cat=${category}&sub=${subcategory}`,
    };
  });
}

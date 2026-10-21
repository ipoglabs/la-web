import type { IPost } from "@/models/post";
import type { FeaturedListingItem } from "@/components/la-blocks/FeaturedListings";
import type { ListingStatus } from "@/components/la-blocks/la-thumbnail-listing/LaThumbnailListingCard";
import { COUNTRY_CONFIGS, type CountryCode } from "@/config";

export type LeanPost = IPost & { _id: unknown };

export function mapStatus(status?: IPost["status"], isSuspended?: boolean): ListingStatus {
  if (isSuspended) return "blocked";
  switch (status) {
    case "off":
      return "off-market";
    case "pending":
      return "pending";
    case "rejected":
      return "rejected";
    case "expired":
      return "expired";
    case "closed":
      return "closed";
    case "deleted":
      return "deleted";
    case "active":
    default:
      return "active";
  }
}

// TODO [REVIEW]: this fallback chain guesses which price field applies per
// category — no per-category currency conversion, just the post's own
// market's symbol. Revisit once a proper per-country currency formatter
// exists.
function currencySymbolFor(post: LeanPost): string {
  const code = post.country as CountryCode | undefined;
  return (code && COUNTRY_CONFIGS[code]?.currencySymbol) || "$";
}

/** Price suffix per Rent Period value (posting/form-schema/defaults/property.ts). */
const RENT_PERIOD_SUFFIX: Record<string, string> = {
  month: "/ mo",
  week: "/ week",
  year: "/ yr",
  areaYear: "/ sq ft / yr",
  areaMonth: "/ sq ft / mo",
};

/** Price suffix per Jobs Pay Period value (posting/form-schema/defaults/jobs.ts). */
const SALARY_PERIOD_SUFFIX: Record<string, string> = {
  hour: "/ hr",
  day: "/ day",
  week: "/ week",
  month: "/ mo",
  year: "/ yr",
};

export function resolvePrice(post: LeanPost): { priceLabel: string; priceSuffix?: string } {
  const symbol = currencySymbolFor(post);
  const fmt = (n: number) => `${symbol}${n.toLocaleString()}`;
  if (post.rentPrice != null) {
    // Some forms ask how the rent is quoted (Rent Period, saved in attributes).
    const period = String(post.attributes?.rentPeriod ?? "month");
    return { priceLabel: fmt(post.rentPrice), priceSuffix: RENT_PERIOD_SUFFIX[period] ?? "/ mo" };
  }
  if (post.salePrice != null) return { priceLabel: fmt(post.salePrice) };
  if (post.rent != null) return { priceLabel: fmt(post.rent), priceSuffix: "/ mo" };
  if (post.rateNightly != null) return { priceLabel: fmt(post.rateNightly), priceSuffix: "/ night" };
  if (post.rateMonthly != null) return { priceLabel: fmt(post.rateMonthly), priceSuffix: "/ mo" };
  if (post.salary != null) {
    // Jobs: Pay Period beside the salary (saved in attributes); older posts have none.
    const period = String(post.attributes?.salaryPeriod ?? "");
    // Full Time asks Salary From – To; the To is saved in attributes.
    const to = Number(post.attributes?.salaryMax);
    const label = to > post.salary ? `${fmt(post.salary)} – ${fmt(to)}` : fmt(post.salary);
    return { priceLabel: label, priceSuffix: SALARY_PERIOD_SUFFIX[period] };
  }
  if (post.hourlyRate != null) return { priceLabel: fmt(post.hourlyRate), priceSuffix: "/ hr" };
  // Jobs › Freelance: a fixed or hourly budget.
  if (post.budgetAmount != null) {
    return { priceLabel: fmt(post.budgetAmount), priceSuffix: post.budgetType === "hourly" ? "/ hr" : undefined };
  }
  if (post.price != null) return { priceLabel: fmt(post.price) };
  if (post.budget != null) return { priceLabel: fmt(post.budget) };
  return { priceLabel: "Price on request" };
}

// TODO [REVIEW]: generic fallback since there's no single "details" field on
// Post; revisit per-category once category-specific card layouts exist.
export function resolveDetailsLabel(post: LeanPost): string {
  if (post.beds != null || post.baths != null) {
    return [
      post.beds != null ? `${post.beds} BEDS` : null,
      post.baths != null ? `${post.baths} BATHS` : null,
      post.propertyType ? post.propertyType.toUpperCase() : null,
    ]
      .filter(Boolean)
      .join(" • ");
  }
  return [post.category, post.subcategory]
    .filter(Boolean)
    .join(" • ")
    .toUpperCase();
}

export type { FeaturedListingItem };

/**
 * Public identifier for a post's URL — its `adsId` when present, else the
 * raw Mongo id. Uses `||`, not `??`: some legacy posts have `adsId: ""`
 * (empty string, not null/undefined — see generateAdsId.ts), which `??`
 * would let through as a broken empty-string URL segment.
 */
export function resolvePostId(post: LeanPost): string {
  return post.adsId || String(post._id);
}

export function mapPostToFeaturedItem(post: LeanPost): FeaturedListingItem {
  const id = resolvePostId(post);
  const { priceLabel, priceSuffix } = resolvePrice(post);

  return {
    id,
    href: `/listings/${id}`,
    images: (post.images ?? []).map((src) => ({ src })),
    priceLabel,
    priceSuffix,
    title: post.name,
    detailsLabel: resolveDetailsLabel(post),
    locationLabel: post.location?.address ?? "",
    postedAt: post.createdAt ?? new Date(),
    status: mapStatus(post.status, post.isSuspended),
  };
}

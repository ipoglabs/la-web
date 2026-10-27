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

/** Price suffix per Services / Pet Care / Business / Community / Education Price Per value (posting/form-schema/defaults/services.ts, pets.ts, business.ts, community.ts, education.ts); "from" is a prefix instead. */
const PRICE_UNIT_SUFFIX: Record<string, string> = {
  visit: "/ visit",
  hour: "/ hr",
  day: "/ day",
  job: "/ job",
  month: "/ mo",
  project: "/ project",
  session: "/ session",
  package: "/ package",
  class: "/ class",
  course: "/ course",
  person: "/ person",
  group: "/ group",
  trip: "/ trip",
  plate: "/ plate",
  meal: "/ meal",
  order: "/ order",
  repair: "/ repair",
  event: "/ event",
  item: "/ item",
  night: "/ night",
  walk: "/ walk",
  week: "/ week",
  unit: "/ unit",
  programme: "/ programme",
  filing: "/ filing",
  term: "/ term",
  year: "/ yr",
};

/** Special Offers' Deal Type labels for a card with no % off or price (posting/form-schema/defaults/specialOffers.ts). */
const OFFER_DEAL_LABEL: Record<string, string> = {
  pct_off: "% off",
  flat_off: "Money off",
  bogo: "Buy 1 Get 1",
  bundle: "Bundle deal",
  flash: "Flash sale",
  cashback: "Cashback",
  voucher: "Voucher",
  free_gift: "Free gift",
  free_trial: "Free trial",
  free_delivery: "Free delivery",
  special_rate: "Special rate",
  tradein: "Trade-in bonus",
  instalments: "0% instalments",
};

export function resolvePrice(post: LeanPost): { priceLabel: string; priceSuffix?: string } {
  const symbol = currencySymbolFor(post);
  const fmt = (n: number) => `${symbol}${n.toLocaleString()}`;
  // Pets › Lost & Found: a reward instead of a price (saved in attributes).
  if (post.category === "pets" && post.subcategory === "lost_found") {
    const reward = Number(post.attributes?.reward);
    if (reward > 0) return { priceLabel: `Reward ${fmt(reward)}` };
    return { priceLabel: post.reportType === "found" ? "Found" : "Lost" };
  }
  // Pets › Adoption: no fee means free to a good home.
  if (post.category === "pets" && post.subcategory === "adoption" && post.salePrice === 0) return { priceLabel: "Free" };
  if (post.category === "business") {
    const unit = String(post.attributes?.priceUnit ?? "");
    if (unit === "quote") return { priceLabel: "Price on request" };
    if (unit === "equity") return { priceLabel: "Equity only" };
    // Franchise: the investment a franchisee needs (saved in attributes).
    const investment = Number(post.attributes?.investmentRequired);
    if (post.subcategory === "franchise" && investment > 0) return { priceLabel: `Investment ${fmt(investment)}` };
    // Partnership: an ask with no Investment Amount that offers equity.
    const offering = post.attributes?.offering;
    if (post.subcategory === "partnership" && post.budgetAmount == null && Array.isArray(offering) && offering.includes("equity")) {
      return { priceLabel: "Equity deal" };
    }
    if (post.salePrice === 0) return { priceLabel: "Free" };
  }
  // Special Offers: the deal itself — "20% off", the offer price, or the kind of deal.
  if (post.category === "special_offers") {
    const pct = Number(post.attributes?.discountPct);
    if (pct > 0) return { priceLabel: `${pct}% off` };
    if (Number(post.salePrice) > 0) return { priceLabel: fmt(Number(post.salePrice)) };
    return { priceLabel: OFFER_DEAL_LABEL[String(post.attributes?.dealType ?? "")] ?? "Offer" };
  }
  // Free & Giveaway: nothing is priced.
  if (post.category === "free_giveaway") return { priceLabel: "Free" };
  // Education: a school ad or open day with no fees is free.
  if (post.category === "education" && !(Number(post.salePrice ?? post.price) > 0)) return { priceLabel: "Free" };
  if (post.category === "community") {
    const fee = Number(post.salePrice ?? 0);
    switch (post.subcategory) {
      // A reward instead of a price (saved in attributes), as in Pets › Lost & Found.
      case "lost_found": {
        const reward = Number(post.attributes?.reward);
        if (reward > 0) return { priceLabel: `Reward ${fmt(reward)}` };
        return { priceLabel: post.reportType === "found" ? "Found" : "Lost" };
      }
      case "volunteering":
        return { priceLabel: "Volunteer" };
      case "announcement":
        return { priceLabel: "Notice" };
      case "general_others":
        return { priceLabel: "Free" };
      case "wanted":
        return post.budgetAmount ? { priceLabel: fmt(post.budgetAmount) } : { priceLabel: "Wanted" };
      case "rideshare_carpool":
        // No cost given means riders split the running costs.
        if (fee > 0) return { priceLabel: fmt(fee), priceSuffix: "/ seat" };
        return { priceLabel: post.salePrice === 0 ? "Free ride" : "Split costs" };
      // Events, classes, courses and family activities: no fee means free.
      default:
        if (!(fee > 0)) return { priceLabel: "Free" };
    }
  }
  if (post.rentPrice != null) {
    // Some forms ask how the rent is quoted (Rent Period, saved in attributes).
    const period = String(post.attributes?.rentPeriod ?? "month");
    return { priceLabel: fmt(post.rentPrice), priceSuffix: RENT_PERIOD_SUFFIX[period] ?? "/ mo" };
  }
  if (post.salePrice != null) {
    // Services ask what the price covers (Price Per, saved in attributes).
    const unit = String(post.attributes?.priceUnit ?? "");
    if (unit === "from") return { priceLabel: `From ${fmt(post.salePrice)}` };
    return { priceLabel: fmt(post.salePrice), priceSuffix: PRICE_UNIT_SUFFIX[unit] };
  }
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
  // Jobs › Freelance: a fixed or hourly budget. Services › Wanted: Budget Per.
  if (post.budgetAmount != null) {
    const suffix = post.budgetType === "hourly" ? "/ hr" : PRICE_UNIT_SUFFIX[String(post.attributes?.priceUnit ?? "")];
    return { priceLabel: fmt(post.budgetAmount), priceSuffix: suffix };
  }
  // Jobs › Internship: a monthly stipend, or none when unpaid.
  if (post.stipendType === "unpaid") return { priceLabel: "Unpaid" };
  if (post.stipendAmount != null) return { priceLabel: fmt(post.stipendAmount), priceSuffix: "/ mo" };
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

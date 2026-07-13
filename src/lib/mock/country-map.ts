/**
 * lib/mock/country-map.ts
 *
 * ONE generic, category-agnostic resolver for country-scoped mock listings.
 * Replaces the bespoke per-category "*-country.ts" pattern (property-country.ts)
 * so every new category gets country-awareness for free once its data exists —
 * no new resolver file, no new API route needed per category.
 *
 * ─── HOW A CATEGORY BECOMES COUNTRY-AWARE ────────────────────────────────────
 *   1. Build lib/mock/in/<category>/ and lib/mock/sg/<category>/ (own sellers +
 *      subcategory files + index.ts, mirroring lib/mock/<category>/ shape)
 *   2. Import the IN/SG (and GB, if it has its own dedicated folder) exports below
 *   3. Add an entry to COUNTRY_OVERRIDES keyed by the category id
 *
 * Categories NOT yet in COUNTRY_OVERRIDES automatically fall back to the
 * generic (GB-flavoured) data in CATEGORY_MAP / ALL_MAP for every country —
 * this is the exact same data every country already saw before this file
 * existed, so there is no regression, only opt-in improvement.
 */
import type { CountryCode } from "@/config";
import type { MockListing } from "./mock-listing-schema";
import { CATEGORY_MAP, ALL_MAP } from "./listing-map";

// ── Property — fully localized (IN, GB, SG each have dedicated mock data) ───
import {
  IN_ALL_PROPERTY_LISTINGS,
  IN_PROPERTY_SUBCATEGORY_MAP,
} from "@/lib/mock/in/property";
import {
  GB_ALL_PROPERTY_LISTINGS,
  GB_PROPERTY_SUBCATEGORY_MAP,
} from "@/lib/mock/gb/property";
import {
  SG_ALL_PROPERTY_LISTINGS,
  SG_PROPERTY_SUBCATEGORY_MAP,
} from "@/lib/mock/sg/property";

// ── Vehicles — fully localized (IN, SG) ─────────────────────────────────────
import {
  IN_ALL_VEHICLES_LISTINGS,
  IN_VEHICLES_SUBCATEGORY_MAP,
} from "@/lib/mock/in/vehicles";
import {
  GB_ALL_VEHICLES_LISTINGS,
  GB_VEHICLES_SUBCATEGORY_MAP,
} from "@/lib/mock/gb/vehicles";
import {
  SG_ALL_VEHICLES_LISTINGS,
  SG_VEHICLES_SUBCATEGORY_MAP,
} from "@/lib/mock/sg/vehicles";

// ── Jobs — fully localized (IN, GB, SG) ─────────────────────────────────
import { IN_ALL_JOBS_LISTINGS, IN_JOBS_SUBCATEGORY_MAP } from "@/lib/mock/in/jobs";
import { GB_ALL_JOBS_LISTINGS, GB_JOBS_SUBCATEGORY_MAP } from "@/lib/mock/gb/jobs";
import { SG_ALL_JOBS_LISTINGS, SG_JOBS_SUBCATEGORY_MAP } from "@/lib/mock/sg/jobs";

// ── Services — fully localized (IN, GB, SG) ───────────────────────
import { IN_ALL_SERVICES_LISTINGS, IN_SERVICES_SUBCATEGORY_MAP } from "@/lib/mock/in/services";
import { GB_ALL_SERVICES_LISTINGS, GB_SERVICES_SUBCATEGORY_MAP } from "@/lib/mock/gb/services";
import { SG_ALL_SERVICES_LISTINGS, SG_SERVICES_SUBCATEGORY_MAP } from "@/lib/mock/sg/services";

// ── Pets — fully localized (IN, GB, SG) ───────────────────────────
import { IN_ALL_PETS_LISTINGS, IN_PETS_SUBCATEGORY_MAP } from "@/lib/mock/in/pets";
import { GB_ALL_PETS_LISTINGS, GB_PETS_SUBCATEGORY_MAP } from "@/lib/mock/gb/pets";
import { SG_ALL_PETS_LISTINGS, SG_PETS_SUBCATEGORY_MAP } from "@/lib/mock/sg/pets";

// ── Business — fully localized (IN, GB, SG) ───────────────────────
import { IN_ALL_BUSINESS_LISTINGS, IN_BUSINESS_SUBCATEGORY_MAP } from "@/lib/mock/in/business";
import { GB_ALL_BUSINESS_LISTINGS, GB_BUSINESS_SUBCATEGORY_MAP } from "@/lib/mock/gb/business";
import { SG_ALL_BUSINESS_LISTINGS, SG_BUSINESS_SUBCATEGORY_MAP } from "@/lib/mock/sg/business";

// ── Community — fully localized (IN, GB, SG) ─────────────────────
import { IN_ALL_COMMUNITY_LISTINGS, IN_COMMUNITY_SUBCATEGORY_MAP } from "@/lib/mock/in/community";
import { GB_ALL_COMMUNITY_LISTINGS, GB_COMMUNITY_SUBCATEGORY_MAP } from "@/lib/mock/gb/community";
import { SG_ALL_COMMUNITY_LISTINGS, SG_COMMUNITY_SUBCATEGORY_MAP } from "@/lib/mock/sg/community";

// ── Special Offers — fully localized (IN, GB, SG) ───────────────────
import { IN_ALL_SPECIAL_OFFERS_LISTINGS, IN_SPECIAL_OFFERS_SUBCATEGORY_MAP } from "@/lib/mock/in/special_offers";
import { GB_ALL_SPECIAL_OFFERS_LISTINGS, GB_SPECIAL_OFFERS_SUBCATEGORY_MAP } from "@/lib/mock/gb/special_offers";
import { SG_ALL_SPECIAL_OFFERS_LISTINGS, SG_SPECIAL_OFFERS_SUBCATEGORY_MAP } from "@/lib/mock/sg/special_offers";

// ── Education — fully localized (IN, GB, SG) ────────────────────
import { IN_ALL_EDUCATION_LISTINGS, IN_EDUCATION_SUBCATEGORY_MAP } from "@/lib/mock/in/education";
import { GB_ALL_EDUCATION_LISTINGS, GB_EDUCATION_SUBCATEGORY_MAP } from "@/lib/mock/gb/education";
import { SG_ALL_EDUCATION_LISTINGS, SG_EDUCATION_SUBCATEGORY_MAP } from "@/lib/mock/sg/education";

// ── Health & Beauty — fully localized (IN, GB, SG) ──────────────────
import { IN_ALL_HEALTH_BEAUTY_LISTINGS, IN_HEALTH_BEAUTY_SUBCATEGORY_MAP } from "@/lib/mock/in/health_beauty";
import { GB_ALL_HEALTH_BEAUTY_LISTINGS, GB_HEALTH_BEAUTY_SUBCATEGORY_MAP } from "@/lib/mock/gb/health_beauty";
import { SG_ALL_HEALTH_BEAUTY_LISTINGS, SG_HEALTH_BEAUTY_SUBCATEGORY_MAP } from "@/lib/mock/sg/health_beauty";

// ── Food & Dining — fully localized (IN, GB, SG) ────────────────────
import { IN_ALL_FOOD_DINING_LISTINGS, IN_FOOD_DINING_SUBCATEGORY_MAP } from "@/lib/mock/in/food_dining";
import { GB_ALL_FOOD_DINING_LISTINGS, GB_FOOD_DINING_SUBCATEGORY_MAP } from "@/lib/mock/gb/food_dining";
import { SG_ALL_FOOD_DINING_LISTINGS, SG_FOOD_DINING_SUBCATEGORY_MAP } from "@/lib/mock/sg/food_dining";

// ── Travel & Stays — fully localized (IN, GB, SG) ───────────────────
import { IN_ALL_TRAVEL_STAYS_LISTINGS, IN_TRAVEL_STAYS_SUBCATEGORY_MAP } from "@/lib/mock/in/travel_stays";
import { GB_ALL_TRAVEL_STAYS_LISTINGS, GB_TRAVEL_STAYS_SUBCATEGORY_MAP } from "@/lib/mock/gb/travel_stays";
import { SG_ALL_TRAVEL_STAYS_LISTINGS, SG_TRAVEL_STAYS_SUBCATEGORY_MAP } from "@/lib/mock/sg/travel_stays";

// ── Baby & Kids — fully localized (IN, GB, SG) ──────────────────────
import { IN_ALL_BABY_KIDS_LISTINGS, IN_BABY_KIDS_SUBCATEGORY_MAP } from "@/lib/mock/in/baby_kids";
import { GB_ALL_BABY_KIDS_LISTINGS, GB_BABY_KIDS_SUBCATEGORY_MAP } from "@/lib/mock/gb/baby_kids";
import { SG_ALL_BABY_KIDS_LISTINGS, SG_BABY_KIDS_SUBCATEGORY_MAP } from "@/lib/mock/sg/baby_kids";
// ── Sports & Outdoors — fully localized (IN, GB, SG) ────────────────────────
import { IN_ALL_SPORTS_OUTDOORS_LISTINGS, IN_SPORTS_OUTDOORS_SUBCATEGORY_MAP } from "@/lib/mock/in/sports_outdoors";
import { GB_ALL_SPORTS_OUTDOORS_LISTINGS, GB_SPORTS_OUTDOORS_SUBCATEGORY_MAP } from "@/lib/mock/gb/sports_outdoors";
import { SG_ALL_SPORTS_OUTDOORS_LISTINGS, SG_SPORTS_OUTDOORS_SUBCATEGORY_MAP } from "@/lib/mock/sg/sports_outdoors";

// ── Electronics & Tech — fully localized (IN, GB, SG) ───────────────────────
import { IN_ALL_ELECTRONICS_TECH_LISTINGS, IN_ELECTRONICS_TECH_SUBCATEGORY_MAP } from "@/lib/mock/in/electronics_tech";
import { GB_ALL_ELECTRONICS_TECH_LISTINGS, GB_ELECTRONICS_TECH_SUBCATEGORY_MAP } from "@/lib/mock/gb/electronics_tech";
import { SG_ALL_ELECTRONICS_TECH_LISTINGS, SG_ELECTRONICS_TECH_SUBCATEGORY_MAP } from "@/lib/mock/sg/electronics_tech";

// ── Home & Furniture — fully localized (IN, GB, SG) ─────────────────────────
import { IN_ALL_HOME_FURNITURE_LISTINGS, IN_HOME_FURNITURE_SUBCATEGORY_MAP } from "@/lib/mock/in/home_furniture";
import { GB_ALL_HOME_FURNITURE_LISTINGS, GB_HOME_FURNITURE_SUBCATEGORY_MAP } from "@/lib/mock/gb/home_furniture";
import { SG_ALL_HOME_FURNITURE_LISTINGS, SG_HOME_FURNITURE_SUBCATEGORY_MAP } from "@/lib/mock/sg/home_furniture";

// ── Fashion & Clothing — fully localized (IN, GB, SG) ───────────────────────
import { IN_ALL_FASHION_CLOTHING_LISTINGS, IN_FASHION_CLOTHING_SUBCATEGORY_MAP } from "@/lib/mock/in/fashion_clothing";
import { GB_ALL_FASHION_CLOTHING_LISTINGS, GB_FASHION_CLOTHING_SUBCATEGORY_MAP } from "@/lib/mock/gb/fashion_clothing";
import { SG_ALL_FASHION_CLOTHING_LISTINGS, SG_FASHION_CLOTHING_SUBCATEGORY_MAP } from "@/lib/mock/sg/fashion_clothing";

// ── Musical Instruments — fully localized (IN, GB, SG) ──────────────────────
import { IN_ALL_MUSICAL_INSTRUMENTS_LISTINGS, IN_MUSICAL_INSTRUMENTS_SUBCATEGORY_MAP } from "@/lib/mock/in/musical_instruments";
import { GB_ALL_MUSICAL_INSTRUMENTS_LISTINGS, GB_MUSICAL_INSTRUMENTS_SUBCATEGORY_MAP } from "@/lib/mock/gb/musical_instruments";
import { SG_ALL_MUSICAL_INSTRUMENTS_LISTINGS, SG_MUSICAL_INSTRUMENTS_SUBCATEGORY_MAP } from "@/lib/mock/sg/musical_instruments";

// ── Books/Media/Collectibles — fully localized (IN, GB, SG) ─────────────────
import { IN_ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS, IN_BOOKS_MEDIA_COLLECTIBLES_SUBCATEGORY_MAP } from "@/lib/mock/in/books_media_collectibles";
import { GB_ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS, GB_BOOKS_MEDIA_COLLECTIBLES_SUBCATEGORY_MAP } from "@/lib/mock/gb/books_media_collectibles";
import { SG_ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS, SG_BOOKS_MEDIA_COLLECTIBLES_SUBCATEGORY_MAP } from "@/lib/mock/sg/books_media_collectibles";
import { IN_ALL_TICKETS_VOUCHERS_LISTINGS, IN_TICKETS_VOUCHERS_SUBCATEGORY_MAP } from "@/lib/mock/in/tickets_vouchers";
import { GB_ALL_TICKETS_VOUCHERS_LISTINGS, GB_TICKETS_VOUCHERS_SUBCATEGORY_MAP } from "@/lib/mock/gb/tickets_vouchers";
import { SG_ALL_TICKETS_VOUCHERS_LISTINGS, SG_TICKETS_VOUCHERS_SUBCATEGORY_MAP } from "@/lib/mock/sg/tickets_vouchers";
import { IN_ALL_FREE_GIVEAWAY_LISTINGS, IN_FREE_GIVEAWAY_SUBCATEGORY_MAP } from "@/lib/mock/in/free_giveaway";
import { GB_ALL_FREE_GIVEAWAY_LISTINGS, GB_FREE_GIVEAWAY_SUBCATEGORY_MAP } from "@/lib/mock/gb/free_giveaway";
import { SG_ALL_FREE_GIVEAWAY_LISTINGS, SG_FREE_GIVEAWAY_SUBCATEGORY_MAP } from "@/lib/mock/sg/free_giveaway";

interface CountryOverride {
  all: MockListing[];
  bySub: Record<string, MockListing[]>;
}

type CategoryOverrides = Partial<Record<CountryCode, CountryOverride>>;

/**
 * Per-category, per-country data overrides.
 * Add one entry here each time a category gets dedicated IN/SG (and optionally
 * GB) mock data — see lib/mock/in/property and lib/mock/sg/property for the
 * reference implementation.
 */
const COUNTRY_OVERRIDES: Partial<Record<string, CategoryOverrides>> = {
  property: {
    in: { all: IN_ALL_PROPERTY_LISTINGS, bySub: IN_PROPERTY_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_PROPERTY_LISTINGS, bySub: GB_PROPERTY_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_PROPERTY_LISTINGS, bySub: SG_PROPERTY_SUBCATEGORY_MAP },
  },
  vehicles: {
    in: { all: IN_ALL_VEHICLES_LISTINGS, bySub: IN_VEHICLES_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_VEHICLES_LISTINGS, bySub: GB_VEHICLES_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_VEHICLES_LISTINGS, bySub: SG_VEHICLES_SUBCATEGORY_MAP },
  },
  jobs: {
    in: { all: IN_ALL_JOBS_LISTINGS, bySub: IN_JOBS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_JOBS_LISTINGS, bySub: GB_JOBS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_JOBS_LISTINGS, bySub: SG_JOBS_SUBCATEGORY_MAP },
  },
  services: {
    in: { all: IN_ALL_SERVICES_LISTINGS, bySub: IN_SERVICES_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_SERVICES_LISTINGS, bySub: GB_SERVICES_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_SERVICES_LISTINGS, bySub: SG_SERVICES_SUBCATEGORY_MAP },
  },
  pets: {
    in: { all: IN_ALL_PETS_LISTINGS, bySub: IN_PETS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_PETS_LISTINGS, bySub: GB_PETS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_PETS_LISTINGS, bySub: SG_PETS_SUBCATEGORY_MAP },
  },
  business: {
    in: { all: IN_ALL_BUSINESS_LISTINGS, bySub: IN_BUSINESS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_BUSINESS_LISTINGS, bySub: GB_BUSINESS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_BUSINESS_LISTINGS, bySub: SG_BUSINESS_SUBCATEGORY_MAP },
  },
  community: {
    in: { all: IN_ALL_COMMUNITY_LISTINGS, bySub: IN_COMMUNITY_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_COMMUNITY_LISTINGS, bySub: GB_COMMUNITY_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_COMMUNITY_LISTINGS, bySub: SG_COMMUNITY_SUBCATEGORY_MAP },
  },
  special_offers: {
    in: { all: IN_ALL_SPECIAL_OFFERS_LISTINGS, bySub: IN_SPECIAL_OFFERS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_SPECIAL_OFFERS_LISTINGS, bySub: GB_SPECIAL_OFFERS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_SPECIAL_OFFERS_LISTINGS, bySub: SG_SPECIAL_OFFERS_SUBCATEGORY_MAP },
  },
  education: {
    in: { all: IN_ALL_EDUCATION_LISTINGS, bySub: IN_EDUCATION_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_EDUCATION_LISTINGS, bySub: GB_EDUCATION_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_EDUCATION_LISTINGS, bySub: SG_EDUCATION_SUBCATEGORY_MAP },
  },
  health_beauty: {
    in: { all: IN_ALL_HEALTH_BEAUTY_LISTINGS, bySub: IN_HEALTH_BEAUTY_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_HEALTH_BEAUTY_LISTINGS, bySub: GB_HEALTH_BEAUTY_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_HEALTH_BEAUTY_LISTINGS, bySub: SG_HEALTH_BEAUTY_SUBCATEGORY_MAP },
  },
  food_dining: {
    in: { all: IN_ALL_FOOD_DINING_LISTINGS, bySub: IN_FOOD_DINING_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_FOOD_DINING_LISTINGS, bySub: GB_FOOD_DINING_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_FOOD_DINING_LISTINGS, bySub: SG_FOOD_DINING_SUBCATEGORY_MAP },
  },
  travel_stays: {
    in: { all: IN_ALL_TRAVEL_STAYS_LISTINGS, bySub: IN_TRAVEL_STAYS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_TRAVEL_STAYS_LISTINGS, bySub: GB_TRAVEL_STAYS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_TRAVEL_STAYS_LISTINGS, bySub: SG_TRAVEL_STAYS_SUBCATEGORY_MAP },
  },
  baby_kids: {
    in: { all: IN_ALL_BABY_KIDS_LISTINGS, bySub: IN_BABY_KIDS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_BABY_KIDS_LISTINGS, bySub: GB_BABY_KIDS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_BABY_KIDS_LISTINGS, bySub: SG_BABY_KIDS_SUBCATEGORY_MAP },
  },
  sports_outdoors: {
    in: { all: IN_ALL_SPORTS_OUTDOORS_LISTINGS, bySub: IN_SPORTS_OUTDOORS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_SPORTS_OUTDOORS_LISTINGS, bySub: GB_SPORTS_OUTDOORS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_SPORTS_OUTDOORS_LISTINGS, bySub: SG_SPORTS_OUTDOORS_SUBCATEGORY_MAP },
  },
  electronics_tech: {
    in: { all: IN_ALL_ELECTRONICS_TECH_LISTINGS, bySub: IN_ELECTRONICS_TECH_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_ELECTRONICS_TECH_LISTINGS, bySub: GB_ELECTRONICS_TECH_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_ELECTRONICS_TECH_LISTINGS, bySub: SG_ELECTRONICS_TECH_SUBCATEGORY_MAP },
  },
  home_furniture: {
    in: { all: IN_ALL_HOME_FURNITURE_LISTINGS, bySub: IN_HOME_FURNITURE_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_HOME_FURNITURE_LISTINGS, bySub: GB_HOME_FURNITURE_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_HOME_FURNITURE_LISTINGS, bySub: SG_HOME_FURNITURE_SUBCATEGORY_MAP },
  },
  fashion_clothing: {
    in: { all: IN_ALL_FASHION_CLOTHING_LISTINGS, bySub: IN_FASHION_CLOTHING_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_FASHION_CLOTHING_LISTINGS, bySub: GB_FASHION_CLOTHING_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_FASHION_CLOTHING_LISTINGS, bySub: SG_FASHION_CLOTHING_SUBCATEGORY_MAP },
  },
  musical_instruments: {
    in: { all: IN_ALL_MUSICAL_INSTRUMENTS_LISTINGS, bySub: IN_MUSICAL_INSTRUMENTS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_MUSICAL_INSTRUMENTS_LISTINGS, bySub: GB_MUSICAL_INSTRUMENTS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_MUSICAL_INSTRUMENTS_LISTINGS, bySub: SG_MUSICAL_INSTRUMENTS_SUBCATEGORY_MAP },
  },
  books_media_collectibles: {
    in: { all: IN_ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS, bySub: IN_BOOKS_MEDIA_COLLECTIBLES_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS, bySub: GB_BOOKS_MEDIA_COLLECTIBLES_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_BOOKS_MEDIA_COLLECTIBLES_LISTINGS, bySub: SG_BOOKS_MEDIA_COLLECTIBLES_SUBCATEGORY_MAP },
  },
  tickets_vouchers: {
    in: { all: IN_ALL_TICKETS_VOUCHERS_LISTINGS, bySub: IN_TICKETS_VOUCHERS_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_TICKETS_VOUCHERS_LISTINGS, bySub: GB_TICKETS_VOUCHERS_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_TICKETS_VOUCHERS_LISTINGS, bySub: SG_TICKETS_VOUCHERS_SUBCATEGORY_MAP },
  },
  free_giveaway: {
    in: { all: IN_ALL_FREE_GIVEAWAY_LISTINGS, bySub: IN_FREE_GIVEAWAY_SUBCATEGORY_MAP },
    gb: { all: GB_ALL_FREE_GIVEAWAY_LISTINGS, bySub: GB_FREE_GIVEAWAY_SUBCATEGORY_MAP },
    sg: { all: SG_ALL_FREE_GIVEAWAY_LISTINGS, bySub: SG_FREE_GIVEAWAY_SUBCATEGORY_MAP },
  },
};

/** Canonical subcategory ids for a category (from the generic data shape). */
export function getSubcategoryIds(categoryId: string): string[] {
  return Object.keys(CATEGORY_MAP[categoryId] ?? {});
}

export function isKnownCategory(categoryId: string): boolean {
  return categoryId in ALL_MAP;
}

export function isKnownSubcategory(categoryId: string, sub: string): boolean {
  return sub in (CATEGORY_MAP[categoryId] ?? {});
}

/**
 * Resolve listings for a category, scoped to a country, optionally a subcategory.
 * Falls back to the generic (non-country-aware) data when no override exists
 * for this category/country combination yet.
 */
export function getListingsForMarket(
  categoryId: string,
  country: CountryCode,
  sub?: string,
): MockListing[] {
  const override = COUNTRY_OVERRIDES[categoryId]?.[country];
  if (override) {
    return sub ? (override.bySub[sub] ?? []) : override.all;
  }
  if (sub) return CATEGORY_MAP[categoryId]?.[sub] ?? [];
  return ALL_MAP[categoryId] ?? [];
}

/** Result counts per subcategory for a category, scoped to a country. */
export function getCountsForMarket(
  categoryId: string,
  country: CountryCode,
): Record<string, number> {
  const subIds = getSubcategoryIds(categoryId);
  const counts: Record<string, number> = {};
  for (const sub of subIds) {
    counts[sub] = getListingsForMarket(categoryId, country, sub).length;
  }
  return counts;
}

/**
 * Category ids in stable, deterministic order — object key insertion order of
 * COUNTRY_OVERRIDES, which mirrors the order categories were added to the
 * platform. Used by getFeaturedForMarket() to build a "one item per category"
 * cross-category mix, same curation shape as the old hand-picked
 * RECENT_POSTS / TOP_PICKS arrays, but generated automatically per market.
 */
const FEATURED_CATEGORY_ORDER = Object.keys(COUNTRY_OVERRIDES);

/**
 * Homepage "Featured Listings" feed — a cross-category mix, scoped to a
 * market. Picks the `offset`-th listing from each category's full list (in
 * FEATURED_CATEGORY_ORDER), skipping categories that don't have that many
 * listings, until `limit` items are collected.
 *
 * `offset` lets the homepage show two distinct rows ("Recent Posts" at
 * offset 0, "Top Picks for You" at offset 1) without repeating the same
 * listing twice on the same page.
 *
 * This intentionally replaces the old hand-curated RECENT_POSTS / TOP_PICKS
 * constants in lib/mock/mock-listings.ts (which were hardcoded to Indian
 * cities/categories and never varied by market) — every new category or
 * market added to COUNTRY_OVERRIDES is automatically included here with zero
 * further code changes, same scalability contract as the rest of this file.
 *
 * ─── TODO [SCHEMA / API INTEGRATION] ─────────────────────────────────────────
 * When the real backend lands, this whole function should be deleted and
 * replaced by a real endpoint — do NOT port this "one per category" curation
 * logic to production, it's a mock-data convenience only:
 *
 *   GET /api/v1/listings/featured?country={isoCode}&section=recent&limit=10
 *   GET /api/v1/listings/featured?country={isoCode}&section=top-picks&limit=10
 *
 * The real "Recent Posts" should be the N most-recently-created listings
 * platform-wide for that country (ORDER BY createdAt DESC), independent of
 * category. The real "Top Picks" should come from a ranking/quality signal
 * the backend team defines (e.g. seller rating, view count, manual editorial
 * flag) — NOT a hardcoded per-category offset like this mock version.
 * Both endpoints must accept `country` as a required, validated param — never
 * return cross-market results.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function getFeaturedForMarket(
  country: CountryCode,
  offset: number,
  limit = 10,
): MockListing[] {
  const items: MockListing[] = [];
  for (const categoryId of FEATURED_CATEGORY_ORDER) {
    if (items.length >= limit) break;
    const all = getListingsForMarket(categoryId, country);
    if (all.length > offset) items.push(all[offset]);
  }
  return items;
}

/**
 * Cross-category "browse by city" mock resolver — powers URLs that carry a
 * `loc` param but no `cat` (e.g. the footer's "Top Locations" links). Scans
 * every category for the market and keeps listings whose free-text
 * `locationLabel` mentions the given city, aggregating until `limit` is hit.
 *
 * This is a mock-only convenience: `MockListing` has no structured city/geo
 * field, so matching is a case-insensitive substring check against the
 * display label (e.g. "Camden, London" matches cityLabel "London"). Only
 * advertise cities in lib/mock/footer-locations.ts that are known to have
 * real coverage here — this function does not manufacture data that doesn't
 * exist, it just stops that data from being hidden behind the `cat` guard.
 *
 * TODO [INTEGRATION]: replace with a real endpoint backed by a structured
 * city/geo field, e.g. GET /api/v1/listings?country={isoCode}&city={slug} —
 * do not port free-text substring matching to production.
 */
export function getListingsForCity(
  country: CountryCode,
  cityLabel: string,
  limit = 48,
): MockListing[] {
  const needle = cityLabel.trim().toLowerCase();
  if (!needle) return [];

  const items: MockListing[] = [];
  for (const categoryId of FEATURED_CATEGORY_ORDER) {
    if (items.length >= limit) break;
    for (const listing of getListingsForMarket(categoryId, country)) {
      if (listing.locationLabel.toLowerCase().includes(needle)) {
        items.push(listing);
        if (items.length >= limit) break;
      }
    }
  }
  return items;
}

/**
 * Find a listing AND its category/subcategory/market context by id — searches
 * across ALL markets (every country's COUNTRY_OVERRIDES first, then the
 * generic CATEGORY_MAP fallback data).
 *
 * Listing ids are globally unique by construction (country-prefixed for IN/SG,
 * e.g. "prop-in-room-01" / "prop-sg-room-01"; GB/generic carries no prefix),
 * so one global lookup safely resolves any listing regardless of which
 * country's browse session produced the link — no need to thread the
 * request's country through routing just to find the listing.
 *
 * `market` on the result is `null` when the listing came from the generic
 * CATEGORY_MAP fallback (categories not yet in COUNTRY_OVERRIDES) — pass it
 * straight through to getSimilarListings() so related items stay in the same
 * market/currency as the listing being viewed.
 *
 * TODO [INTEGRATION]: replace with GET /listings/{id} which must return
 * categoryId + subcategoryId + market on the payload.
 */
export function resolveListingContext(id: string): {
  listing: MockListing;
  cat: string;
  sub: string;
  market: CountryCode | null;
} | undefined {
  for (const [cat, overrides] of Object.entries(COUNTRY_OVERRIDES)) {
    if (!overrides) continue;
    for (const country of Object.keys(overrides) as CountryCode[]) {
      const override = overrides[country];
      if (!override) continue;
      for (const [sub, listings] of Object.entries(override.bySub)) {
        const found = listings.find((l) => l.id === id);
        if (found) return { listing: found, cat, sub, market: country };
      }
    }
  }
  for (const [cat, subMap] of Object.entries(CATEGORY_MAP)) {
    for (const [sub, listings] of Object.entries(subMap)) {
      const found = listings.find((l) => l.id === id);
      if (found) return { listing: found, cat, sub, market: null };
    }
  }
  return undefined;
}

/**
 * Returns up to `limit` listings from the same market + subcategory,
 * excluding the current listing. Falls back to same market + category (any
 * sub), then to generic data, if the sub has fewer than 2 listings.
 *
 * `market` should be the value resolved by resolveListingContext() for the
 * current listing — pass it through unchanged so similar items never mix
 * currencies/markets.
 *
 * TODO [INTEGRATION]: replace with GET /listings/similar?listingId={id}
 */
export function getSimilarListings(
  cat: string,
  sub: string,
  excludeId: string,
  market: CountryCode | null,
  limit = 12,
): MockListing[] {
  const subMap = (market && COUNTRY_OVERRIDES[cat]?.[market]?.bySub) || CATEGORY_MAP[cat];
  if (!subMap) return [];

  // Same subcategory first
  const sameSub = (subMap[sub] ?? []).filter((l) => l.id !== excludeId);
  if (sameSub.length >= 2) return sameSub.slice(0, limit);

  // Fall back to whole category (same market)
  const allInCat = Object.values(subMap).flat().filter((l) => l.id !== excludeId);
  return allInCat.slice(0, limit);
}

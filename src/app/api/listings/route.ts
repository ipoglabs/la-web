import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { COUNTRY_CONFIGS, getAppStage, getListingsDataSource, type CountryCode } from "@/config";
import { mapPostToListing, type LeanOwner } from "@/lib/mapPostToListing";
import { publicPostFilter } from "@/lib/postVisibility";
import { resolvePostSort } from "@/lib/postSort";
import { buildKeywordQuery, buildLocationQuery } from "@/lib/postSearchQuery";
import { getActiveListingCountsByOwner } from "@/lib/postActiveListingsCount";
import { parseGeoParams, filterByRadius, sortByDistance, shouldSortByDistance } from "@/lib/geo";
import type { ListingsApiResponse } from "@/types/listings-api";

const COUNTRY_CODES = Object.keys(COUNTRY_CONFIGS) as CountryCode[];

function parseCountryCode(raw: string | null): CountryCode | null {
  if (!raw) return null;
  const normalized = raw.toLowerCase();
  return COUNTRY_CODES.includes(normalized as CountryCode)
    ? (normalized as CountryCode)
    : null;
}

/**
 * Category-less "browse everything" endpoint — backs the landing page's
 * Recent Posts / Top Picks "See all" links (which have no single category
 * to scope /api/listings/[category] to) and the footer/LocationPicker's
 * `loc`-based city browse (no filter sidebar applies here either way, same
 * as /listings with cat empty never showing filters — see resolveFilters()).
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const country = parseCountryCode(searchParams.get("country"));

  if (!country) {
    return NextResponse.json(
      { error: "validation_error", message: "country must be one of: in, gb, sg" },
      { status: 400 },
    );
  }

  const stage = getAppStage();
  const source = getListingsDataSource(country, stage);

  if (source !== "db") {
    // No cross-category mock resolver exists for this market yet — see
    // useListingSearch.ts's loc-based city browse, which falls back to
    // lib/mock/country-map.ts's getListingsForCity() when this returns [].
    const response: ListingsApiResponse = {
      ok: true,
      source,
      market: country,
      categoryId: "",
      subCategoryId: null,
      currency: COUNTRY_CONFIGS[country].currency,
      total: 0,
      generatedAt: new Date().toISOString(),
      countsBySubcategory: {},
      items: [],
    };
    return NextResponse.json(response);
  }

  await dbConnect();

  const baseQuery: Record<string, unknown> = {
    ...publicPostFilter(),
    // Country-scoped via the real `country` field (models/post.ts). Posts
    // with none (predating that field, or created without a resolved
    // cookie) are treated as visible in every market rather than nowhere.
    $or: [{ country }, { country: { $exists: false } }],
  };

  // Combined via $and rather than spread — baseQuery and the keyword clause
  // each use their own top-level $or, which would collide (last write wins)
  // if merged into one object. locationQuery has no $or of its own, but
  // stays in the same array for one consistent combining rule.
  const keywordQuery = buildKeywordQuery(searchParams.get("q"));
  const locationQuery = buildLocationQuery(searchParams.get("loc"));
  const andClauses = [baseQuery, keywordQuery, locationQuery].filter(
    (clause): clause is Record<string, unknown> => clause !== null && Object.keys(clause).length > 0,
  );
  const query = andClauses.length > 1 ? { $and: andClauses } : andClauses[0];

  const dbItems = await Post.find(query)
    .sort(resolvePostSort(searchParams.get("sort")))
    .limit(50)
    .populate<{ ownerId: LeanOwner | null }>(
      "ownerId",
      "userId fullName image publicRole isEmailVerified isPrimaryNumberVerified createdAt"
    )
    .lean();

  const activeCounts = await getActiveListingCountsByOwner(dbItems.map((d) => d.ownerId?._id));
  let items = dbItems.map(({ ownerId, ...post }) =>
    mapPostToListing(post, ownerId ?? null, ownerId?._id ? activeCounts.get(String(ownerId._id)) ?? 1 : 1),
  );

  // "Near me" search — see lib/geo.ts. Applied post-fetch/post-map since
  // Post.location isn't stored in Mongo's geospatial shape (no 2dsphere
  // index); fine at this data volume (same POC-scale limit(50) above).
  const sortParam = searchParams.get("sort");
  const { lat, lng, radiusKm } = parseGeoParams({
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    radius: searchParams.get("radius"),
    unit: searchParams.get("unit"),
  });
  items = filterByRadius(items, lat, lng, radiusKm);
  if (lat != null && lng != null && shouldSortByDistance(sortParam, lat, lng)) {
    items = sortByDistance(items, lat, lng);
  }

  const response: ListingsApiResponse = {
    ok: true,
    source,
    market: country,
    categoryId: "",
    subCategoryId: null,
    currency: COUNTRY_CONFIGS[country].currency,
    total: items.length,
    generatedAt: new Date().toISOString(),
    countsBySubcategory: {},
    items,
  };

  return NextResponse.json(response);
}

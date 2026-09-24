import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import {
  COUNTRY_CONFIGS,
  getAppStage,
  getListingsDataSource,
  type CountryCode,
} from "@/config";
import {
  getListingsForMarket,
  getCountsForMarket,
  filterListingsByKeyword,
  sortMockListings,
  isKnownCategory,
  isKnownSubcategory,
} from "@/lib/mock/country-map";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
import { LEGACY_SUBCATEGORY_ALIASES, exactCaseInsensitive } from "@/lib/postSubcategoryAliases";
import { mapPostToListing, type LeanOwner } from "@/lib/mapPostToListing";
import { publicPostFilter } from "@/lib/postVisibility";
import { resolvePostSort } from "@/lib/postSort";
import { parseFilterValues } from "@/lib/listing-filters";
import { buildFilterQuery } from "@/lib/postFilterQuery";
import { buildKeywordQuery } from "@/lib/postSearchQuery";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;
  const searchParams = req.nextUrl.searchParams;
  const country = parseCountryCode(searchParams.get("country"));

  if (!country) {
    return NextResponse.json(
      { error: "validation_error", message: "country must be one of: in, gb, sg" },
      { status: 400 },
    );
  }

  if (!isKnownCategory(category)) {
    return NextResponse.json(
      { error: "not_found", message: `unknown category: ${category}` },
      { status: 404 },
    );
  }

  const subRaw = searchParams.get("sub");
  if (subRaw && !isKnownSubcategory(category, subRaw)) {
    return NextResponse.json(
      { error: "validation_error", message: `sub is invalid for category=${category}` },
      { status: 400 },
    );
  }
  const sub = subRaw && isKnownSubcategory(category, subRaw) ? subRaw : null;

  const stage = getAppStage();
  const source = getListingsDataSource(country, stage);

  if (source === "db") {
    await dbConnect();

    // Post.category/subcategory are stored as whatever the post wizard
    // submitted, which in the sample data seen so far is the display LABEL
    // ("Vehicles", "Food & Dining") rather than the canonical id this route
    // receives ("vehicles", "food_dining") — match either so real posts
    // aren't silently invisible regardless of which convention a given
    // category's form step actually used.
    const categoryLabel = CATEGORY_LABELS[category];
    const baseQuery: Record<string, unknown> = {
      category: categoryLabel ? { $in: [category, categoryLabel] } : category,
      ...publicPostFilter(),
      // Country-scoped via the real `country` field (models/post.ts). Posts
      // with none (predating that field, or created without a resolved
      // cookie) are treated as visible in every market rather than nowhere.
      $or: [{ country }, { country: { $exists: false } }],
    };

    // Real per-subcategory counts for the filter sidebar — same category/
    // visibility/country scope as baseQuery (grouped BEFORE `sub` narrows
    // baseQuery below, so every subcategory gets a count, not just the
    // selected one). Post.subcategory can hold either the canonical id or
    // the display label depending on which posting flow wrote it (see the
    // comment above baseQuery), so group on the raw value and fold both
    // forms back onto the same id via SUBCATEGORY_LABELS.
    const subLabels = SUBCATEGORY_LABELS[category] ?? {};
    const legacyAliases = LEGACY_SUBCATEGORY_ALIASES[category] ?? {};
    const labelToId = new Map<string, string>();
    for (const [id, label] of Object.entries(subLabels)) {
      labelToId.set(id.toLowerCase(), id);
      if (label) labelToId.set(label.toLowerCase(), id);
    }
    for (const [rawLegacy, id] of Object.entries(legacyAliases)) {
      labelToId.set(rawLegacy, id);
    }
    const countsBySubcategory: Record<string, number> = {};
    for (const id of Object.keys(subLabels)) countsBySubcategory[id] = 0;

    const subCountRows = await Post.aggregate<{ _id: string | null; count: number }>([
      { $match: baseQuery },
      { $group: { _id: "$subcategory", count: { $sum: 1 } } },
    ]);
    for (const row of subCountRows) {
      const id = labelToId.get(String(row._id ?? "").toLowerCase());
      if (id) countsBySubcategory[id] = (countsBySubcategory[id] ?? 0) + row.count;
    }

    if (sub) {
      const subLabel = SUBCATEGORY_LABELS[category]?.[sub];
      // Include any legacy raw strings (e.g. "Car", "Bikes") that alias to
      // this id, so a real post written with old wording still shows up
      // when a user filters specifically to this subcategory. Matched
      // case-insensitively since alias keys are lowercase but the actual
      // stored casing varies ("Car", "car", ...).
      const legacyRaw = Object.entries(legacyAliases)
        .filter(([, id]) => id === sub)
        .map(([raw]) => exactCaseInsensitive(raw));
      const values: (string | RegExp)[] = [sub, subLabel, ...legacyRaw].filter(
        (v): v is string | RegExp => Boolean(v),
      );
      baseQuery.subcategory = values.length > 1 ? { $in: values } : values[0];
    }

    // Filter sidebar values (see lib/listing-filters.ts's URL contract) →
    // Mongo clauses, mapped per category/sub in lib/postFilterQuery.ts.
    // Search bar keyword → lib/postSearchQuery.ts. Combined via $and rather
    // than spread so a filter/keyword clause's own $or (e.g. floor_level,
    // the keyword's name/description $or) never collides with the country
    // $or above.
    const filterQuery = buildFilterQuery(category, sub ?? "", parseFilterValues(searchParams));
    const keywordQuery = buildKeywordQuery(searchParams.get("q"));
    const andClauses = [baseQuery, filterQuery, keywordQuery].filter(
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
      categoryId: category,
      subCategoryId: sub,
      currency: COUNTRY_CONFIGS[country].currency,
      total: items.length,
      generatedAt: new Date().toISOString(),
      countsBySubcategory,
      items,
    };

    return NextResponse.json(response);
  }

  let items = filterListingsByKeyword(
    getListingsForMarket(category, country, sub ?? undefined),
    searchParams.get("q") ?? "",
  );
  const mockSortParam = searchParams.get("sort") ?? "newest";
  items = sortMockListings(items, mockSortParam);
  const { lat: mockLat, lng: mockLng, radiusKm: mockRadiusKm } = parseGeoParams({
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    radius: searchParams.get("radius"),
    unit: searchParams.get("unit"),
  });
  items = filterByRadius(items, mockLat, mockLng, mockRadiusKm);
  if (mockLat != null && mockLng != null && shouldSortByDistance(mockSortParam, mockLat, mockLng)) {
    items = sortByDistance(items, mockLat, mockLng);
  }
  const response: ListingsApiResponse = {
    ok: true,
    source,
    market: country,
    categoryId: category,
    subCategoryId: sub,
    currency: COUNTRY_CONFIGS[country].currency,
    total: items.length,
    generatedAt: new Date().toISOString(),
    countsBySubcategory: getCountsForMarket(category, country),
    items,
  };

  return NextResponse.json(response);
}

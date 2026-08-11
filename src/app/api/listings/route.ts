import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { COUNTRY_CONFIGS, getAppStage, getListingsDataSource, type CountryCode } from "@/config";
import { mapPostToListing, type LeanOwner } from "@/lib/mapPostToListing";
import { publicPostFilter } from "@/lib/postVisibility";
import { resolvePostSort } from "@/lib/postSort";
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
 * Recent Posts / Top Picks "See all" links, which have no single category
 * to scope /api/listings/[category] to. Sort-only (sort=newest|oldest|
 * top-picks via resolvePostSort) — no filter sidebar applies here, same as
 * /listings with cat empty never showing filters (see resolveFilters()).
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
    // useListingSearch.ts's loc-based city browse for the one mock path
    // that does cover category-less browsing.
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

  const query: Record<string, unknown> = {
    ...publicPostFilter(),
    // Country-scoped via the real `country` field (models/post.ts). Posts
    // with none (predating that field, or created without a resolved
    // cookie) are treated as visible in every market rather than nowhere.
    $or: [{ country }, { country: { $exists: false } }],
  };

  const dbItems = await Post.find(query)
    .sort(resolvePostSort(searchParams.get("sort")))
    .limit(50)
    .populate<{ ownerId: LeanOwner | null }>(
      "ownerId",
      "userId fullName image publicRole isEmailVerified isPrimaryNumberVerified createdAt"
    )
    .lean();

  const items = dbItems.map(({ ownerId, ...post }) => mapPostToListing(post, ownerId ?? null));

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

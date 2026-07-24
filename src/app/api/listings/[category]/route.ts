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
  isKnownCategory,
  isKnownSubcategory,
} from "@/lib/mock/country-map";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
import { mapPostToListing, type LeanOwner } from "@/lib/mapPostToListing";
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
    const query: Record<string, unknown> = {
      category: categoryLabel ? { $in: [category, categoryLabel] } : category,
      // No moderation/approval step exists yet — see getFeaturedListings.ts's
      // matching comment. Only exclude genuinely hidden/removed states.
      status: { $nin: ["off", "expired", "deleted"] },
      // Country-scoped via the real `country` field (models/post.ts). Posts
      // with none (predating that field, or created without a resolved
      // cookie) are treated as visible in every market rather than nowhere.
      $or: [{ country }, { country: { $exists: false } }],
    };
    if (sub) {
      const subLabel = SUBCATEGORY_LABELS[category]?.[sub];
      query.subcategory = subLabel ? { $in: [sub, subLabel] } : sub;
    }

    const dbItems = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate<{ ownerId: LeanOwner | null }>(
        "ownerId",
        "fullName image role isEmailVerified isPrimaryNumberVerified createdAt"
      )
      .lean();

    const items = dbItems.map(({ ownerId, ...post }) => mapPostToListing(post, ownerId ?? null));

    const response: ListingsApiResponse = {
      ok: true,
      source,
      market: country,
      categoryId: category,
      subCategoryId: sub,
      currency: COUNTRY_CONFIGS[country].currency,
      total: items.length,
      generatedAt: new Date().toISOString(),
      // Category filter facets/counts stay mock-derived for now — Post
      // doesn't cleanly support that faceting yet (see the scoping note in
      // useListingFilters.ts's consumers).
      countsBySubcategory: getCountsForMarket(category, country),
      items,
    };

    return NextResponse.json(response);
  }

  const items = getListingsForMarket(category, country, sub ?? undefined);
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

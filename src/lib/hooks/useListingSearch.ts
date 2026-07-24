"use client";

/**
 * lib/hooks/useListingSearch.ts
 *
 * Unified data-fetching hook for the listings page.
 *
 * ─── CORE PRINCIPLE — URL IS THE SINGLE SOURCE OF TRUTH ──────────────────────
 * Every user interaction that changes the results list writes to the URL.
 * This hook reads the URL and calls the data source. Nothing else triggers
 * a data fetch.
 *
 *   Search bar submit  →  router.push(?cat=&q=&lat=&lng=&radius=&sort=)
 *   Location change    →  router.push(?...&lat=&lng=&radius=&unit=)
 *   Filter toggle      →  router.push(?...&prop_type=apartment&beds=2)
 *   Sort change        →  router.push(?...&sort=price_asc)
 *   Page click         →  router.push(?...&page=3)
 *                                       ↓
 *                              URL changes → React re-renders
 *                                       ↓
 *                         useListingSearch reads new URL params
 *                                       ↓
 *                              data fetch → show results
 *
 * ─── PAGINATION CACHE ────────────────────────────────────────────────────────
 * On page N load: pages max(1, N-3) → min(totalPages, N+3) are pre-fetched
 * and cached in memory (useRef<Map>). Navigating to a cached page is instant —
 * no skeleton shown. Cache is invalidated when any non-page param changes
 * (new search, filter, sort, or location).
 *
 * ─── TODO [INTEGRATION] ──────────────────────────────────────────────────────
 * 1. Replace resolveListingsMock() with a real API call:
 *
 *      const res  = await fetch(buildApiURL("/api/v1/listings", params));
 *      const json = await res.json();
 *      // json.items: Listing[]   json.meta: { total: number }
 *
 * 2. The API receives ALL params as query string args — see ListingSearchParams.
 *    IMPORTANT: add `country: string` to ListingSearchParams and thread it through
 *    from ListingsPage via useCountryConfig().isoCode. Every API call must be
 *    country-scoped: /api/v1/listings?country=IN&cat=property&...
 *
 * 3. Remove MOCK_DELAY_MS — real API latency drives the loading state naturally.
 *
 * 4. Move pagination to the server:
 *      - Server returns PAGE_SIZE items for the requested page
 *      - totalCount comes from json.meta.total
 *      - Client no longer slices an array
 *
 * 5. Pre-fetch adjacent pages with Promise.all():
 *      const prefetchPromises = pagesToFetch.map(p =>
 *        fetch(buildApiURL("/api/v1/listings", { ...params, page: p }))
 *      );
 *      await Promise.all(prefetchPromises);
 *
 * 6. Consider SWR or React Query for production — handles deduplication,
 *    background revalidation, and error states automatically.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { resolveListings } from "@/lib/mock/listing-map";
import { getListingsForCity } from "@/lib/mock/country-map";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
import type { CountryCode } from "@/config";
import type { ListingsApiResponse } from "@/types/listings-api";

export const PAGE_SIZE = 12;

// ── Types ─────────────────────────────────────────────────────────────────────

/** All URL params that together define a listing search */
export interface ListingSearchParams {
  countryCode: CountryCode;
  cat: string;
  sub: string;
  /** Keyword search term from search bar */
  q: string;
  /** Decimal latitude from LocationPicker */
  lat: string;
  /** Decimal longitude from LocationPicker */
  lng: string;
  /** Search radius — paired with unit */
  radius: string;
  /** "km" | "mi" */
  unit: string;
  /** "newest" | "oldest" | "price_asc" | "price_desc" */
  sort: string;
  /** 1-based page number */
  page: number;
  /** Active filter values from useListingFilters.filterValues */
  filterValues: Record<string, string[]>;
  /**
   * Free-text location label from LocationPicker or a footer "Top Locations"
   * link (e.g. "London"). When `cat` is empty, this drives a cross-category
   * city browse via getListingsForCity() instead of an empty result set.
   */
  loc: string;
}

export interface UseListingSearchResult {
  /** Results for the current page */
  items: MockListing[];
  /** Total result count across all pages */
  totalCount: number;
  /** Total number of pages */
  totalPages: number;
  /** Current 1-based page */
  currentPage: number;
  /** True while a fetch is in flight */
  isLoading: boolean;
  /** Human-readable message shown while loading — displayed in ListingGrid */
  loadingContext: string;
  /** Pages currently in the pre-fetch cache — navigating to these is instant */
  cachedPages: Set<number>;
}

async function fetchCountryListings(
  cat: string,
  countryCode: CountryCode,
  sub?: string,
): Promise<MockListing[]> {
  const params = new URLSearchParams({ country: countryCode });
  if (sub) params.set("sub", sub);

  const res = await fetch(`/api/listings/${cat}?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`listings_api_${res.status}`);

  const data = (await res.json()) as ListingsApiResponse;
  return data.items;
}

// ── Mock resolver — TODO [INTEGRATION]: replace with real API call ─────────────
// Real API uses ALL params (keyword, location, filters, sort, page).
// Mock only uses cat + sub — all other params are ignored.
function resolveListingsMock(params: ListingSearchParams): MockListing[] {
  return resolveListings(params.cat, params.sub || undefined);
}

/** POC only — simulates network latency so skeleton UX is demonstrable */
const MOCK_DELAY_MS = 700;

// ── Loading context message ───────────────────────────────────────────────────

function buildLoadingContext(params: ListingSearchParams): string {
  const { cat, sub, q, lat, page, loc } = params;
  const catLabel = cat ? (CATEGORY_LABELS[cat] ?? cat) : "";
  const subLabel = (cat && sub) ? (SUBCATEGORY_LABELS[cat]?.[sub] ?? sub) : "";
  const scope    = [catLabel, subLabel].filter(Boolean).join(" · ");

  if (q && lat) return `Searching "${q}" near your location${scope ? ` in ${scope}` : ""}…`;
  if (q)        return `Searching "${q}"${scope ? ` in ${scope}` : ""}…`;
  if (lat)      return `Finding results near your location${scope ? ` in ${scope}` : ""}…`;
  if (!cat && loc) return `Loading listings in ${loc}…`;
  if (page > 1) return `Loading page ${page}${scope ? ` of ${scope}` : ""}…`;
  if (scope)    return `Loading ${scope}…`;
  return "Loading results…";
}

// ── filterValues serialisation ────────────────────────────────────────────────
// parseFilterValues() returns a new object reference every render.
// Serialising to a sorted deterministic string gives a stable dep for useEffect.

function serializeFilterValues(fv: Record<string, string[]>): string {
  return Object.entries(fv)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${[...v].sort().join(",")}`)
    .join("&");
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useListingSearch(params: ListingSearchParams): UseListingSearchResult {
  const { countryCode, cat, sub, q, lat, lng, radius, unit, sort, page, filterValues, loc } = params;

  // Stable string encoding all non-page search dimensions.
  // Changes here invalidate the page cache and trigger a fresh load.
  const filterKey = serializeFilterValues(filterValues);
  const cacheKey  = `${countryCode}|${cat}|${sub}|${q}|${lat}|${lng}|${radius}|${unit}|${sort}|${filterKey}|${loc}`;

  // ── Page cache — persists across renders, not a state variable ─────────────
  const pageCache     = useRef<Map<number, MockListing[]>>(new Map());
  const prevKey       = useRef<string>("");
  const allResultsRef = useRef<MockListing[]>([]); // full dataset for current cacheKey

  // ── UI state ───────────────────────────────────────────────────────────────
  const [items,       setItems]       = useState<MockListing[]>([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [isLoading,   setIsLoading]   = useState(true);
  const [cachedPages, setCachedPages] = useState<Set<number>>(new Set());

  // Store a page slice — no-op if already cached
  const cachePageSlice = useCallback((pageNum: number, allResults: MockListing[]) => {
    if (pageCache.current.has(pageNum)) return;
    const start = (pageNum - 1) * PAGE_SIZE;
    pageCache.current.set(pageNum, allResults.slice(start, start + PAGE_SIZE));
    setCachedPages(new Set(pageCache.current.keys()));
  }, []);

  // Pre-fetch pages targetPage ±3 from already-loaded results
  const prefetchWindow = useCallback((targetPage: number, allResults: MockListing[]) => {
    const totalPg = Math.max(1, Math.ceil(allResults.length / PAGE_SIZE));
    const from = Math.max(1, targetPage - 3);
    const to   = Math.min(totalPg, targetPage + 3);
    for (let p = from; p <= to; p++) cachePageSlice(p, allResults);
  }, [cachePageSlice]);

  useEffect(() => {
    let cancelled = false;

    // Invalidate page cache when search/filter/sort params change (not page)
    if (cacheKey !== prevKey.current) {
      pageCache.current.clear();
      prevKey.current   = cacheKey;
      allResultsRef.current = [];
      setCachedPages(new Set());
    }

    // ── Cache hit — instant serve, background pre-fetch ────────────────────
    if (pageCache.current.has(page)) {
      setItems(pageCache.current.get(page)!);
      setIsLoading(false);
      // Opportunistically pre-fetch adjacent pages in background
      prefetchWindow(page, allResultsRef.current);
      return;
    }

    // ── Cache miss — show skeleton, fetch data ─────────────────────────────
    setIsLoading(true);

    // TODO [INTEGRATION]: replace setTimeout + resolveListingsMock with:
    //   const { items, meta } = await fetchListings(params);
    const timer = setTimeout(() => {
      if (cancelled) return;

      if (!cat) {
        // No category — if a location label is set (e.g. footer "Top Locations"
        // link, or a LocationPicker pick with no category chosen), fall back to
        // the cross-category city browse resolver. No API route exists for
        // category-less browsing, so this resolves straight from mock data.
        if (loc) {
          const cityItems = getListingsForCity(countryCode, loc);
          allResultsRef.current = cityItems;
          const total = cityItems.length;
          const totalPg = Math.max(1, Math.ceil(total / PAGE_SIZE));
          const clamped = Math.min(page, totalPg);

          setTotalCount(total);
          prefetchWindow(clamped, cityItems);
          setItems(pageCache.current.get(clamped) ?? []);
          setIsLoading(false);
          return;
        }

        allResultsRef.current = [];
        setTotalCount(0);
        setItems([]);
        setIsLoading(false);
        return;
      }

      fetchCountryListings(cat, countryCode, sub || undefined)
        .then((apiItems) => {
          if (cancelled) return;
          allResultsRef.current = apiItems;
          const total = apiItems.length;
          const totalPg = Math.max(1, Math.ceil(total / PAGE_SIZE));
          const clamped = Math.min(page, totalPg);

          setTotalCount(total);
          prefetchWindow(clamped, apiItems);
          setItems(pageCache.current.get(clamped) ?? []);
          setIsLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          // Network/API failure fallback — generic (non-country-aware) mock data
          const fallback = resolveListingsMock(params);
          allResultsRef.current = fallback;
          const total = fallback.length;
          const totalPg = Math.max(1, Math.ceil(total / PAGE_SIZE));
          const clamped = Math.min(page, totalPg);

          setTotalCount(total);
          prefetchWindow(clamped, fallback);
          setItems(pageCache.current.get(clamped) ?? []);
          setIsLoading(false);
        });
    }, MOCK_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  // cacheKey is a stable string encoding all non-page params — intentional dep
  // params object excluded deliberately (encoded in cacheKey); callbacks are stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, page]);

  return {
    items,
    totalCount,
    totalPages:     Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
    currentPage:    page,
    isLoading,
    loadingContext: buildLoadingContext(params),
    cachedPages,
  };
}

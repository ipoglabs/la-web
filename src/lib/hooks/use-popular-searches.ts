"use client";

/**
 * use-popular-searches.ts
 *
 * Reads the nightly-materialized "Popular Searches" list for a location —
 * GET /api/search/popular?country=&city= (see app/api/search/popular/route.ts).
 * Pure read, no client-side aggregation. Used by:
 *   - app/page.tsx           — landing page "Popular Searches" section
 *   - LaSearchBar.tsx        — dropdown fallback when the visitor has no
 *                              recents of their own (Section 4.6, Q4)
 *
 * country is required — the hook no-ops (returns []) until one is passed,
 * so callers without a resolved country (e.g. the design-system demo page)
 * degrade to an empty list instead of fetching.
 */
import { useEffect, useState } from "react";

export interface PopularSearchItem {
  keyword: string;
  category?: string;
  score: number;
  count: number;
}

export function usePopularSearches(country: string | null | undefined, city?: string | null) {
  const [items, setItems] = useState<PopularSearchItem[]>([]);

  useEffect(() => {
    if (!country) {
      setItems([]);
      return;
    }

    const params = new URLSearchParams({ country });
    if (city) params.set("city", city);

    let cancelled = false;
    fetch(`/api/search/popular?${params.toString()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items?: PopularSearchItem[] }) => {
        if (!cancelled) setItems(data.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, [country, city]);

  return items;
}

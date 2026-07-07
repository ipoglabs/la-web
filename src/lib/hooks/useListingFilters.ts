"use client";

/**
 * useListingFilters — URL-backed filter state for the listings page.
 *
 * ─── What this hook owns ─────────────────────────────────────────────────────
 *   filterValues  — committed filter state, always in sync with the URL
 *   draftValues   — pending state for mobile sheet (commit via applyDraft)
 *   activeChips   — derived chip array for LaFilterChipStrip
 *   hasActiveFilters — true when any filter is active (for toggle button badge)
 *
 * ─── Both surfaces use the draft pattern ────────────────────────────────────
 *   Desktop panel → setDraftValue() accumulates changes in draft,
 *                   applyDraft() / clearAndApply() commits to URL on Apply click.
 *   Mobile sheet  → same: setDraftValue() → applyDraft() / clearAndApply()
 *
 *   toggleFilter() and setFilterValues() are kept for chip removal and
 *   programmatic URL manipulation — NOT used by the filter UI directly.
 *
 * ─── Draft lifecycle ─────────────────────────────────────────────────────────
 *   Call openDraft() when the mobile sheet opens → copies filterValues → draft
 *   Call applyDraft() when user taps Apply → pushes draft to URL + closes sheet
 *   Discarding (sheet close without Apply) → draft is abandoned, URL unchanged
 */

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  resolveFilters,
  parseFilterValues,
  buildFilterURL,
  deriveActiveChips,
  removeChipFromValues,
  type FilterChip,
  type ListingFilterConfig,
} from "@/lib/listing-filters";

export interface UseListingFiltersResult {
  /** Committed filter values — always mirrors the current URL */
  filterValues: Record<string, string[]>;
  /** Pending draft values — used by the mobile filter sheet before Apply */
  draftValues: Record<string, string[]>;
  /** Resolved filter config for the current cat + sub */
  filters: ListingFilterConfig[];
  /** Derived chips for LaFilterChipStrip */
  activeChips: FilterChip[];
  /** True when at least one filter is active */
  hasActiveFilters: boolean;
  /** Count of active filter chips (range = 1 chip regardless of min/max combination) */
  activeCount: number;
  /**
   * Desktop (S1 fix): push a full updated values map to URL directly.
   * Used by FilterPanel — no per-value diff needed, ToggleButtonGroup gives us
   * the complete new selection array for each filter.
   */
  setFilterValues: (values: Record<string, string[]>) => void;
  /** Toggle a single value — kept for external/programmatic use */
  toggleFilter: (filterId: string, value: string, singleSelect?: boolean) => void;
  /** Mobile: updates the local draft without touching the URL */
  setDraftValue: (filterId: string, values: string[]) => void;
  /** Call when mobile sheet opens — seeds draft from current URL state */
  openDraft: () => void;
  /** Mobile: clears all draft selections without touching the URL */
  clearDraft: () => void;
  /** Mobile: clears draft AND pushes empty to URL atomically — avoids stale-closure race */
  clearAndApply: () => void;
  /** Mobile: commits draft state to URL */
  applyDraft: () => void;
  /** Removes a single filter chip from the URL */
  removeChip: (chipId: string) => void;
  /** Clears all active filters from the URL */
  clearAll: () => void;
}

export function useListingFilters(cat: string, sub: string): UseListingFiltersResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Committed state — always derived from URL ────────────────────────────
  const filterValues = parseFilterValues(searchParams);

  // ── Resolved filter config ────────────────────────────────────────────────
  const filters = resolveFilters(cat, sub);

  // ── Derived chips ─────────────────────────────────────────────────────────
  const activeChips = deriveActiveChips(filterValues, filters);
  const hasActiveFilters = activeChips.length > 0;
  const activeCount = activeChips.length;

  // ── Draft state — local, for mobile sheet ────────────────────────────────
  const [draftValues, setDraftValues] = useState<Record<string, string[]>>({});

  // ── Helpers ───────────────────────────────────────────────────────────────
  // Preserve non-filter params (q, sort) across filter changes.
  // NOTE: page is intentionally NOT preserved — any filter change resets to
  // page 1. Page is set explicitly via pagination links only.
  const getExtras = useCallback((): Record<string, string> => {
    const extras: Record<string, string> = {};
    const q    = searchParams.get("q");
    const sort = searchParams.get("sort");
    if (q)    extras.q    = q;
    if (sort) extras.sort = sort;
    return extras;
  }, [searchParams]);

  const pushURL = useCallback(
    (newValues: Record<string, string[]>) => {
      const url = buildFilterURL(cat, sub, newValues, getExtras());
      router.push(pathname + url, { scroll: false });
    },
    [router, pathname, cat, sub, getExtras]
  );

  // ── Desktop: direct values push (S1 fix) ────────────────────────────────
  const setFilterValues = useCallback(
    (values: Record<string, string[]>) => {
      pushURL(values);
    },
    [pushURL]
  );

  // ── Desktop: instant toggle (kept for chip removal / external use) ────────
  const toggleFilter = useCallback(
    (filterId: string, value: string, singleSelect = false) => {
      const current = filterValues[filterId] ?? [];
      let next: string[];
      if (singleSelect) {
        // Single-select: clicking active value deselects it, clicking new replaces
        next = current.includes(value) ? [] : [value];
      } else {
        next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
      }
      const updated = { ...filterValues };
      if (next.length === 0) {
        delete updated[filterId];
      } else {
        updated[filterId] = next;
      }
      pushURL(updated);
    },
    [filterValues, pushURL]
  );

  // ── Mobile: draft management ──────────────────────────────────────────────
  const openDraft = useCallback(() => {
    // Deep copy current committed values into draft
    setDraftValues(
      Object.fromEntries(
        Object.entries(filterValues).map(([k, v]) => [k, [...v]])
      )
    );
  }, [filterValues]);

  const setDraftValue = useCallback((filterId: string, values: string[]) => {
    setDraftValues((prev) => {
      const updated = { ...prev };
      if (values.length === 0) {
        delete updated[filterId];
      } else {
        updated[filterId] = values;
      }
      return updated;
    });
  }, []);

  const applyDraft = useCallback(() => {
    pushURL(draftValues);
  }, [draftValues, pushURL]);

  // G4: clear all draft selections — used by mobile "Clear all" button
  const clearDraft = useCallback(() => {
    setDraftValues({});
  }, []);

  // G4: clear draft AND immediately push empty to URL in one action
  // (avoids the setState + applyDraft stale-closure race)
  const clearAndApply = useCallback(() => {
    setDraftValues({});
    pushURL({});
  }, [pushURL]);

  // ── Chip removal ─────────────────────────────────────────────────────────
  const removeChip = useCallback(
    (chipId: string) => {
      const updated = removeChipFromValues(chipId, filterValues);
      pushURL(updated);
    },
    [filterValues, pushURL]
  );

  // ── Clear all ─────────────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    pushURL({});
  }, [pushURL]);

  return {
    filterValues,
    draftValues,
    filters,
    activeChips,
    hasActiveFilters,
    activeCount,
    setFilterValues,
    toggleFilter,
    setDraftValue,
    openDraft,
    clearDraft,
    clearAndApply,
    applyDraft,
    removeChip,
    clearAll,
  };
}

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LaFilterChipStrip, LaButton } from "@/components/la";
import { useListingFilters } from "@/lib/hooks/useListingFilters";
import { LaSearchBar, type SearchQuery, type SearchScope } from "@/components/la-search-bar";
import { SolidFilterHorizontal24by24 } from "@/components/icons/la-icons";
import { deriveActiveChips } from "@/lib/listing-filters";
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { LocationPicker, type LocationValue } from "@/components/location-picker";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
import FilterContent from "./FilterContent";
import MobileFilterSheet from "./MobileFilterSheet";
import ListingGrid from "./ListingGrid";
import { useListingSearch } from "@/lib/hooks/useListingSearch";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

// ── Left filter panel ─────────────────────────────────────────────────────────
// UC2 (lg–xl):  inline card, bounded max-height, own internal scroll
// UC3 (xl+):  same panel + sticky top-0 — pins while main content scrolls
//
// max-h-[calc(100vh-11rem)] is the key value for BOTH breakpoints:
//   • At page top  : panel starts ~172px below viewport top (header stack),
//                    height = 100vh-172px → bottom lands exactly at viewport fold ✓
//   • When scrolled: panel sticks at top-0, same height → small gap at bottom,
//                    but panel is always 100% visible ✓
interface FilterPanelProps {
  open: boolean;
  filters: import("@/lib/listing-filters").ListingFilterConfig[];
  /** Draft values — not committed to URL until Apply is clicked */
  filterValues: Record<string, string[]>;
  /** Called per-filter as user toggles — updates draft only */
  onDraftChange: (filterId: string, values: string[]) => void;
  /** Commits draft to URL */
  onApply: () => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  activeCount: number;
  /** Subcategory picker — passed through to FilterContent */
  subcategories?: Array<{ key: string; label: string }>;
  currentSub?: string;
  onSubSelect?: (sub: string) => void;
}

function FilterPanel({ open, filters, filterValues, onDraftChange, onApply, onClearAll, hasActiveFilters, activeCount, subcategories, currentSub, onSubSelect }: FilterPanelProps) {
  // Hide Apply footer when in sub-picker mode (same rule as MobileFilterSheet)
  const isSubPickerMode = filters.length === 0 && (subcategories?.length ?? 0) > 0;
  return (
    <aside
      className={cn(
        // Shared base
        "w-64 flex-none flex-col bg-white border border-slate-300",
        // Height bound — works correctly for both UC2 and UC3 (see note above)
        "rounded-xl max-h-[calc(100vh-11rem)]",
        // UC3 — wide desktop (xl+): sticky so panel never scrolls with the page
        "xl:sticky xl:top-0",
        // Visibility: hidden on mobile/tablet, flex column on lg+ when open
        open ? "hidden lg:flex" : "hidden"
      )}
    >
      {/* Panel header — Clear All link shown only when filters are active */}
      <div className="shrink-0 px-4 pt-2 pb-2 flex items-center justify-between border-b border-slate-300">
        <div className="flex items-center gap-2">
          <SolidFilterHorizontal24by24 className="size-5 text-slate-700" />
          <h2 className="text-base font-semibold text-slate-700">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Scrollable filter content — draft pattern: changes accumulate in draft,
           committed to URL only when user clicks Apply. Same pattern as mobile sheet. */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
        <FilterContent
          filters={filters}
          values={filterValues}
          onChange={(filterId, selected) => onDraftChange(filterId, selected)}
          subcategories={subcategories}
          currentSub={currentSub}
          onSubSelect={onSubSelect}
        />
      </div>

      {/* Footer — Apply commits draft to URL */}
      {!isSubPickerMode && (
        <div className="shrink-0 px-4 py-2 border-t border-slate-300">
          <LaButton
            intent="primary"
            size="default"
            className="w-full"
            onClick={onApply}
          >
            {activeCount > 0 ? `Apply (${activeCount})` : "Apply Filters"}
          </LaButton>
        </div>
      )}
    </aside>
  );
}

// ── Search bar ────────────────────────────────────────────────────────────────
// Thin wrapper — keeps the dark bg-slate-800 band, drops LaSearchBar inside.
// onSearch fires when user submits; the page builds the URL and pushes it.
interface SearchBarProps {
  scope?: SearchScope | null;
  initialKeyword?: string;
  onSearch?: (query: SearchQuery) => void;
}
function SearchBar({ scope, initialKeyword = "", onSearch }: SearchBarProps) {
  return (
    <div className="bg-slate-800 py-2 px-4">
      <div className="mx-auto w-full max-w-3xl">
        <LaSearchBar
          initialScope={scope ?? null}
          initialKeyword={initialKeyword}
          placeholder="ex: 3-bed apartment in Canary Wharf"
          onSearch={onSearch}
        />
      </div>
    </div>
  );
}

// ── Context bar ──────────────────────────────────────────────────────────────
// Desktop: 📍 location [flex-1]  Sort by: [select]
// Mobile:  📍 location [flex-1]  [Newest ▾] [funnel icon]  — compact text + icon
interface ContextBarProps {
  currentLocation: LocationValue | null;
  onLocationChange: (loc: LocationValue | null) => void;
  /** Mobile: badge count on the funnel icon */
  activeFilterCount: number;
  /** Mobile: opens the filter sheet */
  onOpenFilters: () => void;
}

function ContextBar({ currentLocation, onLocationChange, activeFilterCount, onOpenFilters }: ContextBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config, countryCode } = useCountryConfig();
  const sort = searchParams.get("sort") ?? "newest";

  const SORT_OPTIONS = [
    { value: "relevance",  label: "Relevance" },
    { value: "newest",     label: "Newest" },
    { value: "oldest",     label: "Oldest" },
    { value: "price_desc", label: "High Price" },
    { value: "price_asc",  label: "Low Price" },
  ];
  const sortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? "Newest";

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/listings?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="bg-slate-50 border-b border-slate-200 py-1">
      <div className="container-app h-8 flex items-center gap-2">

        {/* Location — flex-1 so it takes all available space; full label, no truncation cap */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            className="size-3.5 shrink-0 text-slate-500">
            <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          </svg>
          <LocationPicker
            trigger="link"
            value={currentLocation}
            onChange={onLocationChange}
            showRadius
            countryScope={config.locationScope}
            radiusUnit={config.radiusUnit}
            searchProvider="google"
            placeholder="Set location..."
            triggerClassName="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          />
          {currentLocation && (
            <button
              type="button"
              aria-label="Clear location"
              onClick={() => onLocationChange(null)}
              className="shrink-0 flex items-center justify-center size-4 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort by — desktop: labelled select; mobile: bare select styled as text link + funnel icon */}
        <div className="flex-none flex items-center gap-1.5 text-sm text-slate-600">

          {/* Desktop */}
          <span className="hidden sm:inline font-medium">Sort by:</span>
          <select
            aria-label="Sort by"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="hidden sm:block text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md px-2 py-0.5 cursor-pointer focus:outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Mobile — text link select (no border/bg) + funnel icon button */}
          {/* Mobile — visual text + funnel icon; invisible select covers the whole area */}
          <div className="relative flex sm:hidden items-center gap-0.5 cursor-pointer px-2">
            <span className="text-sm font-medium text-blue-600 underline underline-offset-2 pointer-events-none">
              {sortLabel}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              className="size-3.5 text-slate-500 pointer-events-none">
              <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
            </svg>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 px-0.5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold leading-none text-white pointer-events-none">
                {activeFilterCount > 9 ? "9+" : activeFilterCount}
              </span>
            )}
            {/* Invisible select overlaid on the whole chip — tap anywhere opens native picker */}
            <select
              aria-label="Sort by"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

        </div>

      </div>
    </div>
  );
}

// ── Smart Pagination ─────────────────────────────────────────────────────────
// Renders: [← Prev] [1] … [3][4][5*][6][7] … [20] [Next →]
// Always shows first + last pages; shows current ±2; ellipsis for gaps.
interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Return a full href string for each page number */
  buildHref: (page: number) => string;
}
function SmartPagination({ currentPage, totalPages, buildHref }: SmartPaginationProps) {
  if (totalPages <= 1) return null;

  const pageNums = new Set([1, totalPages]);
  for (let p = Math.max(2, currentPage - 2); p <= Math.min(totalPages - 1, currentPage + 2); p++) {
    pageNums.add(p);
  }
  const sorted = Array.from(pageNums).sort((a, b) => a - b);
  const items: (number | "...")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("...");
    items.push(p);
  });

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem><PaginationPrevious href={buildHref(currentPage - 1)} /></PaginationItem>
        )}
        {items.map((p, i) =>
          p === "..." ? (
            <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href={buildHref(p)} isActive={p === currentPage}>{p}</PaginationLink>
            </PaginationItem>
          )
        )}
        {currentPage < totalPages && (
          <PaginationItem><PaginationNext href={buildHref(currentPage + 1)} /></PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ListingsPage() {
  const [filterOpen, setFilterOpen] = useState(false);   // UC1: mobile/tablet sheet
  const [desktopOpen, setDesktopOpen] = useState(true);   // UC2/UC3: desktop panel
  const { config, countryCode } = useCountryConfig();

  const searchParams = useSearchParams();
  const cat  = searchParams.get("cat")  ?? "";
  const sub  = searchParams.get("sub")  ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  // ── Filter state — URL-backed ──────────────────────────────────────────────
  const {
    filterValues,
    draftValues,
    filters,
    activeChips,
    hasActiveFilters,
    activeCount,
    setDraftValue,
    openDraft,
    clearAndApply,
    applyDraft,
    removeChip,
  } = useListingFilters(cat, sub);

  // ── Data fetch ─────────────────────────────────────────────────────────────
  // ALL search state (keyword, location, filters, sort, page) flows through the
  // URL into this hook. To integrate with a real API, edit the hook file:
  //   lib/hooks/useListingSearch.ts → replace resolveListingsMock() with fetch()
  const { items, totalCount, totalPages, currentPage, isLoading, loadingContext } =
    useListingSearch({
      countryCode,
      cat,
      sub,
      q:      searchParams.get("q")      ?? "",
      lat:    searchParams.get("lat")    ?? "",
      lng:    searchParams.get("lng")    ?? "",
      radius: searchParams.get("radius") ?? "",
      unit:   searchParams.get("unit")   ?? "",
      sort:   searchParams.get("sort")   ?? "newest",
      page,
      filterValues,
      loc:    searchParams.get("loc")    ?? "",
    });

  // Subcategory picker — only shown when cat is set but sub has not been chosen yet.
  // Passing an empty array when sub is already set ensures FilterContent falls through
  // to either the filter sections or the "No filters available" empty state.
  const router = useRouter();
  const subcategoryList = (cat && !sub)
    ? Object.entries(SUBCATEGORY_LABELS[cat] ?? {}).map(([key, label]) => ({ key, label }))
    : [];
  function handleSubSelect(subKey: string) {
    // Navigate fresh — no filter params carried over (sub change always starts clean)
    router.push(`/listings?cat=${cat}&sub=${subKey}`);
  }

  // ── Search bar submit ─────────────────────────────────────────────────────
  // Builds a clean URL from the search query. Drops sub + filter params so
  // the new search starts fresh within the category scope.
  // TODO [INTEGRATION]: ensure location lat/lng/radius are passed to the API.
  function handleSearch(query: SearchQuery) {
    const params = new URLSearchParams();
    if (query.scope?.cat)      params.set("cat", query.scope.cat);
    if (query.scope?.sub)      params.set("sub", query.scope.sub);
    if (query.keyword?.trim()) params.set("q",   query.keyword.trim());
    // Preserve current location context — changing keyword/scope never loses location
    // TODO [INTEGRATION]: ensure location lat/lng/radius are passed to the API
    (["lat", "lng", "radius", "unit", "loc"] as const).forEach(k => {
      const v = searchParams.get(k); if (v) params.set(k, v);
    });
    // Preserve sort; reset page (new search always starts at page 1)
    const currentSort = searchParams.get("sort");
    if (currentSort) params.set("sort", currentSort);
    router.push(`/listings?${params.toString()}`, { scroll: false });
  }

  // ── Location change — writes to URL, resets page ───────────────────────────────
  // TODO [INTEGRATION]: persist selected location to user cookie/session for cross-visit memory
  function handleLocationChange(loc: LocationValue | null) {
    const params = new URLSearchParams(searchParams.toString());
    (["lat", "lng", "radius", "unit", "loc"] as const).forEach(k => params.delete(k));
    if (loc) {
      if (loc.lat  != null) params.set("lat",    String(loc.lat));
      if (loc.lng  != null) params.set("lng",    String(loc.lng));
      if (loc.radius)       params.set("radius", String(loc.radius));
      params.set("unit", loc.unit ?? "km");
      if (loc.label)        params.set("loc", loc.label);
    }
    params.delete("page"); // location change always resets to page 1
    router.push(`/listings?${params.toString()}`, { scroll: false });
  }

  // ── Page URL builder — preserves all current params, only changes page ────
  function buildPageHref(pageNum: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNum <= 1) params.delete("page");
    else params.set("page", String(pageNum));
    return `/listings?${params.toString()}`;
  }

  // Draft chip count — uses deriveActiveChips so range filter counts as 1 chip, not 2 values.
  // Used for Apply button labels on both desktop panel and mobile sheet.
  const draftChipCount        = deriveActiveChips(draftValues, filters).length;
  const draftHasActiveFilters = draftChipCount > 0;

  // Resolve labels for scope chip + results count
  const catLabel  = cat ? (CATEGORY_LABELS[cat] ?? cat) : undefined;
  const subLabel  = (cat && sub) ? (SUBCATEGORY_LABELS[cat]?.[sub] ?? sub) : undefined;
  // ScopeChip receives separate cat + sub labels — renders mobile/desktop differently
  const currentScope = cat && catLabel ? { cat, label: catLabel, sub: sub ?? undefined, subLabel: subLabel ?? undefined } : null;

  // Reconstruct LocationValue from URL params for the ContextBar
  const locLabel = searchParams.get("loc");
  const latStr   = searchParams.get("lat");
  const lngStr   = searchParams.get("lng");
  const currentLocation: LocationValue | null = latStr && lngStr
    ? {
        label:  locLabel ?? "Near set location",
        lat:    parseFloat(latStr),
        lng:    parseFloat(lngStr),
        radius: searchParams.get("radius") ? parseInt(searchParams.get("radius")!) : undefined,
        unit:   (searchParams.get("unit") as "km" | "mi") || "km",
      }
    : null;

  return (
    <>
      <SearchBar scope={currentScope} initialKeyword={searchParams.get("q") ?? ""} onSearch={handleSearch} />
      <ContextBar
        currentLocation={currentLocation}
        onLocationChange={handleLocationChange}
        activeFilterCount={activeCount}
        onOpenFilters={() => { openDraft(); setFilterOpen(true); }}
      />
      <MobileFilterSheet
        open={filterOpen}
        onOpenChange={(v) => {
          if (v) openDraft();
          setFilterOpen(v);
        }}
        filters={filters}
        draftValues={draftValues}
        onDraftChange={setDraftValue}
        onClearAndApply={clearAndApply}
        onApply={applyDraft}
        activeCount={draftChipCount}
        subLabel={subLabel}
        subcategories={subcategoryList}
        currentSub={sub || undefined}
        onSubSelect={handleSubSelect}
      />
      <div className="bg-slate-950/10 min-h-screen pb-10">
        <div className="container-app">
          <div className="flex gap-6 pt-3">

            {/* UC2 + UC3: Desktop inline / sticky panel */}
            <FilterPanel
              open={desktopOpen}
              filters={filters}
              filterValues={draftValues}
              onDraftChange={setDraftValue}
              onApply={applyDraft}
              onClearAll={clearAndApply}
              hasActiveFilters={draftHasActiveFilters}
              activeCount={draftChipCount}
              subcategories={subcategoryList}
              currentSub={sub || undefined}
              onSubSelect={handleSubSelect}
            />

            {/* Right: Listings */}
            <main className="flex-1 min-w-0">

              {/* Result count + sort */}
              <div className="flex items-center mb-4">
                {/* UC1: mobile / tablet — opens the Sheet */}
                <button
                  type="button"
                  aria-label="Open filters"
                  className="relative flex-none mr-2 p-1.5 rounded-lg bg-white hover:bg-slate-100 transition-colors lg:hidden"
                  onClick={() => { openDraft(); setFilterOpen(true); }}
                >
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-blue-600 text-sm font-bold leading-none text-white pointer-events-none">
                      {activeCount > 9 ? "9+" : activeCount}
                    </span>
                  )}
                  <SolidFilterHorizontal24by24 className="size-6 text-slate-700" />
                </button>

                {/* UC2 / UC3: desktop — toggles the inline / sticky panel */}
                <button
                  type="button"
                  aria-label={desktopOpen ? "Hide filters" : "Show filters"}
                  className={cn(
                    "flex-none mr-2 p-1.5 rounded-lg transition-colors hidden lg:flex",
                    desktopOpen
                      ? "bg-white hover:bg-slate-100"
                      : "bg-slate-800 hover:bg-slate-700"
                  )}
                  onClick={() => { if (!desktopOpen) openDraft(); setDesktopOpen((v) => !v); }}
                >
                  <SolidFilterHorizontal24by24 className={cn("size-6", desktopOpen ? "text-slate-700" : "text-white")} />
                </button>

                {/* aria-live so screen readers announce count when loading completes */}
                <p aria-live="polite" aria-atomic="true" className="text-sm font-normal flex-none">
                  {isLoading ? (
                    <span className="inline-block h-6 w-12 bg-slate-200 rounded-md animate-pulse align-middle mr-1" />
                  ) : (
                    <span className="text-lg font-semibold">{totalCount}</span>
                  )}{" "}results
                  {/* Mobile: hidden. sm+: always show scope; pipe only when filter chips follow */}
                  {subLabel && (
                    <span className="hidden sm:inline text-slate-500">
                      {" "}in {subLabel}
                      {hasActiveFilters && <span className="text-slate-400 ml-1.5">|</span>}
                    </span>
                  )}
                </p>

                {/* Active filter chips strip — driven by URL params */}
                <LaFilterChipStrip filters={activeChips} onRemove={removeChip} />
              </div>

              {/* Grid — shows skeleton with context message while loading */}
              <ListingGrid
                items={items}
                desktopFilterOpen={desktopOpen}
                isLoading={isLoading}
                loadingContext={loadingContext}
              />

              {/* Pagination — smart windowed display, URL-backed, hidden while loading */}
              {!isLoading && (
                <SmartPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  buildHref={buildPageHref}
                />
              )}

            </main>
          </div>
        </div>
      </div>
    </>
  );
}

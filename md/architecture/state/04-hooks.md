# State — Custom Hooks

> Every hook in `lib/hooks/` — purpose, inputs, outputs, store dependencies.  
> Last updated: 2026-07-07

---

## Overview

| Hook | File | Touches store | Category |
|---|---|---|---|
| `useCountryConfig` | `useCountryConfig.ts` | `CountryProvider` context | Country awareness |
| `useListingFilters` | `useListingFilters.ts` | None — URL only | URL-backed state |
| `useListingSearch` | `useListingSearch.ts` | None — local state | Data fetching |
| `useMediaQuery` | `useMediaQuery.ts` | None | Responsive layout |
| `useResendTimer` | `useResendTimer.ts` | None | OTP UX |
| `useRecentSearches` | `use-recent-searches.ts` | None — localStorage direct | Search history |

---

## `useCountryConfig`

**Purpose:** The single import for any component that needs to be country-aware.

```ts
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

const { isoCode, countryCode, config } = useCountryConfig();
```

### Returns

| Field | Type | Example |
|---|---|---|
| `isoCode` | `string` | `"IN"`, `"GB"`, `"SG"` |
| `countryCode` | `CountryCode` | `"in"`, `"gb"`, `"sg"` |
| `config.currency` | `string` | `"INR"` |
| `config.currencySymbol` | `string` | `"₹"`, `"£"`, `"S$"` |
| `config.displayName` | `string` | `"India"` |
| `config.radiusUnit` | `"km" \| "mi"` | `"km"` |
| `config.locationScope` | `string[]` | `["IN"]` |
| `config.enabledCategories` | `string[]` | Ordered category list for this country |

### Rules

- **Always use this hook** when a component needs country-specific labels, currency, or location scope
- **Never hardcode** `COUNTRY_CONFIGS["in"]` directly — breaks multi-country
- Throws if the active country ISO code has no matching config — this is intentional (fail loud)
- Reads from `CountryProvider` context — must be a descendant of `CountryProvider`

---

## `useListingFilters`

**Purpose:** URL-backed filter state for the `/listings` page. URL is the single source of truth — this hook never writes to a store.

```ts
const {
  filterValues,     // committed — always mirrors URL
  draftValues,      // pending — used by mobile sheet before Apply
  filters,          // resolved filter config for current cat + sub
  activeChips,      // derived chip array for LaFilterChipStrip
  hasActiveFilters,
  activeCount,
  setFilterValues,  // desktop panel: push full updated map to URL
  toggleFilter,     // programmatic single-value toggle
  setDraftValue,    // mobile: update draft without touching URL
  openDraft,        // mobile: seed draft from current URL state
  clearDraft,
  clearAndApply,
  applyDraft,       // mobile: commit draft → URL
  removeChip,
  clearAll,
} = useListingFilters(cat, sub);
```

### Draft pattern

```
Desktop panel                    Mobile sheet
  setFilterValues() directly       openDraft() on sheet open
  pushes to URL on each change     setDraftValue() accumulates changes
                                   applyDraft() pushes to URL on Apply tap
                                   Closing sheet without Apply = discard draft
```

### Inputs

| Param | Type | Description |
|---|---|---|
| `cat` | `string` | Current `categoryId` from URL |
| `sub` | `string` | Current `subcategoryId` from URL |

### Dependencies

- `useSearchParams`, `useRouter`, `usePathname` (Next.js)
- `lib/listing-filters.ts` — `resolveFilters`, `parseFilterValues`, `buildFilterURL`, `deriveActiveChips`

---

## `useListingSearch`

**Purpose:** Unified fetch hook for the listings page. Reads URL params → calls API → returns paginated results with loading state.

```ts
const {
  items,           // Listing[] for current page  ← NOT "results"
  isLoading,
  totalCount,
  totalPages,
  currentPage,
  loadingContext,  // human-readable string shown while loading (e.g. "Finding Honda City near Delhi...")
  cachedPages,     // Set<number> — pages currently pre-fetched; navigating to these is instant
} = useListingSearch();
// ⚠️  No "error" field — failed fetches are logged but not surfaced in the return shape (V1)
// ⚠️  No "breadcrumb" field — build from URL params + CATEGORY_LABELS / SUBCATEGORY_LABELS directly
```

### Behaviour

```
URL changes (any param)
  → hook re-runs
  → page cache checked (useRef<Map<page, Listing[]>>)
  → cache hit  → instant render (no skeleton)
  → cache miss → fetch → show skeleton → render results
  → non-page param changes → cache invalidated → restart from page 1
```

### Pagination cache

- Pre-fetches pages `N-3` to `N+3` around the current page
- Cache lives in `useRef` — cleared when filter/sort/search params change
- Does NOT survive full page navigation (component unmount)

### Current state (POC)

- Uses `resolveListings()` from mock data — no real API call
- Replace with `fetch('/api/listings?' + params)` for production
- See inline `TODO [INTEGRATION]` comments in the file

### Dependencies

- `useSearchParams` — reads all URL params
- `lib/mock/listing-map.ts` → replace with API call
- `PAGE_SIZE = 12` constant (exported)

> `lib/category-map.ts` (`CATEGORY_LABELS`, `SUBCATEGORY_LABELS`) is used **inside** the hook to build `loadingContext` — not exposed as a return field. Build your own breadcrumb from URL params + those maps if needed.

---

## `useMediaQuery`

**Purpose:** SSR-safe media query matching. Returns `false` on server, updates after hydration.

```ts
const isDesktop = useMediaQuery("(min-width: 768px)");
const isTablet  = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
```

### Returns

| | Server | Client (initial) | Client (after hydration) |
|---|---|---|---|
| Value | `false` | `false` | Real match result |

### Why `skipHydration` pattern

Starting as `false` matches the server render — no hydration mismatch. `useEffect` then sets the real value after mount. This is the only safe pattern for SSR + media query.

### Usage

```ts
// Show different UI per breakpoint
const isDesktop = useMediaQuery("(min-width: 768px)");
return isDesktop ? <FilterPanel /> : <FilterSheet />;
```

---

## `useResendTimer`

**Purpose:** Countdown timer for OTP resend button. Prevents spam by disabling the button for N seconds after each send.

```ts
const { seconds, enabled, reset } = useResendTimer(60); // 60s default
```

### Returns

| Field | Type | Description |
|---|---|---|
| `seconds` | `number` | Seconds remaining in countdown |
| `enabled` | `boolean` | `true` when countdown finishes — button can be clicked |
| `reset()` | `() => void` | Restarts the countdown (call after each resend) |

### Usage pattern

```ts
const { seconds, enabled, reset } = useResendTimer(60);

const handleResend = async () => {
  await resendOtp(email);
  reset(); // restart 60s countdown
};

return (
  <button disabled={!enabled} onClick={handleResend}>
    {enabled ? "Resend code" : `Resend in ${seconds}s`}
  </button>
);
```

- Default duration: `30` seconds (constructor param)
- Used in `/register/verify` OTP screen
- No store dependency — purely local timer state

---

## `useRecentSearches`

**Purpose:** localStorage-backed hook for saving and reading recent search history. Separate from `useRecentSearchesStore` — this version reads/writes localStorage directly without Zustand.

```ts
const { recents, save, remove, clear } = useRecentSearches();
```

### Returns

| Field | Type | Description |
|---|---|---|
| `recents` | `RecentSearch[]` | Current history, max 8, newest first |
| `save(entry)` | `fn` | Saves a search; dedupes by keyword + category scope |
| `remove(id)` | `fn` | Removes a single entry |
| `clear()` | `fn` | Clears all history |

### `RecentSearch` shape

```ts
interface RecentSearch {
  id: string;                              // timestamp-based
  keyword: string;
  location: LocationValue | null;          // from LocationPicker
  scope: { cat: string; label: string } | null;
  savedAt: number;                         // Date.now()
}
```

### Deduplication rule

Same `keyword` (case-insensitive) + same `scope.cat` → existing entry removed and new one added to top.

### Note on two recent-search implementations

There are two implementations of recent searches:

| | `useRecentSearches` hook | `useRecentSearchesStore` store |
|---|---|---|
| Mechanism | `localStorage` direct | Zustand `persist` |
| Location | `lib/hooks/use-recent-searches.ts` | `lib/stores/recentSearchesStore.ts` |
| `RecentSearch` shape | Includes `LocationValue`, `scope` | Includes raw `lat/lng/radius` |
| Status | Used in production search bar | Used in homepage `RecentSearches` component |

Before launch: **consolidate into one**. The hook version (`use-recent-searches.ts`) has the richer location shape and is preferred.

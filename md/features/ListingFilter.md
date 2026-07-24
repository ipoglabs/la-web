# Listing Page — Filter Panel UX

> **Screen priority:** The listings page is the most used screen in the product. The filter open/close experience must be crafted carefully across every breakpoint. Every pixel counts here.

---

## Overview

The filter panel behaves differently across three use cases, each driven by available screen real estate. There is **no single component** for all three — mobile/tablet uses a Sheet, desktop uses an inline/sticky panel — but a **single toggle button** in the toolbar unifies the trigger across all breakpoints.

---

## Use Cases

### UC1 — Mobile & Tablet (`< 1024px` / `< lg`)

- A **filter icon button** is visible in the results toolbar (hidden on `lg+`).
- Tapping opens `MobileFilterSheet` — a slide-in Sheet from the left edge.
- Sheet structure: header (icon + title + × close), scrollable `FilterContent`, sticky "Apply Filters" footer.
- The filter panel (`<aside>`) is **not rendered at all** in the DOM at this breakpoint — it's hidden via `hidden lg:flex`.

```
[Filter Icon]  12 results in To Rent       Sort by: Newest
─────────────────────────────────────────────────────────
[ Card ][ Card ]
[ Card ][ Card ]     ← 2 columns mobile, 4 columns tablet
```

---

### UC2 — Compact Desktop (`1024px–1279px` / `lg` to `xl`)

- The filter panel appears **inline** as a flex column in the layout (left of the listing grid).
- It is a **bounded card**: `max-h-[calc(100vh-11rem)]` — fills the visible viewport below the header stack (AppHeader 64px + SearchBar ~44px + ContextBar ~40px + pt-6 ~24px ≈ 172px / 11rem).
- The filter content (`FilterContent`) has **its own `overflow-y-auto` scroll** — independent of the browser scroll. The user can scroll filters without affecting the page.
- The panel is a rounded card with border and shadow.
- A **desktop toggle button** (hidden on `< lg`) sits in the results toolbar. It is `primary/filled` when open, `secondary` when closed.
- Grid switches to **4 columns** when the panel is open.
- Grid switches to **5 columns** when the panel is collapsed — making use of the freed space.

```
┌──────────────┐  [Filter ●]  12 results       Sort by: Newest
│  Filters     │  ─────────────────────────────────────────────
│  ──────────  │  [ Card ][ Card ][ Card ][ Card ]
│  [options]   │  [ Card ][ Card ]                ← 4 cols
│              │
│  Apply ────  │
└──────────────┘
```

---

### UC3 — Wide Desktop (`≥ 1280px` / `xl+`)

- Same panel as UC2 but gains `xl:sticky xl:top-0` — **sticks to the top of the viewport** as the user scrolls the listing grid.
- The listing grid scrolls freely on the right. The filter is always in view.
- Internal filter content still has its own `overflow-y-auto` scroll for long filter lists.
- **Important:** UC3 does NOT use `h-screen`. It uses the same `max-h-[calc(100vh-11rem)]` as UC2. See the CSS Patterns section for why this is correct.

```
Viewport top ───────────────────────────────────────────────
┌──────────────┐  [Filter ●]  12 results       Sort by: Newest
│  Filters     │  ─────────────────────────────────────────────
│  ──────────  │  [ Card ][ Card ][ Card ][ Card ]
│  [options]   │  [ Card ][ Card ][ Card ][ Card ]
│   ↕ scrolls  │  [ Card ][ Card ][ Card ][ Card ]  ← page scrolls
│   inside     │       ↑ this area scrolls with browser
│              │
│  Apply ────  │
└──────────────┘
Viewport bottom ─────────────────────────────────────────────
```

---

## Grid Column Behaviour

| Breakpoint | Filter State | Columns |
|---|---|---|
| Mobile (`< md`) | — | 2 |
| Tablet (`md`–`lg`) | — | 4 |
| Desktop (`lg+`) | Panel open | 4 |
| Desktop (`lg+`) | Panel closed | **5** |

The grid column count is driven by the `desktopFilterOpen` prop passed from `ListingsPage` → `ListingGrid`.

---

## File Map

| File | Role |
|---|---|
| `app/(main)/listings/page.tsx` | Page orchestration — all state, `FilterPanel`, `ContextBar`, toggle buttons, layout |
| `app/(main)/listings/FilterContent.tsx` | Config-driven filter UI — 3 render modes: sub-picker, true empty, filter sections |
| `app/(main)/listings/MobileFilterSheet.tsx` | UC1 slide-in Sheet wrapper — hides footer in sub-picker mode |
| `app/(main)/listings/ListingGrid.tsx` | Listing grid — accepts `desktopFilterOpen` to switch 4↔5 columns |
| `lib/listing-filters.ts` | Bridge — sole importer of create-alert config. All URL helpers. |
| `lib/hooks/useListingFilters.ts` | URL-backed filter state hook |
| `lib/category-map.ts` | **Canonical source** — all 21 category labels + every subcategory label. Never edit listing-map.ts for labels. |
| `lib/mock/listing-map.ts` | Mock data resolver — re-exports from `category-map.ts` for backwards compat |

---

## State

All UI state lives in `ListingsPage` (no external store needed):

```ts
const [filterOpen, setFilterOpen] = useState(false);  // UC1: mobile sheet open/close
const [desktopOpen, setDesktopOpen] = useState(true);  // UC2/UC3: desktop panel open/close
```

URL-backed filter state comes from the hook:

```ts
const { filterValues, draftValues, filters, activeChips, ... } = useListingFilters(cat, sub);
```

The hook exposes both **committed** (`filterValues` — always mirrors URL) and **draft** (`draftValues` — local pending state) values. Both the desktop panel and the mobile sheet use the draft pattern:
1. `openDraft()` — called when either surface opens; seeds draft from current URL state
2. `setDraftValue()` — called per-toggle; updates draft only, no URL push
3. `applyDraft()` — called on Apply; single URL push with full draft
4. `clearAndApply()` — called on Clear All; clears draft AND pushes empty to URL atomically

`toggleFilter()` and `setFilterValues()` are kept for `removeChip()` internals and programmatic use — they are not wired to the filter UI.

Subcategory picker data is derived inline (not stored in state):

```ts
// Only populated when cat is set but sub is not — empty once sub is chosen
const subcategoryList = (cat && !sub)
  ? Object.entries(SUBCATEGORY_LABELS[cat] ?? {}).map(([key, label]) => ({ key, label }))
  : [];

function handleSubSelect(subKey: string) {
  router.push(`/listings?cat=${cat}&sub=${subKey}`); // clean URL, no stale filter params
}
```

Draft counts are derived at the page level (not from the hook, which counts committed values):

```ts
const draftActiveCount      = Object.values(draftValues).reduce((s, a) => s + a.length, 0);
const draftHasActiveFilters = draftActiveCount > 0;
```

These are passed to `FilterPanel` so the Apply button label reflects pending changes, not the live URL state.

`desktopOpen` defaults to `true` — panel is open on first load on desktop.

---

## Key CSS Patterns

### Panel flex structure (UC2 + UC3)

```tsx
<aside className="w-64 flex-none flex-col ...">
  {/* Header — shrink-0, never scrolls */}
  <div className="shrink-0 ...">...</div>

  {/* Content — flex-1 min-h-0 overflow-y-auto — KEY pattern */}
  <div className="flex-1 min-h-0 overflow-y-auto ...">
    <FilterContent />
  </div>

  {/* Footer — shrink-0, always visible */}
  <div className="shrink-0 ...">Apply Filters</div>
</aside>
```

> **`min-h-0` is critical.** Inside a flex column, a child with `flex-1` will overflow the container without `min-h-0`. This is what makes `overflow-y-auto` work correctly inside a bounded/sticky flex column.

### UC3 sticky pattern

```tsx
"xl:sticky xl:top-0"
```

The panel sticks to `top-0` when the page is scrolled and the header disappears. No `h-screen` is used — the same `max-h-[calc(100vh-11rem)]` that governs UC2 applies here too. No JavaScript scroll listeners needed.

**Why NOT `h-screen` for UC3 — the critical bug fix:**

The filter panel does not start at the very top of the viewport — it starts **~172px below it**, behind the header stack (AppHeader + SearchBar + ContextBar + pt-6). If `h-screen` (100vh) were used:

```
Viewport top ─────────────────────────────────
  [AppHeader 64px]
  [SearchBar 44px]
  [BreadcrumbBar 40px]
  [pt-6 24px]
  ┌─ Filter panel starts HERE at ~172px
  │  height = 100vh  ← BUG: extends 172px below fold!
  │  ...
  │  Apply Filters   ← invisible! cut off below viewport
Viewport bottom ─────────────────────────────
  │ 172px of panel invisible ↓
```

With `max-h-[calc(100vh-11rem)]` instead:
```
  At page top   : starts at 172px, height = 100vh-172px → bottom = viewport fold ✓
  When scrolled : stuck at top-0, height = 100vh-172px → small gap at bottom ✓
```

The filter panel is **always 100% visible** in both states.

### UC2 height bound (applies to UC3 too)

```tsx
"max-h-[calc(100vh-11rem)]"
```

`11rem = 176px` accounts for the fixed chrome above the content area:
- AppHeader: `h-16` = 64px
- SearchBar: ~44px
- ContextBar: ~40px
- Container `pt-3`: 12px
- **Total: ~160px ≈ 10rem**

Note: the `max-h` value is still `11rem` (conservative buffer) — safe to leave unless layout chrome changes significantly.

This same value is used for **both UC2 and UC3** — it is the correct, consistent bound.

> If the header chrome changes height, update this value. Consider making it a CSS variable if the layout becomes more dynamic.

---

## Root Layout Minimum Width

To protect against extreme browser zoom-out breaking the desktop layout, the root `<body>` has responsive minimum widths:

```tsx
// app/layout.tsx
<body className="bg-stone-900/5 min-w-93.75 lg:min-w-240">
```

| Breakpoint | Min Width | Value | Reason |
|---|---|---|---|
| Mobile (`< lg`) | `min-w-93.75` | 375px | Standard mobile minimum |
| Desktop (`lg+`) | `lg:min-w-240` | 960px | Ensures filter panel + grid layout never collapses |

When the user zooms out below these thresholds, the browser shows a horizontal scrollbar rather than the layout breaking.

---

## Developer Notes

### FilterContent — 3 render modes

`FilterContent` is a pure presentational component that adapts to three states based on its props:

| Mode | Condition | Renders |
|---|---|---|
| **Sub-picker** | `filters.length === 0` AND `subcategories.length > 0` | Clickable list of subcategories with chevrons |
| **True empty** | `filters.length === 0` AND `subcategories.length === 0` | Icon + “No filters defined for this subcategory” |
| **Filters** | `filters.length > 0` | Price `RangeFilterRow` first, then `ToggleButtonGroup` sections |

The `subcategoryList` in `page.tsx` is the key signal — it is only non-empty when `cat && !sub`. Once `sub` is set it becomes `[]`, so FilterContent falls through to the correct mode automatically.

**Desktop sub-pick flow:**
```
User clicks sub in FilterPanel → handleSubSelect() → router.push(?cat=X&sub=Y)
→ URL updates → sub becomes set → subcategoryList = [] → FilterContent shows filters ✓
```

**Mobile sub-pick flow:**
```
User opens sheet → openDraft() seeds draft from URL (draft = {} since no filters yet)
→ User taps sub → handleSubSelect() → router.push(?cat=X&sub=Y)
→ Sheet stays open → URL updates → sub becomes set → filters load → Apply footer appears ✓
```

Draft correctness after mobile sub-pick: `draftValues` was `{}` (seeded from empty filter URL) so newly-rendered filters start with no pre-selections. ✓

### Sheet (UC1) vs Panel (UC2/UC3) — shared `FilterContent`

Both the `MobileFilterSheet` and the desktop `FilterPanel` render the same `FilterContent` component. This means:
- All 3 render modes work identically on both surfaces.
- Any changes to filter layout/controls apply to both experiences automatically.
- The parent container provides the scroll boundary — `FilterContent` itself should never set its own height or overflow.
- Both the Sheet and the Panel use the `flex-1 min-h-0 overflow-y-auto` pattern on their content wrappers. **`min-h-0` must be present in both** — `SheetContent` is already `flex flex-col`, so the same rule applies.

### Apply / Clear footer

- **UC1 (Sheet), filter mode**: Footer has “Clear all” (visible only when `activeCount > 0`) + “Apply (N)” primary button. Tapping Apply commits draft to URL and closes the sheet.
- **UC1 (Sheet), sub-picker mode**: Footer is **hidden** (`isSubPickerMode = true`). No selections to apply yet — user picks a sub first.
- **UC2/UC3 (Panel)**: Has an **Apply Filters** button in the panel footer (hidden in sub-picker mode). Filters follow the **draft pattern** — every toggle updates local draft only, single URL push happens on Apply click. "Clear all" link appears in the panel header when `hasActiveFilters`.

---

## Price Range Filter

A price range filter is **automatically injected as the first filter** for every subcategory by `resolveFilters()` in `lib/listing-filters.ts`. Categories not explicitly listed fall back to `GENERAL_STEPS` (£10–£50,000).

### Type — `RangeFilterConfig`

```ts
interface RangeFilterConfig {
  type: "range";
  id: string;           // always "price" for the injected filter
  label: string;        // "Price"
  steps: readonly number[]; // ordered breakpoints e.g. [200, 400, ..., 50000]
  prefix?: string;      // "£"
}
```

This type lives in `lib/listing-filters.ts` — **not** in `create-alert/types.ts`. `CreateAlertJourney` never receives or renders range filters.

Use `isRangeFilter(f)` to distinguish from options-based `FilterConfig`.

### URL storage

Range filters use **separate `_min` / `_max` params** — not comma-joined like options:

```
?cat=property&sub=to_rent&price_min=500&price_max=2000
```

Both params are parsed explicitly in `parseFilterValues()` before the general comma-split loop. `price_min` and `price_max` are added to `RESERVED_PARAMS` so they are never double-processed.

### Step sets per category

| Key | Steps | Range |
|---|---|---|
| `property/to_rent` | RENT_STEPS | £200 – £50,000 |
| `property/to_buy` | BUY_STEPS | £5,000 – £5,000,000 |
| `property/room_rental` + `for_students` | ROOM_STEPS | £100 – £50,000 |
| `property/commercial` | RENT_STEPS | £200 – £50,000 |
| `vehicles/*` | VEHICLE_STEPS | £500 – £50,000 |
| all others | GENERAL_STEPS | £10 – £50,000 |

### UI — `RangeFilterRow`

A named sub-component in `FilterContent.tsx` (not an IIFE). Renders two stacked `LaSelectResponsive` dropdowns:
- **Min** — "No Min" + all steps below current Max
- **Max** — "No Max" + all steps above current Min
- Selecting "No Min" / "No Max" clears that end of the range
- If a new Min is set ≥ existing Max → Max is auto-cleared (and vice versa)
- Mobile: Vaul Drawer (`< md`). Desktop: native `<select>` (`≥ md`).

### Chip strip

One chip regardless of whether Min, Max, or both are set:

| Selection | Chip label |
|---|---|
| Min only | `£500+` |
| Max only | `Under £2,000` |
| Both | `£500 – £2,000` |

Removing the chip calls `removeChipFromValues("price__range", ...)` which clears both `price_min` and `price_max` atomically.

### TODO [INTEGRATION]

```ts
// In useListingSearch.ts — resolveListingsMock() currently ignores price params.
// When connecting a real API, pass price_min / price_max directly:
// GET /api/v1/listings?cat=property&sub=to_rent&price_min=500&price_max=2000
// The params are already in filterValues → already in the URL → just pass through.
```

---

## Context Bar

The context bar sits between the SearchBar and the content area. It is constrained to `h-8` — **never increase this height**.

```
Desktop:  [📍 Location picker — flex-1]     [Sort by: Newest ▾]
Mobile:   [📍 Location picker — flex-1]     [Newest ▾]  [funnel icon]
```

### Location slot

A `LocationPicker` (trigger="link") occupies the left side with `flex-1`. When a location is set a `×` clear button appears inline. Changing location rewrites `lat`, `lng`, `radius`, `unit`, and `loc` URL params and resets `page` to 1.

### Sort slot

- **Desktop** (`sm+`): labelled `select` — "Sort by: [Newest ▾]"
- **Mobile** (`< sm`): Visual "Newest + funnel" text + icon. An invisible `<select>` (`opacity-0 absolute inset-0`) overlays the whole chip — tapping anywhere opens the native OS picker. This avoids `label htmlFor` unreliability on mobile touch targets.

Sort options: Relevance · Newest · Oldest · High Price · Low Price

Changing sort rewrites `sort` in the URL and resets `page` to 1.

### Mobile filter badge

`activeFilterCount` (the committed count from URL) is shown as a small blue badge on the funnel icon when filters are active. Tapping the funnel opens the `MobileFilterSheet`.

---

## Search Bar & ScopeChip

The `LaSearchBar` component sits in the `bg-slate-800` band at the top. It exports the `SearchScope` type used to carry category/subcategory context:

```ts
export interface SearchScope {
  cat:      string;   // e.g. "property"
  label:    string;   // e.g. "Property"
  sub?:     string;   // e.g. "to_rent"   — only when inside a sub
  subLabel?: string;  // e.g. "To Rent"   — only when inside a sub
}
```

### ScopeChip — two independent targets

The chip renders two separate click targets, never mixed:

| Button | Opens | Notes |
|---|---|---|
| `[··· ▾]` | Category list | Always visible. Selecting a new cat clears sub. |
| `[Property ▾]` or `[Property › To Rent ▾]` | Subcategory list for current cat | Hidden when no scope. On mobile, cat label hidden when sub is set. |
| `[×]` | — | Clears entire scope (cat + sub). |

Each target has its own `ref` and `state` (`catOpen`/`subOpen`). Outside-click closes them independently via `mousedown` on `document`. The search bar wrapper must **not** have `overflow-hidden` — this would clip the absolutely-positioned dropdowns.

Selecting a scope immediately submits the search (calls `onSearch`). The listings page then builds a fresh URL with the new `cat`/`sub` via `handleSearch`.

### URL params owned by search

| Param | Source | Notes |
|---|---|---|
| `cat` | Scope chip | Category key, e.g. `property` |
| `sub` | Scope chip | Subcategory key, e.g. `to_rent` |
| `q` | Keyword input | Free-text keyword |
| `lat`, `lng`, `radius`, `unit` | LocationPicker (ContextBar) | Geo context — preserved across keyword changes |
| `loc` | LocationPicker (ContextBar) | Human-readable location label |
| `sort` | Sort select (ContextBar) | Preserved across keyword/scope changes |

Keyword search preserves the current location and sort. Scope change clears filters but keeps location/sort.

---

### Sort by

Moved from the results toolbar into the breadcrumb bar to save vertical space. Sits flush right. Uses a `rounded-md` native `<select>` — not `rounded-full`.

### Create Alert

Commented out for now (TODO in code). Will be restored when alert functionality is built. The commented block is preserved in `BreadcrumbBar`.

---

## Filter Toggle Button

A plain native `<button>` (not `LaButton`) — gives exact control over size:

```tsx
<button
  type="button"
  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 transition-colors"
>
  <SolidFilterHorizontal24by24 className="size-6 text-slate-700" />
</button>
```

- `p-1.5` = 6px padding → total button = 36×36px (compact, space-efficient)
- `size-6` = 24px icon
- `bg-white` default, `hover:bg-slate-100` feedback
- `rounded-lg` — not a circle
- Mobile/tablet button: `lg:hidden` — UC1
- Desktop button: `hidden lg:flex` — UC2/UC3

---

## Category Map — `lib/category-map.ts`

The **single source of truth** for all navigation labels.

```
lib/category-map.ts
  └── CATEGORY_LABELS      — 21 top-level categories
  └── SUBCATEGORY_LABELS   — all subcategories per category
```

**Import rule:** Always import from `@/lib/category-map` in new code. Never from `lib/mock/listing-map`.

`lib/mock/listing-map.ts` re-exports both for backwards compatibility:
```ts
export { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
```

When the real API replaces mock data, `listing-map.ts` gets deleted — `category-map.ts` survives untouched because it is navigation/UI data, not data-fetching logic.

---

## Filter System Architecture

### Independence contract

The filter UI is completely independent of Create Alert. The only connection is a single bridge file:

```
components/create-alert/config/    ← pure data (FilterConfig[], SubCategory[])
        ↓  (imported only here)
lib/listing-filters.ts             ← bridge: resolveFilters(), URL helpers
        ↓  (imported by UI)
lib/hooks/useListingFilters.ts     ← URL state hook
        ↓
app/(main)/listings/FilterContent  ← config-driven filter UI (ToggleButtonGroup)
app/(main)/listings/FilterPanel    ← desktop panel shell
app/(main)/listings/MobileFilterSheet ← mobile sheet shell
```

If the config source changes (real API, separate package), only `lib/listing-filters.ts` changes. Zero UI components change.

### URL format

Filter values are serialised as comma-separated params:
```
/listings?cat=property&sub=to_rent&prop_type=apartment,condo&beds=2,3
```

Rules:
- `cat` and `sub` are **never** part of `filterValues` — they are separate URL params
- Empty arrays are omitted from the URL entirely
- Filter IDs never collide with reserved params: `cat`, `sub`, `q`, `sort`, `page`, `lat`, `lng`, `radius`, `unit`
- Order of values in the comma list is not significant

### `lib/listing-filters.ts` — API

| Export | Signature | Purpose |
|---|---|---|
| `resolveFilters` | `(cat, sub) → FilterConfig[]` | Returns filter config for cat+sub pair |
| `parseFilterValues` | `(URLSearchParams) → Record<string, string[]>` | Parses URL → filter state |
| `buildFilterURL` | `(cat, sub, values, extras?) → string` | Builds full URL string from filter state |
| `deriveActiveChips` | `(values, filters) → FilterChip[]` | Derives chip array for `LaFilterChipStrip` |
| `removeChipFromValues` | `(chipId, values) → Record<string, string[]>` | Removes one chip from filter state |
| `FilterChip` | `{ id: string; label: string }` | Chip type — `id` encodes `"filterId__value"` |

`resolveFilters` returns `[]` when cat/sub is empty, unknown, or has no filters — the `FilterContent` empty state handles this gracefully.

### `lib/hooks/useListingFilters.ts` — hook API

```ts
const {
  filterValues,       // Record<string, string[]>  — committed state, mirrors URL
  draftValues,        // Record<string, string[]>  — pending state for mobile sheet
  filters,            // FilterConfig[]            — resolved for current cat + sub
  activeChips,        // FilterChip[]              — for LaFilterChipStrip
  hasActiveFilters,   // boolean                   — true when any filter is active
  activeCount,        // number                    — total active options (for badge)
  setFilterValues,   // (values: Record<string,string[]>) → void  [desktop: push full map, used by FilterPanel]
  toggleFilter,       // (filterId, value, singleSelect?) → void  [desktop: per-value toggle, available but not used by FilterPanel]
  setDraftValue,      // (filterId, values) → void                [mobile draft]
  openDraft,          // () → void  — seeds draft from URL (call on sheet open)
  applyDraft,         // () → void  — commits draft → URL         [mobile Apply]
  removeChip,         // (chipId) → void  — removes one chip from URL
  clearAndApply,      // () → void  — atomic: clear draft + push empty to URL (no stale-closure race)
  clearAll,           // () → void  — clears all filter params from URL
} = useListingFilters(cat, sub)
```

### Desktop vs Mobile pattern

| | Desktop (UC2/UC3) | Mobile (UC1) |
|---|---|---|
| Apply model | **Instant** — every toggle pushes to URL | **Draft** — batch selections, single Apply |
| Function used | `setFilterValues()` (via FilterPanel onChange) | `setDraftValue()` → `applyDraft()` |
| Apply button | **"Apply (N)"** in panel footer — idempotent (re-pushes current URL values); hidden in sub-picker mode | "Apply (N)" button in sheet footer |
| Draft lifecycle | N/A | `openDraft()` on sheet open → `applyDraft()` on Apply tap |

### FilterContent — props

```ts
interface FilterContentProps {
  filters: FilterConfig[]                    // from resolveFilters(cat, sub)
  values: Record<string, string[]>           // filterValues (desktop) or draftValues (mobile)
  onChange: (filterId: string, values: string[]) => void
  subcategories?: Array<{ key: string; label: string }>  // only non-empty when cat && !sub
  currentSub?: string                        // highlights active sub in picker
  onSubSelect?: (sub: string) => void        // navigates to ?cat=X&sub=Y (clean URL)
}
```

- Renders sub-picker when `filters.length === 0` and `subcategories.length > 0`
- Renders empty state when `filters.length === 0` and no subcategories
- Each `FilterConfig` becomes a labelled section with a `ToggleButtonGroup` (same component as Create Alert UI)
- `singleSelect` prop on filter config is passed directly to `ToggleButtonGroup`
- Button size: `size="default"` — matches Create Alert Step 2 toggle style (24px check-circle icons + default padding)

### Adding a new filter to an existing subcategory

Edit the relevant file in `components/create-alert/config/<category>.ts`. Add a `FilterConfig` object to the subcategory's `filters` array. It appears in both the listing filter panel and the Create Alert journey automatically — no UI changes needed.

```ts
// Example: add "Pet Friendly" toggle to property to_rent subcategory
{
  id: "pet_friendly",
  label: "Pet Friendly",
  type: "toggle",
  singleSelect: true,
  options: [
    { label: "Yes", value: "yes" },
  ],
}
```

### Adding a new filter type (`range`, `text`, `date`)

Currently all filters use `type: "toggle"`. `FilterContent` renders toggle groups for all types. When a new type is needed:
1. Define it in `types.ts` (already open: `"toggle" | "range" | "text" | "date"`)
2. Add a new component for the type (e.g. `LaMinMax` for range)
3. Add a type guard branch in `FilterContent`:

```tsx
{filter.type === "range" && <LaMinMax ... />}
{filter.type === "toggle" && <ToggleButtonGroup ... />}
```

---

## Unified Search Architecture

### Core Principle — URL Is the Single Source of Truth

Every user interaction that changes the results list writes to the URL. `useListingSearch` reads the URL and calls the data source. Nothing else triggers a fetch.

```
Search bar submit  →  router.push(?cat=&q=&lat=&lng=&radius=&sort=)
Location change    →  router.push(?...&lat=&lng=&radius=&unit=)
Filter toggle      →  router.push(?...&prop_type=apartment&beds=2)
Sort change        →  router.push(?...&sort=price_asc)
Page click         →  router.push(?...&page=3)
                                    ↓
                           URL changes → React re-renders
                                    ↓
                      useListingSearch reads new URL params
                                    ↓
                           data fetch → show results
```

### Full URL Contract

```
/listings?cat=property&sub=to_rent
         &q=3+bed+flat
         &lat=51.5074&lng=-0.1278&radius=5&unit=km
         &sort=newest
         &page=2
         &prop_type=apartment&beds=2,3
```

| Param | Source | Values | Notes |
|---|---|---|---|
| `cat` | Search bar scope / breadcrumb nav | e.g. `property` | From `CATEGORY_LABELS` keys |
| `sub` | Sub-picker / breadcrumb dropdown | e.g. `to_rent` | From `SUBCATEGORY_LABELS` keys |
| `q` | Search bar keyword input | free text | URL-encoded |
| `lat` | Location picker | decimal float | e.g. `51.5074` |
| `lng` | Location picker | decimal float | e.g. `-0.1278` |
| `radius` | Location picker | integer | e.g. `5` |
| `unit` | Location picker | `km` \| `mi` | |
| `sort` | Sort select | `newest` \| `oldest` \| `price_asc` \| `price_desc` | defaults to `newest` |
| `page` | Pagination | 1-based integer | omitted when page = 1 |
| `{filter_id}` | Filter panel | comma-separated values | e.g. `prop_type=apartment,condo` |

### Page Reset Rules

Filter changes, sort changes, and new searches always reset to page 1. Only explicit pagination clicks set `?page=N > 1`.

| Trigger | Resets page? | Why |
|---|---|---|
| Filter toggle | ✅ yes | `getExtras()` in `useListingFilters` never writes `page` |
| Sort change | ✅ yes | Inline `onChange` on sort `<select>` calls `params.delete("page")` before push |
| Search submit | ✅ yes | `handleSearch` builds a fresh URL without `page` |
| Pagination click | ❌ no | That IS the page change |

### Data Flow by Input Source

#### 1. Search Bar (`LaSearchBar.onSearch → handleSearch`)

```ts
function handleSearch(query: SearchQuery) {
  const params = new URLSearchParams();
  if (query.scope?.cat)            params.set("cat",    query.scope.cat);
  if (query.keyword?.trim())       params.set("q",      query.keyword.trim());
  if (query.location?.lat != null) params.set("lat",    String(query.location.lat));
  if (query.location?.lng != null) params.set("lng",    String(query.location.lng));
  if (query.location?.radius)      params.set("radius", String(query.location.radius));
  if (query.location?.unit)        params.set("unit",   query.location.unit);
  // Preserve sort; drop sub + filters (new keyword search = fresh scope)
  const sort = searchParams.get("sort");
  if (sort) params.set("sort", sort);
  router.push(`/listings?${params.toString()}`, { scroll: false });
}
```

`sub` and filter params are intentionally dropped — a new keyword search starts fresh within the category scope.

#### 2. Filter Panel (`useListingFilters`)

Already URL-backed — every toggle calls `router.push` via `setFilterValues()`. See **Filter System Architecture** section above.

#### 3. Sort Select (`BreadcrumbBar`)

```ts
onChange={(e) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("sort", e.target.value);
  params.delete("page");            // always reset to page 1
  router.push(`/listings?${params.toString()}`, { scroll: false });
}}
```

#### 4. Pagination (`SmartPagination + buildPageHref`)

```ts
function buildPageHref(pageNum: number): string {
  const params = new URLSearchParams(searchParams.toString());
  if (pageNum <= 1) params.delete("page");  // page 1 = clean URL (no ?page=1)
  else params.set("page", String(pageNum));
  return `/listings?${params.toString()}`;
}
```

### `useListingSearch` — Hook API

```ts
const {
  items,          // MockListing[]   current page results
  totalCount,     // number          total results across all pages
  totalPages,     // number          ceil(totalCount / PAGE_SIZE)
  currentPage,    // number          current 1-based page
  isLoading,      // boolean         true while fetching
  loadingContext, // string          "Searching 'flat' in Property · To Rent…"
  cachedPages,    // Set<number>     pages in pre-fetch cache (instant navigation) — available but not currently used in page.tsx
} = useListingSearch(params);
```

**`PAGE_SIZE`** = 12 (constant exported from the hook file).

### Pagination — Windowed Pre-fetch Cache

When the user navigates to page N, pages `max(1, N-3)` through `min(totalPages, N+3)` are pre-fetched and stored in a `useRef<Map<number, MockListing[]>>`. Navigating to a cached page shows results instantly — no skeleton.

Cache is invalidated (cleared) when any non-page param changes (new search, filter, sort, or location).

```
User clicks page 5
  → cache miss → show skeleton + "Loading page 5 of Property · To Rent…"
  → fetch + cache pages 2, 3, 4, 5, 6, 7, 8
  → show page 5

User clicks page 6
  → cache hit → instant display, no skeleton ✓

User changes filter
  → cache cleared → fetch from page 1 again
```

### Loading UX — Skeleton + Context Message

While `isLoading` is true, `ListingGrid` renders 12 pulse skeleton cards and a contextual banner:

| State | Message |
|---|---|
| Keyword + location | `Searching "3 bed flat" near your location in Property · To Rent…` |
| Keyword only | `Searching "3 bed flat" in Property · To Rent…` |
| Location only | `Finding results near your location in Property · To Rent…` |
| Page change | `Loading page 3 of Property · To Rent…` |
| Category/sub only | `Loading Property · To Rent…` |
| Fallback | `Loading results…` |

The result count area shows a pulse shimmer while loading — no stale count from a previous search is ever shown.

### Integration Checklist (`lib/hooks/useListingSearch.ts`)

When swapping mock for a real API:

1. **Replace `resolveListingsMock()`** with `fetch("/api/v1/listings", { params })`.
2. **Remove `MOCK_DELAY_MS`** — real API latency drives loading state naturally.
3. **Move pagination to the server** — API returns `PAGE_SIZE` items + `meta.total`. Remove the client-side array slice.
4. **Pre-fetch adjacent pages** with `Promise.all()` — cache structure stays identical.
5. **Wire `lat`/`lng`/`radius`** — already passed from `handleSearch` through URL → hook → API. No UI changes needed.
6. **Wire `q` param** to full-text search index (Elasticsearch, Typesense, etc.).
7. **Consider SWR or React Query** for production — handles deduplication, background revalidation, and error boundaries.


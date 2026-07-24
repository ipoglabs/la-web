# LaSearchBar — Smart Composite Search Bar

> **Component path:** `components/la-search-bar/LaSearchBar.tsx`  
> **Export:** `components/la-search-bar/index.ts`

---

## Overview

`LaSearchBar` is a composite smart search bar for classifieds. It combines a keyword input and a category scope chip into a single cohesive control. On focus it reveals recent search history; while typing it suggests the best-matching category from a curated keyword map. Location is handled externally (by `LocationPicker` in the landing hero or in the listings `ContextBar`).

---

## Features

| ID | Feature | Description |
|----|---------|-------------|
| **B1** | Recent search history | On focus with an empty keyword field, shows up to 8 past searches from `localStorage` |
| **B2** | Smart category suggestion | While typing (≥ 2 chars), debounced 200 ms, suggests a category from `suggestCategory()` |
| **B3** | Scope chip | Single pill — shows "All Categories" when unset; shows subLabel (or cat label) when set. Two zones: left opens the picker, right `×` clears. Selecting never auto-submits. |

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialScope` | `SearchScope \| null` | `null` | Pre-set category scope — pass the current page scope when on a listings page |
| `initialKeyword` | `string` | `""` | Pre-fill the keyword input — e.g. restore from URL `q` param |
| `onSearch` | `(query: SearchQuery) => void` | — | Called on Enter or Search button press |
| `size` | `"default" \| "lg"` | `"default"` | `"lg"` = taller hero bar (44px, 18px text) |
| `placeholder` | `string` | `"What are you looking for?"` | Input placeholder |
| `className` | `string` | — | Outer wrapper class override |

---

## Output

Submitting fires `onSearch(query: SearchQuery)`:

```ts
interface SearchQuery {
  keyword:  string;
  location: null;                     // always null — location is owned by the consuming page
  scope:    SearchScope | null;       // { cat: string; label: string; sub?: string; subLabel?: string }
}
```

---

## Internal Sub-components

| Component | Role |
|-----------|------|
| `ScopeChip` | Single joined pill. No scope → `[All Categories ▾]` opens unified picker. Scope set → `[Room Rental ▾ \| ×]` — left half opens the full cat+sub picker; right `×` clears scope. Chip label shows `subLabel` when sub is set, otherwise `label`. |
| `RecentRow` | History row — keyword + scope/location meta; remove `×` appears on hover |
| `SuggestionRow` | Typed suggestion row — `"x in Category"` (amber, highlighted) or `"x in All Categories"` — props: `icon`, `primary`, `onSelect`, `highlight` |
| `DropdownPanel` | Floating white card — `rounded-xl`, `shadow-[0_8px_28px_rgba(0,0,0,0.13)]` |

---

## Responsive Layout

### Mobile (`< sm`)
- **Single row:** Search icon → keyword input → clear `×` → scope chip → circular arrow button
- Bar shape: `rounded-2xl`

### Desktop (`sm+`)
- **Single row:** Search icon → keyword input → clear `×` → scope chip → circular arrow button
- Bar shape: `rounded-full`

### Focus state
```
bg-amber-50  border-blue-400  ring-1 ring-blue-300
```

### Idle state
```
bg-white  border-slate-200
```

---

## Scope Chip Behaviour

```
No scope:   [All Categories ▾]       → opens unified cat+sub picker
Cat only:   [Vehicles ▾ | ×]         → left opens picker, right clears
Cat + Sub:  [Room Rental ▾ | ×]      → shows subLabel only; left opens picker, right clears
```

Selecting a category or subcategory from the dropdown **only updates the scope state** — it does not auto-submit the search. The user must press the search button (or Enter) to fire `onSearch`.

---

## Dropdown Logic

```
showRecents    = focused && keyword === "" && recents.length > 0
showSuggestion = focused && keyword.length >= 2
showDropdown   = showRecents || showSuggestion
```

**Suggestion rows (when typing):**
1. `"keyword" in "Detected/Scope Category"` — amber sparkle icon, "Suggested" badge — only shown when a category is available
2. `"keyword" in All Categories"` — plain search icon, no highlight

**Recent rows (on focus, empty input):**
- Shows "Recent searches" header + "Clear all" button
- Up to 8 entries; each shows keyword, scope label, and location sublabel
- Individual `×` remove on hover (opacity transition)

---

## State

| State | Type | Purpose |
|-------|------|---------|
| `keyword` | `string` | Current input value |
| `scope` | `SearchScope \| null` | Active category scope |
| `focused` | `boolean` | Controls dropdown visibility |
| `suggestion` | `CategorySuggestion \| null` | Debounced result from `suggestCategory()` |
| `prevInitialScope` | same as `initialScope` | Tracks previous prop value for render-time sync |
| `prevInitialKeyword` | same as `initialKeyword` | Tracks previous prop value for render-time sync |

---

## Hooks & Utilities

### `useRecentSearches` — `lib/hooks/use-recent-searches.ts`

localStorage-backed hook. Key: `la:recent-searches`. Max 8 entries.

```ts
const { recents, save, remove, clear } = useRecentSearches();
```

- **`save(entry)`** — deduplicates by `keyword + scope.cat` before prepending; skips if both keyword and scope are empty
- **`remove(id)`** — removes by timestamp-based id
- **`clear()`** — wipes all entries

### `suggestCategory` — `lib/search-keywords.ts`

Pure function, no AI. Matches input against `KEYWORD_CATEGORY_MAP` (20 categories, hundreds of keywords) using case-insensitive `.includes()`.

```ts
suggestCategory("iMac 27 inch") → { cat: "electronics_tech", label: "Electronics & Tech" }
suggestCategory("3 bed flat")   → { cat: "property",         label: "Property" }
suggestCategory("hello world")  → null
```

---

## Key Behaviours

- **Submit (Enter or button):** saves to recents → fires `onSearch({ keyword, location: null, scope })`
- **Select recent:** fills keyword + scope → fires `onSearch` immediately (no extra step)
- **Accept suggestion:** sets scope + calls `handleSubmit(scopeOverride)` directly — bypasses stale closure, submitted query always has the correct scope
- **Scope change:** updates scope state only — no auto-navigation; user still hits search
- **Outside click:** `mousedown` listener on `document` closes the dropdown
- **Prop sync (`initialScope` / `initialKeyword`):** uses React "adjusting state from parent" render-time pattern — no `useEffect` for prop→state sync
- **Duplicate prevention:** same `keyword + scope.cat` combo replaces the existing entry instead of duplicating

---

## URL State Architecture

The consuming page is responsible for serialising/restoring all search parameters:

```
URL param               → component
─────────────────────────────────────────────────────────
q                       → LaSearchBar `initialKeyword`
cat + sub               → LaSearchBar `initialScope`
lat/lng/radius/unit     → LocationPicker `value` (in ContextBar)
loc                     → LocationPicker `value.label`
```

On the **landing page**, `LocationPicker` is rendered inline below the search bar; its state (`pickedLocation`) is captured locally and merged into the URL when `handleSearch` fires.

On the **listings page**, `LocationPicker` lives inside `ContextBar` and writes directly to the URL.

---

## Usage

```tsx
// Landing page — scope is not pre-set; keyword empty on load
<LaSearchBar
  size="lg"
  placeholder="ex: Toyota Hybrid Car in Vehicles"
  onSearch={handleSearch}
/>

// Listings page — restore keyword + scope from URL
<LaSearchBar
  initialScope={currentScope}
  initialKeyword={searchParams.get("q") ?? ""}
  placeholder="ex: 3-bed apartment in Canary Wharf"
  onSearch={onSearch}
/>
```

---

## Where it's used

| Location | Context |
|----------|---------|
| `app/page.tsx` | Landing page hero — `size="lg"`, no initial scope/keyword |
| `app/(main)/listings/page.tsx` | Listings page search band — scope + keyword restored from URL |
| `app/design-system/uxcomp/search-bar/page.tsx` | Design system demo — 3 variants with live query output |

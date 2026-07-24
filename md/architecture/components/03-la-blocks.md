# Layer 2 — `components/la-blocks/` Page Sections

> Every product page section component.  
> These are assembled from `la/` primitives + real data.  
> Last updated: 2026-07-07

---

## All Blocks at a Glance

| Component | File | Where used |
|---|---|---|
| `AppHeader` | `AppHeader.tsx` | Root `app/layout.tsx` |
| `AppFooter` | `AppFooter.tsx` | Root `app/layout.tsx` |
| `CategoryGrid` | `CategoryGrid.tsx` | Homepage |
| `FeaturedListings` | `FeaturedListings.tsx` | Homepage + Listing detail |
| `RecentSearches` | `RecentSearches.tsx` | Homepage |
| `LegalDrawer` | `LegalDrawer.tsx` | Footer links |
| `Logo` | `Logo.tsx` | AppHeader + AppFooter + bare layouts |
| `TimelineSheet` | `TimelineSheet.tsx` | About pages, footer |
| `WhatsNext` | `WhatsNext.tsx` | Homepage / About |
| `WhyLokalads` | `WhyLokalads.tsx` | Homepage / About |
| `la-thumbnail-listing` | `la-thumbnail-listing/` | Listings grid, MyAds |
| `la-thumbnail-favourites` | `la-thumbnail-favourites/` | Favourites page |
| `la-relative-date` | `la-relative-date/` | Listing cards, chat threads |
| `la-listing-description` | `la-listing-description/` | Listing detail page |
| `la-empty` | `la-empty.tsx` | Any empty state (no results, no items) |

---

## Layout Shell

### `AppHeader`

Global site header. Lives **only** in root `app/layout.tsx`. Never add to sub-layouts.

```tsx
<AppHeader variant="default" />   {/* full nav */}
<AppHeader variant="simple" />    {/* logo + minimal — login/register pages */}
```

`variant` is driven by middleware signals read in `app/layout.tsx`. The component also self-corrects via `usePathname()` for soft navigation.

**Contains:** Logo, search bar (homepage only), navigation links, `AvatarDropdown`, `CountryBadge`, "Post Ad" CTA.

### `AppFooter`

Global site footer. Lives **only** in root `app/layout.tsx`.

```tsx
<AppFooter variant="default" />
<AppFooter variant="simple" />
```

**Contains:** Logo, site links, legal links (open `LegalDrawer`), social icons, market selector.

### `Logo`

Standalone logo component — used by AppHeader, AppFooter, and bare-layout pages.

```tsx
<Logo size="sm" />    {/* compact — mobile header */}
<Logo size="md" />    {/* standard */}
<Logo size="lg" />    {/* hero / footer */}
<Logo href="/" />     {/* default — links to home */}
<Logo href={false} /> {/* no link — for use in already-linked containers */}
```

---

## Homepage Sections

### `CategoryGrid`

Icon grid of all enabled categories for the active country.

```tsx
<CategoryGrid />
```

- Reads active country from `useCountryConfig()` → `config.enabledCategories`
- Each tile links to `/listings?categoryId=[id]`
- Responsive: 4 cols mobile → 6 cols tablet → 8 cols desktop

### `FeaturedListings`

Horizontal scroll carousel of listing cards. Used on homepage and listing detail page (similar listings).

```tsx
<FeaturedListings
  title="Featured Listings"
  listings={listings}
  href="/listings"
/>
```

### `RecentSearches`

Shows the last 8 searches from `useRecentSearchesStore`. Hidden when store is empty.

```tsx
<RecentSearches />
```

Clicking a row reconstructs the URL and navigates to `/listings?...`. Rows are dismissible.

---

## Listing Display Components

### `la-thumbnail-listing`

Standard listing card used in search results grid and My Ads list.

```tsx
import { LaThumbnailListing } from "@/components/la-blocks/la-thumbnail-listing";

<LaThumbnailListing listing={listing} />
```

Displays: primary image, title, price, location, relative date, status badge.

### `la-thumbnail-favourites`

Variant of the listing card used in the `/favourites` page. Includes remove-from-favourites button.

```tsx
import { LaThumbnailFavourites } from "@/components/la-blocks/la-thumbnail-favourites";

<LaThumbnailFavourites item={favItem} onRemove={() => remove(favItem.id)} />
```

### `la-relative-date`

Formats a unix timestamp as a human-relative string: `"2 hours ago"`, `"Yesterday"`, `"3 Jan 2025"`.

```tsx
import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";

<LaRelativeDate timestamp={listing.publishedAt} />
```

Switches to absolute date after 7 days. Updates on a 60s interval while mounted.

### `la-listing-description`

Rich listing description viewer. Renders the HTML from `RichTextEditor` safely.

```tsx
import { LaListingDescription } from "@/components/la-blocks/la-listing-description";

<LaListingDescription html={listing.description} />
```

### `la-empty`

Reusable empty state. Used across listings grid, favourites, alerts, My Ads.

```tsx
import { LaEmpty } from "@/components/la-blocks/la-empty";

<LaEmpty
  icon={SearchIcon}
  title="No results found"
  message="Try adjusting your filters or search terms."
  action={<LaButton onClick={clearAll}>Clear filters</LaButton>}
/>
```

---

## Utility + Content Blocks

### `LegalDrawer`

Opens a bottom sheet with Terms / Privacy / Cookie policy content.

```tsx
<LegalDrawer trigger={<button>Terms</button>} document="terms" />
```

`document`: `"terms"` | `"privacy"` | `"cookie"`

### `TimelineSheet`

Product history timeline inside a right-slide Sheet. Used in About and footer.

```tsx
<TimelineSheet />
```

Self-contained — has its own trigger button. Data from internal event list.

### `WhatsNext`

"What's coming" feature preview section. Static content.

```tsx
<WhatsNext />
```

### `WhyLokalads`

"Why LokalAds" feature comparison section. Static content.

```tsx
<WhyLokalads />
```

---

## Rules for la-blocks

- Never duplicate `AppHeader` or `AppFooter` in a sub-layout
- All listing card blocks use `listingSnapshot` data — they never fetch independently
- All blocks are Server Component-safe unless they contain `useCountryConfig()` or store calls
- `la-relative-date` uses `setInterval` — mark as `"use client"` if embedding in an RSC tree

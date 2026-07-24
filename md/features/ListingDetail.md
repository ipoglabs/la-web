# Listing Detail Page — Architecture

> **Status:** ✅ UI complete — frozen and ready for API integration.
> **Date:** 2026-06-29

---

## Overview

`app/(main)/listings/[listingId]/page.tsx` is a **server component** that:
1. Reads `listingId` from the route param.
2. Resolves the listing from mock data via `resolveListingContext()`.
3. Renders a two-column layout on desktop, single-column on mobile.
4. Shows a similar listings strip below using `FeaturedListings` (same component as landing page).

---

## File Map

| File | Role | Client? |
|---|---|---|
| `page.tsx` | Root server component — data resolution + layout | Server |
| `ListingDetailNavBand.tsx` | Dark top band: ← Back · Breadcrumb · 🔔 Save Alert | Client |
| `ListingTitleBar.tsx` | Title + location + "Direction" button | Client |
| `ListingGallery.tsx` | Image gallery + price strip + share + favourite | Client |
| `SellerCard.tsx` | Seller identity + contact CTAs (Email / Call) | Client |
| `ListingDetailsTable.tsx` | Key/value spec grid (2-col mobile, 3-col desktop) | Server |
| `ListingUserFacts.tsx` | Good To Know key/value rows (2-col on md+) | Server |
| `ListingMap.tsx` | Google Maps iframe — inline + fullscreen expand | Client |
| `ChitChat.tsx` | Inline messaging thread (mock-only) | Client |
| `ListingReportButton.tsx` | Report flag button — opens `ReportAdPopup` 3-screen journey | Client |
| `SimilarListingsRow` | Inline function in page.tsx — single scroll strip | Server |
| `FeaturedListings` | Horizontal scroll strip (shared with landing page) | Client |

### Dead files (safe to delete)
| File | Why dead |
|---|---|
| `SimilarListingsStrip.tsx` | Replaced by `FeaturedListings` — 2-row multi-scroll removed |
| `ListingActions.tsx` | Share + fav actions absorbed into `ListingGallery.tsx` |

---

## Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  ListingDetailNavBand  (← Back · Breadcrumb · 🔔 Save Alert)        │
├──────────────────────────────────────┬──────────────────────────────┤
│  ListingTitleBar (full width)         │                              │
├──────────────────────────────────────┤                              │
│  LEFT COLUMN (md:col-span-2)          │  RIGHT COLUMN (hidden < md) │
│  ┌──────────────────────────────┐    │  ┌────────────────────────┐  │
│  │ ListingGallery               │    │  │ SellerCard             │  │
│  │ (gallery + price + actions)  │    │  ├────────────────────────┤  │
│  ├──────────────────────────────┤    │  │ ChitChat               │  │
│  │ SellerCard (mobile only)     │    │  ├────────────────────────┤  │
│  ├──────────────────────────────┤    │  │ ListingMap             │  │
│  │ LaListingDescription         │    │  └────────────────────────┘  │
│  ├──────────────────────────────┤    │                              │
│  │ ListingDetailsTable          │    │                              │
│  ├──────────────────────────────┤    │                              │
│  │ ListingUserFacts             │    │                              │
│  ├──────────────────────────────┤    │                              │
│  │ ListingMap (mobile only)     │    │                              │
│  ├──────────────────────────────┤    │                              │
│  │ Disclaimer                   │    │                              │
│  ├──────────────────────────────┤    │                              │
│  │ Ad ID + ListingReportButton  │    │                              │
│  │ ChitChat (mobile only)       │    │                              │
│  └──────────────────────────────┘    │                              │
├──────────────────────────────────────┴──────────────────────────────┤
│  FeaturedListings  "More in [Subcategory]"  →  See all              │
│  ← horizontal scroll strip (same component as landing page) ─────→  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Listing Status

`ListingStatus` (defined in `types/listing.ts`) has **10 values** covering the full ad lifecycle.
See `types/listing.ts` for the complete state machine, visibility matrix and per-value comments.

| Status | Badge label | Colour | Who sets it | Visible publicly? |
|---|---|---|---|---|
| `active` | *(none)* | — | Seller / system | ✓ |
| `draft` | Draft | Slate | Seller | ✗ |
| `pending` | Pending | Blue | System | ✗ |
| `off-market` | Off Market | Dark grey | Seller | ✗ |
| `expired` | Expired | Slate | System (auto TTL) | ✗ |
| `closed` | Closed | Rose | Seller | Detail page only |
| `under-review` | Under Review | Amber | System (via report) | ✓ with badge |
| `rejected` | Rejected | Red | Moderator | ✗ |
| `blocked` | Blocked | Dark red | Admin | ✗ |
| `deleted` | Deleted | Near-black | Admin / Seller | ✗ |

**Where the badge renders:**
- `LaThumbnailListingCard` — top-left overlay on the thumbnail image (auto for any non-active status)
- `LaImageGallery` via `badge` + `badgeVariant` props — wired in `ListingGallery.tsx` (see TODO)
- Title bar — not yet shown; could add a small pill next to `<h1>` for `closed`/`under-review`

---

## FeaturedListings Scroll Strip

`FeaturedListings` is shared with the landing page. On the detail page, `SimilarListingsRow` renders it **outside** the `container-app` wrapper so the component can apply its own padding without double-nesting.

**Mouse drag-to-scroll** is handled inside `FeaturedListings` via pointer events (`onPointerDown/Move/Up/Leave`) and a `dragDistance` ref that swallows `onClick` on cards when drag distance > 5px — so actual card clicks still work.

---



```
URL param: /listings/[listingId]
        │
        ▼
resolveListingContext(listingId)        ← lib/mock/country-map.ts
        │  returns { listing, cat, sub, market }
        │  searches every market's COUNTRY_OVERRIDES first, then
        │  falls back to the generic CATEGORY_MAP (lib/mock/listing-map.ts)
        ▼
Destructure listing fields
Build favItem shape for favourites store
        │
        ├── Pass to all child sections
        │
        └── SimilarListingsRow (market passed through so results never mix markets)
               │
               ▼
         getSimilarListings(cat, sub, excludeId, market, 12)
               │
               ▼
         <FeaturedListings items={items} ... />
```

---

## Data Flow (target — real API)

```
URL param: /listings/[listingId]
        │
        ▼
fetch(`/api/v1/listings/${listingId}?country=${countryIso}`)
        │  countryIso from cookies() → COUNTRY_COOKIE (same as layout.tsx)
        │  returns ListingDetail (full schema)
        ▼
Render all sections from API data
        │
        └── SimilarListingsRow
               │
               ▼
         fetch(`/api/v1/listings/similar?cat=${cat}&sub=${sub}&exclude=${id}&country=${countryIso}&limit=12`)
               │
               ▼
         <FeaturedListings items={items} ... />
```

---

## Country Scoping

**[Updated 2026-07-11]** The detail page no longer reads the country cookie directly.
`resolveListingContext(listingId)` (in `lib/mock/country-map.ts`) resolves which
market a listing belongs to *from the listing itself* (ids are country-prefixed,
e.g. `prop-in-room-01` / `prop-sg-room-01`; UK/generic carries no prefix) and
returns it as `market`. This is deliberately more robust than a cookie read —
a bookmarked/shared listing URL always resolves to the correct market even if
the visitor's active browsing-country cookie differs from the listing's origin.

`market` is passed straight through to `getSimilarListings()` so related items
never mix currencies/markets. When the real API lands, the equivalent contract
is: `GET /api/v1/listings/{id}` must return the listing's own market/country on
the payload — do not rely on the requester's cookie for this.

Client subcomponents that need the *active browsing* country (e.g. ChitChat) use `useCountryConfig()` hook.

---

## Known TODOs (for API integration sprint)

All marked with `// TODO [INTEGRATION]` in source:

| File | TODO |
|---|---|
| `page.tsx` | Read `countryIso` from cookies and pass to all API calls |
| `page.tsx` (SimilarListingsRow) | Replace `getSimilarListings()` with `fetch(/api/v1/listings/similar?country=...)` |
| `ListingGallery.tsx` | Derive `badge` + `badgeVariant` from API `status` field (e.g. `closed` → `badge="Closed"`, `badgeVariant="rose"`) |
| `ListingGallery.tsx` | Also derive promotional badges: `"Featured"`, `"Price Drop"`, `"New"` from API data |
| `ListingMap.tsx` | Replace bare Google Maps embed with Maps Embed API key (place mode) for richer pin |
| `SellerCard.tsx` (onEmail) | Open email compose modal → POST `/api/contact/{seller.id}` |
| `SellerCard.tsx` (onCall) | Auth-gated GET `/api/sellers/{seller.id}/phone` → reveal number in modal |
| `ChitChat.tsx` | Replace mock messages with `fetch(/api/chat/{listingId})` |
| `ChitChat.tsx` | POST `/api/chat/{listingId}` on send; auto-scroll to latest message |
| `ChitChat.tsx` | Add `listingId` + `currentUserId` props |
| `ListingReportButton.tsx` | ~~`target` prop~~ ✅ already wired (`adId`, `title`, `thumbnail`, `sellerName`, `location` passed from `page.tsx`) |
| `ListingReportButton.tsx` | Wire `onSubmit` → POST `/api/reports`; return `{ ticketId, status, createdAt }` |
| `ListingReportButton.tsx` | Guard behind auth — check session before opening popup; redirect to `/login` if not signed in |
| `page.tsx` (description) | Sanitise description HTML server-side before rendering in `LaListingDescription` |
| `page.tsx` | Read `countryIso` from cookies and pass to all API calls |

---

## Summary

| Concern | Decision |
|---|---|
| Page type | Server component — resolves data at request time, no client state |
| Similar listings strip | `FeaturedListings` — same component as landing page, single row |
| Fav / share | Embedded in `ListingGallery` — no separate ListingActions component |
| Mobile vs desktop | Two-column grid on `md+`; single column on mobile with `md:hidden` guards |
| Map | Google Maps iframe (no API key required for basic embed) |
| Country | Read from `COUNTRY_COOKIE` cookie at page level; pass to all API calls |
| Dead files | `SimilarListingsStrip.tsx`, `ListingActions.tsx` — safe to delete |

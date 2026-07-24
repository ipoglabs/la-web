# Journey: Search & Find

> Buyer searches, filters, and browses listings.  
> Core product loop — URL is the single source of truth for all filter state.  
> Last updated: 2026-07-07

---

## Entry Points

- `/` homepage → LaSearchBar → submit
- `/` → CategoryGrid → category card click
- `/listings?countryCode=in&categoryId=property&...` — direct URL
- "Save as Alert" → creates saved_alert, surfaces matched listings via notification

---

## Sequence — Keyword Search from Homepage

```
Buyer                      Client                        Server
  │                           │                             │
  │── types in LaSearchBar ──►│                             │
  │   (keyword + optional     │                             │
  │    location)              │                             │
  │                           │                             │
  │── hits Search ───────────►│                             │
  │                           │── router.push(             │
  │                           │   /listings?               │
  │                           │   countryCode=in&           │
  │                           │   q=honda+city&             │
  │                           │   lat=12.93&lng=77.62)      │
  │                           │                             │
  │                           │── GET /api/listings ───────►│
  │                           │   ?countryCode=in           │
  │                           │   &q=honda+city             │
  │                           │   &lat=12.93&lng=77.62      │
  │                           │                             │
  │                           │   Server:                   │
  │                           │   ├─ Atlas Search ($search) │
  │                           │   │   index: listings_search│
  │                           │   │   fuzzy maxEdits: 1     │
  │                           │   ├─ $match countryCode +   │
  │                           │   │   status: active        │
  │                           │   ├─ $near geo sort if      │
  │                           │   │   lat/lng present       │
  │                           │   └─ paginate skip/limit    │
  │                           │                             │
  │                           │◄── { items[], total,       │
  │                           │     page, hasMore } ────────│
  │◄── ListingGrid renders ───│                             │
```

---

## Sequence — Category Browse + Filter

```
Buyer                      Client (URL-driven)           Server
  │                           │                             │
  │── clicks category card ──►│── router.push(             │
  │                           │   /listings?               │
  │                           │   categoryId=property)      │
  │                           │                             │
  │── opens filter panel ────►│                             │
  │   (desktop: inline left   │                             │
  │    mobile: bottom sheet)  │                             │
  │                           │                             │
  │── selects filters ───────►│ (draft state — not in URL) │
  │   beds=2, price max=3000  │                             │
  │                           │                             │
  │── clicks Apply ──────────►│── router.push(             │
  │                           │   /listings?               │
  │                           │   categoryId=property&      │
  │                           │   subcategoryId=to_rent&    │
  │                           │   beds=2&maxPrice=3000&     │
  │                           │   sortBy=price_asc)         │
  │                           │                             │
  │                           │── GET /api/listings ───────►│
  │                           │◄── { items[], total } ──────│
  │◄── results + active chips─│                             │
  │                           │                             │
  │── changes page ──────────►│── router.push(?...&page=2) │
  │◄── next page results ─────│                             │
  │                           │                             │
  │── clicks listing card ───►│── router.push(             │
  │                           │   /listings/[slug])         │
```

---

## URL as State — Rules

| URL param | Maps to | Notes |
|---|---|---|
| `countryCode` | Active market | Always present — derived from cookie if missing |
| `categoryId` | Category filter | Optional |
| `subcategoryId` | Subcategory filter | Optional |
| `q` | Keyword (Atlas Search) | Optional |
| `lat` + `lng` | Geo centre | Both required together |
| `radius` | Search radius | km or mi — from country config |
| `minPrice` / `maxPrice` | Price range | Optional |
| `sortBy` | Sort order | `recent` \| `price_asc` \| `price_desc` \| `nearest` |
| `page` | Pagination | Default 1 |

Filters are **draft** in local state until "Apply" is clicked. Apply merges draft into URL. Chip "×" removes individual params from URL. "Clear all" strips all filter params.

---

## Save as Alert Flow

```
Buyer                      Client                        Server
  │                           │                             │
  │── clicks "Save Alert" ───►│                             │
  │   (search results page    │── getSession() ────────────►│
  │    or detail nav band)    │◄── session / null ──────────│
  │                           │                             │
  │                    [if not logged in → /login]          │
  │                           │                             │
  │◄── CreateAlert modal ─────│                             │
  │   pre-filled with current │                             │
  │   URL params              │                             │
  │                           │                             │
  │── confirms + submits ────►│── POST /api/alerts ────────►│
  │                           │   { countryCode, categoryId,│
  │                           │     keywords[], location,   │
  │                           │     notify: { email } }     │
  │                           │◄── 201 { id } ──────────────│
  │◄── "Alert saved" toast ───│                             │
```

---

## Key Rules

- URL is the single source of truth — browser back/forward works correctly
- Filters use **draft pattern** — URL only updates on Apply, not on every checkbox tick
- `LaFilterChipStrip` renders active filters from URL params — not from component state
- `useListingFilters` drives filter config per category
- `useListingSearch` fetches results — debounced on URL change
- Geo filter requires both `lat` + `lng` — partial geo params are ignored

---

## Alert Matching — Background Job

Triggers **inline** after `POST /api/listings` succeeds (V1 — synchronous).

```
POST /api/listings 201           Server                       DB
  │── listing created ─────────►│── query saved_alerts ──────►│
  │                             │   {                          │
  │                             │     active: true,           │
  │                             │     countryCode: match,     │
  │                             │     categoryId: match       │
  │                             │   }                          │
  │                             │◄── alerts[] ────────────────│
  │                             │                             │
  │                             │   for each alert:           │
  │                             │   ├─ keyword check:         │
  │                             │   │   any alert.keyword     │
  │                             │   │   in listing.title?     │
  │                             │   ├─ insert notification ───►│
  │                             │   │   type: "alert_match"   │
  │                             │   │   userId + listingId    │
  │                             │   └─ if notify.email:true   │
  │                             │       sendAlertEmail() ─────►│ Resend/SES
```

- V1: synchronous, inline with POST — acceptable at low volume
- V2 upgrade path: offload to job queue (BullMQ / Inngest) when volume grows
- Keyword match: case-insensitive, any alert keyword present in listing `title`

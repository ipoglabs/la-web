# State — Server State

> How data from the API reaches the UI. No Zustand for server data.  
> Last updated: 2026-07-07

---

## Core Rule

> **Server data is never stored in Zustand.** Fetch it where you need it.  
> Zustand is for client-owned state (favourites, recent searches, flow state).  
> Server data lives in the component that owns it.

---

## Fetch Patterns by Context

### Server Component (App Router — preferred)

Use for data that must be in the initial HTML — SEO-critical or above the fold.

```ts
// app/(main)/listings/[listingId]/page.tsx
export default async function ListingDetailPage({ params }) {
  const listing = await Listing.findOne({ slug: params.listingId }).lean();
  if (!listing) notFound();
  return <ListingDetailView listing={listing} />;
}
```

- Runs on the server — no loading state, no skeleton for initial render
- Data is never exposed to the client bundle
- Re-fetched on every hard navigation (Next.js caches by default — opt out with `cache: 'no-store'` if needed)

### Client Component with `useEffect`

Use for data that depends on client context (session, country cookie) or loads after hydration.

```ts
"use client";
export function FavouritesIndicator({ listingId }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    fetch(`/api/favourites/${listingId}`)
      .then(r => r.json())
      .then(d => setIsFav(d.isFavourited));
  }, [listingId]);

  return <HeartIcon filled={isFav} />;
}
```

### Via custom hook (encapsulated)

`useListingSearch` encapsulates all fetch logic for the listings page — URL params → API call → result state. See `04-hooks.md`.

---

## Caching Strategy

LokalAds V1 uses **Next.js default fetch caching** with targeted opt-outs.

| Route type | Cache behaviour | Rationale |
|---|---|---|
| Listing detail page | `cache: 'no-store'` | View count, status, price change — must be fresh |
| Listings search (`/listings`) | No cache (client fetch via hook) | URL-driven, always live |
| Homepage sections | Default (ISR when static) | Category grid + featured listings change infrequently |
| User profile | `cache: 'no-store'` | Live name, avatar, review count |
| API routes (`/api/*`) | No cache — dynamic by definition | Always `Response` without cache headers |

### Pagination cache (in-memory, client side)

`useListingSearch` maintains a `useRef<Map<page, ListingPage>>` cache:

```
User on page 3
  → pages 1–6 pre-fetched and cached in memory
  → navigate to page 4 → instant, no skeleton
  → change filter → Map cleared → fresh fetch from page 1
```

This cache exists **only for the life of the component mount** — it does not survive a full page navigation.

---

## Revalidation Triggers

| Action | How data re-fetches |
|---|---|
| User posts a new listing | Redirect to `/listings/[slug]` → fresh Server Component render |
| User edits their listing | Same redirect |
| User edits profile | `PUT /api/users/me` → `router.refresh()` → Server Components re-render |
| Country switch | `router.refresh()` after cookie write → all Server Components re-run with new country |
| Filter / sort / page change | URL push → `useListingSearch` re-runs fetch (URL is the trigger) |
| Listing expired (background job) | Next hard navigation fetches fresh data — no push mechanism in V1 |

---

## What NOT to do

```ts
// ❌ WRONG — caching API response in Zustand
const useListingsStore = create((set) => ({
  listings: [],
  fetch: async () => {
    const data = await fetch('/api/listings');
    set({ listings: data });
  }
}));

// ✅ RIGHT — fetch directly, state lives where it's used
const [listings, setListings] = useState([]);
useEffect(() => {
  fetch('/api/listings').then(r => r.json()).then(d => setListings(d.items));
}, []);
```

Zustand-as-API-cache leads to stale data, difficult invalidation, and unnecessary complexity. Use SWR or React Query if you need a proper server-state cache (V2 upgrade path).

---

## V2 Upgrade Path — SWR / React Query

When these signals appear, add SWR or React Query:

| Signal | What it means |
|---|---|
| Multiple components fetch the same endpoint independently | Need deduplication |
| Data goes stale while user is on the page | Need background revalidation |
| Optimistic UI needed (like/fav without spinner) | Need mutation + rollback |
| Real-time-ish inbox unread count | Need polling or revalidate-on-focus |

V1 direct `fetch` is fine at LokalAds' launch scale. Do not add SWR/RQ prematurely.

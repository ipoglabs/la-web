# State Management — Principles

> The decision rule for every piece of state in LokalAds.  
> Last updated: 2026-07-07

---

## The One Rule

> **If state must survive a page navigation → don't use `useState`.**

Everything else follows from that.

---

## Decision Tree

```
New state needed?
  │
  ├─ Only used within a single component (toggle, hover, form field)?
  │   └─► useState — keep it local, no ceremony
  │
  ├─ Shared between sibling components on the same page?
  │   └─► useState lifted to parent — or Context if prop-drilling gets ugly
  │
  ├─ Persists across pages / survives navigation?
  │   │
  │   ├─ Needs to survive browser refresh (localStorage)?
  │   │   └─► Zustand store + persist middleware
  │   │
  │   └─ Only needs to survive the session (in-memory)?
  │       └─► Zustand store (no persist)
  │
  ├─ Comes from the server (listings, user profile, alerts...)?
  │   └─► Fetch from API route in a Server Component or useEffect
  │       No Zustand for server data — don't cache the API response in a store
  │
  └─ Derived from multiple stores or URL params?
      └─► Custom hook — computes on-read, no store needed
```

---

## Store vs Hook Boundary

| Lives in | Use when |
|---|---|
| `lib/stores/` | State that multiple components write to AND read from, across pages |
| `lib/hooks/` | Read-only derived state, URL-backed state, or single-consumer async logic |
| Component `useState` | UI-only ephemeral state — open/close, hover, form field before submit |

### The anti-patterns to avoid

| Anti-pattern | What to do instead |
|---|---|
| Storing API response in Zustand | Fetch directly in Server Component or `useEffect` + local `useState` |
| Using `useState` for user's favourites list | `useFavouritesStore` — it must survive navigation |
| Putting URL filter state in Zustand | `useListingFilters` hook — URL IS the store |
| Reading a Zustand store in a Server Component | Impossible — stores are client-only. Fetch from DB/API directly |

---

## Where Each Concern Lives

| Concern | Solution | File |
|---|---|---|
| Active browsing country | `CountryProvider` + `useCountry()` | `components/country/CountryProvider.tsx` |
| Country config (currency, labels) | `useCountryConfig()` hook | `lib/hooks/useCountryConfig.ts` |
| Saved listings (favourites) | Zustand + localStorage persist | `lib/stores/favouritesStore.ts` |
| Recent searches | Zustand + localStorage persist | `lib/stores/recentSearchesStore.ts` |
| Listing filter state | URL params via `useListingFilters` | `lib/hooks/useListingFilters.ts` |
| Listing search results | `useListingSearch` hook + API | `lib/hooks/useListingSearch.ts` |
| Delete account flow | Zustand (no persist — session only) | `lib/stores/deleteAccountStore.ts` |
| Donation flow | Zustand (no persist — session only) | `lib/stores/donationStore.ts` |
| Auth session | HttpOnly cookie (server-managed) | `lib/session.ts` |
| Country gate cookies | `lib/country-context.ts` constants | See below |
| Responsive layout breakpoints | `useMediaQuery` hook | `lib/hooks/useMediaQuery.ts` |
| OTP resend countdown | `useResendTimer` hook | `lib/hooks/useResendTimer.ts` |

### Country gate — three cookies

The country system uses three cookies, all defined in `lib/country-context.ts`:

| Cookie | Constant | Purpose |
|---|---|---|
| `countryContext` | `COUNTRY_COOKIE` | Active market — set after detection or user selection |
| `countryPending` | `PENDING_COOKIE` | Detection in flight — prevents race conditions (5 min TTL) |
| `countryBlocked` | `BLOCKED_COOKIE` | User's IP is in a non-supported country |

**Seeding path:** cookie (read by middleware) → Server Component reads header → passed as prop to `CountryProvider` → `useCountry()` → `useCountryConfig()` hook.

### Auth session — `getSession()` is a stub

> ⚠️ **`lib/session.ts` currently returns `null` unconditionally.** Auth is not yet wired.

```ts
export async function getSession(): Promise<AuthUser | null> {
  return null; // TODO: Wire up real auth (NextAuth, Lucia, better-auth, etc.)
}
```

Every auth-gated feature, every `session.userId` check, and every "redirect to login" flow depends on this. Before any protected route is testable, wire `getSession()` to a real auth provider.

### Logout cleanup checklist

On logout, clean up client state in this order:

```ts
// 1. Clear server session
await fetch('/api/auth/logout', { method: 'POST' });

// 2. Clear persisted stores
useFavouritesStore.getState().clear();
useRecentSearchesStore.getState().clear();

// 3. Clear localStorage keys directly (belt + braces)
localStorage.removeItem('la-favourites');
localStorage.removeItem('la:recent-searches');

// 4. router.push('/') or router.push('/login')
```

In-memory stores (`deleteAccountStore`, `donationStore`) reset automatically on page navigation — no cleanup needed.

---

## localStorage Persistence Rules

Only two stores persist to localStorage:

| Store | Key | Why persisted |
|---|---|---|
| `useFavouritesStore` | `la-favourites` | Favourites should survive refresh + work before login |
| `useRecentSearchesStore` | `la:recent-searches` | Search history UX — useless if lost on every page load |

All other stores are **in-memory only** — they reset on page refresh by design.

### Hydration safety

Both persisted stores use `skipHydration: true`. This means:

```
Server renders component → store state is empty (avoids SSR mismatch)
Client hydrates         → developer must call rehydrate() explicitly
```

**`skipHydration: true` disables automatic rehydration.** The persist middleware will NOT restore localStorage data on its own. You must call it manually after mount:

```ts
useEffect(() => {
  useFavouritesStore.persist.rehydrate();
  useRecentSearchesStore.persist.rehydrate();
}, []);
```

This is typically called once in a top-level client component (e.g. the app shell or a `<StoreHydrator />` component). Forgetting this = store always starts empty despite data being in localStorage.

Never read persisted store values in a Server Component or during SSR.

---

## Sync-on-Login Pattern

Favourites are tracked locally before the user logs in.  
On login, server favourites are merged with local ones — server wins on conflict.

```
User logs in
  │── GET /api/favourites ──────────────────────────────────────► API
  │◄── serverItems[] ─────────────────────────────────────────────│
  │── useFavouritesStore.getState().syncFromServer(serverItems)
  │   server items prepended
  │   local-only items (not on server) appended after
  │   deduped by id
```

`syncFromServer()` is called once at session start — not on every navigation.

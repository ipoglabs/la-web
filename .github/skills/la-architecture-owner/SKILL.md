---
name: la-architecture-owner
description: "Use when making architecture-level decisions in LokalAds poc-next: adding routes, changing middleware, modifying the layout signal system, creating API routes, planning state, or assessing technical debt. Enforces STOP rules before any code is written."
argument-hint: "Describe the architectural change or decision (e.g. 'Add new route group', 'Change middleware flow', 'New API endpoint')"
---

# LokalAds — Architecture Owner Guide

> For: Gopi (Owner) + AI (Copilot) working together on structural decisions.
> This skill is also readable as a human onboarding doc for any senior dev joining the team.

---

## When to Use This Skill

Invoke when:
- Adding a new route, route group, or layout
- Changing `src/proxy.ts` execution order or logic (renamed from `middleware.ts` 2026-07-13 — Next.js 16 deprecated the `middleware` convention; exported function is `proxy`)
- Adding or modifying the layout signal system (bare/simple layout)
- Creating a new `app/api/` route handler
- Adding a new Zustand store or shared hook
- Touching `src/app/layout.tsx`
- Making any change that affects more than one layer (app + lib + components)
- Assessing or resolving tech debt

---

## The Mental Model — 3 Boundaries

Every architectural decision in this codebase crosses one of these boundaries:

```
┌─────────────────────────────────────────┐
│  BROWSER (client components, stores)    │
├─────────────────────────────────────────┤
│  EDGE (proxy.ts — runs on every        │
│  request before React)                  │
├─────────────────────────────────────────┤
│  NODE SERVER (API routes, Server        │
│  Components, instrumentation, DB)       │
└─────────────────────────────────────────┘
```

**Rule:** Know which boundary you are crossing. Never mix them.
- Middleware = Edge only — no Node APIs, no Mongoose, no `fs`
- Server Components = Node — can read DB, read headers, never `useState`
- Client Components = Browser — can use hooks, stores, event listeners

---

## Middleware Execution Order — NEVER reorder without full review

```
1. Static bypass      →  /_next, /api, files with "."  →  pass through
2. Strip header       →  delete x-bare-layout           →  security
3. UA quick-block     →  IE (Trident/) + EdgeHTML        →  302 /unsupported
4. Basic Auth         →  /design-system, /snippets       →  401 if wrong creds
5. Bare layout        →  /unsupported, /design-system    →  set x-bare-layout:1
6. Simple layout      →  /login, /register/*, /signup    →  set x-simple-layout:1
7. Country gate       →  all other user-facing routes    →  cookie/CF/pending
```

**Adding a new route to middleware:**
1. Decide which step it belongs in — if it doesn't fit any step clearly, it needs its own step
2. Add it to both `BARE_LAYOUT_ROUTES` or `SIMPLE_LAYOUT_ROUTES` array as appropriate
3. Update the Route Behaviour Matrix in `copilot-instructions.md`
4. Test: hard nav AND soft nav (`<Link>`) — middleware only runs on hard nav

---

## Layout Signal System — The One Hard Rule

**One AppHeader. One AppFooter. Both live in `src/app/layout.tsx`. Nowhere else.**

Signals flow: `proxy.ts` → request headers → `app/layout.tsx` → header/footer variant

| Signal | Set by | Root layout does |
|---|---|---|
| `x-bare-layout: 1` | Middleware | Renders NO header, NO footer |
| `x-simple-layout: 1` | Middleware | Passes `variant="simple"` to both |
| *(none)* | Default | Passes `variant="default"` to both |

**STOP: Never create a sub `layout.tsx` that adds its own AppHeader or AppFooter.**

If you need a new layout variant:
1. Add route pattern to `proxy.ts`
2. Add header read + conditional in `app/layout.tsx`
3. That's it — no sub-layouts

**Why:** Next.js soft navigation (`<Link>`) does NOT re-run server layouts. Server flags are frozen after first load. Any layout logic that must update on navigation must live in a client component using `usePathname()`.

---

## API Route Conventions

Every `app/api/` route must follow these rules — non-negotiable:

```
1. Never call external APIs directly from a page or component
   → All external calls go through app/api/ proxy routes

2. Auth guards — check session/token FIRST, before any DB or logic
   → Return 401 immediately if not authenticated

3. Input validation — validate ALL user input at the API boundary
   → Never trust req.body shape

4. Error responses — always return structured JSON:
   { error: "message" } with appropriate HTTP status

5. Rate limiting — add for any public-facing or auth endpoint
   → See md/architecture/api/05-rate-limiting.md

6. Mongoose — always call dbConnect() at the top of the handler
   → Never access models without it
```

For the full API contract see:
- `md/architecture/api/01-conventions.md`
- `md/architecture/api/03-response-shapes.md`

---

## State Architecture Decision Tree

When you need state, use this decision tree — in order:

```
Is it local UI state (toggle, hover, open/closed)?
  → useState in the component. Done.

Does it need to persist across page navigations?
  → Zustand store in src/lib/stores/

Does it involve async data fetching?
  → Is it user-specific? → Server Component + cookies/headers
  → Is it shared/global? → API route + Zustand store

Is it reusable stateful logic (not UI)?
  → Custom hook in src/lib/hooks/
```

**Never use useState for data that crosses page boundaries.**
**Never create a new store without checking if an existing store can be extended.**

Existing stores: `favouritesStore` · `donationStore` · `recentSearchesStore` · `deleteAccountStore`

---

## Route Addition Checklist

Before adding any new route:

- [ ] Which route group does it belong in? `(main)` / `(about)` / `(resources)` / `(dashboard)` / `(auth)` / `(common)`
- [ ] Does it need country gate? (yes for all user-facing, no for /design-system, /snippets)
- [ ] Does it need Basic Auth? (yes for /design-system, /snippets only)
- [ ] Does it need bare/simple layout? → add to middleware if yes
- [ ] Does it need an API route? → create in `app/api/` before building the page
- [ ] Update Route Map in `copilot-instructions.md` — date-stamp it
- [ ] Update `md/context.md` Section 5

---

## STOP Rules — Architecture Owner Enforces These

These require explicit owner confirmation before any code:

| Situation | Action |
|---|---|
| Need a UI element not in `la/` | STOP → tell owner → confirm → build in `la/` → demo page → then use |
| New reusable component (2+ pages) | STOP → confirm → build in `components/` → demo → then use |
| New `layout.tsx` | STOP → re-read this skill → use middleware signal pattern instead |
| External API call from a page | STOP → create `app/api/` proxy first |
| New env var | STOP → add to `.env.local` + document in `copilot-instructions.md` Env Vars + `md/context.md` §9 |

---

## Data Fetching Strategy

This is the decision that determines performance and cacheability of every page.

### Where data comes from — use this decision tree
```
Is it page-level data for a Server Component (listing, category, user profile)?
  → Query Mongoose directly in the Server Component (NOT via /api/ fetch)
  → src/lib/db.ts + Mongoose model, called in the page's async Server Component

Is it client-side data (user triggered, post-navigation, infinite scroll)?
  → fetch() to an /api/ route from a Client Component

Is it a write (create, update, delete)?
  → Always via /api/ route — never Server Actions
  → Auth guard, rate limit, and validation live in the API route

Is it data from a third-party API?
  → Always via /api/ proxy route — never fetch() from a Client Component directly
```

### Server Component direct DB pattern
```typescript
// src/app/(main)/listings/[listingId]/page.tsx
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import { Listing } from "@/lib/models/listing";

export default async function ListingDetailPage({ params }: Props) {
  const { listingId } = await params;
  await dbConnect();

  const listing = await Listing.findById(listingId)
    .select("title slug description price images sellerSnapshot status")
    .lean();

  if (!listing || listing.status === "deleted") {
    notFound();  // renders the nearest not-found.tsx
  }

  return <ListingDetail listing={listing} />;
}
```

### Caching and revalidation
```typescript
// Static page — revalidate every hour (good for category/about pages)
export const revalidate = 3600;

// Dynamic page — always fresh (user-specific pages)
export const dynamic = "force-dynamic";

// Listing detail pages — static generation with on-demand revalidation
export async function generateStaticParams() {
  await dbConnect();
  const listings = await Listing.find({ status: "active" })
    .select("_id").lean();
  return listings.map(l => ({ listingId: l._id.toString() }));
}
export const revalidate = 300;  // 5 min — re-check after each revalidation period
```

### Rules
- **Server Components → Mongoose direct** — no extra HTTP round-trip, runs on the server already
- **Client Components → `/api/` route** — never import Mongoose in a client component
- **Writes → always `/api/`** — auth, rate limiting, and validation must run server-side
- **`notFound()`** from `next/navigation` — use this, not `redirect()`, when a resource doesn't exist
- **`dynamic = "force-dynamic"`** — use for any page reading session/cookies (profile, dashboard)
- Always `.lean()` + `.select()` even in Server Components — same rules as API routes

---

## Tech Debt Register

Known debt lives in `md/context.md` Section 12.
When resolving debt: update that section and say **"Update tech debt"** to Copilot.
When discovering new debt: add it immediately — never silently accept it.

---

## Sync Rule — After Any Architecture Change

| Changed | Update |
|---|---|
| New/changed route | `copilot-instructions.md` Route Map + `md/context.md` §5 |
| New middleware pattern | `copilot-instructions.md` Architecture section |
| New env var | `copilot-instructions.md` Env Vars + `md/context.md` §9 |
| New store or hook | `copilot-instructions.md` Data Layer section |
| Architecture decision | `md/context.md` §3 |

---

## How This Skill Evolves — Self-Update Protocol

> **This file is a living document. Copilot updates it automatically — no instruction from the owner needed.**

### Triggers — update this file when any of these happen
- A new architectural pattern or convention is established during a coding session
- An existing rule is found to be wrong, incomplete, or superseded by real-world usage
- A new route group, middleware pattern, or layout variant is added to the codebase
- A STOP rule triggers and the outcome reveals a gap in this document
- A state decision is made that sets a precedent for future features
- The owner confirms an architectural direction that wasn't previously documented
- Tech debt is added to or resolved from `md/context.md` Section 12
- A data fetching or caching pattern is used in practice and refined

### How to update
1. Edit the relevant section directly — keep it concise
2. Replace outdated patterns — never leave contradictions
3. Add a `> Updated: YYYY-MM-DD — [what changed and why]` note at the top of the changed section
4. Also update `copilot-instructions.md` and `md/context.md` per the Sync Rule table above

### What NOT to add
- Unconfirmed decisions — mark as `[PROPOSED]` if uncertain, confirm before merging into rules
- One-off patterns that don't generalise — if it happened once, it's not a convention yet
- Anything the owner has explicitly said NOT to do

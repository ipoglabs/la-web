# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**LokalAds** (`poc-next`) — a classifieds marketplace (Craigslist/OLX-style). This repo is simultaneously the real product scaffold and a UX playground for POC snippets and a living design system. Active markets: India (IN), United Kingdom (GB), Singapore (SG).

A much deeper, actively-maintained brief lives in `.github/copilot-instructions.md` (synced from `md/context.md`) — read it for anything not covered below. Domain-specific rules also live in `.github/instructions/*.instructions.md` (auto-applies by glob: API routes, email engine, component styling, feature specs) and `.github/skills/la-*` (feature discovery ritual, architecture, MongoDB, auth, SEO, UX design).

## Commands

```bash
npm run dev     # localhost:3000
npm run build   # type-check + production build (this is the real type-check step — no separate `tsc`)
npm run lint    # ESLint (eslint-config-next core-web-vitals + typescript)
```

There is no configured test runner (no `test` script, no jest/vitest config), despite one `__tests__` directory existing under `src/components/la/`.

## Architecture

### Middleware (`src/proxy.ts`, not `middleware.ts`)

Next.js 16 renamed `middleware.ts` → `proxy.ts` (exported function is `proxy`, not `middleware`) — this project already migrated. Execution order for every request:

1. Bypass `/_next`, `/api`, any path containing `.` (static files)
2. Strip any client-supplied `x-bare-layout` header (prevents spoofing the app shell away)
3. UA quick-block: IE (`Trident/`) and legacy EdgeHTML → redirect `/unsupported`
4. Basic Auth on `/design-system/*` and `/snippets/*` (fails closed if `BASIC_AUTH_USER`/`BASIC_AUTH_PASS` unset)
5. Bare-layout routes (`/unsupported`, `/design-system`, `/snippets`) → set `x-bare-layout: 1`
6. Simple-layout routes (`/login`, `/register/*`, `/signup`) → set `x-simple-layout: 1`
7. Country gate for everything else — cookie → `MOCK_COUNTRY` env → `cf-ipcountry` (or `COUNTRY_HEADER`) → pending flag for client-side `ipinfo.io` detection

Country-prefixed URLs (`/in/`, `/gb/`, `/sg/`) always win over the cookie and sync it. `/listings` bare URLs 301-redirect to their country-prefixed twin once a country is resolved.

### Layout signal system — hard rule

The root `src/app/layout.tsx` owns the **only** `AppHeader`/`AppFooter`. Never add a nested `layout.tsx` that renders its own header/footer — signal it via a `proxy.ts` request header instead (`x-bare-layout`, `x-simple-layout`), read by the root layout.

Server-read flags are frozen after first paint — Next `<Link>` soft navigation does not re-run server layouts. Anything that must change on client-side navigation (not just `variant` props that self-correct via `usePathname`) belongs in a client component reading `usePathname()`, never a server layout flag.

### Country gate & Browser Guard

- Country gate: cookie present → `CountryProvider` wraps children. No cookie → `CountryDetector` (`ipinfo.io`, 5s timeout) sets cookie + `router.refresh()`. Detection failure/unsupported country → blocking `OverlayCountrySelect` (no dismiss without a selection).
- Browser Guard, 3 layers: (1) `proxy.ts` UA string block for IE/EdgeHTML, (2) client `BrowserGuard` CSS `@supports` feature detection → hard redirect to `/unsupported`, (3) `/unsupported` itself is zero-Tailwind, 100% inline styles, so it renders on any browser.

### Component layers (`src/components/`)

Three strict layers, each importing only from the layer below:

1. **`components/la/`** — LokalAds design-system primitives (`LaButton`, `LaField`, `LaInput`, `LaSelect`, `LaChip`, etc). Prefer these for all product UI. Built on Layer 3.
2. **`components/la-blocks/`** — product page sections (`AppHeader`, `AppFooter`, `CategoryGrid`, `FeaturedListings`, listing thumbnails/cards).
3. **`components/ui/`** — raw shadcn/Radix wrappers (`style: "radix-nova"` per `components.json`). Do not import these directly in pages/features — go through `la/`.

Feature components (self-contained, own `index.ts` barrel) live alongside these: `create-alert/`, `report-ad/`, `la-search-bar/`, `location-picker/`, `phone-number-input/`, `rich-text-editor/`, etc.

**STOP-and-confirm rules** (ask the user before writing code):
- Missing UI primitive needed → build in `la/` + add a `/design-system` demo, then use it — confirm first.
- New component reused across 2+ pages, not yet in `components/` → confirm, build, demo, then use.
- Any new sub-`layout.tsx` → confirm; use the middleware header-signal pattern instead (see above).
- Calling a third-party API from a page/component → confirm; create an `app/api/` proxy route first and call that instead.

**Co-location rule**: a component used by exactly one page lives next to that `page.tsx`, not in `components/`.

**Import rule**: pages/feature components import only from `@/components/*`, `@/lib/*`, `react`, `next/*`. `lucide-react` icons and bare `@radix-ui/*` primitives may be imported directly (unstyled); wrap anything else in `components/ui/` before reuse. Always use `cn()` from `@/lib/utils`, never manual className concatenation.

**State rule**: cross-page/persistent state → Zustand store in `lib/stores/`; reusable stateful logic → hook in `lib/hooks/`; local UI state → `useState` in place.

### Data layer

- Mock data: `src/lib/mock/` — per-category, per-country (`in/`, `gb/`, `sg/`) subfolders, resolved via `country-map.ts` (`COUNTRY_OVERRIDES`) with `listing-map.ts` as the generic `CATEGORY_MAP` fallback.
- DB: `src/lib/db.ts` — Mongoose singleton cached on `globalThis` (survives dev hot-reload); no-ops without `MONGODB_URI` — mock data works without a DB connection.
- Types: `src/types/listing.ts` (`Listing`, `Seller`, `ListingStatus`, …), `src/types/auth.ts`.
- API routes under `src/app/api/*` own auth headers, error handling, sanitisation — pages call these, never raw external `fetch()`.

### Styling & accessibility (hard rules)

Tailwind utility-first, no inline `style={{}}`, no arbitrary px/rem values. `slate-*` for component-level styling, CSS vars (`bg-background`, `text-foreground`, etc.) for structural layout. Semantic colors: `rose-*` = destructive, `amber-*` = warning, `blue-*` = action/CTA. Fonts: `font-sans` (Inter Variable) / `font-display` (InterDisplay) only.

The product owner has low vision (~50%) — these override normal styling instincts and are non-negotiable:
- `text-sm` (14px) is the floor. `text-xs`/`text-[10px]`/`text-[11px]` are banned everywhere.
- Body text on white: `text-slate-700` minimum. Placeholder/hint text: `text-slate-500` minimum.
- Interactive borders: `border-slate-300` minimum. Labels prefer `font-medium`/`font-semibold`.

### Env vars (`.env.local`, never committed)

`MONGODB_URI`, `COUNTRY_HEADER` (CDN country header override), `BASIC_AUTH_USER`/`BASIC_AUTH_PASS` (guards `/snippets` + `/design-system`), `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET` (guards `POST /api/jobs/trigger`), `MOCK_COUNTRY` (dev-only country override — must never be set in production).

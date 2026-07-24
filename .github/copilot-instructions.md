# LokalAds — poc-next · Copilot Brief

> **Auto-loaded every session** — this is the derived brief. Source of truth for each section is `md/context.md`.
> Last synced: **2026-07-13**
>
> Deep bible: `md/context.md` · Big picture (architecture story + stub/real scorecard): `md/architecture/BIG-PICTURE.md` · Session log: `/memories/repo/poc-next.md` · Owner manual: `md/Owner-Bible.md`
> Real API gap inventory (every backend endpoint still needed, by domain): `md/architecture/api/07-real-api-gap-inventory.md`
>
> **Ownership:** Route Map + Component lists → updated by Copilot at session end when routes/components change. Architecture + stack → updated by Owner via `md/context.md` then mirrored here.

## Skills (load on demand from `.github/skills/`)

| Skill | When to invoke |
|---|---|
| `la-new-feature` | Starting any new feature — runs the 12-step discovery + build ritual |
| `la-architecture-owner` | Architecture decisions, new routes, middleware changes, API design, state planning |
| `la-frontend-dev` | Building UI, component layers, Tailwind v4, TypeScript, accessibility, co-location |
| `la-devops-infra` | Deployment, env vars, MongoDB, email engine, cron jobs, country detection, security |
| `la-mongodb` | Mongoose model creation, query patterns, index checklist, denormalisation, schema migration |
| `la-seo` | Metadata API, hreflang (IN/GB/SG), JSON-LD, sitemaps, Core Web Vitals, POC→PROD URL migration |
| `la-auth` | Session reads, API auth guards (4 levels), Server Component redirects, session cookie spec |
| `la-ux-design` | UX decisions, design system component inventory, branding tokens, new component ritual, accessibility |

---

## Product

**LokalAds** — a classifieds marketplace (Craigslist + OLX, done right). This workspace is simultaneously the real product scaffold and a UX playground for POC snippets and a living design system.

**Owner:** Gopi — UX Designer + Frontend Dev + Product Owner. Has low vision (~50%). Accessibility rules are non-negotiable and override all other styling decisions.

**Active markets:** India (IN) · United Kingdom (GB) · Singapore (SG)

---

## Tech Stack (exact versions — do not assume older APIs)

| | |
|---|---|
| Next.js | **16.2.7** — App Router · read `node_modules/next/dist/docs/` before assuming any API |
| React | **19.2.4** |
| TypeScript | **5** |
| Tailwind CSS | **v4** — CSS-first, no tailwind.config.js |
| Radix UI / shadcn/ui | radix-nova flavour |
| CVA + clsx + tailwind-merge | standard setup |
| lucide-react | icons |
| vaul | drawer/bottom sheet |
| sonner | toasts |
| Zustand | **5** — stores |
| Mongoose | **9** — DB schema + API routes |

---

## Architecture

### Middleware Execution Order (every request)
```
1. Static bypass    →  /_next, /api, files with "."  →  pass through
2. Strip header     →  delete x-bare-layout           →  security (prevents client spoofing)
3. UA quick-block   →  IE (Trident/) + EdgeHTML        →  302 /unsupported
4. Basic Auth       →  /design-system, /snippets       →  401 if wrong creds
5. Bare layout      →  /unsupported, /design-system    →  set x-bare-layout:1
6. Simple layout    →  /login, /register/*, /signup    →  set x-simple-layout:1
7. Country gate     →  all other user-facing routes    →  cookie/CF/pending logic
```

### Route Behaviour Matrix
| Route | Basic Auth | Bare Layout | Simple Layout | Country Gate | BrowserGuard |
|---|---|---|---|---|---|
| `/` and product routes | ✗ | ✗ | ✗ | ✓ | ✓ |
| `/login`, `/register/*`, `/signup` | ✗ | ✗ | ✓ | ✓ | ✓ |
| `/snippets/*` | ✓ | ✗ | ✗ | ✗ | ✓ |
| `/design-system/*` | ✓ | ✓ | ✗ | ✗ | ✗ |
| `/unsupported` | ✗ | ✓ | ✗ | ✗ | ✗ |
| `/_next/*`, `/api/*` | ✗ | ✗ | ✗ | ✗ | ✗ |

### Layout Signal System — HARD RULE
The root `app/layout.tsx` owns the **one and only** AppHeader + AppFooter.
Never create a sub `layout.tsx` that adds its own AppHeader or AppFooter.
Instead, signal the root layout via middleware request headers:

| Header | Set by middleware for | Root layout behaviour |
|---|---|---|
| `x-bare-layout: 1` | `/unsupported`, `/design-system/*`, `/snippets/*` | No header, no footer |
| `x-simple-layout: 1` | `/login`, `/register/*`, `/signup` | `variant="simple"` on both |
| *(none)* | All other routes | `variant="default"` on both |

**Server-side flags are for initial render ONLY — never use them for layout/styling that must update on soft navigation.**
Next.js soft navigation (`<Link>`) does not re-run server layouts. Any flag read in a Server Component stays frozen after the first load.

| Safe to use server flag for | NOT safe — use `usePathname()` in client component instead |
|---|---|
| AppHeader/AppFooter `variant` prop (components self-correct via `usePathname` anyway) | `<main>` className or any structural change on non-static pages |
| `isBareLayout` — skipping entire HTML shell (hard nav only) | Any conditional layout affecting product pages |

**Rule:** If a visual/layout decision needs to change when the user navigates — it must live in a client component using `usePathname()`, never in a server layout flag.

**To add a new layout variant:**
1. Add the route pattern to `proxy.ts` (SIMPLE_LAYOUT_ROUTES or BARE_LAYOUT_ROUTES) — renamed from `middleware.ts` 2026-07-13 per Next.js 16's `middleware`→`proxy` convention deprecation; exported function is now `proxy`, not `middleware`
2. Add the header read + conditional in `app/layout.tsx`
3. Never create a nested `layout.tsx` that re-renders the shell

### Country Gate
`cookie(countryContext)` present → `CountryProvider` wraps children  
No cookie → `CountryDetector` (ipinfo.io, 5s timeout) → success: cookie + `router.refresh()`  
Detect fails → `OverlayCountrySelect` (blocking fullscreen, no dismiss without selection)

### Browser Guard (3 layers)
Layer 1: Middleware UA string → IE + EdgeHTML → `/unsupported`  
Layer 2: `BrowserGuard` client CSS feature detection → `window.location.replace('/unsupported')`  
Layer 3: `/unsupported` — zero Tailwind, 100% inline styles, any browser safe

---

## Component Architecture — 3 Layers

### Layer 1 · `components/la/` — LokalAds Design System Primitives
**Prefer these for all product UI.** Built on top of `components/ui/`.  
`LaButton` · `LaText` · `LaField` · `LaInput` · `LaTextarea` · `LaSelect` · `LaRadio` · `LaChip` · `LaBadge`  
`LaTagInput` · `LaMinMax` · `LaAmount` · `LaTokenRow` · `LaSelectResponsive` · `LaListSelect`  
`LaSeparator` · `la-section` · `la-tabs` · `la-avatar` · `la-card` · `la-placeholder`  
Color palette reference: `components/la/COLOR_PALETTE.md`

### Layer 2 · `components/la-blocks/` — Product Page Sections
`AppHeader` · `AppFooter` · `CategoryGrid` · `FeaturedListings` · `RecentSearches`  
`LegalDrawer` · `Logo` · `TimelineSheet` · `WhatsNext` · `WhyLokalads`  
`la-thumbnail-listing` · `la-thumbnail-favourites` · `la-relative-date` · `la-listing-description` · `la-empty`

### Layer 3 · `components/ui/` — shadcn Primitives (raw wrappers)
Used by the `la/` layer. **Do not import directly in pages or feature components.**  
`button` · `card` · `dialog` · `drawer` · `field` · `input` · `otp-input` · `tabs` · `radio-group` · `sheet` · `switch`  
`alert-dialog` · `alert` · `breadcrumb` · `pagination` · `scroll-area` · `sonner` · `toggle`

### Feature Components (self-contained, each has `index.ts` barrel)
`create-alert/` · `report-ad/` · `la-search-bar/` · `location-picker/`  
`phone-number-input/` · `rich-text-editor/` · `responsive-dialog/`  
`avatar/` · `country/` · `browser-guard/` · `overlay-country-select/`  
`collapsible/` · `toggle-group/` · `email-otp/` · `phone-otp-v2/`  
`timeline/` · `feedback/` · `good-to-know/` · `la-image-gallery/`  
`error-page/` · `icons/` · `date-input/`

---

## Key Conventions

### STOP Rules — Ask Before Acting
These require user confirmation before writing any code:
1. **Missing UI primitive** — Need a UI element not in `la/`? STOP → tell user what's missing → get confirmation → build it in `la/` → add a design-system demo page → THEN use it in the feature
2. **New reusable component** — Component needed across 2+ pages and not in `components/`? STOP → confirm with user → build in `components/` → add design-system demo → then use
3. **New `layout.tsx`** — Any sub-layout creation? STOP → read `app/layout.tsx` first → use middleware signal pattern instead
4. **External API call** — Calling a third-party API from a page/component? STOP → create an `app/api/` proxy route first → call that instead

### Import Rule — Non-negotiable
- Pages + feature components: **only import from `@/components/*`**, `@/lib/*`, `react`, `next/*`
- Exception: `lucide-react` icons and bare `@radix-ui/*` primitives may be imported directly (they ship unstyled — nothing to wrap) — but wrap in `components/ui/` once a pattern is reused in 2+ places
- Never import styled/behavioural externals (vaul, other UI libs) directly in a page — wrap in `components/ui/` first
- Always use `cn()` from `@/lib/utils` — never manual className string concatenation

### Co-location Rule
- **If a component is only ever used by one page — it lives next to that page, not in `components/`**
- Route-level components (e.g. `JoinStep.tsx` beside `page.tsx`) are private by Next.js convention — only `page.tsx` becomes a route
- `components/` is reserved for primitives, design system pieces, and truly reusable feature components

### API Rule — Non-negotiable
- **Never call external APIs directly from pages or components**
- All external/backend calls go through `app/api/` route handlers
- Pages call `/api/...` endpoints — never raw `fetch('https://...')` in component code
- API routes own: auth headers, error handling, rate limiting, data sanitisation

### State Rule
- Cross-page / persistent state → Zustand store in `lib/stores/`
- Reusable stateful logic → custom hook in `lib/hooks/`
- Local UI state (toggle, hover) → `useState` in the component is fine
- Never reach for `useState` for data that crosses page boundaries

### Design System Demo Rule
- **Every new `la/` primitive must have a demo page in `/design-system/`**
- **Every new reusable feature component must have a demo in `/design-system/` or `/snippets/`**
- Add the entry to `lib/design-system-menu.ts` so it appears in the design system nav
- This is the developer guide — if it's not demoed, it doesn't exist for future contributors

### Route Map Rule
- **Any new route added → update the Route Map section in this file immediately**
- Date-stamp the update: `Last verified: YYYY-MM-DD`

### Styling
- Tailwind utility-first · no `style={{}}` inline styles · no arbitrary px/rem values
- **`slate-*` scale** for fine-grained component styling
- **CSS vars** (`bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.) for structural layout
- Semantic colors: `rose-*` = destructive/error · `amber-*` = warning · `blue-*` = action/CTA
- Nothing outside these unless explicitly requested
- Fonts: `font-sans` (Inter Variable) · `font-display` (InterDisplay) — no other families ever

### Accessibility — HARD RULES (low-vision owner — overrides everything)
- **`text-sm` (14px) is the absolute minimum** — `text-xs`, `text-[10px]`, `text-[11px]` are BANNED everywhere, no exceptions
- Text on white: `text-slate-700` minimum — never `text-slate-300` or `text-slate-400` for readable text
- Placeholder/hint text: `text-slate-500` minimum
- Meaningful icons: `text-slate-500` minimum
- Interactive borders: `border-slate-300` minimum — never `border-slate-100` as only visual boundary
- Labels: prefer `font-medium` or `font-semibold` over `font-light` / `font-normal`

---

## Route Map

> **Last verified: 2026-07-13** — update this date whenever you touch the route map.
> Source of truth: `md/context.md` Section 5. When routes change, update both files.

### Product (live under normal app shell)
| Route | Status |
|---|---|
| `/` | ✅ Hero · LaSearchBar · CategoryGrid · FeaturedListings · RecentSearches · CreateAlert · footer nav (Popular Category/Top Locations) now country-derived, not hardcoded |
| `/listings` | ✅ URL-driven filters · filter panel · pagination |
| `/listings/[listingId]` | ✅ Gallery · details table · seller card (now links to `/u/[handle]` for GB-property sellers) · ChitChat · report-ad · similar listings |
| `/post` | 🚧 Stub |
| `/u/[handle]` | ✅ Handle-driven for GB-property's 6 sellers (`bob-harrison`, `alice-chen`, `sarah-patel`, `james-obrien`, `prime-developments`, `meridian-commercial`) as of 2026-07-13 — each resolves real per-seller contact info + reviews (previously all hardcoded to Bob regardless of handle). `Seller.handle` is optional — other 43 mock seller pools not yet wired. `anto27` alias (private `/profile`'s "preview" link) still points to Bob. |
| `/(auth)/login` · `/register` · `/signup` | 🚧 Stubs |
| `/(about)/about` · `/team` · `/why` · `/career` · `/contact` | ✅ All built |
| `/(about)/our-locations` | ⚠️ Built but not finalised — frozen, revisit with fresh eyes |
| `/(resources)/faq` | ✅ 5 sections · 20 questions · native `<details>` accordion |
| `/(resources)/support` | ✅ Contact form · 6 topics · conditional fields · async submit |
| `/(resources)/tutorials` | ✅ 11 cards · audience pills · popular ribbon |
| `/(dashboard)/chat` · `/switch-country` | 🚧 `/switch-country` stub · `/chat` ✅ built (full conversation list + chat view, tabs, block/delete) |
| `/(dashboard)/favourites` · `/myads` | 🚧 Stubs |
| `/(dashboard)/profile` | ✅ Built — full iOS-settings-style UI wired to delete-account flow; renders mock session data until real auth ships |
| `/(common)/cookie` · `/privacy` · `/terms` | ⚠️ Exist — status unknown, not reviewed |
| `/unsupported` | ✅ Bare layout · inline styles only · 4 browser cards |

### Snippets (Basic Auth · `/snippets/*`)
`chat` · `create-alert` · `delete-account` · `feedback` · `login` · `private-profile`  
`report-ad` · `responsive-dialog` · `rich-text-editor` · `toggle-group`  
`landing-category` · `phone-number-input` · `icons` · `typography` · `security-blocked`  
Error pages: `401` · `403` · `404` · `500` · `503`  
WIP / stubs: `button-variants` · `app-shell` · `donate` · `feedback-feature`

### Design System (Basic Auth · Bare layout · `/design-system/*`)
Living reference for all primitives, tokens, blocks. No AppHeader/AppFooter.

---

## Data Layer

| | |
|---|---|
| Mock data | `lib/mock/` — 21 categories × in/gb/sg subfolders · `country-map.ts` (COUNTRY_OVERRIDES resolver, country-aware listing/similar/featured lookups) · `listing-map.ts` (generic CATEGORY_MAP fallback) · SELLERS pools · mock-searches |
| Types | `types/listing.ts` (Listing, Seller, ListingStatus, ListingImage, KeyValueRow) · `types/auth.ts` |
| Stores | `lib/stores/` — favouritesStore · donationStore · recentSearchesStore · deleteAccountStore |
| Hooks | `lib/hooks/` — useCountryConfig · useListingFilters · useListingSearch · useMediaQuery · useResendTimer · use-recent-searches |
| API routes | `app/api/reports` (POST/GET/PATCH) · `app/api/good-to-know` · `app/api/places` |
| DB | `lib/db.ts` — Mongoose singleton (needs `MONGODB_URI` in `.env.local`) |
| Config | `config/` — global.ts · categories/ · countries/ |

---

## Env Vars (`.env.local` — never committed)
```
MONGODB_URI=          # Mongoose DB (mock data works without this)
COUNTRY_HEADER=       # Optional: CDN-injected country code → skips client detection
BASIC_AUTH_USER=      # Protects /snippets + /design-system
BASIC_AUTH_PASS=
RESEND_API_KEY=       # Email provider (batch runner + email engine)
EMAIL_FROM=           # Sender address e.g. "LokalAds <noreply@lokalads.com>"
CRON_SECRET=          # Secures POST /api/jobs/trigger — generate with: openssl rand -hex 32
```

## Dev Commands
```bash
npm run dev     # localhost:3000
npm run build   # type-check + production build
npm run lint    # ESLint
```

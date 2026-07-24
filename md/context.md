# poc-next — Project Bible

> **Source of truth for all project knowledge.** Everything in `.github/copilot-instructions.md` is derived from here.
> Last updated: **2026-07-13** (synced middleware/layout section to the current 7-step order — was drifted at 6 steps, missing the Simple Layout step)
>
> Quick brief (Copilot auto-loads): `.github/copilot-instructions.md`  
> Session history: `/memories/repo/poc-next.md`  
> Owner manual: `md/Owner-Bible.md`
>
> **Ownership guide:**
> - Sections 1–4 (stack, arch, components) → Owner updates manually when architecture changes
> - Section 5 (Route Map) → Copilot updates at session end when routes change; mirror to `copilot-instructions.md`
> - Section 12 (Tech Debt) → Copilot updates when debt is resolved or discovered
> - Section 13 (Session Log table) → Copilot appends at session end

---

## 1. What This Is

**LokalAds** — a classifieds marketplace (Craigslist + OLX, done right).  
This workspace is simultaneously the real product scaffold and a UX playground for POC snippets and a living design system.

**Owner:** Gopi — UX Designer + Frontend Dev + Product Owner. Low vision (~50%). Accessibility is non-negotiable.  
**Active markets:** India (IN) · United Kingdom (GB) · Singapore (SG)

---

## 2. Tech Stack

| Package | Version | Notes |
|---|---|---|
| Next.js | 16.2.7 | App Router — breaking changes vs older Next. Read `node_modules/next/dist/docs/` |
| React | 19.2.4 | |
| TypeScript | 5 | |
| Tailwind CSS | v4 | CSS-first — no `tailwind.config.js` |
| shadcn/ui | radix-nova | Radix UI primitives |
| CVA + clsx + tailwind-merge | latest | className composition |
| lucide-react | 1.8.0 | Icons |
| vaul | 1.1.2 | Drawer / bottom sheet |
| sonner | 2.0.7 | Toasts |
| Zustand | 5.0.12 | State stores |
| Mongoose | 9.7.3 | DB schema + API routes |
| next-themes | 0.4.6 | Theme switching |

---

## 3. Architecture

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

### Country Gate
- `cookie(countryContext)` present → `CountryProvider` wraps children
- No cookie → `CountryDetector` (ipinfo.io, 5s timeout) → success: writes cookie + `router.refresh()`
- Detection fails → `OverlayCountrySelect` (blocking fullscreen picker, no dismiss without selection)
- Optional fast path: set `COUNTRY_HEADER` env var → middleware sets cookie server-side, zero client detection

### Browser Guard (defence-in-depth, 3 layers)
- Layer 1: Middleware UA string — IE (Trident/) + EdgeHTML (Edge/ without Edg/) → `302 /unsupported`
- Layer 2: `BrowserGuard` client component — CSS feature detection → `window.location.replace('/unsupported')` (no back-button loop)
- Layer 3: `/unsupported` page — zero Tailwind, 100% inline styles, safe on any browser; `metadata.robots = noindex`
- Min browser support: Chrome 105+ · Edge 105+ · Firefox 110+ · Safari 16.4+

### Bare Layout
- Triggered by `x-bare-layout: 1` header (set in middleware)
- `app/layout.tsx` reads this header → skips BrowserGuard, CountryProvider, AppHeader, AppFooter
- Used for: `/design-system` (living reference, no app chrome) · `/unsupported` (bare page, any browser)

### Key Files
- `proxy.ts` — all route logic above; uses `BARE_LAYOUT_ROUTES` + `isBareLayoutRoute()` helpers (renamed from `middleware.ts` 2026-07-13 — Next.js 16 deprecated the `middleware` file convention; exported function is `proxy`, not `middleware`)
- `app/layout.tsx` — async RSC; reads headers(); bare layout early-return or full app shell
- `lib/country-context.ts` — constants: `COUNTRY_COOKIE`, `PENDING_COOKIE`, `SUPPORTED_CODES`, `isSupportedCountry()`
- `lib/country-cookie.ts` — `commitCountry()`, `clearCountryCookies()`
- `lib/db.ts` — Mongoose singleton (globalThis cache for hot-reload safety)

---

## 4. Component Architecture

Three strictly layered tiers — never skip layers or import from lower tiers in pages.

### Layer 1 · `components/la/` — LokalAds Design System Primitives
LokalAds-branded components. **Prefer these for all product UI.** Built on top of `components/ui/`.

| Component | Purpose |
|---|---|
| `LaButton` | Primary action button (branded) |
| `LaText` | Typography system (h1–h6, body, label variants) |
| `LaField` | Form field wrapper with label + description |
| `LaInput` | Branded text input |
| `LaTextarea` | Branded textarea |
| `LaSelect` | Branded select dropdown |
| `LaRadio` | Branded radio button |
| `LaChip` | Pill/chip for tags and filters |
| `LaBadge` | Status and category badge |
| `LaTagInput` | Multi-value tag input (maxTags support) |
| `LaMinMax` | Range input (min/max pair) |
| `LaAmount` | Currency amount input |
| `LaTokenRow` | Horizontal token/chip row display |
| `LaSelectResponsive` | Drawer (mobile) / popover (desktop) select |
| `LaListSelect` | Scrollable list-style selector |
| `LaSeparator` | Horizontal rule |
| `la-section` | Page section wrapper with label |
| `la-tabs` | Branded tab component |
| `la-avatar` | User avatar with fallback |
| `la-card` | Branded card surface |
| `la-placeholder` | Skeleton/empty state placeholder |

Color reference: `components/la/COLOR_PALETTE.md`

### Layer 2 · `components/la-blocks/` — Product Page Sections
Assembled blocks composed of `la/` primitives. Used directly in product pages.

`AppHeader` · `AppFooter` · `CategoryGrid` · `FeaturedListings` · `RecentSearches`  
`LegalDrawer` · `Logo` · `TimelineSheet` · `WhatsNext` · `WhyLokalads`  
`la-thumbnail-listing` · `la-thumbnail-favourites` · `la-relative-date` · `la-listing-description` · `la-empty`

### Layer 3 · `components/ui/` — shadcn Primitives
Generic wrappers. Used by `la/` layer. **Do not import directly in pages or feature components.**

`button` · `card` · `dialog` · `drawer` · `field` · `input` · `otp-input` · `tabs`  
`radio-group` · `sheet` · `switch` · `alert-dialog` · `alert` · `breadcrumb`  
`pagination` · `scroll-area` · `sonner` · `toggle`

### Feature Components (self-contained)
Each has its own folder with an `index.ts` barrel.

| Folder | What it does |
|---|---|
| `components/create-alert/` | 3-step alert creation journey (category → filters → confirm) |
| `components/report-ad/` | 3-screen report journey + Mongoose model + ticket system |
| `components/la-search-bar/` | Product search bar with scope picker |
| `components/location-picker/` | Location/radius picker |
| `components/phone-number-input/` | Full phone input with country picker |
| `components/rich-text-editor/` | `contentEditable` composer + read-only viewer |
| `components/responsive-dialog/` | Bottom sheet (mobile) / dialog (desktop) wrapper |
| `components/avatar/` | Avatar + dropdown |
| `components/country/` | CountryProvider, CountryDetector, CountryBadge, ResetButton |
| `components/browser-guard/` | BrowserGuard + browser-checks.ts |
| `components/collapsible/` | CollapsiblePanel — animated expand/collapse |
| `components/toggle-group/` | Compound ToggleButtonGroup + ToggleGroupButton (4 sizes) |
| `components/email-otp/` | EmailOtpCard — 3-stage, maskMode prop |
| `components/phone-otp-v2/` | PhoneOtpCard — 3-stage, up to 3 numbers |
| `components/overlay-country-select/` | Blocking fullscreen manual country picker |
| `components/timeline/` | Timeline sheet component |
| `components/feedback/` | Feedback component |
| `components/good-to-know/` | Listing "good to know" cards |
| `components/la-image-gallery/` | Listing image gallery |
| `components/error-page/` | Shared error page component |
| `components/icons/` | Custom inline SVG icons (used in icon gallery snippet) |
| `components/date-input/` | Date input component |

---

## 5. Route Map (Current State — July 2026)

### Product Routes

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Built | Hero · LaSearchBar · LocationPicker · CategoryGrid · FeaturedListings · RecentSearches · CreateAlert |
| `/listings` | ✅ Built | URL-driven filters · filter panel (left/mobile sheet) · pagination |
| `/listings/[listingId]` | ✅ Built | Gallery · details table · good-to-know · seller card (links to `/u/[handle]` for GB-property sellers) · similar · ChitChat · report-ad |
| `/u/[handle]` | ✅ Built | Public seller profile — handle-driven for GB-property's 6 sellers (`bob-harrison`, `alice-chen`, `sarah-patel`, `james-obrien`, `prime-developments`, `meridian-commercial`) as of 2026-07-13; per-handle contact + reviews. `Seller.handle` is optional — other 43 mock seller pools not yet wired. `anto27` alias points to Bob (private `/profile`'s "preview" link). |
| `/post` | 🚧 Stub | "Coming soon" |
| `/(auth)/login` | 🚧 Stub | Real POC is `/snippets/login` |
| `/(auth)/register` | 🚧 Stub | |
| `/(auth)/signup` | 🚧 Stub | |
| `/(about)/about` | ✅ Built | |
| `/(about)/team` | ✅ Built | |
| `/(about)/why` | ✅ Built | |
| `/(about)/career` | ✅ Built | Disability-first hiring copy |
| `/(about)/contact` | ✅ Built | Press/Partnerships/Careers cards + team location band |
| `/(about)/our-locations` | ⚠️ Frozen | Tabs (All/India/UK/SG) built but feel not finalised — do not touch until asked |
| `/(resources)/faq` | ✅ Built | 5 sections · 20 questions · native `<details>` accordion |
| `/(resources)/support` | ✅ Built | Contact form · 6 topics · conditional fields · simulated async |
| `/(resources)/tutorials` | ✅ Built | 11 cards · audience pills · popular ribbon · detail pages are 404 |
| `/(dashboard)/chat` | ✅ Built | Full conversation list + chat view, tabs, block/delete — not just the `/snippets/chat` demo |
| `/(dashboard)/favourites` | 🚚 Stub | "Coming soon" |
| `/(dashboard)/myads` | 🚚 Stub | "Coming soon" |
| `/(dashboard)/profile` | ✅ Built | Full iOS-settings-style profile UI wired to delete-account flow — renders with mock session data until real auth ships |
| `/(dashboard)/switch-country` | 🚚 Stub | "Coming soon" |
| `/(common)/cookie` | ⚠️ Unknown | Exists in filesystem — not reviewed |
| `/(common)/privacy` | ⚠️ Unknown | Exists in filesystem — not reviewed |
| `/(common)/terms` | ⚠️ Unknown | Exists in filesystem — not reviewed |
| `/unsupported` | ✅ Built | Bare layout · inline styles only · 4 browser download cards |

### Snippet Routes (`/snippets/*` — Basic Auth protected, no country gate)

| Snippet | Status | Key Details |
|---|---|---|
| `chat` | ✅ Full | Conversation list + chat view · block/delete · time tabs · sanitised input |
| `create-alert` | ✅ Full | 3-step: category → filters → confirm · Drawer (mobile) / Dialog (tablet+) |
| `delete-account` + `/confirm` | ✅ Full | Eligibility → 3-stage confirm (reason → review → goodbye) · Zustand store |
| `feedback` | ✅ Built | |
| `login` | ✅ Full | Email/phone toggle · validation · password reveal · toast |
| `private-profile` | ✅ Full | iOS-settings layout · wired to delete-account |
| `public-profile` | ✅ Full | Avatar · stats · Listings/Reviews/Contact tabs |
| `report-ad` | ✅ Full | 3-screen journey · Mongoose model · ticket ID · API (`/api/reports`) |
| `responsive-dialog` | ✅ Full | Bottom sheet (mobile) / dialog (desktop) · scroll-to-accept |
| `rich-text-editor` | ✅ Full | Composer + live viewer |
| `toggle-group` | ✅ Full | Compound pattern · 4 sizes · 10 use cases |
| `landing-category` | ✅ Full | 9 gradient tiles · CollapsiblePanel colour reference |
| `phone-number-input` | ✅ Full | PhoneNumberInput demo |
| `icons` | ✅ Full | SVG gallery |
| `typography` | ✅ Full | 5-section type reference |
| `security-blocked` | ✅ Full | Blocked account page with event metadata |
| `button-variants` | 🚧 Scaffolded | Empty — ready to build |
| `app-shell` | 🚧 Stub | |
| `donate` | 🚧 Stub | |
| `feedback-feature` | 🚧 Stub | |
| `401` · `403` · `404` · `500` · `503` | ✅ Built | Error pages |

### Design System (`/design-system/*` — Basic Auth + Bare Layout)
Living component reference. No AppHeader/AppFooter. Sections: Core, ShadCN, UX Components, Feature, Blocks.

---

## 6. Data Layer

### Mock Data (`lib/mock/`)
- 21 categories, each with dedicated `in/`, `gb/`, `sg/` subfolders (own sellers + subcategory files + `index.ts`)
- `country-map.ts` — the country-aware resolver: `getListingsForMarket()`, `getCountsForMarket()`, `resolveListingContext()`, `getSimilarListings()`, `getFeaturedForMarket()` (homepage cross-category mix, replaces the old hand-curated RECENT_POSTS/TOP_PICKS)
- `listing-map.ts` — generic (GB-flavoured) `CATEGORY_MAP`/`ALL_MAP` fallback for any category not yet in `COUNTRY_OVERRIDES`
- `mock-searches.ts` — `RECENT_SEARCHES` for home page

### Types
- `types/listing.ts` — `Listing`, `Seller`, `ListingStatus`, `ListingImage`, `KeyValueRow`
- `types/auth.ts` — `AuthUser`

### Stores (`lib/stores/`)
| Store | State |
|---|---|
| `favouritesStore.ts` | Persisted favourites list (Zustand + localStorage) |
| `donationStore.ts` | Donation journey state |
| `recentSearchesStore.ts` | Recent searches (Zustand + localStorage) |
| `deleteAccountStore.ts` | Delete account journey: stage, reasons, details, confirmed, isLoading, error |

### Hooks (`lib/hooks/`)
| Hook | Purpose |
|---|---|
| `useCountryConfig.ts` | Returns active country config (currency, categories, etc.) |
| `useListingFilters.ts` | URL ↔ filter state bridge |
| `useListingSearch.ts` | Listing search + filter logic |
| `useMediaQuery.ts` | Responsive breakpoint detection |
| `useResendTimer.ts` | 30s countdown for OTP resend |
| `use-recent-searches.ts` | Read/write recent searches store |

### API Routes
| Route | Methods | Purpose |
|---|---|---|
| `/api/reports` | POST, GET | Create report ticket · list reports |
| `/api/reports/[ticketId]` | GET, PATCH | Status lookup · admin update |
| `/api/good-to-know` | GET | Listing safety tips |
| `/api/places` | GET | Location search |

### Config (`config/`)
- `global.ts` — global app constants
- `categories/` — category definitions per country
- `countries/` — country config (currency, locale, enabled categories, etc.)

---

## 7. Design Conventions

### Import Rules
- Pages + feature components: **only `@/components/*`**, `@/lib/*`, `react`, `next/*`
- Never import Radix / vaul / other external libs in pages or feature components — wrap via `components/ui/` first
- Use `cn()` from `@/lib/utils` always — never manual string concatenation

### Color System
- `slate-*` scale for fine-grained component control
- CSS vars for structural layout: `bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.
- Semantic: `rose-*` = errors/destructive · `amber-*` = warnings · `blue-*` = actions/CTAs
- Nothing else unless explicitly requested

### Typography
- `font-sans` = Inter Variable (body, UI text)
- `font-display` = InterDisplay (headings, hero)
- `font-mono` = Geist Mono (code)
- Self-hosted from `/public/assets/fonts/`

### Spacing Patterns
- Page wrapper: `min-h-screen bg-background` → `max-w-* mx-auto px-6 py-16`
- Card padding: `px-4 py-3.5` (row) · `px-6` (card body)
- Form field gap: `flex flex-col gap-4`
- Section gap: `mb-8` between sections · `mb-14` for hero blocks

### Accessibility — NON-NEGOTIABLE
- **Hard minimum: `text-sm` (14px)** — `text-xs`, `text-[10px]`, `text-[11px]` BANNED everywhere
- Body/label text on white: `text-slate-700` minimum
- Placeholder/hint text: `text-slate-500` minimum
- Meaningful icons: `text-slate-500` minimum
- Interactive element borders: `border-slate-300` minimum
- Prefer `font-medium` / `font-semibold` for labels

---

## 8. Key Architecture Decisions

### Why `model.ts` in `components/report-ad/`?
Keeps the feature self-contained. Only API routes import it. Client components never touch it. Contrast this with `lib/db.ts` which is shared infrastructure.

### Why `window.location.replace()` in BrowserGuard?
Removes the current page from browser history — prevents the Back button returning to an unsupported state.

### Why strip `x-bare-layout` at the top of middleware?
Security. Prevents a client from spoofing the header to bypass AppHeader/AppFooter/BrowserGuard.

### Why `/snippets` path exits middleware before the country gate?
Snippets are dev/design tools. They don't need country context. Auth check passes → immediate `return NextResponse.next()`.

### The `our-locations` page — why frozen?
Tab pattern (All | India | UK | Singapore) is built with flag SVGs. Gopi wasn't fully satisfied with the feel on the last review. Frozen until revisited with fresh eyes.

---

## 9. Env Vars

```
MONGODB_URI=          # Mongoose DB (mock data works without this locally)
COUNTRY_HEADER=       # Optional: CDN header → middleware sets cookie server-side; skips client detection
BASIC_AUTH_USER=      # Protects /snippets + /design-system
BASIC_AUTH_PASS=
```

---

## 10. Dev Commands

```bash
npm run dev     # localhost:3000
npm run build   # type-check + production build
npm run lint    # ESLint
```

---

## 11. Integration Checklist (Backend Dev Handoff)

For `report-ad` feature:
1. Add `MONGODB_URI` to `.env.local`
2. Replace null `reporterId` with: `const session = await getServerSession(authOptions); session?.user?.id`
3. Replace in-memory IP rate limiter with Upstash Redis (`@upstash/ratelimit`)
4. Pass `sellerId` from listing context into POST body
5. Add admin auth guard to `PATCH /api/reports/:ticketId`
6. Wire `ReportAdJourney` `onSubmit` to `POST /api/reports`

---

## 12. Known Tech Debt

| Item | Detail |
|---|---|
| `our-locations` page | Visually not finalised — frozen |
| All dashboard routes | Stubs — none built |
| Auth routes | Stubs |
| Post Ad route | Stub |
| `report-ad` reporterId | Hardcoded `null` — needs real session |
| Rate limiter | In-memory — needs Upstash for production |
| Tutorial detail pages | `/tutorials/[slug]` links are 404 — not built |
| `button-variants` snippet | Scaffolded but empty |

---

## 13. Session Log

> Condensed history. Full entries in `/memories/repo/poc-next.md`.

| Session | Date | Key Work |
|---|---|---|
| 1–3 | 2026-04-10 | Project scaffolded · Phone OTP v1+v2 · lib refactor (countries, formatPhone, VALID_OTP to canonical lib locations) |
| 4 | 2026-04-10 | OTP v2 UX · Inter fonts self-hosted · Home redesign · Typography snippet |
| 5 | 2026-04-11 | Country Context POC · middleware · CountryProvider · CountryDetector · OverlayCountrySelect |
| 7 | 2026-04-13 | PhoneOtpCard documented · delete-with-confirm on verified rows · JSDoc + TODO:API markers |
| 8 | 2026-04-14 | Email OTP · Rich Text Editor · Responsive Dialog · Design System section |
| 9 | 2026-04-15 | Delete Account Journey · Zustand deleteAccountStore · 3-stage confirm flow |
| 10 | 2026-04-16 | Phone OTP v1 removed → `__trash__/` · Toggle Group snippet + compound component |
| 11–12 | 2026-04-23–24 | Chat snippet (full) · block/delete · sanitised input · `tabs.tsx` added |
| 13 | 2026-05-01 | Private Profile snippet · login · icons · public-profile · phone-number-input · landing-category catalogued |
| 14 | 2026-06-29 | Browser Guard built · `/unsupported` page (inline styles) · middleware UA block |
| 15 | 2026-06-29 | Bare layout extended to `/design-system` · middleware refactored (`BARE_LAYOUT_ROUTES`) |
| 16 | 2026-06-29 | Report Ad Journey · Mongoose model · `/api/reports` (POST/GET/PATCH) · rate limiter |
| 17 | 2026-06-30 | Full project re-read · Home · Listings · Listing Detail · all about + resources pages catalogued |
| 18 | 2026-07-03 | Contact page · Tutorials · FAQ · Support pages built · Our Locations (frozen) |
| 19 | 2026-07-07 | Full documentation restructure — `copilot-instructions.md` created · `context.md` rewritten · session log rebuilt · `Owner-Bible.md` created · component-styling updated with la/ layer · all 4 files cross-checked and synced |
| 20 | 2026-07-08 | Batch Run Engine — full DISCOVERY→CODE FREEZE cycle. 12 files: 3 Mongoose models, 5 job files, instrumentation.ts, api trigger, DS demo page. 10 deep-dive fixes (noMatchSince $unset, keyword OR logic, startup crash guard, escapeRegex, etc). |
| 21 | 2026-07-08 | Batch Run demo page enhanced to mirror email-engine pattern. `lib/jobs/preview-data.ts` created with 4 job previews. `page.tsx` rewritten with 7 sub-components. 9 issues fixed in deep-dive (a11y text-xs→text-sm, Tailwind JIT TRACE_COLOR record, type narrowing, React import, stale comments, TODO integration marker). |
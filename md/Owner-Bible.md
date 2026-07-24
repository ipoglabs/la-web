# Owner-Bible.md — LokalAds / poc-next

> Last updated: 2026-07-09 · Owner: Gopi

This is your personal operating manual for this workspace. Written for you — not for the AI. Come here when you need to understand how the system is set up, what to maintain, and how to keep things clean for the long haul.

---

## 0. How to Use This System Every Day (Read This First)

### The mental model

Think of Copilot as a senior developer who has **already read every document, knows every rule, and remembers everything** before you say a word.

The moment you open VS Code and start a chat, Copilot has already silently read `.github/copilot-instructions.md`. It knows every component, every colour rule, every route, every middleware step, your 3 markets, your accessibility requirements.

**You never need to say:**
- "This is a classifieds app"
- "Don't use text-xs"
- "Use la/ components, not raw shadcn"
- "Only 3 countries: IN, GB, SG"

It just knows.

---

### Step 1 — Open VS Code, open a new chat

That's it. Everything is already loaded. No preamble needed.

---

### Step 2 — Pick your next task from the gap tracker

Your open work lives in `/memories/repo/poc-tracker.md`. Natural order to work through:

| Say this | What it builds |
|---|---|
| `"Let's build the /profile page, wire it from /snippets/private-profile"` | Gap #6 — already has a snippet, lowest effort |
| `"Let's build the /login page, wire it from /snippets/login"` | Gap #2 — auth entry point |
| `"Let's build the /favourites page"` | Gap #4 — store already built |
| `"New feature: Post an Ad"` | Gap #1 — core seller flow, uses full ritual |

---

### Step 3 — The phrases you use day-to-day

**Starting a new feature (complex, multi-page):**
> "New feature: [name]"

Copilot runs the full 12-step ritual. Asks you the right questions. Won't write code until the plan is solid.

**Building a page (known, straightforward):**
> "Build the /profile page, wire it from /snippets/private-profile"

**Asking a design question:**
> "What component should I use for [X]?"
> "Does this feel right for LokalAds?"

**Asking about the database:**
> "Write the API route to fetch listings by country"

**Protecting a page:**
> "Make the /profile page require login"

**Adding SEO:**
> "Add metadata to the listing detail page"

**Asking about deployment:**
> "What env vars do I need to set in Vercel?"

---

### Step 4 — Trust the STOPs

When Copilot pauses and says **"STOP — before I build this..."** — always read it.
It caught something that would cost you an hour later.

Always either:
- **"Yes, do it right"** — let it follow the rule
- **"No, skip this time because..."** — override consciously

Common STOP triggers:
- "This component doesn't exist in the design system — should I build it in `la/` first?"
- "This would be used on 2+ pages — should we make it reusable?"
- "This calls an external API from a component — should I create an `/api/` proxy first?"

---

### Step 5 — End of session (30 seconds)

Say: **`Update session log`**

Copilot writes what was built into `/memories/repo/poc-next.md`. Next session it picks up exactly where you left off.

---

### The one-line rule

> **You are the Product Owner. Copilot is the senior developer who already read every doc.**
> Say *what* you want. It figures out *how* — correctly, following all your rules.

---

---

## 1. What This Workspace Is

**LokalAds** is a classifieds marketplace — Craigslist + OLX, done with real intentional UX. This workspace (`poc-next`) serves two purposes simultaneously:

1. **The product** — real, working product pages (home, listings, about, resources, etc.)
2. **The playground** — self-contained UX snippets and a living design system for proving patterns before they go into the product

Both live in the same Next.js app. Product pages are under `app/` directly. Snippets under `app/snippets/`. Design system under `app/design-system/`.

---

## 2. The Documentation System (3 Layers + 1 Rule File)

This workspace uses a structured documentation system so that Copilot always arrives with full context — no re-explaining every session.

| Layer | File | Who uses it | When loaded |
|---|---|---|---|
| **Auto-brief** | `.github/copilot-instructions.md` | Copilot | **Every session, automatically** |
| **Project bible** | `md/context.md` | Copilot + You | Read deeply when working on architecture/structure |
| **Session log** | `/memories/repo/poc-next.md` | Copilot | When Copilot needs session history |
| **Styling rules** | `.github/instructions/component-styling.instructions.md` | Copilot | **Auto-applied to every .tsx file** |

Plus this file: `md/Owner-Bible.md` — for you only, never auto-loaded by Copilot.

### What Copilot knows from the first message (no reading required):
- What LokalAds is, what the workspace is for
- Exact tech stack + versions
- Architecture: middleware order, country gate, bare layout, browser guard
- Component layer hierarchy (la/ → la-blocks/ → ui/)
- What's built vs what's a stub
- Accessibility rules (your low-vision requirements)
- Design conventions (color system, fonts, import rules)
- Active markets (IN, GB, SG)

### What you never need to say again:
- "This is a classifieds app"
- "Don't use text-xs"
- "Use la/ components, not raw shadcn"
- "Only 3 countries: IN, GB, SG"
- "Don't import Radix directly in pages"
- "Use cn() from lib/utils"

---

## 3. Session Start Ritual (15 seconds)

1. Just open the workspace and start talking — Copilot already knows the project
2. If working on something complex or architecture-related, say: **"Read md/context.md before we start"**
3. At the end of a productive session, say: **"Update memory"** — Copilot logs what was built

That's it. No preamble, no setup, no re-explaining every time.

---

## 4. Manual Maintenance Checklist

### After each significant work session
- [ ] Say **"Update memory"** — Copilot adds an entry to `/memories/repo/poc-next.md`
- [ ] If you added a new route → say **"Update route map"** — Copilot updates both `copilot-instructions.md` AND `md/context.md` Section 5, and bumps the "Last verified" date
- [ ] If you added a new `la/` component → say **"Update component list"** — Copilot updates `copilot-instructions.md` la/ section AND `md/context.md` Section 4
- [ ] If architecture changed (middleware, env var, new store, new hook) → say **"Update context"** — Copilot updates `md/context.md` Sections 3/6 then mirrors summary to `copilot-instructions.md`

### Monthly / Periodically
- Condense old detailed session entries in `/memories/repo/poc-next.md` into the History Snapshot table
- Compare `copilot-instructions.md` "Last synced" date vs actual last change — if gap > 30 days, do a sync pass
- Check `md/context.md` Known Tech Debt section — anything resolved or newly discovered?

### The Sync Rule — never break this
These two files must always say the same thing about routes and components:

| When you change | Update these files | Say this to Copilot |
|---|---|---|
| Add/change a route | `copilot-instructions.md` Route Map + `md/context.md` §5 | "Update route map" |
| Add/change a `la/` component | `copilot-instructions.md` la/ list + `md/context.md` §4 | "Update component list" |
| Change architecture/middleware | `md/context.md` §3 + `copilot-instructions.md` Architecture | "Update context" |
| Add env var | `md/context.md` §9 + `copilot-instructions.md` Env Vars | "Update context" |
| Resolve tech debt item | `md/context.md` §12 | "Update tech debt" |
| End of productive session | `/memories/repo/poc-next.md` | "Update memory" |

### Before a major new feature
- Write a concept/spec in `md/features/[feature-name].md` first
- Think through which component layers you need
- Identify if any new `la/` primitives need creating first

---

## 5. How to Add New Things

### New Snippet
1. Create `app/snippets/[name]/page.tsx`
2. Components go in `components/[name]/` with an `index.ts` barrel
3. Add entry to your snippets landing/index page so it's navigable
4. `/snippets` is Basic Auth protected, no country gate, no AppHeader/AppFooter needed
5. Note: `lib/design-system-menu.ts` is for the `/design-system/*` nav — not for snippets

### New Product Page
1. Create under the right route group: `app/(about)/`, `app/(dashboard)/`, `app/(main)/`, etc.
2. Use `la/` primitives and `la-blocks/` for sections
3. The app shell (AppHeader + AppFooter) is applied automatically via `app/layout.tsx`
4. Update Route Map in `.github/copilot-instructions.md`

### New la/ Primitive (Design System Component)
1. Create `components/la/la-[name].tsx`
2. Export from `components/la/index.ts` barrel
3. Add to the Design System page: `app/design-system/core/page.tsx`
4. Add to the `la/` list in `.github/copilot-instructions.md`

### New Feature Component (self-contained)
1. Create folder `components/[feature-name]/`
2. Include: main component + `types.ts` + `index.ts` barrel
3. If it has an API: create `app/api/[feature-name]/route.ts`
4. If it has a Mongoose model: put `model.ts` inside the component folder (not in `lib/`) — keeps the feature self-contained

### New la-block (Page Section)
1. Create `components/la-blocks/[BlockName].tsx`
2. Import directly (no barrel currently in la-blocks)

---

## 6. Route Map — Current State (July 2026)

### Product Routes

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Built | Hero · LaSearchBar · CategoryGrid · FeaturedListings · RecentSearches · CreateAlert |
| `/listings` | ✅ Built | URL-driven filters · filter panel (left/sheet) · pagination |
| `/listings/[listingId]` | ✅ Built | Gallery · details · seller card · similar · ChitChat · report-ad |
| `/post` | 🚧 Stub | "Coming soon" |
| `/(auth)/login` | 🚧 Stub | Real pattern is `/snippets/login` |
| `/(auth)/register` | 🚧 Stub | |
| `/(auth)/signup` | 🚧 Stub | |
| `/(about)/about` | ✅ Built | |
| `/(about)/team` | ✅ Built | |
| `/(about)/why` | ✅ Built | |
| `/(about)/career` | ✅ Built | Disability-first hiring copy |
| `/(about)/contact` | ✅ Built | Press / Partnerships / Careers + team location band |
| `/(about)/our-locations` | ⚠️ Frozen | Tab pattern built but visually not finalised — do not touch until asked |
| `/(resources)/faq` | ✅ Built | 5 sections · 20 questions · native `<details>` accordion |
| `/(resources)/support` | ✅ Built | Contact form · 6 topics · conditional fields · simulated submit |
| `/(resources)/tutorials` | ✅ Built | 11 cards · audience pills · detail pages are 404 (not built yet) |
| `/(dashboard)/chat` | 🚧 Stub | Real pattern is `/snippets/chat` |
| `/(dashboard)/favourites` | 🚧 Stub | |
| `/(dashboard)/myads` | 🚧 Stub | |
| `/(dashboard)/profile` | 🚧 Stub | Real pattern is `/snippets/private-profile` |
| `/(dashboard)/switch-country` | 🚧 Stub | |
| `/(common)/cookie` | ⚠️ Unknown | Exists — not reviewed |
| `/(common)/privacy` | ⚠️ Unknown | Exists — not reviewed |
| `/(common)/terms` | ⚠️ Unknown | Exists — not reviewed |
| `/unsupported` | ✅ Built | Bare layout · inline styles only · 4 browser cards |

### Snippet Routes (`/snippets/*`)
All protected by Basic Auth. No country gate.

| Snippet | Status |
|---|---|
| `chat` | ✅ Full |
| `create-alert` | ✅ Full |
| `delete-account` + `/confirm` | ✅ Full |
| `feedback` | ✅ Built |
| `login` | ✅ Full |
| `private-profile` | ✅ Full |
| `public-profile` | ✅ Full |
| `report-ad` | ✅ Full (+ Mongoose model + API) |
| `responsive-dialog` | ✅ Full |
| `rich-text-editor` | ✅ Full |
| `toggle-group` | ✅ Full |
| `landing-category` | ✅ Full |
| `phone-number-input` | ✅ Full |
| `icons` | ✅ Full |
| `typography` | ✅ Full |
| `security-blocked` | ✅ Full |
| `button-variants` | 🚧 Scaffolded — empty |
| `app-shell` | 🚧 Stub |
| `donate` | 🚧 Stub |
| `feedback-feature` | 🚧 Stub |
| `401` · `403` · `404` · `500` · `503` | ✅ Built |

---

## 7. Design Rules You Must Never Break

These 3 rules protect accessibility for your own vision. They override everything else.

| Rule | Detail |
|---|---|
| **No text smaller than `text-sm`** | `text-xs`, `text-[10px]`, `text-[11px]` are banned everywhere, no exceptions |
| **No washed-out text** | Body/label text on white must be `text-slate-700` minimum. Hints/placeholders: `text-slate-500` minimum |
| **No invisible borders** | Interactive elements (inputs, buttons, cards with actions) must have `border-slate-300` minimum |

### Color system (what's allowed):
- `slate-*` scale — fine-grained UI control
- CSS vars (`bg-background`, `text-foreground`, `bg-card`, etc.) — structural layout
- `rose-*` — errors / destructive actions
- `amber-*` — warnings
- `blue-*` — primary actions / CTAs
- Nothing else unless explicitly asked for

### Fonts (only these two, always):
- `font-sans` — Inter Variable — all body text and UI labels
- `font-display` — InterDisplay — headings and hero text
- Self-hosted from `/public/assets/fonts/`

---

## 8. Architecture Decisions — The "Why" Behind Key Choices

| Decision | Why |
|---|---|
| `x-bare-layout` stripped in middleware | Security. Prevents client from spoofing the header to bypass app shell |
| `/snippets` exits middleware before country gate | Snippets are dev tools. They don't need country context |
| `model.ts` in `components/report-ad/` not `lib/` | Keeps the feature self-contained. Only API routes import it. Client never touches it |
| `window.location.replace()` in BrowserGuard | Removes from browser history — back button can't return to unsupported state |
| `our-locations` frozen | Gopi wasn't happy with the feel on last review. Leave it until fresh-eyes session |
| Mongoose `globalThis` cache in `lib/db.ts` | Prevents duplicate connections on Next.js hot-reload |

---

## 9. Known Tech Debt (July 2026)

| Item | What needs doing |
|---|---|
| Dashboard pages | All stubs — need building |
| Auth pages | All stubs |
| Post Ad page | Stub |
| `our-locations` | Visual feel not finalised |
| `report-ad` reporterId | Hardcoded `null` — needs real session auth |
| Rate limiter in `/api/reports` | In-memory only — needs Upstash Redis for production |
| Tutorial detail pages | `/tutorials/[slug]` not built (404) |
| `button-variants` snippet | Scaffolded, empty |

---

## 10. Env Vars

All in `.env.local` — never committed to the repo.

```bash
MONGODB_URI=          # Mongoose connection (optional for local dev — mock data works without it)
COUNTRY_HEADER=       # Optional CDN header — skips client IP detection entirely
BASIC_AUTH_USER=      # Protects /snippets and /design-system
BASIC_AUTH_PASS=      # Same
```

---

## 11. Dev Commands

```bash
npm run dev     # Start dev server → localhost:3000
npm run build   # Production build (also type-checks)
npm run lint    # ESLint
```

---

## 12. Documentation Files — Complete Map

| File | Purpose | Auto-loaded? |
|---|---|---|
| `.github/copilot-instructions.md` | Copilot project brief | ✅ Every session |
| `.github/instructions/component-styling.instructions.md` | Styling + component rules for all *.tsx | ✅ Every *.tsx file |
| `AGENTS.md` | Next.js version warning | ✅ Every session |
| `md/context.md` | Full project bible — architecture, routes, components, data layer | No — read on request |
| `md/Owner-Bible.md` | This file — your operating manual | No — human-only |
| `md/about-me.md` | Gopi's profile and design philosophy | No |
| `/memories/repo/poc-next.md` | Copilot's session log | No — Copilot reads when needed |

### Skill Files — `.github/skills/` (load on demand)
> **Practical guide for using skills day-to-day → `md/Skills-Guide.md`**

| Skill | When to invoke |
|---|---|
| `la-new-feature` | Starting any new feature |
| `la-architecture-owner` | Architecture decisions, new routes, middleware, API design |
| `la-frontend-dev` | Building UI, components, Tailwind v4, TypeScript, accessibility |
| `la-devops-infra` | Deployment, env vars, MongoDB, email, cron, security |
| `la-mongodb` | Mongoose models, query patterns, indexes, schema migration |
| `la-seo` | Metadata, hreflang, JSON-LD, sitemaps, Core Web Vitals |
| `la-auth` | Session, API auth guards (4 levels), Server Component redirects |
| `la-ux-design` | UX decisions, design system inventory, branding, new component ritual |

### Copilot Skills (in `.github/skills/`)

Skills are loaded on-demand when you or Copilot invokes them by name.

| Skill | File | When to use |
|---|---|---|
| `la-new-feature` | `.github/skills/la-new-feature/SKILL.md` | Starting any new feature — runs the 12-step ritual |
| `la-architecture-owner` | `.github/skills/la-architecture-owner/SKILL.md` | Architecture decisions, new routes, middleware changes, API design, state planning |
| `la-frontend-dev` | `.github/skills/la-frontend-dev/SKILL.md` | Building UI, component layers, Tailwind v4, TypeScript, accessibility, co-location rules |
| `la-devops-infra` | `.github/skills/la-devops-infra/SKILL.md` | Deployment, env vars, MongoDB, email engine, cron jobs, country detection, security |
| `la-mongodb` | `.github/skills/la-mongodb/SKILL.md` | Mongoose model creation, query patterns, index checklist, denormalisation, schema migration |
| `la-seo` | `.github/skills/la-seo/SKILL.md` | Metadata API, hreflang (IN/GB/SG), JSON-LD, sitemaps, Core Web Vitals, POC→PROD URL migration |
| `la-auth` | `.github/skills/la-auth/SKILL.md` | Session reads, API auth guards (4 levels), Server Component redirects, session cookie spec |
| `la-ux-design` | `.github/skills/la-ux-design/SKILL.md` | UX decisions, design system component inventory, branding tokens, new component ritual, accessibility |

---

## 13. Shortcut Commands (say these verbatim to Copilot)

| Say this | What Copilot will do |
|---|---|
| `Update session log` | Append today's session entry to `/memories/repo/poc-next.md` |
| `Update route map` | Sync route map in both `copilot-instructions.md` and `md/context.md`, bump dates |
| `Update component list` | Sync la/ component list in both files |
| `Update context` | Update `md/context.md` architecture/env/stack sections + mirror summary to brief |
| `Update tech debt` | Update §12 in `md/context.md` |
| `Read context.md` | Copilot deep-reads `md/context.md` before starting complex work |
| `Full sync` | Copilot reads both files, checks for any drift, fixes inconsistencies, bumps all dates |

---

## 14. If Something Seems Wrong with Copilot's Behaviour

| Symptom | Fix |
|---|---|
| Copilot doesn't know the project | Check `.github/copilot-instructions.md` exists and is correct |
| Copilot uses wrong component (raw Radix instead of la/) | Check `.github/instructions/component-styling.instructions.md` has `applyTo: "components/**/*.tsx,app/**/*.tsx"` in frontmatter |
| Copilot uses outdated route names | Say `Update route map` — or manually update `copilot-instructions.md` Route Map |
| Copilot forgets something from last session | Say `Read /memories/repo/poc-next.md` — or update that file |
| Copilot keeps suggesting text-xs | The rule is in both `copilot-instructions.md` and `component-styling.instructions.md` — check both |
| Route map in brief vs context.md are out of sync | Say `Full sync` — Copilot reconciles both files |
| "Last synced" date is old (> 30 days) | Say `Full sync` |

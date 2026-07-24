---
name: la-ux-design
description: "Use when making any UX, design system, or branding decision in LokalAds poc-next: choosing the right component, designing a new pattern, evaluating visual consistency, assessing usability, or growing the design system. The combined UX Designer + Design Thinker + UX Architect guide for this codebase."
argument-hint: "What you are designing or the question (e.g. 'Which component for X', 'New pattern for Y', 'Does this feel right for the brand', 'How to show empty state')"
---

# LokalAds — UX Design & Design System Guide

> For: Gopi (Owner / UX Designer / Design Thinker) + Copilot working together on design decisions.
> Design system live reference: `/design-system/` (Basic Auth protected)
> Component inventory: `src/lib/design-system-menu.ts`
> Brand tokens: `src/app/globals.css` → `@theme inline` block + `--la-*` CSS vars

---

## The Three Lenses — Apply All Three Before Shipping Any UI

Every screen, component, and interaction must pass all three:

```
USEFUL    → Does it solve a real problem? Does the user actually need this?
USABLE    → Can the user complete the task without confusion or friction?
LOVABLE   → Does it feel good? Delightful? Something the user would recommend?
```

If it's only useful but not usable → frustration.
If it's usable but not lovable → forgettable.
If it's lovable but not useful → waste.

**Before building any new UI:** ask all three out loud. If you can't answer yes to all three, refine first.

---

## LokalAds Brand Voice — What This Product Feels Like

```
Trustworthy     → Clean, structured, nothing feels shifty or hidden
Approachable    → Warm, not corporate; friendly but not childish
Local           → Grounded in real people, real places, real things for sale
Confident       → Clear CTAs, no ambiguity about what to do next
Calm            → No aggressive popups, no dark patterns, no anxiety-inducing UX
```

**In visual terms:**
- Slate greys as the foundation → calm, premium, neutral
- Blue for action → trust, clarity, direction
- Rose for destructive / high-stakes → clear signal without panic
- Amber for caution / attention → warm, not alarming
- Inter (body) + InterDisplay (headings) → human, readable, modern
- Rounded corners (`rounded-full` on buttons/chips, `rounded-xl` on cards) → approachable
- Generous whitespace → breathing room, not cluttered

**Never:**
- Dark patterns (fake urgency, hidden costs, confusing opt-outs)
- Animations for their own sake — motion must serve communication
- Aggressive colour combinations that shout at the user
- Jargon in UI labels — plain English always

---

## The Design System — What Exists Today

### Primitives that DO NOT exist yet — check before building forms

| Missing | Impact | What to use instead (for now) |
|---|---|---|
| `LaCheckbox` | Any form with checkboxes (terms agreement, filter options, multi-select) | `components/ui/switch.tsx` wrapped in `LaField`, or a native `<input type="checkbox">` styled manually — STOP and tell owner a new `la/` primitive is needed |

> When `LaCheckbox` is built: add it to the inventory table above and remove this note.

---

### Layer 1 — `la/` Primitives (the atoms)

| Component | Variants / Key Props | When to use |
|---|---|---|
| `LaButton` | intent: `primary` `primary-blue` `primary-rose` `primary-amber` `secondary` `danger` `outline` `ghost` `link` · size: `mini` `compact` `default` `big` `bigger` `biggest` | Every interactive action |

> **Size note:** `mini` (10px) and `compact` (12px) sizes breach the `text-sm` accessibility minimum. Use `mini`/`compact` in design system demos only — never in product pages or feature components. Minimum product size is `default` (14px / `h-9`).
| `LaText` | type: `h1`–`h5` `body` `small` `muted` `label` `quote` `code` · `as` prop for semantic override | All typography — never raw `<p>` or `<h1>` in product pages |
| `LaBadge` | intent: `neutral` `info` `success` `warning` `danger` `brand` `purple` · variant: `soft` `solid` `outline` · size: `sm` `md` · `dot` | Status indicators, labels, tags |
| `LaChip` / `LaFilterChipStrip` | size: `sm` `default` · `onRemove` | Active filter pills, dismissible tags |
| `LaField` | `label` `error` `hint` `required` | Wraps every form input — never a naked input without LaField |
| `LaFieldGroup` | Groups related fields visually | Use when 2+ fields belong together (e.g. min/max price, first/last name) |
| `LaInput` | status: `default` `error` `success` | Text fields |
| `LaTextarea` | — | Multi-line text |
| `LaSelect` | status variants | Native select (desktop) |
| `LaSelectResponsive` | Drawer on mobile, `LaSelect` on md+ | Always use this instead of LaSelect when on a product page |
| `LaListSelect` | — | Large option sets with search |
| `LaRadio` | — | Single-choice selections |
| `LaMinMax` / `LaAmount` | — | Price range, numeric inputs |
| `LaTagInput` | — | Multi-value text tags |
| `LaCard` | — | `rounded-xl border-[1.5px] border-slate-300 bg-white` container |
| `LaSection` | `title` | Page section with `h2` heading |
| `LaTabs` | variant: `pill` `underline` `card` | Content tabs |
| `LaTokenRow` | `label` | Design system token display rows (design system only) |
| `LaPlaceHolder` | type: `text-input` `drop-down` `text-area` `amount-input` `date-input` | Wireframe / in-progress field placeholders |
| `LaSeparator` | — | Visual dividers |
| `LaAvatar` | — | User avatar with fallback initials |

### Layer 2 — `la-blocks/` Product Blocks (the molecules)

| Block | Purpose |
|---|---|
| `AppHeader` | Global header — `variant="default"` or `"simple"` |
| `AppFooter` | Global footer — `variant="default"` or `"simple"` |
| `CategoryGrid` | Home page category browse grid |
| `FeaturedListings` | Home page featured listing row |
| `RecentSearches` | Home page recent searches strip |
| `la-thumbnail-listing` | Listing card for grid/list views |
| `la-thumbnail-favourites` | Listing card with status badge for favourites |
| `la-listing-description` | Rich text description renderer |
| `la-relative-date` | Human-readable relative time (`2 days ago`) |
| `la-empty` | Empty state — intent: `default` `blue` `amber` `rose` `green` `purple` · size: `md` `sm` |
| `LegalDrawer` | Drawer for legal content |
| `Logo` | LokalAds logo component |
| `TimelineSheet` | Side sheet with timeline steps |
| `WhatsNext` | Post-action guidance block |
| `WhyLokalads` | Value proposition block |

### Layer 3 — `ui/` Raw Wrappers (never import in pages)
`button` · `card` · `dialog` · `drawer` · `field` · `input` · `otp-input` · `tabs` · `radio-group` · `sheet` · `switch` · `alert-dialog` · `alert` · `breadcrumb` · `pagination` · `scroll-area` · `sonner` · `toggle`

### Feature Components (self-contained)
`la-search-bar` · `location-picker` · `phone-number-input` · `phone-otp-v2` · `email-otp` · `rich-text-editor` · `responsive-dialog` · `avatar` · `country` · `browser-guard` · `overlay-country-select` · `collapsible` · `toggle-group` · `timeline` · `feedback` · `good-to-know` · `la-image-gallery` · `error-page` · `icons` · `date-input` · `create-alert` · `report-ad`

---

## Brand Tokens — The CSS Variables

All brand colours live in `src/app/globals.css`. Change here — every component updates.

```css
/* Primary button family */
--la-primary:             #18181b;   /* slate-900 — the default dark/black CTA */
--la-primary-hover:       #334155;   /* slate-700 */
--la-primary-fg:          #ffffff;

--la-primary-blue:        #2563eb;   /* blue-600  — trust, action, links */
--la-primary-blue-hover:  #1d4ed8;   /* blue-700 */

--la-primary-rose:        #f43f5e;   /* rose-500  — high stakes, favourites */
--la-primary-rose-hover:  #e11d48;   /* rose-600 */

--la-primary-amber:       #fbbf24;   /* amber-400 — caution, warm CTA */
--la-primary-amber-hover: #f59e0b;   /* amber-500 */
--la-primary-amber-fg:    #713f12;   /* yellow-900 — dark text on amber */

--la-danger:              #ef4444;   /* red-500   — destructive */
--la-danger-hover:        #dc2626;   /* red-600 */
```

**Retheme rule:** To update the brand colour, change ONLY these CSS vars — never hunt through component files.

> **Known palette inconsistency (do not copy):** `la-badge.tsx` (`success` intent) and `la-empty.tsx` (`green` intent) use `green-*` Tailwind classes. `green` is NOT in `COLOR_PALETTE.md` — only `emerald` is approved. These components pre-date the palette rule. Do NOT use `green-*` in any new component — use `emerald-*` for success/positive states instead.

---

## Choosing the Right Component — Decision Guide

### "I need a button"
```
High-emphasis primary action (one per screen)    → LaButton intent="primary"
Blue action / trust-building CTA                 → LaButton intent="primary-blue"
Delete / destructive action                      → LaButton intent="danger"
Secondary / less important action                → LaButton intent="secondary"
Inline text action (no visual weight)            → LaButton intent="link"
Icon-only action                                 → LaButton iconOnly + aria-label
```

### "I need to show a status"
```
Listing status, account status, moderation state → LaBadge (intent matches semantics)
Active filter the user can dismiss               → LaChip with onRemove
Category / topic pill (not dismissible)          → LaBadge intent="neutral" variant="soft"
```

### "I need to show content sections / tabs"
```
Main page tabs (e.g. All / India / UK / SG)      → LaTabs variant="underline"
Filter/toggle tabs (compact UI)                  → LaTabs variant="pill"
Segmented control look                           → LaTabs variant="card"
```

### "I need a select / dropdown"
```
Any product page (mobile users exist)            → LaSelectResponsive (drawer on mobile)
Design system demo only, or desktop-only UI      → LaSelect
Large option list with search                    → LaListSelect
```

### "I need to show nothing / empty state"
```
Always                                           → LaEmpty (never build a custom empty state)
Match intent to the section's brand colour:
  Favourites / saved         → intent="rose"
  Active listings            → intent="blue"
  Chat / messages            → intent="brand" (amber)
  Search results             → intent="default"
```

### "I need a form field"
```
Every input, select, radio, textarea             → wrap in LaField
LaField renders the label, hint, and error       → never build these manually
```

### "I need to show a page section with heading"
```
                                                 → LaSection (never raw <section> + <h2>)
```

---

## UX Patterns — How We Do Things Here

### Information hierarchy on listing pages
```
1. Image gallery (takes full attention first)
2. Title + price (LaText h2/h3 + LaText body)
3. Location + relative date (LaText small, la-relative-date)
4. Key details (LaBadge or key-value table)
5. Description (la-listing-description)
6. Seller card (LaCard + LaAvatar)
7. CTA (LaButton primary-blue "Contact Seller")
```

### Forms
```
- One column on mobile, two on md+ for multi-field forms
- Label above input always (not inline/floating — accessibility)
- Error message below the field (LaField handles this)
- Required fields marked with * in the label
- Destructive submit (delete, report) → always use LaButton intent="danger"
- Primary submit → LaButton intent="primary" or "primary-blue"
- Never two primary CTAs side by side — one primary, one secondary/outline
```

### Loading states
```
- Button loading → LaButton loading={true} (built-in spinner)
- Full section loading → LaPlaceHolder (wireframe skeleton)
- List loading → repeat LaPlaceHolder cards in a grid
- Never blank white screens — always show a loading state
```

### Empty states
```
- Always LaEmpty — never a blank white area
- icon → use a contextual Lucide icon (Heart for favourites, Car for cars, etc.)
- description → tell the user WHY it's empty + what they can do
- action → always provide a way forward (Browse, Post an Ad, Search)
```

### Responsive behaviour
```
- Mobile first — design for 375px, enhance for larger
- Filter panels → hidden on mobile (drawer/sheet), sidebar on lg+
- CTAs → full-width on mobile, auto-width on md+
- Navigation → bottom tabs on mobile, top nav on lg+
- Drawers (vaul) on mobile for: select, bottom sheets, filter panels
```

### Dialogs vs Drawers vs Sheets
```
Confirmation (small, 1–2 lines) → Dialog
Form / multi-step on mobile     → Drawer (vaul, slides up from bottom)
Side panel / detail view        → Sheet (slides from right)
Use ResponsiveDialog for:       → Dialog on desktop, Drawer on mobile automatically
```

---

## Growing the Design System — The Ritual

### Before creating ANY new component, answer these 5 questions:

1. **Does it already exist?** Check `/design-system/` and `src/components/la/` first. Read `COLOR_PALETTE.md`.
2. **Is it a variant of something existing?** Prefer adding a prop to `LaButton`, `LaBadge`, etc. over creating a new file.
3. **Is it product-specific or reusable?** Product-specific → co-locate with the page. Reusable → `la/` or `la-blocks/`.
4. **Does it fit the brand?** Check against Brand Voice + Token rules above before writing a line.
5. **Is it accessible?** Low-vision owner — minimum `text-sm`, minimum `text-slate-700`, visible focus ring, meaningful alt.

### If all 5 say GO — the build checklist:
- [ ] Component lives in `src/components/la/` (primitive) or `src/components/la-blocks/` (product block)
- [ ] Uses only approved colour families from `COLOR_PALETTE.md`
- [ ] Uses only `--la-*` CSS vars for brand colours (not hardcoded hex)
- [ ] CVA used for variants — `intent` for semantic meaning, `variant` for visual style, `size` for sizing
- [ ] `cn()` from `@/lib/utils` for className merging
- [ ] Exported from `src/components/la/index.ts` barrel
- [ ] Demo page created in `/design-system/` (required — not optional)
- [ ] Entry added to `src/lib/design-system-menu.ts`
- [ ] Minimum text size `text-sm` — no `text-xs` in the component itself
- [ ] Focus ring on interactive elements: `focus-visible:ring-2 focus-visible:ring-offset-2`

### Naming convention for variants:
```
intent    → WHAT it means (neutral, info, success, warning, danger, brand)
variant   → HOW it looks (soft, solid, outline)
size      → HOW BIG it is (mini, compact, default, big, bigger, biggest) or (sm, md, lg)
```
Never use colour names as variant values (`blue`, `red`) — use semantic intent names (`info`, `danger`).

---

## Accessibility — Overrides Everything

> Owner has low vision (~50%). These are not preferences — they are non-negotiable constraints.

```
Minimum font size:   text-sm (14px) — text-xs is BANNED, no exceptions
Body text on white:  text-slate-700 or darker — never text-slate-400 or lighter
Hint / placeholder:  text-slate-500 minimum
Icons (meaningful):  text-slate-500 minimum + aria-label
Interactive border:  border-slate-300 minimum — never border-slate-100 as the only visual
Labels:              font-medium or font-semibold — never font-light / font-normal
Focus rings:         visible on ALL interactive elements — never remove outline without replacement
Tap targets:         minimum 44×44px on mobile — use h-9 (36px) as absolute floor, h-12 for primary CTAs
Contrast:            text-slate-700 on white ≈ 4.5:1 minimum (WCAG AA)
```

**When unsure:** go larger, go darker, go bolder. Always.

---

## Design System Health Checks — Run These Regularly

- [ ] Is every new `la/` component demoed in `/design-system/`?
- [ ] Is every new component in `design-system-menu.ts`?
- [ ] Are any hardcoded hex colours used that should be `--la-*` vars?
- [ ] Are any colour families used that aren't in `COLOR_PALETTE.md`?
- [ ] Is `text-xs` appearing anywhere new?
- [ ] Is `text-slate-400` used for readable text anywhere?
- [ ] Do all new interactive elements have focus rings?
- [ ] Are buttons still using `rounded-full` (brand shape)?
- [ ] Are cards still using `rounded-xl border-[1.5px] border-slate-300`?

---

## How This Skill Evolves — Self-Update Protocol

> **This file is a living document. Copilot updates it automatically — no instruction from the owner needed.**

### Triggers — update this file when any of these happen
- A new `la/` primitive or `la-blocks/` component is added to the design system
- A new variant, intent, or size is added to an existing component
- A new CSS brand token (`--la-*`) is added to `globals.css`
- A new UX pattern is established and confirmed by the owner (e.g. new empty state treatment, new modal pattern)
- A branding decision is made (e.g. new accent colour approved, animation style decided)
- An accessibility violation is caught and a better rule is identified
- The design system menu (`design-system-menu.ts`) gets a new section or entry
- A component is deprecated or replaced by a better one
- A new approved colour family is added to `COLOR_PALETTE.md`
- The owner confirms a visual/UX direction that should be the standard going forward

### How to update
1. Edit the relevant section directly — keep it concise
2. Add the new component to the inventory table when it's built
3. Add the new token to the Brand Tokens section when it's added to `globals.css`
4. Replace outdated patterns — never leave contradictions
5. Add a `> Updated: YYYY-MM-DD — [what changed and why]` note at the top of the changed section

### What NOT to add
- Unconfirmed design directions — mark as `[PROPOSED]` until owner confirms
- One-off styling decisions that don't generalise — if it happened once, it's not a pattern yet
- Anything the owner has explicitly said NOT to do

---
applyTo: "components/**/*.tsx,app/**/*.tsx"
---

# Component & Page Rules — poc-next

When creating or editing any component or page, you **must** derive all styling decisions from the patterns already established in this codebase. Do not introduce arbitrary colors, spacing, or structure. Follow these rules religiously.

---

## 0. Component Layer Hierarchy — Read This First

There are **3 tiers** of components. Always use the highest available tier for what you're building.

### Tier 1 — `components/la/` — LokalAds Design System (preferred for product UI)
These are LokalAds-branded components. **For any product page or feature component, check here first.**

```tsx
// ✅ Prefer these for all product/feature UI
import { LaButton } from "@/components/la/la-button";
import { LaField } from "@/components/la/la-field";
import { LaInput } from "@/components/la/la-input";
import { LaTextarea } from "@/components/la/la-textarea";
import { LaSelect } from "@/components/la/la-select";
import { LaChip } from "@/components/la/la-chip";
import { LaBadge } from "@/components/la/la-badge";
import { LaTagInput } from "@/components/la/la-tag-input";
import { LaText } from "@/components/la/la-text";
// All available via barrel: import { LaButton, LaField, ... } from "@/components/la";
```

Available `la/` components:
`LaButton` · `LaText` · `LaField` · `LaInput` · `LaTextarea` · `LaSelect` · `LaRadio`  
`LaChip` · `LaBadge` · `LaTagInput` · `LaMinMax` · `LaAmount` · `LaTokenRow`  
`LaSelectResponsive` · `LaListSelect` · `LaSeparator` · `la-section` · `la-tabs`  
`la-avatar` · `la-card` · `la-placeholder`

### Tier 2 — `components/la-blocks/` — Product Page Sections
Pre-assembled blocks. Use directly in product pages.
`AppHeader` · `AppFooter` · `CategoryGrid` · `FeaturedListings` · `RecentSearches`  
`la-thumbnail-listing` · `la-thumbnail-favourites` · `LegalDrawer` · `WhatsNext` · etc.

### Tier 3 — `components/ui/` — shadcn Primitives (base layer only)
Used internally by `la/` components. **Do not import in pages or feature components.**  
Only reach here if building a new `la/` component or a `components/ui/` wrapper itself.

---

## 0b. Co-location Rule

**If a component is only ever used by one page — it lives next to that page, not in `components/`.**

Next.js App Router makes only `page.tsx` a public route. Every other `.tsx` file in the same folder is private. Use this to co-locate page-specific components:

```
app/(auth)/register/
  page.tsx          ← public route
  JoinStep.tsx      ← private, only used by this page — lives here
  create/
    page.tsx
    CreateAccountStep.tsx
```

`components/` is reserved for: design system primitives (`la/`), blocks (`la-blocks/`), shadcn wrappers (`ui/`), and feature components that are reused across multiple pages.

---

## 0c. Layout Rule — NEVER add a sub-shell

**`app/layout.tsx` owns the one and only AppHeader + AppFooter. Never create a nested `layout.tsx` that re-renders them.**

The root layout reads middleware signals to change its behaviour:

| Need | Correct approach |
|---|---|
| No header/footer | Add route to `BARE_LAYOUT_ROUTES` in `proxy.ts` |
| Simple header/footer | Add route to `SIMPLE_LAYOUT_ROUTES` in `proxy.ts` |
| Custom shell for one route group | Signal via middleware header → root layout reads it |

**Before creating any `layout.tsx` in a subtree — read `app/layout.tsx` first.** If it already renders a shell, signal it to change instead of adding another.

### Server flag vs client `usePathname()` — CRITICAL

Server-side flags (`isSimpleLayout`, `isBareLayout`) are read **once on initial server render**. After that, soft navigation via `<Link>` never re-runs the server layout — the flag stays frozen.

```
❌ WRONG — causes stale layout on soft navigation
// In app/layout.tsx (Server Component)
<main className={isSimpleLayout ? "flex items-center ..." : "flex-1"}>
  {children}
</main>
// If user navigates /register → / via <Link>, isSimpleLayout is still true — landing page breaks

✅ CORRECT — client component owns its own layout
// In RegisterStep.tsx ("use client")
// Component wraps itself in its own centering div
// root <main> stays plain flex-1 always
// usePathname() in AppHeader/AppFooter handles variant switching reactively
```

**Rule:** If a layout/style decision changes on navigation — it belongs in a `"use client"` component using `usePathname()`, never in a server layout flag.

---

## 0d. Missing Component Rule — STOP and confirm

**Never build a one-off UI element inline inside a page when a reusable primitive is the right answer.**

Decision flow before writing any UI:

```
Need a UI element?
  ↓
  Is it in la/ or components/?  ── YES → Use it
  ── NO
     ↓
     STOP → Tell user what’s missing → get confirmation
     ↓
     Build it in components/la/ (primitive) or components/ (feature)
     ↓
     Add demo page in /design-system/ + entry in lib/design-system-menu.ts
     ↓
     NOW use it in the feature
```

---

## 0e. API Rule — Never call external APIs from components

**Pages and components must never contain raw `fetch('https://...')` calls to external services.**

```tsx
// ❌ WRONG — never do this in a page or component
const res = await fetch("https://api.ipinfo.io/...");

// ✅ CORRECT — proxy through an app/api/ route handler
const res = await fetch("/api/places?q=london");
```

API route handlers own: auth headers, API keys, error handling, rate limiting, data sanitisation.

---

## 0f. Page Imports — ONLY from `components/*` (with a carved-out icon/Radix exception)

**This is the most critical rule. It is non-negotiable for UI primitives — buttons, dialogs, drawers, inputs, fields, cards, etc.**

When building any page (`app/**/*.tsx`) or any new component (`components/**/*.tsx`):

- **ONLY** import UI primitives, wrappers, and building blocks from `components/*`
- **NEVER** import a styled/behavioural primitive directly from an external library inside a page or feature component — wrap it in `components/ui/` first

```tsx
// ✅ CORRECT
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { PhoneNumberInput } from "@/components/phone-number-input";
import { Timeline } from "@/components/timeline/Timeline";

// ❌ WRONG — never do this in a page or feature component
import { Drawer } from "vaul";
import { Input } from "some-ui-lib";
import { Button } from "shadcn/ui";
```

> **Exception — icons and unstyled Radix primitives:** `lucide-react` icons and bare `@radix-ui/*` primitives (e.g. `@radix-ui/react-dialog`, `@radix-ui/react-tabs`) may be imported directly in pages and feature components — these ship with no visual styling of their own, so there's nothing to "wrap" until you apply classes. This reflects actual practice across the codebase (icons and one-off Radix usages in listing/report-ad/create-alert/register flows). **Still wrap in `components/ui/` once a pattern is reused in 2+ places** — at that point it's a shared primitive, not a one-off, and belongs in `components/ui/` like `dialog.tsx` or `tabs.tsx` already do.

If a UI primitive you need does not exist in `components/ui/`, **create it there first**, wrapping the underlying library, before using it in a page. The `components/ui/` folder is the single source of truth for all *shared, reusable* UI primitives in this project.

The only allowed direct external imports in any file are:
- `react` / `react-dom`
- `next/*` (Link, Image, navigation, etc.)
- `@/lib/*` (utils, hooks, stores, constants)
- `lucide-react` (icons)
- `@radix-ui/*` (unstyled primitives — see exception above; still prefer `components/ui/` for anything reused)
- Type-only imports (`import type { ... }`)

---

## 1. Always Use `cn()` for className

Import from `@/lib/utils`. Never concatenate strings manually.

```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-classes", conditional && "extra-class", className)} />
```

---

## 2. Color Palette — Two Layers, Both in Use

**Semantic CSS vars** (from `globals.css` / shadcn tokens) — prefer for structural/layout elements:

| Token | Use for |
|---|---|
| `bg-background` | page/screen background |
| `bg-card` | card surfaces |
| `text-foreground` | primary text |
| `text-muted-foreground` | secondary / helper text |
| `border-border` | default border color |
| `bg-accent/50` | hover backgrounds |
| `bg-muted` | subtle fill (tags, chips) |

**Tailwind `slate-*` scale** — use for fine-grained control within components:

| Range | Use for |
|---|---|
| `slate-900` | headings, strong labels |
| `slate-700` | body text, form labels |
| `slate-500` | secondary/supporting text |
| `slate-400` | placeholder, meta, quiet text |
| `slate-200` | borders, dividers |
| `slate-100` | subtle backgrounds |
| `slate-50` | near-white backgrounds |

**Never** introduce colors outside `slate-*` or the semantic tokens above unless explicitly asked.

---

## 3. Typography

Match these exact patterns — do not invent new ones:

```tsx
// Page headline
<h1 className="text-2xl font-bold tracking-tight text-foreground" />
// or for snippet pages:
<h1 className="text-5xl font-extrabold font-display text-foreground leading-tight tracking-tight" />

// Sub-header / card title
<h2 className="text-base font-semibold text-slate-900" />

// Section label (mono caps)
<p className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground" />

// Body / description
<p className="text-sm text-muted-foreground" />

// Form label
<label className="text-sm font-medium text-slate-700" />

// Meta / quiet
<span className="text-sm text-slate-500" />

// Hint / supporting copy
<p className="text-sm text-slate-500" />
```

> **See Section 13 for hard accessibility minimums that override everything above.**

---

## 4. Spacing & Layout

- **Page wrapper**: `min-h-screen bg-background` → `max-w-* mx-auto px-6 py-16`
- **Card/list item padding**: `px-4 py-3.5` (default row), `px-6` (card body)
- **Stacked list gap**: `space-y-2`
- **Form field gap**: `flex flex-col gap-2` (Field), `flex flex-col gap-4` (FieldGroup)
- **Section bottom margin**: `mb-8` between sections, `mb-14` for hero/header block

---

## 5. Border Radius

| Shape | Class |
|---|---|
| Cards, panels | `rounded-lg` or `rounded-xl` |
| Modals / drawers | `rounded-2xl` |
| Buttons (pill) | `rounded-full` |
| Tags / badges | `rounded` or `rounded-md` |
| Inputs | `rounded-lg` |

---

## 6. Borders & Dividers

```tsx
// Standard border
<div className="border border-border" />
// Subtle inner border  
<div className="border border-slate-200" />
// Hairline on white
<div className="border border-slate-900/10" />
// Vertical divider
<div className="w-px h-7 bg-slate-100" />
// Horizontal rule in list
<div className="divide-y divide-border" />
```

---

## 7. Shadows

- Use `shadow-sm` on cards and floating panels
- Avoid `shadow-md` or larger unless building a modal/popover
- Drawers and dialogs use the default shadcn elevation (no additional shadow needed)

---

## 8. Interactive / Hover States

```tsx
// Nav card / list row
className="hover:bg-accent/50 transition-colors"

// Icon or text link  
className="text-muted-foreground hover:text-foreground transition-colors"

// Button (use <Button> from components/ui/button — never hand-roll)
```

---

## 9. Base UI Components — Always Prefer Over Hand-Rolled

Check `components/ui/` before building anything new:

| Need | Use |
|---|---|
| Button | `components/ui/button.tsx` |
| Card surface | `components/ui/card.tsx` |
| Modal | `components/ui/dialog.tsx` |
| Bottom sheet | `components/ui/drawer.tsx` |
| Form field wrapper | `components/ui/field.tsx` |
| Text input | `components/ui/input.tsx` |
| OTP input | `components/ui/otp-input.tsx` |
| Tabs | `components/ui/tabs.tsx` |
| Toast | (removed) |
| Radio | `components/ui/radio-group.tsx` |
| Side sheet | `components/ui/sheet.tsx` |

Compose these primitives; do not duplicate their structure inline.

---

## 10. Skeletons / Loading States

```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 w-2/5 rounded-md bg-slate-400" />
  <div className="h-3 w-full rounded-full bg-slate-300" />
  <div className="h-3 w-4/5 rounded-full bg-slate-300" />
</div>
```

Use `bg-slate-400` for darker skeleton elements, `bg-slate-300` for body lines.

---

## 11. Component File Structure

```tsx
// 1. Imports
import { cn } from "@/lib/utils";

// 2. Types / interfaces

// 3. Sub-components (if any) — named, not default
function SubThing({ ... }: Props) { ... }

// 4. Main export — always default
export default function MyComponent({ ... }: Props) { ... }
```

For base `components/ui/` primitives, use `React.forwardRef` + `cn()`.

---

## 12. What NOT to Do

- Do not use arbitrary colors (`text-red-500`, `bg-blue-100`) unless a semantic meaning demands it (errors = `text-destructive`, etc.)
- Do not use `style={{}}` inline styles — use Tailwind
- Do not add `shadow-lg`, `shadow-xl` casually
- Do not introduce new font families — only `font-sans` (Inter) and `font-display` (Inter Display) are configured
- Do not use `p-8` or larger padding on internal component elements without a strong reason
- Do not hardcode px/rem values — use the Tailwind scale

---

## 13. Accessibility Minimums — Non-Negotiable

> These rules exist because users with low vision use this product. They **override** any conflicting pattern in the sections above. When in doubt, go bigger and darker.

### Font Size

| Rule | Detail |
|---|---|
| **Minimum for all text** | `text-sm` (14px) — zero exceptions |
| **Banned outright** | `text-xs`, `text-[10px]`, `text-[11px]` — everywhere, no exemptions |

```tsx
// ✅ CORRECT
<p className="text-sm text-slate-500">Hint text</p>

// ❌ WRONG — all of these are banned
<p className="text-xs text-slate-400">Hint text</p>
<span className="text-[11px] text-slate-500">Pill label</span>
<span className="text-[10px] font-bold">1</span>
```

### Borders

- Interactive elements must have a visible border: `border-slate-300` minimum
- Disabled inputs: `border-slate-200` is OK (non-interactive)
- Never use `border-slate-100` as the only visual boundary of a focusable element

### Checklist Before Committing

- [ ] No `text-xs` / `text-[10px]` / `text-[11px]` anywhere — use `text-sm` as the hard floor

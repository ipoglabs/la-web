# Component Architecture — The Three-Layer System

> What belongs where, why the layers exist, and the non-negotiable import rules.  
> Last updated: 2026-07-07

---

## The Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3 · components/ui/   — shadcn / Radix primitives     │
│  Raw headless wrappers. No LokalAds styling. No direct use  │
│  in pages or features.                                       │
└────────────────────────────┬────────────────────────────────┘
                             │ consumed by ↓
┌────────────────────────────▼────────────────────────────────┐
│  Layer 1 · components/la/  — LokalAds Design System         │
│  Styled, accessible, CVA-variant primitives.                │
│  The default choice for ALL product UI.                     │
└────────────────────────────┬────────────────────────────────┘
                             │ consumed by ↓
┌────────────────────────────▼────────────────────────────────┐
│  Layer 2 · components/la-blocks/ — Page Section Components  │
│  Assembled from la/ primitives. Real product sections:      │
│  AppHeader, CategoryGrid, FeaturedListings, etc.            │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ + Feature Components (self-contained)
                             │   components/create-alert/
                             │   components/location-picker/
                             │   components/avatar/
                             │   etc.
```

---

## What Belongs in Each Layer

### `components/ui/` — Layer 3 (headless wrappers)

- Direct Radix UI + vaul wrappers with minimal Tailwind
- No LokalAds-specific tokens or CVA variants
- Examples: `button`, `dialog`, `drawer`, `sheet`, `tabs`, `otp-input`
- **Rule: Never import from `components/ui/` in a page or feature component**

### `components/la/` — Layer 1 (design system primitives)

- Every primitive a page or feature will ever need
- CVA variants using LokalAds tokens (`slate-*`, semantic CSS vars)
- All accessibility rules applied (minimum `text-sm`, contrast, focus rings)
- Examples: `LaButton`, `LaText`, `LaField`, `LaBadge`, `LaChip`
- **Rule: Prefer `la/` over `ui/` in all product code**

### `components/la-blocks/` — Layer 2 (product page sections)

- Assembled from `la/` primitives + `ui/` where needed
- Each block is a self-contained product section with real data
- Examples: `AppHeader`, `CategoryGrid`, `FeaturedListings`, `RecentSearches`
- **Rule: Never add AppHeader/AppFooter in a sub-layout — use the root `app/layout.tsx`**

### Feature components (self-contained modules)

- Complex UI flows with their own state, hooks, and sub-components
- Each has an `index.ts` barrel export
- Examples: `create-alert/`, `location-picker/`, `avatar/`, `email-otp/`
- **Rule: If only used by one page — co-locate next to `page.tsx`, not in `components/`**

---

## The Import Hierarchy

```
Pages / Route components
  → import from components/la-blocks/*
  → import from components/[feature]/* (barrel index.ts)
  → import from components/la/*          ← primitives directly when needed
  → NEVER import from components/ui/*
  → NEVER import from radix / vaul directly

components/la-blocks/*
  → import from components/la/*
  → import from components/ui/*          ← OK here
  → NEVER import from radix directly

components/la/*
  → import from components/ui/*          ← OK here
  → may import from radix directly       ← OK here (la/ IS the wrapper)
```

### The one rule in code

```ts
// ✅ In a page
import { LaButton } from "@/components/la";
import { AppHeader } from "@/components/la-blocks/AppHeader";
import { LocationPicker } from "@/components/location-picker";

// ❌ Never in a page
import { Button } from "@/components/ui/button";        // use LaButton
import * as Dialog from "@radix-ui/react-dialog";        // use components/ui/dialog
```

---

## When to Create Something New

| Situation | Where it goes | Rule |
|---|---|---|
| New UI primitive needed | `components/la/` | STOP — confirm with owner first. Add design-system demo. |
| New reusable block (2+ pages) | `components/la-blocks/` | STOP — confirm with owner first. |
| Feature used on one page only | Co-locate with `page.tsx` | No `components/` entry needed |
| Feature used on 2+ pages | `components/[feature-name]/` | STOP — confirm with owner first. Add design-system/snippets demo. |
| New shadcn/Radix primitive | `components/ui/` | Never expose directly to pages |

---

## Design System Demo Rule

> **Every new `la/` primitive must have a demo in `/design-system/`.**  
> **Every new reusable feature component must have a demo in `/design-system/` or `/snippets/`.**  
> Add the entry to `lib/design-system-menu.ts` — if it's not demoed, it doesn't exist for contributors.

---

## Folder Reference

```
components/
  la/              Layer 1 — design system primitives   → 02-la-primitives.md
  la-blocks/       Layer 2 — page section components    → 03-la-blocks.md
  ui/              Layer 3 — shadcn / Radix wrappers
  [feature]/       Feature components with barrel export → 04-feature-components.md
```

---
name: la-frontend-dev
description: "Use when building UI in LokalAds poc-next: creating components, styling with Tailwind v4, using the la/ design system, writing TypeScript, following import rules, co-location rules, and accessibility standards. The essential guide for any developer touching the frontend."
argument-hint: "What you are building or the question you have (e.g. 'New card component', 'How to style this', 'Where does this component live')"
---

# LokalAds — Frontend Developer Guide

> For: Any dev working on the UI layer.
> Also used by Copilot to enforce conventions during every coding session.

---

## The 3-Layer Component System — Understand This First

```
Layer 1  →  src/components/la/          LokalAds Design System Primitives
Layer 2  →  src/components/la-blocks/   Product Page Sections + Blocks
Layer 3  →  src/components/ui/          Raw shadcn/Radix wrappers (DO NOT use directly in pages)
```

### The Import Rule — Non-Negotiable (with a carved-out icon/Radix exception)

```
Pages + feature components  →  import from @/components/la/  or  @/components/la-blocks/
Never import vaul or shadcn-styled primitives directly in a page or feature component
Always wrap in components/ui/ first if a new styled primitive is needed

Exception: lucide-react icons and bare @radix-ui/* primitives may be imported
directly — they ship unstyled, so there's nothing to wrap until classes are applied.
Still move to components/ui/ once the same pattern is reused in 2+ places.
```

### When to Use What

| I need... | Use |
|---|---|
| A button, text, badge, chip, field, input | `@/components/la` |
| A header, footer, listing card, category grid | `@/components/la-blocks` |
| A dialog, sheet, drawer, tabs | `@/components/ui` (wrapped — never import styled Radix/vaul directly) |
| An icon | `lucide-react` directly is fine — no wrapping needed |
| Something that doesn't exist in `la/` | **STOP — tell the owner. Do not invent a one-off.** |

---

## Tailwind v4 — Key Differences from v3

This project uses **Tailwind CSS v4**. It is CSS-first. There is no `tailwind.config.js`.

**What changed:**
- No `tailwind.config.js` — configuration lives in `src/app/globals.css` via `@theme`
- No `theme.extend` — add custom tokens directly in CSS vars
- Arbitrary values still work: `w-[320px]`, `text-[15px]`
- All design tokens (colors, radius, fonts) are CSS variables

**What stays the same:**
- All utility classes work as expected: `flex`, `gap-4`, `text-slate-700`, etc.
- `cn()` from `@/lib/utils` for conditional classes — always use this, never string concat

**In practice:** You write Tailwind exactly as before. The only difference is you never touch `tailwind.config.js` because it doesn't exist.

---

## Color System — Use These, Only These

### Structural (CSS vars — for layout)
```
bg-background      text-foreground
bg-card            text-card-foreground
bg-muted           text-muted-foreground
border-border
```

### Content (slate scale — for component detail)
```
text-slate-900    headings, primary labels
text-slate-700    body text, secondary labels     ← minimum for readable text
text-slate-500    placeholder, hint text          ← minimum for hint/placeholder
text-slate-400    decorative only — NEVER for readable text
bg-slate-50       subtle backgrounds
bg-slate-100      code blocks, chip backgrounds
border-slate-200  dividers
border-slate-300  interactive borders             ← minimum for interactive borders
```

### Semantic
```
rose-*     destructive / error / delete
amber-*    warning / caution
blue-*     action / CTA / links
```

**Never use arbitrary color values.** Never use colours outside this system unless explicitly requested by the owner.

---

## Accessibility — Hard Rules (Low-Vision Owner — These Override Everything)

```
✗  text-xs, text-[10px], text-[11px], text-[12px]  — BANNED everywhere
✓  text-sm (14px) is the absolute minimum

✗  text-slate-300, text-slate-400 for readable text  — BANNED
✓  text-slate-700 minimum for text on white

✗  border-slate-100 as only visual boundary
✓  border-slate-300 minimum for interactive borders

✓  Labels: prefer font-medium or font-semibold over font-light / font-normal
✓  Every interactive element: visible focus ring
✓  Every icon with meaning: aria-label or title
✓  Every image: meaningful alt text (not empty unless decorative)
```

If you are ever unsure — go larger, go darker, go bolder.

---

## Typography — Two Fonts Only

```
font-sans      →  Inter Variable (body, labels, UI text)
font-display   →  InterDisplay (headings, hero text)
```

No other font families. Ever.

---

## Co-location Rule

**If a component is only used by one page — it lives next to that page, not in `components/`.**

```
app/(main)/listings/[listingId]/
  page.tsx
  SimilarListingsRow.tsx    ← used only by this page → lives here
  SellerCard.tsx            ← used only by this page → lives here

components/
  report-ad/                ← used on listings + has own API → lives in components/
  la-search-bar/            ← used on home + listings → lives in components/
```

`components/` is for: design system primitives, reusable feature components, and anything used by 2+ pages.

---

## TypeScript Conventions

```typescript
// Types from canonical sources — never redefine locally what's already in types/
import type { Listing, ListingStatus, Seller } from "@/types/listing";

// Component props — always explicit interfaces
interface MyComponentProps {
  title: string;
  status?: ListingStatus;   // use canonical type, not "active" | "closed"
}

// Avoid `any` — if you must cast, use `unknown` first then narrow
// Avoid non-null assertion (!) unless you are certain — document why

// Server Components — async functions, can await
// Client Components — must have "use client" at top, cannot be async
```

---

## New Component Checklist

Before creating any new component, answer these:

1. **Does it already exist in `la/` or `la-blocks/`?** → Use it. Don't recreate.
2. **Is it a one-off for one page?** → Co-locate it next to the page.
3. **Will it be used on 2+ pages?** → STOP. Confirm with owner. Build in `components/`.
4. **Is it a new design system primitive?** → STOP. Confirm. Build in `la/`. Add demo in `/design-system/`.
5. **Does it need an API?** → Create `app/api/[name]/route.ts` first.

---

## Design System Demo Rule

**Every new `la/` primitive → must have a demo page in `/design-system/`.**
**Every new reusable feature component → must have a demo in `/design-system/` or `/snippets/`.**

Add the entry to `src/lib/design-system-menu.ts` so it appears in the design system nav.

If it's not demoed, it doesn't officially exist for future contributors.

---

## Form Handling

Forms in this codebase submit via `fetch()` to `/api/` routes. **Server Actions are not used for data mutations** — all writes go through API routes (auth, rate limiting, and validation live there).

### Basic controlled form pattern
```tsx
"use client";
import { useState } from "react";
import { LaField } from "@/components/la";
import { LaInput } from "@/components/la";
import { LaButton } from "@/components/la";

export function ContactForm() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!value.trim()) {
      setError("This field is required");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: value }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <LaField label="Message" error={error} required>
        <LaInput value={value} onChange={e => setValue(e.target.value)} />
      </LaField>
      <LaButton type="submit" loading={loading}>Send</LaButton>
    </form>
  );
}
```

### Error display — always via `LaField`
```tsx
// Pass error string to LaField — it renders below the input in rose-600
<LaField label="Email" error={errors.email}>
  <LaInput type="email" value={email} onChange={...} />
</LaField>
```

### `src/lib/validation.ts` — use these utilities
```typescript
import { isValidEmail, isValidPhone, normalizePhoneDigits } from "@/lib/validation";

isValidEmail("foo@bar.com")    // → true
isValidPhone("+44 7700 900000") // → true (min 6 digits after stripping non-digits)
normalizePhoneDigits("+44 770") // → "44770" (strips spaces, +, dashes)
```

**Rules:**
- Client-side validation is for UX only — always re-validate in the API route
- Never put form submission logic in a Server Component — forms must be client components
- Multi-step forms: use `useState` for step tracking, Zustand only if data must persist across page navigations

---

## Images — `next/image` Rules

Always use `<Image>` from `next/image`. Never use `<img>` directly.

```tsx
import Image from "next/image";

// Above-fold hero image — add priority to prevent LCP penalty
<Image
  src={listing.images[0].src}
  alt={listing.title}             // always meaningful — never empty for content images
  priority                        // preloads — use ONLY on the first visible image per page
  fill                            // use inside a positioned container with explicit aspect ratio
  sizes="(max-width: 768px) 100vw, 60vw"  // always include — prevents oversized downloads
/>

// Container for fill images — always set aspect ratio to prevent CLS
<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
  <Image src={...} alt={...} fill sizes="..." />
</div>

// Below-fold thumbnail — no priority
<Image
  src={card.image}
  alt={card.title}
  width={400}
  height={300}
  sizes="(max-width: 640px) 50vw, 25vw"
/>
```

**Rules:**
- `priority` → only the first visible image per page (listing hero, listing card row 1)
- `sizes` → always provide — without it Next.js downloads full-width images on mobile
- `alt` → required and meaningful for all content images; `alt=""` only for purely decorative
- Image containers → always set explicit dimensions or `aspect-*` class to prevent CLS
- Cloudflare image URLs → pass directly as `src` — Next.js `<Image>` handles optimisation

---

## Responsive Breakpoints

Tailwind v4 default breakpoints — mobile-first (no prefix = all sizes):

| Prefix | Min-width | Typical target |
|---|---|---|
| *(none)* | 0px | Mobile portrait |
| `sm:` | 640px | Mobile landscape / large phone |
| `md:` | 768px | Tablet portrait |
| `lg:` | 1024px | Tablet landscape / small laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Large desktop |

```tsx
// Mobile-first pattern — start with mobile, add breakpoints for wider
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

// Text sizing — never go below text-sm
<p className="text-sm md:text-base">

// Stack → row on tablet+
<div className="flex flex-col md:flex-row gap-4">

// Hidden on mobile, visible on desktop
<aside className="hidden lg:block">
```

**Rules:**
- Always design mobile-first — base styles for mobile, breakpoint prefixes for wider
- Never use `max-*:` breakpoints unless absolutely necessary (they invert the pattern)
- Use `md:` as the primary layout break — most filter panels and sidebars appear at `md:`

---

## Quick Reference — Where Things Live

```
src/components/la/              Design system primitives (LaButton, LaText, LaField…)
src/components/la-blocks/       Product blocks (AppHeader, AppFooter, CategoryGrid…)
src/components/ui/              Raw shadcn wrappers (never import directly in pages)
src/components/[feature]/       Self-contained feature components (report-ad, la-search-bar…)
src/app/(main)/                 Core product pages (home, listings, listing detail)
src/app/(about)/                About section pages
src/app/(dashboard)/            User dashboard pages (chat, favourites, myads, profile)
src/app/(resources)/            FAQ, support, tutorials
src/app/(auth)/                 Login, register, signup
src/app/design-system/          Living component reference — demo pages only
src/app/snippets/               UX playground — self-contained feature demos
src/lib/                        Utilities, hooks, stores, mock data, email engine
src/config/                     App config (countries, categories, global settings)
src/types/                      TypeScript types (listing.ts, auth.ts)
```

---

## The Golden Rule

> When in doubt: read the design system first (`/design-system/`), use what exists, and ask before building new.

---

## How This Skill Evolves — Self-Update Protocol

> **This file is a living document. Copilot updates it automatically — no instruction from the owner needed.**

### Triggers — update this file when any of these happen
- A new component pattern or styling convention is established during a coding session
- An existing rule is found to be wrong, incomplete, or superseded
- A new `la/` primitive or `la-blocks/` component is added to the design system
- A Tailwind v4 behaviour is discovered that differs from what's documented here
- An accessibility violation is caught and a better pattern is identified
- The owner confirms a visual/UX decision that affects all future components
- A gap is discovered mid-build that should have been in this file
- A new reusable pattern emerges from a feature build (form, image, layout, etc.)

### How to update
1. Edit the relevant section directly — keep it concise
2. Replace outdated patterns — never leave contradictions
3. Add a `> Updated: YYYY-MM-DD — [what changed and why]` note at the top of the changed section
4. If a new section is needed, add it before this one

### What NOT to add
- Unconfirmed decisions — mark as `[PROPOSED]` if uncertain, confirm before merging into rules
- One-off patterns that don't generalise — if it happened once, it's not a convention yet
- Anything the owner has explicitly said NOT to do

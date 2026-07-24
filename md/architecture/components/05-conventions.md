# Component Conventions

> Naming, file structure, CVA patterns, `cn()` usage, and hard rules.  
> Last updated: 2026-07-07

---

## File Naming

| What | Convention | Example |
|---|---|---|
| Component file | PascalCase `.tsx` | `LaButton.tsx`, `AppHeader.tsx` |
| `la/` primitives | `la-kebab-case.tsx` | `la-button.tsx`, `la-badge.tsx` |
| `la-blocks/` blocks | PascalCase or `la-kebab-case/` | `AppHeader.tsx`, `la-thumbnail-listing/` |
| Feature folder | `kebab-case/` | `create-alert/`, `location-picker/` |
| Barrel export | `index.ts` | `components/create-alert/index.ts` |
| Types file | `types.ts` in the feature folder | `components/create-alert/types.ts` |

---

## CVA Variant Pattern

All `la/` primitives use CVA (class-variance-authority) for variants.

```ts
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // base — always applied
  "inline-flex items-center justify-center rounded-full transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-[var(--la-primary)] text-[var(--la-primary-fg)]",
        ghost:   "bg-transparent text-slate-700 hover:bg-slate-100",
      },
      size: {
        default: "h-9 px-5 text-sm",
        big:     "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      intent: "primary",
      size:   "default",
    },
  }
);

// Props interface always extends VariantProps
export interface MyComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // extra props
}
```

### Compound variants for intent × variant matrix

```ts
compoundVariants: [
  { intent: "neutral", variant: "soft",  class: "bg-slate-100 text-slate-700" },
  { intent: "info",    variant: "solid", class: "bg-blue-600  text-white" },
]
```

---

## `cn()` Usage — Non-Negotiable

Always use `cn()` from `@/lib/utils` for merging classNames. Never string concatenation.

```ts
import { cn } from "@/lib/utils";

// ✅ Correct
<div className={cn("base-class", isActive && "active-class", className)} />

// ❌ Never
<div className={`base-class ${isActive ? "active-class" : ""} ${className}`} />
<div className={"base-class " + className} />
```

`cn()` uses `clsx` + `tailwind-merge` — it correctly resolves Tailwind class conflicts (e.g. `p-4` + `px-6` → `px-6 py-4`, not both).

---

## No Inline Styles

```tsx
// ❌ Never
<div style={{ fontSize: "14px", color: "#334155" }} />

// ✅ Always
<div className="text-sm text-slate-700" />
```

Exception: `style` is allowed only for dynamic values that cannot be expressed in Tailwind, such as computed pixel positions or CSS custom property values set from JS:
```tsx
<div style={{ "--offset": `${scrollY}px` } as React.CSSProperties} />
```

---

## Accessibility Rules (Hard)

These override all other styling decisions.

| Rule | Minimum |
|---|---|
| Text size | `text-sm` (14px) — never `text-xs`, `text-[11px]`, `text-[10px]` |
| Body text on white | `text-slate-700` or darker |
| Placeholder / hint text | `text-slate-500` minimum |
| Icon colour (meaningful) | `text-slate-500` minimum |
| Interactive border | `border-slate-300` minimum |
| Font weight for labels | `font-medium` or `font-semibold` |
| Focus rings | Always present — never remove `focus-visible:ring-*` |

---

## Colour Token Rules

```
Structural layout  → CSS vars: bg-background, text-foreground, bg-card, border-border
Fine-grained UI    → slate-* scale
Semantic actions   → rose-* (error/danger) · amber-* (warning) · blue-* (CTA/action)
Nothing else unless explicitly requested
```

### Fonts

```
font-sans     → Inter Variable   (body, UI, forms)
font-display  → InterDisplay     (headings via LaText h1–h5)
No other font families
```

---

## React Patterns

### Server Component by default

All components are Server Components unless they need:
- `useState` / `useEffect` / `useRef`
- Browser APIs (`window`, `navigator`, `document`)
- Event handlers (`onClick`, `onChange`, etc.)
- `useSearchParams`, `useRouter`, `usePathname`
- A Zustand store

Add `"use client"` only when actually needed.

### Ref forwarding

All form primitives (`LaInput`, `LaTextarea`, etc.) and any component that wraps a DOM element **must** use `React.forwardRef`. Form libraries (react-hook-form, etc.) require it.

```tsx
const LaInput = React.forwardRef<HTMLInputElement, LaInputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("...", className)} {...props} />
  )
);
LaInput.displayName = "LaInput";
```

### Component display names

Always set `displayName` on `forwardRef` components — React DevTools relies on it.

---

## Composition over Configuration

Prefer compound component patterns for complex UIs rather than bloated prop lists.

```tsx
// ✅ Compound — clear, composable
<LaTabs defaultValue="active">
  <LaTabsList>
    <LaTabsTrigger value="active">Active</LaTabsTrigger>
    <LaTabsTrigger value="closed">Closed</LaTabsTrigger>
  </LaTabsList>
  <LaTabsContent value="active">...</LaTabsContent>
</LaTabs>

// ❌ Avoid — prop-heavy
<LaTabs
  tabs={[{ value: "active", label: "Active", content: <...> }]}
  defaultValue="active"
/>
```

---

## Design System Demo Requirement

Every new `la/` primitive and every new reusable feature component **must** have a demo:

1. Create the demo page (design-system or snippets route)
2. Add the entry to `lib/design-system-menu.ts`
3. Demo must show all variants, edge cases, and integration examples

If it's not demoed, it's invisible to future contributors and will be rebuilt from scratch.

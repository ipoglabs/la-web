# Category Grid — Feature Documentation

> **Last updated:** July 2026
> **Component:** `components/la-blocks/CategoryGrid.tsx`
> **Snippet:** `app/snippets/landing-category/`
> **Source of truth:** `config/categories/`
> **Visuals resolver:** `config/categories/visuals.ts`

---

## 1. What it does

`CategoryGrid` renders the main category navigation on the landing page. Each card shows a coloured header with an icon + category title + "See all" link, a list of clickable subcategory rows, and an inline expand/collapse footer when a category has more subcategories than the visible limit.

The grid uses a **masonry column layout** — items are distributed across columns (`i % numCols`) and each column is a flex column. This ensures cards of different heights sit flush within their column with no ugly gap rows (unlike CSS grid).

---

## 2. Architecture

```
config/categories/          ← ONE SOURCE OF TRUTH
├── types.ts                ← CategoryItem, SubCategoryItem
├── index.ts                ← CATEGORIES[] barrel
├── visuals.ts              ← resolveCardColor(), resolveCardIcon()
├── property.ts             ┐
├── vehicles.ts             │
├── jobs.ts                 │  21 pure-data category files
│   …                       │  (id, label, description, color, cardIcon, subcategories[])
└── free-giveaway.ts        ┘

components/la-blocks/
└── CategoryGrid.tsx        ← production component — imports from config/categories/

app/snippets/landing-category/
└── page.tsx                ← self-contained sandbox (local CategoryCard + CategoryGridNew)

lib/
└── category-map.ts         ← derived from CATEGORIES — zero manual maintenance
```

---

## 3. Component Props

```typescript
interface CategoryGridProps {
  categories: CategoryItem[];   // filtered list from CATEGORIES (by country config)
  initialVisible?: number;      // cards to show before "Show more" (default: 8)
  className?: string;           // wrapper div class (e.g. "container-app")
}
```

---

## 4. Layout Logic

```
numCols = isLg ? 4 : isSm ? 3 : 2          (via useMediaQuery)

columns[i % numCols].push(cat)              (left-to-right, top-to-bottom distribution)

<div class="flex gap-3 items-start">
  {columns.map(col =>
    <div class="flex-1 min-w-0 flex flex-col gap-3">
      {col.map(cat => <CategoryCard />)}
    </div>
  )}
</div>
```

**Why not CSS grid?** Grid fills row by row at equal heights. Cards have variable heights (different subcategory counts). A CSS grid would show uneven gaps between cards in different rows. The masonry approach lets each column stack naturally.

**SSR note:** `useMediaQuery` always returns `false` on the server (SSR-safe — see `lib/hooks/useMediaQuery.ts`). This means the initial render always uses 2 columns. After hydration it jumps to the correct column count. This is expected and intentional — avoids hydration mismatch.

---

## 5. Card Design

```
┌─────────────────────────────────────────────┐
│  [Icon]  Property              See all  ›   │  ← solid bg-*-500 + to-white/10 overlay
│          Find your perfect home…            │  ← description, single-line truncate
├─────────────────────────────────────────────┤
│  To Rent                                ›   │  ← subcategory row
│  To Buy                                 ›   │
│  Room Rental                            ›   │  (up to VISIBLE_SUBS = 6 rows)
│  …                                          │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│  + 2 more                                   │  ← footer: only when has more
└─────────────────────────────────────────────┘
```

- **Header**: `relative` with solid color (`bg-*-500`) + `bg-linear-to-b from-transparent to-white/10` overlay
- **Subcategory rows**: `divide-y divide-dashed divide-stone-400`, hover → `emerald-100` bg + `emerald-800` text
- **Footer**: only renders when `subs.length > VISIBLE_SUBS`. Inline expand/collapse, no navigation.

---

## 6. Visual System

All color + icon mapping lives exclusively in `config/categories/visuals.ts`.

```typescript
// Usage in any consumer:
const style = resolveCardColor(category.color);   // { header: "bg-blue-500", text: "text-white" }
const Icon  = resolveCardIcon(category.cardIcon); // Heroicon component | null
```

**Active palette:** solid `bg-*-500` with `text-white`
**Pastel palette:** commented out in `visuals.ts` as `bg-*-200` with `text-slate-800` — ready to A/B test.

**Fallback:** unknown color → `bg-slate-500 text-white`. Unknown icon → `null` (icon slot hidden).

---

## 7. Consumers

| Consumer | Import | Notes |
|---|---|---|
| `app/page.tsx` | `CategoryGrid` | Filters `CATEGORIES` by `countryConfig.enabledCategories` |
| `app/snippets/landing-category/page.tsx` | local `CategoryGridNew` | Self-contained sandbox — uses same data source |
| `lib/category-map.ts` | `CATEGORIES` | Derives `CATEGORY_LABELS` + `SUBCATEGORY_LABELS` for search + breadcrumbs |
| `CreateAlertJourney.tsx` | `CATEGORIES` | Category selection grid in Step 1. Filters joined from `ALERT_CONFIG` by id. |

---

## 8. API Integration Points

All marked inline with `// TODO [INTEGRATION]:` in source.

| Location | What to wire |
|---|---|
| `CategoryGrid.tsx` | `GET /api/categories?country={code}` → `CategoryItem[]` — replace static prop |
| `CategoryGrid.tsx` | Loading skeleton state — N ghost cards with pulse animation |
| `app/page.tsx` | API-driven category ordering per country (featured/trending) |

Until the API is ready, the category list is derived from `CATEGORIES` filtered by `countryConfig.enabledCategories` (client-side, zero network cost).

---

## 9. How to Add a New Category

> See [create-alert.md](./create-alert.md#7-how-to-add-a-new-category) — the process is the same starting at Step 1 and Step 4.
> Display data → `config/categories/`. Filter data → `components/create-alert/config/`.

Quick checklist:
- [ ] `config/categories/my-category.ts` — id, label, description, color, cardIcon, subcategories
- [ ] Register in `config/categories/index.ts`
- [ ] Add `color` token to `visuals.ts` CARD_COLORS (if new color)
- [ ] Add `cardIcon` key to `visuals.ts` CARD_ICONS (if new icon)
- [ ] `components/create-alert/config/my-category.ts` — alert filters
- [ ] Register in `components/create-alert/config/index.ts`
- [ ] Add to `CATEGORY_ICON_MAP` + `CATEGORY_BG` in `CreateAlertJourney.tsx`
- [ ] Add `"my_category"` to relevant `config/countries/{code}.ts` enabledCategories

`lib/category-map.ts` updates automatically — no manual maintenance.

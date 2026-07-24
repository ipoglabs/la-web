# Layer 1 — `components/la/` Primitives

> Every design system primitive in `components/la/`.  
> All imports via `@/components/la` barrel.  
> Color palette reference: `components/la/COLOR_PALETTE.md`  
> Last updated: 2026-07-07

---

## All Primitives at a Glance

| Component | File | Category |
|---|---|---|
| `LaButton` | `la-button.tsx` | Action |
| `LaText` | `la-text.tsx` | Typography |
| `LaField` | `la-field.tsx` | Form wrapper |
| `LaInput` | `la-input.tsx` | Form input |
| `LaTextarea` | `la-textarea.tsx` | Form textarea |
| `LaSelect` | `la-select.tsx` | Form select |
| `LaRadio` | `la-radio.tsx` | Form radio group |
| `LaBadge` | `la-badge.tsx` | Status / label |
| `LaChip` | `la-chip.tsx` | Filter chip + chip strip |
| `LaTagInput` | `la-tag-input.tsx` | Multi-value tag entry |
| `LaMinMax` | `la-minmax.tsx` | Price/number range input |
| `LaAmount` | `la-amount.tsx` | Currency amount input |
| `LaTokenRow` | `la-token-row.tsx` | Horizontal pill token list |
| `LaSelectResponsive` | `la-select-responsive.tsx` | Native select (Drawer on mobile) |
| `LaListSelect` | `la-list-select.tsx` | Full-height list picker |
| `LaSeparator` | `la-separator.tsx` | Divider |
| `LaSection` | `la-section.tsx` | Section wrapper with heading |
| `LaTabs` | `la-tabs.tsx` | Tab strip + panels |
| `LaAvatar` | `la-avatar.tsx` | Avatar display |
| `LaCard` | `la-card.tsx` | Card container |
| `LaPlaceholder` | `la-place-holder.tsx` | Empty / loading placeholder |
| `LaLabel` | `la-label.tsx` | Form label |

---

## `LaButton`

**Import:** `import { LaButton } from "@/components/la"`

### Variants — `intent`

| Intent | Use case |
|---|---|
| `primary` | Default CTA — uses `--la-primary` CSS var |
| `primary-blue` | Blue CTA |
| `primary-rose` | Destructive/alert CTA |
| `primary-amber` | Warning CTA |
| `secondary` | Muted background button |
| `danger` | Destructive action |
| `outline` | Bordered, transparent background |
| `ghost` | No border, no background |
| `link` | Underline text button |

### Variants — `size`

| Size | Height | Text | When |
|---|---|---|---|
| `mini` | 20px | 10px | Tags, dense UI |
| `compact` | 28px | 12px | Secondary actions in tight spaces |
| `default` | 36px | 14px | Standard use |
| `big` | 48px | 16px | Primary CTAs |
| `bigger` | 60px | 2xl | Hero buttons |
| `biggest` | 72px | 3xl | Landing large actions |

### Extra props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `loading` | `boolean` | `false` | Adds spinner, disables button |
| `iconOnly` | `boolean` | `false` | Collapses to square — use with icon-only buttons |
| `asChild` | `boolean` | `false` | Renders as child element (Radix Slot) |

```tsx
<LaButton intent="primary" size="big">Post Your Ad</LaButton>
<LaButton intent="outline" loading>Saving…</LaButton>
<LaButton intent="ghost" iconOnly><SearchIcon /></LaButton>
<LaButton intent="danger" size="compact">Delete</LaButton>
```

---

## `LaText`

**Import:** `import { LaText } from "@/components/la"`

### Types

| Type | Tag | Size | Weight | Color | Font |
|---|---|---|---|---|---|
| `h1` | `<h1>` | 4xl | semibold | slate-700 | display |
| `h2` | `<h2>` | 3xl | normal | slate-800 | display |
| `h3` | `<h3>` | 2xl | light | slate-900 | display |
| `h4` | `<h4>` | xl | light | slate-900 | display |
| `h5` | `<h5>` | lg | light | slate-900 | display |
| `body` | `<p>` | base | normal | slate-900 | sans |
| `small` | `<p>` | sm | normal | slate-500 | sans |
| `muted` | `<p>` | sm | normal | slate-400 | sans |
| `label` | `<span>` | sm | medium | slate-700 | sans |
| `quote` | `<blockquote>` | base | italic | slate-600 | sans |
| `code` | `<code>` | sm | mono | slate-800 | mono |

### Extra props

| Prop | Default | Notes |
|---|---|---|
| `as` | Per type | Override rendered HTML tag, keep visual style |
| `truncate` | `false` | Single-line ellipsis clamp |

```tsx
<LaText type="h1">Page title</LaText>
<LaText type="body">Body paragraph</LaText>
<LaText type="label" as="label" htmlFor="email">Email</LaText>
<LaText type="h2" as="h3">Looks h2, renders h3 (SEO control)</LaText>
<LaText type="small" truncate className="max-w-xs">Long supporting text…</LaText>
```

---

## `LaBadge`

**Import:** `import { LaBadge } from "@/components/la"`

### Dimensions: `intent` × `variant`

| Intent | soft | solid | outline |
|---|---|---|---|
| `neutral` | slate-100 / slate-700 | slate-800 / white | — |
| `info` | blue-50 / blue-700 | blue-600 / white | — |
| `success` | green-50 / green-700 | green-600 / white | — |
| `warning` | yellow-50 / yellow-800 | yellow-400 / yellow-900 | — |
| `danger` | red-50 / red-700 | red-600 / white | — |
| `brand` | orange-50 / orange-700 | — | — |
| `purple` | purple-50 / purple-700 | — | — |

```tsx
<LaBadge intent="success" variant="soft">Active</LaBadge>
<LaBadge intent="danger" variant="solid">Removed</LaBadge>
<LaBadge intent="info">New</LaBadge>
```

---

## `LaChip` + `LaFilterChipStrip`

**Import:** `import { LaChip, LaFilterChipStrip } from "@/components/la"`

`LaChip` — single removable filter chip  
`LaFilterChipStrip` — horizontal scrollable row of chips from an array

```tsx
<LaChip label="Honda City" onRemove={() => remove('q')} />
<LaChip label="Under £500" size="compact" onRemove={() => remove('maxPrice')} />

// Strip
<LaFilterChipStrip
  items={activeChips}   // { id, label }[]
  onRemove={(id) => removeChip(id)}
  onClearAll={clearAll}
/>
```

---

## Form Primitives — `LaField`, `LaInput`, `LaTextarea`, `LaSelect`, `LaRadio`

These four always compose together: `LaField` wraps any input with label + error + hint.

```tsx
<LaField label="Title" required error={errors.title} hint="Max 80 characters">
  <LaInput
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="e.g. Honda City 2019"
    maxLength={80}
  />
</LaField>

<LaField label="Description">
  <LaTextarea rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} />
</LaField>

<LaField label="Category">
  <LaSelect value={cat} onValueChange={setCat}>
    <LaSelectItem value="vehicles">Vehicles</LaSelectItem>
    <LaSelectItem value="property">Property</LaSelectItem>
  </LaSelect>
</LaField>

<LaField label="Condition">
  <LaRadio
    value={condition}
    onValueChange={setCondition}
    options={[
      { value: "new", label: "New" },
      { value: "used", label: "Used" },
    ]}
  />
</LaField>
```

---

## Specialised Input Primitives

### `LaTagInput`
Multi-value tag entry. User types and presses Enter/comma to add tags.
```tsx
<LaTagInput
  value={keywords}
  onChange={setKeywords}
  placeholder="Add keywords…"
  maxTags={5}
/>
```

### `LaMinMax`
Two linked number inputs — min and max with shared label.
```tsx
<LaMinMax
  label="Price range"
  minValue={minPrice}
  maxValue={maxPrice}
  onMinChange={setMinPrice}
  onMaxChange={setMaxPrice}
  prefix="£"
/>
```

### `LaAmount`
Single currency amount input with currency prefix from active country.
```tsx
<LaAmount
  value={price}
  onChange={setPrice}
  currencySymbol={config.currencySymbol}
/>
```

### `LaTokenRow`
Horizontal scrollable row of read-only pill tokens.
```tsx
<LaTokenRow tokens={["Petrol", "Automatic", "2019"]} />
```

### `LaSelectResponsive`
On mobile: opens a Drawer bottom sheet. On desktop: standard popover select.  
Use for long option lists where native `<select>` is too cramped.

### `LaListSelect`
Full-height scrollable list picker — for overlays and sheets where full height is available.

---

## Layout + Structural Primitives

### `LaSeparator`
```tsx
<LaSeparator />                  {/* horizontal */}
<LaSeparator orientation="vertical" />
```

### `LaSection`
Section wrapper with optional heading + optional "See all" link.
```tsx
<LaSection title="Featured Listings" href="/listings">
  {/* children */}
</LaSection>
```

### `LaTabs`
Tab strip + tab panels. Wraps Radix Tabs with LokalAds styling.
```tsx
<LaTabs defaultValue="active">
  <LaTabsList>
    <LaTabsTrigger value="active">Active (12)</LaTabsTrigger>
    <LaTabsTrigger value="closed">Closed</LaTabsTrigger>
  </LaTabsList>
  <LaTabsContent value="active">{/* ... */}</LaTabsContent>
  <LaTabsContent value="closed">{/* ... */}</LaTabsContent>
</LaTabs>
```

### `LaCard`
Standard card shell with border, shadow, and rounded-2xl.
```tsx
<LaCard className="p-6">
  {/* content */}
</LaCard>
```

### `LaAvatar`
Avatar primitive — same as the feature-level `Avatar` but lighter, no status dot, no dropdown.
```tsx
<LaAvatar src="/img/user.jpg" initials="KG" size="md" />
```

### `LaPlaceholder`
Empty state and loading skeleton shell.
```tsx
<LaPlaceholder icon={ImageIcon} message="No photos yet" />
<LaPlaceholder loading />
```

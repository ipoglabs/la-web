# OverlayCountrySelect

Full-screen blocking overlay for country selection. Used in two contexts:

1. **Automatic** — triggered by `CountryDetector` when IP detection fails or returns an unsupported country
2. **Manual** — triggered by user action (e.g. "Switch Country" button) via the snippet at `/snippets/switch-country`

---

## File

`components/overlay-country-select/index.tsx`

---

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `currentCode` | `string` | No | ISO country code to pre-highlight on open |
| `onSelect` | `(code: string) => void` | No | Called after selection + cookie commit. If omitted, falls back to `router.refresh()` |
| `onClose` | `() => void` | No | If provided, renders a close ✕ button in the header |

All props are optional. When used with no props (e.g. inside `CountryDetector`), the overlay behaves as a blocking, non-dismissible picker that refreshes the page on selection.

---

## Behaviour

- Renders as `fixed inset-0 z-50` — blocks all content underneath
- Dark backdrop: `bg-black/50 backdrop-blur-sm`
- `currentCode` → pre-selected tile highlighted in blue on open
- Selecting a tile: validates via `isSupportedCountry()`, writes cookie via `commitCountry()`, calls `onSelect` or `router.refresh()`
- Close button only appears when `onClose` is provided

---

## Layout

```
┌─────────────────────────────────────────┐
│  🌏 Where are you based?                │  ← header (+ ✕ if onClose provided)
│  Select your country…                   │
├─────────────────────────────────────────┤
│  [🇸🇬]  [🇮🇳]  [🇬🇧]  [🇺🇸]  [🇦🇺]      │  ← scrollable grid
│  [🇲🇾]  [🇨🇦]  [🇳🇿]  [🇨🇭]  [🇫🇷]      │
│  [🇦🇪]  [🇩🇪]  [🇦🇹]                    │
├─────────────────────────────────────────┤
│  Your preference is saved for 30 days   │  ← footer
└─────────────────────────────────────────┘
```

**Grid columns:**
- Mobile (`< 768px`) → 2 cols
- Tablet (`≥ 768px`) → 4 cols
- Desktop (`≥ 900px`) → 5 cols

**Modal max-width:**
- Mobile → `max-w-sm`
- Tablet → `max-w-lg`
- Desktop → `max-w-2xl`

**Flag images:** SVG files from `/public/flags/{code}.svg` via `next/image` (56×42px)

---

## Selection State

```tsx
// Unselected tile
"border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"

// Selected tile
"border-blue-500 bg-blue-50 ring-2 ring-blue-400 ring-offset-1"
// Label also switches to text-blue-700
```

---

## Usage

### 1 — Blocking (no props) — inside CountryDetector
```tsx
import { OverlayCountrySelect } from "@/components/overlay-country-select";

// Shown when IP detection fails — non-dismissible, refreshes page on pick
<OverlayCountrySelect />
```

### 2 — Controlled (with props) — manual switch flow
```tsx
const [show, setShow] = useState(false);
const [code, setCode] = useState("SG");

function handleSelect(selected: string) {
  setCode(selected);
  setShow(false);
}

{show && (
  <OverlayCountrySelect
    currentCode={code}
    onSelect={handleSelect}
    onClose={() => setShow(false)}
  />
)}
```

---

## Dependencies

| Import | From |
|---|---|
| `COUNTRIES` | `@/lib/data/countries` |
| `isSupportedCountry` | `@/lib/country-context` |
| `commitCountry` | `@/lib/country-cookie` |
| Flag SVGs | `/public/flags/*.svg` |

---

## Countries (13)

| Code | Name | Dial |
|---|---|---|
| SG | Singapore | +65 |
| IN | India | +91 |
| GB | UK | +44 |
| US | USA | +1 |
| AU | Australia | +61 |
| MY | Malaysia | +60 |
| CA | Canada | +1 |
| NZ | New Zealand | +64 |
| CH | Switzerland | +41 |
| FR | France | +33 |
| AE | UAE | +971 |
| DE | Germany | +49 |
| AT | Austria | +43 |

> Malaysia flag (`my.svg`) was hand-generated — no upstream source available.

---

## Switch Country Snippet

Live demo: `/snippets/switch-country`
File: `app/snippets/switch-country/page.tsx`

Shows the controlled usage pattern:
- Card displays current flag (96×72), country name, dial code
- "Switch Country" button opens the overlay with `currentCode` pre-highlighted
- On selection: card updates, emerald green flash ("✓ Country updated") for 2.5s
- Output panel below shows `code`, `flag`, `name`, `dial` — the raw data output
- Flash timer uses `useRef` + cleanup on unmount to prevent memory leaks

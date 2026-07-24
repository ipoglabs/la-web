# LocationPicker — Component Documentation

## Overview

A GPS + search + radius location picker designed for dark-background contexts. The pill button opens a **responsive overlay** — a bottom drawer on mobile, a centred dialog on tablet and above. The panel shows Recent and Saved tabs by default; typing switches to a live search list. A `countryScope` prop restricts all results to specific countries.

**Philosophy:** One pill, one value, always structured. The user taps, searches or locates — your code gets a clean `LocationValue` object every time.

---

## At a Glance

| Attribute   | Value                                              |
|-------------|----------------------------------------------------|
| Component   | `LocationPicker`                                   |
| Location    | `components/location-picker/LocationPicker.tsx`    |
| Type        | Client Component (`"use client"`)                  |
| Output      | `LocationValue` object or `null`                   |
| Overlay     | Drawer (mobile) / Dialog (tablet+, `≥768px`)       |
| Demo page   | `/snippets/location-picker`                        |

---

## Usage

```tsx
import { LocationPicker, LocationValue } from "@/components/location-picker";

const [location, setLocation] = React.useState<LocationValue | null>(null);

// Minimal — UK scope, no radius
<LocationPicker
  countryScope={["UK"]}
  showRadius={false}
  onChange={setLocation}
/>

// Full — GPS + search + radius, pre-filled
<LocationPicker
  countryScope={["UK"]}
  defaultValue={{ label: "London", sublabel: "Greater London, UK", radius: 2, unit: "km" }}
  onChange={setLocation}
/>

// Google Places mode (requires proxy route + API key)
<LocationPicker
  countryScope={["SG"]}
  searchProvider="google"
  onChange={setLocation}
/>
```

---

## Output Contract

`onChange` emits a `LocationValue` object every time the user picks a location, or `null` if cleared.

```ts
type LocationValue = {
  label: string;         // e.g. "London"
  sublabel?: string;     // e.g. "Greater London, UK"
  lat?: number;          // decimal degrees
  lng?: number;          // decimal degrees
  radius?: number;       // e.g. 2.5
  unit?: "km" | "mi";   // radius unit
};
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `LocationValue \| null` | — | Controlled value |
| `defaultValue` | `LocationValue \| null` | `null` | Uncontrolled initial value |
| `onChange` | `(v: LocationValue \| null) => void` | — | Emits on every pick |
| `countryScope` | `string[]` | — | Filter results to country codes e.g. `["UK", "SG", "IN"]` |
| `showRadius` | `boolean` | `true` | Show radius pill strip at bottom of panel |
| `radiusUnit` | `"km" \| "mi"` | `"km"` | Unit displayed on radius pills and in output |
| `searchProvider` | `"none" \| "google"` | `"none"` | `"none"` = static list; `"google"` = Google Places mock (proxy-ready) |
| `placeholder` | `string` | `"Search location…"` | Search input placeholder |
| `disabled` | `boolean` | `false` | Disables GPS button and pill |
| `className` | `string` | — | Outer wrapper styles — applies to pill mode only |
| `trigger` | `"pill" \| "link"` | `"pill"` | Trigger variant — `"pill"` (glass split-pill) or `"link"` (plain `<a>` tag) |
| `triggerClassName` | `string` | — | Extra classes on the `<a>` when `trigger="link"`. No default styles — full developer control |

---

## countryScope

Restricts **all** results — Recent tab, Saved tab, static search, and Google mock — to the listed countries. Pass an array of country codes. Supported codes out of the box:

| Code | Matches sublabels containing |
|---|---|
| `UK` | `uk`, `england`, `scotland`, `wales`, `united kingdom` |
| `SG` | `singapore` |
| `IN` | `india` |
| `US` | `us`, `usa`, `united states` |
| `AU` | `australia` |
| `AE` | `uae`, `united arab emirates` |
| `CA` | `canada` |

Unknown codes fall back to a case-insensitive substring match on the code itself.

```tsx
// Single country
<LocationPicker countryScope={["UK"]} />

// Multi-country
<LocationPicker countryScope={["UK", "SG"]} />
```

---

## Responsive Overlay

| Viewport | Overlay |
|---|---|
| `< 768px` (mobile) | Vaul bottom `Drawer` — swipeable, drag handle, auto-close |
| `≥ 768px` (tablet+) | Radix centred `Dialog` — max width `sm`, max height `min(80vh, 600px)` |

SSR-safe: `mounted` guard prevents hydration mismatch from `useMediaQuery`.

---

## Panel Layout

```
┌──────────────────────────────────┐
│  ▬  Set Location           [✕]  │  ← Gradient header — Drawer (mobile)
│  Set Location              [✕]  │  ← Gradient header — Dialog (tablet)
├──────────────────────────────────┤
│  ⊕  │  🔍  Search location…  [✕] │  ← GPS button + search input row
├──────────────────────────────────┤
│  [Saved ▾]            Clear all  │  ← Toggle + clear (hidden while typing)
│  ───────────────────────────── │
│  📍 London          Greater…  ✕  │  ← Recent rows (save / clear per row)
│  📍 Birmingham      …          │
│  ──(divider)────────────────── │
│  🔖 Home            Hackney…  ✕  │  ← Saved rows
│  (typing replaces all with       │
│   live filtered results)         │
├──────────────────────────────────┤
│  WITHIN                          │
│  0.5  1  1.5  2 … 5 km          │  ← Radius pills (when showRadius=true)
└──────────────────────────────────┘
```

---

## Split Pill Trigger

The trigger area is a single joined pill with two independent tap targets:

```
┌──────────────────────────────────────────┐
│  ⊕  │  📍 London, Greater London  ·±2km ∨ │
└──────────────────────────────────────────┘
  GPS     Opens panel
```

- **Left half (GPS)** — fires `navigator.geolocation` immediately, no panel opens. Width `w-9`, independent hover.
- **Centre divider** — `w-px bg-white/20`, barely visible.
- **Right half (Location)** — opens the Drawer/Dialog panel. Label truncates at `max-w-40`. Radius shown as `·±2 km` when set.
- **Disabled state** — applied at container level; both halves dim together (`opacity-50`).
- GPS error/denied states turn the crosshair `text-red-400` with a red hover tint.

---

## Link Trigger

Set `trigger="link"` to render the picker as a plain `<a>` tag instead of the glass pill. One single tap target — opens the same Drawer/Dialog panel. No GPS button.

```
Set location                      ← no location set (or single-country hint)
London, Greater London · ±2 km   ← when a value is selected
```

**Key points:**
- No default styles — pass `triggerClassName` to style it for your context
- All values (label + area + radius) combined into one text string
- Falls back to `"Set location"` or single-country name hint when nothing is picked
- `disabled` prop applies `pointer-events-none opacity-50`

### Trigger comparison

| | `trigger="pill"` (default) | `trigger="link"` |
|---|---|---|
| Appearance | Glass split-pill for dark bg | Bare `<a>` tag |
| GPS button | ✓ Included | ✗ Not included |
| Styling | Fixed (designed for dark bg) | Fully custom via `triggerClassName` |
| Use case | Nav bars, map overlays | Form rows, profile pages, inline text |

### Usage

```tsx
// Form row — label + link on the same line
<div className="flex items-center justify-between">
  <span className="text-sm text-slate-500">Location</span>
  <LocationPicker
    countryScope={["UK"]}
    trigger="link"
    triggerClassName="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors"
    onChange={setLocation}
  />
</div>

// Plain underline link
<LocationPicker
  countryScope={["SG"]}
  trigger="link"
  triggerClassName="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800"
  onChange={setLocation}
/>
```

---

## GPS Behaviour

The crosshair on the GPS half fires `navigator.geolocation` directly, without opening the panel. Errors are surfaced via `title` attribute on the button and inline in the panel search row when open.
| Error | Message |
|---|---|
| Permission denied | `Location access denied. Please allow it in your browser settings.` |
| Position unavailable | `Location unavailable. Try again.` |
| Other / timeout | `Couldn't get location. Try again.` |
| Unsupported browser | `Geolocation is not supported by your browser` |

---

## Radius Pills

Ten fixed options: `0.5 1 1.5 2 2.5 3 3.5 4 4.5 5`. Pills are disabled until a location is set. The selected radius and unit are included in the `LocationValue` output. When GPS or search fires without a prior radius, `RADIUS_OPTIONS[0]` (0.5) is used as the default.

Hide the radius strip entirely with `showRadius={false}`.

---

## Search Providers

### `searchProvider="none"` (default)

Filters the built-in `STATIC_SUGGESTIONS` list locally. No API calls, no key required. Good for POC or offline use.

**Static list includes:** 7 UK cities · 8 Indian cities · 5 Singapore locations · 4 others (New York, Sydney, Dubai, Toronto)

### `searchProvider="google"` (proxy-ready mock)

In POC mode, uses `mockGoogleSearch()` with a 300 ms simulated latency. Recognised prefixes:

| Type | Prefix |
|---|---|
| `lon` | London, London City Airport, London Bridge |
| `man` | Manchester, Manchester Airport |
| `mum` | Mumbai, Mumbai Central |
| `del` | Delhi, Delhi Airport (IGI) |
| `ban` | Bangalore, Bangalore Airport (KIA) |
| `sin` | Singapore, Changi Airport, Orchard Road |
| `che` | Chennai |
| `hyd` | Hyderabad |

**To switch to real Google Places:**
1. Enable Places API in Google Cloud Console
2. Add `GOOGLE_PLACES_API_KEY=AIza...` to `.env.local`
3. The proxy route is already prepared at `app/api/places/route.ts`
4. In `LocationSearch.tsx`, replace `mockGoogleSearch(q)` with `realGoogleSearch(q)` (commented block below the mock)

---

## Styling Context

The **split pill** is designed for **dark backgrounds** (`bg-slate-800` or similar). The panel is always white. The **link trigger** has zero default styles — use `triggerClassName` for any context.

| Element | Key classes |
|---|---|
| Split pill container | `rounded-full border border-white/20 bg-white/10 backdrop-blur-sm shadow-md overflow-hidden` |
| GPS half | `w-9 text-white/70 hover:bg-white/20` |
| Divider | `w-px h-4 bg-white/20` |
| Location half | `text-white hover:bg-white/10 px-3` |
| Link trigger `<a>` | No default styles — fully controlled by `triggerClassName` |
| Panel (Drawer) | `bg-white` — `rounded-t-2xl`, gradient header `from-slate-100 to-white`, `min-h-[80vh] max-h-[90dvh]` |
| Panel (Dialog) | `bg-white` — `rounded-2xl`, gradient header `from-slate-100 to-white`, `max-h-[min(80vh,600px)]` |

> **`className` prop** applies to the split pill's outer wrapper div. It has no effect when `trigger="link"` — use `triggerClassName` instead.

---

## Design Pattern — Country First

Since `LocationPicker` is country-scoped, always resolve the country **before** mounting the picker. Without a `countryScope`, suggestions, recent, saved, and radius labels are all unscoped.

Use `OverlayCountrySelect` as the gate:

```tsx
const [countryCode, setCountryCode] = useState<string | null>(null);
const [showPicker, setShowPicker] = useState(false);
const [location, setLocation] = useState<LocationValue | null>(null);

// NOTE: COUNTRIES uses "GB" for UK, but LocationPicker expects "UK".
const scope = countryCode === "GB" ? "UK" : countryCode;

{scope ? (
  <LocationPicker countryScope={[scope]} onChange={setLocation} />
) : (
  <button onClick={() => setShowPicker(true)}>Select country first...</button>
)}

{showPicker && (
  <OverlayCountrySelect
    onSelect={(code) => { setCountryCode(code); setShowPicker(false); }}
    onClose={() => setShowPicker(false)}
  />
)}
```

> **GB → UK mapping:** `COUNTRIES` data uses `GB` for the United Kingdom, but `COUNTRY_KEYWORDS` inside LocationPicker expects `UK`. Apply `code === "GB" ? "UK" : code` at the integration point.

---

## Pill Label Logic

- **No location set, single countryScope:** Shows the country name as a hint (e.g. `"United Kingdom"`, `"Singapore"`). Powered by `SCOPE_LABELS` map at module level.
- **Location set:** Shows `buildPillText(label, sublabel)` — strips the trailing country segment from sublabel so the pill reads `"Birmingham, West Midlands"` not `"Birmingham, West Midlands, UK"`.
- **Hover tooltip (`title`):** Always shows full `label + sublabel` including country.

---

## File Structure

```
components/location-picker/
  LocationPicker.tsx    ← main component + PanelContent + LocationRow + icons
  LocationSearch.tsx    ← types, static data, mock/real search, standalone component
  index.ts              ← re-exports all types and components

app/api/places/
  route.ts              ← Next.js App Router proxy for Google Places API

app/snippets/location-picker/
  page.tsx              ← 6 live use cases + developer reference
```

---

## Use Cases (snippet page)

| # | Description | Key prop |
|---|---|---|
| 1 | Country-gated — `OverlayCountrySelect` gate; picker activates after country pick | `countryScope` set after selection |
| 2 | UK scope, empty start — pill shows "United Kingdom" until location picked | `countryScope={["UK"]}` |
| 3 | Singapore scope, prefilled — edit flow demo | `defaultValue` Orchard Road |
| 4 | UK scope, radius in miles | `radiusUnit="mi"` |
| 5 | Google Places mock (SG) | `searchProvider="google"` |
| 6 | Disabled with pre-filled value | `disabled` |
| 7 | Link trigger — form row, plain link, dark bg | `trigger="link"`, `triggerClassName` |

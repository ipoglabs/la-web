# Country Detection & Gate — Architecture Plan

> **Status:** ✅ Implementation complete — frozen and ready for API integration.
> **Date:** 2026-06-28 (v5 — config refactored to top-level `/config/` structure)

> ⚠️ **Superseded 2026-07-13:** The "Critical Naming Inconsistency" section below proposed keeping the internal config key as `"uk"` and bridging it to ISO `"GB"` via an `isoCode` field. The actual fix taken was simpler — the internal key itself was renamed to `"gb"` app-wide (`config/types.ts` `CountryCode = "in" | "gb" | "sg"`, `config/countries/gb.ts`). The `isoCode` field still exists on `CountryConfig` (mapping `"gb"` → `"GB"` for cookies/Cloudflare/API params), but every `COUNTRY_CONFIGS["uk"]` reference below should be read as `COUNTRY_CONFIGS["gb"]` in current code. Treat the naming-inconsistency narrative as historical context, not the current state.

---

## What We're Building

A root-level country gate that:
1. Reads the user's country from **Cloudflare** at the edge — zero client round-trip.
2. Saves it into a **global cookie + React context** — this is the "session".
3. **Blocks all navigation** until a country is committed.
4. For users from **unsupported countries** — shows the same picker overlay but with a contextual banner telling them what was detected and what is available. They **can still select an allowed country and browse** — not a hard wall.
5. Shows a clean **3-country picker** (UK · India · Singapore) when auto-detection fails.
6. All cookie max-ages driven from **`GLOBAL_CONFIG`** — one place to change, everywhere updates.

Allowed countries: **United Kingdom (GB) · India (IN) · Singapore (SG)**
These are defined by `COUNTRY_CONFIGS` in `config/index.ts` — assembled from individual country files in `config/countries/`.

---

## Critical Naming Inconsistency (Historical — Already Resolved)

> This section describes the problem as it stood on 2026-06-28. It was resolved on 2026-07-13 by renaming the internal key directly to `"gb"` (not by keeping `"uk"` with an isoCode bridge as originally proposed here). Kept for historical context only.

Before anything else — there is a naming mismatch baked into the codebase that must be bridged:

| Layer | UK uses | India uses | Singapore uses |
|---|---|---|---|
| `config/` (new top-level) | `"uk"` (now `"gb"`) | `"in"` | `"sg"` (internal keys, lowercase) |
| `lib/country-context.ts` / cookies / Cloudflare | `"GB"` | `"IN"` | `"SG"` (ISO 3166-1 alpha-2, uppercase) |
| `lib/data/countries.ts` | `code: "GB"` | `code: "IN"` | `code: "SG"` |

**Root cause:** The config key `"uk"` was not a valid ISO code — the correct ISO is `"GB"`. **Resolution actually taken:** rename the internal key to `"gb"` directly throughout the codebase, rather than keeping `"uk"` and bridging it.

**Bridge solution (superseded — not what was built):** The paragraph below proposed adding an `isoCode` field and keeping `"uk"` as the internal key. That field does exist on `CountryConfig` today, but the internal key is `"gb"`, not `"uk"`:
```ts
in:  { isoCode: "IN", ... }
gb:  { isoCode: "GB", ... }   ← current: key IS "gb", isoCode is just the uppercase form
sg:  { isoCode: "SG", ... }
```

This makes `COUNTRY_CONFIGS` the **single source of truth for allowed countries**: the allowed ISO codes are derived by reading `isoCode` from every entry. Adding a 4th country to `COUNTRY_CONFIGS` automatically makes it allowed — no other file to update.

---

## What Already Exists (and What We Do With It)

| File | Action | Reason |
|---|---|---|
| `lib/country-config.ts` | **Modify** | Add `isoCode` to `CountryConfig` + each entry. Add `cookieMaxAgeDays` + `blockedCookieMaxAgeHours` to `GLOBAL_CONFIG`. |
| `lib/country-context.ts` | **Modify** | Derive `ALLOWED_COUNTRY_CODES` from `COUNTRY_CONFIGS`. Add `isAllowedCountry()`. Add `BLOCKED_COOKIE`. Drive max-ages from `GLOBAL_CONFIG`. |
| `proxy.ts` | **Modify** | Add CF header reading. Three-path routing: allowed / blocked / pending. |
| `lib/country-cookie.ts` | **Modify** | Add `commitBlockedCountry()`. Update `clearCountryCookies()` to also clear `countryBlocked`. Fix footer note to use dynamic max-age from config. |
| `app/layout.tsx` | **Modify** | Three-branch gate: allowed → app / blocked → picker-with-banner / pending → detector. |
| `components/country/CountryDetector.tsx` | **Modify** | Use `isAllowedCountry()`. On unsupported detect → pass `detectedCountry` to picker. |
| `components/overlay-country-select/index.tsx` | **Modify** | Filter grid to allowed 3 countries. Accept `detectedCountry` prop for contextual banner mode. |
| `components/country/CountryProvider.tsx` | **Unchanged** | Perfect as-is. |
| `components/country/CountryBadge.tsx` | **Unchanged** | Passive display. |
| `components/country/ResetButton.tsx` | **Unchanged** | Dev utility. |
| `lib/data/countries.ts` | **Unchanged** | 13-country list stays for phone input. |

**No new files needed.** The "unsupported country" experience is the same `OverlayCountrySelect` in a new mode — not a separate component.

---

## Architecture Debates

### Debate 1 — Source of truth for "allowed countries"

**Option A — Hardcoded constant in `country-context.ts`**
```ts
export const ALLOWED_COUNTRY_CODES = ["GB", "IN", "SG"] as const;
```
Simple. But now allowed countries are defined in two places: `COUNTRY_CONFIGS` (business config) and this constant (gate logic). Adding a 4th country requires two file edits.

**Option B — Derive from `COUNTRY_CONFIGS.isoCode`**
```ts
// country-context.ts
import { COUNTRY_CONFIGS } from "@/config";
export const ALLOWED_COUNTRY_CODES = Object.values(COUNTRY_CONFIGS)
  .map(c => c.isoCode) as string[];
```
`COUNTRY_CONFIGS` is the single source of truth. One edit to add a country. `country-config.ts` stays clean (no dependency on `country-context.ts` — no circular import).

**Decision: Option B — derive from `COUNTRY_CONFIGS`.** The config is the authority. The gate reads from it.

---

### Debate 2 — Detection: Cloudflare edge vs. client fetch

**Option A — `cf-ipcountry` header in middleware (Cloudflare edge)**
- CF injects `cf-ipcountry: IN` on every request.
- Middleware reads it, sets `countryContext` cookie before any page renders.
- Zero client JS needed. Zero extra latency.
- ✅ Primary path in production.

**Option B — Client `CountryDetector` → ipinfo.io**
- Middleware can't see a CF header → sets `countryPending=1` → client fires IP API call.
- Extra round-trip. Runs post-hydration.
- ✅ Required fallback: local dev, non-CF environments, or CF miss.

**Option C — Next.js API route reads CF header then responds**
- Extra hop, no advantage.
- ❌ Dropped.

**Decision: A (primary) + B (fallback). The system naturally degrades: no CF header → client detection → manual picker.**

---

### Debate 3 — What happens when a user is detected from an unsupported country?

**Option A — Hard block**
> "lokalads isn't available in Germany." Full stop. No path forward.

Downside: VPN users, expats, people travelling are all permanently locked out on that device.

**Option B — Contextual picker overlay (selected)**
Show the standard `OverlayCountrySelect` picker, but with an information banner in the header:
> "We detected you're browsing from **Germany 🇩🇪**. lokalads is currently available in:"
> [🇬🇧 United Kingdom] [🇮🇳 India] [🇸🇬 Singapore]
> "Select a country to continue."

User can tap any of the 3 allowed countries → commits that cookie → enters the app. No hard wall. Respects VPN users and expats.

**Option C — Separate "unsupported" page**
A whole route `/unsupported` with a message and a link back.
Downside: more routes, more maintenance, breaks the overlay-gate pattern.

**Decision: Option B — same `OverlayCountrySelect` component with a `detectedCountry` prop.** Single component, two modes: normal (no banner) vs. contextual (banner at top). No new component created.

---

### Debate 4 — Three gate states

Current: `allowed | pending`. New: `allowed | pending | blocked`.

**blocked** = a country was positively detected, but it's not GB/IN/SG.

Cookie approach:
- `countryContext=IN` — allowed, renders app.
- `countryPending=1` — no signal, triggers client detection.
- `countryBlocked=DE` — detected but not served (value = the detected ISO code, used for UX copy: "We see you're in Germany").

Why 3 separate cookies instead of a combined status cookie:
- Each has a different max-age.
- They can coexist transitionally without conflicts.
- Middleware can read and act on each independently.
- Pattern is consistent with the existing `countryContext` + `countryPending` design.

**Decision: Three-cookie approach (builds on existing pattern).**

---

### Debate 5 — Cookie max-ages: hardcoded vs. config-driven

Current: `COOKIE_MAX_AGE = 60 * 60 * 24 * 30` hardcoded in `country-context.ts`.

The user's requirement: "if I select India it will be in my local session for XX days — set this in global config."

**Design:**
```ts
// config/global.ts → GLOBAL_CONFIG
cookieMaxAgeDays: 30,          // countryContext — user's selected country persists
blockedCookieMaxAgeHours: 1,   // countryBlocked — short, so VPN retries work
```

Computed in `country-context.ts`:
```ts
export const COOKIE_MAX_AGE         = GLOBAL_CONFIG.cookieMaxAgeDays * 86400;
export const BLOCKED_COOKIE_MAX_AGE = GLOBAL_CONFIG.blockedCookieMaxAgeHours * 3600;
```

The overlay footer note "Your preference is saved for 30 days" also becomes dynamic:
```tsx
`Your preference is saved for ${GLOBAL_CONFIG.cookieMaxAgeDays} days`
```

**Decision: Config-driven. All durations in `GLOBAL_CONFIG`. Zero magic numbers in code.**

---

### Debate 6 — Where `ALLOWED_COUNTRY_CODES` is derived (circular import risk)

Current dependency graph:
```
country-config.ts  ← no imports from our lib
country-context.ts ← no imports from our lib (currently)
country-cookie.ts  ← imports from country-context.ts
proxy.ts           ← imports from country-context.ts
layout.tsx         ← imports from country-context.ts, country-config.ts
```

Proposed new dependency:
```
country-config.ts  ← no change (standalone)
country-context.ts ← imports COUNTRY_CONFIGS from country-config.ts  ✅ safe, no circle
country-cookie.ts  ← imports from country-context.ts (unchanged)
proxy.ts           ← imports from country-context.ts (unchanged)
```

**No circular imports. Safe.**

---

### Debate 7 — Local dev without Cloudflare

`cf-ipcountry` header only exists when behind a Cloudflare proxy. In local dev it is absent.

| Approach | Pros | Cons |
|---|---|---|
| `MOCK_COUNTRY=IN` in `.env.local` → middleware injects it | Predictable, testable, fast | Developer must set it |
| Let it fall through → `countryPending` → `CountryDetector` → ipinfo.io | Zero config, tests the real fallback path | Needs internet; ipinfo.io rate limit |
| Hard bypass: skip gate in `NODE_ENV=development` | Fast dev | Gate untestable locally |

**Decision: Both Option 1 and Option 2 simultaneously.**
- If `process.env.MOCK_COUNTRY` is set → middleware uses it as if it were the CF header (dev shortcut).
- If not set → natural fallback: `countryPending=1` → `CountryDetector` → ipinfo.io → picker.
- No hard bypass. Gate is always testable.
- Document in `.env.local.example`.

---

## Full Detection & Gate Flow

```
Browser makes any request
        │
        ▼
  Next.js Middleware (Edge)
        │
        ├─ Always bypass: /_next / /api / static files (.ico, .svg …)
        │
        ├─ Internal routes (/design-system, /snippets) → Basic Auth guard only
        │    (no country gate — these are dev tools, not user-facing)
        │
        ├─ 1. countryContext cookie present?
        │     └─ isAllowedCountry(cookie) = true → ✅ pass through (fast path, ~all repeat visits)
        │
        ├─ 2. MOCK_COUNTRY env set? (dev only)
        │     └─ isAllowedCountry(MOCK_COUNTRY) → set countryContext cookie → ✅ pass through
        │
        ├─ 3. CF header (cf-ipcountry / COUNTRY_HEADER env) present?
        │     ├─ isAllowedCountry(header) = true
        │     │     └─ set countryContext=code (30d) + clear countryBlocked → ✅ pass through
        │     └─ Not allowed (e.g. DE)
        │           └─ set countryBlocked=DE (1h) + clear countryPending → proceed
        │                   ↓ (layout renders contextual picker overlay)
        │
        └─ 4. No signal at all
              └─ set countryPending=1 (5min) → proceed
                      ↓ (layout renders CountryDetector)
                              │
                              ▼
                    CountryDetector (client component)
                              │
                    fetch ipinfo.io (5s timeout)
                              │
                    ├─ isAllowedCountry(ip.country) = true
                    │     └─ commitCountry(code) → router.refresh() → ✅ app renders
                    │
                    ├─ Not allowed (e.g. FR)
                    │     └─ commitBlockedCountry(code)
                    │           → render <OverlayCountrySelect detectedCountry="FR" />
                    │
                    └─ Fetch fails / timeout
                          └─ render <OverlayCountrySelect /> (no detected country)

─────────────────────────────────────────────────────────────────

Root Layout (Server Component) — reads cookies after middleware
        │
        ├─ countryContext valid (GB/IN/SG)
        │     └─ <CountryProvider country={code}> wraps full app ✅
        │
        ├─ countryBlocked = "DE" (or any non-allowed code)
        │     └─ <OverlayCountrySelect detectedCountry="DE" />
        │          (shows banner: "We detected Germany. Available in: 🇬🇧 🇮🇳 🇸🇬")
        │
        └─ countryPending = 1 (or nothing at all)
              └─ <CountryDetector /> (client — fires ipinfo.io)

─────────────────────────────────────────────────────────────────

User selects a country in OverlayCountrySelect (any mode)
        │
        └─ commitCountry("IN")
              → sets countryContext=IN (30d)
              → clears countryPending + countryBlocked
              → router.refresh()
              → layout re-reads cookies → CountryProvider wraps app ✅
```

---

## Cookie Spec

| Cookie | Value | Max-Age | Source | Purpose |
|---|---|---|---|---|
| `countryContext` | `IN` / `GB` / `SG` | `GLOBAL_CONFIG.cookieMaxAgeDays` (30d) | middleware or client | Active allowed country — gates all routes |
| `countryPending` | `1` | 5 min (hardcoded — short by design) | middleware | "No country detected yet, client should try" |
| `countryBlocked` | e.g. `DE` | `GLOBAL_CONFIG.blockedCookieMaxAgeHours` (1h) | middleware or client | "Detected but not served" — used for UX copy |

All `HttpOnly: false` — client must read and rewrite them.
All `SameSite: Lax`, `Path: /`.

---

## Component Design — `OverlayCountrySelect` (Enhanced)

Two rendering modes driven by `detectedCountry` prop:

**Mode A — Normal picker (no detected country)**
```
┌─────────────────────────────────────────┐
│            🌏                           │
│      Where are you based?               │
│  Select your country to get the right   │
│            experience                   │
├─────────────────────────────────────────┤
│  [🇬🇧 UK]  [🇮🇳 India]  [🇸🇬 Singapore]  │
├─────────────────────────────────────────┤
│  Your preference is saved for 30 days   │
└─────────────────────────────────────────┘
```

**Mode B — Contextual banner (detected unsupported country, e.g. Germany)**
```
┌─────────────────────────────────────────┐
│  ⚠ We noticed you're browsing from      │
│     Germany 🇩🇪                         │
│                                         │
│  lokalads is currently available in:    │
│  🇬🇧 United Kingdom · 🇮🇳 India ·         │
│  🇸🇬 Singapore                           │
│                                         │
│  Please select a country to continue.   │
├─────────────────────────────────────────┤
│  [🇬🇧 UK]  [🇮🇳 India]  [🇸🇬 Singapore]  │
├─────────────────────────────────────────┤
│  Your preference is saved for 30 days   │
└─────────────────────────────────────────┘
```

The grid is always filtered to `ALLOWED_COUNTRY_CODES` only — 3 cards.
Tapping any card calls `commitCountry(code)` + `router.refresh()` — same in both modes.

---

## Exact Code Changes

### 1. `lib/country-config.ts`

**Add to `CountryConfig` interface:**
```ts
/** ISO 3166-1 alpha-2 code for this country (e.g. "GB", "IN", "SG").
 *  This bridges the internal config key (e.g. "gb") and the cookie/CF value (e.g. "GB").
 *  ALLOWED_COUNTRY_CODES is derived from this field — adding a country here
 *  automatically adds it to the gate. */
isoCode: string;
```

**Add to `GLOBAL_CONFIG`:**
```ts
/**
 * How long the countryContext cookie persists after the user selects a country.
 * This is the "session" duration — controls the "saved for X days" copy.
 */
cookieMaxAgeDays: 30,

/**
 * How long the countryBlocked cookie persists.
 * Short — allows VPN users to retry by clearing or switching to an allowed country.
 */
blockedCookieMaxAgeHours: 1,
```

**Add `isoCode` to each country config:**
```ts
in: { isoCode: "IN", currency: "INR", ... }
uk: { isoCode: "GB", currency: "GBP", ... }
sg: { isoCode: "SG", currency: "SGD", ... }
```

---

### 2. `lib/country-context.ts`

```ts
import { COUNTRY_CONFIGS, GLOBAL_CONFIG } from "@/config";

// ── Allowed countries — derived from COUNTRY_CONFIGS (single source of truth) ──
// Adding a country to COUNTRY_CONFIGS with an isoCode automatically allows it here.
export const ALLOWED_COUNTRY_CODES = Object.values(COUNTRY_CONFIGS)
  .map(c => c.isoCode)
  .filter(Boolean);
export type AllowedCountry = string; // constrained at runtime by isAllowedCountry()

export function isAllowedCountry(code: string): boolean {
  return ALLOWED_COUNTRY_CODES.includes(code);
}

// ── New cookie ──
export const BLOCKED_COOKIE = "countryBlocked";

// ── Max-ages from GLOBAL_CONFIG (no magic numbers in app code) ──
export const COOKIE_MAX_AGE         = GLOBAL_CONFIG.cookieMaxAgeDays * 86400;
export const BLOCKED_COOKIE_MAX_AGE = GLOBAL_CONFIG.blockedCookieMaxAgeHours * 3600;
// PENDING_MAX_AGE stays hardcoded (5 min — intentionally short, not user-configurable)

// Keep existing isSupportedCountry() + SUPPORTED_CODES unchanged — phone input uses them.
```

---

### 3. `lib/country-cookie.ts`

```ts
// Add:
export function commitBlockedCountry(code: string) {
  document.cookie = `${BLOCKED_COOKIE}=${code}; path=/; max-age=${BLOCKED_COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `${PENDING_COOKIE}=; path=/; max-age=0`;
}

// Update clearCountryCookies() to also wipe countryBlocked:
export function clearCountryCookies() {
  document.cookie = `${COUNTRY_COOKIE}=;   path=/; max-age=0`;
  document.cookie = `${PENDING_COOKIE}=;   path=/; max-age=0`;
  document.cookie = `${BLOCKED_COOKIE}=;   path=/; max-age=0`;  // ← add
}
```

---

### 4. `proxy.ts` (renamed from `middleware.ts` 2026-07-13)

After the existing Basic Auth block, replace the current country detection logic:

```ts
// ── Country gate (skip internal dev routes) ──
if (!requiresAuth(pathname)) {

  // 1. Already resolved
  const existingCountry = request.cookies.get(COUNTRY_COOKIE)?.value ?? "";
  if (isAllowedCountry(existingCountry)) return NextResponse.next();

  // 2. Dev shortcut
  const mockCountry = process.env.MOCK_COUNTRY ?? "";
  if (mockCountry && isAllowedCountry(mockCountry)) {
    const res = NextResponse.next();
    res.cookies.set(COUNTRY_COOKIE, mockCountry, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
    return res;
  }

  // 3. Cloudflare (or configurable header)
  const cfHeader = process.env.COUNTRY_HEADER ?? "cf-ipcountry";
  const cfCode   = request.headers.get(cfHeader)?.toUpperCase() ?? "";
  if (cfCode) {
    const res = NextResponse.next();
    if (isAllowedCountry(cfCode)) {
      res.cookies.set(COUNTRY_COOKIE, cfCode, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax", httpOnly: false });
      res.cookies.delete(BLOCKED_COOKIE);
    } else {
      res.cookies.set(BLOCKED_COOKIE, cfCode, { path: "/", maxAge: BLOCKED_COOKIE_MAX_AGE, sameSite: "lax", httpOnly: false });
      res.cookies.delete(PENDING_COOKIE);
    }
    return res;
  }

  // 4. No signal — flag for client detection
  const res = NextResponse.next();
  if (!request.cookies.get(PENDING_COOKIE)?.value) {
    res.cookies.set(PENDING_COOKIE, "1", { path: "/", maxAge: PENDING_MAX_AGE, sameSite: "lax", httpOnly: false });
  }
  return res;
}
```

---

### 5. `app/layout.tsx`

```tsx
const raw          = jar.get(COUNTRY_COOKIE)?.value ?? "";
const blockedCode  = jar.get(BLOCKED_COOKIE)?.value ?? "";
const country      = isAllowedCountry(raw) ? raw : null;

// Branch 1 — allowed
if (country) {
  // full app inside CountryProvider (existing)
}
// Branch 2 — detected but not served
else if (blockedCode) {
  return <OverlayCountrySelect detectedCountry={blockedCode} />;
}
// Branch 3 — pending (client detects)
else {
  return <CountryDetector />;
}
```

---

### 6. `components/country/CountryDetector.tsx`

```tsx
.then((data) => {
  const code = data?.country?.toUpperCase() ?? "";
  if (isAllowedCountry(code)) {        // ← was: isSupportedCountry
    commitCountry(code);
    router.refresh();
  } else if (code) {
    commitBlockedCountry(code);        // ← new: store what was detected
    setDetectedCountry(code);
    setShowPicker(true);
  } else {
    setShowPicker(true);
  }
})
.catch(() => setShowPicker(true));

// Render:
if (showPicker) {
  return <OverlayCountrySelect detectedCountry={detectedCountry ?? undefined} />;
}
```

---

### 7. `components/overlay-country-select/index.tsx`

```tsx
// New prop:
interface Props {
  currentCode?:     string;
  detectedCountry?: string;  // ← new: ISO code of the detected (unsupported) country
  onSelect?:        (code: string) => void;
  onClose?:         () => void;
}

// Filter grid to allowed countries only:
import { ALLOWED_COUNTRY_CODES, GLOBAL_CONFIG } from "...";
const allowedCountries = COUNTRIES.filter(c => ALLOWED_COUNTRY_CODES.includes(c.code));

// Header — two modes:
{detectedCountry ? (
  // Mode B: contextual banner
  <div className="contextual-banner">
    <p>We noticed you're browsing from <strong>{countryName(detectedCountry)}</strong> {flag}</p>
    <p>lokalads is currently available in:</p>
    <p>{allowedCountries.map(c => `${c.flag} ${c.name}`).join(" · ")}</p>
    <p>Please select a country to continue.</p>
  </div>
) : (
  // Mode A: standard header (existing)
  <div>🌏 Where are you based? ...</div>
)}

// Footer note (dynamic):
<p>Your preference is saved for {GLOBAL_CONFIG.cookieMaxAgeDays} days</p>
```

---

## What Does NOT Change

- `components/country/CountryProvider.tsx` — untouched.
- `components/country/CountryBadge.tsx` — untouched.
- `components/country/ResetButton.tsx` — untouched.
- `lib/data/countries.ts` — untouched (13 countries for phone input).
- `config/countries/*.ts` country entries — only `isoCode` added, no structural change.
- All existing POC/snippet/design-system pages — untouched.
- `SUPPORTED_CODES` / `isSupportedCountry()` in `country-context.ts` — untouched.

---

## Build Order (Implementation Sequence)

Build in this order to avoid broken states mid-way:

```
1. config/types.ts + config/global.ts → types, isoCode, GLOBAL_CONFIG max-ages
2. config/countries/in.ts, uk.ts, sg.ts → per-country isoCode values
2. lib/country-context.ts       → derive ALLOWED, add isAllowedCountry, add BLOCKED_COOKIE, fix max-ages
3. lib/country-cookie.ts        → add commitBlockedCountry, update clearCountryCookies
4. proxy.ts                     → CF header reading, three-path routing
5. components/overlay-country-select/index.tsx  → filter grid, detectedCountry prop
6. components/country/CountryDetector.tsx       → use isAllowedCountry, blocked path
7. app/layout.tsx               → three-branch gate
```

Each step is independently verifiable before the next.

---

---

## API Architecture — Country-Scoped API Calls

Every API call in this app must carry the active country. The `useCountryConfig()` hook is the single entry point for all country-aware code.

### The Standard Pattern

```ts
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

export default function MyPage() {
  const { isoCode, countryCode, config } = useCountryConfig();

  // Pass isoCode to every API call:
  const listings = await fetch(`/api/listings?country=${isoCode}`);
  const alerts   = await fetch(`/api/alerts?country=${isoCode}`);

  // Use config for UI decisions — never hardcode:
  config.currency          // "INR" / "GBP" / "SGD"
  config.currencySymbol    // "₹" / "£" / "S$"
  config.displayName       // "India" / "United Kingdom" / "Singapore"
  config.locationScope     // ["IN"] / ["UK"] / ["SG"] → pass to LocationPicker
  config.radiusUnit        // "km" / "mi" → pass to LocationPicker
  config.enabledCategories // ordered category list for this country
}
```

### What `isoCode` vs `countryCode` is for

| Value | Example | Use for |
|---|---|---|
| `isoCode` | `"IN"`, `"GB"`, `"SG"` | API query params, cookies, Cloudflare header, URL params |
| `countryCode` | `"in"`, `"gb"`, `"sg"` | `COUNTRY_CONFIGS[countryCode]`, `getFeatures(countryCode)` |

Always pass `isoCode` in API calls (it's the universal standard). Use `countryCode` only internally when reading from `COUNTRY_CONFIGS`.

### API Route Design (Server)

All API routes that return country-specific data must accept a `country` query param:

```
GET /api/listings?country=IN&q=laptop&cat=electronics
GET /api/alerts?country=GB
GET /api/places?country=SG&input=orchard
GET /api/popular-searches?country=IN
```

In the API route handler:
```ts
// app/api/listings/route.ts
import { isAllowedCountry } from "@/lib/country-context";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") ?? "";

  // Always validate — never trust client input
  if (!isAllowedCountry(country)) {
    return Response.json({ error: "Invalid country" }, { status: 400 });
  }

  // Proceed with country-scoped query
}
```

### Rules

1. **Never hardcode a country** in any component or page — always use `useCountryConfig()`
2. **Every API call passes `country=isoCode`** as a query param
3. **Every API route validates** the country with `isAllowedCountry()` before proceeding
4. **LocationPicker always gets** `countryScope={config.locationScope}` and `radiusUnit={config.radiusUnit}` from config
5. **AppHeader + AppFooter** derive their display name from config — no props needed from layout

### Adding a 4th Country (zero-config cascade)

```
1. Add entry to COUNTRY_CONFIGS with isoCode, displayName, locationScope, radiusUnit, etc.
2. That's it.
```
- `ALLOWED_COUNTRY_CODES` auto-updates (derived from `COUNTRY_CONFIGS`)
- `isAllowedCountry()` auto-accepts it
- `useCountryConfig()` resolves it
- Header + footer show correct name
- LocationPicker scopes correctly
- All API calls carry the right isoCode

---

## Post-Build Additions (beyond original plan)

These were added during and after implementation:

### `config/` — Top-level config structure (v5)

The entire country config system was extracted from `lib/country-config.ts` into a
clean top-level `/config/` directory. `lib/country-config.ts` deleted entirely.

```
config/
  types.ts              ← pure types only: CountryCode, CountryConfig, CountryFeatures
                           no runtime code, no imports from other files
  global.ts             ← GLOBAL_CONFIG: cookie durations, date format, feature defaults
                           one value change → every consumer updates automatically
  countries/
    in.ts               ← India — self-contained, one job
    uk.ts               ← United Kingdom — self-contained, one job
    sg.ts               ← Singapore — self-contained, one job
  index.ts              ← assembles COUNTRY_CONFIGS + all helpers
                           THE ONLY file consumers import from
```

**All consumers import from one honest path:**
```ts
import { COUNTRY_CONFIGS, GLOBAL_CONFIG, getConfigByIso } from "@/config";
import type { CountryCode, CountryConfig } from "@/config";
```

**Adding a 4th country (zero-config cascade):**
1. Create `config/countries/au.ts` (copy `sg.ts` as template, fill in the blanks)
2. Add `"au"` to `CountryCode` in `config/types.ts`
3. Two lines in `config/index.ts` — import + register in `COUNTRY_CONFIGS`
4. TypeScript errors guide every missing required field — no silent gaps
5. Zero other files change — gate, context, hooks, API all auto-update

**Dependency graph (no circular imports):**
```
config/types.ts         ← no imports (pure types)
config/global.ts        ← imports from config/types.ts only
config/countries/*.ts   ← imports from config/types.ts only
config/index.ts         ← imports from all of the above, assembles + exports
lib/country-context.ts  ← imports from @/config
lib/country-cookie.ts   ← imports from lib/country-context.ts
proxy.ts               ← imports from lib/country-context.ts
app/layout.tsx          ← imports from @/config and lib/country-context.ts
components/*            ← imports from @/config
```

```ts
displayName: string;       // "India" / "United Kingdom" / "Singapore" — used in header, overlays, footer
locationScope: string[];   // e.g. ["IN"] — passed to LocationPicker.countryScope
radiusUnit: "km" | "mi";  // UK uses miles, others km — passed to LocationPicker.radiusUnit
```

`getConfigByIso(isoCode)` helper added — for server components that can't call hooks:
```ts
// app/layout.tsx (server component)
const entry = getConfigByIso(raw);  // raw = cookie ISO value
const countryCode  = entry?.code ?? "in";
const countryLabel = entry?.config.displayName ?? "";
```

### `lib/hooks/useCountryConfig.ts` — Standard hook (new file)

The single import for all country-aware client code:
```ts
const { isoCode, countryCode, config } = useCountryConfig();
```
See file JSDoc for full API pattern and rules.

### `components/overlay-country-select/index.tsx` — Enhancements

- **Pre-selection from cookie** — `readActiveCookie()` seeds `selected` state so the previously chosen country is ticked on open (switch-country flow).
- **Tick badge** — selected card shows a blue circle + white checkmark in the top-right corner.
- **`onMouseDown={(e) => e.stopPropagation()}`** on the outermost div — **critical bug fix**: prevents `AvatarDropdown`'s outside-click handler (`mousedown` on `document`) from firing before the country card `click` completes, which would unmount the overlay before `handleSelect` runs.
- **`router.refresh()` always inside `handleSelect`** (before `onSelect`) — ensures refresh fires even if the calling component unmounts immediately after `onSelect`.
- **`getDisplayName()`** helper — shows "United Kingdom" from `COUNTRY_CONFIGS.displayName` instead of raw "UK" from the countries list.

### `components/la-blocks/AppHeader.tsx` — Country label

```tsx
// Logo is <span> (non-clickable) on the landing page, <Link href="/"> elsewhere
const isLanding = pathname === "/";

// Country label below logo text (only on sm+)
<span className="absolute right-0 -bottom-3.5 text-[10px] font-normal text-slate-900 whitespace-nowrap subpixel-antialiased">
  {config.displayName}
</span>
```

`subpixel-antialiased` overrides the global `antialiased` to keep small absolute-positioned text sharp.

### `app/page.tsx` + `app/(main)/listings/page.tsx` — LocationPicker wired

```tsx
const { config: countryConfig } = useCountryConfig();
<LocationPicker
  countryScope={countryConfig.locationScope}
  radiusUnit={countryConfig.radiusUnit}
  ...
/>
```

### `components/avatar/AvatarDropdown.tsx` — Switch Country fix

- Removed redundant `router.refresh()` from `onSelect` callbacks — it now lives entirely inside `OverlayCountrySelect.handleSelect`.
- The `onSelect` callback is now UI-cleanup only (close the dropdown/drawer).

---

## Known TODOs (for API integration sprint)

These are marked with `// TODO` in the source code:

| File | TODO |
|---|---|
| `proxy.ts` | Ensure `MOCK_COUNTRY` is NOT set in production env — add CI lint check |
| `proxy.ts` | Add CF WAF rule to strip spoofed `cf-ipcountry` if behind another proxy |
| `components/country/CountryDetector.tsx` | ipinfo.io free tier = 50k req/month; switch to MaxMind GeoLite2 or paid plan for production |
| `components/country/CountryDetector.tsx` | On allowed country detect: POST `/api/user/preferences { country }` to sync backend session |
| `components/overlay-country-select/index.tsx` | On country select: POST `/api/user/preferences { country }` to persist backend-side |
| `components/avatar/AvatarDropdown.tsx` | Wire `signOut()` from chosen auth provider (NextAuth v5 / Lucia / better-auth) |
| `app/layout.tsx` | Drive `popularCategories` per-country from `COUNTRY_CONFIGS.enabledCategories` |
| `app/layout.tsx` | Replace `topLocations` with country-appropriate cities (UK, SG need different lists) |

---

## Summary

| Concern | Decision |
|---|---|
| Allowed countries source of truth | `COUNTRY_CONFIGS` keys + `isoCode` field — one place to add a country |
| ISO naming bridge | `isoCode` field in `CountryConfig` maps `"gb"` → `"GB"` etc. (internal key is `"gb"`, not `"uk"` — see superseded note at top of this doc) |
| Detection source | CF `cf-ipcountry` header (middleware, primary) + ipinfo.io (client fallback) |
| Unsupported country UX | Same `OverlayCountrySelect` with `detectedCountry` prop — contextual banner + 3-country grid. User CAN select and browse. Not a hard wall. |
| Cookie strategy | 3 cookies: `countryContext` (30d) / `countryPending` (5min) / `countryBlocked` (1h) |
| Cookie durations | All configurable from `GLOBAL_CONFIG` — no magic numbers in code |
| Manual picker contents | Filtered to 3 allowed countries only |
| Storage | Cookie (SSR + middleware readable) + React context (in-memory session) |
| Local dev | `MOCK_COUNTRY` env var → natural ipinfo.io fallback if not set |
| New components | Zero — existing `OverlayCountrySelect` handles all modes |
| Breaking changes | None — phone input, all snippets, all POCs untouched |

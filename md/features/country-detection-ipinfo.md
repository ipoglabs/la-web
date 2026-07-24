# Country Detection — Feature Documentation

> **"Less, but better."**
> Detect silently. Ask only when necessary. Never block without reason.

---

## 1. High-Level Principle

Every global website has one fundamental question before it can serve the right content:
**Where is this user coming from?**

The principle behind this implementation is a **graceful cascade** — try the fastest method first, fall back only when needed, ask the user only as a last resort. Once we know, remember it. Never ask again.

Three rules govern every decision:
- **Silent by default** — detection happens invisibly. The user never sees it if it works.
- **Honest fallback** — if we can't detect, we ask. One question. No tricks.
- **Persistent** — stored in a cookie for 30 days. Zero overhead on every return visit.

---

## 2. The 3 Scenarios

**Scenario 1 — Return visitor** *(most common)*
Cookie is already there. Middleware reads it in milliseconds. Page loads instantly. Nothing else runs.

**Scenario 2 — First visit, auto-detect succeeds**
No cookie. We silently call `ipinfo.io` — a free IP geolocation service. It returns the country code. We save it as a cookie. Page loads. User barely noticed anything happened.

**Scenario 3 — First visit, auto-detect fails**
Network issue, VPN, unsupported country — any reason. We show a clean full-screen card with 6 country buttons. User taps their country. Cookie saved. Page loads.

---

## 3. Technical Flow — Step by Step

```
1. User visits any URL
        ↓
2. proxy.ts runs first — before any page renders
   → Has countryContext cookie?  → Pass through immediately  (Scenario 1)
   → No cookie?                  → Set countryPending=1, pass through
        ↓
3. app/layout.tsx reads cookies (server-side)
   → Cookie found → Wrap children in CountryProvider → page renders
   → No cookie    → Render CountryDetector only (children blocked)
        ↓
4. CountryDetector mounts on client
   → Calls ipinfo.io (5 second timeout)
   → Success + supported country → commitCountry() → router.refresh() → step 3  (Scenario 2)
   → Fail / timeout / unsupported → show OverlayCountrySelect
        ↓
5. OverlayCountrySelect
   → User taps a country button
   → commitCountry() → router.refresh() → step 3 → page renders  (Scenario 3)
```

---

## 4. Code Walkthrough — File by File

### `lib/country-context.ts` — The Config Hub
Single source of truth for the entire feature. Every other file imports from here.

```ts
COUNTRY_COOKIE    = "countryContext"     // main cookie name
PENDING_COOKIE    = "countryPending"     // first-load bridge flag
COOKIE_MAX_AGE    = 60 * 60 * 24 * 30   // 30 days
PENDING_MAX_AGE   = 60 * 5              // 5 min — short-lived
IPINFO_URL        = "https://ipinfo.io/json"
DETECTION_TIMEOUT = 5_000               // ms

SUPPORTED_CODES   = ["SG","IN","US","GB","AU","MY"]
isSupportedCountry(code)  // type guard — validates any raw string before trusting it
```

Want to add a country? Add to `SUPPORTED_CODES`.
Want to swap the IP service? Change `IPINFO_URL`.
Change the timeout? Change `DETECTION_TIMEOUT`.
One file. Zero hunting.

---

### `lib/country-cookie.ts` — Cookie Writes (one place)
All `document.cookie` writes live here. No other file touches cookie strings directly.

```ts
commitCountry(code)     // writes countryContext + clears countryPending
clearCountryCookies()   // clears both — used by Reset button
```

If the cookie spec ever changes (add Secure flag, change SameSite, etc.) — update here only.

---

### `proxy.ts` — The First Checkpoint (renamed from `middleware.ts` 2026-07-13)
Runs at the network edge before any React or page code. Stateless. Fast.

Decision tree:
```
Skip → /_next/*, /api/*, /country-select, static files (always pass)
Check → countryContext cookie valid? → pass through immediately
Else  → countryPending already set? → pass through (no-op)
        countryPending not set?     → set it, pass through
```

Key point: **middleware never blocks or redirects**. It only sets cookies.
The layout owns the UI gate. Clean separation of concerns.

---

### `app/layout.tsx` — The Hard Gate
Async Server Component. Runs server-side on every request after middleware.

```ts
const jar = await cookies();   // Next.js 16 — cookies() is async
const raw = jar.get(COUNTRY_COOKIE)?.value ?? "";
const country = isSupportedCountry(raw) ? raw : null;
```

- Country valid → `<CountryProvider country={country}>{children}</CountryProvider>` → page renders
- Country null  → `<CountryDetector />` → **children are never rendered**

This is the enforcement point. One ternary. That is the entire gate.

---

### `CountryDetector.tsx` — Silent Auto-Detection
Client component. Mounts only when country is unknown.

- AbortController + `DETECTION_TIMEOUT` (5s) — never leaves user on a spinner forever
- Calls `IPINFO_URL` — parses `{ country: "SG" }`
- Success + supported → `commitCountry(code)` → `router.refresh()`
- Fail / timeout / unsupported → `setShowOverlay(true)`
- While detecting → full-screen globe icon with pulse animation

---

### `OverlayCountrySelect` (`components/overlay-country-select/`) — Manual Fallback
Only shown when auto-detection fails. Blocking full-screen overlay.

- `fixed inset-0 z-50` — covers full viewport, cannot be bypassed
- 2-column grid of 6 country buttons — flag + name, large tap target
- One tap → `commitCountry(code)` → `router.refresh()`
- No dropdown. No confirm button. No second step. Tap once → done.

---

### `CountryProvider.tsx` — Context for the Whole App
Wraps all children once country is confirmed. Makes country available everywhere.

```ts
// Any client component anywhere in the app:
const country = useCountry(); // returns "SG" | "IN" | "US" | "GB" | "AU" | "MY"
```

`useCountry()` throws if called outside the provider — developer error, caught early.

---

### `CountryBadge.tsx` — Passive Display
Reads `useCountry()`, finds the country object, renders flag + name.
No state. No effects. No loading. Guaranteed to have a country by the time it renders.

---

## 5. UX Design Rationale

**Why is the overlay blocking with no dismiss?**
The app cannot serve the right content without knowing the country. An overlay that can be dismissed defeats the purpose. Six buttons, one tap — 2 seconds. That is a fair ask.

**Why button group and not a dropdown?**
6 countries. All visible at once. One tap confirms. No intermediate state, no placeholder, no Continue button. Fewer steps = better experience.

**Why not a banner or toast?**
Banners can be ignored. Toasts disappear. A full-screen gate is the only honest UI when you genuinely need the answer before anything can load.

**Why globe icon during loading and not a skeleton?**
A skeleton implies the page is almost ready. It is not — we do not know what to show yet. A globe + "Detecting your region…" sets honest expectations.

**The Country Badge**
Small. Muted. Top-right. Not a feature — a trust signal. Quiet confirmation the app is personalised for you.

---

## 6. Key Design Decisions — Q&A

**Why cookie and not localStorage?**
Middleware runs server-side at the edge — it cannot read localStorage. A cookie is readable before any JavaScript runs, enabling server-side gating with zero client overhead.

**Why does middleware not block the page?**
Middleware runs at the network layer before React. Blocking there would produce a blank screen or an unstyled redirect. The layout owns the visual gate. Each layer does what it is good at.

**Why `router.refresh()` and not `window.location.reload()`?**
`router.refresh()` re-runs Server Components only — layout re-reads the cookie, tree re-renders. No full browser reload, no scroll loss, no flash of unstyled content.

**Why is `isSupportedCountry()` called everywhere a code is read?**
IP services and cookies return raw strings. Any value could be there — tampered, stale, or from a previous version. The type guard ensures only valid codes enter the app. Never trust a raw string.

---

## 7. Developer Reference

### Adding a New Country
1. Add entry to `COUNTRIES` in `lib/data/countries.ts`
2. Add code to `SUPPORTED_CODES` in `lib/country-context.ts`

Done. Overlay, badge, provider, and middleware all pick it up automatically.

### Testing Each Scenario

| Scenario | How to trigger |
|---|---|
| Return visit (Scenario 1) | Just navigate — cookie is present |
| Auto-detect (Scenario 2) | Click Reset on `/country-context-poc` |
| Manual overlay (Scenario 3) | Reset + DevTools Network tab → Offline → refresh |

### Cookie Spec
```
Name:     countryContext
Value:    ISO 3166-1 alpha-2 (e.g. "SG")
MaxAge:   2592000 (30 days)
Path:     /
SameSite: Lax
HttpOnly: false  ← client must write it on manual selection
```

### Future — Option A (One Env Var)
When deployed behind Cloudflare or Vercel, set:
```env
COUNTRY_HEADER=cf-ipcountry        # Cloudflare
COUNTRY_HEADER=x-vercel-ip-country # Vercel
```
Middleware reads the header server-side, writes the cookie — `CountryDetector` never mounts.
No code changes required. Rest of the system unchanged.

---

## 8. File Map

| File | Layer | Responsibility |
|---|---|---|
| `lib/country-context.ts` | Shared | Config, constants, type, type guard |
| `lib/country-cookie.ts` | Client | All cookie write operations |
| `proxy.ts` | Edge | Fast cookie check + pending flag |
| `app/layout.tsx` | Server RSC | Hard gate — country or CountryDetector |
| `CountryDetector.tsx` | Client | Silent IP fetch → cookie → refresh |
| `OverlayCountrySelect` (`overlay-country-select/`) | Client | Manual fallback — 6 buttons, one tap |
| `CountryProvider.tsx` | Client | React context + `useCountry()` |
| `CountryBadge.tsx` | Client | Passive flag + name display |
| `ResetButton.tsx` | Client | Dev utility — clear cookies |

---

## 9. API Reference

### ipinfo.io (Primary)
```
GET  https://ipinfo.io/json
Auth: None (free tier)
Response: { "ip": "...", "country": "SG", "city": "...", ... }
Free tier: 50,000 req/month
Timeout: 5 seconds (DETECTION_TIMEOUT in country-context.ts)
```

### ip-api.com (Recommended fallback if needed)
```
GET  http://ip-api.com/json/?fields=countryCode,status
Auth: None (free tier — HTTP only)
Response: { "status": "success", "countryCode": "SG" }
Free tier: 45 req/min
Note: HTTP only on free tier — use as fallback, not primary on HTTPS
```

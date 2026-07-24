# SecurityBlock

Shown when a user's request is blocked by a security or fraud-prevention check.
Guides the user through what happened, why, and exactly what to do next.

**File:** `app/snippets/security-blocked/page.tsx`
(Export `SecurityBlock` and use it anywhere in the app)

---

## Import

```tsx
import { SecurityBlock } from "@/snippets/security-blocked/page";
// or move the component to components/ when integrating into the app
```

---

## Usage

```tsx
// Full page card (default)
<SecurityBlock
  variant="card"
  eventMeta={meta}
  onSignIn={() => router.push("/login")}
  onRetry={() => window.location.reload()}
  onSignOut={() => signOut()}
/>

// Compact inline banner (inside a form or page section)
<SecurityBlock variant="banner" eventMeta={meta} />
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"banner"` \| `"card"` | `"card"` | Layout variant (see below). |
| `eventMeta` | `SecurityEventMeta` | — | Event context passed to the support link. |
| `onSignIn` | `() => void` | Redirects to `/snippets/login` | Sign in again handler. |
| `onRetry` | `() => void` | `window.location.reload()` | Retry the blocked action. |
| `onSignOut` | `() => void` | no-op | Sign out handler. |

### SecurityEventMeta

All fields are optional. Any provided values are appended to the "Contact support" URL as a query payload so the support team can immediately see context.

```ts
type SecurityEventMeta = Partial<{
  event_id:   string;   // Reference ID shown in the footer
  timestamp:  string;   // ISO 8601 — formatted to human-readable in the footer
  path:       string;   // The URL path that was blocked
  client_ip:  string;   // User's IP at time of block
  user_agent: string;   // Browser/device string
  user_id:    string | null;  // Authenticated user ID, or null
}>
```

---

## Variants

### `"card"` — full standalone card

Used when the entire page/flow is blocked (e.g. post creation blocked, checkout blocked).

**Information flow:**
1. Amber shield icon + header — instantly signals caution (not a crash)
2. Calm one-sentence context — factual, non-accusatory
3. "What to try" — 3 icon-led steps in priority order:
   - Sign in again (most common fix)
   - Disable VPN or proxy
   - Wait and retry
4. Primary action: **Sign in again** (full-width blue button)
5. Secondary actions: Retry + Sign out (equal weight)
6. Footer: reference ID + timestamp (mono, quiet) + Contact support link

### `"banner"` — compact inline strip

Used inside a form or page when a single action was blocked but the page itself is still usable.

```
[ 🛡 ] Request blocked — We stopped an unusual action...   [Retry] [Sign in]
```

Wraps gracefully on mobile.

---

## Design decisions

| Decision | Reason |
|---|---|
| Amber colour scheme (not red) | This is a caution/security check — not a system error or crash |
| Steps before actions | User needs context before being asked to act |
| Sign in as primary CTA | Expired/suspicious session is the most common cause |
| Reference footer very quiet | Most users don't need it; support team does |
| Contact support opens new tab | Preserves the blocked-page context for the user |
| Default handlers use `window.location` | Usable standalone without a router |

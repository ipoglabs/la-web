# Input Validation — LokalAds API

> Validation is the first line of defence. Every input from a client is untrusted.  
> This file defines where validation happens, what rules apply, and how to implement them.  
> Last updated: 2026-07-07

---

## The Golden Rule

**Never trust client input. Validate and sanitise everything server-side — regardless of what the frontend already checked.**

Frontend validation is UX. Server-side validation is security. Both are required. They serve different purposes.

---

## Where Validation Lives

```
Client (UX only)
  ↓ sends request
app/api/route.ts              ← authoritative validation happens here
  ↓ calls
lib/validation.ts             ← reusable validators shared across routes
  ↓ passes clean data to
lib/models/*.ts               ← Mongoose schema enforces type constraints as final safety net
```

**Rule:** Route-specific validation (field presence, enum values, business rules) lives in the route file or a co-located helper.  
**Rule:** Reusable validators (email format, E.164 phone, age gate, slug generator) live in `lib/validation.ts`.  
**Rule:** Never rely solely on Mongoose validation — it runs at DB write time. Reject bad input at the route level first.

---

## Validation Checklist for Every Route

Run through this list for every incoming request:

```
[ ] JSON parseable?                → 400 invalid_json if not
[ ] Required fields present?       → 400 validation_error with fields[]
[ ] Field types correct?           → 400 validation_error (string where number expected, etc.)
[ ] String lengths within limits?  → 400 validation_error
[ ] Enum values valid?             → 400 validation_error
[ ] Business rule checks?          → 400 / 409 with specific error code
[ ] HTML/script injection removed? → sanitise (do not reject — strip silently)
[ ] Control characters stripped?   → sanitise (do not reject — strip silently)
```

---

## `lib/validation.ts` — Extend This File

Current state: `lib/validation.ts` has `isValidEmail`, `isValidPhone`, `normalizePhoneDigits`. Extend it with everything below. All helpers are pure functions — no DB calls, no side effects.

```ts
// lib/validation.ts — full production version

// ── String sanitisation ────────────────────────────────────────────────────

/**
 * Strip HTML tags, script injections, null bytes, and ASCII control chars.
 * Returns trimmed string capped at maxLen. Returns null if input is not a string.
 * Use for: names, titles, descriptions, labels — any free text field.
 */
export function sanitizeText(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  return value
    .replace(/<[^>]*>/g, "")                                        // strip HTML/script tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // strip control chars
    .trim()
    .slice(0, maxLen) || null;
}

/**
 * Sanitise HTML for rich text fields (listing descriptions).
 * Allows only a safe subset: <p> <strong> <em> <ul> <ol> <li> <br>
 * Strips everything else including <script>, <img>, <a>, event handlers.
 * Use a battle-tested library like `sanitize-html` for this in production.
 */
export function sanitizeRichText(value: unknown, maxLen = 5000): string | null {
  if (typeof value !== "string") return null;
  // TODO: replace with sanitize-html({ allowedTags: ['p','strong','em','ul','ol','li','br'] })
  // Temporary: strip all tags for safety until library is installed
  return value.replace(/<[^>]*>/g, "").trim().slice(0, maxLen) || null;
}

// ── Field validators ───────────────────────────────────────────────────────

/** RFC 5322-ish email validation. Lowercase and trim before checking. */
export function isValidEmail(value: string): boolean {
  if (!value) return false;
  return /^[\w-.]+@[\w-]+\.[A-Za-z]{2,}$/.test(value.trim().toLowerCase());
}

/** E.164 international phone format: +[country code][number], 7–15 digits total */
export function isValidE164Phone(value: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(value);
}

/** Normalise phone input to digits only (strip spaces, dashes, parens) */
export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Age gate — user must be 18 or older. Accepts Date object or ISO string. */
export function isAgeValid(dob: Date | string, minAge = 18): boolean {
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return false;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - minAge);
  return birth <= cutoff;
}

/** Country code must be one of the 3 supported markets */
export function isValidCountryCode(value: unknown): value is "in" | "gb" | "sg" {
  return value === "in" || value === "gb" || value === "sg";
}

/** Slug: lowercase, hyphens only, no leading/trailing hyphens, 3–120 chars */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length >= 3 && value.length <= 120;
}

/**
 * Generate a URL-safe slug from a title.
 * Converts to lowercase, replaces spaces and special chars with hyphens,
 * collapses multiple hyphens, strips leading/trailing hyphens.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

/** Price must be a positive finite number or null (for free/enquiry listings) */
export function isValidPrice(value: unknown): boolean {
  if (value === null || value === undefined) return true; // null = no price, that's fine
  return typeof value === "number" && isFinite(value) && value >= 0;
}

/** Rating must be an integer 1–5 */
export function isValidRating(value: unknown): boolean {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

// ── Object validators (route-level) ───────────────────────────────────────

/** Validates a listings POST body. Returns error fields array or null if valid. */
export function validateCreateListing(body: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!sanitizeText(body.title, 200))                    errors.push("title");
  if (!body.categoryId)                                   errors.push("categoryId");
  if (!isValidCountryCode(body.countryCode))              errors.push("countryCode");
  if (!sanitizeText(body.locationLabel, 200))             errors.push("locationLabel");
  if (!isValidPrice(body.price))                          errors.push("price");
  if (!Array.isArray(body.images) || body.images.length === 0) errors.push("images");
  return errors;
}
```

---

## Field Length Limits — Reference Table

Enforce these in every route that accepts the field. These are the source of truth — also documented in `01-schema.md` as Mongoose `maxlength` values.

| Field | Max length | Notes |
|---|---|---|
| `users.name` | 80 chars | |
| `users.tagline` | 120 chars | |
| `users.locationLabel` | 200 chars | |
| `listings.title` | 200 chars | |
| `listings.description` | 5000 chars | Sanitised HTML — strip dangerous tags |
| `listings.locationLabel` | 200 chars | |
| `listings.priceLabel` | 50 chars | Formatted display string e.g. "₹45,000" |
| `listings.priceSuffix` | 20 chars | e.g. "/ mo", "/ hr" — null for outright sale |
| `saved_alerts.name` | 100 chars | |
| `reviews.title` | 150 chars | |
| `reviews.body` | 1000 chars | |
| `messages.text` | 2000 chars | |
| `ad_reports.details` | 500 chars | Strip HTML — plain text only |
| `notifications.title` | 100 chars | |
| `notifications.body` | 300 chars | |

---

## Enum Validation

Always validate against the exact enum values defined in `01-schema.md`. Never accept freeform strings where an enum is expected.

```ts
// Example: listing status transition
const ALLOWED_SELLER_STATUSES = ["off-market", "closed"] as const;
if (!ALLOWED_SELLER_STATUSES.includes(body.status)) {
  return badRequest("validation_error", ["status"]);
}

// Example: countryCode
if (!isValidCountryCode(body.countryCode)) {
  return badRequest("invalid_country");
}
```

---

## Rich Text (Listing Descriptions)

Listing descriptions allow formatted text but must be sanitised. The `sanitizeRichText()` function above is a temporary stub — **install `sanitize-html` before going live**:

```bash
npm install sanitize-html
npm install --save-dev @types/sanitize-html
```

```ts
// lib/validation.ts — replace the stub:
import sanitizeHtml from "sanitize-html";

export function sanitizeRichText(value: unknown, maxLen = 5000): string | null {
  if (typeof value !== "string") return null;
  const clean = sanitizeHtml(value, {
    allowedTags: ["p", "strong", "em", "ul", "ol", "li", "br"],
    allowedAttributes: {},  // no attributes on any tag
    disallowedTagsMode: "discard",
  });
  return clean.trim().slice(0, maxLen) || null;
}
```

**Why no `<a>` tags?** Links in listing descriptions are a spam vector. Strip them entirely.  
**Why no `<img>` tags?** All images go through Cloudflare Images (`/api/upload`) — inline base64 or external image URLs are forbidden.

---

## Coordinate Validation

Listings require GeoJSON coordinates. Validate before storing:

```ts
export function isValidCoordinates(value: unknown): value is [number, number] {
  if (!Array.isArray(value) || value.length !== 2) return false;
  const [lng, lat] = value;
  // GeoJSON order: [longitude, latitude]
  return (
    typeof lng === "number" && isFinite(lng) && lng >= -180 && lng <= 180 &&
    typeof lat === "number" && isFinite(lat) && lat >= -90  && lat <= 90
  );
}
```

---

## What NOT to Validate Server-Side

These are **UX concerns** — handle them in the frontend, not in the API:

- Password strength rules (min 8 chars, special char, etc.) — the DB stores `passwordHash`, not the raw password. Frontend enforces password rules before hashing.
- Character limit warnings while typing
- Real-time field feedback
- Optional field completeness suggestions ("Your listing is 80% complete")

The API should only reject what would genuinely break the system — not enforce UX niceties.

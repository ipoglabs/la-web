# API Conventions — LokalAds

> Every `/api/` route in this codebase follows these rules without exception.  
> If something isn't covered here, come back and add it before building the route.  
> Last updated: 2026-07-07

---

## Folder Structure

All API routes live under `app/api/`. Next.js App Router uses the filesystem as the router — each `route.ts` file becomes one endpoint.

```
app/api/
├── auth/
│   ├── register/           route.ts   POST
│   ├── send-email-otp/     route.ts   POST
│   ├── verify-email-otp/   route.ts   POST
│   ├── magic-link/         route.ts   POST
│   ├── verify-magic/       route.ts   GET
│   ├── forgot-password/    route.ts   POST
│   ├── reset-password/     route.ts   POST
│   ├── logout/             route.ts   POST
│   └── callback/
│       ├── google/         route.ts   GET
│       └── apple/          route.ts   GET
├── upload/                 route.ts   POST  (Cloudflare Images)
├── listings/
│   ├── route.ts                       GET, POST
│   └── [id]/
│       ├── route.ts                   PUT
│       └── status/         route.ts   PATCH
├── users/
│   ├── me/
│   │   ├── route.ts                   GET, PUT, DELETE
│   │   └── export/         route.ts   GET
│   └── [id]/               route.ts   GET
├── conversations/
│   ├── route.ts                       GET, POST
│   └── [id]/
│       ├── route.ts                   GET
│       ├── messages/       route.ts   GET, POST
│       ├── read/           route.ts   POST
│       └── block/          route.ts   POST
├── favourites/
│   ├── route.ts                       GET, POST
│   └── [listingId]/        route.ts   DELETE
├── alerts/
│   ├── route.ts                       GET, POST
│   └── [id]/               route.ts   PATCH, DELETE
├── notifications/
│   ├── route.ts                       GET
│   ├── read/               route.ts   PATCH
│   └── unread-count/       route.ts   GET
├── follows/
│   └── [userId]/           route.ts   POST, DELETE
├── reviews/
│   ├── route.ts                       POST
│   └── [id]/
│       ├── route.ts                   DELETE
│       └── vote/           route.ts   POST
├── reports/                           ← already built
│   ├── route.ts                       GET, POST
│   └── [ticketId]/         route.ts   GET, PATCH
├── places/                            ← already built
│   └── route.ts                       GET
└── good-to-know/                      ← already built
    └── validate/           route.ts   POST
```

---

## HTTP Method Decisions

| Operation | Method | Why |
|---|---|---|
| Fetch a resource | `GET` | Idempotent, safe to cache |
| Create a new resource | `POST` | Non-idempotent, body carries data |
| Replace an entire resource | `PUT` | Full replacement — all fields sent |
| Partial update / status change | `PATCH` | Only changed fields sent |
| Remove a resource | `DELETE` | |

**Rules:**
- Never use `GET` with a request body
- Never use `POST` for idempotent reads
- Use `PATCH` for status transitions (listing status, notification read, etc.) — not `PUT`
- Auth routes always `POST` — even logout — to prevent CSRF on GET

---

## Naming Rules

### URL segments
- **Lowercase kebab-case** — `/api/saved-alerts`, `/api/unread-count`
- **Plural nouns** for collections — `/api/listings`, `/api/conversations`, `/api/reviews`
- **Singular noun for actions** that aren't a resource — `/api/auth/logout`, `/api/conversations/[id]/read`
- **Never verbs in the URL** for CRUD — use `DELETE /api/favourites/[id]` not `POST /api/remove-favourite`

### Parameter names
- Path params: **camelCase** — `[listingId]`, `[ticketId]`, `[userId]`
- Query params: **camelCase** — `?categoryId=`, `?countryCode=`, `?page=`
- Request body keys: **camelCase** throughout

---

## Every Route File — Standard Structure

Follow this order in every `route.ts`. Consistency matters — any developer should be able to read any route without surprise.

```ts
/**
 * app/api/[path]/route.ts
 *
 * METHOD /api/[path] — one-line description
 *
 * Request body: TypeName (see types/xxx.ts)
 *
 * Responses:
 *   200/201  { ... }              — success shape
 *   400      { error, fields? }  — validation error
 *   401      { error }           — not authenticated
 *   403      { error }           — authenticated but not authorised
 *   404      { error }           — resource not found
 *   409      { error }           — conflict (duplicate, already exists)
 *   429      { error }           — rate limit exceeded
 *   500      { error }           — unexpected server error
 */

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getSession } from "@/lib/session";

// 1. ── Constants / config ──────────────────────────────────────────
// 2. ── Type imports ────────────────────────────────────────────────
// 3. ── Sanitise / validate helpers (if not imported from lib/) ─────
// 4. ── HTTP handlers (one export per method: GET, POST, PATCH...) ──
```

**Rules:**
- One `route.ts` per URL path — never mix unrelated resources in one file
- Export only the methods the route supports — don't export empty `GET` stubs
- `await dbConnect()` goes inside the handler, after auth checks — don't connect before rejecting an unauthed request
- All handlers are wrapped in `try/catch` — uncaught errors return `500 { error: "server_error" }`

---

## Request Parsing

Always parse `req.json()` defensively — the body may be missing or malformed:

```ts
const body = await req.json().catch(() => null);
if (!body) {
  return NextResponse.json({ error: "invalid_json" }, { status: 400 });
}
```

Always parse and validate query params explicitly:

```ts
const countryCode = req.nextUrl.searchParams.get("countryCode");
if (!["in", "gb", "sg"].includes(countryCode ?? "")) {
  return NextResponse.json({ error: "invalid_country" }, { status: 400 });
}
```

---

## Response Headers

Add `Cache-Control` on public `GET` routes to improve performance:

```ts
// Public listing detail — safe to cache for 60 seconds
return NextResponse.json(data, {
  headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" }
});

// Authenticated data — never cache
return NextResponse.json(data, {
  headers: { "Cache-Control": "no-store" }
});
```

---

## What Lives in `app/api/` vs `lib/`

| Belongs in `app/api/route.ts` | Belongs in `lib/` |
|---|---|
| HTTP handler logic (parse, auth check, respond) | Reusable validation helpers |
| Route-specific validation | DB model definitions (`lib/models/`) |
| Calling DB models | Session utilities (`lib/session.ts`) |
| Calling `lib/email.ts` | Email sender (`lib/email.ts`) |
| Calling `lib/notifications.ts` | Notification creator (`lib/notifications.ts`) |

Keep route handlers thin. If a function would be useful in two routes, it belongs in `lib/`.

---

## External API Calls — Proxy Rule

**Never call an external API directly from a page or client component.**  
All external calls go through an `app/api/` proxy route. This protects API keys and allows server-side error handling.

Existing examples:
- `app/api/places/route.ts` — proxies Google Places API (key never reaches the browser)
- `app/api/upload/route.ts` (to build) — proxies Cloudflare Images signed URL request

```
Client → POST /api/upload → server fetches Cloudflare signed URL → returns { uploadUrl } → client uploads directly to Cloudflare
```

---

## Environment Variables Used by API Routes

| Variable | Used by | Required |
|---|---|---|
| `MONGODB_URI` | `lib/db.ts` — all DB routes | Yes |
| `JWT_SECRET` | `lib/session.ts` — all auth routes | Yes |
| `GOOGLE_PLACES_API_KEY` | `/api/places` | Yes for location search |
| `CLOUDFLARE_ACCOUNT_ID` | `/api/upload` | Yes for image upload |
| `CLOUDFLARE_IMAGES_API_TOKEN` | `/api/upload` | Yes for image upload |
| `RESEND_API_KEY` (or equiv.) | `lib/email.ts` | Yes for any auth email |
| `UPSTASH_REDIS_REST_URL` | `lib/rate-limit.ts` | Yes in production |
| `UPSTASH_REDIS_REST_TOKEN` | `lib/rate-limit.ts` | Yes in production |

None of these are ever sent to the browser. All are read only in `app/api/` or `lib/`.

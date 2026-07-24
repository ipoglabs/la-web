---
applyTo: "app/api/**"
---

# API Route Rules — poc-next

All backend logic in this project lives in `app/api/` route handlers.
These rules are non-negotiable and apply to every route, every time.

---

## Rule 1 — Never Call External APIs from Pages or Components

Pages and components must **never** call external services directly.

```ts
// ❌ WRONG — external API call in a component
const res = await fetch("https://api.ipinfo.io/...");

// ✅ CORRECT — component calls internal proxy route
const res = await fetch("/api/places?q=singapore");
```

**Every external or third-party API call goes through an `app/api/` route handler.**
The route handler owns: auth headers, error handling, rate limiting, data sanitisation.

---

## Rule 2 — Response Shape Convention

All routes return `Response.json()` with consistent shapes:

```ts
// Success
return Response.json({ data: result }, { status: 200 });
return Response.json({ ticketId }, { status: 201 }); // created

// Client error
return Response.json({ error: "Validation failed", fields: ["email"] }, { status: 400 });
return Response.json({ error: "Not found" }, { status: 404 });
return Response.json({ error: "Already exists" }, { status: 409 });
return Response.json({ error: "Rate limit exceeded" }, { status: 429 });

// Server error — never expose internals
return Response.json({ error: "Something went wrong" }, { status: 500 });
```

**Never expose internal error messages, stack traces, or DB details to the client.**
Log them server-side, return a generic message to the caller.

---

## Rule 3 — Always Sanitise Input at the Boundary

Validate and sanitise **all** incoming request data before touching the DB or any service.

```ts
// ✅ Sanitise strings
function sanitizeText(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  return value
    .replace(/<[^>]*>/g, "")           // strip HTML tags
    .replace(/[\u0000-\u0008\u000E-\u001F\u007F]/g, "") // strip control chars
    .trim()
    .slice(0, maxLen);
}

// ✅ Validate against known-good sets
const VALID_STATUSES = new Set(["pending", "resolved", "dismissed"]);
if (!VALID_STATUSES.has(body.status)) return Response.json({ error: "Invalid status" }, { status: 400 });
```

Use `NextRequest` (not `Request`) when you need access to headers, cookies, or IP.

---

## Rule 4 — Dev-Only Routes Must Be Guarded

Any route that must not exist in production:

```ts
export function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }
  // ... dev-only logic
}
```

Examples: `/api/email-preview`, any seed/reset endpoint.

---

## Rule 5 — Rate Limiting

For any write route (POST, PATCH, DELETE) that is publicly accessible:

```ts
// Simple in-memory rate limiter (dev/staging only)
// For production: use Upstash Redis + @upstash/ratelimit
const IP_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const IP_MAX_CALLS = 10;
const ipLog = new Map<string, { count: number; windowStart: number }>();

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipLog.get(ip);
  if (!entry || now - entry.windowStart > IP_WINDOW_MS) {
    ipLog.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > IP_MAX_CALLS;
}
```

Always add a `TODO [INTEGRATION]` comment to replace in-memory limiter before production.

---

## Rule 6 — DB Connection via Singleton

Always use the Mongoose singleton, never instantiate a new connection:

```ts
import dbConnect from "@/lib/db";

export async function POST(request: NextRequest) {
  await dbConnect();
  // ... DB operations
}
```

---

## Rule 7 — Sending Emails From Routes

Use the email engine's single public function. Never import templates or renderer directly.

```ts
import { sendEmail } from "@/lib/email";

const result = await sendEmail({
  type: "REPORT_TICKET_CREATED",
  to: userEmail,
  data: { ticketId, reason, listingTitle },
});

if (!result.success) {
  // Log it — but don't fail the whole request just because email failed
  console.error("[email]", result.error);
}
```

---

## Rule 8 — Route File Header Comment

Every route file must have a JSDoc-style header:

```ts
/**
 * app/api/[resource]/route.ts
 *
 * POST /api/[resource] — brief description
 *
 * Responses:
 *   201 { ... }   — success
 *   400 { error } — validation error
 *   500 { error } — server error
 *
 * TODO [INTEGRATION]: auth, rate limit, or other production items
 */
```

---

## Existing API Routes (reference)

| Route | Methods | Purpose |
|---|---|---|
| `/api/reports` | POST · GET · PATCH | Ad report tickets (Mongoose) |
| `/api/good-to-know` | GET | Static advisory content |
| `/api/places` | GET | Location search proxy |
| `/api/email-preview` | GET | Dev-only email template preview |

# Rate Limiting — LokalAds API

> Rate limiting protects the API from abuse, brute force, and accidental hammering.  
> The current codebase has an in-memory limiter in `/api/reports`. This doc defines the production approach.  
> Last updated: 2026-07-07

---

## Current State vs Target

| | Current (dev) | Target (production) |
|---|---|---|
| Implementation | In-memory `Map` in `app/api/reports/route.ts` | Upstash Redis via `lib/rate-limit.ts` |
| Scope | Single server instance only | Works across all Vercel serverless instances |
| Persistence | Resets on every cold start | Persists across deployments |
| Configured in | Inline per-route | Centralised in `lib/rate-limit.ts` |

**The in-memory limiter works fine locally and in staging. It must be replaced with Upstash Redis before production traffic hits.**

---

## ⚠️ `/api/places` — Google Billing Risk

`/api/places` is marked "None (TODO: add)" in the route inventory. This is not just a TODO — it is a **production billing risk**. Google Places charges per API call. An unprotected endpoint can be abused to run up real costs.

**Add `placesLimiter` to `lib/rate-limit.ts` and wire it before going live:**
```ts
// lib/rate-limit.ts
export const placesLimiter = createLimiter(60, "1 m");  // 60 autocomplete calls per minute per IP
```

This must be done as part of the `/api/places` go-live checklist, not as a future improvement.

---

## Upstash Redis Setup

Upstash is a serverless Redis that works with Vercel edge and serverless functions — no connection pooling needed.

```bash
npm install @upstash/ratelimit @upstash/redis
```

Environment variables (add to `.env.local` and Vercel dashboard):
```
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...
```

---

## `lib/rate-limit.ts` — Central Configuration

Create this file. All routes import from here.

```ts
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Create a rate limiter with a sliding window.
 * Usage: const limiter = createLimiter(10, "1 h")
 */
function createLimiter(requests: number, window: `${number} ${"s" | "m" | "h" | "d"}`) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
  });
}

// ── Limiters — one per category of route ───────────────────────────────────

/** Auth routes: register, send-otp, magic-link, forgot-password */
export const authLimiter = createLimiter(5, "15 m");

/** OTP verify: stricter — prevents brute force on 6-digit codes */
export const otpLimiter = createLimiter(3, "15 m");

/** Write routes: post listing, send message, create review */
export const writeLimiter = createLimiter(30, "1 h");

/** Report submission */
export const reportLimiter = createLimiter(10, "1 h");

/** Upload: Cloudflare Images signed URL requests */
export const uploadLimiter = createLimiter(20, "1 h");

/** Public search / read: generous limit */
export const readLimiter = createLimiter(200, "1 m");

// ── Helper: extract identifier for rate limiting ───────────────────────────

/**
 * Returns the rate limit key for a request.
 * Authenticated routes: use userId (per-user limit)
 * Unauthenticated routes: use IP address
 */
export function getRateLimitKey(req: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  const ip = (req as any).headers.get?.("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  return `ip:${ip}`;
}
```

---

## Usage Pattern in a Route

```ts
// In any route handler:
import { authLimiter, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit check — BEFORE auth check and DB connect
  const key = getRateLimitKey(req); // IP-based for unauthenticated route
  const { success } = await authLimiter.limit(key);
  if (!success) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  // ... rest of handler
}
```

For authenticated routes, use the userId as the key (per-user limit, not per-IP):

```ts
const session = await getSession();
if (!session) return unauthorized();

const key = getRateLimitKey(req, session.id); // per-user
const { success } = await writeLimiter.limit(key);
if (!success) return rateLimited();
```

---

## Rate Limits Per Route

| Route | Limiter | Key | Window | Max |
|---|---|---|---|---|
| `POST /api/auth/register` | `authLimiter` | IP | 15 min | 5 |
| `POST /api/auth/send-email-otp` | `authLimiter` | IP | 15 min | 5 |
| `POST /api/auth/verify-email-otp` | `otpLimiter` | IP + email | 15 min | 3 |
| `POST /api/auth/magic-link` | `authLimiter` | IP | 15 min | 5 |
| `POST /api/auth/forgot-password` | `authLimiter` | IP | 15 min | 5 |
| `POST /api/auth/reset-password` | `otpLimiter` | IP + email | 15 min | 3 |
| `POST /api/listings` | `writeLimiter` | userId | 1 hr | 30 |
| `PUT /api/listings/[id]` | `writeLimiter` | userId | 1 hr | 30 |
| `POST /api/conversations/[id]/messages` | `writeLimiter` | userId | 1 hr | 30 |
| `POST /api/reviews` | `writeLimiter` | userId | 1 hr | 30 |
| `POST /api/reports` | `reportLimiter` | IP | 1 hr | 10 |
| `POST /api/upload` | `uploadLimiter` | userId | 1 hr | 20 |
| `GET /api/listings` | `readLimiter` | IP | 1 min | 200 |
| `GET /api/users/me/export` | custom | userId | 24 hr | 1 |

### Special case — data export endpoint

The export endpoint has a once-per-24h limit per user. Use a separate limiter:

```ts
export const exportLimiter = createLimiter(1, "24 h");
```

---

## What to Include in the `429` Response

Return `429` with a `Retry-After` header so the client can back off correctly:

```ts
const { success, reset } = await limiter.limit(key);
if (!success) {
  const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
  return new NextResponse(
    JSON.stringify({ error: "rate_limit" }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}
```

---

## OTP Brute Force — Double Lock

The `otpLimiter` (3 attempts / 15 min via Redis) is the outer lock.  
`otp_tokens.attempts` (max 3, stored in MongoDB) is the inner lock.

Both must trigger independently — the MongoDB lock catches cases where the Redis limit was reset (e.g. Redis cold start, TTL edge case).

```
Request hits verify-email-otp:
  1. Redis rate limit check  → 429 if exceeded (outer)
  2. DB: find token where used=false, expiresAt > now
  3. If wrong code: $inc attempts
  4. If attempts >= 3: return 400 ATTEMPTS_EXCEEDED (inner)
  5. If right code: mark used=true, activate user
```

---

## Local Development — Graceful Fallback

When `UPSTASH_REDIS_REST_URL` is not set (local dev), fall back to the in-memory limiter so development doesn't require a Redis instance:

```ts
// lib/rate-limit.ts — add at top
const IS_REDIS_CONFIGURED =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// In each route using a limiter:
if (IS_REDIS_CONFIGURED) {
  const { success } = await authLimiter.limit(key);
  if (!success) return rateLimited();
}
// If not configured: skip rate limiting in local dev only
```

Log a warning at startup if Redis is not configured, so it's obvious in staging:

```ts
if (!IS_REDIS_CONFIGURED) {
  console.warn("⚠️  Rate limiting is DISABLED — UPSTASH_REDIS_REST_URL not set");
}
```

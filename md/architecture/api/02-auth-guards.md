# Auth Guards — LokalAds API

> Every route that writes data or returns private information must verify identity first.  
> This file defines the exact patterns — copy these, do not invent variations.  
> Last updated: 2026-07-07

---

## The Session Contract

`lib/session.ts` is the single source of truth for session reads. It exposes one function:

```ts
// lib/session.ts
export async function getSession(): Promise<AuthUser | null>
```

`AuthUser` shape (from `types/auth.ts` — extend this as auth is implemented):

```ts
interface AuthUser {
  id: string            // MongoDB users._id as string
  name: string
  email: string
  role: "user" | "admin"
  sessionVersion: number  // must match users.sessionVersion in DB — invalidates stale JWTs
}
```

`getSession()` returns `null` when:
- No session cookie is present
- The JWT is expired or has an invalid signature
- The `sessionVersion` in the token does not match `users.sessionVersion` in the DB (password was reset)

**Rule:** Never trust `req.headers` or client-supplied user IDs. Always get identity from `getSession()`.

---

## Route Access Levels

Every route falls into one of four levels:

| Level | Description | Examples |
|---|---|---|
| **Public** | No auth required — anyone can call | `GET /api/listings`, `GET /api/users/[id]`, `POST /api/reports` |
| **Authenticated** | Must be logged in | `POST /api/favourites`, `GET /api/conversations`, `POST /api/listings` |
| **Owner-only** | Must be logged in AND own the resource | `PUT /api/listings/[id]`, `DELETE /api/users/me` |
| **Admin-only** | Must have `role: "admin"` | `PATCH /api/reports/[ticketId]`, `DELETE /api/reviews/[id]` |

---

## Guard Patterns — Copy These Exactly

### Level 2 — Authenticated

```ts
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await dbConnect();
  // ... handler logic using session.id
}
```

### Level 3 — Owner-only

```ts
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Validate ObjectId format BEFORE querying — Mongoose throws CastError on invalid ObjectId
  // which hits the catch block as a 500. Catch it early instead.
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await dbConnect();

  const resource = await Listing.findById(id).lean();
  if (!resource) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Ownership check — compare DB field to session, not to client-supplied value
  if (resource.sellerId.toString() !== session.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // ... update logic
}
```

### Level 4 — Admin-only

```ts
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await dbConnect();
  // ... admin logic
}
```

---

## Order of Checks — Never Skip Steps

Every handler must run checks in this exact order. Stop and return immediately on any failure — do not proceed to the next check.

**Unauthenticated routes (public, IP-keyed rate limit):**
```
1. Rate limit check (IP-based)            → 429 if exceeded  ← first — protect before any work
2. Parse request body (if POST/PUT/PATCH) → 400 if invalid JSON
3. Input validation                       → 400 if invalid
4. Connect to DB (dbConnect)
5. Business logic + DB write
```

**Authenticated routes (userId-keyed rate limit):**
```
1. Parse request body (if POST/PUT/PATCH) → 400 if invalid JSON
2. Auth check (getSession)                → 401 if not authenticated
3. Role check (admin routes only)         → 403 if wrong role
4. Rate limit check (userId-based)        → 429 if exceeded  ← after auth so we have the userId
5. Connect to DB (dbConnect)              ← only after auth + rate limit pass
6. Validate path params (ObjectId format) → 400 if malformed
7. Fetch the resource                     → 404 if not found
8. Ownership check (owner-only routes)    → 403 if not owner
9. Input validation (body fields)         → 400 if invalid
10. Business logic + DB write
```

**Why rate limit before auth on public routes?** Auth routes (register, OTP, magic link) are targets for bots. Rate limit before touching the DB at all.
**Why rate limit after auth on authenticated routes?** We need `session.id` to key the limiter per-user, not per-IP (which changes on mobile networks).
**Why connect to DB after auth?** Reject unauthed requests before incurring the MongoDB connection cost.

---

## Session Cookie Spec

Implemented in `lib/session.ts`. The cookie must be:

```ts
// Set on login / verify OTP / verify magic link
cookies().set("session", jwtToken, {
  httpOnly: true,       // never accessible from JavaScript — XSS safe
  secure: true,         // HTTPS only in production
  sameSite: "lax",      // CSRF protection — allows top-level navigations
  maxAge: 60 * 60 * 24 * 30,  // 30 days
  path: "/",
});

// Delete on logout
cookies().delete("session");
```

**JWT payload shape:**
```ts
{
  sub: string,            // users._id as string
  name: string,
  email: string,
  role: "user" | "admin",
  sessionVersion: number, // snapshot from users.sessionVersion at login time
  iat: number,            // issued at (set automatically by jwt.sign)
  exp: number,            // expiry = iat + 30 days
}
```

**Validation in `getSession()`:**
```ts
// After verifying JWT signature and expiry, ALSO check sessionVersion:
const user = await User.findById(payload.sub).select("sessionVersion role").lean();
if (!user || user.sessionVersion !== payload.sessionVersion) {
  return null; // token invalidated by password reset
}
```

---

## Public Routes That Accept Optional Auth

Some public routes behave differently when a user is authenticated. Use the optional pattern:

```ts
// GET /api/listings/[slug] — public, but include isFavourited if logged in
export async function GET(req: NextRequest, { params }: ...) {
  const session = await getSession(); // null is fine — no early return

  const listing = await Listing.findOne({ slug, status: { $ne: "deleted" } }).lean();
  if (!listing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  let isFavourited = false;
  if (session) {
    isFavourited = !!(await Favourite.exists({ userId: session.id, listingId: listing._id }));
  }

  return NextResponse.json({ ...listing, isFavourited });
}
```

---

Where `isValidObjectId` comes from:

```ts
import mongoose from "mongoose";
// Use this in every route with a path param before calling findById / findOne
const isValidObjectId = (id: string) => mongoose.isValidObjectId(id);
```

Always return `404` (not `400`) for an invalid ObjectId — do not reveal to the client whether the ID format or the resource is the problem.

---

## What `401` vs `403` Means — Be Precise

| Status | Meaning | When to use |
|---|---|---|
| `401 Unauthorized` | Identity unknown — not logged in | `getSession()` returns null |
| `403 Forbidden` | Identity known — but not allowed | Wrong role, or not the resource owner |

Never return `404` to hide the existence of a resource when the real reason is `403`. That is only acceptable for highly sensitive resources (e.g. admin user list). For regular content, return `403` so the client can redirect to login vs show "not allowed".

---

## CSRF Protection

`sameSite: "lax"` on the session cookie prevents cross-site POST requests from being authenticated. This is sufficient for most cases.

Additional protection for state-changing routes: verify the `Origin` header matches the app's own domain on sensitive mutations (password reset, account delete):

```ts
const origin = req.headers.get("origin");
const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL; // e.g. "https://lokalads.com"
if (origin && origin !== allowedOrigin) {
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}
```

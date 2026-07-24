---
name: la-auth
description: "Use when building any authenticated feature in LokalAds poc-next: protecting API routes, reading session in Server Components, redirecting unauthenticated users, implementing auth guards, or wiring up the session library. Covers all 4 access levels, exact guard patterns, check ordering, and the session stub contract."
argument-hint: "What you are building (e.g. 'Protect an API route', 'Redirect unauthenticated user from page', 'Add admin guard', 'Wire up session')"
---

# LokalAds — Authentication Guide

> For: Any developer building features that touch user identity or access control.
> Architecture diagrams: `md/architecture/auth/` (5 flows)
> API guard patterns: `md/architecture/api/02-auth-guards.md`
> Session stub: `src/lib/session.ts`
> Auth types: `src/types/auth.ts`

---

## Current Status — Read This First

`src/lib/session.ts` is a **stub**. Real auth (NextAuth/Lucia/better-auth) is not yet wired up.

**It currently returns a hardcoded mock `AuthUser`, not `null`** — this is deliberate POC mode so the full app shell (AppHeader avatar, dashboard pages) can be reviewed without real auth:

```typescript
// src/lib/session.ts — current state (POC MOCK)
export async function getSession(): Promise<AuthUser | null> {
  // TODO [AUTH — BEFORE PRODUCTION]: Delete this mock and wire up a real provider.
  return {
    id:       "mock-user-001",
    name:     "Gopinath Krishnamoorthi",
    initials: "GK",
    role:     "member",
    status:   "online",
  } satisfies AuthUser;
}
```

**What this means:**
- Every `getSession()` call across the app currently resolves to this same logged-in "member" user — there is no logged-out state and no way to test a real admin/owner/anonymous path today
- All auth guards already written will **pass** (not reject) as long as the mock user's role/ownership happens to satisfy the check — do not read passing guards during manual testing as proof they are correct
- You CAN write guard patterns now using `getSession()` — they use the real contract (`AuthUser | null`) and will behave correctly the moment the mock is removed
- Do NOT bypass `getSession()` with hardcoded user IDs or additional mocking in feature code — this stub is the only mock point

**When auth is ready:** Delete the mock block in `src/lib/session.ts` and wire up the real provider (see the TODO comment in that file for NextAuth/Lucia/better-auth snippets). Every consumer updates automatically. Until then, treat every "authenticated/owner/admin" guard in this codebase as **untested against the null/logged-out and wrong-role cases**.

---

## The One Contract — `getSession()`

This is the **only** way to read the authenticated user. Never read cookies, headers, or JWT directly.

```typescript
import { getSession } from "@/lib/session";
import type { AuthUser } from "@/types/auth";

// Returns AuthUser if logged in, null if not
const session: AuthUser | null = await getSession();
```

### `AuthUser` type (`src/types/auth.ts`)
```typescript
export interface AuthUser {
  id:        string            // MongoDB users._id as string
  name:      string
  initials:  string
  avatarUrl?: string
  role:      "member" | "admin"
  status:    "online" | "busy" | "offline" | "none"
}
```

**`getSession()` returns `null` when:**
- No session cookie present
- JWT is expired or has invalid signature
- `sessionVersion` in token does not match `users.sessionVersion` in DB (password was reset — token revoked)

---

## 4 Access Levels — Know Which You Need

| Level | Who can access | Examples |
|---|---|---|
| **Public** | Anyone | `GET /api/listings`, `POST /api/reports`, `GET /api/good-to-know` |
| **Authenticated** | Logged-in users | `POST /api/favourites`, `GET /api/conversations`, `POST /api/listings` |
| **Owner-only** | Logged in AND owns the resource | `PUT /api/listings/[id]`, `DELETE /api/users/me` |
| **Admin-only** | Has `role: "admin"` | `PATCH /api/reports/[ticketId]`, `DELETE /api/reviews/[id]` |

---

## Guard Patterns — Copy These Exactly

### Level 1 — Public (no guard needed)
```typescript
export async function GET(request: NextRequest) {
  // No session check — public route
  await dbConnect();
  const listings = await Listing.find({ status: "active" }).select("title slug").lean();
  return NextResponse.json({ listings });
}
```

### Level 2 — Authenticated
```typescript
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await dbConnect();
  // Use session.id as the authenticated user identifier — never trust client-supplied userId
  const userId = session.id;
  // ... handler logic
}
```

### Level 3 — Owner-only
```typescript
import { isValidObjectId } from "mongoose";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Validate ObjectId BEFORE DB query — Mongoose throws CastError on invalid format
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await dbConnect();

  const resource = await Listing.findById(id).select("sellerId").lean();
  if (!resource) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Ownership: compare DB field to session — never trust client-supplied owner id
  if (resource.sellerId.toString() !== session.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // ... update logic
}
```

### Level 4 — Admin-only
```typescript
export async function PATCH(request: NextRequest) {
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

## Order of Checks — Never Reorder

### Public routes (IP-keyed rate limit)
```
1. Rate limit (IP-based)          → 429 if exceeded  ← protect before any work
2. Parse request body             → 400 if invalid JSON
3. Input validation               → 400 if invalid
4. dbConnect()
5. Business logic + DB write
```

### Authenticated routes (userId-keyed rate limit)
```
1.  Parse request body            → 400 if invalid JSON
2.  getSession()                  → 401 if null
3.  Role check (admin only)       → 403 if wrong role
4.  Rate limit (userId-based)     → 429 if exceeded   ← after auth so we have session.id
5.  dbConnect()                   ← only AFTER auth + rate limit
6.  Validate path params (ObjectId) → 404 if malformed
7.  Fetch resource                → 404 if not found
8.  Ownership check               → 403 if not owner
9.  Input validation (body)       → 400 if invalid
10. Business logic + DB write
```

**Why this order matters:**
- Rate limit before auth on public routes → bots are blocked before hitting DB
- Rate limit after auth on authenticated routes → we need `session.id` to key per-user
- `dbConnect()` after auth → reject unauthed requests without paying the MongoDB cost

---

## Server Component — Protecting a Page

Use this pattern to redirect unauthenticated users from any dashboard page:

```typescript
// src/app/(dashboard)/profile/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/profile");
  }

  // session is guaranteed non-null below this line
  return (
    <main>
      <h1>Hello, {session.name}</h1>
    </main>
  );
}
```

**Rules:**
- `redirect()` from `next/navigation` — not `Response.redirect()`
- Always include `?redirect=CURRENT_PATH` so the login page can send the user back
- Call `getSession()` in the Server Component body — not in a client component
- Never put the redirect in `layout.tsx` — use it per-page or in a shared Server Component utility

---

## Root Layout — Passing Session to AppHeader

The root layout passes the session to `AppHeader` for avatar / login state:

```typescript
// src/app/layout.tsx
import { getSession } from "@/lib/session";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();  // null when not logged in

  return (
    <html>
      <body>
        <AppHeader user={session} />
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
```

---

## Session Cookie Spec (for when auth is wired up)

```typescript
// On successful login / OTP verify / magic link verify
cookies().set("session", jwtToken, {
  httpOnly: true,         // JS cannot access — XSS protection
  secure:   true,         // HTTPS only in production
  sameSite: "lax",        // CSRF protection — allows top-level navigation
  maxAge:   60 * 60 * 24 * 30,  // 30 days
  path:     "/",
});

// On logout
cookies().delete("session");
```

JWT payload shape:
```typescript
{
  sub:            string,  // users._id as string
  name:           string,
  email:          string,
  role:           "member" | "admin",
  sessionVersion: number,  // snapshot from users.sessionVersion at login time
  iat:            number,
  exp:            number,  // iat + 30 days
}
```

### `sessionVersion` Invalidation
When a user resets their password, `users.sessionVersion` is incremented in MongoDB.
`getSession()` must compare the JWT `sessionVersion` with the live DB value:

```typescript
const user = await User.findById(payload.sub).select("sessionVersion role").lean();
if (!user || user.sessionVersion !== payload.sessionVersion) {
  return null;  // token revoked — all existing sessions invalidated
}
```

This is what makes forced logout work after a password reset or account compromise.

---

## Auth Routes Inventory (Target — Not Yet Built)

None of the routes below exist in `src/app/api/` today — this is the planned surface for when real auth is wired up, not a current inventory.

| Route | Method | Purpose |
|---|---|---|
| `/register` | GET | Choose auth method |
| `/register/create` | GET | Fill account details (email path) |
| `/register/verify` | GET | OTP entry (email path) |
| `/register/complete` | GET | DOB + terms after OAuth |
| `/register/success` | GET | Account created confirmation |
| `/login` | GET | Login entry point |
| `/api/auth/register` | POST | Create pending user |
| `/api/auth/send-email-otp` | POST | Send OTP to email |
| `/api/auth/verify-email-otp` | POST | Verify OTP + activate account |
| `/api/auth/magic-link` | POST | Send magic link email |
| `/api/auth/verify-magic` | GET | Validate magic link token |
| `/api/auth/callback/google` | GET | Google OAuth callback |
| `/api/auth/callback/apple` | GET | Apple OAuth callback |
| `/api/auth/complete-profile` | POST | Save DOB + terms after OAuth |
| `/api/auth/session` | GET | Get current user session |
| `/api/auth/logout` | POST | Clear session cookie |

All `/api/auth/*` routes must be rate-limited at **max 5 attempts / 15 min per IP**.

---

## Security Rules — Non-Negotiable

```
✗  Never read user identity from req.body, req.query, or client headers
✓  Always use getSession() — it is the single source of truth

✗  Never skip the ownership check on owner-only routes
✓  Always compare resource.ownerId.toString() === session.id

✗  Never expose sessionVersion in API responses
✓  Strip it with .select("-sessionVersion -passwordHash")

✗  Passwords: never store plain — bcrypt with cost factor 12
✓  OTP/magic link tokens: store only SHA-256 hash in DB, send raw value only via email

✗  Age gate (DOB): never trust client-side validation only
✓  Always validate server-side in the API route
```

---

## How This Skill Evolves — Self-Update Protocol

> **This file is a living document. Copilot updates it automatically — no instruction from the owner needed.**

### Triggers — update this file when any of these happen
- A new auth pattern is established during a coding session
- An existing rule is found to be wrong, incomplete, or superseded
- A security bug is fixed that reveals a better practice
- The session library (`src/lib/session.ts`) is wired up or changed
- A new auth flow (OAuth provider, passkey, etc.) is added to the codebase
- A guard pattern is used in practice and a better version is discovered
- The owner confirms a decision that wasn't previously documented
- A gap is discovered mid-build that should have been in this file

### How to update
1. Edit the relevant section directly — keep it concise
2. Replace outdated patterns — never leave contradictions
3. Add a `> Updated: YYYY-MM-DD — [what changed and why]` note at the top of the changed section
4. If a new section is needed, add it before this one

### What NOT to add
- Unconfirmed decisions — mark as `[PROPOSED]` if uncertain, confirm before merging into rules
- One-off patterns that don't generalise — if it happened once, it's not a convention yet
- Anything the owner has explicitly said NOT to do

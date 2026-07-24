# Route Inventory — LokalAds API

> Complete list of every `/api/` route that **actually exists in code today**, its method, auth level, rate limiter, and status.
> Update this file every time a route is added, removed, or its auth/rate-limit status changes.
> Last updated: 2026-07-12
> For the full list of routes that **don't exist yet** (across every domain — categories, listings, alerts, auth, chat, favourites, profile...), see [07-real-api-gap-inventory.md](07-real-api-gap-inventory.md).

---

## Status Key

| Symbol | Meaning |
|---|---|
| ✅ Built | Route exists and works end-to-end for POC purposes |
| ⚠️ Built, POC-scoped limitation | Route exists but has a known POC-only gap (e.g. in-memory rate limiter, mock session) |

---

## Real Routes — `src/app/api/`

| Route | Method | Auth level | Rate limiter | Status |
|---|---|---|---|---|
| `/api/reports` | POST | Public (optional session — `reporterId` set if logged in) | Own in-memory IP limiter (`isIpRateLimited`, local to the route file) | ⚠️ POC-scoped limiter |
| `/api/reports/[ticketId]` | GET | Public for guest reports; if `reporterId` is set, requester's session must match it | — | ✅ |
| `/api/reports/[ticketId]` | PATCH | Admin-only (`getSession()` + `role === "admin"`) | — | ✅ |
| `/api/good-to-know/validate` | POST | Public | `checkRateLimit` from `lib/rate-limit.ts` — 20 req / 60s per IP | ⚠️ POC-scoped limiter |
| `/api/places` | GET | Public (proxies Google Places — paid API) | `checkRateLimit` — 15 req / 60s per IP (tighter, billing risk) | ⚠️ POC-scoped limiter |
| `/api/profile/check-handle` | GET | Public | `checkRateLimit` — 20 req / 60s per IP | ⚠️ POC-scoped limiter |
| `/api/listings/[category]` | GET | Public | — | ✅ |
| `/api/email-preview` | GET | Public (dev-only rendering aid for email templates) | — | ✅ |
| `/api/jobs/trigger` | POST | Shared secret (`x-cron-secret` header matches `CRON_SECRET` env var) — not a user session | — | ✅ — **must be disabled or VPN-gated before production** |

`lib/rate-limit.ts` is an **in-memory, single-instance, Map-based sliding-window limiter** — fine for a POC/single-server demo, but resets on redeploy and does not work across multiple server instances. Swap for a distributed limiter (e.g. Upstash Redis + `@upstash/ratelimit`) before scaling past one instance.

---

## Auth System Status

There is **no `/api/auth/*` route surface today** — `src/lib/session.ts` `getSession()` is a stub that returns a hardcoded mock `AuthUser` (see `.github/skills/la-auth/SKILL.md`). No login, registration, OTP, or OAuth callback routes exist yet, even though `/register/*` and `/login` **pages** exist as UI stubs.

When real auth is implemented, the following routes are the anticipated target surface (**not yet built — planning reference only**):

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/register` | POST | Create pending user |
| `/api/auth/send-email-otp` | POST | Send OTP to email |
| `/api/auth/verify-email-otp` | POST | Verify OTP + activate account |
| `/api/auth/magic-link` | POST | Send magic link email |
| `/api/auth/verify-magic` | GET | Validate magic link token |
| `/api/auth/callback/google` | GET | Google OAuth callback |
| `/api/auth/callback/apple` | GET | Apple OAuth callback |
| `/api/auth/complete-profile` | POST | Save DOB + terms after OAuth |
| `/api/auth/logout` | POST | Clear session cookie |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Complete password reset |

---

## Other Planned Routes — Not Yet Built

Listings CRUD beyond the read-only category route, favourites, conversations/chat, alerts, notifications, follows, reviews, user profile CRUD, uploads, and a health check endpoint do not exist in code. These are tracked as product-surface gaps in the architecture/gap docs and feature spec docs (`md/feature-spec-doc/`) rather than duplicated here as a route table — treat any route shape/method described elsewhere for these as a proposal, not a build commitment, until the feature is actually queued.

See [07-real-api-gap-inventory.md](07-real-api-gap-inventory.md) for the complete, domain-grouped inventory of these gaps with "used by" screens and current status.

---

## Summary

| Category | Routes today | Notes |
|---|---|---|
| Reports | 3 (POST, GET/PATCH by ticketId) | Admin guard + session ownership check live |
| Utility/proxy | 4 (`good-to-know/validate`, `places`, `profile/check-handle`, `listings/[category]`) | Rate-limited via `lib/rate-limit.ts` (POC in-memory limiter) |
| Dev tooling | 2 (`email-preview`, `jobs/trigger`) | Not user-facing; `jobs/trigger` needs a pre-prod lockdown |
| Auth | 0 | Entirely unbuilt — session is mocked, see `la-auth` skill |
| **Total real routes** | **9 route files** | |

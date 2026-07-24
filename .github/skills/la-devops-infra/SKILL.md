---
name: la-devops-infra
description: "Use when setting up, deploying, or maintaining LokalAds poc-next infrastructure: environment variables, MongoDB Atlas, Vercel/Cloudflare deployment, cron jobs, email engine (Resend), country detection, and production security. The essential guide for any DevOps or infra work."
argument-hint: "What you are setting up or the problem you are solving (e.g. 'Deploy to Vercel', 'Set up MongoDB', 'Email not sending', 'Country detection not working')"
---

# LokalAds — DevOps / Infra Guide

> For: Anyone setting up or maintaining the production infrastructure.
> Also used by Copilot when working on deployment, env config, or jobs.

---

## Environment Variables — Master Reference

All env vars live in `.env.local` (local dev) or the hosting platform's env config (production).
`.env.local` is gitignored — **never commit it.**

### Complete Variable List

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `MONGODB_URI` | For DB features | — | MongoDB Atlas connection string |
| `RESEND_API_KEY` | For email | — | Resend API key for transactional email |
| `EMAIL_FROM` | With Resend | `no-reply@lokalads.com` | Sender address (must be verified domain) |
| `NEXT_PUBLIC_APP_URL` | For email links | `http://localhost:3000` | Base URL for links inside emails |
| `CRON_SECRET` | For job trigger | — | Secures `POST /api/jobs/trigger` |
| `COUNTRY_HEADER` | Optional | `cf-ipcountry` | CDN header name for country code |
| `BASIC_AUTH_USER` | For internal routes | `dev` | Protects `/design-system` + `/snippets` |
| `BASIC_AUTH_PASS` | For internal routes | `dev123` | Protects `/design-system` + `/snippets` |
| `MOCK_COUNTRY` | Dev only | — | Override country detection for local testing |

### Important Notes
- `COUNTRY_HEADER` — if set to empty string `""`, middleware falls back to `"cf-ipcountry"`. Use `||` not `??` (empty string is falsy).
- `MONGODB_URI` — the app and all mock data work without this. Only jobs + report API + any DB-backed routes need it.
- `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` — defaults are `dev` / `dev123`. **Change both in production.**
- `CRON_SECRET` — generate with: `openssl rand -hex 32`

---

## MongoDB Atlas Setup

### Connection
```
Format: mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/lokalads?retryWrites=true&w=majority
```

### Collections (created automatically by Mongoose on first write)
| Collection | Model file | Purpose |
|---|---|---|
| `reports` | `src/lib/models/report.ts` | Ad reports from users |
| `alerts` | `src/lib/models/alert.ts` | Email alert subscriptions |
| `goodtoknow` | `src/lib/models/good-to-know.ts` | Good-to-know submissions |

### Connection Pattern
`src/lib/db.ts` is a singleton with globalThis caching to survive Next.js hot-reloads.
`dbConnect()` must be called at the top of every API route handler that touches the DB.
The MONGODB_URI guard is **inside** the function — not at module level — so production build succeeds without a DB.

### Local Dev Without DB
The entire app, all product pages, and all mock data work with no DB connection.
Jobs will log a startup warning — this is expected and safe.

---

## Deployment — Vercel (Recommended)

### Steps
1. Connect the GitHub repo to Vercel
2. Set all env vars in Vercel dashboard → Settings → Environment Variables
3. Vercel auto-detects Next.js — no build config needed
4. Set `NEXT_PUBLIC_APP_URL` to your production domain

### Key Settings
- **Node version:** 22.x (matches local `node-v22.13.1`)
- **Build command:** `next build` (default)
- **Output directory:** `.next` (default)
- **Root directory:** `.` (project root — not `src/`)

### Cloudflare Integration
If using Cloudflare in front of Vercel:
- Cloudflare injects `CF-IPCountry` header automatically
- Set `COUNTRY_HEADER=CF-IPCountry` in Vercel env vars
- This bypasses client-side ipinfo.io detection entirely (faster, more reliable)
- Add a Cloudflare Transform Rule to **strip** the `CF-IPCountry` header from browser requests (prevents spoofing)

---

## Country Detection — How It Works

Three-layer strategy (most reliable to fallback):

```
Layer 1 — CDN header (fastest, zero latency)
  middleware reads process.env.COUNTRY_HEADER || "cf-ipcountry"
  If header present → use it directly

Layer 2 — Client-side ipinfo.io (5s timeout)
  CountryDetector component → GET /api/country → ipinfo.io
  On success → set cookie + router.refresh()

Layer 3 — Manual selection (always available)
  OverlayCountrySelect → blocking fullscreen overlay
  User picks country → cookie set → no dismiss without selection
```

### Supported Countries
Only 3 are allowed: `IN` (India), `GB` (United Kingdom), `SG` (Singapore).
Any other country code → pending state → overlay shown.

### Country Cookie
Cookie name: `countryContext` (see `src/lib/constants.ts`)
Max age: 30 days
Contains: country ISO code

### Testing Country Detection Locally
Set `MOCK_COUNTRY=IN` (or `GB` or `SG`) in `.env.local` to skip ipinfo.io entirely.

---

## Cron Jobs — Scheduled Tasks

### How It Works
`src/instrumentation.ts` runs once at server startup (Node.js runtime only).
It calls `initJobRunner()` from `src/lib/jobs/index.ts`.
Jobs use `node-cron` for scheduling.

### Jobs Inventory
| Job | Schedule | Purpose |
|---|---|---|
| `alert-match` | Every 15 min | Match new listings to user alerts |
| `alert-digest` | Daily 8am | Send digest emails for matched alerts |

### Manual Job Trigger (Dev/Admin)
```
POST /api/jobs/trigger
Headers: x-cron-secret: <CRON_SECRET>
Body: { "job": "alert-match" }  or  { "job": "alert-digest" }
```

### Requirements
- `MONGODB_URI` must be set — jobs connect to DB
- `RESEND_API_KEY` + `EMAIL_FROM` must be set — jobs send emails
- Without these, jobs log a warning at startup and skip silently

---

## Email Engine — Resend

### Setup
1. Create account at resend.com
2. Verify your sending domain (DNS records)
3. Create an API key → set as `RESEND_API_KEY`
4. Set `EMAIL_FROM` to a verified sender address

### Templates
All email templates live in `src/lib/email/templates/`.
They are React components rendered server-side to HTML.
They use inline styles (required for email client compatibility).

### Email Categories
```
src/lib/email/templates/listings/    → listing status, renewals, milestones, reports
src/lib/email/templates/reports/     → report ticket created/updated, counter-report
src/lib/email/templates/platform/    → GDPR, platform notices, admin messages
```

### Sending Email (from an API route)
```typescript
import { sendEmail } from "@/lib/email";
// sendEmail handles Resend API, error logging, and graceful failure
```

---

## Basic Auth — Internal Route Protection

`/design-system/*` and `/snippets/*` are protected by HTTP Basic Auth in middleware.

**In production:** Set strong `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` values.
Do NOT use the defaults (`dev` / `dev123`) in production.

These routes also have `X-Robots-Tag: noindex` headers (set in `next.config.ts`) to prevent search indexing.

---

## Security Checklist — Before Going Live

- [ ] `BASIC_AUTH_USER` and `BASIC_AUTH_PASS` changed from defaults
- [ ] `CRON_SECRET` generated (`openssl rand -hex 32`) and set
- [ ] `MONGODB_URI` uses a dedicated DB user with minimum required permissions (not root)
- [ ] `RESEND_API_KEY` is a production key (not a test key)
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain (not localhost)
- [ ] Cloudflare WAF rule strips `CF-IPCountry` header from browser requests
- [ ] `NODE_TLS_REJECT_UNAUTHORIZED` is NOT set to `0` in production
- [ ] All env vars set in hosting platform — `.env.local` never committed
- [ ] MongoDB Atlas network access restricted to Vercel IP ranges (or use Vercel integration)

---

## Local Dev Setup (New Machine)

```bash
# 1. Clone repo
git clone <repo-url>
cd poc-next

# 2. Install dependencies
npm install

# 3. Create .env.local (copy template from .env.local in the repo and fill values)
# Minimum for basic dev (no DB, no email):
#   BASIC_AUTH_USER=dev
#   BASIC_AUTH_PASS=dev123
#   NEXT_PUBLIC_APP_URL=http://localhost:3000

# 4. Run dev server
npm run dev
# → http://localhost:3000
```

---

## How This Skill Evolves — Self-Update Protocol

> **This file is a living document. Copilot updates it automatically — no instruction from the owner needed.**

### Triggers — update this file when any of these happen
- A new environment variable is added to the project
- A deployment step changes (Vercel config, Cloudflare rule, Node version bump)
- A new cron job is added or an existing one is changed
- A new email template category is added to `src/lib/email/`
- A production incident reveals a missing checklist item
- The MongoDB Atlas setup changes (new index, new collection, new replica config)
- A country detection edge case is discovered and handled
- The owner confirms an infrastructure decision that wasn't previously documented

### How to update
1. Edit the relevant section directly — keep it concise
2. Replace outdated values or steps — never leave contradictions
3. Add a `> Updated: YYYY-MM-DD — [what changed and why]` note at the top of the changed section
4. Also update `copilot-instructions.md` Env Vars section if a new env var is added

### What NOT to add
- Unconfirmed decisions — mark as `[PROPOSED]` if uncertain, confirm before merging into rules
- One-off patterns that don't generalise — if it happened once, it's not a convention yet
- Anything the owner has explicitly said NOT to do

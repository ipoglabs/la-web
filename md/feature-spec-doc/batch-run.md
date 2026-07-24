# Feature Spec Doc — Batch Run Engine

---

## 📌 Header

| Field | Value |
|---|---|
| **Feature Name** | Batch Run Engine |
| **Short Slug** | `batch-run` |
| **Owner** | Gopi |
| **Created** | 2026-07-08 |
| **Last Updated** | 2026-07-08 |
| **Current Phase** | 🧊 CODE FREEZE |
| **Phase History** | DISCOVERY → REFINEMENT → ARCHITECTURE → PLANNING → IMPLEMENTATION → TESTING → CODE FREEZE |

### Phase Reference
| # | Phase | Emoji | Gate — do not advance until... |
|---|---|---|---|
| 1 | DISCOVERY | 🔵 | Problem statement written, all use cases listed, out-of-scope explicit |
| 2 | REFINEMENT | 🟣 | Scope agreed, constraints locked, all open questions answered |
| 3 | DESIGN | 🎨 | User flows + screen behaviour agreed, responsive + a11y decisions made |
| 4 | ARCHITECTURE | 🟠 | Architecture decided, data contracts defined, sign-off by owner |
| 5 | PLANNING | 🟡 | All tasks numbered, sequenced, milestones named |
| 6 | IMPLEMENTATION | 🔨 | All planned tasks complete, no known broken states |
| 7 | TESTING | 🧪 | All checklists ticked, sign-off by owner |
| 8 | CODE FREEZE | 🧊 | Final scope locked, known limitations documented |
| 9 | DEPLOYMENT | 🚀 | Env vars confirmed, smoke test passed, rollback plan noted |
| 10 | HOTFIX | 🐛 | Post-deployment fixes only — each logged with root cause |
| 11 | ENHANCEMENT | ✨ | Each addition scoped + agreed before work starts |
| 12 | MAINTENANCE | 🔧 | Stable, ongoing watch items noted |

---

## 🔵 Phase 1 — DISCOVERY ✅

### Problem Statement

Users create saved alerts (stored in DB). Currently nothing checks those alerts against new listings. A scheduled batch process needs to run periodically, match new listings against each saved alert, and notify matching users via the right channel (email in v1; SMS/WhatsApp in future) based on their preferences.

Beyond alert matching, the same infrastructure is needed for listing lifecycle events (expiry warnings, auto-expire) and engagement nudges (win-back, onboarding, seller digests). Rather than building a one-off alert matcher, we build a lightweight general job runner — v1 scoped to alert matching only, but architected to support all scheduled jobs without rebuilding.

### Who Is Affected

| User Type | How They Are Affected |
|---|---|
| **Buyer** | Creates a saved alert, expects to be notified when matching listings appear |
| **Seller** | Their new listing triggers a buyer's alert match — indirect beneficiary |
| **Admin / Ops** | Needs visibility into job run history, failures, and health |
| **System** | The scheduler (cron) that owns job timing and execution |

### All Use Cases

**v1 — Alert Matching (in scope)**

| # | Job | When / Trigger | Recipient | Email Type |
|---|---|---|---|---|
| A1 | Instant alert match | New listing posted + matches a saved alert | Buyer | `ALERT_MATCH` |
| A2 | Daily digest | Every day 8am — batch all daily matches per user | Buyer | `ALERT_DIGEST` (daily) |
| A3 | Weekly digest | Every Monday 8am — batch all weekly matches per user | Buyer | `ALERT_DIGEST` (weekly) |
| A4 | No-match nudge | Alert has 0 matches for 14 consecutive days | Buyer | `ALERT_NO_MATCHES` |

**Future — Listing Lifecycle (architecture ready, not built in v1)**

| # | Job | When / Trigger | Recipient | Email Type |
|---|---|---|---|---|
| L1 | Expiry warning | 7 days before listing expires | Seller | `LISTING_STATUS` (expiring_soon) |
| L2 | Auto-expire | Listing passes expiry date | Seller | `LISTING_STATUS` (expired) |

**Future — Engagement (architecture ready, not built in v1)**

| # | Job | When / Trigger | Recipient | Email Type |
|---|---|---|---|---|
| E1 | Win-back 30-day | 30 days since last login | User | `WIN_BACK` |
| E2 | Win-back 60-day | 60 days since last login | User | `WIN_BACK` |
| E3 | Seller weekly digest | Every Monday 8am | Seller | `SELLER_DIGEST` |
| E4 | Onboarding nudge day 2 | 48h post-signup, no listing posted | New user | `ONBOARDING_NUDGE` |
| E5 | Onboarding nudge day 3 | 72h post-signup, still no listing posted | New user | `ONBOARDING_NUDGE` |

### What This Is NOT (explicit out-of-scope)

- **SMS / WhatsApp notifications** — no credentials at POC stage; email only for v1
- **Push notifications** — requires native app or PWA, not in scope
- **Real-time / event-driven matching** — no websockets, no live event stream; batch/cron only
- **Admin UI for job management** — no dashboard to manually trigger, pause, or inspect jobs in v1
- **Per-user notification channel preferences** — no "notify me by SMS only" UI in v1; email is default
- **Job retry on failure** — architecture must support it, but not implemented in v1 (deferred to Enhancement)
- **Payment / billing scheduled jobs** — separate feature entirely
- **GDPR / data export scheduled jobs** — separate feature entirely

**3 architecture-influencing constraints (must affect schema design now even though not built in v1):**
- **Duplicate notification guard** — Alert schema needs `lastNotifiedAt` / `lastMatchedListingId` from day 1
- **Job run log** — Job runner needs a result log table from day 1 for retry + ops visibility
- **Per-user notification preferences** — Alert schema needs a `notifyVia` placeholder field now

---

## 🟣 Phase 2 — REFINEMENT ✅

### Agreed Scope (in) — v1
- Alert matching jobs A1–A4 (instant match, daily digest, weekly digest, no-match nudge)
- `node-cron` scheduler running in-process inside the Next.js Docker container
- Email-only notifications via existing email engine (`lib/email/`)
- Alert Mongoose model with duplicate guard fields
- Job run log (Mongoose) for ops visibility + missed-job detection on restart
- Matching logic in `lib/jobs/` — pure functions, no framework dependency

### Deferred to Later (out for now)

| Use Case | Reason Deferred |
|---|---|
| SMS / WhatsApp notifications | No credentials at POC stage. Schema has `notifyVia` placeholder |
| Push notifications | Requires native app or PWA |
| Admin job dashboard | No UI in v1 — job run log in DB is sufficient |
| Job retry on failure | Enhancement #1 — architecture supports it via job run log |
| Listing lifecycle jobs (L1, L2) | Enhancement #7 — architecture ready |
| Engagement jobs (E1–E5) | Enhancement #8 — architecture ready |
| Fuzzy keyword matching | Enhancement — exact/contains sufficient for v1 |
| Separate worker container | Enhancement — extract from in-process when load demands it |

### Constraints & Non-Negotiables
- **Accessibility:** N/A — backend service, no user-facing UI in v1
- **Security:** Job endpoints must verify they are called by the internal scheduler only — not publicly triggerable. Use a shared secret header (`CRON_SECRET`) verified on every job route.
- **Performance:** Each job run must be non-blocking. Process alerts in batches, not one-by-one in a tight loop. Never hold DB connection open longer than needed.
- **Other:** Docker + zero external cost. No Vercel, no paid queue service. `node-cron` only.

### Dependencies

| Dependency | Status |
|---|---|
| Email engine (`lib/email/`) | ✅ Complete — frozen at Phase 8 |
| `node-cron` npm package | ❌ Not yet installed |
| Alert Mongoose model | ❌ Not yet built |
| Listing Mongoose model | ❌ Not yet built |
| JobRun Mongoose model (run log) | ❌ Not yet built |
| `MONGODB_URI` in `.env.local` | ⚠️ Needed — may already exist |
| `CRON_SECRET` in `.env.local` | ❌ New env var needed |

### Open Questions

| # | Question | Raised | Answered | Answer |
|---|---|---|---|---|
| 1 | What scheduler? | 2026-07-08 | 2026-07-08 | `node-cron` — in-process, zero cost, Docker-native |
| 2 | Where does matching logic live? | 2026-07-08 | 2026-07-08 | In-process — `lib/jobs/` inside Next.js app |
| 3 | How is "instant" match triggered? | 2026-07-08 | 2026-07-08 | 5-min cron — consistent, reliable, seller POST stays fast |
| 4 | Alert document schema? | 2026-07-08 | 2026-07-08 | See Architecture — full schema defined |
| 5 | What constitutes a match? | 2026-07-08 | 2026-07-08 | category (required) + subCategory + price + location + keywords (all optional, AND logic; keywords OR logic; exact/contains only; listing must be live) |
| 6 | Duplicate guard level? | 2026-07-08 | 2026-07-08 | Per alert per listing — `lastMatchedListingIds: ObjectId[]` |

---

## 🎨 Phase 3 — DESIGN

> N/A — backend service, no user-facing UI in v1.

---

## 🟠 Phase 4 — ARCHITECTURE ✅

### Approaches Considered

#### Option A — In-process `node-cron` + `instrumentation.ts` *(selected)*
Jobs run inside the Next.js process. `instrumentation.ts` (Next.js startup hook) initialises `node-cron` once at boot. Job functions live in `lib/jobs/`. No extra containers, no external services.
**Verdict:** Selected — simplest, zero-cost, correct Next.js pattern.

#### Option B — Separate cron Docker container
A second container in `docker-compose.yml` runs a plain Node.js script with `node-cron`. More isolated but doubles container count and adds ops overhead for zero benefit at v1 scale.
**Verdict:** Rejected — over-engineered for v1.

#### Option C — HTTP-based external scheduler (QStash etc.)
Already ruled out — not zero-cost on Docker.
**Verdict:** Rejected — cost constraint.

### Agreed Architecture

```
instrumentation.ts              ← Next.js startup hook → initJobRunner()
                                   (NEXT_RUNTIME === 'nodejs' guard — never runs on Edge)

lib/
  jobs/
    index.ts                    ← initJobRunner() — registers all node-cron schedules
    _runner.ts                  ← shared wrapper: write JobRun start → run job → write result/error
    _types.ts                   ← JobResult, JobName, JobContext types
    alert-match.job.ts          ← runAlertMatchJob() — every 5 min
    alert-digest.job.ts         ← runAlertDigestJob(frequency) — daily + weekly
    alert-no-match.job.ts       ← runAlertNoMatchJob() — daily check, 14-day nudge
  models/
    Alert.ts                    ← IAlert interface + AlertSchema + Alert model
    JobRun.ts                   ← IJobRun interface + JobRunSchema + JobRun model
    Listing.ts                  ← IListing interface + ListingSchema + Listing model

app/api/jobs/
  trigger/
    route.ts                    ← POST — dev-only manual trigger, CRON_SECRET header required
```

### Cron Schedule

| Job | Schedule | Function |
|---|---|---|
| Alert instant match | `*/5 * * * *` | `runAlertMatchJob()` |
| Alert daily digest | `0 8 * * *` | `runAlertDigestJob("daily")` |
| Alert weekly digest | `0 8 * * 1` | `runAlertDigestJob("weekly")` |
| No-match nudge | `0 9 * * *` | `runAlertNoMatchJob()` |

### Data Contracts

**Alert (`lib/models/Alert.ts`):**
```ts
interface IAlert {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  category: string;
  subCategory?: string;
  keywords?: string[];
  location?: string;
  priceMin?: number;
  priceMax?: number;
  frequency: "instant" | "daily" | "weekly";
  notifyVia: string[];                    // ["email"] v1 placeholder
  lastNotifiedAt?: Date;
  lastMatchedListingIds: ObjectId[];      // pruned to last 500
  noMatchSince?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**JobRun (`lib/models/JobRun.ts`):**
```ts
interface IJobRun {
  _id: ObjectId;
  jobName: "alert-match" | "alert-digest-daily" | "alert-digest-weekly" | "alert-no-match";
  startedAt: Date;
  completedAt?: Date;
  status: "running" | "completed" | "failed";
  stats: { alertsProcessed: number; matchesFound: number; emailsSent: number; errors: number };
  error?: string;
}
```

**Listing (`lib/models/Listing.ts`):**
```ts
interface IListing {
  _id: ObjectId;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  location: string;
  status: "live" | "under_review" | "expired" | "sold" | "removed";
  sellerId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Integration Points

| Direction | From | To | How |
|---|---|---|---|
| Startup | `instrumentation.ts` | `lib/jobs/index.ts` | dynamic import, nodejs runtime only |
| Schedule | `lib/jobs/index.ts` | `lib/jobs/*.job.ts` | direct function call via node-cron |
| DB read | `lib/jobs/*.job.ts` | `lib/models/Alert.ts` | Mongoose query |
| DB read | `lib/jobs/*.job.ts` | `lib/models/Listing.ts` | Mongoose query |
| DB write | `lib/jobs/_runner.ts` | `lib/models/JobRun.ts` | Mongoose create/update |
| Email | `lib/jobs/*.job.ts` | `lib/email/index.ts` | `sendEmail(event)` |
| Manual trigger | `app/api/jobs/trigger/route.ts` | `lib/jobs/index.ts` | POST with CRON_SECRET header |

### Env Vars Required

| Var | Purpose | Required / Optional |
|---|---|---|
| `MONGODB_URI` | Mongoose DB connection | Required |
| `RESEND_API_KEY` | Email sending (reuses email engine) | Required (production) |
| `EMAIL_FROM` | Sender address | Required (production) |
| `CRON_SECRET` | Secures manual trigger endpoint | Required |

### Architecture Sign-off
| | Name | Date |
|---|---|---|
| **Score** | 9.2 / 10 | 2026-07-08 |
| **Gaps noted** | `lastMatchedListingIds` pruned to 500; Listing model is new dep — built in M1 | |
| **Agreed by Owner** | Gopi | 2026-07-08 |

---

## 🟡 Phase 5 — PLANNING ✅

### Task Breakdown

Legend: `[ ]` = todo · `[~]` = in progress · `[x]` = done · `[!]` = blocked

**Milestone 1 — Foundation (models + types)**
- [ ] 1. Install `node-cron` + `@types/node-cron` (`npm install node-cron @types/node-cron`)
- [ ] 2. Create `lib/models/Listing.ts` — IListing interface + ListingSchema + model
- [ ] 3. Create `lib/models/Alert.ts` — IAlert interface + AlertSchema + model (with all duplicate guard fields)
- [ ] 4. Create `lib/models/JobRun.ts` — IJobRun interface + JobRunSchema + model
- [ ] 5. Create `lib/jobs/_types.ts` — JobResult, JobName types
- [ ] 6. Add `CRON_SECRET` to `.env.local` (generate a random string)

**Milestone 2 — Job Runner Core**
- [ ] 7. Create `lib/jobs/_runner.ts` — shared wrapper that writes JobRun start, calls job fn, writes result/error
- [ ] 8. Create `lib/jobs/index.ts` — `initJobRunner()` registering all 4 cron schedules
- [ ] 9. Create `instrumentation.ts` at project root — dynamic import of `initJobRunner()` with `NEXT_RUNTIME === 'nodejs'` guard

**Milestone 3 — Alert Match Job**
- [ ] 10. Create `lib/jobs/alert-match.job.ts` — `runAlertMatchJob()`
  - Fetch all active `instant` alerts
  - For each: query live listings matching criteria (category + optional fields)
  - Filter out already-notified listings (`lastMatchedListingIds`)
  - Send `ALERT_MATCH` email via `sendEmail()`
  - Update alert `lastMatchedListingIds` + `lastNotifiedAt` + `noMatchSince`
- [ ] 11. Create `lib/jobs/alert-digest.job.ts` — `runAlertDigestJob(frequency)`
  - Same match logic but for `daily` / `weekly` alerts
  - Groups all matches into one `ALERT_DIGEST` email per user per alert
- [ ] 12. Create `lib/jobs/alert-no-match.job.ts` — `runAlertNoMatchJob()`
  - Fetch active alerts where `noMatchSince` is 14+ days ago and not yet nudged
  - Send `ALERT_NO_MATCHES` email
  - Update alert to prevent re-nudging

**Milestone 4 — API Trigger + POC Demo**
- [ ] 13. Create `app/api/jobs/trigger/route.ts` — POST, dev-only, CRON_SECRET header guard, manually fires any job by name
- [ ] 14. Create `app/design-system/feature/batch-run/page.tsx` — POC demo page showing job definitions, schemas, cron schedules (no real DB needed)
- [ ] 15. Add `Batch Run Engine` entry to `lib/design-system-menu.ts`

**Milestone 5 — Verification**
- [ ] 16. `tsc --noEmit` — zero errors in `lib/jobs/` and `lib/models/`
- [ ] 17. Manual trigger test via `/api/jobs/trigger` with mock DB data
- [ ] 18. Update FSD: implementation notes + files created/modified

### Build Order Notes
- M1 must complete before M2 (types needed by runner)
- M2 must complete before M3 (runner needed by jobs)
- M3 and M4 can run in parallel
- M5 last

### POC Credential Swap (Step 10)

| Original Task | Requires | Swap |
|---|---|---|
| Task 17 — manual trigger test with real data | `MONGODB_URI` + `RESEND_API_KEY` at runtime | ❌ **POC BLOCKED** — replaced by Task 14 (design-system demo showing schemas, job definitions, cron schedules). Real end-to-end test deferred to post-POC when DB + email credentials are wired. |

All other tasks (1–16, 18) are pure code and can run without any external credentials.

---

## 🔨 Phase 6 — IMPLEMENTATION ✅

### Files Created

| File | Purpose |
|---|---|
| `instrumentation.ts` | Next.js startup hook — calls `initJobRunner()` (nodejs guard) |
| `lib/jobs/index.ts` | Registers all 4 cron schedules via `node-cron` |
| `lib/jobs/_runner.ts` | Shared wrapper — writes JobRun start, calls job, logs result/error |
| `lib/jobs/_types.ts` | Shared types: `JobResult`, re-exports `JobName` / `JobRunStatus` |
| `lib/jobs/alert-match.job.ts` | `runAlertMatchJob()` — instant alerts, every 5 min |
| `lib/jobs/alert-digest.job.ts` | `runAlertDigestJob(frequency)` — daily + weekly batched |
| `lib/jobs/alert-no-match.job.ts` | `runAlertNoMatchJob()` — 14-day no-match nudge |
| `lib/models/Alert.ts` | Mongoose model — saved alert criteria + state |
| `lib/models/Listing.ts` | Mongoose model — marketplace listings (DB schema) |
| `lib/models/JobRun.ts` | Mongoose model — job execution log |
| `app/api/jobs/trigger/route.ts` | Dev trigger: POST, `x-cron-secret` guard, returns 202 |
| `app/design-system/feature/batch-run/page.tsx` | POC demo — schemas, schedules, file map |

### Packages Added

| Package | Version | Why |
|---|---|---|
| `node-cron` | latest | In-process cron scheduler |
| `@types/node-cron` | latest | TypeScript types |

### Implementation Notes

- **`*/5` in JSDoc** — the `*/5` cron pattern closes a `/* */` block comment early. Fixed by using plain english in JSDoc (`every-5-min`) and keeping the literal string only in actual code (`cron.schedule("*/5 * * * *", ...)`).
- **User email lookup** — all 3 job files contain a `TODO` comment at the email `to:` field: `user-${userId}@placeholder.invalid`. A real `User` Mongoose model (with email field) must be queried when user authentication is wired.
- **Duplicate guard** — `lastMatchedListingIds` is pruned to last 500 entries on every update. Prevents unbounded array growth on long-running alerts.
- **No-match clock reset** — after sending `ALERT_NO_MATCHES`, `noMatchSince` is cleared. The match jobs re-set it if the next run still finds zero matches. This prevents daily re-nudging.
- **Pre-existing tsc error** — `components/la-blocks/Logo.tsx:3` has a missing `()` on its function signature. This is a pre-existing stub, not introduced by this feature.

### tsc Status

`tsc --noEmit` — **1 pre-existing error** (`Logo.tsx` stub, unrelated). **0 new errors** from batch run engine files.

---

## 🧹 Phase 7 — TESTING ✅

### Code Review Findings + Fixes

| # | Severity | Issue | Fix Applied |
|---|---|---|---|
| 1 | 🔴 Bug | `{ noMatchSince: undefined }` in `findByIdAndUpdate` — Mongoose strips `undefined`, field never unset. No-match clock never resets. Nudge fires every day after first trigger. | Changed to `$unset: { noMatchSince: 1 }` in all 3 job files |
| 2 | 🔴 Bug | Keyword match used AND lookaheads (`join("")` → `(?=.*k1)(?=.*k2)`) but architecture says OR. Alerts with 2+ keywords never matched. | Changed to `join("\|"`) → `k1\|k2` OR pattern |
| 3 | 🟠 Startup | `instrumentation.ts` had no try/catch. Missing `MONGODB_URI` causes `lib/db.ts` to throw at module load inside the dynamic import, crashing Next.js startup. | Wrapped in try/catch with `console.warn` — app starts cleanly, jobs log warning |
| 4 | 🟡 DRY | `escapeRegex()` copy-pasted in `alert-match.job.ts` and `alert-digest.job.ts` | Extracted to `lib/jobs/_utils.ts`, both files now import from there |
| 5 | 🟡 Misleading | `alert-no-match.job.ts` JSDoc said "setting noMatchSince to a sentinel value" — wrong, field is cleared | Fixed to accurately describe `$unset` behaviour |
| 6 | 🟡 Misleading | `route.ts` comment said "not a security boundary" — the route does guard job execution | Fixed comment to explain dev-only scope + note `timingSafeEqual` for production |
| 7 | 🟡 Dead export | `IJobRunStats` re-exported from `_types.ts` but never imported outside `JobRun.ts` | Removed from re-export |
| 8 | 🟢 TODO | All 3 job files had vague `// TODO: look up user email` | Made actionable: shows exact query `User.findById(alert.userId).select("email").lean()` |
| 9 | 🟢 TODO | No scalability note on `.find()` loading all alerts into memory | Added `TODO [scalability]` cursor-streaming guidance in all 3 job files |
| 10 | 🟢 Location escape | `alert.location` used unescaped in regex — user-supplied input could contain regex chars | Now wrapped in `escapeRegex()` |

### tsc Status (post-fix)

`tsc --noEmit` — **1 pre-existing error** (`Logo.tsx` stub, unrelated). **0 errors** from all batch run files.

---

## 🧊 Phase 8 — CODE FREEZE ✅

### Frozen Scope (v1)

| Capability | Status |
|---|---|
| `alert-match` — instant alert matching every 5min | ✅ Built |
| `alert-digest-daily` — daily batched digest | ✅ Built |
| `alert-digest-weekly` — weekly batched digest | ✅ Built |
| `alert-no-match` — 14-day no-match nudge | ✅ Built |
| `_runner.ts` — shared JobRun logging wrapper | ✅ Built |
| `JobRun` model — job health log in DB | ✅ Built |
| `Alert` model — saved alerts schema | ✅ Built |
| `Listing` model — listing DB schema | ✅ Built |
| `instrumentation.ts` — graceful startup hook | ✅ Built |
| `/api/jobs/trigger` — dev manual trigger | ✅ Built |
| Design-system demo page | ✅ Built |

### Known Limitations (documented, acceptable for POC)

| Limitation | Why Acceptable | Unblocks When |
|---|---|---|
| User email uses `placeholder.invalid` address | No `User` model yet | Auth/register feature builds `User` model with `email` field |
| `.find()` loads all alerts into memory | Alert volume negligible at POC stage | Post-launch: replace with cursor streaming (TODO added) |
| `$nin` with 500 IDs is unindexed | Negligible at POC scale | Post-launch: consider TTL-based purge + compound index |
| End-to-end test blocked | Needs `MONGODB_URI` + `RESEND_API_KEY` | Wire `.env.local` for real runs |

### Files in Frozen Scope

```
instrumentation.ts
lib/jobs/_types.ts
lib/jobs/_utils.ts
lib/jobs/_runner.ts
lib/jobs/index.ts
lib/jobs/alert-match.job.ts
lib/jobs/alert-digest.job.ts
lib/jobs/alert-no-match.job.ts
lib/models/Alert.ts
lib/models/Listing.ts
lib/models/JobRun.ts
app/api/jobs/trigger/route.ts
lib/jobs/preview-data.ts
app/design-system/feature/batch-run/page.tsx
```

**Do not modify these files** without opening a new ENHANCEMENT phase.

---

## 🚀 Phase 9 — DEPLOYMENT

> Not started.

### Deployment Checklist
- [ ] Scheduler credentials set in production environment
- [ ] `MONGODB_URI` set and DB accessible from job runner
- [ ] `RESEND_API_KEY` + `EMAIL_FROM` set (reuses email engine)
- [ ] Smoke test: manually trigger alert match job, confirm email received
- [ ] Rollback plan noted below

### Rollback Plan
Disable the cron trigger. All DB models and job functions remain in place — no data loss. Safe to revert instantly.

---

## 🐛 Phase 10 — HOTFIX

> Append-only. None yet.

| # | Date | Bug Description | Root Cause | Fix Applied | Files Changed |
|---|---|---|---|---|---|
| — | | | | | |

---

## ✨ Phase 11 — ENHANCEMENT

> Post-freeze additions. None yet.

| # | Date Agreed | Enhancement | Scope | Status |
|---|---|---|---|---|
| 1 | | Job retry on failure | Retry failed jobs N times with backoff | ⬜ |
| 2 | | SMS notifications | Twilio/AWS SNS integration | ⬜ |
| 3 | | WhatsApp notifications | Meta Business API | ⬜ |
| 4 | | Per-user notification preferences | `notifyVia` field + preference UI | ⬜ |
| 5 | | Admin job dashboard | Run history, failures, manual trigger | ⬜ |
| 6 | | Event-driven matching | Replace cron with event stream (SQS/Kafka) at scale | ⬜ |
| 7 | | Listing lifecycle jobs (L1, L2) | Expiry warning + auto-expire | ⬜ |
| 8 | | Engagement jobs (E1–E5) | Win-back, seller digest, onboarding nudges | ⬜ |

---

## 🔧 Phase 12 — MAINTENANCE

> Not yet in maintenance.

---

## 📋 Decisions Log

| # | Date | Phase | Decision | Rationale | Decided By |
|---|---|---|---|---|---|
| 1 | 2026-07-08 | DISCOVERY | General job runner, not alert-specific | Same infrastructure needed for listing lifecycle + engagement jobs. Build the base once, scope v1 to alerts only. | Gopi + Copilot |
| 2 | 2026-07-08 | DISCOVERY | Email-only notifications in v1 | SMS/WhatsApp require credentials + API approvals not available at POC stage. Email engine already built. | Gopi + Copilot |
| 3 | 2026-07-08 | DISCOVERY | 3 schema fields must be added now even though features are deferred | `lastNotifiedAt`, `jobRunLog`, `notifyVia` — impossible to retrofit cleanly later | Gopi + Copilot |

---

## 💬 Session Log

| Date | Phase At Time | Session Summary |
|---|---|---|
| 2026-07-08 | DISCOVERY | Feature introduced. Problem statement agreed: lightweight general job runner, v1 scoped to alert matching (A1–A4). Use cases mapped across 3 groups (alerts, listing lifecycle, engagement). Out-of-scope list finalised. 3 architecture-influencing constraints identified (duplicate guard, job log, notifyVia). DISCOVERY complete. FSD created. |
| 2026-07-08 | REFINEMENT | All 6 open questions answered. Scheduler: node-cron in-process. Matching: in-process lib/jobs/. Instant match: 5-min cron. Alert schema: full fields defined incl. duplicate guard. Match logic: category required + optional fields AND, keywords OR, exact/contains, live listings only. Duplicate guard: per alert per listing. CRON_SECRET security constraint added. REFINEMENT complete. |
| 2026-07-08 | ARCHITECTURE | 3 options compared (in-process cron selected; pg-boss rejected — wrong DB; Inngest rejected — cost). Folder structure agreed: instrumentation.ts + lib/jobs/ + lib/models/ + app/api/jobs/trigger/. 4 cron schedules defined. 3 data contracts finalised (IAlert, IJobRun, IListing with full TypeScript interfaces). Integration points table written. Env vars table locked. Architecture scored 9.2/10, signed off by Gopi. Phase advanced to PLANNING. |
| 2026-07-08 | IMPLEMENTATION | All 15 tasks complete. 12 new files created: 3 Mongoose models, 5 job files, instrumentation.ts, api trigger route, DS demo page. node-cron + types installed. JS doc */5 comment bug fixed. 0 new tsc errors. POC credential swap applied (Task 17 replaced by DS demo). DS menu entry added. FSD updated. |
| 2026-07-08 | TESTING → CODE FREEZE | Deep-dive review: 10 issues found and fixed. Critical fixes: (1) $unset for noMatchSince — Mongoose silently drops undefined; (2) keyword OR logic — was AND lookaheads, now join("|"); (3) instrumentation.ts try/catch — missing MONGODB_URI crashed startup. Plus: escapeRegex extracted to _utils.ts, misleading comments corrected, IJobRunStats dead export removed, TODOs made actionable, location regex now escaped. tsc: 0 new errors. Frozen. |
| 2026-07-08 | CODE FREEZE | Demo page rewritten to mirror email-engine pattern. Created `lib/jobs/preview-data.ts` with 4 full job preview entries (mock alerts, listing evaluations, trace logs, JobRun records). `app/design-system/feature/batch-run/page.tsx` rewritten with 7 sub-components: BatchRunDemoPage, JobCard, SectionLabel, AlertField, ListingEvalCard, TraceLog, JsonLine. Deep-dive review of both new files: 9 issues fixed — `text-xs`→`text-sm` (a11y, ×8 instances), `traceColor()` function replaced with static `TRACE_COLOR: Record<>` (Tailwind JIT purge-safe), `MockJobRun.jobName` narrowed to `JobName`, `MockJobRun.status` narrowed to `JobRunStatus`, `import type React` added for `React.ReactNode`, stale `alert-no-match` description updated to reflect `$unset` behaviour, `TODO [integration]` added pointing to real `JobRun.find()` query. `preview-data.ts` added to frozen file list. tsc: 0 new errors. |
| 2026-07-08 | CODE FREEZE | Developer Guide panel added to bottom of demo page — 5 numbered steps (env vars → npm run dev → curl trigger → terminal check → cron auto-runs) plus integration note pointing to `TODO [integration]` in `preview-data.ts`. tsc: 0 errors. **🧊 Final freeze confirmed.** |

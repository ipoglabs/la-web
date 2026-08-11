# Create Alert Flow

Status: implemented and verified live against `lokalads-staging` (real admin
session, browser-driven — see "Verification" below). Email delivery is wired
correctly end-to-end but currently blocked platform-wide by an unverified
Resend domain (`lokalads.com`) — not specific to this flow, see "Known gaps".

## Summary

A user builds a saved search ("alert") through a 3-step wizard
(`CreateAlertJourney.tsx`), choosing category/sub-category, optional
filters/keywords/location, and which channels to be notified on
(Email/WhatsApp). Alerts are matched against live `Post` documents by three
cron jobs and persisted in the `Alert` collection. Each user can have at most
**5** active alerts at a time — beyond that, they must delete one from
Manage Alerts (`/my-alerts`) before creating another.

## The wizard (`src/components/create-alert/`)

`CreateAlertJourney.tsx` — three steps, rendered inside `CreateAlertDialog`
(Dialog on tablet+, Drawer on mobile) or embedded directly on `/my-alerts`:

1. **Category + sub-category** — single screen, `ALERT_CONFIG`
   (`create-alert/config/`) joined against the display `CATEGORIES` list.
2. **Filters** — keywords (`LaTagInput`, max 5), location (`LocationPicker`),
   and per-category dynamic filters (`FilterConfig[]` from `ALERT_CONFIG`).
   At least one of keyword/filter/location is required to submit. Filter
   selections are collected but **not persisted** — the match jobs don't
   implement matching against them yet (see `createAlert.ts`'s own doc
   comment); only category/subCategory/keywords/location/notifyVia are
   saved.
3. **Confirmation + notify channels** — Email/WhatsApp toggles. Each toggle
   is **disabled** (with an inline hint) unless the account has that channel
   verified — fetched via `getNotifyChannelAvailability()`
   (`src/app/actions/alerts/getNotifyChannelAvailability.ts`), which checks
   `isEmailVerified`/`isPrimaryNumberVerified` fresh from the DB. This
   prevents a user from selecting a channel that can never actually reach
   them. At least one enabled channel must stay on.

Entry points: homepage `CreateAlertBanner`, `ListingDetailNavBand`, and the
"Create alert" button on `/my-alerts` — all wired through the shared
`useSubmitAlert()` hook.

## Persistence (`src/app/actions/createAlert.ts`)

On submit:

1. Auth check (`getSession()`) — unauthenticated users get redirected to
   `/login` (via `useSubmitAlert.ts`).
2. **5-alert cap**: `Alert.countDocuments({ userId })` — if `>= MAX_ALERTS_PER_USER`
   (`src/lib/constants.ts`), returns `{ success: false, code: "limit_reached" }`
   before creating anything. `useSubmitAlert.ts` surfaces this as a toast
   with a "Manage alerts" action button routing to `/my-alerts`.
3. `Alert.create(...)` — `category`/`subCategory` store the canonical id
   (not the display label); `notifyVia` defaults to `["email"]` if the
   wizard somehow submits an empty array.
4. `logActivity(... "ALERT_CREATED" ...)`.
5. **Immediate confirmation email** (`ALERT_CREATED` event, see below) — a
   fresh `User.findById(session.userId).select("email")` lookup, not the
   session JWT's `email` claim (which can be up to 7 days stale). Best-effort:
   a send failure is caught and logged, never fails the alert creation that
   already succeeded.

## Manage Alerts (`/my-alerts`, `MyAlertsList.tsx`)

- Header shows `X / 5 alerts`; the "Create alert" button disables itself at
  the cap with inline copy ("delete one below to create another").
- Each row: active/paused toggle (`toggleAlertActive.ts`), delete button
  with a confirm dialog (`deleteAlert.ts`) — ownership-checked
  (`alert.userId === session.userId`) server-side on both actions.
- Deleting drops the count back under 5 and immediately re-enables
  "Create alert" (client state update, no page reload needed).

## Notifications

Two separate things fire on different triggers — don't conflate them:

| Email | Trigger | Sent from |
|---|---|---|
| **`ALERT_CREATED`** | Once, immediately on save | `createAlert.ts` → `sendAlertCreatedEmail()` |
| **`ALERT_MATCH`** | Every 5 min, `frequency: "instant"` alerts with new matches | `lib/jobs/alert-match.job.ts` |
| **`ALERT_DIGEST`** | Daily/weekly 08:00, batched matches | `lib/jobs/alert-digest.job.ts` |
| **`ALERT_NO_MATCHES`** | Daily 09:00, 14+ days with zero matches | `lib/jobs/alert-no-match.job.ts` |

All four are registered in the email engine (`src/lib/email/types.ts` →
`subjects.ts` → `renderer.ts` → `templates/alerts/*.tsx`), following the same
pattern: a typed `EmailEvent` union member, a subject-line case, a renderer
case, and a template file exporting an `Email()` HTML function + a `Text()`
plain-text fallback. `preview-data.ts` has one entry per type for the
Basic-Auth-gated `/design-system/feature/email-engine` preview tool.

### WhatsApp delivery

`src/lib/whatsapp.ts` wraps Twilio's Messages API (`TWILIO_WHATSAPP_NUMBER`).
The three cron jobs call it alongside email, gated identically in each:

```ts
if (alert.notifyVia.includes("whatsapp") && recipient.phone && recipient.isPhoneVerified) {
  await sendWhatsAppMessage(recipient.phone, "...");
}
```

`getAlertRecipient()` (`src/lib/jobs/_utils.ts`) does one `User.findById`
per alert, returning `{ email, phone, isPhoneVerified }` — WhatsApp only
ever sends to a **verified** `primaryNumber`, never an unverified one, for
the same reason the wizard's toggle is gated: an unreachable channel
shouldn't silently swallow a notification the user thinks they're getting.

`JobResult`/`JobRun.stats` both carry a `whatsappSent` counter alongside the
existing `emailsSent`, visible in the `/design-system/feature/batch-run`
job-run debug view and the `JobRun` DB records `/api/jobs/trigger` writes.

**Caveat**: WhatsApp Business messaging outside a 24h reply window requires
a Meta-approved message template (Twilio Content API `contentSid`); the
current implementation sends a plain-text `body`, which only works in
Twilio's sandbox or inside that 24h window. Swap `body` for
`contentSid`/`contentVariables` in `sendWhatsAppMessage()` once a template
is approved in the Twilio console.

## Known gaps / intentionally out of scope

- **Resend domain unverified** — every email this flow sends (`ALERT_CREATED`,
  and the three cron-job emails) fails at the provider call today with
  `"The lokalads.com domain is not verified"`. Confirmed live during testing;
  not a bug in this flow's code, a platform-wide Resend/DNS setup gap.
  Delivery will start working the moment the domain is verified — no code
  change needed.
- **Filter values aren't matched** — Step 2's per-category toggle filters
  (bedrooms, fuel type, etc.) are collected in the UI but dropped before
  persistence; `findAlertMatches()` only matches on category/subCategory/
  location/keywords/price.
- **Duplicate-alert detection** — flagged as a `TODO [INTEGRATION]` in
  `CreateAlertJourney.tsx`, not implemented. A user can create two
  functionally-identical alerts (within the 5-alert cap).
- **No admin UI** for browsing/managing other users' alerts.

## Mobile (iOS Safari) fixes applied to this flow

Two bugs affecting the wizard specifically were fixed as part of this work:

1. `src/components/ui/drawer.tsx` was flipping Vaul's own default
   `shouldScaleBackground` from `false` to `true`, which visually shrinks
   the whole page behind any Drawer — including `CreateAlertDialog`'s
   mobile bottom sheet. Fixed at the shared wrapper (default restored to
   Vaul's own `false`) rather than patched per call site.
2. `LaTagInput` (the Keywords field in Step 2) rendered its real `<input>`
   at `text-sm` (14px) — under iOS Safari's 16px auto-zoom-on-focus
   threshold. Bumped to `text-base` (16px), matching every other input
   component in the design system.

A broader sweep found and fixed the same 14px issue in five more inputs
elsewhere in the app (chat, listing-page chat, location search, delete-account
feedback) — unrelated to this flow specifically, fixed opportunistically in
the same pass.

## Verification

Tested live in a browser against the real `admin@lokalads.com` session on
`lokalads-staging` (not a synthetic account — chosen deliberately so the
cron jobs' real match/email/WhatsApp code paths would actually execute, not
just the UI):

1. Created alerts up to the 5-alert cap; confirmed the "Create alert" button
   disables itself at 5/5 with the correct copy, and that the server-side
   check (`createAlert.ts`) independently rejects a 6th create even when the
   client-side disable is bypassed.
2. Confirmed the WhatsApp toggle renders disabled with the "verify your
   phone number" hint (this account has no phone on file), while Email
   defaults on and works.
3. Deleted a test alert, confirmed the count dropped and "Create alert"
   re-enabled immediately.
4. Watched the live `alert-match` cron job (runs every 5 min automatically
   once the dev server is up) process real alerts from the shared staging
   DB, including one of the test alerts — confirmed `whatsappSent` stayed
   `0` throughout (correct: no verified phone anywhere it ran against), and
   that the new `notifyVia`-gated email branch didn't crash the job.
5. Rendered the `ALERT_CREATED` template directly (via `tsx`, bypassing the
   Basic-Auth-gated preview route) and confirmed subject/text/HTML all
   contain the right data.
6. Created a real alert through the UI and confirmed `sendAlertCreatedEmail`
   fired at the right moment, failed only on the pre-existing Resend
   domain-verification gap, and — critically — that the failure was caught
   and logged without blocking the alert creation that had already
   succeeded.
7. All test alerts created during verification were deleted afterward,
   restoring the account to its original state.

**Not verified**: the two mobile-UX fixes' actual on-device behavior in real
iOS Safari (WebKit's auto-zoom-on-focus and Vaul's touch/scroll handling are
not reproducible in this environment — no physical iPhone or iOS simulator
was available). Confirmed instead via source inspection (Vaul's own library
default, `shouldScaleBackground: false`) and a live computed-style check
(`getComputedStyle(input).fontSize === "16px"` on the fixed Keywords input
in a real Chrome session). Recommend a real-device check to close the loop.

# Database Schemas

Mongoose models, `src/lib/db.ts` singleton (no-ops without `MONGODB_URI`). Models live in three places — see [Comments / Issues](#comments--issues) for why that's a problem.

| Model | File | Collection role |
|---|---|---|
| `User` | `src/models/user.ts` | Accounts |
| `Post` | `src/models/post.ts` | **Real** user-created listings (all categories, one giant schema) |
| `Conversation` | `src/models/Conversation.ts` | Chat threads between two users about an ad |
| `Message` | `src/models/Message.ts` | Chat messages |
| `Session` | `src/models/session.ts` | Per-device login sessions (revocation) |
| `Otp` | `src/models/Otp.ts` | OTP codes for email/phone verification |
| `Counter` | `src/models/counter.ts` | Atomic sequence generator (used for `User.userId`) |
| `Donation` | `src/models/donation.ts` | Donation payments |
| `Review` | `src/models/review.ts` | **Unused** — see below |
| `Alert` | `src/models/Alert.ts` | Saved-search alerts |
| `JobRun` | `src/models/JobRun.ts` | Cron job execution log |
| `Listing` | `src/models/Listing.ts` | Second listing schema — written only by seed/migration scripts today, no live app read path, kept intentionally for future use (see #2 below) |

---

## User — `src/models/user.ts`

Account record. Supports passwordless signup (email-only or phone-only), OAuth (`google`/`apple`), and credentials.

| Field | Type | Notes |
|---|---|---|
| `userId` | `string` (required, unique) | Public incrementing ID, generated via `Counter`/`sequence.ts` |
| `fullName` | `string` (required) | |
| `dateOfBirth` | `Date` (required) | |
| `gender` | `string` | |
| `nationality`, `residency`, `locality` | `string` | |
| `address` | `{ country, state, city, postalCode }` | sub-schema, no `_id` |
| `savedLocations` | `SavedLocation[]` | `{ flagCode, city, region, country, primary }`, each keeps its own `_id` |
| `email` | `string` (unique, sparse) | lowercased/trimmed |
| `isEmailVerified` | `boolean` | |
| `primaryNumber` | `string` (unique, sparse) | |
| `isPrimaryNumberVerified` | `boolean` | |
| `secondaryNumber1/2` | `string` | |
| `password` | `string` (optional) | absent for passwordless accounts |
| `publicRole` | `string` (required) | **no enum** — free text. Self-declared display identity only, zero permission implications (renamed from `role` — deliberately not named that, so it can never be mistaken for an access-level check; see `lib/admin.ts`) |
| `roleTitle`, `roleDescription`, `customRole` | `string` | |
| `roles` | `string[]` | multi-select roles from registration |
| `roleSpecialties` | `Mixed` | untyped bag |
| `provider` | enum `credentials/google/apple` | |
| `accountStatus` | enum `Pending/Active/Suspended/Deleted` | |
| `isNewUser` | `boolean` | |
| `isTermsAndConditionAccepted`, `isPrivacyAndPolicyAccepted`, `isCookiesPolicyAccepted`, `marketingOptIn` | `boolean` | |
| `isSuspended` | `boolean`, indexed | moderation flag |
| `audit` | `{ action, IPAddress, Device, by: ref User, at }[]` | one writer today: `ACCOUNT_DELETED` in `deleteAccount.ts` |
| `isDeleted`, `deletedAt`, `deleteFeedback` | soft-delete | |
| `isFullyRegistered` | `boolean`, derived | recomputed in `pre("validate")` |
| `image` | `string` | avatar URL |
| `uuid` | `string` (required, unique, `select: false`) | internal-only stable id, never exposed to the end user — see `getUserAuditDetail.ts` for the one sanctioned opt-in read |

**Removed as dead weight** (2026-08-07): `reported`/`reports[]`/`reportClearedAt`/`reportClearedBy` — the real ad-reporting mechanism is the separate `AdReport` collection (`src/components/report-ad/model.ts`), wired into `app/api/reports/*`/`admin/listReportedAds.ts`/`admin/reviewReport.ts`/`lib/moderation.ts`; these fields on `User` had zero readers or writers anywhere. Also removed the embedded `otp` field (`OtpSchema`) — OTP flows exclusively use the standalone `Otp` collection (`src/models/Otp.ts`, via `otpService.ts`); the embedded field was never read or written.

**Hooks:** `pre("validate")` throws unless at least one of `email`/`primaryNumber` is set, and recomputes `isFullyRegistered`.

---

## Post — `src/models/post.ts`

The real, actively-used listing document — every category (property, vehicles, jobs, services, pets, etc.) flattened into one schema with ~120 optional fields. This is what `addPost`, `getMyPosts`, `getFeaturedListings`, `/api/listings/[category]`, etc. all read/write.

Core fields: `name`, `description`, `images[]`, `category`, `subcategory`, `country`, `ownerId` (ref `User`), `adsId` (unique, via `generateAdsId.ts`), `status` (`pending/active/off/expired/deleted`), `expiresAt`, `lastBumpedAt`, `deletedAt`, `location {address, lat, lng}`, `seller_info {name, phone, email}`.

Everything else is category-specific optional fields (property/rental/commercial, holiday, room rental, jobs, vehicles, pets, services sub-blocks) plus moderation fields: `isSuspended`, `suspendedAt`, `suspendedBy` (ref `User`, correctly typed — actively written by `lib/moderation.ts`). **Removed as dead weight** (2026-08-07): `reported`/`reports[]`/`reportedAt`/`reportedBy` had zero readers or writers anywhere — same issue, same fix as `User`'s equivalent fields above; the real mechanism is the separate `AdReport` collection.

Indexes: `ownerId+updatedAt`; `status+country+category+createdAt` and `status+lastBumpedAt+createdAt` (added 2026-08-07 to match the actual public-browse query shape in `getFeaturedListings.ts`/`api/listings/[category]`, replacing an unused `status+updatedAt` index that matched no real query); plus per-field indexes on `category`, `subcategory`, `country`, `ownerId`, `adsId`, `status`, `expiresAt`, `lastBumpedAt`, `deletedAt`.

---

## Listing — `src/models/Listing.ts`

A **second, structurally different** representation of a listing: fixed taxonomy (`country`/`category` enums from `constants.ts`), denormalized `seller` snapshot, `keyDetails`/`goodToKnow` key-value pairs, single `coordinates {lat,lng}`. Looks like the target shape for the "21-category mock data migrated into Mongo" effort referenced in `constants.ts`'s comments.

Only consumed by `/api/listings/route.ts` and the alert cron jobs (`alert-match.job.ts`, `alert-digest.job.ts`) — i.e., **alerts match against this collection, not against `Post`, the collection real users actually post to.** See [Comments / Issues](#comments--issues).

Indexes: compound `country+category+subcategory+status+createdAt`, text index on `title+description`.

`constants.ts` also exports `COUNTRIES`, `CATEGORIES` (22 values — 4 more than `Listing`'s own enum used elsewhere?), `ADV_ID_RANGES`, `ID_PREFIXES`, `STATUS_VALUES` (includes speculative future values `sold/filled/found`), `LISTING_TYPE_VALUES`, `PRICE_SUFFIXES`.

---

## Conversation — `src/models/Conversation.ts`

`participants: ObjectId[]` (ref `User`), denormalized ad snapshot (`adId`, `adTitle`, `adPrice`, `adImage`), `lastMessage`/`lastMessageAt`, `blockedBy[]`, `deletedBy[]`, `createdBy`, `notificationSentAt: Map<string, Date>`.

`adId` is a plain `String`, not `ref: "Post"` — no referential integrity with the actual listing.

Indexes: `participants`, `participants+adId`, `lastMessageAt` desc.

## Message — `src/models/Message.ts`

`conversationId` (ref `Conversation`), `senderId` (ref `User`), `text` (max 1000), `tempId` (optimistic-send dedup), `readBy: ObjectId[]`, `deletedAt`, `attachments[] {url, publicId, mimeType, fileSize}`.

Indexes: `conversationId+createdAt` (legacy), `conversationId+_id` (cursor pagination), `conversationId+senderId+deletedAt` (unread-count aggregation).

## Session — `src/models/session.ts`

One doc per signed-in device. `userId` (ref `User`), `sessionId` (unique, embedded in the JWT's `sid` claim — the JWT itself stays valid until expiry, so revocation is checked against this collection), `userAgent`, `deviceLabel`, `ip`, `lastActiveAt`, `revokedAt`.

Index: `userId+revokedAt`.

## Otp — `src/models/Otp.ts`

Standalone OTP collection actually used by `otpService.ts` / `updateContact.ts`. `target` (email or phone, indexed), `channel` (`email`/`phone`), `code`, `expiresAt`, `verified`, `attempts`, `lockedUntil`. Has `timestamps: true`.

## Counter — `src/models/counter.ts`

Generic atomic sequence: `_id` = sequence name, `seq: Number`. Currently only driving `User.userId` via `sequence.ts`'s `getNextUserId()`.

## Donation — `src/models/donation.ts`

`donorName`, `donorEmail`, `amount`, `currency`, `method`, `description`, `status`, `transactionId`. Collection explicitly named `"donations"`.

## Review — `src/models/review.ts`

`userId`/`reviewerId` as plain `String` (not `ObjectId` refs, inconsistent with every other model), `name`, `rating` (1–5), `comment`. **Unused**: no API route or server action references this model anywhere. The only "reviews" in the app (`PublicProfileClient.tsx`) are a hardcoded `REVIEWS_BY_HANDLE` mock object.

## Alert — `src/models/Alert.ts`

Saved search: `userId` (ref `User`), `name`, `category`, `subCategory`, `keywords[]`, `location`, `priceMin/Max`, `frequency` (`instant/daily/weekly`), `notifyVia[]` (currently only `"email"` in practice), `lastNotifiedAt`, `lastMatchedListingIds[]` (pruned to last 500, plain `ObjectId[]` not a ref), `noMatchSince`, `isActive`.

Index: `isActive+frequency` for cron pickup.

## JobRun — `src/models/JobRun.ts`

Execution log for the 4 alert cron jobs. `jobName` enum, `startedAt`/`completedAt` (explicit, `timestamps: false`), `status` (`running/completed/failed`), `stats {alertsProcessed, matchesFound, emailsSent, errors}`, `error`.

---

## Comments / Issues

1. ~~**Three separate model directories**~~ Fixed 2026-08-07 — consolidated onto `src/models/` (the dominant, already-established location for 10 of 13 models). Moved `Alert.ts`/`JobRun.ts` from `src/lib/models/` and `Listing.ts` from `src/lib/db/models/` (both directories deleted, now empty); `constants.ts` moved alongside `Listing.ts` as `src/models/listingConstants.ts` (it's Listing-specific — category enum, advId ranges — not a general "db" concern, so it didn't make sense to leave behind on its own). All importers updated across `src/` and `scripts/`.

2. ~~**Two competing "listing" schemas — `Post` and `Listing` — is the biggest structural risk.**~~ Mostly resolved 2026-08-07: the entire saved-search alerts feature was found to be non-functional end-to-end (nothing ever created an `Alert` document — the UI's submit handler was an unwired `TODO [INTEGRATION]`; the match/digest cron jobs queried `Listing.status: "live"`, a value that's never actually stored, so they could never match anything even if `Alert`s existed; email sent to a hardcoded `@placeholder.invalid`). Wired it up for real: `actions/createAlert.ts` now persists real `Alert` docs, and `alert-match.job.ts`/`alert-digest.job.ts` (via the shared `findAlertMatches()` in `lib/jobs/_utils.ts`) now query `Post` — the real, actively-written collection — with the correct `status: "active"` + `isSuspended` filter and id-or-label category/subcategory tolerance (mirroring `api/listings/[category]/route.ts`), plus a real recipient-email lookup. Also deleted the dead `api/listings/route.ts` example scaffold that was the only other `Listing` reader. **`Listing` now has zero real application read paths** — confirmed via repo-wide search — it's written only by `scripts/seed.ts`/`migrate-mock-to-db.ts`. Decision (2026-08-07): keep it, for future real use rather than delete — no action taken on the model or the seed-script writes. Verified matching end-to-end against real DB data (see git history around this date for the throwaway verification scripts used).

3. ~~**`ref: "AdminUser"` points at a model that doesn't exist**~~ — re-verified 2026-08-07 against current source: `User.audit.by` and `Post.suspendedBy` are both `ref: "User"`, not `"AdminUser"` (admins are just regular `User` accounts checked against a fixed email allowlist, see `lib/admin.ts` — there is no separate admin model, by design). The fields this originally flagged as having the wrong ref (`User.reports.by`, `User.reportClearedBy`, `Post.reports.by`, `Post.reportedBy`) have since been deleted entirely as dead weight — see #4 below. No missing-model issue remains.

4. ~~**`User.otp` (embedded `OtpSchema`) is dead weight.**~~ Fixed 2026-08-07 — removed `User.otp`/`OtpSchema` (OTP flows exclusively use the standalone `Otp` collection) and, same issue, `User.reported`/`reports[]`/`reportClearedAt`/`reportClearedBy` and `Post.reported`/`reports[]`/`reportedAt`/`reportedBy` (the real ad-reporting mechanism is the separate `AdReport` collection) — all confirmed zero readers/writers before removal. `AddressSchema` was **not** duplicated anywhere — re-checked, this bullet's original claim was wrong; it's defined once in `user.ts` and used only there.

5. **`Review` model is entirely unused** — no route or action references it, and the profile page's "reviews" are hardcoded mock data (`PublicProfileClient.tsx`). Either wire it up or delete it. If kept, `userId`/`reviewerId` should be `ObjectId` refs to `User`, not plain strings, for consistency with every other model.

6. **`User.publicRole` has no enum** (renamed from `role` — see #4's note and `lib/admin.ts`) even though downstream code assumes a fixed set (e.g. `Listing`'s `SellerSnapshotSchema.role` enum is `["individual", "business", "agency", "other"]`, duplicated by hand rather than imported from one shared source). Recommend a shared `ROLES` const (mirroring the `COUNTRIES`/`CATEGORIES` pattern already used in `constants.ts`) and reusing it in both places.

7. **`Conversation.adId` and `Alert.lastMatchedListingIds` are untyped references** (`String` / bare `ObjectId[]` with no `ref`) — no referential integrity, and `populate()` isn't possible. Given issue #2, it's also unclear whether they're meant to point at `Post` or `Listing` IDs.

8. **`CATEGORIES` in `constants.ts` has 22 entries** but the comment says "4 more...added when the full mock dataset was migrated" without updating `ADV_ID_RANGES`/`ID_PREFIXES` docs elsewhere — double check `Post.category` (plain string, no enum) hasn't drifted from this list, since `Post` doesn't import or validate against `CATEGORIES` at all.

9. **No cascade/cleanup logic visible** between models: deleting a `User` doesn't appear to cascade to their `Post`s, `Conversation`s, `Session`s, `Alert`s, etc. (soft-delete flags exist on `User`/`Post` individually, but e.g. `Session` and `Alert` have no `isDeleted` awareness of a deleted owner). Confirmed at the application layer rather than assumed: `admin/hardDeleteUser.ts` (the one sanctioned hard-delete path, real-admin-session-gated) only cascades `User` itself, nothing else — `ActivityLog`/`Session`/`Conversation`/`Message`/`Review` rows for that user become orphaned. (A separate unauthenticated `deleteUser.ts` duplicate — no auth check, only cascaded `Post` — was removed entirely rather than fixed, since it was fully superseded and unreferenced anywhere.) `deleteAccount.ts` (soft-delete, the real user-facing flow) correctly doesn't cascade-delete anything, by design — see `docs/account-deletion-flow.md`.

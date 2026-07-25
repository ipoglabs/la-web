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
| `Alert` | `src/lib/models/Alert.ts` | Saved-search alerts |
| `JobRun` | `src/lib/models/JobRun.ts` | Cron job execution log |
| `Listing` | `src/lib/db/models/Listing.ts` | **Second**, parallel listing schema used only by alerts + `/api/listings` |

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
| `role` | `string` (required) | **no enum** — free text |
| `roleTitle`, `roleDescription`, `customRole` | `string` | |
| `roles` | `string[]` | multi-select roles from registration |
| `roleSpecialties` | `Mixed` | untyped bag |
| `provider` | enum `credentials/google/apple` | |
| `accountStatus` | enum `Pending/Active/Suspended/Deleted` | |
| `isNewUser` | `boolean` | |
| `isTermsAndConditionAccepted`, `isPrivacyAndPolicyAccepted`, `isCookiesPolicyAccepted`, `marketingOptIn` | `boolean` | |
| `isSuspended`, `reported` | `boolean`, indexed | moderation flags |
| `reports` | `{ reason, by: ref AdminUser, at }[]` | **`AdminUser` model does not exist in the codebase** |
| `reportClearedAt`, `reportClearedBy` | | |
| `audit` | `{ action, IPAddress, Device, by: ref AdminUser, at }[]` | same missing-ref issue |
| `isDeleted`, `deletedAt`, `deleteFeedback` | soft-delete | |
| `otp` | embedded `OtpSchema` | **dead field**, see below |
| `isFullyRegistered` | `boolean`, derived | recomputed in `pre("validate")` |
| `image` | `string` | avatar URL |

**Hooks:** `pre("validate")` throws unless at least one of `email`/`primaryNumber` is set, and recomputes `isFullyRegistered`.

---

## Post — `src/models/post.ts`

The real, actively-used listing document — every category (property, vehicles, jobs, services, pets, etc.) flattened into one schema with ~120 optional fields. This is what `addPost`, `getMyPosts`, `getFeaturedListings`, `/api/listings/[category]`, etc. all read/write.

Core fields: `name`, `description`, `images[]`, `category`, `subcategory`, `country`, `ownerId` (ref `User`), `adsId` (unique, via `generateAdsId.ts`), `status` (`pending/active/off/expired/deleted`), `expiresAt`, `lastBumpedAt`, `deletedAt`, `location {address, lat, lng}`, `seller_info {name, phone, email}`.

Everything else is category-specific optional fields (property/rental/commercial, holiday, room rental, jobs, vehicles, pets, services sub-blocks) plus moderation fields (`reported`, `reports[]`, `isSuspended`, `suspendedAt`, `suspendedBy` — `reports.by`/`suspendedBy` also `ref: "AdminUser"`, same missing-model issue as `User`).

Indexes: `ownerId+updatedAt`, `status+updatedAt`, plus per-field indexes on `category`, `subcategory`, `country`, `ownerId`, `adsId`, `status`, `expiresAt`, `lastBumpedAt`, `deletedAt`.

---

## Listing — `src/lib/db/models/Listing.ts`

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

## Alert — `src/lib/models/Alert.ts`

Saved search: `userId` (ref `User`), `name`, `category`, `subCategory`, `keywords[]`, `location`, `priceMin/Max`, `frequency` (`instant/daily/weekly`), `notifyVia[]` (currently only `"email"` in practice), `lastNotifiedAt`, `lastMatchedListingIds[]` (pruned to last 500, plain `ObjectId[]` not a ref), `noMatchSince`, `isActive`.

Index: `isActive+frequency` for cron pickup.

## JobRun — `src/lib/models/JobRun.ts`

Execution log for the 4 alert cron jobs. `jobName` enum, `startedAt`/`completedAt` (explicit, `timestamps: false`), `status` (`running/completed/failed`), `stats {alertsProcessed, matchesFound, emailsSent, errors}`, `error`.

---

## Comments / Issues

1. **Three separate model directories** (`src/models/`, `src/lib/models/`, `src/lib/db/models/`) with no clear ownership boundary. Recommend consolidating to one, e.g. `src/lib/db/models/`, and updating imports.

2. **Two competing "listing" schemas — `Post` and `Listing` — is the biggest structural risk.** `Post` is what real users create through the app; `Listing` is a differently-shaped, differently-indexed collection that only the alert cron jobs and `/api/listings/route.ts` read. Concretely: a user posts a new ad → it's a `Post` → saved-search alerts (which query `Listing`, per `alert-match.job.ts`) will never see it, and `/api/listings` won't surface it either. Either `Listing` is legacy/seed-only and the alert jobs + that route should be repointed at `Post`, or there's a sync step from `Post` → `Listing` that's missing — worth confirming which is intended and, if `Post` is the source of truth, migrating the alert/listings-API code off `Listing` entirely (or writing the sync).

3. **`ref: "AdminUser"` points at a model that doesn't exist anywhere in the codebase** (`User.reports.by`, `User.audit.by`, `User.reportClearedBy`, `Post.reports.by`, `Post.reportedBy`, `Post.suspendedBy`). Any `.populate()` on these fields will silently return `null`/fail. Either create the `AdminUser` model or change these refs to `"User"` if admins are just regular users with an elevated role.

4. **`User.otp` (embedded `OtpSchema`) is dead weight.** OTP flows actually use the standalone `Otp` collection (`src/models/Otp.ts`, via `otpService.ts`). The embedded field is never read or written — safe to delete along with the duplicated `OtpSchema`/`AddressSchema`... definitions living inside `user.ts`.

5. **`Review` model is entirely unused** — no route or action references it, and the profile page's "reviews" are hardcoded mock data (`PublicProfileClient.tsx`). Either wire it up or delete it. If kept, `userId`/`reviewerId` should be `ObjectId` refs to `User`, not plain strings, for consistency with every other model.

6. **`User.role` has no enum** even though downstream code assumes a fixed set (e.g. `Listing`'s `SellerSnapshotSchema.role` enum is `["individual", "business", "agency", "other"]`, duplicated by hand rather than imported from one shared source). Recommend a shared `ROLES` const (mirroring the `COUNTRIES`/`CATEGORIES` pattern already used in `constants.ts`) and reusing it in both places.

7. **`Conversation.adId` and `Alert.lastMatchedListingIds` are untyped references** (`String` / bare `ObjectId[]` with no `ref`) — no referential integrity, and `populate()` isn't possible. Given issue #2, it's also unclear whether they're meant to point at `Post` or `Listing` IDs.

8. **`CATEGORIES` in `constants.ts` has 22 entries** but the comment says "4 more...added when the full mock dataset was migrated" without updating `ADV_ID_RANGES`/`ID_PREFIXES` docs elsewhere — double check `Post.category` (plain string, no enum) hasn't drifted from this list, since `Post` doesn't import or validate against `CATEGORIES` at all.

9. **No cascade/cleanup logic visible** between models: deleting a `User` doesn't appear to cascade to their `Post`s, `Conversation`s, `Session`s, `Alert`s, etc. (soft-delete flags exist on `User`/`Post` individually, but e.g. `Session` and `Alert` have no `isDeleted` awareness of a deleted owner). Worth confirming this is handled at the application layer (e.g. in `deleteUser.ts`/`deleteAccount.ts`) rather than assumed.

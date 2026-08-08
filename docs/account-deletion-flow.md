# Account Deletion Flow

Status: implemented and verified against `lokalads-staging` (22/22 assertions
passed via a one-off e2e script, run and discarded — see "Verification" below).

## Summary

Deleting an account is **immediate and final** — there is no 30-day grace
period, undo window, or cancel-deletion link. The account is anonymized in
place (not hard-deleted): its `User` document, listings, and chat history all
stay in MongoDB, but every public/user-facing surface is filtered to hide
them. The person can immediately re-register with the same email and phone
number as a genuinely fresh, fully isolated account.

## What happens on delete

`softDeleteAccount` (`src/app/actions/profile/deleteAccount.ts`):

1. Loads the session user, no-ops if already deleted.
2. Runs `User.updateOne` (not `.save()`) with:
   - `$set`: `fullName: "Deleted User"`, `isDeleted: true`,
     `accountStatus: "Deleted"`, `isSuspended: false`, `deletedAt: now`,
     `deleteFeedback`, `isEmailVerified: false`, `isPrimaryNumberVerified: false`
   - `$unset`: `email`, `primaryNumber`, `appleEmailId`, `secondaryNumber1`,
     `secondaryNumber2`, `image`
   - `$push`: an `ACCOUNT_DELETED` entry onto `audit[]`
3. Cascades to their listings: `Post.updateMany({ ownerId }, { status: "deleted" })`.
4. Clears the session (logs them out).
5. Sends an `ACCOUNT_DELETED` confirmation email (no cancel link).

### Why `$unset`, not `null` or `.save()`

- `email`/`primaryNumber`/`appleEmailId` all carry **sparse unique** Mongo
  indexes. A sparse index still counts a field with value `null` as present
  — two documents with `email: null` would collide on the unique constraint.
  Only a genuinely **absent** field is skipped by a sparse index, which is
  what `$unset` produces. This is what makes the same email/phone reusable
  immediately.
- `User`'s schema has a `pre("validate")` hook requiring at least one of
  `email`/`primaryNumber` to be present (a live, loggable-in account must be
  reachable). Unsetting *both* at once would fail that hook — but
  `Model.updateOne` doesn't run document middleware, so it bypasses this
  check entirely. That's intentional: the invariant is for live accounts,
  not tombstones.
- `fullName` is a required field and can't be unset, so it becomes the
  placeholder `"Deleted User"` instead.

## Where the deleted state is enforced

| Surface | File | Behavior |
|---|---|---|
| Login (OTP/magic-link) | `src/lib/auth.ts`, `src/app/api/auth/resolve-identity/route.ts` | Rejects `isDeleted`/`accountStatus: "Deleted"` |
| Session read | `src/app/actions/getCurrentUser.ts` | Same rejection |
| OAuth (Google/Apple) | `src/app/api/auth/resolve-identity/route.ts` | Same rejection |
| Search / category listings | `src/app/api/listings/route.ts` | Filters `status: "active"` only |
| Public profile (`/u/[handle]`) | `src/app/actions/getPublicProfile.ts` | Filters `status: "active"` only |
| Direct listing URL | `src/app/actions/getPostByAdsId.ts` (`resolvePostListingContext`) | Excludes `status: "deleted"`/`"off"`/`"expired"` |
| Re-registration duplicate check | `src/app/api/auth/complete-profile/route.ts` | `User.findOne({ email })` / `{ primaryNumber }` — no longer matches the unset fields |
| Owner's own dashboard | `src/app/actions/getMyPosts.ts` | Filters `ownerId` to the *current* session's `_id` |

## Chat: history stays, replies don't

Existing conversations are **not** touched by deletion — no schema changes,
no data moved. This is deliberate: `Conversation`/`Message` documents still
reference the old `User._id` via `senderId`/`participants`, and both
`GET /api/conversations` and `GET /api/conversations/[id]` populate the
sender's `fullName` **live** from the `User` document on every read. Because
`fullName` is now `"Deleted User"`, that's what the remaining participant
sees automatically — no extra code needed for the identity change.

What *is* enforced:

- **`GET /api/conversations`** (`src/app/api/conversations/route.ts`) now
  selects `isDeleted` on the populated participant and returns
  `otherUser.isDeleted` per conversation.
- **`POST /api/conversations/[id]/messages`**
  (`src/app/api/conversations/[id]/messages/route.ts`) checks the other
  participant's `isDeleted` before creating a message and returns
  `403 { code: "RECIPIENT_DELETED" }` if they're gone.
- **`ChatPageClient.tsx`** disables the message box and shows *"This user
  has deleted their account. You can't send new messages here."* instead of
  the blocked-contact message, using the same UI pattern as the existing
  block/unblock flow.

Net effect: the remaining participant keeps full read access to the
conversation history (sender shown as "Deleted User"), but can't send new
messages into it.

## Re-registration with the same email/phone

Because email/phone were `$unset` (not merely hidden), the duplicate check
during registration genuinely finds nothing, and a **brand-new** `User`
document is created — new `_id`, new `userId`, fresh `fullName` typed by the
person at signup. There is **no field anywhere linking the new account back
to the old one**.

Consequences, verified directly against the database:

- **Listings**: `getMyPosts.ts` queries `Post.find({ ownerId: <current _id> })`.
  Old listings still carry the *old* `_id` — the new account's dashboard is
  empty.
- **Chats**: `GET /api/conversations` filters `participants: <current _id>`.
  Old conversations still list the *old* `_id` — the new account's inbox is
  empty.
- **Identity**: nothing in the new account's `fullName`, avatar, or profile
  carries over — it's typed fresh during onboarding, same as any first-time
  signup.

The old (anonymized) `User` document, its `"deleted"`-status listings, and
its chat history all remain in MongoDB indefinitely — reachable only by a
direct `_id`/`userId` lookup (e.g. a future admin tool), never through any
account-scoped query a real user or the public can trigger.

## What's intentionally out of scope

- **No admin UI for *this* flow** — `/admin` (Posts, Reports, Users) exists,
  but nothing there browses soft-deleted accounts specifically; "admin
  visibility" for this flow today still just means the data isn't
  hard-deleted and stays queryable directly, not that a page exists to
  browse it (`/dev-tools` → Deleted users is the only UI that does, and it's
  a Basic-Auth-gated dev tool, not a production admin feature).
- **`admin/hardDeleteUser`** (`src/app/actions/admin/hardDeleteUser.ts`) is a
  separate, real-admin-session-gated tool that actually removes the Mongo
  document — used only to unblock re-registration during manual testing.
  (Moved out of `/dev-tools`, formerly `/la-dev`, on 2026-08-07 — a
  destructive, irreversible action warranted the real per-admin session gate
  over shared Basic Auth.) It is deliberately **not** merged with or reused
  by the real deletion flow above; they solve different problems (test
  cleanup vs. real user privacy/data-retention semantics) and should stay
  decoupled.
- **`seller_info`** embedded on old `Post` documents (a name/phone/email
  snapshot taken at posting time) is not separately scrubbed — it's moot
  since those posts are `status: "deleted"` and invisible everywhere.

## Verification

Ran a one-off script directly against `lokalads-staging` (not committed —
created, executed, and deleted in the same session) that:

1. Registered a seller and a buyer, created a listing owned by the seller,
   and a conversation + message between them.
2. Applied the exact same `User.updateOne`/`Post.updateMany` operations
   `softDeleteAccount` performs.
3. Asserted: `isDeleted`/`accountStatus`/`deletedAt` set correctly;
   email/primaryNumber/appleEmailId/secondaryNumber1-2/image absent;
   `fullName` anonymized; the listing's status flipped to `"deleted"` and no
   longer matched a `status: "active"` query; the conversation and message
   were untouched and still populated the seller as `"Deleted User"`; the
   new-message guard's underlying check would reject a reply.
4. Re-registered a third user with the *same* email and phone, confirming no
   duplicate-key collision, a distinct `_id`, and empty `Post`/`Conversation`
   queries scoped to that new `_id`.

All 22 checks passed. Test documents were cleaned up (`deleteOne` per
created doc) in a `finally` block after the run.

# Real API Gap Inventory — Whole Project

> One flat list of every backend API this app will need before it's real, grouped by domain (not by screen or journey — an endpoint is usually consumed by 2+ screens, so a screen-wise or journey-wise list would just duplicate the same contract several times and drift out of sync). Screens/journeys that consume each domain are listed in the "Used by" column instead.
> Sources: (1) exhaustive grep of `TODO [INTEGRATION]`, `TODO [AUTH...]`, `TODO [API...]`, `TODO: [API]`, `TODO(auth-integration)`, `TODO [SCHEMA...]` markers across `src/`; (2) the full sequence diagrams already planned in `md/architecture/journeys/01-07` (these are richer than code comments — they're the actual designed request/response shape, not just "needs an API" flags); (3) cross-checked against [06-route-inventory.md](06-route-inventory.md) (what's actually built) and [BIG-PICTURE.md](../BIG-PICTURE.md)'s stub table.
> Last generated: 2026-07-13 (v2 — merged in the journey-doc planned sequences: full listings CRUD, chat/conversations, follows, reviews, notifications, moderation/admin, uploads, payments)
> Maintenance: whenever a route in this list gets built for real, move its row's Status to ✅ and update [06-route-inventory.md](06-route-inventory.md) — don't let the two docs disagree.

---

## Status key

| Symbol | Meaning |
|---|---|
| ✅ | Real route, works end-to-end (see 06-route-inventory.md) |
| 🧪 | Route file exists but is a stub/proxy waiting on a real key or DB wiring |
| 📐 | Fully designed in a journey doc (request/response shape agreed) but zero code written — highest-confidence "build next" candidate |
| ⬜ | Not designed in detail anywhere yet — only a TODO comment flags the need |

---

## 1. Categories & Config

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `GET /api/categories?country={iso}` | ⬜ | Ordered category list per country, driving grid + footer + trending order | Landing (`CategoryGrid`), footer "Popular Category" |

Current: static `CATEGORIES` config filtered by `COUNTRY_CONFIGS[country].enabledCategories` — no fetch at all. See [page.tsx](../../../src/app/page.tsx#L23-L25), [CategoryGrid.tsx](../../../src/components/la-blocks/CategoryGrid.tsx#L13-L17).

---

## 2. Listings — Browse, Search & CRUD

This is the single biggest domain — split into read (search/browse) and write (post/edit/lifecycle), fully designed end-to-end in [journeys/02-search-and-find.md](../journeys/02-search-and-find.md) and [journeys/01-post-an-ad.md](../journeys/01-post-an-ad.md).

### 2a. Read — Search & Browse

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `GET /api/listings?countryCode=&q=&lat=&lng=&radius=&categoryId=&subcategoryId=&minPrice=&maxPrice=&sortBy=&page=` | 📐 | Full search: MongoDB Atlas Search (`$search`, fuzzy maxEdits:1) + geo `$near` + filters + pagination | Listings page (all filters/sort/pagination) |
| `GET /api/listings/[category]?country=&sub=` | 🧪 | Current simplified category-only version — superseded by the unified `GET /api/listings` above once search lands | Listings page (today) |
| `GET /api/v1/listings/featured?country=&section=recent\|top-picks&limit=` | ⬜ | Cross-category homepage rows, real ranking (newest / quality signal) | Landing "Recent Posts" + "Top Picks" |
| `GET /api/v1/listings?country=&city=` | ⬜ | Cross-category **city browse** (structured city field, not substring match) | Footer "Top Locations" |
| `GET /api/v1/searches/popular?country=` | ⬜ | Trending/popular searches per country | Landing "Popular Searches" |
| `POST /api/search/recents` | ⬜ | Sync a logged-in user's recent searches server-side (merge with localStorage) | Search bar |

Notes:
- `/api/listings/[category]/route.ts` already exists and is called by `useListingSearch`, but its body still has `TODO [API INTEGRATION]`: map Mongo docs → canonical `Listing` shape, add real pagination metadata, remove placeholder empty items — see [route.ts](../../../src/app/api/listings/%5Bcategory%5D/route.ts#L77-L79).
- Mock resolvers to be replaced 1:1 (all in [country-map.ts](../../../src/lib/mock/country-map.ts)): `getFeaturedForMarket()`, `getListingsForCity()`, `getListingsForMarket()`.
- `lib/listing-filters.ts` TODO: real API must accept `price_min`/`price_max` etc. as separate query params — see [listing-filters.ts](../../../src/lib/listing-filters.ts#L130).
- URL is the single source of truth for all search state (`countryCode`, `categoryId`, `subcategoryId`, `q`, `lat`/`lng`, `radius`, `minPrice`/`maxPrice`, `sortBy`, `page`) — filters are **draft** until "Apply", per [02-search-and-find.md](../journeys/02-search-and-find.md#url-as-state--rules).
- Alert-matching is designed to run **inline, synchronously**, right after `POST /api/listings` succeeds (V1) — queries active `saved_alerts` matching country+category, keyword-matches title, inserts a notification, sends email if opted in. V2 upgrade path: offload to a job queue (BullMQ/Inngest) — see [02-search-and-find.md](../journeys/02-search-and-find.md#alert-matching--background-job). (This is distinct from — and would eventually replace — the already-real cron-based `alert-match.job.ts`/`alert-digest.job.ts`/`alert-no-match.job.ts` batch jobs, which poll rather than fire inline.)

### 2b. Write — Post, Edit, Lifecycle

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `POST /api/upload` + direct `PUT` to Cloudflare Images | 📐 | Decoupled image upload — all images uploaded before form submit, server returns `{ uploadUrl, imageId }` | Post-an-ad Step 5 (up to 10 images), profile avatar change |
| `POST /api/listings` | 📐 | Publish a listing — validates `categoryId` against `enabledCategories`, generates `advId`/slug, embeds `sellerSnapshot`, sets `expiresAt = publishedAt + 60d`, status `active` | Post-an-ad Step 7 (submit) |
| `GET /api/listings/[id]` | 📐 | Fetch one listing for the edit form (owner-only) | `/myads` → Edit |
| `PATCH /api/listings/[id]` | 📐 | Edit listing fields — slug never regenerated, `sellerSnapshot` frozen, 403 if not owner | `/myads` → Edit → Save |
| `PATCH /api/listings/[id]/status` | 📐 | Pause/Resume/Renew/Close — atomically inc/dec `users.activeListingsCount` | `/myads` lifecycle actions |
| `DELETE` (Cloudflare image) via `/api/upload` companion | ⬜ | Remove an image during edit | `/myads` → Edit → remove image |

Notes:
- `/post` and `/myads` are both currently bare "Coming soon" stubs — see [(main)/post/page.tsx](../../../src/app/(main)/post/page.tsx) and [(dashboard)/myads/page.tsx](../../../src/app/(dashboard)/myads/page.tsx) — but the **entire flow is already fully designed**, sequence-by-sequence, in [journeys/01-post-an-ad.md](../journeys/01-post-an-ad.md) and the "My Ads — Listing Lifecycle" section of [journeys/05-manage-account.md](../journeys/05-manage-account.md#my-ads--listing-lifecycle). Treat those docs as the spec when building — don't re-derive the shape from scratch.
- Key server-side rules already decided: `countryCode` on a listing = active browsing cookie, not `users.homeCountry`; slug collisions retried silently server-side (client never sees 409); listing statuses are `active | off-market | expired | closed` with defined transitions (see table in 05-manage-account.md).
- `lib/models/Listing.ts` (Mongoose) already exists — schema has `status` enum `"live" | "under_review" | "expired" | "sold" | "removed"`, which is a **different status vocabulary** than the journey doc's `active | off-market | expired | closed` — reconcile these two before building; one of the two docs is stale relative to the other.

---

## 3. Listing Detail

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `GET /listings/{id}` (or `[slug]`) | 📐 | Full listing detail incl. categoryId/subcategoryId/market, SSR'd for SEO | Listing detail page |
| `GET /listings/similar?listingId=` | ⬜ | Similar-listings rail | Listing detail page |
| `POST /api/favourites` | ⬜ | Save to favourites (ATOMIC: create + `$inc favouriteCount`) | ♥ icon |
| Fire-and-forget `$inc listing.viewCount` | ⬜ | View counter, deduped per-user within 24h (session or Redis set) | Page load |
| Google Maps Embed API key | ⬜ | Real map pin instead of static placeholder | `ListingMap.tsx` |

Notes: `resolveListingContext()` in [country-map.ts](../../../src/lib/mock/country-map.ts#L417) currently does a global mock scan by id; real API must return category/sub/market on the payload directly. `ListingDetailsTable.tsx`/`ListingUserFacts.tsx` have local `Row`/`FactItem` types marked `TODO [INTEGRATION]`. Description HTML needs server-side sanitization before render. Full page-load sequence (SSR listing fetch → similar listings → client hydrate → session check → favourite-state check → fire-and-forget view increment) is spec'd in [journeys/03-listing-detail.md](../journeys/03-listing-detail.md#page-load-sequence). Buyer must not see ChitChat/contact actions on their own listing (`session.id === listing.sellerId` guard) — **this guard is now implemented** ([SellerContactGate.tsx](../../../src/app/(main)/listings/%5BlistingId%5D/SellerContactGate.tsx), wired in [page.tsx](../../../src/app/(main)/listings/%5BlistingId%5D/page.tsx#L134-L136) against the mock `getSession()`) — swaps SellerCard + ChitChat for an "Edit your listing" link when `session.id === seller.id`. Still a mock-session check, not a real gap; will keep working unchanged once `getSession()` returns real data.

---

## 4. Seller Contact / Public Profile

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `GET /api/sellers/{handle}` | ⬜ | Resolve a public seller profile by handle | `/u/[handle]` page |
| Auth-gated "reveal phone number" call | ⬜ | Gate seller phone reveal behind login | `SellerCard.tsx` |
| Email compose / contact-seller endpoint | ⬜ | "Email seller" action (may be superseded by Chat, domain 5, once that exists) | `SellerCard.tsx`, listing detail page |
| `POST /api/follows` | 📐 | Follow a seller — ATOMIC create + `$inc seller.followersCount` | Seller card, seller public profile |
| `DELETE /api/follows/[id]` | 📐 | Unfollow — ATOMIC delete + `$dec followersCount` | Same |
| `POST /api/reviews` | 📐 | Leave a review — only after a `closed` listing conversation; guards: reviewer≠target, one review per (reviewer, listing); recalculates `avgRating`, `$inc reviewCount` | `/chat/[id]` "Leave a review" CTA |

Notes: `HANDLE_TO_SELLER` is a hardcoded mock lookup map (only 6 GB-property sellers wired) — see [(main)/u/[handle]/page.tsx](../../../src/app/(main)/u/%5Bhandle%5D/page.tsx#L23). Follows and reviews are **new domains** not previously in this inventory — fully designed in [journeys/03-listing-detail.md](../journeys/03-listing-detail.md#follow-seller) (no `Follow`/`Review` Mongoose model exists yet — confirmed via grep of `lib/models/`). V1 scope note: seller-to-buyer reviews are explicitly deferred to V2; only buyer→seller reviews are in scope now.

2026-07-13 update — `Seller` type ([types/listing.ts](../../../src/types/listing.ts)) gained 4 optional fields ahead of the real API: `id` (for the own-listing guard, see domain 3), `avgRating`/`reviewCount` (now rendered as a compact ★ badge on [SellerCard.tsx](../../../src/app/(main)/listings/%5BlistingId%5D/SellerCard.tsx) next to "Verified", additive/no layout change), and `accountType: "individual" | "business"` (populated in mock data, not yet rendered anywhere — still a real gap, no visual distinction between an individual and a registered business seller today). All 6 GB-property mock sellers in [sellers.ts](../../../src/lib/mock/gb/property/sellers.ts) backfilled with real-looking values computed from the public profile's existing `REVIEWS_BY_HANDLE` data so the two never disagree. Email/Call CTAs on `SellerCard.tsx` are also no longer silently dead — [SellerContactGate.tsx](../../../src/app/(main)/listings/%5BlistingId%5D/SellerContactGate.tsx) now passes an honest "sign in to contact seller" toast until the real endpoints below exist. None of this changes the underlying gap — the rating/follow/reveal-phone APIs are still 📐/⬜ — it's mock-data + UI progress only.

---

## 5. Chat / Messaging

Fully designed in [journeys/06-chat.md](../journeys/06-chat.md) — this is a much richer domain than a single "send message" endpoint; treat that doc as the spec.

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `POST /api/conversations` | 📐 | Start (or return existing) conversation for `(listing, buyer, seller)` triplet — dedupes on create, embeds snapshots | Listing detail "Contact Seller" |
| `GET /api/conversations` | 📐 | Inbox list — sorted by `lastMessageAt`, with unread counts + counterparty info | `/chat` page |
| `GET /api/conversations/[id]` | 📐 | Single conversation metadata | `/chat/[id]` thread |
| `GET /api/conversations/[id]/messages?limit=&cursor=` | 📐 | Paginated message history (cursor-based, load-more-on-scroll-up) | `/chat/[id]` thread |
| `POST /api/conversations/[id]/messages` | 📐 | Send message (`type: "text" \| "offer" \| "system"`) — ATOMIC insert + update `lastMessage`/`lastMessageAt` + `$inc unreadCount` for the other party | `ChitChat.tsx`, `/chat/[id]` |
| `PATCH /api/conversations/[id]/read` | 📐 | Mark thread read — zeroes this user's `unreadCount` | Opening a thread |
| `PATCH /api/messages/[msgId]` | 📐 | Accept/decline an `offer`-type message (`offerStatus`) | Offer bubble actions |
| `PATCH /api/conversations/[id]/block` | 📐 | Block — thread archived, other party can't reply | Chat overflow menu |
| Realtime transport | ⬜ | V1: short-poll `GET .../messages?after=` every 5s (Vercel-serverless-safe); V2: SSE stream | `/chat` inbox + thread |

Notes: `/chat` page currently renders from a `MOCK_DATA` constant; `ChitChat.tsx` needs `listingId`/`currentUserId` props threaded in — see [ChitChat.tsx](../../../src/app/(main)/listings/%5BlistingId%5D/ChitChat.tsx#L7-L25). Key rule: one conversation per `(buyer, seller, listing)` triplet; seller can never initiate; messages are soft-deleted only (`status: deleted`), never hard-deleted.

---

## 6. Alerts

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `POST /api/alerts` | 📐 | Create an alert — `{ countryCode, categoryId, keywords[], location, notify: { email } }` | Create Alert journey (landing bell + banner, listing detail nav band, search results "Save Alert") |
| `GET /api/alerts` | 📐 | List a user's saved alerts (also used for duplicate-alert detection) | Dashboard alerts list |
| `PATCH /api/alerts/[id]` | 📐 | Pause/resume an alert (`{ active: false }`) | Dashboard alerts list |
| `DELETE /api/alerts/[id]` | 📐 | Delete an alert | Dashboard alerts list |
| `GET /api/alerts/count` | ⬜ | Enforce max-alerts-per-user limit before allowing a new one | Create Alert journey (step gate) |

Notes: this is the one domain where the **backend data model already exists** — `lib/models/Alert.ts` (Mongoose) is real and consumed by the email-digest cron jobs (`lib/jobs/alert-digest.job.ts`, `alert-match.job.ts`, `alert-no-match.job.ts`). Those jobs also have `TODO [auth-integration]`: replace a placeholder user-email lookup with the real users table once auth ships. So the DB layer for alerts is ahead of the API layer — the gap is purely "no `/api/alerts` route handler exists yet to let the UI write to that model." Full request/response shapes for create/list/pause/delete are in [journeys/05-manage-account.md](../journeys/05-manage-account.md#saved-alerts) and [journeys/02-search-and-find.md](../journeys/02-search-and-find.md#save-as-alert-flow). See also [CreateAlertJourney.tsx](../../../src/components/create-alert/CreateAlertJourney.tsx#L604-L664).

---

## 7. Auth — entire surface is unbuilt

Fully designed in [journeys/04-register-and-login.md](../journeys/04-register-and-login.md) (4 paths: email+OTP, OAuth, magic link, forgot password) plus [02-auth-guards.md](02-auth-guards.md) for session/guard mechanics.

| Endpoint (planned) | Status | Purpose |
|---|---|---|
| `POST /api/auth/register` | 📐 | Create pending user (name/email/dob/password, age-gated) |
| `POST /api/auth/verify-otp` (registration) | 📐 | Verify email OTP, activate account, set session |
| `POST /api/auth/resend-otp` | 📐 | Resend OTP — rate-limited 3/10min, invalidates previous OTP |
| `POST /api/auth/callback/google` / `/apple` | 📐 | OAuth token verify + upsert user (`status: pending-profile`) |
| `POST /api/auth/complete-profile` | 📐 | DOB + T&C after OAuth, age gate, `status: active` |
| `POST /api/auth/magic-link` | 📐 | Passwordless login — 64-char token, SHA-256 hashed, emailed |
| `GET /api/auth/verify-magic` | 📐 | Validate magic-link token, set session |
| `POST /api/auth/forgot-password` | 📐 | Always returns 200 (never reveals existence); emails reset link if found |
| `POST /api/auth/reset-password` | 📐 | Validate token, bcrypt new password, `$inc sessionVersion` (invalidates all existing JWTs) |
| `POST /api/auth/logout` | 📐 | Delete session cookie |

Notes: `lib/session.ts`'s `getSession()` is a stub returning a hardcoded mock `AuthUser` — see [session.ts](../../../src/lib/session.ts#L1-L42). `/login` page itself is a bare "Coming soon" stub. Session design is already decided: JWT signed 30 days, `HttpOnly` cookie, includes `sessionVersion`; every request re-checks `sessionVersion` against DB so a password reset invalidates all existing sessions instantly. OAuth email-conflict case is explicitly handled (409 `email_conflict` if a Google sign-in email already exists as email/password — V1 blocks rather than merges). This entire domain is tracked in more detail by the `la-auth` skill — this table exists here just so it isn't missing from the flat inventory. **This remains the single biggest unblocking domain**: alerts, favourites, follows, reviews, chat, and profile all either directly need a session or need a `userId` to attach data to.

---

## 8. Profile / Account Settings

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `GET /api/profile/check-handle` | ✅ | Handle availability check | Profile page |
| `PUT /api/users/me` | 📐 | Save name/tagline/avatar/locationLabel — server must also `updateMany` cascade the new `sellerSnapshot` onto every one of that user's active listings, ATOMIC | Profile page basic-info save |
| `PATCH /api/profile/basic-info` | ⬜ | (Older/simpler naming for the same save action — reconcile with `PUT /api/users/me` above before building both) | Profile page |
| `POST /api/profile/change-password` | ⬜ | Change password | Profile page |
| `POST /api/profile/2fa/enable` / `/disable` / `/verify` | ⬜ | TOTP 2FA setup | Profile page |
| `GET /account/delete-eligibility` | ⬜ | Check if account can be deleted (e.g. no active listings) | Delete-account flow |
| `POST /account/delete-feedback` | ⬜ | Capture exit-survey reason | Delete-account flow |
| `DELETE /account` | ⬜ | Actually delete the account | Delete-account confirm page |

Notes: profile page renders entirely from mock data (`MOCK_2FA_SECRET`, `MOCK_BACKUP_CODES`, hardcoded profile object) pending auth — see [(dashboard)/profile/page.tsx](../../../src/app/(dashboard)/profile/page.tsx#L1846). Delete-account reasons list should come from a config/backend service for localization. `deleteAccountStore.ts` already stubs out the exact 3 delete-flow calls above with `TODO: [API]` markers. Avatar change reuses the Upload domain (see 11) before the `PUT /api/users/me` call.

---

## 9. Favourites

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `GET /api/favourites` | 📐 | List a logged-in user's favourites, rendered from an embedded `listingSnapshot` (no join needed) | `/favourites` page |
| `GET /api/favourites?listingId=` (or embedded in detail fetch) | 📐 | `isFavourited` boolean check on listing detail load | Listing detail ♥ state |
| `POST /api/favourites` | 📐 | Add favourite — ATOMIC create + `$inc favouriteCount` | ♥ icon, `FeaturedListings` |
| `DELETE /api/favourites/[listingId]` | 📐 | Remove — ATOMIC delete + `$dec favouriteCount` | `/favourites` page, ♥ icon |

Notes: today favourites are 100% client-side — `favouritesStore.ts` is a Zustand store persisted only to `localStorage` (key `la-favourites`), no server sync, so favourites don't survive a device change or logout. `/favourites` page itself is still a bare "Coming soon" stub. Full shape spec'd in [journeys/03-listing-detail.md](../journeys/03-listing-detail.md#save-to-favourites) and [journeys/05-manage-account.md](../journeys/05-manage-account.md#favourites).

---

## 10. Report Ad / Moderation / Admin

| Endpoint | Status | Purpose | Used by |
|---|---|---|---|
| `POST /api/reports` | ✅ | Submit a report (listing or user, via `targetType`) | `ReportAdJourney`, `ListingReportButton`, chat overflow "Report User" |
| `GET /api/reports/[ticketId]` | ✅ | Check ticket status | Report confirmation |
| `PATCH /api/reports/[ticketId]` | ✅ | Admin resolves ticket | Admin (not user-facing) |
| `GET /api/admin/reports` | 📐 | Admin review queue — filter `status: open`, sort by `reportCount` desc | Admin panel (not yet built) |
| `GET /api/admin/reports?targetId=` | 📐 | All reports for one listing/user | Admin panel |
| `PATCH /api/admin/reports/[id]` | 📐 | Admin action: dismiss / remove listing (+warning) / suspend / ban account | Admin panel |
| `POST /api/reports/[id]/appeal` | 📐 | Seller appeals a removal decision | Seller notification "Appeal" button |
| `PATCH /api/admin/reports/[id]/appeal` | 📐 | Admin upholds/overturns an appeal — overturn restores listing + `$inc activeListingsCount` + notifies seller | Admin appeals queue |
| Auto-flag threshold (`reportCount >= 5`, server constant) | ⬜ | Automatically flags a listing/user for review | Backend logic, no UI |

Notes: the report **submission** side is already real — no gap there. The **admin/moderation** side (queue, actions, appeals) is an entirely separate, currently-nonexistent surface with no admin panel UI built at all — fully designed in [journeys/07-moderation.md](../journeys/07-moderation.md). Two small wiring TODOs remain on the existing real routes: pass `reporterId`/`reporterEmail` from a real session instead of `null` ([route.ts](../../../src/app/api/reports/route.ts#L120-L154)), and `ListingReportButton` should guard `setOpen(true)` behind an auth check once login exists.

---

## 11. Uploads (Images)

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `POST /api/upload` | ⬜ | Server issues a signed direct-upload URL (`{ uploadUrl, imageId }`) — client `PUT`s the file straight to Cloudflare Images, never through our server | Post-an-ad Step 5 (up to 10 images), profile avatar change, edit-listing add/remove image |
| Delete companion (route TBD) | ⬜ | Remove an image from Cloudflare when removed during edit | Edit-listing image removal |

Notes: this domain has no code or route today at all — it's referenced only inside the post-an-ad and manage-account journey docs as a dependency of those flows, not built or stubbed anywhere.

---

## 12. Notifications

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `GET /api/notifications` | ⬜ | In-app notification list (alert matches, moderation outcomes, appeal results) | Notifications bell/inbox (no dedicated screen built yet) |
| Insert-on-event (server-side only, no client endpoint) | ⬜ | Written by: alert-match job, moderation actions, appeal resolution | Backend logic |

Notes: entirely new domain, no model, no route, no dedicated screen — referenced as a dependency inside [journeys/02-search-and-find.md](../journeys/02-search-and-find.md) (alert match) and [journeys/07-moderation.md](../journeys/07-moderation.md) (moderation/appeal outcomes). Lowest-built-confidence domain in this whole inventory — needs its own design pass before building, not just a route.

---

## 13. Places / Geo

| Endpoint | Status | Purpose | Used by |
|---|---|---|---|
| `GET /api/places?input=` | 🧪 | Google Places Autocomplete proxy | `LocationSearch` (location picker) |
| `GET /api/geo` (proposed) | ⬜ | Server-side IP→country detection proxy | `CountryDetector` |

Notes: `/api/places` is **fully implemented** — just needs `GOOGLE_PLACES_API_KEY` in env and the mock call swapped for the already-written `realGoogleSearch()` in [LocationSearch.tsx](../../../src/components/location-picker/LocationSearch.tsx#L185-L188). By contrast, `CountryDetector.tsx` calls `ipinfo.io` **directly from the client** today — breaks this repo's own "never fetch external APIs from a component" rule; recommend wrapping as a server-side `/api/geo` route before production. ipinfo's free tier caps at 50k req/month.

---

## 14. Feedback

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `POST /api/feedback` | ⬜ | Submit in-app feedback | `FeedbackJourney` |

See [FeedbackJourney.tsx](../../../src/components/feedback/FeedbackJourney.tsx#L359-L425).

---

## 15. Payments / Donations

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| Payment intent/order creation (provider TBD — e.g. Stripe/Razorpay) | ⬜ | Create a payment session for a chosen amount + tier | `/snippets/donate` → `/snippets/donate/payment` |
| Payment status webhook/poll | ⬜ | Detect "payment completed" to auto-redirect (QR flow says "you'll be redirected automatically once payment is detected") | Donate payment page |
| `GET /api/donations` | ⬜ | Donation history list | `/donation-history` page (currently bare stub) |

Notes: entirely new domain, not previously in this inventory. The donate/payment snippet is UI-complete (`donationStore.ts` Zustand store drives `paymentTier`, `confirmPayment()`) but has **no real payment provider wired at all** — `confirmPayment()` is purely local state, there is no server call anywhere in this flow. This is a snippet/POC-only feature (`/snippets/donate`), not yet promoted to a real product route, so treat this as lower priority than the domains above unless donations become a committed feature.

---

## 16. Registration / Onboarding extras

| Endpoint (planned) | Status | Purpose | Used by |
|---|---|---|---|
| `POST /api/auth/onboarding-goal` | ⬜ | Record user's first-goal choice for personalisation | Register — First Goal step |
| `PATCH /api/auth/onboarding-skip` | ⬜ | Mark onboarding as skipped | Register — First Goal step |
| `POST /api/auth/social` | ⬜ | Handle social sign-in tokens server-side (may be superseded by the `/api/auth/callback/*` routes in domain 7 — reconcile naming) | Register — Join step |

---

## 17. Standalone OTP / Phone-Verification Components — no wiring found

| Component | Status | Notes |
|---|---|---|
| `components/email-otp/EmailOtpCard.tsx` | ⬜ | Fully built UI component, demoed only at `/design-system/uxcomp/email-otp` — not consumed by any real journey page (register's own OTP step, `VerifyEmailStep.tsx`, has its own separate inline OTP UI, not this component) |
| `components/phone-otp-v2/PhoneOtpCardV2.tsx` | ⬜ | Same situation — demoed only at `/design-system/uxcomp/phone-otp-v2`, not wired into any real page. Likely intended for a future "verify phone number" step (e.g. before revealing/using WhatsApp alerts, or the seller phone-reveal gate in domain 4) but no such flow has been designed yet |

Notes: flagging these separately because they look, at first glance, like part of the auth domain (7) but are **not currently used by any of the designed auth sequences** in [04-register-and-login.md](../journeys/04-register-and-login.md) — that journey's own verify-email step uses a bespoke inline `OtpInput` + `VALID_OTP` constant, not `EmailOtpCard`. Before wiring either of these to a real API, first decide which flow actually owns them (e.g. does phone verification become a real onboarding/security step, or are these dead design-system-only demos?).

---

## 18. Already real — no gap

| Domain | Routes | Notes |
|---|---|---|
| Report submission | `/api/reports` ×3 | See domain 10 |
| Places proxy | `/api/places` | See domain 13 |
| Profile handle check | `/api/profile/check-handle` | See domain 8 |
| Listings (category-only) | `/api/listings/[category]` | Superseded by unified search, domain 2a |
| Email engine | `lib/email/*` (Resend) | Only `provider.ts` knows about Resend — swap-friendly |
| Cron jobs | `/api/jobs/trigger` + `alert-*.job.ts` | ⚠️ must be disabled or VPN-gated before production |
| Good-to-know validation | `/api/good-to-know/validate` | Rate-limited, real |
| `lib/models/{Alert,Listing,JobRun}.ts` | Mongoose schemas | Real, already wired to the jobs above |

---

## 19. Stub-only screens with no committed API design yet

| Screen | Status | Notes |
|---|---|---|
| `/switch-country` | ⬜ | "Coming soon" — likely reuses existing country-config/cookie plumbing, no new API needed |
| `/donation-history` | ⬜ | See domain 15 |

---

## 20. SEO / Sitemap

| Endpoint (planned) | Status | Purpose |
|---|---|---|
| Dynamic listing enumeration for sitemaps | ⬜ | Once listings are DB-backed, `lib/seo/sitemap-country.ts` must enumerate real active listing ids instead of its current mock-derived set |

---

## Summary — by count

| Domain | Real (✅) | Designed, not built (📐) | Not built / not designed (⬜/🧪) |
|---|---|---|---|
| Categories | 0 | 0 | 1 |
| Listings — search/browse | 0 | 1 | 6 (incl. 1 🧪) |
| Listings — post/edit/CRUD | 0 | 5 | 1 |
| Listing detail | 0 | 1 | 4 |
| Seller/profile (incl. follows, reviews) | 0 | 3 | 3 |
| Chat | 0 | 8 | 1 |
| Alerts | 0 | 4 | 1 |
| Auth | 0 | 10 | 0 |
| Registration extras | 0 | 0 | 3 |
| Profile/account | 1 | 1 | 6 |
| Favourites | 0 | 4 | 0 |
| Report/moderation/admin | 3 | 5 | 1 |
| Uploads | 0 | 0 | 2 |
| Notifications | 0 | 0 | 2 |
| Places/geo | 1 | 0 | 1 |
| Feedback | 0 | 0 | 1 |
| Payments/donations | 0 | 0 | 3 |
| OTP components (unwired) | — | — | 2 (needs a decision, not just a build) |
| Email/jobs/good-to-know | 4 | 0 | 0 |
| Stub screens (no design yet) | 0 | 0 | 2 |
| SEO | 0 | 0 | 1 |
| **Total** | **9** | **42** | **~41** |

**Bottom line**: 9 real routes exist today. A much larger number (42) are already **fully designed** in the journey docs — request shapes, DB side-effects, and edge cases all decided — meaning the *design* work for post-an-ad, chat, alerts, favourites, and moderation is essentially done; what's missing is purely the route handlers + DB wiring, not product thinking. The remaining ~41 are genuinely undesigned (notifications, payments, uploads, admin panel UI, the two orphaned OTP components).

**Recommended build order**: (1) **Auth** first — it unblocks nearly every other domain, since alerts/favourites/chat/follows/reviews/profile all need a real `userId`. (2) **Uploads**, since post-an-ad and profile-avatar both depend on it. (3) **Listings CRUD** (post-an-ad + my-ads), the most fully-designed domain after auth. (4) **Favourites** and **Alerts**, both small and already have partial backend groundwork (Alert model + jobs). (5) **Chat**, the largest remaining domain. (6) **Follows/Reviews/Notifications/Moderation-admin/Payments**, all lower-traffic or lower-priority for a POC.

# Database Relationships, Indexes & Query Patterns

> How the 14 collections relate, how they are queried, and why each design decision was made.  
> Read `01-schema.md` first — this file assumes you know the collection shapes.  
> Last updated: 2026-07-07

---

## Collection Relationships

```
users ──────────────────────────────────────────────────────────────────┐
  │                                                                      │
  │  sellerId                     buyerId / sellerId                     │
  ▼                                    ▼                                 │
listings                         conversations ──► messages              │
  │                                    │                                 │
  │  listingId                         │  (listingSnapshot embedded)    │
  ▼                                    │                                 │
favourites ◄─────────────────────────┘                                  │
  │                                                                      │
  │  userId                                                              │
  └──────────────────────────────────────────────────────────────────── ┘

users ──► saved_alerts
users ──► notifications
users ──► ad_reports (reporterId — nullable for guests)
users ──► follows (followerId + followeeId)
users ──► reviews (reviewerId writes about sellerId)
users ──► review_votes (userId + reviewId)
listings ──► ad_reports (adId)
listings ──► reviews (listingId — optional transaction context)
otp_tokens (keyed by email — no ObjectId ref)
magic_link_tokens (keyed by email — no ObjectId ref)
counters (standalone — no foreign key refs, keyed by sequence name)
```

---

## Reference vs Embed — Decision Table

| Field | Pattern | Why |
|---|---|---|
| `listing.sellerId` | Reference (ObjectId) | User data changes (avatar, tagline) — reference keeps listing data clean |
| `listing.sellerSnapshot` | Embedded snapshot | Detail page needs seller info without a second query at render time |
| `conversation.listingSnapshot` | Embedded snapshot | Listing may be deleted/expired — chat must still show what it was about |
| `conversation.lastMessage` | Embedded snapshot | Inbox renders 20 threads — no `messages` join needed |
| `conversation.unreadCount` | Embedded Map | Incremented on every message write — co-locating avoids a separate counter collection |
| `favourite.listingSnapshot` | Embedded snapshot | Favourites page renders without a `listings` join — listing may be deleted |
| `notification.metadata` | Embedded Mixed | Small contextual payload — different shape per notification type |

**Rule:** Embed when the data is small, read together always, and doesn't need independent querying.  
**Rule:** Reference when the data changes independently or is queried standalone.

---

## Core Query Patterns

### 1. Browse listings (search page)
```ts
// Country + category + status + geo sort
db.listings.find({
  countryCode: "in",
  categoryId: "property",
  subcategoryId: "to_rent",
  status: "active",
  "attributes.beds": { $gte: 2 },
  coordinates: {
    $near: {
      $geometry: { type: "Point", coordinates: [77.6245, 12.9352] },
      $maxDistance: 5000  // 5km in metres
    }
  }
})
.sort({ publishedAt: -1 })
.skip(offset).limit(20)

// Indexes used: countryCode + status + categoryId, coordinates (2dsphere)
```

### 2. Listing detail page
```ts
// Single document — sellerSnapshot already embedded, no join needed
db.listings.findOne({ slug: "3-bed-flat-zone-2-canary-wharf", status: { $ne: "deleted" } })

// Then check if current user has favourited it
db.favourites.findOne({ userId: currentUserId, listingId: listingId })
```

### 3. Seller's own listings (My Ads dashboard)
```ts
db.listings.find({ sellerId: currentUserId, status: { $nin: ["deleted"] } })
  .sort({ createdAt: -1 })

// Index used: sellerId + status
```

### 4. User inbox (Chat)
```ts
// All conversation threads for a user — newest first
db.conversations.find({
  participants: currentUserId,
  status: { $ne: "blocked" }
})
.sort({ updatedAt: -1 })
.limit(20)
// lastMessage and unreadCount already embedded — no messages join

// Index used: participants + updatedAt desc
```

### 5. Load a conversation thread
```ts
// Paginated messages — oldest first, 30 per page
db.messages.find({ conversationId: conversationId })
  .sort({ sentAt: 1 })
  .skip(page * 30).limit(30)

// Index used: conversationId + sentAt asc
```

### 6. Unread notification count (bell icon)
```ts
db.notifications.countDocuments({ userId: currentUserId, read: false })

// Index used: userId + read + createdAt desc
```

### 7. Favourites list
```ts
db.favourites.find({ userId: currentUserId })
  .sort({ savedAt: -1 })
// listingSnapshot already embedded — no listings join

// Index used: userId + savedAt desc
```

### 8. Seller analytics — "47 people saved your listing"
```ts
db.favourites.countDocuments({ listingId: listingId })

// Index used: listingId
```

### 9. Alert matching (background job — runs every 15 min)
```ts
// Step 1: find listings posted since last check
const newListings = await db.listings.find({
  status: "active",
  createdAt: { $gt: lastRunAt }
})

// Step 2: for each new listing, find potentially matching alerts
const alerts = await db.saved_alerts.find({
  active: true,
  countryCode: listing.countryCode,
  categoryId: listing.categoryId,
})

// Step 3: match in code (keywords, location radius, attributes)
// Step 4: notify matched users (email / whatsapp / in-app notification)
// Step 5: advance lastCheckedAt on each processed alert
```

### 10. Report admin queue
```ts
db.ad_reports.find({ status: "pending" })
  .sort({ priority: -1, createdAt: 1 })  // high priority first, oldest first
  .limit(50)

// Index used: status + createdAt desc (already in model.ts)
```

### 11. Follows — people I follow / my followers
```ts
// People this user follows
db.follows.find({ followerId: currentUserId })
  .sort({ createdAt: -1 })
// Use returned followeeIds to fetch user profiles

// This user's followers
db.follows.find({ followeeId: currentUserId })
  .sort({ createdAt: -1 })

// Check if current user follows a specific user
db.follows.findOne({ followerId: currentUserId, followeeId: targetUserId })
// null = not following, document = following

// Indexes used: followerId + createdAt desc, followeeId + createdAt desc
```

### 12. Seller reviews (public profile tab)
```ts
// All published reviews for a seller — newest first
db.reviews.find({ sellerId: sellerId, status: "published" })
  .sort({ createdAt: -1 })
  .skip(offset).limit(10)

// Average rating is already cached on users.averageRating
// No aggregation needed for the seller card

// Check if current user already reviewed this seller
db.reviews.findOne({ reviewerId: currentUserId, sellerId: sellerId })

// Index used: sellerId + status + createdAt desc
```

### 13. Listing view count (increment on each detail page visit)
```ts
// Atomic increment — no transaction needed (single document, single field)
await db.listings.updateOne(
  { _id: listingId },
  { $inc: { viewCount: 1 } }
)
// No deduplication in V1 — same user can increment multiple times
// Deduplication (track viewerId per listing) is a future analytics feature
```

### 14. Keyword text search (search bar)
```ts
// Requires Atlas Search index on listings collection (see Developer Setup Checklist)
// Atlas Search handles partial match, typos, relevance ranking
db.listings.aggregate([
  {
    $search: {
      index: "listings_search",
      text: {
        query: "honda city",
        path: ["title", "description"],
        fuzzy: { maxEdits: 1 }  // typo tolerance
      }
    }
  },
  { $match: { countryCode: "in", status: "active" } },
  { $sort: { score: { $meta: "searchScore" }, publishedAt: -1 } },
  { $skip: offset },
  { $limit: 20 }
])
// Combined with geo filter: add coordinates $near to $match stage
```

### 15. Listing expiry background job (runs daily)
```ts
// Find all active listings past their expiresAt date
const expiredListings = await db.listings.find({
  status: "active",
  expiresAt: { $lt: new Date() }
})

// Bulk update to expired status
await db.listings.updateMany(
  { status: "active", expiresAt: { $lt: new Date() } },
  { $set: { status: "expired" } }
)

// For each expired listing: decrement seller activeListingsCount + send notification
// Index used: status + expiresAt
```

---

## Index Master List

> All indexes across all collections. Apply these in order when setting up the database.

### `users`
```js
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ provider: 1, providerId: 1 }, { unique: true, sparse: true })
db.users.createIndex({ status: 1 })
db.users.createIndex({ homeCountry: 1 })
db.users.createIndex({ phone: 1 }, { sparse: true })
```

### `listings`
```js
db.listings.createIndex({ advId: 1 }, { unique: true })
db.listings.createIndex({ countryCode: 1, slug: 1 }, { unique: true })
db.listings.createIndex({ sellerId: 1, status: 1 })
db.listings.createIndex({ countryCode: 1, status: 1, categoryId: 1 })
db.listings.createIndex({ countryCode: 1, status: 1, categoryId: 1, subcategoryId: 1 })
db.listings.createIndex({ countryCode: 1, status: 1, price: 1 })  // sort by price
db.listings.createIndex({ coordinates: '2dsphere' })
db.listings.createIndex({ status: 1, expiresAt: 1 })
db.listings.createIndex({ status: 1, createdAt: -1 })
```

### `conversations`
```js
db.conversations.createIndex({ participants: 1, updatedAt: -1 })
db.conversations.createIndex({ listingId: 1, buyerId: 1 }, { unique: true })
db.conversations.createIndex({ sellerId: 1, status: 1 })
db.conversations.createIndex({ buyerId: 1, status: 1 })
```

### `messages`
```js
db.messages.createIndex({ conversationId: 1, sentAt: 1 })
db.messages.createIndex({ senderId: 1 })
```

### `favourites`
```js
db.favourites.createIndex({ userId: 1, listingId: 1 }, { unique: true })
db.favourites.createIndex({ userId: 1, savedAt: -1 })
db.favourites.createIndex({ listingId: 1 })
```

### `saved_alerts`
```js
db.saved_alerts.createIndex({ userId: 1 })
db.saved_alerts.createIndex({ active: 1, countryCode: 1, categoryId: 1 })
db.saved_alerts.createIndex({ lastCheckedAt: 1 })
```

### `notifications`
```js
db.notifications.createIndex({ userId: 1, read: 1, createdAt: -1 })
db.notifications.createIndex({ userId: 1, createdAt: -1 })
db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 })  // 90 days TTL
```

### `follows`
```js
db.follows.createIndex({ followerId: 1, followeeId: 1 }, { unique: true })
db.follows.createIndex({ followerId: 1, createdAt: -1 })
db.follows.createIndex({ followeeId: 1, createdAt: -1 })
```

### `reviews`
```js
db.reviews.createIndex({ sellerId: 1, status: 1, createdAt: -1 })
db.reviews.createIndex({ reviewerId: 1, sellerId: 1 }, { unique: true })
db.reviews.createIndex({ listingId: 1 })
```

### `review_votes`
```js
db.review_votes.createIndex({ userId: 1, reviewId: 1 }, { unique: true })
db.review_votes.createIndex({ reviewId: 1 })
```

### `counters`
```js
// _id is the sequence name — default MongoDB _id index covers this
// No additional indexes needed
```

### `ad_reports`
```js
// Already in model.ts — included here for completeness
db.ad_reports.createIndex({ ticketId: 1 }, { unique: true })
db.ad_reports.createIndex({ adId: 1 })
db.ad_reports.createIndex({ reporterId: 1 })
db.ad_reports.createIndex({ status: 1, createdAt: -1 })
db.ad_reports.createIndex({ reporterId: 1, adId: 1, status: 1 })
```

### `otp_tokens`
```js
db.otp_tokens.createIndex({ email: 1, used: 1, expiresAt: 1 })
db.otp_tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })  // TTL auto-delete
```

### `magic_link_tokens`
```js
db.magic_link_tokens.createIndex({ tokenHash: 1 }, { unique: true })
db.magic_link_tokens.createIndex({ email: 1, used: 1 })
db.magic_link_tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })  // TTL auto-delete
```

---

## Denormalisation Strategy

All denormalised fields below are written to multiple places for read performance. Every time the source changes, the snapshot must be updated.

| Snapshot | Lives in | Source | When to update snapshot |
|---|---|---|---|
| `sellerSnapshot` | `listings` | `users` | When user updates name, avatar, tagline, verified status |
| `listingSnapshot` | `conversations` | `listings` | **Never** — frozen at conversation start intentionally |
| `listingSnapshot` | `favourites` | `listings` | When listing title, price, **or status** changes |
| `lastMessage` | `conversations` | `messages` | Every time a new message is inserted |
| `averageRating` + `reviewCount` | `users` | `reviews` | On every review create or delete |
| `activeListingsCount` | `users` | `listings` | On every listing status change that crosses active ↔ non-active |
| `helpfulVotes` + `unhelpfulVotes` | `reviews` | `review_votes` | On every vote cast or changed |
| `reviewerSnapshot` | `reviews` | `users` | **Never** — frozen at review write time. Historical reviews display exactly as written |

**Update strategy for `sellerSnapshot`:**
```ts
// When user updates profile — update all their active listings
await db.listings.updateMany(
  { sellerId: userId, status: { $nin: ["deleted"] } },
  { $set: {
    "sellerSnapshot.name": newName,
    "sellerSnapshot.avatar": newAvatar,
    "sellerSnapshot.tagline": newTagline,
    "sellerSnapshot.verified": newVerified,
  }}
)
```

**Update strategy for `favourites.listingSnapshot.status`:**
```ts
// When a listing status changes — update all favourites snapshots for that listing
await db.favourites.updateMany(
  { listingId: listingId },
  { $set: { "listingSnapshot.status": newStatus } }
)
// Also update price/title if they change (e.g. seller edits the listing)
await db.favourites.updateMany(
  { listingId: listingId },
  { $set: {
    "listingSnapshot.priceLabel": newPriceLabel,
    "listingSnapshot.title": newTitle,
  }}
)
```

**Update strategy for `users.activeListingsCount`:**
```ts
// Increment when a listing becomes active (published or renewed)
await db.users.updateOne({ _id: sellerId }, { $inc: { activeListingsCount: 1 } })

// Decrement when a listing leaves active state (expired, closed, blocked, deleted)
await db.users.updateOne(
  { _id: sellerId, activeListingsCount: { $gt: 0 } },  // guard: never go below 0
  { $inc: { activeListingsCount: -1 } }
)
```

**Update strategy for `averageRating` + `reviewCount`:**
```ts
// On review create — increment count, recalculate average atomically
const result = await db.users.findOneAndUpdate(
  { _id: sellerId },
  { $inc: { reviewCount: 1 } },
  { returnDocument: "after" }
);
// Recalculate average from the new count + previous sum
// Alternatively: run aggregation to recalculate (simpler, acceptable for V1)
await db.users.updateOne(
  { _id: sellerId },
  { $set: { averageRating: newAverage } }
);
```

**Update strategy for `lastMessage` + `unreadCount`:**
```ts
// On every new message insert — run atomically with the message write
await db.conversations.updateOne(
  { _id: conversationId },
  {
    $set: { lastMessage: { text, senderId, sentAt, type }, updatedAt: new Date() },
    $inc: { [`unreadCount.${recipientId}`]: 1 }
  }
)
```

---

## Soft Delete Behaviour

| Collection | How deleted | What remains visible |
|---|---|---|
| `users` | `status: "deleted"`, `deletedAt: now()` | Nothing — all queries filter `status != deleted` |
| `listings` | `status: "deleted"` | Nothing in search · ad_reports still reference `adId` for audit |
| `messages` | `deletedAt: now()` | Message slot remains — "This message was deleted" shown in UI |
| `conversations` | Never deleted | Archived instead (`status: "archived"`) |
| `notifications` | TTL auto-expire after 90 days | N/A |
| `otp_tokens` | TTL auto-expire, `used: true` on consume | N/A |
| `magic_link_tokens` | TTL auto-expire, `used: true` on consume | N/A |

---

## Atomic Operations — Critical Paths

These operations must be atomic to prevent race conditions.

### Save a listing (favourite)
```ts
// Insert favourite doc + increment listing.favouriteCount in one session
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Favourite.create([{ userId, listingId, ... }], { session });
  await Listing.updateOne({ _id: listingId }, { $inc: { favouriteCount: 1 } }, { session });
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
  throw e;
}
```

### Send a message
```ts
// Insert message + update conversation.lastMessage + increment unreadCount atomically
// Use two awaits in order (both on same session) — not parallel
const msg = await Message.create([{ conversationId, senderId, text, type, sentAt }], { session });
await Conversation.updateOne(
  { _id: conversationId },
  {
    $set: { lastMessage: { text, senderId, sentAt: msg.sentAt, type }, updatedAt: new Date() },
    $inc: { [`unreadCount.${recipientId}`]: 1 }
  },
  { session }
);
```

### Follow a user (follow + notify atomically)
```ts
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Follow.create([{ followerId, followeeId }], { session });
  await User.updateOne({ _id: followeeId }, { $inc: { followersCount: 1 } }, { session });
  await User.updateOne({ _id: followerId }, { $inc: { followingCount: 1 } }, { session });
  await Notification.create([{
    userId: followeeId,
    type: "new_follower",
    title: "New follower",
    body: `${followerName} started following you`,
    link: `/profile/${followerId}`,
    read: false,
    metadata: { followerId },
  }], { session });
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
  throw e;
}
```

### Change a review vote (up → down or down → up)
```ts
// Upsert the vote document
const prev = await ReviewVote.findOneAndUpdate(
  { userId, reviewId },
  { $set: { vote: newVote } },
  { upsert: true, returnDocument: "before" }
);

if (!prev) {
  // New vote — simply increment the target counter
  const field = newVote === "up" ? "helpfulVotes" : "unhelpfulVotes";
  await Review.updateOne({ _id: reviewId }, { $inc: { [field]: 1 } });
} else if (prev.vote !== newVote) {
  // Changed vote — decrement old, increment new
  const dec = prev.vote === "up" ? "helpfulVotes" : "unhelpfulVotes";
  const inc = newVote  === "up" ? "helpfulVotes" : "unhelpfulVotes";
  await Review.updateOne({ _id: reviewId }, { $inc: { [dec]: -1, [inc]: 1 } });
  // else: same vote re-submitted — no-op
}
```

### Mark all messages as read (open conversation)
```ts
// When user opens a conversation:
// 1. Mark all unread messages in thread as read
// 2. Reset their unreadCount on the conversation to 0
const now = new Date();
await Message.updateMany(
  { conversationId, readAt: null, senderId: { $ne: currentUserId } },
  { $set: { readAt: now } }
);
await Conversation.updateOne(
  { _id: conversationId },
  { $set: { [`unreadCount.${currentUserId}`]: 0 } }
);
// Note: two separate operations is acceptable here — slight race is cosmetic (unread badge)
// Use a transaction if strict consistency is required
```

### Verify OTP (consume token)
```ts
// Mark used + activate user atomically — prevents double-use race condition
const session = await mongoose.startSession();
session.startTransaction();
const token = await OtpToken.findOneAndUpdate(
  { email, tokenHash, used: false, expiresAt: { $gt: new Date() } },
  { $set: { used: true } },
  { session, new: true }
);
if (!token) throw new Error("INVALID_OTP");
await User.updateOne({ email }, { $set: { status: "active" } }, { session });
await session.commitTransaction();
```

---

## Orphan Strategy — When a User is Soft-Deleted

When `users.status` is set to `"deleted"`, the user record is kept for audit. Here is what happens to every related collection:

| Collection | Action on user delete | Why |
|---|---|---|
| `listings` | Set `status: "deleted"` on all their listings | Removes from public search; ad_reports still reference adId for audit |
| `conversations` | Keep as-is | Buyer / seller message history must be preserved |
| `messages` | Keep as-is | Legal and dispute resolution |
| `favourites` | Delete all favourites by this user | No longer meaningful; also clears `favouriteCount` on listings |
| `follows` (as follower) | Delete all follow docs where `followerId = userId` | Decrement `followingCount` on the deleted user and `followersCount` on each followee |
| `follows` (as followee) | Keep — or delete silently | Followers lose nothing meaningful; `followersCount` on deleted user is irrelevant |
| `saved_alerts` | Set `active: false` on all their alerts | Stop the background job notifying a deleted account |
| `notifications` | Delete all their notifications | No longer has an inbox to view |
| `reviews` (as reviewer) | Keep — `reviewerId` stays in record for audit | Display as "Deleted User" in UI |
| `reviews` (as seller) | Keep — historical record | Display as "Deleted User" in UI |
| `otp_tokens` / `magic_link_tokens` | TTL auto-clears; no action needed | Short-lived, will expire naturally |

**Implementation:** All orphan cleanup runs in the same transaction as setting `users.status = "deleted"` to ensure consistency.

---

## Multi-Country Architecture

LokalAds operates in 3 markets: **India (in) · United Kingdom (gb) · Singapore (sg)**

### Where country lives

| Layer | Field | What it means |
|---|---|---|
| `users.homeCountry` | DB field | The market where the account was created — never changes |
| `listings.countryCode` | DB field | The market this listing belongs to — set at post time |
| `saved_alerts.countryCode` | DB field | The market the user wants alerts for |
| Active browsing country | Cookie (`countryContext`) | The market the user is currently browsing — runtime only, NOT stored in DB |

### Key rule — browsing country is NOT in the DB

When a user switches country via `/switch-country`, only the `countryContext` cookie is updated. No DB write happens. This is by design — it's a session/browsing preference, not account data.

```
User registered in India (homeCountry: "in")
  → Switches to UK via /switch-country
  → Cookie: countryContext = "gb"
  → Posts a listing → listing.countryCode = "gb"  ← correct
  → Saved alerts for UK → saved_alerts.countryCode = "gb"  ← correct
  → User.homeCountry stays "in"  ← never changes
```

### Country-specific categories

Each country has its own `enabledCategories` list defined in `config/countries/`. This is **not stored in the DB** — it's a config-level filter applied at the API layer before saving or querying listings. A listing's `categoryId` must be in the active country's `enabledCategories` — validated server-side.

### Currency

Every listing stores its own `currency` (ISO 4217: `INR` | `GBP` | `SGD`) and `price` (numeric). This allows a user to favourite a GBP listing and an INR listing side by side without any conversion logic in the DB.

### Geolocation units

`radiusUnit` (`km` vs `mi`) is a country config setting — GB uses `mi`, IN and SG use `km`. The DB always stores `coordinates` as GeoJSON with `$maxDistance` in **metres** regardless of unit. The conversion from km/mi to metres happens at the API layer before the query.

---

## Developer Setup Checklist

```
[ ] Create MongoDB Atlas cluster (M10+ for production · M0 Atlas free tier for dev)
    ⚠️  Transactions require a replica set. Atlas M0 supports them. Local standalone mongod does NOT.
        If running MongoDB locally: mongod --replSet rs0  (then rs.initiate() once in mongosh)
[ ] Set MONGODB_URI in .env.local
[ ] Run index creation script (copy Index Master List above)
[ ] Verify TTL indexes on otp_tokens, magic_link_tokens, notifications
[ ] Verify 2dsphere index on listings.coordinates
[ ] Verify unique indexes: users.email, listings.advId, listings.(countryCode+slug), favourites.(userId+listingId), review_votes.(userId+reviewId)
[ ] Create `counters` collection + seed { _id: "advId", seq: 10000 } for advId generation
[ ] Enable MongoDB Atlas Search on listings collection — create index named "listings_search" on fields: title, description
[ ] Set up Atlas scheduled trigger for saved_alerts background job (every 15 min)
[ ] Set up Atlas scheduled trigger for listings expiry job (daily)
[ ] Set up rate limiting store — use Upstash Redis (NOT MongoDB) for auth rate limiting (/api/auth/* routes)
[x] Fix config/countries/uk.ts → rename to gb.ts and change isoCode to "GB", countryCode to "gb" throughout — done 2026-07-13, see `config/countries/gb.ts`
[ ] Verify termsAcceptedAt is populated for all users during registration (email + OAuth complete-profile)
```

---

## Production Operations

### Environment Separation

Three separate MongoDB Atlas clusters — three separate `MONGODB_URI` values in environment config.
Never share a cluster across environments.

| Environment | Atlas tier | `.env` file | Purpose |
|---|---|---|---|
| Local dev | M0 Free (or `mongod --replSet rs0`) | `.env.local` | Individual developer machines |
| Staging | M10 (dedicated, same region as prod) | Injected by CI/CD | Pre-production testing |
| Production | M10+ (M30 recommended under load) | Injected by deployment platform | Live traffic |

### Atlas Cluster Security (do before first deploy)

```
[ ] IP Access List — never use 0.0.0.0/0 in production
    Add only: Vercel egress IPs (or use Atlas Private Endpoint / VPC peering)
    Add dev machine IPs explicitly
[ ] Database users — least-privilege roles
    App user:   readWrite on the app database only — never Atlas Admin
    Admin user: Atlas Admin — used only in mongosh for maintenance, never in app code
[ ] Enable Atlas Auditing (M10+) — log all auth events and DDL operations
[ ] Enable Atlas Alerts — disk usage >75%, connections >80% of limit, replication lag >10s
[ ] TLS 1.2+ enforced — Atlas default; verify connection string uses tls=true
```

### Backups and Recovery

```
[ ] Enable Atlas Cloud Backups (M10+)
    Snapshot schedule: daily (retain 7 days) · weekly (retain 4 weeks) · monthly (retain 12 months)
[ ] Enable Point-in-Time Recovery (PITR) — minimum 24h window, 72h recommended
[ ] Document restore procedure:
    Atlas UI → Clusters → Backup → Restore → select snapshot or PITR timestamp
    Test a restore to staging at least once before go-live
[ ] M0 free tier has NO backups — never use M0 in production
```

### Schema Migration Strategy

MongoDB has no `ALTER TABLE`. Schema changes on live collections follow this pattern:

**Rule: always additive first, never destructive.**

```
Step 1 — Deploy code that reads BOTH old and new field shape (backward-compatible read)
Step 2 — Run a migration script that backfills / renames the field on all documents
         Example: db.users.updateMany({ newField: { $exists: false } }, { $set: { newField: defaultValue } })
Step 3 — Verify 100% of documents have the new shape (count check)
Step 4 — Deploy code that only reads the new field shape
Step 5 — (Optional) Drop the old field in a follow-up deployment
```

For large collections (>100k docs), run the migration in batches to avoid locking:
```ts
// Batch backfill — safe on live data
let processed = 0;
while (true) {
  const result = await db.collection.updateMany(
    { newField: { $exists: false } },
    { $set: { newField: defaultValue } },
    { limit: 1000 }  // MongoDB does not support limit on updateMany — use find+bulkWrite
  );
  processed += result.modifiedCount;
  if (result.modifiedCount === 0) break;
  await new Promise(r => setTimeout(r, 100)); // brief pause between batches
}
```

### GDPR — Data Export (Right to Portability)

Right to erasure (soft delete cascade) is covered by the Orphan Strategy section.
Right to export must also be implemented:

```
[ ] Implement GET /api/users/me/export  (authenticated, rate-limited to 1 request per 24h)
    Collects and returns a JSON bundle of all data the user owns:
    — users document (excluding passwordHash, sessionVersion)
    — all their listings
    — all their sent messages
    — all their reviews written
    — all their saved alerts
    — all their favourites (listingIds only)
    Bundle is served as a file download: Content-Disposition: attachment; filename="my-data.json"
[ ] Log the export request in an audit trail (userId + timestamp)
[ ] Document the data retention policy (how long after deletion data is truly purged)
    Recommended: hard-delete after 90 days if status=deleted and no open disputes
```

---

## Implementation Task List

> Ordered by dependency — complete each phase before starting the next.  
> Each task maps directly to a collection in `01-schema.md`.

### Phase 1 — Foundation (do this first, everything depends on it)

```
[ ] 1.1  lib/db.ts — verify Mongoose singleton works, MONGODB_URI connected
[ ] 1.2  Create Mongoose model: users  (lib/models/user.ts)
[ ] 1.3  Create Mongoose model: counters  (lib/models/counter.ts)
[ ] 1.4  Implement advId generator utility using counters collection
[ ] 1.5  ~~Fix config/countries/uk.ts → gb.ts~~ — already done (isoCode "GB", countryCode "gb"), see `config/countries/gb.ts`
[ ] 1.6  Set up transactional email provider (Resend / SES / SendGrid) — create lib/email.ts
         — sendOtp(email, code) · sendMagicLink(email, url) · sendPasswordReset(email, url)
         — ⚠️ every auth email flow in Phase 2 depends on this — do not skip
```

### Phase 2 — Authentication

```
[ ] 2.1  Create Mongoose model: otp_tokens  (lib/models/otp-token.ts)
[ ] 2.2  Create Mongoose model: magic_link_tokens  (lib/models/magic-link-token.ts)
[ ] 2.3  Implement POST /api/auth/register
         — validate input · age gate (dob server-side) · bcrypt password · insert user (status: unverified)
         — generate OTP · hash SHA-256 · store in otp_tokens · send email
[ ] 2.4  Implement POST /api/auth/send-email-otp  (resend flow)
[ ] 2.5  Implement POST /api/auth/verify-email-otp
         — findOneAndUpdate (used: true) + User status: active — ATOMIC (session)
         — set termsAcceptedAt · create session cookie · set lastLoginAt
         — on wrong code: $inc attempts · return INVALID_OTP
         — when attempts >= 3: reject with ATTEMPTS_EXCEEDED (token must be re-issued)
[ ] 2.6  Implement GET /api/auth/callback/google + /apple  (OAuth)
         — verify token · upsert user · redirect to /register/complete or /
[ ] 2.7  Implement POST /api/auth/complete-profile  (OAuth DOB + terms)
         — age gate · set termsAcceptedAt · status: active · upgrade session
[ ] 2.8  Implement POST /api/auth/magic-link  (send link)
[ ] 2.9  Implement GET /api/auth/verify-magic  (consume link)
         — set users.lastLoginAt · create session cookie on success
[ ] 2.10 Implement lib/session.ts  (full JWT sign/verify + HttpOnly cookie)
[ ] 2.11 Implement POST /api/auth/logout  (clear cookie)
[ ] 2.12 Wire getSession() into app/layout.tsx  (pass user to AppHeader)
[ ] 2.13 Implement POST /api/auth/forgot-password
         — validate email exists (always return 200 — do not reveal if email is unregistered)
         — generate 64-char hex token · hash SHA-256
         — store in magic_link_tokens with purpose: "reset" · send reset email via lib/email.ts
[ ] 2.14 Implement POST /api/auth/reset-password
         — validate tokenHash + purpose: "reset" + used: false + expiresAt > now
         — bcrypt new password · update users.passwordHash · mark token used — ATOMIC (session)
         — invalidate existing sessions (rotate sessionVersion field or clear cookie)
```

### Phase 3 — Listings

```
[ ] 3.1  Create Mongoose model: listings  (lib/models/listing.ts)
[ ] 3.2  Implement POST /api/upload  (Cloudflare Images — direct creator upload)
         — server requests a signed upload URL from Cloudflare Images API (server-side fetch)
         — return { uploadUrl, imageId } to client · client POSTs image directly to Cloudflare
         — never proxy binary image data through the Next.js server
         — on success client sends back imageId → server builds delivery URL and stores in listing
[ ] 3.3  Implement POST /api/listings
         — validate categoryId against config/countries enabledCategories
         — generate advId + slug (slugify title; on duplicate key error append first 6 chars of _id)
         — embed sellerSnapshot · set expiresAt
[ ] 3.4  Implement GET /api/listings  (browse + filter + geo)
         — countryCode + categoryId + subcategoryId + attributes filters
         — $near geo query · price sort · pagination
[ ] 3.5  Implement GET /api/listings/[slug]  (detail page)
[ ] 3.6  Implement PUT /api/listings/[id]  (seller edits)
         — update sellerSnapshot on all their listings if profile fields changed
         — update favourites.listingSnapshot if title/price/status changed
[ ] 3.7  Implement PATCH /api/listings/[id]/status  (seller: off-market, close, renew)
         — update users.activeListingsCount on status change
[ ] 3.8  Implement listings expiry background job
         — status: active + expiresAt < now → status: expired
         — decrement users.activeListingsCount · create notification
[ ] 3.9  Set up Atlas Search index "listings_search" on title + description
[ ] 3.10 Replace mock data calls in app/(main)/listings/ with real API calls
```

### Phase 4 — User Profile

```
[ ] 4.1  Implement GET /api/users/[id]  (public profile — never expose passwordHash/dob/email)
[ ] 4.2  Implement PUT /api/users/me  (update own profile)
         — update sellerSnapshot on all their listings atomically
[ ] 4.3  Implement GET /api/users/me  (own account details for dashboard)
[ ] 4.4  Implement DELETE /api/users/me  (soft delete)
         — run full orphan cascade (see Orphan Strategy section)
```

### Phase 5 — Favourites

```
[ ] 5.1  Create Mongoose model: favourites  (lib/models/favourite.ts)
[ ] 5.2  Implement POST /api/favourites  (save listing)
         — insert favourite + $inc listing.favouriteCount — ATOMIC (session)
[ ] 5.3  Implement DELETE /api/favourites/[listingId]  (unsave)
         — delete doc + $dec listing.favouriteCount — ATOMIC (session)
[ ] 5.4  Implement GET /api/favourites  (user's saved listings)
[ ] 5.5  Wire useFavouritesStore.syncFromServer() on login
```

### Phase 6 — Chat

```
[ ] 6.1  Create Mongoose model: conversations  (lib/models/conversation.ts)
[ ] 6.2  Create Mongoose model: messages  (lib/models/message.ts)
[ ] 6.3  Implement POST /api/conversations  (start chat about a listing)
         — upsert on (listingId + buyerId) · embed listingSnapshot
[ ] 6.4  Implement GET /api/conversations  (inbox)
[ ] 6.5  Implement GET /api/conversations/[id]/messages  (paginated thread)
[ ] 6.6  Implement POST /api/conversations/[id]/messages  (send message)
         — insert message + update lastMessage + $inc unreadCount — ATOMIC
[ ] 6.7  Implement POST /api/conversations/[id]/read  (mark as read)
         — updateMany messages.readAt + $set unreadCount[userId]=0
[ ] 6.8  Implement POST /api/conversations/[id]/block
```

### Phase 7 — Alerts

```
[ ] 7.1  Create Mongoose model: saved_alerts  (lib/models/saved-alert.ts)
[ ] 7.2  Implement POST /api/alerts  (save a search as alert)
[ ] 7.3  Implement GET /api/alerts  (user's alert list)
[ ] 7.4  Implement PATCH /api/alerts/[id]  (pause/resume/edit)
[ ] 7.5  Implement DELETE /api/alerts/[id]
[ ] 7.6  Implement background job: alert matching
         — fetch new listings since lastCheckedAt · match in code · notify
         — Set up Atlas scheduled trigger (every 15 min)
```

### Phase 8 — Notifications

```
[ ] 8.1  Create Mongoose model: notifications  (lib/models/notification.ts)
[ ] 8.2  Create createNotification() utility  (lib/notifications.ts)
         — called internally by other API routes (follow, message, listing status change, alert match)
[ ] 8.3  Implement GET /api/notifications  (panel list)
[ ] 8.4  Implement PATCH /api/notifications/read  (mark all read)
[ ] 8.5  Implement GET /api/notifications/unread-count  (bell icon)
[ ] 8.6  Wire TTL index on createdAt (90 days auto-delete)
```

### Phase 9 — Follows

```
[ ] 9.1  Create Mongoose model: follows  (lib/models/follow.ts)
[ ] 9.2  Implement POST /api/follows/[userId]  (follow)
         — insert follow + update counts + insert notification — ATOMIC
[ ] 9.3  Implement DELETE /api/follows/[userId]  (unfollow)
         — delete follow + decrement counts — ATOMIC
[ ] 9.4  Implement GET /api/users/[id]/followers
[ ] 9.5  Implement GET /api/users/[id]/following
```

### Phase 10 — Reviews

```
[ ] 10.1 Create Mongoose model: reviews  (lib/models/review.ts)
[ ] 10.2 Create Mongoose model: review_votes  (lib/models/review-vote.ts)
[ ] 10.3 Implement POST /api/reviews  (write a review)
         — update users.averageRating + reviewCount — ATOMIC
[ ] 10.4 Implement GET /api/users/[id]/reviews  (seller's review list)
[ ] 10.5 Implement POST /api/reviews/[id]/vote  (helpful / not helpful)
         — upsert vote + update helpfulVotes/unhelpfulVotes
[ ] 10.6 Implement DELETE /api/reviews/[id]  (admin remove)
```

### Phase 11 — Reports (already partially built)

```
[ ] 11.1 Wire reporterId from real session (currently hardcoded null)
[ ] 11.2 Wire sellerId from listing context into POST /api/reports
[ ] 11.3 Add admin auth guard to PATCH /api/reports/[ticketId]
[ ] 11.4 Replace in-memory rate limiter with Upstash Redis
[ ] 11.5 Wire ReportAdJourney onSubmit to POST /api/reports in the UI
```

---

## How to Complete Safely

### 1 — Never break the POC while building the real API

The POC currently uses mock data (`lib/mock/`). Keep it working throughout. The rule:

> **API routes are additive.** Build `/api/listings`, `/api/auth/*` etc. alongside the mock data. Only swap a page's data source once the API route is tested and working. Never delete mock data until every consumer has been migrated.

### 2 — Implement and test each phase in isolation

Each phase above is independent enough to test on its own. Test each API route with a REST client (Bruno / Postman) before wiring it to the UI. Never test DB writes directly from the browser during development.

### 3 — Verify indexes before writing data

Run the Index Master List **before** inserting any data. Adding indexes to a populated collection requires a full collection scan — on a large dataset this is slow and locks writes on Atlas M0. Do it first, once, on an empty collection.

### 4 — Verify atomic operations work on your setup

Before implementing Phase 3+, run a quick transaction smoke test:

```ts
// lib/db-test.ts — delete after verifying
import dbConnect from "./db";
import mongoose from "mongoose";

export async function testTransaction() {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // write something trivial, then abort
    await session.abortTransaction();
    console.log("✅ Transactions work on this connection");
  } catch (e) {
    console.error("❌ Transactions not supported — check replica set config", e);
  } finally {
    session.endSession();
  }
}
```

### 5 — Protect all API routes from the start

Every `/api/` route that writes data must check `getSession()` before touching the DB. Pattern:

```ts
// In every write API route
const session = await getSession();
if (!session) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
```

Never assume the client is authenticated. Always verify server-side.

### 6 — Never expose sensitive fields in API responses

Project out sensitive fields on every user query:

```ts
// ALWAYS use this projection on user queries
const SAFE_USER_PROJECTION = {
  passwordHash: 0,
  dob: 0,
  termsAcceptedAt: 0,
  phone: 0,         // only include if the requester is the account owner
};
```

### 7 — Use the Developer Setup Checklist as your go-live gate

Before going live, every item in the **Developer Setup Checklist** above must be checked. Treat it as a pre-flight. If any item is unchecked, the system is not production-ready.

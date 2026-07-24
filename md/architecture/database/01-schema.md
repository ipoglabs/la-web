# Database Schema — LokalAds

> MongoDB via Mongoose. All collections defined here.  
> Connection singleton: `lib/db.ts`  
> Last updated: 2026-07-07

---

## Collections Index

| # | Collection | Documents | Purpose |
|---|---|---|---|
| 1 | `users` | One per account | Auth + public seller profile |
| 2 | `listings` | One per ad | All classifieds across all categories |
| 3 | `conversations` | One per (listing × buyer) | Chat thread metadata + inbox preview |
| 4 | `messages` | One per message | Individual chat messages |
| 5 | `favourites` | One per (user × listing) save | Saved listings |
| 6 | `saved_alerts` | One per saved search | Alert criteria + notification prefs |
| 7 | `notifications` | One per in-app notification | Bell icon events |
| 8 | `ad_reports` | One per report ticket | Moderation reports (already built) |
| 9 | `otp_tokens` | One per OTP issued | Email verification codes |
| 10 | `magic_link_tokens` | One per link issued | Passwordless login tokens |
| 11 | `follows` | One per (follower × followee) | User follow relationships |
| 12 | `reviews` | One per review written | Seller ratings + review text |
| 13 | `review_votes` | One per (user × review) vote | Prevents duplicate helpful/unhelpful votes |
| 14 | `counters` | One per counter key | Auto-increment sequences (advId, etc.) |

---

## Design Principles

- **User IS the Seller** — no separate seller collection. A user's public profile fields are the seller profile. The `sellerSnapshot` embedded in each listing is a frozen copy at post time.
- **Single `listings` collection** — all categories live here. Category-specific fields go in `attributes: {}`. Never split by category.
- **Denormalise for read speed** — `lastMessage` on conversations, `sellerSnapshot` on listings, `listingSnapshot` on favourites. These are frozen snapshots, not live joins.
- **Cloudflare for images** — all `image` / `avatar` / `cover` fields store Cloudflare delivery URLs. No binary data in MongoDB.
- **Soft deletes** — `status: "deleted"` on users and listings. Records are never destroyed — needed for audit, reports, and message history.
- **TTL indexes on token collections** — MongoDB auto-deletes expired OTP and magic link tokens. No manual cleanup job needed.

---

## 1. `users`

> One document per registered account. This is also the public seller profile.

```ts
{
  _id: ObjectId,

  // ── Auth ──────────────────────────────────────────────────────────────────
  email:        String,           // unique, lowercase, indexed
  passwordHash: String | null,    // bcrypt cost 12 — null for OAuth-only accounts
  provider:     "email" | "google" | "apple",
  providerId:   String | null,    // OAuth provider's user ID (sub claim)
  status:       "unverified"      // registered, OTP not yet confirmed
              | "pending-profile" // OAuth user, DOB + terms not yet collected
              | "active"          // fully onboarded
              | "suspended"       // admin action, reversible
              | "deleted",        // soft deleted

  // ── Public Profile (Seller Profile) ─────────────────────────────────────
  name:          String,
  avatar:        String,          // Cloudflare URL
  cover:         String,          // Cloudflare URL — profile cover photo
  tagline:       String,          // short one-liner shown on seller card
  locationLabel: String,          // e.g. "East London"
  verified:      Boolean,         // admin-verified badge

  // ── Cached Stats (updated by background jobs / event handlers) ───────────
  activeListingsCount: Number,    // default 0
  followersCount:      Number,    // default 0
  followingCount:      Number,    // default 0
  averageRating:       Number,    // default 0 — cached from reviews collection
  reviewCount:         Number,    // default 0 — cached from reviews collection

  // ── Account Details ───────────────────────────────────────────────────────
  dob:               Date,
  termsAcceptedAt:   Date,             // GDPR — when T&C were accepted; required for active users
  phone:             String | null,    // E.164 format e.g. "+919876543210" — needed for WhatsApp notifications
  homeCountry:       "in" | "gb" | "sg", // market where account was created
  marketingConsent:  Boolean,          // default false
  role:              "user" | "admin",
  lastLoginAt:       Date | null,
  sessionVersion:    Number,               // default 1 — increment on password reset to invalidate all existing JWTs
  deletedAt:         Date | null,

  // ── Timestamps (mongoose { timestamps: true }) ────────────────────────────
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
```
email          — unique
providerId     — sparse (only OAuth users have this)
status         — for admin user management queries
homeCountry    — for market-level analytics
phone          — sparse (only users who added phone number)
```

**Multi-country note:**
- `homeCountry` = the market where the user registered. Stored in DB.
- **Active browsing country** = set by the country picker, lives in the `countryContext` cookie. NOT stored in DB. Managed by `CountryProvider` at runtime.
- A user with `homeCountry: "in"` can freely browse and post listings in GB or SG — the listing carries its own `countryCode`. No DB change needed when they switch.
- When a user switches country via `/switch-country`, only the cookie updates — `homeCountry` never changes.

**Key Mongoose validation rules (enforce in the model, not just in API routes):**
```ts
email:          { type: String, required: true, lowercase: true, trim: true }
name:           { type: String, required: true, trim: true, maxlength: 80 }
tagline:        { type: String, trim: true, maxlength: 120 }
dob:            { type: Date, required: true }
homeCountry:    { type: String, enum: ['in', 'gb', 'sg'], required: true }
role:           { type: String, enum: ['user', 'admin'], default: 'user' }
status:         { type: String, enum: ['unverified','pending-profile','active','suspended','deleted'], default: 'unverified' }
sessionVersion: { type: Number, default: 1 }
phone:          { type: String, match: /^\+[1-9]\d{6,14}$/ }  // E.164 validation
```

**CountryCode values:** `"in"` (India) · `"gb"` (United Kingdom, ISO 3166-1) · `"sg"` (Singapore)
> ✅ Corrected 2026-07-13 — `config/types.ts` now uses `"gb"` (not `"uk"`) to match ISO 3166-1 alpha-2, matching the DB schema.

**Security notes:**
- `passwordHash` and `dob` are **never included in API responses** — always project them out
- `email` is **never embedded in listings or messages** — use `_id` references only
- `providerId` must be unique per provider — compound unique index on `(provider, providerId)`

---

## 2. `listings`

> One document per classified ad. Every category, every country lives here.

```ts
{
  _id: ObjectId,

  // ── Identity ──────────────────────────────────────────────────────────────
  advId: String,                  // 5-digit display ID e.g. "10042" — unique, generated server-side
                                  // Generation: auto-increment counter from a `counters` collection
                                  // db.counters.findOneAndUpdate({_id:"advId"},{$inc:{seq:1}},{upsert:true,returnDocument:"after"})
  slug:  String,                  // URL-safe e.g. "3-bed-flat-zone-2-canary-wharf" — unique per country (not globally)
                                  // Generation: slugify(title) → on MongoServerError code 11000 (duplicate key)
                                  //   retry with first 6 chars of _id appended: "honda-city-2020-a4f2bc"
                                  //   this guarantees uniqueness with no extra DB read

  // ── Categorisation ────────────────────────────────────────────────────────
  countryCode:    "in" | "gb" | "sg",
  categoryId:     String,         // "property" | "vehicles" | "jobs" | "services" | "pets" | ...
  subcategoryId:  String,         // "to_rent" | "cars" | "full-time" | "home" | "dogs" | ...

  // ── Core Content ──────────────────────────────────────────────────────────
  title:       String,
  description: String,            // sanitised HTML — only <p> <strong> <em> <ul> <li>
  priceLabel:  String,            // formatted display string e.g. "₹45,000"
  priceSuffix: String | null,     // e.g. "/ mo" | "/ hr" — null for outright sale
  price:       Number | null,     // numeric value for sorting + range filters
  currency:    String,            // ISO 4217 — "INR" | "GBP" | "SGD"
  isFree:      Boolean,           // true for free / giveaway listings

  // ── Location ──────────────────────────────────────────────────────────────
  locationLabel: String,          // e.g. "Canary Wharf, London"
  coordinates: {
    type:        "Point",         // GeoJSON — required for $near queries
    coordinates: [Number, Number] // [longitude, latitude] — GeoJSON order
  },

  // ── Media ─────────────────────────────────────────────────────────────────
  images: [{
    src: String,                  // Cloudflare delivery URL
    alt: String,                  // accessibility alt text
  }],                             // images[0] is always the cover / thumbnail

  // ── Category-Specific Fields ──────────────────────────────────────────────
  attributes: Mixed,              // shape varies by categoryId — see Attributes Reference below

  // ── Structured Details (rendered as key-value tables on detail page) ──────
  keyDetails: [{ key: String, value: String }],    // 4–6 rows, category-specific
  goodToKnow: [{ key: String, value: String }],    // 4–6 rows, policy / availability

  // ── Ownership ─────────────────────────────────────────────────────────────
  sellerId: ObjectId,             // ref users
  sellerSnapshot: {               // frozen copy at publish time — never updated
    name:        String,
    avatar:      String,          // Cloudflare URL
    location:    String,
    tagline:     String,
    verified:    Boolean,
    memberSince: String,          // "2021"
  },

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  status: "draft"
        | "pending"
        | "active"
        | "off-market"
        | "expired"
        | "closed"
        | "under-review"
        | "rejected"
        | "blocked"
        | "deleted",
  publishedAt:      Date | null,
  expiresAt:        Date | null,  // set on publish e.g. publishedAt + 60 days

  // ── Moderation ────────────────────────────────────────────────────────────
  rejectionReason:  String | null,
  blockedReason:    String | null,
  reportCount:      Number,       // cached — auto-set to "under-review" above threshold

  // ── Engagement (cached counts) ─────────────────────────────────────────────
  viewCount:      Number,         // default 0
  favouriteCount: Number,         // default 0 — updated when favourites are added/removed

  // ── Timestamps ────────────────────────────────────────────────────────────
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
```
advId                                        — unique (global)
countryCode + slug                           — unique compound (slug unique per country, not globally)
sellerId + status                            — seller's own listings dashboard
countryCode + status + categoryId            — category browse queries
countryCode + status + categoryId + subcategoryId — subcategory browse queries (most common filter path)
countryCode + status + price                 — sort by price (cheapest/most expensive first)
coordinates                                  — 2dsphere (geospatial $near queries)
status + expiresAt                           — expiry background job
status + createdAt                           — recent listings feed
```

**Attributes Reference — shape per category:**
```ts
// property
{ beds: Number, baths: Number, area: Number, areaUnit: "sqft"|"sqm",
  furnishing: "furnished"|"semi"|"unfurnished", tenure: "long"|"short"|"any",
  propertyType: "apartment"|"house"|"villa"|"studio"|"commercial" }

// vehicles — cars & motorcycles
{ make: String, model: String, year: Number, mileage: Number, mileageUnit: "km"|"mi",
  fuelType: "petrol"|"diesel"|"electric"|"hybrid"|"cng",
  transmission: "manual"|"automatic", colour: String, condition: "new"|"used" }

// jobs
{ jobType: "full-time"|"part-time"|"freelance"|"internship"|"contract",
  workMode: "onsite"|"remote"|"hybrid",
  salaryMin: Number, salaryMax: Number, salaryCurrency: String,
  salaryPeriod: "monthly"|"annual"|"hourly",
  experienceLevel: "entry"|"mid"|"senior"|"any" }

// services
{ serviceType: String, availability: String, serviceArea: String }

// pets
{ species: String, breed: String, age: String, gender: "male"|"female"|"unknown",
  vaccinated: Boolean, neutered: Boolean }

// electronics_tech
{ brand: String, model: String,
  condition: "new"|"like_new"|"good"|"fair"|"for_parts",
  storage: String, colour: String, warranty: "in_warranty"|"expired"|"none" }

// fashion_clothing
{ gender: "mens"|"womens"|"unisex"|"kids",
  size: String,          // e.g. "M", "XL", "32", "EU 42"
  brand: String, colour: String,
  condition: "new_with_tags"|"like_new"|"good"|"fair" }

// home_furniture
{ condition: "new"|"like_new"|"good"|"fair",
  material: String, colour: String }

// business
{ businessType: "for_sale"|"franchise"|"partnership"|"b2b"|"equipment"|"startup",
  askingPrice: Number, annualRevenue: Number | null,
  establishedYear: Number | null, employees: Number | null,
  reasonForSelling: String | null }

// community
{ eventDate: String | null,   // ISO date — for events/announcements
  venue: String | null,
  isOnline: Boolean,
  isFree: Boolean }

// special_offers
{ offerType: "percent"|"flat"|"bogo"|"bundle",
  discountPercent: Number | null,
  originalPrice: Number | null,
  validUntil: String | null }  // ISO date

// travel_stays
{ checkInDate: String | null, checkOutDate: String | null,
  maxGuests: Number, bedrooms: Number | null,
  amenities: String[] }  // e.g. ["wifi", "pool", "parking"]

// books_media_collectibles
{ condition: "new"|"like_new"|"good"|"acceptable",
  genre: String, author: String | null, language: String, edition: String | null }

// baby_kids
{ ageRange: String,   // e.g. "0-6 months", "3-5 years"
  condition: "new"|"like_new"|"good"|"fair",
  gender: "boy"|"girl"|"unisex" }

// sports_outdoors
{ sport: String, brand: String, size: String | null,
  condition: "new"|"like_new"|"good"|"fair" }

// tickets_vouchers
{ eventDate: String | null,   // ISO date
  venue: String | null,
  ticketType: "single"|"pair"|"group",
  seatSection: String | null,
  isTransferable: Boolean }

// health_beauty
{ serviceType: String, sessionDuration: String | null,
  qualification: String | null }

// musical_instruments
{ instrumentType: String, brand: String,
  condition: "new"|"like_new"|"good"|"fair",
  level: "beginner"|"intermediate"|"professional" }

// free_giveaway
{ condition: "good"|"fair"|"for_parts",
  reason: "moving"|"declutter"|"upgrade"|"other" | null,
  availableFrom: String | null }  // ISO date

// education
{ subject: String,
  level: "school"|"college"|"professional"|"hobby",
  deliveryMode: "online"|"in_person"|"hybrid",
  sessionDuration: String | null }  // e.g. "1 hour", "90 mins"

// food_dining
{ cuisine: String,
  servesMin: Number | null, servesMax: Number | null,
  dietaryOptions: String[],  // ["vegetarian", "vegan", "halal", "jain", "gluten_free"]
  deliveryAvailable: Boolean }
```

---

## 3. `conversations`

> One document per unique (listing × buyer) pair. Stores thread metadata and the last message for the inbox preview — **not** the messages themselves.

```ts
{
  _id: ObjectId,

  // ── Thread Identity ────────────────────────────────────────────────────────
  listingId: ObjectId,            // ref listings
  listingSnapshot: {              // frozen at conversation start
    id:    String,                // advId
    title: String,
    image: String,                // Cloudflare URL — first image
    price: String,                // priceLabel at time of enquiry
  },

  // ── Participants ───────────────────────────────────────────────────────────
  participants: [ObjectId],       // always exactly [sellerId, buyerId]
  sellerId:     ObjectId,         // ref users
  buyerId:      ObjectId,         // ref users

  // ── Inbox Preview (denormalised — updated on every new message) ─────────
  lastMessage: {
    text:     String,
    senderId: ObjectId,
    sentAt:   Date,
    type:     "text" | "image" | "offer",
  } | null,

  // ── Unread Counts (keyed by userId string) ─────────────────────────────────
  unreadCount: Map<String, Number>,  // e.g. { "abc123": 3, "def456": 0 }

  // ── Status ────────────────────────────────────────────────────────────────
  status:    "active" | "archived" | "blocked",
  blockedBy: ObjectId | null,

  // ── Timestamps ────────────────────────────────────────────────────────────
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
```
participants + updatedAt desc     — inbox query (all threads for a user, newest first)
listingId + buyerId               — unique (prevent duplicate threads per listing-buyer pair)
sellerId + status                 — seller inbox filter
buyerId + status                  — buyer inbox filter
```

---

## 4. `messages`

> One document per message. Never embedded in the conversation document.

```ts
{
  _id: ObjectId,

  conversationId: ObjectId,       // ref conversations
  senderId:       ObjectId,       // ref users

  // ── Content ───────────────────────────────────────────────────────────────
  type:     "text" | "image" | "offer",
  text:     String | null,            // sanitised plain text — null when type is "image"
  imageUrl: String | null,            // Cloudflare URL — required when type is "image"
  offer: {                        // for type: "offer"
    amount:   Number,
    currency: String,
    note:     String,
  } | null,

  // ── State ─────────────────────────────────────────────────────────────────
  readAt:    Date | null,
  deletedAt: Date | null,         // soft delete — message hidden but not removed

  // ── Timestamp ─────────────────────────────────────────────────────────────
  sentAt: Date,
}
```

**Indexes:**
```
conversationId + sentAt asc       — paginated message thread (oldest first)
senderId                          — message history per user
```

---

## 5. `favourites`

> One document per (user × listing) save action. Enables seller analytics ("47 people saved your listing").

```ts
{
  _id: ObjectId,

  userId:    ObjectId,            // ref users
  listingId: ObjectId,            // ref listings

  listingSnapshot: {              // denormalised — for rendering without a listings join
    title:         String,
    image:         String,        // Cloudflare URL
    priceLabel:    String,
    priceSuffix:   String | null,
    locationLabel: String,
    status:        String,        // reflects current listing status
  },

  savedAt: Date,
}
```

**Indexes:**
```
userId + listingId                — unique compound (prevents duplicate saves)
userId + savedAt desc             — user's favourites list, newest first
listingId                         — count favourites per listing (seller analytics)
```

---

## 6. `saved_alerts`

> One document per user-saved search. A background job runs every 15 minutes, fetches listings posted since `lastCheckedAt`, matches against each active alert in code, and notifies matching users.

```ts
{
  _id: ObjectId,

  userId:       ObjectId,         // ref users
  countryCode:  "in" | "gb" | "sg",
  categoryId:   String,
  subcategoryId: String | null,

  // ── Search Criteria ────────────────────────────────────────────────────────
  name:         String,           // user-defined label e.g. "2BHK Koramangala" — shown in alerts list
  keywords: [String],             // e.g. ["2 BHK", "Koramangala"]
  location: {
    label:  String,               // e.g. "Koramangala, Bengaluru"
    lat:    Number,
    lng:    Number,
    radius: Number,
    unit:   "km" | "mi",
  } | null,
  attributes: Mixed,              // category-specific filter criteria — same shape as listing attributes

  // ── Notification Preferences ───────────────────────────────────────────────
  notify: {
    email:     Boolean,
    whatsapp:  Boolean,           // V2 — deferred, not implemented in initial release
  },

  // ── Job State ─────────────────────────────────────────────────────────────
  active:        Boolean,         // user can pause/resume without deleting
  lastCheckedAt: Date,            // background job advances this after each run

  // ── Timestamps ────────────────────────────────────────────────────────────
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
```
userId                            — user's own alerts list
active + countryCode + categoryId — background job query (fetch only active alerts for a given category batch)
lastCheckedAt                     — job ordering
```

---

## 7. `notifications`

> One document per in-app notification. Powers the bell icon unread count and notifications panel.

```ts
{
  _id: ObjectId,

  userId: ObjectId,               // ref users — recipient

  // ── Content ───────────────────────────────────────────────────────────────
  type: "new_message"
      | "listing_approved"
      | "listing_rejected"
      | "listing_expired"
      | "listing_blocked"
      | "alert_match"
      | "report_update"
      | "new_follower"           // someone followed the user
      | "new_review"             // someone left a review on the user's profile
      | "account_warning",

  title: String,                  // e.g. "New message about your listing"
  body:  String,                  // e.g. "Priya asked: Is this still available?"
  link:  String | null,           // internal path e.g. "/chat?id=abc123"

  // ── State ─────────────────────────────────────────────────────────────────
  read:   Boolean,                // default false
  readAt: Date | null,

  // ── Contextual Metadata ────────────────────────────────────────────────────
  metadata: Mixed,                // { conversationId } | { listingId } | { alertId } | { ticketId }

  // ── Timestamp ─────────────────────────────────────────────────────────────
  createdAt: Date,
}
```

**Indexes:**
```
userId + read + createdAt desc    — unread count query + notifications panel
userId + createdAt desc           — full notifications list for a user
```

**TTL:** Notifications older than 90 days are auto-deleted via a TTL index on `createdAt`.

---

## 8. `ad_reports`

> Already fully implemented. See `components/report-ad/model.ts` for the Mongoose schema.

```ts
{
  ticketId:      String,          // "RPT-2026-XXXXXX"
  adId:          String,
  adTitle:       String,
  adThumbnail:   String,
  sellerName:    String,
  sellerId:      String,
  location:      String,
  reporterId:    String | null,
  reporterEmail: String | null,
  hideIdentity:  Boolean,
  issues:        ReportIssue[],   // 10 possible values — see report-ad/types.ts
  details:       String,          // max 500 chars
  status:        "pending" | "reviewed" | "actioned" | "dismissed",
  priority:      "low" | "medium" | "high",  // auto-derived from issues on pre-save
  reviewedAt:    Date | null,
  reviewedBy:    String | null,
  resolution:    String | null,
  createdAt:     Date,
}
```

---

## 9. `otp_tokens`

> One document per OTP issued. MongoDB auto-deletes expired tokens via TTL index.

```ts
{
  _id: ObjectId,

  email:     String,              // indexed — look up by email
  tokenHash: String,              // SHA-256 of the raw 6-digit OTP — raw value is emailed, never stored
  attempts:  Number,              // wrong attempt counter — max 3, then token is invalidated
  used:      Boolean,             // true once successfully verified
  expiresAt: Date,                // 15 minutes from creation

  createdAt: Date,
}
```

**Indexes:**
```
email + used + expiresAt          — lookup: valid token for this email
expiresAt                         — TTL index (expireAfterSeconds: 0) — auto-delete
```

---

## 10. `magic_link_tokens`

> One document per magic link issued. Same TTL pattern as OTP tokens.

```ts
{
  _id: ObjectId,

  email:     String,              // indexed
  tokenHash: String,              // SHA-256 of the 64-char hex raw token — raw token is in the email URL
  purpose:   "login" | "reset",   // "login" = magic link login · "reset" = password reset link
  used:      Boolean,
  expiresAt: Date,                // 15 minutes from creation

  createdAt: Date,
}
```

**Indexes:**
```
tokenHash                         — primary lookup (verify magic link)
email + used                      — rate limiting check
expiresAt                         — TTL index (expireAfterSeconds: 0) — auto-delete
```

---

## 11. `follows`

> One document per follow relationship. Powers follower/following counts and the "following" feed.

```ts
{
  _id: ObjectId,

  followerId: ObjectId,           // ref users — the person following
  followeeId: ObjectId,           // ref users — the person being followed

  createdAt: Date,
}
```

**Indexes:**
```
followerId + followeeId           — unique compound (prevent duplicate follows)
followerId + createdAt desc       — "people I follow" list
followeeId + createdAt desc       — "my followers" list
```

**On follow/unfollow:** update `users.followersCount` on followee and `users.followingCount` on follower atomically (same session as the follows insert/delete).

---

## 12. `reviews`

> One document per review written by a buyer about a seller. Powers the Reviews tab on public profile — star rating, review text, helpful votes.

```ts
{
  _id: ObjectId,

  // ── Parties ───────────────────────────────────────────────────────────────
  reviewerId: ObjectId,           // ref users — person writing the review
  sellerId:   ObjectId,           // ref users — person being reviewed
  listingId:  ObjectId | null,    // ref listings — the transaction context (optional)

  // ── Reviewer Snapshot ─────────────────────────────────────────────────────
  reviewerSnapshot: {             // frozen at review write time — avoids a user join on render
    name:   String,
    avatar: String,               // Cloudflare URL
  },

  // ── Content ───────────────────────────────────────────────────────────────
  rating:  Number,                // 1–5 integer
  title:   String | null,         // optional short summary
  body:    String,                // review text — max 1000 chars

  // ── Helpful Votes ─────────────────────────────────────────────────────────
  helpfulVotes:   Number,         // cached count of upvotes — default 0
  unhelpfulVotes: Number,         // cached count of downvotes — default 0

  // ── Moderation ────────────────────────────────────────────────────────────
  status: "published" | "flagged" | "removed",

  // ── Timestamps ────────────────────────────────────────────────────────────
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**
```
sellerId + status + createdAt desc  — seller's reviews list (public profile tab)
reviewerId + sellerId               — unique compound (one review per buyer per seller)
listingId                           — reviews for a specific listing context
```

**On review create/delete:** update `users.averageRating` and `users.reviewCount` on the seller atomically.

---

## 13. `review_votes`

> One document per (user × review) vote. Prevents the same user voting a review as helpful/unhelpful more than once.

```ts
{
  _id: ObjectId,

  userId:   ObjectId,             // ref users — person casting the vote
  reviewId: ObjectId,             // ref reviews
  vote:     "up" | "down",        // helpful or unhelpful

  createdAt: Date,
}
```

**Indexes:**
```
userId + reviewId                 — unique compound (one vote per user per review, prevents duplicates)
reviewId                          — fetch all votes for a review (admin/moderation)
```

**On vote cast:** upsert on `(userId + reviewId)` — if same user changes vote from up to down, update the `vote` field and recalculate the cached counts on `reviews.helpfulVotes` + `reviews.unhelpfulVotes` atomically.

---

## 14. `counters`

> One document per auto-increment sequence. Used for generating `advId` values — monotonically increasing, collision-free, human-readable.

```ts
{
  _id:  String,   // sequence name e.g. "advId"
  seq:  Number,   // current value — atomically incremented on each use
}
```

**Indexes:**
```
_id   — default MongoDB _id index (already unique)
```

**Seed on first deploy:**
```js
db.counters.insertOne({ _id: "advId", seq: 10000 })
// First listing gets advId "10001", second "10002", etc.
```

**Usage in API route (atomic, safe under concurrent writes):**
```ts
const counter = await db.counters.findOneAndUpdate(
  { _id: "advId" },
  { $inc: { seq: 1 } },
  { upsert: true, returnDocument: "after" }
);
const advId = String(counter.seq);  // e.g. "10042"
```

---

## Environment Variables

```bash
MONGODB_URI=    # mongodb+srv://<user>:<pass>@cluster.mongodb.net/lokalads?retryWrites=true&w=majority
```

The database name is `lokalads`. All collections above live in this single database.

---
name: la-mongodb
description: "Use when writing Mongoose models, API routes that touch the DB, designing queries, creating indexes, or planning schema changes in LokalAds poc-next. Covers model file conventions, Mongoose v9 patterns, query rules, denormalisation strategy, index checklist, and schema migration. Specific to this codebase."
argument-hint: "What you are building or the problem (e.g. 'New model for X', 'Write a query for Y', 'Add index to Z collection')"
---

# LokalAds — MongoDB / Mongoose Guide

> For: Any developer writing DB-backed code in poc-next.
> Deep schema reference: `md/architecture/database/01-schema.md` (all 14 collections)
> Relationships + indexes: `md/architecture/database/02-relationships.md`
> Connection singleton: `src/lib/db.ts`

---

## The 14 Collections — Know These Names

```
users              → one per account (also the seller profile)
listings           → one per classified ad (all categories, all countries)
conversations      → one per (listing × buyer) chat thread
messages           → one per chat message
favourites         → one per (user × listing) save
saved_alerts       → one per email alert subscription
notifications      → in-app bell icon events
ad_reports         → moderation reports (already built — src/lib/models/report.ts)
otp_tokens         → email verification codes (TTL — auto-deleted by MongoDB)
magic_link_tokens  → passwordless login tokens (TTL — auto-deleted by MongoDB)
follows            → user follow relationships
reviews            → seller ratings + review text
review_votes       → (user × review) helpful/unhelpful votes
counters           → auto-increment sequences (advId generation)
```

---

## Model File Convention — Where Models Live

```
src/lib/models/           ← shared models used by multiple features
  report.ts               ← already built
  [future: user.ts, listing.ts, ...]

src/components/[feature]/ ← feature-owned models (self-contained features)
  model.ts                ← example: components/report-ad/model.ts
```

**Rule:** If a model is only ever used by one feature's API routes → co-locate it in `components/[feature]/`.
**Rule:** If a model is shared across multiple features (users, listings) → put it in `src/lib/models/`.

---

## Writing a New Mongoose Model — The Pattern (Mongoose v9)

```typescript
// src/lib/models/listing.ts

import mongoose, { Schema, type Document, type Model } from "mongoose";

// 1. TypeScript interface — matches the schema shape
export interface IListing extends Document {
  advId:       string;
  slug:        string;
  countryCode: "in" | "gb" | "sg";
  categoryId:  string;
  title:       string;
  status:      "draft" | "active" | "expired" | "closed" | "deleted";
  sellerId:    mongoose.Types.ObjectId;
  createdAt:   Date;
  updatedAt:   Date;
}

// 2. Schema definition
const ListingSchema = new Schema<IListing>(
  {
    advId:       { type: String, required: true },
    slug:        { type: String, required: true, trim: true, lowercase: true },
    countryCode: { type: String, required: true, enum: ["in", "gb", "sg"] },
    categoryId:  { type: String, required: true },
    title:       { type: String, required: true, trim: true, maxlength: 150 },
    status:      { type: String, required: true, enum: ["draft","active","expired","closed","deleted"], default: "draft" },
    sellerId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,               // adds createdAt + updatedAt automatically
    collection: "listings",         // explicit collection name — never rely on Mongoose pluralisation
  }
);

// 3. Indexes — define on the schema, not as separate createIndex calls
ListingSchema.index({ advId: 1 }, { unique: true });
ListingSchema.index({ countryCode: 1, slug: 1 }, { unique: true });
ListingSchema.index({ sellerId: 1, status: 1 });
ListingSchema.index({ countryCode: 1, status: 1, categoryId: 1 });
ListingSchema.index({ coordinates: "2dsphere" });     // geo queries

// 4. Export with singleton guard (prevents OverwriteModelError on hot-reload)
export const Listing: Model<IListing> =
  mongoose.models.Listing ?? mongoose.model<IListing>("Listing", ListingSchema);
```

**Always follow this exact pattern:**
- `{ timestamps: true }` — never add `createdAt`/`updatedAt` manually
- `collection: "explicit-name"` — never trust Mongoose auto-pluralisation
- Singleton guard `mongoose.models.X ?? mongoose.model(...)` — required for Next.js hot-reload
- Indexes on schema — not as raw `createIndex()` calls in migration scripts

---

## Wiring a Model into an API Route

```typescript
// src/app/api/listings/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";                    // always first
import { Listing } from "@/lib/models/listing";       // import the model

export async function GET(request: NextRequest) {
  await dbConnect();                                  // connect before any model use

  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");

  // Input validation — always validate at the boundary
  if (!country || !["in", "gb", "sg"].includes(country)) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }

  const listings = await Listing.find({
    countryCode: country,
    status: "active",
  })
    .select("title slug priceLabel locationLabel images.0 createdAt")  // only what's needed
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();                                          // .lean() for read-only — returns plain JS objects, faster

  return NextResponse.json({ listings });
}
```

**Rules for every DB-touching API route:**
1. `await dbConnect()` — line 1 of the handler body, every time
2. `.lean()` on read-only queries — always (returns plain object, not Mongoose Document — faster, smaller)
3. `.select(...)` — always specify fields — never return the full document by default
4. Never return `passwordHash`, `dob`, `email`, `sessionVersion` in any response — project them out explicitly
5. Validate all input before touching the DB

---

## Query Rules — Do and Don't

### DO
```typescript
// Lean for reads
await Listing.find({ status: "active" }).lean();

// Select only what the UI needs
await Listing.findById(id).select("title priceLabel status images").lean();

// Atomic updates — single field
await Listing.updateOne({ _id: id }, { $inc: { viewCount: 1 } });

// Bulk updates — use updateMany, not a loop
await Listing.updateMany({ sellerId: userId }, { $set: { "sellerSnapshot.name": newName } });

// Upsert for counters (advId generation)
const counter = await Counter.findOneAndUpdate(
  { _id: "advId" },
  { $inc: { seq: 1 } },
  { upsert: true, returnDocument: "after", new: true }
);
```

### DON'T
```typescript
// ❌ Never populate() on hot read paths — use embedded snapshots instead
await Listing.find({}).populate("sellerId");     // wrong — use sellerSnapshot instead

// ❌ Never load full documents for read-only UI
await Listing.find({ status: "active" });        // wrong — always .select() and .lean()

// ❌ Never update snapshots without bulk update
await listing.save();                            // wrong if only updating sellerSnapshot — use updateMany

// ❌ Never use .save() on a Document returned from .lean()
const doc = await Listing.findById(id).lean();
doc.save();                                      // runtime error — lean returns plain object
```

---

## Embed vs Reference — Decision Guide

Use this table every time you design a new field:

| Question | Answer → Pattern |
|---|---|
| Is the data read together always? Small size (<1KB)? | → **Embed** |
| Does the data change independently? Queried standalone? | → **Reference** (ObjectId) |
| Is it a snapshot (frozen at write time, must not change)? | → **Embed snapshot** |
| Is it a live relationship (must always reflect current state)? | → **Reference + join at read time** |

**Existing embed snapshots in this codebase:**

| Snapshot | Collection | Source | Rule |
|---|---|---|---|
| `sellerSnapshot` | `listings` | `users` | Update when user changes name/avatar/tagline/verified |
| `listingSnapshot` | `conversations` | `listings` | **Never update** — frozen at conversation start |
| `listingSnapshot` | `favourites` | `listings` | Update when listing title, price, or status changes |
| `lastMessage` | `conversations` | `messages` | Update on every new message |
| `reviewerSnapshot` | `reviews` | `users` | **Never update** — frozen at review write time |

**Updating `sellerSnapshot` (the correct pattern):**
```typescript
// When user updates their profile
await Listing.updateMany(
  { sellerId: userId, status: { $nin: ["deleted"] } },
  { $set: {
    "sellerSnapshot.name":     newName,
    "sellerSnapshot.avatar":   newAvatar,
    "sellerSnapshot.tagline":  newTagline,
    "sellerSnapshot.verified": newVerified,
  }}
);
```

---

## Slug Generation — Listings Only

Slugs must be unique per `(countryCode + slug)`. This is a compound unique index.

```typescript
import slugify from "slugify";   // or implement inline

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}

async function createListingWithSlug(data: CreateListingInput) {
  const baseSlug = generateSlug(data.title);
  let slug = baseSlug;

  try {
    return await Listing.create({ ...data, slug });
  } catch (err: unknown) {
    // MongoServerError code 11000 = duplicate key (slug collision)
    if ((err as { code?: number }).code === 11000) {
      // Append first 6 chars of ObjectId for guaranteed uniqueness
      const id = new mongoose.Types.ObjectId().toHexString().slice(0, 6);
      slug = `${baseSlug}-${id}`;
      return await Listing.create({ ...data, slug });
    }
    throw err;
  }
}
```

---

## advId Generation (5-digit display ID)

```typescript
// Uses the counters collection — atomic increment, no race conditions
const counter = await Counter.findOneAndUpdate(
  { _id: "advId" },
  { $inc: { seq: 1 } },
  { upsert: true, returnDocument: "after", new: true }
);
const advId = String(counter.seq).padStart(5, "0");  // e.g. "00042"
```

---

## Schema Migration Pattern

MongoDB has no `ALTER TABLE`. When changing a live schema:

```
Step 1 — Add the new field as optional in the Mongoose schema
Step 2 — Deploy — existing documents have the field missing (undefined), new writes include it
Step 3 — Backfill with a one-time script or background job:

  await Listing.updateMany(
    { newField: { $exists: false } },     // only documents missing the field
    { $set: { newField: defaultValue } }
  );
  // Run in batches — MongoDB does not support limit on updateMany
  // Use find({ newField: { $exists: false } }).limit(1000) + bulkWrite for large collections

Step 4 — Make the field required in the schema once backfill is complete
Step 5 — Remove the old field (if applicable) — same batched approach with $unset
```

**Never:** Add a required field without a default or backfill first — it will break existing reads.

---

## Index Checklist — Before Shipping Any New Feature

Every query your feature runs needs an index. Check these:

- [ ] Filter fields → covered by a compound index in the correct order (`equality` fields first, then `range`, then `sort`)
- [ ] Sort fields → included as last field(s) in the compound index
- [ ] Unique constraints → `{ unique: true }` on the schema index
- [ ] Sparse indexes for optional fields → `{ sparse: true }` (e.g. `phone`, `providerId`)
- [ ] TTL indexes for auto-expiring documents → `{ expireAfterSeconds: 0 }` with a `expiresAt: Date` field
- [ ] Geo queries → `{ "coordinates": "2dsphere" }` index required for `$near`
- [ ] Text search → Atlas Search index on `listings` (named `"listings_search"` on `title` + `description`)

Full index list for all 14 collections: `md/architecture/database/02-relationships.md` → Index Master List.

---

## Pagination Patterns

All list endpoints must be paginated. Choose the right pattern for the use case:

### Skip/limit — for browsable list pages (listings, search results)
```typescript
// Always cap the limit — never let client control page size without a max
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
const limit = Math.min(MAX_LIMIT, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT)));
const skip = (page - 1) * limit;

// Run query and count in parallel
const [listings, total] = await Promise.all([
  Listing.find(filter).select("title slug priceLabel images.0").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  Listing.countDocuments(filter),
]);

return NextResponse.json({
  listings,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});
```

### Cursor-based — for infinite scroll (chat messages, notification feed)
```typescript
// Client sends the _id of the last item it received as `before`
const before = searchParams.get("before");  // MongoDB ObjectId string
const limit = 20;

const filter = before
  ? { conversationId, _id: { $lt: new mongoose.Types.ObjectId(before) } }
  : { conversationId };

const messages = await Message.find(filter)
  .sort({ _id: -1 })                        // newest first
  .limit(limit + 1)                         // fetch one extra to detect hasMore
  .lean();

const hasMore = messages.length > limit;
if (hasMore) messages.pop();               // remove the extra item

return NextResponse.json({
  messages: messages.reverse(),             // return chronological order
  hasMore,
  nextCursor: hasMore ? messages[0]._id.toString() : null,
});
```

**Rules:**
- Skip/limit for paginated browse (page 1, page 2, page N)
- Cursor-based for infinite scroll / real-time feeds (chat, notifications)
- Always cap `limit` server-side — never trust client-supplied value without a max
- Always include `total` in skip/limit responses — the UI needs it for page count display
- Cursor pagination uses `_id` as the cursor (monotonically increasing ObjectId) — not `createdAt`

---

## Security Rules — Non-Negotiable

```
Never return in any API response:
  passwordHash · dob · email (in embedded documents) · sessionVersion · providerId

Always project these out explicitly:
  .select("-passwordHash -dob -sessionVersion")

Never expose MongoDB _id in URLs — use slug or advId
Validate countryCode against ["in", "gb", "sg"] at every API boundary
Soft delete only — never db.collection.deleteOne() on users or listings
```

---

## How This Skill Evolves — Self-Update Protocol

> **This file is a living document. Copilot updates it automatically — no instruction from the owner needed.**

### Triggers — update this file when any of these happen
- A new Mongoose model is added to the codebase (`src/lib/models/` or co-located)
- A new query pattern is used in practice and becomes a convention
- An index is added, changed, or discovered to be missing during a performance issue
- A schema migration is executed and the pattern should be documented
- A snapshot update trigger is added or changed (sellerSnapshot, favourites, etc.)
- A Mongoose v9 behaviour is discovered that differs from what's documented here
- A security issue is found in a DB query and a safer pattern is established
- The 14 collections list grows (new collection added to the schema)

### How to update
1. Edit the relevant section directly — keep it concise
2. Replace outdated patterns — never leave contradictions
3. Add a `> Updated: YYYY-MM-DD — [what changed and why]` note at the top of the changed section
4. Also update `md/architecture/database/01-schema.md` or `02-relationships.md` if the schema itself changed

### What NOT to add
- Unconfirmed decisions — mark as `[PROPOSED]` if uncertain, confirm before merging into rules
- One-off patterns that don't generalise — if it happened once, it's not a convention yet
- Anything the owner has explicitly said NOT to do

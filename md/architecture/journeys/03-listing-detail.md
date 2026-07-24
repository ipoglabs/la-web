# Journey: Listing Detail

> Buyer views a listing — inspects, saves, contacts seller, or reports.  
> Last updated: 2026-07-07

---

## Entry Points

- Listing card click from `/listings`
- Direct URL `/listings/[slug]`
- Shared link

---

## Page Load Sequence

```
Browser                    Server (RSC)                  DB
  │                           │                             │
  │── GET /listings/[slug] ──►│                             │
  │                           │── Listing.findOne(slug) ───►│
  │                           │◄── listing doc ─────────────│
  │                           │   (sellerSnapshot embedded) │
  │                           │                             │
  │                           │── getSimilarListings() ────►│
  │                           │◄── similar[] ───────────────│
  │                           │                             │
  │◄── full HTML (SSR) ───────│                             │
  │                           │                             │
  │   [client hydrates]       │                             │
  │── getSession() ──────────►│                             │
  │◄── session / null ────────│                             │
  │                           │                             │
  │   [if session]            │                             │
  │── GET /api/favourites ───►│── Favourite.exists() ──────►│
  │◄── { isFavourited } ──────│◄── bool ────────────────────│
  │                           │                             │
  │── $inc listing.viewCount ►│── Listing.updateOne() ─────►│ (fire-and-forget)
```

---

## Buyer Actions on the Page

### Save to Favourites

```
Buyer                      Client                        Server
  │── clicks ♥ ─────────────►│                             │
  │                           │── getSession() ────────────►│
  │                    [if not logged in → /login]          │
  │                           │                             │
  │                           │── POST /api/favourites ────►│
  │                           │   { listingId }             │
  │                           │   ATOMIC:                   │
  │                           │   ├─ Favourite.create()     │
  │                           │   └─ $inc favouriteCount    │
  │                           │◄── 201 ─────────────────────│
  │◄── ♥ fills (optimistic) ──│                             │
```

### Contact Seller (ChitChat)

```
Buyer                      Client                        Server
  │── clicks "Contact" ─────►│                             │
  │                           │── getSession() ────────────►│
  │                    [if not logged in → /login]          │
  │                           │                             │
  │◄── ChitChat panel opens ──│                             │
  │   (message input +        │                             │
  │    listing preview snap)  │                             │
  │                           │                             │
  │── types + sends ─────────►│── POST /api/conversations ─►│
  │                           │   { listingId, message }    │
  │                           │   Server:                   │
  │                           │   ├─ upsert conversation    │
  │                           │   │   (listingId + buyerId) │
  │                           │   ├─ embed listingSnapshot  │
  │                           │   └─ insert first message   │
  │                           │◄── 201 { conversationId } ──│
  │◄── "Message sent" state ──│                             │
  │   (link to /chat)         │                             │
```

### Report Ad

```
Buyer                      Client                        Server
  │── clicks "Report" ──────►│                             │
  │◄── ReportAd drawer opens ─│                             │
  │   (issue checkboxes +     │                             │
  │    details textarea)      │                             │
  │                           │                             │
  │── selects issues + submit►│── POST /api/reports ───────►│
  │                           │   { adId, issues[], details }│
  │                           │◄── 201 { ticketId } ────────│
  │◄── confirmation + ticketId│                             │
```

### Save Alert (from nav band)

```
Buyer                      Client
  │── clicks 🔔 "Save Alert" ►│── opens CreateAlert modal
  │   pre-filled with current │   category + location
  │   listing's context       │
  │── confirms ──────────────►│── POST /api/alerts ────────►│
  │◄── "Alert saved" toast ───│◄── 201 ─────────────────────│
```

---

## Page Sections

| Section | Component | Data source |
|---|---|---|
| Nav band (back + breadcrumb + save alert) | `ListingDetailNavBand` | URL params |
| Image gallery | `ListingGallery` | `listing.images[]` |
| Title + price + location | `ListingTitleBar` | `listing` |
| Key details table | `ListingDetailsTable` | `listing.keyDetails[]` |
| Description | `LaListingDescription` | `listing.description` |
| Good to know | `ListingUserFacts` | `listing.goodToKnow[]` |
| Map | `ListingMap` | `listing.coordinates` |
| Seller card + contact | `SellerCard` + `ChitChat` | `listing.sellerSnapshot` |
| Report button | `ListingReportButton` | — |
| Similar listings | `FeaturedListings` | `getSimilarListings()` |

---

## Key Rules

- Page is **Server Component** — initial render needs no JS for SEO
- `sellerSnapshot` is frozen — shows seller at time of posting (not live profile)
- `viewCount` increment is fire-and-forget — never block page render on it
- `viewCount` deduplication: session-based — same user within 24h counts as 1 view (tracked in `view_events` or Redis set per `userId+listingId`)
- Buyer cannot contact seller on their own listing — hide ChitChat if `session.id === listing.sellerId`
- Listing with `status !== active` still renders for SEO — shows "This listing has expired / removed" banner; ChitChat and contact actions are hidden

---

## Follow Seller

```
Buyer         Seller Profile      POST /api/follows            DB
  │── clicks "Follow" ──────────►│                             │
  │                             │── auth required             │
  │                             │── Follow.create() ─────────►│
  │                             │── $inc seller.followersCount►│ ATOMIC
  │◄── button → "Following" ────│                             │
  │                             │                             │
  │── clicks "Unfollow" ────────►│── DELETE /api/follows/[id] ►│
  │                             │── $dec seller.followersCount►│ ATOMIC
  │◄── button → "Follow" ───────│                             │
```

- Follow entry point: seller card on listing detail + seller public profile page
- No notification to seller on follow (V1)
- Follow count shown on seller profile — not per-listing

---

## Leave a Review

Available after buyer and seller have had a conversation on a listing that is `closed`.

```
Buyer         /chat/[id]          POST /api/reviews            DB
  │── "Leave a review" CTA ─────►│                             │
  │   (visible when listing      │                             │
  │    status: closed / sold)    │                             │
  │◄── review form ─────────────│                             │
  │   rating 1–5 + comment       │                             │
  │                             │                             │
  │── submits ─────────────────►│── POST /api/reviews ───────►│
  │                             │   { targetUserId, rating,   │
  │                             │     comment, listingId }    │
  │                             │   ├─ guard: reviewer ≠ target│
  │                             │   ├─ guard: one review per  │
  │                             │   │   (reviewer + listing)  │
  │                             │   ├─ recalculate avgRating  │
  │                             │   └─ $inc reviewCount ─────►│
  │◄── "Review submitted" ──────│                             │
```

- Reviews are public — visible on seller profile
- Seller cannot review the buyer (V1 — seller-to-buyer reviews are V2)

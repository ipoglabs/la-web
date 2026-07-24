# Journey: Post an Ad

> Seller creates and publishes a classified listing.  
> Most complex flow — category drives the entire form shape.  
> Last updated: 2026-07-07

---

## Entry Points

- AppHeader → "Post Ad" CTA button
- `/post` page (currently stub)

---

## Sequence

```
Seller                     Client                        Server
  │                           │                             │
  │── clicks "Post Ad" ──────►│                             │
  │                           │── getSession() ────────────►│
  │                           │◄── null ────────────────────│
  │                           │                             │
  │                     redirect /login?next=/post          │
  │                           │                             │
  │── logs in ───────────────►│                             │
  │                           │── POST /api/auth/* ────────►│
  │                           │◄── session cookie ──────────│
  │                           │                             │
  │◄── /post ─────────────────│                             │
  │                           │                             │
  ├─── Step 1: Pick Country ──┤                             │
  │    (if homeCountry ≠ active cookie — confirm market)    │
  │                           │                             │
  ├─── Step 2: Pick Category ─┤                             │
  │    Grid of enabled categories for selected country      │
  │    config/countries/[code].enabledCategories            │
  │                           │                             │
  ├─── Step 3: Pick Subcategory ─┤                          │
  │    Subcategory list for chosen category                 │
  │                           │                             │
  ├─── Step 4: Fill Form ─────┤                             │
  │    Title / Description (rich text)                      │
  │    Price + currency (locked to active country)          │
  │    Location picker → coordinates + locationLabel        │
  │    attributes{} — shape driven by categoryId            │
  │    keyDetails[] + goodToKnow[]                          │
  │                           │                             │
  ├─── Step 5: Upload Images ─┤                             │
  │                           │── POST /api/upload ────────►│
  │                           │◄── { uploadUrl, imageId } ──│
  │                           │── PUT imageUrl → Cloudflare ►│ (direct)
  │                           │◄── 200 ─────────────────────│
  │    (repeat per image, max 10)                           │
  │                           │                             │
  ├─── Step 6: Preview ───────┤                             │
  │    Listing card preview before submitting               │
  │                           │                             │
  ├─── Step 7: Submit ────────┤                             │
  │                           │── POST /api/listings ──────►│
  │                           │   { title, categoryId,      │
  │                           │     countryCode, price,      │
  │                           │     coordinates, images[],   │
  │                           │     attributes{} }           │
  │                           │                             │
  │                           │   Server:                   │
  │                           │   ├─ validate categoryId    │
  │                           │   │   vs enabledCategories  │
  │                           │   ├─ generate advId          │
  │                           │   │   (counters $inc)        │
  │                           │   ├─ generateSlug(title)     │
  │                           │   │   retry on 11000 dupe    │
  │                           │   ├─ embed sellerSnapshot    │
  │                           │   ├─ set expiresAt           │
  │                           │   │   (publishedAt + 60d)    │
  │                           │   └─ status: "active"        │
  │                           │                             │
  │                           │◄── 201 { id, advId, slug } ─│
  │                           │                             │
  │◄── redirect /listings/[slug] ─────────────────────────  │
```

---

## Status After Submit

| Status | When |
|---|---|
| `active` | Direct publish (default V1) |
| `pending` | If moderation queue is enabled (future) |

---

## Key Rules

- `countryCode` on the listing = active browsing country cookie — not `users.homeCountry`
- `categoryId` must be in `config/countries/[code].enabledCategories` — validated server-side
- Image upload is decoupled — all images must be uploaded before form submit
- `sellerSnapshot` is frozen at publish time — never updated when user edits profile
- `expiresAt` = `publishedAt + 60 days` — background job sets `status: expired` after that
- Slug collision handled silently server-side — client never sees a 409

---

## Error States

| Error | Shown where | Recovery |
|---|---|---|
| Not logged in | Redirect to `/login?next=/post` | Login then resume |
| Category not allowed in country | Form validation | Change country or category |
| Image upload fails | Per-image error inline | Retry individual image |
| `POST /api/listings` 400 | Form field highlight | Fix fields, resubmit |

---

## Edit Listing

```
Seller        /myads → Edit       PATCH /api/listings/[id]     DB
  │── clicks "Edit" ───────────►│── GET /api/listings/[id] ──►│
  │◄── form pre-filled ─────────│   guard: owner only         │
  │                             │                             │
  │   [images: add / remove]    │                             │
  │── removes image ───────────►│── Cloudflare delete ───────►│
  │── adds new image ──────────►│── POST /api/upload → PUT ──►│
  │                             │                             │
  │── saves changes ───────────►│── PATCH /api/listings/[id] ►│
  │                             │   { title, description,     │
  │                             │     price, attributes,      │
  │                             │     images[] }              │
  │                             │   ├─ 403 if not owner       │
  │                             │   ├─ slug NOT regenerated   │
  │                             │   └─ sellerSnapshot frozen  │
  │                             │◄── 200 { listing } ─────────│
  │◄── redirect /listings/[slug]│                             │
```

### Edit rules

| Rule | Behaviour |
|---|---|
| Slug | Never regenerated — title change keeps original URL |
| `sellerSnapshot` | NOT updated on edit — only via `PUT /api/users/me` |
| `status` | Preserved — editing active listing stays active |
| After moderation rejection | User can edit + resubmit — status returns to `active` |
| Owner check | `session.userId === listing.sellerId` — 403 otherwise |

---

## Background Jobs

### Listing Expiry (Cron — daily 02:00 UTC)

```
Cron                            DB                           Seller
  │── find listings ───────────►│                             │
  │   { status: "active",       │                             │
  │     expiresAt: { $lte: now }}│                            │
  │◄── listings[] ──────────────│                             │
  │                             │                             │
  │   per listing (batch 500):  │                             │
  │── PATCH status: "expired" ─►│                             │
  │── $dec activeListingsCount ─►│ users                      │
  │── insert notification ──────────────────────────────────►│
  │   type: "listing_expired"   │                             │
  │   CTA: "Renew listing"      │                             │
```

- Required index: `{ expiresAt: 1, status: 1 }`
- Seller renews from `/myads` → `PATCH status:active` resets `expiresAt = now + 60d`

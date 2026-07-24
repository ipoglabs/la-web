# Journey: Manage Account

> Authenticated user manages their profile, listings, favourites, and alerts.  
> All dashboard routes under `/(dashboard)/`.  
> Last updated: 2026-07-07

---

## Dashboard Routes

| Route | Purpose |
|---|---|
| `/profile` | View + edit own public profile |
| `/myads` | Manage own listings |
| `/favourites` | Saved listings |
| `/chat` | Inbox (see `06-chat.md`) |
| `/switch-country` | Change active browsing market |

---

## Edit Profile

```
User          /profile           PUT /api/users/me            DB
  │── clicks Edit ─────────────►│                             │
  │◄── edit form pre-filled ────│                             │
  │   name, tagline, avatar,    │                             │
  │   locationLabel             │                             │
  │                             │                             │
  │   [avatar change]           │                             │
  │── selects new photo ───────►│── POST /api/upload ────────►│ Cloudflare
  │                             │◄── { uploadUrl, imageId } ──│
  │                             │── PUT → Cloudflare (direct) │
  │                             │◄── 200 ─────────────────────│
  │                             │                             │
  │── saves form ──────────────►│── PUT /api/users/me ───────►│
  │                             │   { name, tagline,          │
  │                             │     avatar, locationLabel }  │
  │                             │                             │
  │                             │   Server:                   │
  │                             │   ├─ update users doc        │
  │                             │   └─ updateMany listings     │
  │                             │      sellerSnapshot ────────►│ ATOMIC
  │                             │◄── 200 { user } ────────────│
  │◄── profile updated ─────────│                             │
```

---

## My Ads — Listing Lifecycle

```
Seller        /myads             PATCH /api/listings/[id]/status
  │◄── list of own listings ────│ GET /api/users/me listings  │
  │   grouped by status          │                             │
  │                             │                             │
  │── clicks "Pause" ──────────►│── PATCH status: off-market ►│
  │                             │   $dec activeListingsCount  │
  │◄── listing moves to paused ─│                             │
  │                             │                             │
  │── clicks "Renew" ──────────►│── PATCH status: active ────►│
  │   (expired listing)         │   reset expiresAt           │
  │                             │   $inc activeListingsCount  │
  │◄── listing back in search ──│                             │
  │                             │                             │
  │── clicks "Close" ──────────►│── PATCH status: closed ────►│
  │   (sold / no longer needed) │   $dec activeListingsCount  │
  │◄── listing archived ────────│                             │
```

### Listing statuses a seller can set

| Action | From status | To status |
|---|---|---|
| Pause | `active` | `off-market` |
| Resume | `off-market` | `active` |
| Renew | `expired` | `active` |
| Close | `active` \| `off-market` | `closed` |
| Edit | Any except `deleted` | Same status |

---

## Favourites

```
User          /favourites        Client                    DB
  │                           │                             │
  │◄── list of saved listings │ GET /api/favourites ───────►│
  │   rendered from            │ listingSnapshot embedded    │
  │   listingSnapshot (no join)│                             │
  │                             │                             │
  │── clicks Remove ───────────►│── DELETE /api/favourites ──►│
  │                             │   /[listingId]              │
  │                             │   ATOMIC:                   │
  │                             │   ├─ Favourite.deleteOne()  │
  │                             │   └─ $dec favouriteCount    │
  │◄── item removed (optimistic)│                             │
```

---

## Saved Alerts

```
User          /dashboard         Client                    DB
  │◄── alerts list ────────────│ GET /api/alerts ───────────►│
  │                             │                             │
  │── pauses alert ────────────►│── PATCH /api/alerts/[id] ──►│
  │                             │   { active: false }         │
  │◄── alert paused ────────────│                             │
  │                             │                             │
  │── deletes alert ───────────►│── DELETE /api/alerts/[id] ─►│
  │◄── alert removed ───────────│                             │
```

---

## Switch Country

```
User          /switch-country    Client
  │◄── country picker ──────────│
  │   (3 market cards)          │
  │                             │
  │── selects country ─────────►│── write countryContext cookie
  │                             │   (no DB write — cookie only)
  │◄── router.refresh() ────────│
  │   CountryProvider re-reads  │
  │   cookie → new market active│
```

---

## Delete Account

```
User          /profile           DELETE /api/users/me         DB
  │── clicks "Delete Account" ─►│                             │
  │◄── confirmation modal ──────│                             │
  │── types "DELETE" + confirms►│── DELETE /api/users/me ────►│
  │                             │   ATOMIC (transaction):     │
  │                             │   ├─ users.status: deleted  │
  │                             │   ├─ listings: deleted       │
  │                             │   ├─ favourites: removed     │
  │                             │   ├─ alerts: active: false   │
  │                             │   ├─ follows: cleaned        │
  │                             │   └─ notifications: removed  │
  │                             │◄── 200 ─────────────────────│
  │                             │── delete session cookie      │
  │◄── redirect / ─────────────│                             │
```

---

## Key Rules

- All dashboard routes require auth — redirect to `/login?next=` if no session
- `sellerSnapshot` on listings is updated atomically when profile is saved
- `listingSnapshot` in favourites reflects current listing status — stale entries show "Expired" badge
- Country switch only writes a cookie — no API call, no DB change
- Account delete is soft — `status: deleted`, hard purge after 90 days (GDPR compliance)

---

## Password Change

Only available to users who registered via email (not OAuth-only accounts).

```
User          /profile            PUT /api/users/me/password   DB
  │── clicks "Change Password" ─►│                             │
  │◄── password form ───────────│                             │
  │   current + new + confirm   │                             │
  │                             │                             │
  │── submits ─────────────────►│── verify currentPassword ──►│
  │                             │── bcrypt new password       │
  │                             │── $inc sessionVersion ─────►│ ATOMIC
  │                             │── re-issue session cookie   │
  │◄── "Password updated"       │                             │
  │   (current session kept;    │                             │
  │    all other devices evicted│                             │
  │    via sessionVersion bump) │                             │
```

---

## Follow / Unfollow Seller

```
Buyer         Seller Profile      POST /api/follows            DB
  │── clicks "Follow" ──────────►│── auth required            │
  │                             │── Follow.create() ─────────►│
  │                             │── $inc followersCount ──────►│ ATOMIC
  │◄── button → "Following" ────│                             │
  │                             │                             │
  │── clicks "Unfollow" ────────►│── DELETE /api/follows/[id] ►│
  │                             │── $dec followersCount ──────►│ ATOMIC
  │◄── button → "Follow" ───────│                             │
```

- Follow count shown on seller public profile
- No notification to seller on follow (V1)

---

## Reviews

### View reviews received

```
User          /profile            GET /api/users/[id]/reviews  DB
  │── views own profile ────────►│── GET /api/reviews ────────►│
  │   or another seller's        │   { targetUserId }          │
  │◄── review list rendered ────│   sort: newest first        │
```

- Rating + comment shown publicly
- User can see their own `avgRating` + `reviewCount` on their profile
- Leave-a-review flow: see `03-listing-detail.md`

---

## 90-Day Hard Purge (Cron)

```
Cron (daily)                    DB
  │── find users ──────────────►│
  │   { status: "deleted",      │
  │     deletedAt: {            │
  │       $lte: now - 90d } }   │
  │◄── users[] ─────────────────│
  │                             │
  │   per user:                 │
  │── users.deleteOne() ───────►│
  │── listings.deleteMany() ───►│ (already status: deleted)
  │── messages: anonymise ─────►│ sender → "[Deleted user]"
  │── reviews: anonymise ──────►│ reviewer → "[Deleted user]"
  │── conversations: keep ─────►│ (other party's history preserved)
```

- GDPR Article 17 — right to erasure
- Messages + reviews anonymised (not deleted) — conversation integrity preserved

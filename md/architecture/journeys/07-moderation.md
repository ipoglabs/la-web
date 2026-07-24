# Journey: Moderation

> Report submitted by user → admin review queue → action taken → notification sent.  
> Covers: report ad, admin triage, listing block, account warning, appeal.  
> Last updated: 2026-07-07

---

## Entry Points

| From | Action |
|---|---|
| `/listings/[listingId]` | "Report this ad" → report-ad component opens |
| `/chat` | "Report user" from conversation overflow menu |
| Admin panel | `/api/admin/reports` — review queue |

---

## Submit a Report

```
User          Listing Detail      POST /api/reports            DB
  │── "Report this ad" ─────────►│                             │
  │◄── report form (sheet) ─────│                             │
  │   reason + optional note     │                             │
  │                             │                             │
  │── submits ─────────────────►│── POST /api/reports ───────►│
  │                             │   {                          │
  │                             │     targetType: "listing"   │
  │                             │     targetId               │
  │                             │     reason                  │
  │                             │     note (optional)         │
  │                             │   }                          │
  │                             │── $inc listing.reportCount ─►│
  │◄── "Thanks for your report" │                             │
```

---

## Auto-Flag Threshold

```
Server                          Listings DB                  Reports DB
  │   On each report write:     │                             │
  │── check reportCount ───────►│                             │
  │◄── current count ───────────│                             │
  │                             │                             │
  │   if count >= THRESHOLD(5): │                             │
  │── PATCH status: "flagged" ─►│                             │
  │── insert notification ──────────────────────────────────►│ notifications
  │   to admin queue            │                             │
```

---

## Admin Review Queue

```
Admin         Admin Panel         GET /api/admin/reports       DB
  │◄── auth check (role: admin) │                             │
  │                             │                             │
  │── opens review queue ──────►│── GET /api/admin/reports ──►│
  │                             │   filter: status "open"     │
  │                             │   sort: reportCount desc    │
  │◄── flagged listings list ───│                             │
  │                             │                             │
  │── clicks item ─────────────►│── GET /api/reports?         │
  │                             │   targetId=[listingId] ────►│
  │◄── all reports for listing ─│                             │
```

---

## Admin Takes Action

```
Admin         Admin Panel         PATCH /api/admin/reports/[id]  DB
  │── "Block Listing" ──────────►│                             │
  │                             │── PATCH:                    │
  │                             │   report.status: actioned   │
  │                             │   report.resolution:        │
  │                             │     "listing_removed"       │
  │                             │   reviewer, resolvedAt ────►│
  │                             │                             │
  │                             │── PATCH listing.status:     │
  │                             │   "rejected" ──────────────►│
  │                             │── $dec activeListingsCount ─►│ users
  │                             │                             │
  │                             │── insert notification ──────►│ notifications
  │                             │   to: listing.seller        │
  │                             │   type: "listing_removed"   │
  │◄── action confirmed ────────│                             │
```

### Admin resolution options

| Resolution | Listing status | User notified | Account penalty |
|---|---|---|---|
| `dismissed` | unchanged | No | None |
| `listing_removed` | `rejected` | Yes | None |
| `listing_removed_warning` | `rejected` | Yes | `warnings + 1` |
| `account_suspended` | All listings `rejected` | Yes | `status: suspended` |
| `account_banned` | All listings `deleted` | Yes | `status: banned` |

---

## Seller Notified

```
Seller        Notifications       GET /api/notifications       DB
  │◄── push / in-app alert ─────│                             │
  │── opens notification ──────►│── GET /api/notifications ──►│
  │◄── "Your listing was removed│                             │
  │    — [reason]" ─────────────│                             │
  │                             │                             │
  │   [if listing_removed only] │                             │
  │── "Appeal" button ─────────►│── POST /api/reports/[id]   │
  │                             │   /appeal                   │
  │                             │   { note } ───────────────►│
  │                             │   report.appeal: { note,   │
  │                             │   submittedAt } saved       │
  │◄── "Appeal submitted" ──────│                             │
```

---

## Dismiss Report

```
Admin         Admin Panel         PATCH /api/admin/reports/[id]
  │── "Dismiss" ───────────────►│── PATCH:                    │
  │                             │   report.status: dismissed  │
  │                             │   no listing change         │
  │◄── removed from queue ──────│                             │
  │   [reportCount stays — used │                             │
  │    for pattern detection]   │                             │
```

---

## Key Rules

- Any authenticated user can report any listing (not their own)
- Duplicate reports from same user on same listing → 409 (no double-count)
- `reportCount` on listing is a running tally — never decremented
- Auto-flag threshold (default 5) is a server constant — not a DB setting
- Only admins can action reports — `role: "admin"` checked server-side
- Blocked/rejected listings → removed from Atlas Search index via `status` filter
- Admin resolution is final — appeals go into a second review cycle, not auto-resolved

---

## Report a User

Same `POST /api/reports` endpoint — `targetType: "user"` distinguishes from listing reports.

```
User          /chat/[id]          POST /api/reports            DB
  │── overflow menu ────────────►│                             │
  │── "Report User" ───────────►│                             │
  │◄── report form (sheet) ─────│                             │
  │   reason + optional note     │                             │
  │                             │                             │
  │── submits ─────────────────►│── POST /api/reports ───────►│
  │                             │   {                          │
  │                             │     targetType: "user",     │
  │                             │     targetId: userId,       │
  │                             │     reason,                 │
  │                             │     conversationId (context)}│
  │                             │── $inc user.reportCount ───►│
  │◄── "Thanks for your report" │                             │
```

- Auto-flag threshold (`reportCount >= 5`) applies to users — same as listings
- Duplicate reports from same reporter on same user → 409
- Admin sees user reports in the same queue — filtered by `targetType`

---

## Appeal Reviewed by Admin

```
Admin         Admin Panel         PATCH /api/admin/reports/[id]/appeal
  │── opens appeal queue ───────►│── GET appeals ─────────────►│
  │   (filter: appeal.submitted  │   { appeal.submittedAt:     │
  │    exists, status: actioned) │     { $exists: true },      │
  │                             │     status: "actioned" }    │
  │◄── report + appeal note ────│                             │
  │                             │                             │
  │── "Uphold" or "Overturn" ──►│── PATCH:                    │
  │                             │   appeal.resolution:        │
  │                             │   "upheld" | "overturned"   │
  │                             │   appeal.reviewedAt: now    │
  │                             │                             │
  │                             │   if overturned:            │
  │                             │   ├─ listing.status: active ►│
  │                             │   ├─ $inc activeListingsCount►│ users
  │                             │   └─ notify seller ─────────►│ notifications
  │                             │       type: "appeal_approved"│
  │◄── appeal resolved ─────────│                             │
```

- Each listing gets one appeal — `appeal.submittedAt` blocks a second submission
- Admin overturn reinstates the listing — no automatic penalty to original reporter

# Journey: Chat (Messaging)

> Buyer initiates contact on a listing. Full conversation lifecycle — inbox, send, read, block, offers.  
> Built around `conversations` + `messages` collections.  
> Last updated: 2026-07-07

---

## Entry Points

| From | Action |
|---|---|
| `/listings/[listingId]` | "Contact Seller" button → ChitChat opens |
| `/chat` | Inbox — list of existing conversations |
| Push notification | Deep link to `/chat/[conversationId]` |

---

## Start Conversation (from Listing Detail)

```
Buyer         Listing Detail      POST /api/conversations     DB
  │── "Contact Seller" ─────────►│                             │
  │                             │   Guard:                    │
  │                             │   ├─ auth required          │
  │                             │   └─ buyer ≠ seller         │
  │                             │                             │
  │                             │── findOne                   │
  │                             │   { listing, buyer, seller }►│
  │                             │◄── exists? ─────────────────│
  │                             │                             │
  │                             │   if exists → return it     │
  │                             │   if not → create new:      │
  │                             │   ├─ conversation doc        │
  │                             │   ├─ listingSnapshot         │
  │                             │   ├─ buyerSnapshot           │
  │                             │   └─ sellerSnapshot          │
  │◄── { conversationId } ──────│                             │
  │── open chat panel ──────────│                             │
```

---

## Load Inbox

```
User          /chat               GET /api/conversations      DB
  │◄── auth redirect if no session                            │
  │                             │                             │
  │── page loads ──────────────►│── GET /api/conversations ──►│
  │                             │   sort: lastMessageAt desc  │
  │                             │   fields: last msg preview  │
  │                             │           unreadCount       │
  │                             │           counterparty info │
  │◄── inbox list rendered ─────│                             │
```

---

## Load Conversation Thread

```
User          /chat/[id]          GET /api/conversations       DB
  │── taps conversation ────────►│── GET /conversations/[id] ─►│
  │                             │◄── conversation doc ─────────│
  │                             │                             │
  │                             │── GET messages?             │
  │                             │   conversationId=[id]       │
  │                             │   limit=50, cursor=null ───►│
  │                             │◄── messages[] ──────────────│
  │◄── thread rendered ─────────│                             │
  │                             │                             │
  │   [scroll up for older]     │                             │
  │── load more ───────────────►│── GET messages?cursor= ────►│
  │◄── prepend older msgs ──────│                             │
```

---

## Send Message

```
User          Chat UI             POST /api/conversations/[id]/messages   DB
  │── types message ────────────►│                             │
  │── hits send ───────────────►│── POST /messages ─────────►│
  │◄── optimistic append ───────│   { type: "text", text }    │
  │                             │                             │
  │                             │   Server ATOMIC:            │
  │                             │   ├─ messages.insertOne()   │
  │                             │   ├─ conversation.lastMessage│
  │                             │   ├─ lastMessageAt: now      │
  │                             │   └─ $inc unreadCount       │
  │                             │       (for the other party) │
  │                             │◄── { message doc } ─────────│
  │◄── message confirmed ───────│                             │
  │                             │── trigger notification ─────►│ notifications
```

---

## Mark as Read

```
User          Chat UI             PATCH /api/conversations/[id]/read
  │── opens thread ────────────►│                             │
  │                             │── PATCH /read ─────────────►│
  │                             │   conversation.unreadCount  │
  │                             │   for this user → 0         │
  │◄── unread badge clears ─────│                             │
```

---

## Send Offer

```
Buyer         Chat UI             POST .../messages            DB
  │── clicks "Make Offer" ──────►│                             │
  │◄── offer input sheet ───────│                             │
  │── enters amount + sends ───►│── POST /messages ─────────►│
  │                             │   {                          │
  │                             │     type: "offer",           │
  │                             │     offerAmount,             │
  │                             │     offerStatus: "pending"   │
  │                             │   }                          │
  │◄── offer bubble shown ──────│                             │
  │                             │                             │
  │   Seller sees offer──────────────────────────────────────►│
  │                             │── PATCH /messages/[msgId] ──►│
  │                             │   offerStatus: "accepted"   │
  │                             │   or "declined"              │
  │◄── offer status updates ────│                             │
```

---

## Block Conversation

```
User          Chat UI             PATCH /api/conversations/[id]/block
  │── "Block" or "Report" ──────►│                             │
  │◄── confirm dialog ──────────│                             │
  │── confirms ────────────────►│── PATCH /block ────────────►│
  │                             │   blockedBy: userId          │
  │                             │   status: "blocked"          │
  │◄── thread archived ─────────│                             │
  │   [other party cannot reply]│                             │
```

---

## Message Types

| `type` | Description |
|---|---|
| `text` | Standard message |
| `offer` | Buyer price proposal + `offerAmount`, `offerStatus` |
| `system` | Auto-generated (e.g. "Listing has been sold") |

---

## Key Rules

- One conversation per `(buyer, seller, listing)` triplet — deduplicated on create
- `unreadCount` is per-user — stored on the conversation doc (`buyerUnread`, `sellerUnread`)
- Messages are never deleted — `status: deleted` soft-delete only
- Blocked conversation: initiating user cannot be blocked by the other
- Seller cannot initiate — buyer always starts from listing detail
- Both parties see `listingSnapshot` in thread header — stale if listing is edited later

---

## Real-Time Delivery

**V1: Short polling** — simple, works on Vercel serverless.

```
Chat UI                          GET .../messages?after=[id]
  │── poll every 5s ───────────►│── query messages ──────────►│
  │   (only when tab active)    │   createdAt > lastSeen      │
  │                             │◄── new messages[] ──────────│
  │◄── append new messages ─────│                             │
  │── PATCH /read if unread ───►│                             │
```

**V2 upgrade: Server-Sent Events (SSE)**

```
Chat UI                          GET .../stream (SSE)
  │── open EventSource ─────────►│── connection held open     │
  │                             │   push on message insert    │
  │◄── event: new_message ───────│                            │
  │◄── event: offer_update ──────│                            │
```

| | V1 Polling | V2 SSE |
|---|---|---|
| Works on Vercel | ✅ | ⚠️ 25s response limit |
| Latency | ~5s | Near-instant |
| Complexity | Low | Medium |
| Switch trigger | >500 active chats/day | — |

---

## Offer Expiry

Offers do not auto-expire in V1.

| `offerStatus` | Trigger |
|---|---|
| `pending` | Initial send |
| `accepted` | Seller accepts |
| `declined` | Seller declines |
| `cancelled` | Buyer withdraws before accepted |
| `expired` | V2 — 48h cron if no seller action |

---

## System Message Triggers

| Event | `system` message text |
|---|---|
| Seller closes listing | "This listing has been marked as sold." |
| Listing expired | "This listing has expired." |
| Listing removed by admin | "This listing has been removed." |
| Conversation blocked | "You can no longer send messages in this thread." |

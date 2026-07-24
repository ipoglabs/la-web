# Database Architecture — LokalAds

> MongoDB via Mongoose · 14 collections · 3 markets (IN · GB · SG)  
> Last updated: 2026-07-07

---

## Files in this folder

| File | What it covers |
|---|---|
| `01-schema.md` | Every collection, every field, every index. Attributes shape for all 20 listing categories. |
| `02-relationships.md` | How collections relate, 15 query patterns, atomic operations, denorm strategy, orphan cascade, multi-country rules, developer setup checklist, implementation task list, production operations. |

**Read order: `01-schema.md` first, then `02-relationships.md`.**

---

## Collections at a glance

| # | Collection | Purpose |
|---|---|---|
| 1 | `users` | Auth + public seller profile |
| 2 | `listings` | All classified ads — every category, every country |
| 3 | `conversations` | Chat thread metadata + inbox preview |
| 4 | `messages` | Individual chat messages |
| 5 | `favourites` | Saved listings per user |
| 6 | `saved_alerts` | Saved search criteria + alert preferences |
| 7 | `notifications` | In-app bell icon events |
| 8 | `ad_reports` | Moderation reports (already implemented) |
| 9 | `otp_tokens` | Email OTP verification codes (TTL auto-delete) |
| 10 | `magic_link_tokens` | Passwordless login + password reset tokens (TTL auto-delete) |
| 11 | `follows` | User follow relationships |
| 12 | `reviews` | Seller ratings and review text |
| 13 | `review_votes` | Helpful / not helpful votes on reviews |
| 14 | `counters` | Auto-increment sequences (advId generation) |

---

## Key decisions

- **User IS the Seller** — single `users` collection, no separate seller table
- **Single `listings` collection** — all categories, all countries. Category-specific fields in `attributes: Mixed`
- **Soft deletes only** — `status: "deleted"` on users and listings. Nothing is ever hard-deleted in V1
- **Cloudflare Images** — all media URLs stored in MongoDB. No binary data in the DB
- **Transactions require a replica set** — Atlas M0+ or `mongod --replSet rs0` locally. Standalone mongod will NOT work
- **Browsing country is NOT stored in DB** — lives in the `countryContext` cookie only. `users.homeCountry` never changes after registration

---

## Where to start as a developer

1. Read the **Developer Setup Checklist** in `02-relationships.md` — infrastructure before code
2. Work through the **Implementation Task List** (11 phases) in dependency order
3. Check **Production Operations** before go-live — cluster security, backups, migration strategy, GDPR

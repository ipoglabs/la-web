# Architecture Documentation — LokalAds

> This folder is the production reference for the entire LokalAds technical architecture.  
> Last updated: 2026-07-13

---

## Start here

**[BIG-PICTURE.md](BIG-PICTURE.md)** — the one-page story of how the whole system fits together (middleware, layout signals, component layers, mock↔real contract, multi-country, API boundary) plus a live scorecard of what's a real seam vs. still a stub. Read this before the detailed folders below.

---

## Folders — recommended read order

| # | Folder | Status | Who needs it | What it covers |
|---|---|---|---|---|
| 1 | `auth/` | ✅ Complete | Developer | All auth flows — registration, OTP, magic link, OAuth, session, password reset |
| 2 | `database/` | ✅ Complete | Developer | 14 collections, indexes, queries, atomic ops, orphan strategy, task list, prod operations |
| 3 | `api/` | ⚠️ Partial | Developer | Route conventions, auth guards, error shapes, validation, rate limiting patterns are documented; the route inventory (`06-route-inventory.md`) reflects only the ~9 routes that actually exist — auth routes are a target/planning list, not built |
| 4 | `journeys/` | ✅ Complete | Developer + Product | End-to-end user flows — post ad, search, chat, auth, moderation |
| 5 | `state/` | ✅ Complete | Frontend dev | Zustand stores, hooks, server state, sync patterns |
| 6 | `components/` | ✅ Complete | Any contributor | 3-layer component system, primitives, blocks, feature components, conventions |

---

## Standalone files

| File | What it covers |
|---|---|
| `seo-url-strategy.md` | ✅ Subdirectory URL decision (`/in/` `/gb/` `/sg/`) · hreflang · sitemap · robots.txt |

---

## How to use this

- **Building the data layer?** → `database/` first
- **Building API routes?** → `auth/` + `database/` + `api/`
- **Building UI?** → `components/` + `state/`
- **Designing a new feature?** → `journeys/` for the user flow, then the relevant technical folders
- **New to the project?** → read all folders in order 1 → 6

---

## Status key

| Symbol | Meaning |
|---|---|
| ✅ Complete | Written, reviewed, production-ready |
| 🚧 In progress | Being written |
| 🔲 Not started | Folder + README created, files not yet written |

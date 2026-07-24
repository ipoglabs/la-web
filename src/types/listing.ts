/**
 * types/listing.ts
 *
 * ─── CANONICAL LISTING SCHEMA ────────────────────────────────────────────────
 * Single source of truth for Listing and Seller types in this project.
 * Promoted from mock data — all 16 categories audited and validated Jun 2026.
 *
 * Consumers:
 *  - lib/mock/**                  — mock data arrays are typed as Listing[]
 *  - app/(main)/listings/**       — listing detail page
 *  - components/la-blocks/        — FeaturedListings grid (Listing ⊇ FeaturedListingItem)
 *  - API integration (future)     — real API responses MUST satisfy Listing
 *
 * Field rules (all mock data conforms to these):
 *
 *  1.  id            — unique, kebab-case, URL-safe          e.g. "prop-rent-01"
 *  2.  href          — always "/listings/<id>"               e.g. "/listings/prop-rent-01"
 *  3.  advId         — 5-digit display Ad ID string          e.g. "10042"
 *  4.  images        — min 1; images[0] = cover in grid thumbnail
 *  5.  priceLabel    — formatted with currency symbol        e.g. "£2,400"
 *  6.  priceSuffix   — space before slash                    e.g. "/ mo" | "/ hr" | "/ night"
 *                      omit entirely for outright purchase or free listings
 *  7.  title         — sentence case, dash-separated clauses e.g. "3-Bed Flat — Zone 2"
 *  8.  detailsLabel  — ALL CAPS, "•" separator               e.g. "3 BEDS • 2 BATHS • APARTMENT"
 *  9.  locationLabel — Area + City                           e.g. "Canary Wharf, London"
 * 10.  postedAt      — ISO 8601 string                       e.g. "2026-06-20T09:00:00Z"
 * 11.  status        — see ListingStatus below (10 values: draft → deleted)
 * 12.  description   — sanitised HTML only: <p> <strong> <em> <ul> <li>
 * 13.  keyDetails    — 4–6 rows; keys specific to the subcategory
 * 14.  goodToKnow    — 4–6 rows; factual policy / availability information
 * 15.  coordinates   — realistic lat/lng matching locationLabel
 * 16.  seller        — named constant from SELLERS pool; never anonymous inline
 */

/** Image used in listing galleries and thumbnail cards. */
export interface ListingImage {
  src: string;
  alt?: string;
}

/** Generic key/value row used in details tables and good-to-know panels. */
export interface KeyValueRow {
  key: string;
  value: string;
}

/**
 * ListingStatus — full lifecycle of a classified ad.
 *
 * ─── SELLER-OWNED STATES ────────────────────────────────────────────────────
 *
 *   draft        → Seller started filling the post form but hasn't submitted.
 *                  Only visible in the seller's own dashboard.
 *
 *   pending      → Submitted and awaiting moderator approval before going live.
 *                  Used for sensitive categories (e.g. rentals, jobs, vehicles).
 *                  Hidden from public search until approved.
 *
 *   active       → Live and fully visible to everyone in search results.
 *                  The normal healthy state.
 *
 *   off-market   → Seller temporarily hid the listing (e.g. going on holiday,
 *                  reconsidering price). Can be reactivated at any time.
 *                  Hidden from public search — only visible in seller dashboard.
 *
 *   expired      → Listing TTL has elapsed (e.g. 30 / 60 / 90 days limit).
 *                  Auto-set by the system. Seller is prompted to renew.
 *                  Hidden from public search.
 *
 *   closed       → Seller explicitly ended the listing (item sold, service filled).
 *                  Intentional permanent end — distinct from expiry.
 *                  Detail page still accessible with a "Closed" badge.
 *
 * ─── MODERATION / ADMIN STATES ──────────────────────────────────────────────
 *
 *   under-review → A report was filed and moderation is investigating.
 *                  May remain visible with an amber "Under Review" badge
 *                  depending on severity, or hidden until resolved.
 *                  Set automatically when a report reaches a threshold.
 *
 *   rejected     → Failed pre-publish moderation (was in `pending`).
 *                  Never went live. Seller receives a rejection reason.
 *                  Visible only in seller dashboard with reason message.
 *
 *   blocked      → Admin suspended the listing for a rule violation.
 *                  Reversible — seller can appeal.
 *                  Hidden from public; seller sees an appeal CTA in dashboard.
 *
 *   deleted      → Soft-deleted by admin or seller.
 *                  Record is kept in the database for audit and report history.
 *                  Never shown anywhere in the UI.
 *
 * ─── STATE MACHINE ──────────────────────────────────────────────────────────
 *
 *   draft → pending → active ─┬→ off-market → active
 *                              ├→ expired    → active (on renew)
 *                              ├→ closed
 *                              ├→ under-review ─┬→ active
 *                              │                ├→ blocked → active (appeal)
 *                              │                └→ deleted
 *                              └→ deleted
 *          pending ────────────→ rejected
 *
 * ─── PUBLIC VISIBILITY MATRIX ───────────────────────────────────────────────
 *
 *   State         Search  Detail page  Seller dashboard
 *   draft           ✗        ✗           ✓
 *   pending         ✗        ✗           ✓ (awaiting label)
 *   active          ✓        ✓           ✓
 *   off-market     ✗        ✗           ✓
 *   expired         ✗        ✗           ✓ (renew prompt)
 *   closed          ✗        ✓ (badge)   ✓
 *   under-review    ✓*       ✓* (badge)  ✓
 *   rejected        ✗        ✗           ✓ (reason shown)
 *   blocked         ✗        ✗           ✓ (appeal CTA)
 *   deleted         ✗        ✗           ✗
 *
 *   * under-review visibility depends on report severity — configurable.
 */
export type ListingStatus =
  // Seller-owned
  | "draft"         // not yet submitted
  | "pending"       // submitted, awaiting moderator approval
  | "active"        // live and visible
  | "off-market"    // seller-hidden (temporarily pulled from listings)
  | "expired"       // TTL elapsed, needs renewal
  | "closed"        // seller ended it (sold / filled)
  // Admin / moderation
  | "under-review"  // report filed, moderation in progress
  | "rejected"      // failed pre-publish moderation
  | "blocked"       // admin suspended (reversible)
  | "deleted";      // soft-deleted, record kept for audit

/**
 * Seller profile attached to every listing.
 *
 * Security note: phone numbers and email addresses are NOT included here.
 * They must be fetched separately via authenticated API calls
 * (e.g. GET /api/sellers/{id}/phone) — never expose them in the public payload.
 */
export interface Seller {
  name: string;
  role: string;           // "Owner" | "Property Agent" | "Letting Agent" | etc.
  location: string;       // Display location                e.g. "East London"
  tagline: string;        // Short one-liner on seller card
  memberSince: string;    // Year joined                     e.g. "2021"
  activeListings: number;
  lastActive: string;     // Human-readable                  e.g. "2h ago"
  likes: string;          // Formatted                       e.g. "3.1K"
  followers: string;      // Formatted                       e.g. "1.2K"
  verified: boolean;
  cover: string;          // Cover photo path                e.g. "/img/img1.jpg"
  avatar: string;         // Avatar photo path               e.g. "/img/img4.jpg"
  // Optional — public profile slug (`/u/[handle]`). Additive/optional so the
  // other 40+ mock seller pools that don't have a wired-up profile yet are
  // unaffected. TODO [INTEGRATION]: make required once every seller has a
  // real profile backed by auth/DB.
  handle?: string;
  // Optional — stable identity, distinct from `handle` (a display slug).
  // Used to compare against `AuthUser.id` (see lib/session.ts) so a listing
  // detail page can detect "this is your own listing" and hide contact CTAs
  // instead of letting a seller message/call themselves. Additive/optional
  // for the same reason as `handle` above — most mock seller pools don't
  // need it since none of them belong to the current mock session user.
  // TODO [INTEGRATION]: make required once every seller is backed by a real
  // user document with a real id.
  id?: string;
  // Optional — trust signals surfaced on the listing-detail Seller Card and
  // the public profile page. Sourced from the Reviews domain (still 📐 in
  // md/architecture/api/07-real-api-gap-inventory.md domain 4 — no real API
  // yet). Kept optional so pools without review data don't need updating.
  // TODO [INTEGRATION]: replace with a live GET that aggregates real review
  // documents once POST /api/reviews exists.
  avgRating?: number;    // e.g. 4.75 (out of 5)
  reviewCount?: number;  // e.g. 4
  // Optional — distinguishes a registered business/company from an
  // individual person, so "Verified" doesn't conflate ID-verification (a
  // person) with business-registration-verification (a company) under one
  // badge. Defaults to "individual" wherever unset (rendered the same as
  // today — no visual change for existing mock data that omits this field).
  accountType?: "individual" | "business";
}

/**
 * Full listing data contract.
 *
 * The thumbnail card fields (images → status) are a structural superset of
 * LaThumbnailListingCardProps — a Listing value can be spread/passed wherever
 * a FeaturedListingItem is expected without type-casting.
 *
 * TODO [INTEGRATION]: Replace mock arrays in lib/mock/ with real API calls.
 *   const listing: Listing = await fetchListing(id);
 *
 * TODO [INTEGRATION]: Add categoryId + subcategoryId fields once the real API
 *   provides them. These are needed to:
 *     - Render a breadcrumb trail on the detail page (Home › Category › Sub › Title)
 *     - Enable "More from this category" sections
 *   Example additions to the Listing interface:
 *     categoryId:    string;  // e.g. "property"
 *     subcategoryId: string;  // e.g. "to_rent"
 */
export interface Listing {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: string;
  href: string;
  advId: string;

  // ── Thumbnail card ─────────────────────────────────────────────────────────
  images: ListingImage[];
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: string;                              // ISO 8601
  status?: ListingStatus;

  // ── Detail page ───────────────────────────────────────────────────────────
  description: string;                           // sanitised HTML
  keyDetails: KeyValueRow[];
  goodToKnow:  KeyValueRow[];
  coordinates: { lat: number; lng: number };
  seller: Seller;
}

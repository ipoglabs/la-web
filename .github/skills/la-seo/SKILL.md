---
name: la-seo
description: "Use when implementing SEO in LokalAds poc-next: metadata API, hreflang, JSON-LD structured data, sitemaps, robots, Core Web Vitals, and the POC→PROD URL migration from cookie-based to /in/ /gb/ /sg/ subdirectory routing. Everything specific to this codebase and the 3-market (IN/GB/SG) architecture."
argument-hint: "What you are implementing (e.g. 'Add metadata to listing page', 'Generate sitemap', 'JSON-LD for listing', 'hreflang setup')"
---

# LokalAds — SEO Guide

> For: Any developer implementing SEO in poc-next.
> URL strategy deep-dive: `md/architecture/seo-url-strategy.md`
> Confirmed decision: **subdirectory-based** (`lokalads.com/in/` · `/gb/` · `/sg/`)

---

## The Big Picture — Current POC vs Production SEO

> Updated: 2026-07-09 — hreflang, sitemaps, and JSON-LD are implemented in the POC (on the cookie-routed URLs). Only the URL structure itself (country prefix) remains a POC→PROD gap.

| | POC (now) | Production (target) |
|---|---|---|
| URL structure | `lokalads.com/listings/...` + cookie for country | `lokalads.com/in/listings/...` — country in URL |
| Google indexing | Single version — Google can't see country content | Three distinct, indexable versions per market |
| hreflang | ✅ Implemented on `[country]/listings/page.tsx` (alternates for in/gb/sg) | Re-point alternates at country-prefixed URLs |
| Sitemaps | ✅ `sitemap.ts` index + `sitemap-in.xml`/`sitemap-gb.xml`/`sitemap-sg.xml` route handlers | Same structure, real country-prefixed URLs |
| Structured data | ✅ JSON-LD `Product` + `BreadcrumbList` on `(main)/listings/[listingId]/page.tsx` | Same, on country-prefixed page |
| robots.ts | ✅ Implemented — literal per-route disallow list + AI scraper block | Update `allow`/`disallow` to real country-prefixed paths |

**This skill covers both:** the SEO primitives already implemented (metadata, hreflang, sitemaps, JSON-LD, robots, Core Web Vitals) and what still changes during the POC→PROD URL migration.

---

## Next.js 16 Metadata API — The Only Way

Use `generateMetadata()` — never add `<head>` tags directly in JSX. Never use `next/head`.

### Static metadata (simple pages)
```typescript
// src/app/(about)/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LokalAds — Classifieds Done Right",
  description: "LokalAds is a classifieds marketplace for India, UK, and Singapore. Buy, sell, and discover locally.",
  openGraph: {
    title: "About LokalAds",
    description: "Classifieds Done Right — India · UK · Singapore",
    url: "https://lokalads.com/about",
    siteName: "LokalAds",
    type: "website",
  },
};
```

### Dynamic metadata (listing detail page — most important)
```typescript
// src/app/(main)/listings/[listingId]/page.tsx  (POC)
// src/app/[country]/listings/[slug]/page.tsx     (PROD)
import type { Metadata } from "next";

interface Props {
  params: Promise<{ listingId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingId } = await params;
  // Fetch listing — use your data fetching pattern
  const listing = await getListingById(listingId);

  if (!listing) {
    return { title: "Listing Not Found | LokalAds" };
  }

  const title = `${listing.title} | LokalAds`;
  const description = listing.description.replace(/<[^>]*>/g, "").slice(0, 160);  // strip HTML, 160 chars
  const image = listing.images[0]?.src;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://lokalads.com/listings/${listing.slug}`,
      siteName: "LokalAds",
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630, alt: listing.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}
```

### Title template (root layout)
```typescript
// src/app/layout.tsx — set once, all pages inherit
export const metadata: Metadata = {
  title: {
    default: "LokalAds — Buy & Sell Locally",
    template: "%s | LokalAds",    // page title becomes: "Page Title | LokalAds"
  },
  description: "The classifieds marketplace for India, United Kingdom, and Singapore.",
  metadataBase: new URL("https://lokalads.com"),   // required for relative OG image URLs
};
```

---

## hreflang — Multi-Market Implementation

Every country-scoped page must declare its alternates. This tells Google which version is for which market.

**Current 3 markets:**

| Market | Country code | Language tag |
|---|---|---|
| India | `in` | `en-IN` |
| United Kingdom | `gb` | `en-GB` |
| Singapore | `sg` | `en-SG` |

### On country-scoped listing pages (PROD URL structure)
```typescript
// src/app/[country]/listings/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, slug } = await params;
  const base = "https://lokalads.com";

  return {
    alternates: {
      canonical: `${base}/${country}/listings/${slug}`,
      languages: {
        "en-IN": `${base}/in/listings/${slug}`,
        "en-GB": `${base}/gb/listings/${slug}`,
        "en-SG": `${base}/sg/listings/${slug}`,
        "x-default": `${base}/in/listings/${slug}`,  // default market
      },
    },
  };
}
```

> **Note:** Only include hreflang for a country if that listing exists in that market. Country-specific listings only need canonical — no alternates.

### On country home pages (PROD)
```typescript
// src/app/[country]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const base = "https://lokalads.com";
  const labels = { in: "India", gb: "United Kingdom", sg: "Singapore" };

  return {
    title: `Buy & Sell Locally in ${labels[country as keyof typeof labels]} | LokalAds`,
    alternates: {
      canonical: `${base}/${country}/`,
      languages: {
        "en-IN": `${base}/in/`,
        "en-GB": `${base}/gb/`,
        "en-SG": `${base}/sg/`,
        "x-default": `${base}/in/`,
      },
    },
  };
}
```

---

## JSON-LD Structured Data — Listing Detail Page

Structured data helps Google understand listing content and can produce rich results (price, image, availability in search).

Use the `Product` schema for classifieds listings:

```typescript
// src/app/(main)/listings/[listingId]/page.tsx
// Add this component to the page JSX

function ListingJsonLd({ listing }: { listing: Listing }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": listing.title,
    "description": listing.description.replace(/<[^>]*>/g, "").slice(0, 500),
    "image": listing.images.map(img => img.src),
    "url": `https://lokalads.com/listings/${listing.slug}`,
    "offers": {
      "@type": "Offer",
      "price": listing.price ?? 0,
      "priceCurrency": listing.currency,      // "INR" | "GBP" | "SGD"
      "availability": listing.status === "active"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Person",
        "name": listing.sellerSnapshot.name,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

Also add `BreadcrumbList` for navigation context:

```typescript
function BreadcrumbJsonLd({ listing }: { listing: Listing }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lokalads.com" },
      { "@type": "ListItem", "position": 2, "name": listing.categoryId, "item": `https://lokalads.com/listings?category=${listing.categoryId}` },
      { "@type": "ListItem", "position": 3, "name": listing.title },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

Place both in the page's Server Component — not in a client component.

---

## Sitemap — Country-Scoped Structure

### Target structure (PROD)
```
lokalads.com/sitemap.xml         ← index pointing to country sitemaps
lokalads.com/sitemap-in.xml      ← all active Indian listings + category pages
lokalads.com/sitemap-gb.xml      ← all active UK listings + category pages
lokalads.com/sitemap-sg.xml      ← all active Singapore listings + category pages
```

### Implementation (Next.js App Router)
```typescript
// src/app/sitemap.ts  ← sitemap index
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://lokalads.com/sitemap-in.xml", lastModified: new Date() },
    { url: "https://lokalads.com/sitemap-gb.xml", lastModified: new Date() },
    { url: "https://lokalads.com/sitemap-sg.xml", lastModified: new Date() },
  ];
}
```

> **Already implemented** — see `src/app/sitemap.ts` (index) and `src/app/sitemap-in.xml/route.ts`, `sitemap-gb.xml/route.ts`, `sitemap-sg.xml/route.ts` (dotted folder names, not `sitemap-in/route.ts`). Shared per-country logic lives in `lib/seo/sitemap-country.ts`. Use these as the reference pattern rather than writing a new one from scratch.

```typescript
// src/app/sitemap-in.xml/route.ts  ← per-country dynamic sitemap (real path)
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
// import { Listing } from "@/lib/models/listing";

export async function GET() {
  await dbConnect();
  // const listings = await Listing.find({ countryCode: "in", status: "active" })
  //   .select("slug updatedAt").lean();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lokalads.com/in/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- listings.map(l => <url>...) -->
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
```

---

## robots.ts — Current Implementation

`src/app/robots.ts` is fully implemented and matches the actual route structure — copy it as the reference:

```typescript
// src/app/robots.ts — already implemented
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["GPTBot", "CCBot", "Amazonbot", "anthropic-ai"],
        disallow: ["/"],                    // block AI training scrapers entirely
      },
      {
        userAgent: "*",
        allow: ["/in/", "/gb/", "/sg/"],
        disallow: [
          "/design-system/", "/snippets/", "/unsupported/", "/api/",
          // (dashboard) route group adds NO "/dashboard/" URL prefix in this app —
          // a blanket "/dashboard/" disallow would not block these, so each is listed:
          "/chat", "/favourites", "/myads", "/profile",
          "/switch-country", "/delete-account", "/donation-history",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

**`SITE_URL`** is a shared constant in `lib/constants.ts` (reads `NEXT_PUBLIC_APP_URL`) — never hardcode `https://lokalads.com` in new SEO code, import `SITE_URL` instead.

### POC→PROD update needed
When the country-prefixed URL migration happens, replace the individual dashboard-route disallow entries with whatever the equivalent country-prefixed paths become (they may still need per-route entries if the route group still adds no prefix).

---

## Core Web Vitals — Classifieds-Specific Rules

### LCP (Largest Contentful Paint) — listing images are the culprit
```tsx
// Hero image on listing detail page — always priority
<Image
  src={listing.images[0].src}
  alt={listing.images[0].alt}
  priority            // ← preloads the first image — critical for LCP
  fill
  sizes="(max-width: 768px) 100vw, 60vw"
/>

// Thumbnail images on listing cards — never priority (below fold)
<Image
  src={listing.images[0].src}
  alt={listing.title}
  sizes="(max-width: 640px) 50vw, 25vw"
  // no priority — let browser decide
/>
```

### CLS (Cumulative Layout Shift) — filter panels and image carousels
```tsx
// Always declare aspect ratio on image containers — never let images reflow
<div className="relative aspect-[4/3] w-full">    // ← locks the space before image loads
  <Image src={...} fill />
</div>

// Filter panel opening — use CSS transitions, never mount/unmount
// Use height: auto with max-height transition, not display:none → display:block
```

### FID / INP (Interaction to Next Paint)
- Filter changes → debounce at 300ms before triggering navigation
- Search bar → debounce at 250ms before suggesting categories
- Favourite toggle → optimistic UI (update store immediately, sync to server after)

---

## POC → PROD URL Migration Checklist

The current POC uses cookie-based country detection with no country in the URL. Production requires `/in/` · `/gb/` · `/sg/` prefixes for SEO.

- [ ] Add `[country]` dynamic segment to all product routes
- [ ] Update middleware to validate country URL param + redirect `/` based on cookie
- [x] Add compound unique index `(countryCode + slug)` to listings (already in schema)
- [x] Implement `generateMetadata` with `canonical` + `hreflang` on `[country]/listings/page.tsx` — re-point at country-prefixed URLs once the segment is real
- [x] Add `metadataBase` to root `layout.tsx`
- [x] Create `sitemap.ts` (index) + `sitemap-{in,gb,sg}.xml/route.ts` per market — update URLs once country prefix lands
- [x] `robots.ts` implemented with AI-scraper block — update `disallow` entries once country prefix lands
- [x] Add JSON-LD `Product` + `BreadcrumbList` to listing detail page
- [ ] Add JSON-LD `WebSite` + `SearchAction` to home page (enables Google Sitelinks Search Box)
- [ ] 301 redirect old POC URLs → new country-prefixed URLs (middleware)
- [ ] Submit new sitemaps in Google Search Console per market
- [ ] Set up `NEXT_PUBLIC_APP_URL` to production domain in Vercel env vars

---

## Pages That Must Never Be Indexed — Already Handled

| Route | Mechanism |
|---|---|
| `/design-system/*` | `X-Robots-Tag: noindex` header in `next.config.ts` **+** `robots.ts` disallow |
| `/snippets/*` | Same (both header and disallow) |
| `/unsupported` | `robots.ts` disallow only — **no** `X-Robots-Tag` header (only `/design-system` and `/snippets` get the header in `next.config.ts`) |
| `/api/*` | `robots.ts` disallow |
| `/chat`, `/favourites`, `/myads`, `/profile`, `/switch-country`, `/delete-account`, `/donation-history` | `robots.ts` disallow, listed individually (no `/dashboard/` URL prefix exists to block as a group) — also auth-protected |

No action needed — already implemented.

---

## How This Skill Evolves — Self-Update Protocol

> **This file is a living document. Copilot updates it automatically — no instruction from the owner needed.**

### Triggers — update this file when any of these happen
- A new product route is added that needs metadata (`generateMetadata` pattern)
- The POC→PROD URL migration is executed (cookie → subdirectory routing)
- A new JSON-LD schema type is used on a page
- The sitemap generation is implemented or updated
- `robots.ts` is changed
- A new country market is added (beyond IN/GB/SG)
- A Core Web Vitals regression is found and a better pattern is identified
- A new `<Image>` usage pattern is established
- The owner confirms an SEO priority or decision that wasn't previously documented

### How to update
1. Edit the relevant section directly — keep it concise
2. Replace outdated patterns — never leave contradictions
3. Add a `> Updated: YYYY-MM-DD — [what changed and why]` note at the top of the changed section
4. Also update `md/architecture/seo-url-strategy.md` if the URL strategy changes

### What NOT to add
- Unconfirmed decisions — mark as `[PROPOSED]` if uncertain, confirm before merging into rules
- One-off patterns that don't generalise — if it happened once, it's not a convention yet
- Anything the owner has explicitly said NOT to do

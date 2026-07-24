# SEO & URL Architecture — LokalAds

> Confirmed decision: **Subdirectory-based multi-country URLs**  
> Last updated: 2026-07-07  
> Owner: Gopi · Confirmed: 2026-07-07

---

## Decision

**Use subdirectories for country segmentation:**

```
lokalads.com/in/          ← India
lokalads.com/gb/          ← United Kingdom
lokalads.com/sg/          ← Singapore
lokalads.com/au/          ← Australia (future)
```

---

## Why Subdirectory — and Why NOT the Others

### ❌ Option rejected: Subdomains (`in.lokalads.com`)

Google treats each subdomain as a **separate website**. Domain authority — earned through backlinks, content age, user trust signals — does not flow between `in.lokalads.com` and `gb.lokalads.com`. You would be building three weak domains in parallel instead of one strong one.

Additional costs:
- Separate SSL certificate management per subdomain
- 3× the crawl budget — Google allocates budget per domain, not per site
- Every backlink to `in.lokalads.com` does nothing for `gb.lokalads.com`
- More complex infrastructure — Next.js middleware must handle cross-subdomain routing

**Verdict: Wrong for a new marketplace. Works only for companies with existing global brand authority (e.g. Booking.com).**

---

### ❌ Option rejected: ccTLDs (`lokalads.in`, `lokalads.co.uk`, `lokalads.sg`)

Each ccTLD starts with **zero domain authority**. You are not building one brand — you are building three, each from scratch, each needing its own backlink strategy, content investment, and SEO campaign budget.

Additional costs:
- Buy and renew 3+ domains indefinitely
- Each domain needs independent DNS, SSL, monitoring
- No authority sharing — a viral listing on `lokalads.in` does nothing for `lokalads.co.uk`
- Google's ccTLD signal is a weak ranking factor — far outweighed by authority and relevance

**Verdict: Only makes sense if you have country-specific brand identity requirements (legal or marketing). LokalAds doesn't.**

---

### ❌ Option rejected: Cookie-based only (no country in URL)

All three markets serve from the same URLs (`lokalads.com/listings/...`), country is detected from a cookie. This is the current POC approach.

Problems:
- Google cannot crawl country-specific content — the bot has no cookie, sees only one version
- Duplicate content risk — same URLs serve different content per country = SEO penalty
- No `hreflang` possible — can't tell Google which version is for which country
- Sitemaps cannot represent country-scoped listings

**Verdict: Acceptable for a POC. Not acceptable for production SEO.**

---

### ✅ Option chosen: Subdirectory (`lokalads.com/in/`)

**One domain, one authority.** Every backlink to any page on `lokalads.com` — regardless of country — strengthens the entire site for all markets.

- Google's own [multi-regional guidelines](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites) recommend subdirectories when consolidating authority is the goal
- Single deployment — one Next.js app, one domain, country prefix in the URL
- `hreflang` works correctly — point each country URL to its alternates
- Clean sitemap per country
- Adding a new market = add the country config + middleware support. Zero infrastructure change.
- Domain authority compounds over time as all markets grow together

---

## URL Structure

```
# Home
lokalads.com/in/
lokalads.com/gb/
lokalads.com/sg/

# Browse / Search
lokalads.com/in/listings
lokalads.com/gb/listings?category=property&sub=to_rent

# Listing Detail
lokalads.com/in/listings/honda-city-delhi-2022
lokalads.com/gb/listings/3-bed-flat-zone-2-london
lokalads.com/sg/listings/iphone-14-pro-orchard-road

# Auth (no country prefix — account is global)
lokalads.com/register
lokalads.com/login

# Dashboard (no country prefix — account is global)
# ⚠️ NOTE: The (dashboard) route group in src/app/(dashboard)/ does NOT currently
# add a "/dashboard" URL segment — routes are just /favourites, /myads, /chat, etc.
# The paths below assume a future rename/restructure to add the literal prefix,
# which has not been decided or implemented. See src/app/robots.ts for the real
# current paths (individual routes listed, no shared "/dashboard/" prefix).
lokalads.com/dashboard/favourites
lokalads.com/dashboard/myads
lokalads.com/dashboard/chat

# Legal / About (no country prefix — shared)
lokalads.com/about
lokalads.com/privacy
lokalads.com/terms
```

---

## `hreflang` Implementation

Every country-scoped page must include `hreflang` alternates in `<head>`. Next.js App Router: add to the `metadata` export in each page.

```tsx
// app/[country]/listings/[slug]/page.tsx
export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://lokalads.com/${params.country}/listings/${params.slug}`,
      languages: {
        "en-IN": `https://lokalads.com/in/listings/${params.slug}`,
        "en-GB": `https://lokalads.com/gb/listings/${params.slug}`,
        "en-SG": `https://lokalads.com/sg/listings/${params.slug}`,
        "x-default": `https://lokalads.com/in/listings/${params.slug}`,
      },
    },
  }
}
```

> Note: Only include `hreflang` for countries where the listing actually exists (i.e. same slug across markets). For country-specific listings, only the canonical is needed.

---

## Sitemap Structure

```
lokalads.com/sitemap.xml              ← index pointing to country sitemaps
lokalads.com/sitemap-in.xml           ← all active Indian listings + category pages
lokalads.com/sitemap-gb.xml           ← all active UK listings + category pages
lokalads.com/sitemap-sg.xml           ← all active Singapore listings + category pages
```

Generated via `app/sitemap.ts` (Next.js App Router sitemap API). Query only `status: "active"` listings per country.

---

## Impact on Codebase

| Layer | Change | Detail |
|---|---|---|
| Next.js routes | Prefix all product routes | `app/[country]/listings/...` · `app/[country]/page.tsx` |
| Middleware | Validate `country` URL param | Must be a supported code — redirect `/` → `/in/` based on cookie/detection |
| DB slug | Compound unique index | `(countryCode + slug)` — not globally unique — **already updated in `01-schema.md`** |
| `<head>` | `canonical` + `hreflang` | On every `[country]` scoped page via `generateMetadata` |
| Sitemap | Country-scoped sitemaps | `app/sitemap-[country].ts` per market |
| Auth routes | No country prefix | Account is global — `/register`, `/login` stay at root |
| Dashboard routes | No country prefix | User context is global — dashboard pages stay at root (currently no shared `/dashboard/` URL prefix exists — see note above) |

---

## Route Redirect Rules (Middleware)

```
lokalads.com/                     → detect country → redirect /in/ or /gb/ or /sg/
lokalads.com/listings/...         → 301 redirect → /[detected-country]/listings/...
lokalads.com/[unknown-country]/   → 404 or redirect to /
```

The `SUPPORTED_CODES` constant in `lib/country-context.ts` is the single source of truth for valid country prefixes.

---

## robots.txt

> ⚠️ Illustrative only — does not match the real `src/app/robots.ts`, which lists each
> dashboard route individually (`/chat`, `/favourites`, `/myads`, `/profile`, etc.)
> rather than a blanket `/dashboard/` disallow, since no shared URL prefix exists today.
> See `.github/skills/la-seo/SKILL.md` for the current implementation.

```
User-agent: *
Allow: /in/
Allow: /gb/
Allow: /sg/
Disallow: /dashboard/
Disallow: /api/
Disallow: /design-system/
Disallow: /snippets/

Sitemap: https://lokalads.com/sitemap.xml
```

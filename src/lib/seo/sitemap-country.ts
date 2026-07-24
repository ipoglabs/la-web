import { SITE_URL } from "@/lib/constants";
import type { CountryCode } from "@/config";

/**
 * Builds the raw sitemap XML for a single country market.
 *
 * POC scope: only the URLs that actually exist today (country-prefixed
 * /listings index). Individual listing detail pages are NOT enumerated yet
 * because listings still come from mock data with no DB-backed country+slug
 * catalogue (see lib/models/Listing.ts — countryCode+slug index exists,
 * but no `.create()` call sites populate it yet — tracked separately).
 *
 * TODO [INTEGRATION]: once listings are DB-backed, enumerate active
 * documents for this country and append one <url> per listing, e.g.:
 *   const listings = await Listing.find({ countryCode: country, status: "active" })
 *     .select("slug updatedAt").lean();
 */
export function buildCountrySitemapXml(country: CountryCode): string {
  const urls: Array<{ loc: string; changefreq: string; priority: string }> = [
    { loc: `${SITE_URL}/${country}/listings`, changefreq: "daily", priority: "1.0" },
  ];

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

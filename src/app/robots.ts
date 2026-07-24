import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * Generates /robots.txt at build time.
 *
 * /design-system, /snippets, /unsupported — internal reference, never index
 * /api                                    — no public HTML, never index
 *
 * Dashboard routes (/chat, /favourites, /myads, /profile, /switch-country,
 * /delete-account, /donation-history) are listed individually — the
 * (dashboard) route group does NOT add a "/dashboard/" URL prefix in this
 * app, so a blanket "/dashboard/" disallow would not actually block them.
 *
 * AI training scrapers (GPTBot, CCBot, Amazonbot, anthropic-ai) are blocked
 * entirely via a separate rule, regardless of the general crawl rules.
 *
 * The X-Robots-Tag HTTP header in next.config.ts adds a second enforcement
 * layer for headless scrapers that skip robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["GPTBot", "CCBot", "Amazonbot", "anthropic-ai"],
        disallow: ["/"],
      },
      {
        userAgent: "*",
        allow: ["/in/", "/gb/", "/sg/"],
        disallow: [
          "/design-system/",
          "/snippets/",
          "/unsupported/",
          "/api/",
          "/chat",
          "/favourites",
          "/myads",
          "/profile",
          "/switch-country",
          "/delete-account",
          "/donation-history",
        ],
      },
    ],
    // Sitemap only lists public pages — internal/private paths are omitted by default
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}


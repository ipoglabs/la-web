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
 *
 * SITE_INDEXABLE gate: until production is ready to go live, everything is
 * disallowed regardless of the rules above — flip SITE_INDEXABLE=true (Vercel
 * env + .env.local) to switch back to the real per-path rules. See also the
 * `robots` field on metadata in app/layout.tsx, which mirrors this gate.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE !== "true") {
    return {
      rules: { userAgent: "*", disallow: "/" },
      host: SITE_URL,
    };
  }

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


import type { NextConfig } from "next";

/**
 * X-Robots-Tag headers for internal reference routes.
 *
 * This is a second enforcement layer on top of robots.txt:
 *   - Works for headless crawlers that skip robots.txt
 *   - Works for AI training scrapers (GPTBot, CCBot, Amazonbot, etc.)
 *   - Works even if the HTML is never parsed
 *
 * noindex     — don't add to search index
 * nofollow    — don't follow links on these pages
 * noarchive   — don't cache / show a cached version
 * noimageindex — don't index images on these pages
 */
const NOINDEX_HEADER = {
  key: "X-Robots-Tag",
  value: "noindex, nofollow, noarchive, noimageindex",
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/design-system/:path*",
        headers: [NOINDEX_HEADER],
      },
      {
        source: "/snippets/:path*",
        headers: [NOINDEX_HEADER],
      },
    ];
  },
};

export default nextConfig;

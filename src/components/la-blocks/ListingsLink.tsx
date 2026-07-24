"use client";

/**
 * ListingsLink — country-aware wrapper around next/link for internal links
 * into the listings surface (e.g. "/listings", "/listings?cat=property").
 *
 * Prepends the active country segment (/in/, /gb/, /sg/) from useCountryConfig()
 * so every entry point into listings stays consistent with the country-prefixed
 * URL structure — part of the POC→PROD SEO URL migration
 * (see .github/skills/la-seo/SKILL.md, Phase 3 — 2026-07-13).
 *
 * Use this instead of a raw <Link> whenever a Server Component page (which has
 * no access to useCountryConfig()) needs to link into /listings — this small
 * leaf opts into client rendering, the rest of the page stays server-rendered.
 *
 * `href` must start with "/listings" to be prefixed — anything else passes
 * straight through to next/link unchanged.
 *
 * Usage: <ListingsLink href="/listings" className="...">Browse Listings</ListingsLink>
 */
import Link from "next/link";
import type { ComponentProps } from "react";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

type NextLinkProps = ComponentProps<typeof Link>;

export function ListingsLink({ href, ...rest }: NextLinkProps) {
  const { countryCode } = useCountryConfig();
  const resolvedHref =
    typeof href === "string" && href.startsWith("/listings")
      ? `/${countryCode}${href}`
      : href;
  return <Link href={resolvedHref} {...rest} />;
}

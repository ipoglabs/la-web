"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { COUNTRY_CONFIGS, type CountryCode } from "@/config";

// The context stores the ISO 3166-1 alpha-2 code as a plain string (e.g. "IN", "GB", "SG").
// Use useCountryConfig() from @/lib/hooks/useCountryConfig for the full config + type-safe key.
const CountryContext = createContext<string | null>(null);

/**
 * Country-prefixed URLs (/in/, /uk/, /sg/) are the source of truth for country.
 * Root layout is a server component and does NOT re-render on <Link> soft
 * navigation, so its `country` prop can go stale (e.g. navigating from
 * /in/listings to /uk/listings client-side). Reading the URL here — in a
 * client component that re-renders on every route change — keeps the active
 * country correct without needing a new layout.tsx or a full page reload.
 */
function getIsoFromUrlSegment(pathname: string): string | null {
  const segment = pathname.split("/")[1]?.toLowerCase();
  if (!segment) return null;
  const code = COUNTRY_CONFIGS[segment as CountryCode] ? (segment as CountryCode) : null;
  return code ? COUNTRY_CONFIGS[code].isoCode : null;
}

export function CountryProvider({
  country,
  children,
}: {
  country: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const urlIso = useMemo(() => getIsoFromUrlSegment(pathname), [pathname]);
  const activeCountry = urlIso ?? country;

  return (
    <CountryContext.Provider value={activeCountry}>
      {children}
    </CountryContext.Provider>
  );
}

/** Returns the active ISO country code (e.g. "IN", "GB", "SG"). */
export function useCountry(): string {
  const ctx = useContext(CountryContext);
  if (!ctx) throw new Error("useCountry must be used inside CountryProvider");
  return ctx;
}

"use client";

import { createContext, useContext } from "react";

// The context stores the ISO 3166-1 alpha-2 code as a plain string (e.g. "IN", "GB", "SG").
// Use useCountryConfig() from @/lib/hooks/useCountryConfig for the full config + type-safe key.
const CountryContext = createContext<string | null>(null);

export function CountryProvider({
  country,
  children,
}: {
  country: string;
  children: React.ReactNode;
}) {
  return (
    <CountryContext.Provider value={country}>
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

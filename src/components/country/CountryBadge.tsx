"use client";

import { useCountry } from "@/components/country/CountryProvider";
import { COUNTRIES } from "@/lib/data/countries";

export function CountryBadge() {
  const code = useCountry();
  const country = COUNTRIES.find((c) => c.code === code);
  if (!country) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span>{country.flag}</span>
      <span className="font-medium text-foreground">{country.name}</span>
    </div>
  );
}

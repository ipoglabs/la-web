import { useCountryStore } from "@/store/countryStore";
import type { Country } from "@/components/phone-number-input/countries";

// Returns the current market country, or null before the cookie has been read.
export function useUserCountry(): Country | null {
  return useCountryStore((s) => s.country);
}

// Use this when you need to update the market country (e.g. from a "Change country" link).
export function useSetUserCountry(): (c: Country) => void {
  return useCountryStore((s) => s.setCountry);
}

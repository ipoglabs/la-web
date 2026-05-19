import { create } from "zustand";
import { COUNTRIES, type Country } from "@/components/phone-number-input/countries";

const COOKIE_NAME    = "user_country";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function readCookieCountry(): Country | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )user_country=([^;]*)/);
  const code  = match ? decodeURIComponent(match[1]) : "";
  return COUNTRIES.find((c) => c.code === code) ?? null;
}

function writeCookieCountry(code: string) {
  document.cookie = `${COOKIE_NAME}=${code}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

type CountryStore = {
  country: Country | null;   // null until cookie is read
  setCountry: (c: Country) => void;
  initFromCookie: () => void;
};

export const useCountryStore = create<CountryStore>()((set) => ({
  country: null,
  setCountry: (country) => {
    writeCookieCountry(country.code);
    set({ country });
  },
  initFromCookie: () => set({ country: readCookieCountry() }),
}));

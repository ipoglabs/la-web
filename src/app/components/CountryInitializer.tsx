"use client";

import { useEffect } from "react";
import { useCountryStore } from "@/store/countryStore";

// Renders nothing — runs once on mount to hydrate the country store from the cookie.
// Placed in the root layout so it runs on every page load.
export function CountryInitializer() {
  const initFromCookie = useCountryStore((s) => s.initFromCookie);
  useEffect(() => { initFromCookie(); }, [initFromCookie]);
  return null;
}

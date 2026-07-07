"use client";

/**
 * src/hooks/useCountryConfig.ts
 *
 * ⚠️ LEGACY SHIM — kept only so existing call sites don't all need touching at once.
 *
 * This used to be a self-contained hook backed by a Zustand store (useCountryStore)
 * and `getCountryConfig()` from "@/config/countries". That aggregator function was
 * never actually exported from "@/config/countries" (only per-country files
 * in.ts / sg.ts / uk.ts live there) — so this hook was silently broken and, whenever
 * it did resolve, defaulted to `"SG"` regardless of the visitor's real country.
 *
 * The real source of truth is the cookie-driven system in:
 *   - src/lib/hooks/useCountryConfig.ts   (reads CountryProvider context)
 *   - src/components/country/CountryProvider.tsx
 *   - src/app/layout.tsx                 (seeds the context from the `countryContext` cookie)
 *
 * This shim now delegates to that system so every existing `import { useCountryConfig }
 * from "@/hooks/useCountryConfig"` call site (forms, posting flows, etc.) automatically
 * gets the correct, live country — no per-file changes required.
 *
 * TODO: migrate call sites to import directly from "@/lib/hooks/useCountryConfig" and
 * destructure `.config`, then delete this file along with src/store/countryStore.ts.
 */

import { useCountryConfig as useCountryConfigFromContext } from "@/lib/hooks/useCountryConfig";
import type { CountryConfig } from "@/config/types";

export function useCountryConfig(): CountryConfig {
  const { config } = useCountryConfigFromContext();
  return config;
}
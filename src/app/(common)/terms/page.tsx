import { readFileSync } from "fs";
import path from "path";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { COUNTRY_COOKIE, isAllowedCountry } from "@/lib/country-context";
import { getConfigByIso } from "@/config";
import type { CountryCode } from "@/config/types";

export const metadata: Metadata = {
  title: "Terms & Conditions | lokalads",
  description: "The terms that govern your use of the lokalads platform.",
};

// Static literal paths (not interpolated) so Next's file tracer bundles
// these into the deployed function — a dynamically built path can be missed.
const TERMS_HTML: Record<CountryCode, string> = {
  in: readFileSync(path.join(process.cwd(), "public/html/in/terms.html"), "utf-8"),
  gb: readFileSync(path.join(process.cwd(), "public/html/gb/terms.html"), "utf-8"),
  sg: readFileSync(path.join(process.cwd(), "public/html/sg/terms.html"), "utf-8"),
};

export default async function TermsAndConditions() {
  const jar = await cookies();
  const raw = jar.get(COUNTRY_COOKIE)?.value ?? "";
  const entry = isAllowedCountry(raw) ? getConfigByIso(raw) : null;
  const countryCode = entry?.code ?? "in";

  return (
    <div className="container-app py-12 max-w-3xl">
      <div className="la-legal" dangerouslySetInnerHTML={{ __html: TERMS_HTML[countryCode] }} />
    </div>
  );
}

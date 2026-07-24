import type { Metadata } from "next";
import { COUNTRY_CONFIGS, type CountryCode } from "@/config";
import { SITE_URL } from "@/lib/constants";

export { default } from "@/app/(main)/listings/page";

interface Props {
  params: Promise<{ country: string }>;
}

function isCountryCode(value: string): value is CountryCode {
  return value in COUNTRY_CONFIGS;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!isCountryCode(country)) {
    return { title: "Listings" };
  }

  const label = COUNTRY_CONFIGS[country].displayName;
  const path = (code: CountryCode) => `${SITE_URL}/${code}/listings`;

  return {
    title: `Buy & Sell Locally in ${label}`,
    description: `Browse classified listings in ${label} — property, jobs, vehicles, and more on LokalAds.`,
    alternates: {
      canonical: path(country),
      languages: {
        "en-IN": path("in"),
        "en-GB": path("gb"),
        "en-SG": path("sg"),
        "x-default": path("in"),
      },
    },
  };
}


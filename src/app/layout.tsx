import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { COUNTRY_COOKIE, BLOCKED_COOKIE, isAllowedCountry } from "@/lib/country-context";
import { getConfigByIso, COUNTRY_CONFIGS } from "@/config";
import type { CountryCode } from "@/config/types";
import { CATEGORY_LABELS } from "@/lib/category-map";
import { TOP_LOCATIONS_BY_COUNTRY } from "@/lib/mock/footer-locations";
import type { NavLink } from "@/components/la-blocks/AppFooter";
import { SITE_URL } from "@/lib/constants";
import { CountryProvider } from "@/components/country/CountryProvider";
import { CountryDetector } from "@/components/country/CountryDetector";
import { OverlayCountrySelect } from "@/components/overlay-country-select";
import Toaster from "@/components/ui/sonner";
import AppHeader from "@/components/la-blocks/AppHeader";
import AppFooter from "@/components/la-blocks/AppFooter";
import { getSession } from "@/lib/session";
import { BrowserGuard } from "@/components/browser-guard/BrowserGuard";

/**
 * Footer nav content is derived per-country from real config (enabledCategories)
 * and mock data (footer-locations.ts) — no hardcoded India-only lists.
 * TODO [INTEGRATION]: once a real "top categories/locations by traffic" API
 * exists, replace these derivations with a server-fetched call; the shape
 * (NavLink[]) is designed to stay the same either way.
 */
function getPopularCategories(countryCode: CountryCode): NavLink[] {
  const enabled = COUNTRY_CONFIGS[countryCode].enabledCategories;
  return enabled.slice(0, 5).map((id) => ({
    label: CATEGORY_LABELS[id] ?? id,
    href: `/${countryCode}/listings?cat=${id}`,
  }));
}

function getTopLocations(countryCode: CountryCode): NavLink[] {
  const locations = TOP_LOCATIONS_BY_COUNTRY[countryCode] ?? [];
  return locations.map((loc) => ({
    label: loc.label,
    href: `/${countryCode}/listings?loc=${loc.slug}`,
  }));
}

const inter = localFont({
  src: [
    { path: "../../public/assets/fonts/inter/InterVariable.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterVariable-Italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const interDisplay = localFont({
  src: [
    { path: "../../public/assets/fonts/inter/InterDisplay-Thin.woff2", weight: "100", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-ThinItalic.woff2", weight: "100", style: "italic" },
    { path: "../../public/assets/fonts/inter/InterDisplay-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-ExtraLightItalic.woff2", weight: "200", style: "italic" },
    { path: "../../public/assets/fonts/inter/InterDisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "../../public/assets/fonts/inter/InterDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/assets/fonts/inter/InterDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/assets/fonts/inter/InterDisplay-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../../public/assets/fonts/inter/InterDisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "../../public/assets/fonts/inter/InterDisplay-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-ExtraBoldItalic.woff2", weight: "800", style: "italic" },
    { path: "../../public/assets/fonts/inter/InterDisplay-Black.woff2", weight: "900", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterDisplay-BlackItalic.woff2", weight: "900", style: "italic" },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LokalAds — Buy & Sell Locally",
    template: "%s | LokalAds",
  },
  description: "The classifieds marketplace for India, United Kingdom, and Singapore.",
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reqHeaders = await headers();
  const isBareLayout   = reqHeaders.get("x-bare-layout")   === "1";

  // Bare routes (/unsupported) skip the full app shell entirely.
  // No country detection, no header/footer — just the page content.
  if (isBareLayout) {
    return (
      <html
        lang="en"
        className={`${inter.variable} ${interDisplay.variable} h-full antialiased`}
      >
        <body>{children}</body>
      </html>
    );
  }

  const jar = await cookies();
  // Country-prefixed URLs (/in/, /gb/, /sg/) set this header in middleware —
  // it always wins over the cookie so the very first server render already
  // reflects the URL's country (no flash of the wrong country on hard nav).
  const urlCountryIso = reqHeaders.get("x-url-country") ?? "";
  const raw         = urlCountryIso || (jar.get(COUNTRY_COOKIE)?.value ?? "");
  const blockedCode = jar.get(BLOCKED_COOKIE)?.value ?? "";
  const allowed     = isAllowedCountry(raw);
  const countryEntry = allowed ? getConfigByIso(raw) : null;
  const countryCode  = countryEntry?.code ?? "in";
  const countryLabel = countryEntry?.config.displayName ?? "";
  const user = await getSession();

  // Footer nav content — resolved per the active country, not hardcoded.
  const popularCategories = getPopularCategories(countryCode);
  const topLocations = getTopLocations(countryCode);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${interDisplay.variable} h-full antialiased`}
    >
      <body className="bg-stone-900/5 min-w-93.75 lg:min-w-240">
        <BrowserGuard>
          {allowed ? (
            <CountryProvider country={raw}>

              <div className="min-h-screen flex flex-col">
                {/* No variant prop — both self-derive it from the live
                    pathname (see AppHeader.tsx / AppFooter.tsx), so the
                    simple/default switch is correct on soft navigation too,
                    not just on the first server-rendered request. */}
                <AppHeader user={user} />
                <main className="flex-1">{children}</main>
                <AppFooter
                  countryCode={countryCode}
                  countryLabel={countryLabel}
                  popularCategories={popularCategories}
                  topLocations={topLocations}
                />
              </div>

              <Toaster />
            </CountryProvider>
          ) : blockedCode ? (
            // Country was positively detected but is not one we serve.
            // Show contextual picker overlay with a banner explaining which countries are available.
            <>
              <OverlayCountrySelect detectedCountry={blockedCode} />
              <Toaster />
            </>
          ) : (
            // No country signal yet — client will run IP detection (CountryDetector).
            <>
              <CountryDetector />
              <Toaster />
            </>
          )}
        </BrowserGuard>
      </body>
    </html>
  );
}
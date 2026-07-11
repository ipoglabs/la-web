import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { COUNTRY_COOKIE, BLOCKED_COOKIE, isAllowedCountry } from "@/lib/country-context";
import { getConfigByIso } from "@/config";
import { CountryProvider } from "@/components/country/CountryProvider";
import { CountryDetector } from "@/components/country/CountryDetector";
import { OverlayCountrySelect } from "@/components/overlay-country-select";
import Toaster from "@/components/ui/sonner";
import AppHeader from "@/components/la-blocks/AppHeader";
import AppFooter from "@/components/la-blocks/AppFooter";
import { getSession } from "@/lib/session";
import { BrowserGuard } from "@/components/browser-guard/BrowserGuard";

const popularCategories = [
  // TODO(content): Drive these from COUNTRY_CONFIGS.enabledCategories per active country
  // rather than a hardcoded list. In the interim these are India-defaults.
  { label: "Property", href: "/listing?cat=property" },
  { label: "Jobs", href: "/listing?cat=jobs" },
  { label: "For Sale", href: "/listing?cat=for-sale" },
  { label: "Motors", href: "/listing?cat=motors" },
  { label: "Services", href: "/listing?cat=services" },
];

const topLocations = [
  // TODO(content): Replace with country-appropriate top locations.
  // India: Bengaluru, Mumbai, Delhi, Chennai, Hyderabad
  // UK: London, Manchester, Birmingham, Leeds, Glasgow
  // SG: Singapore (single city-state — remove picker entirely or use neighbourhoods)
  { label: "Bengaluru", href: "/listing?loc=bengaluru" },
  { label: "Mumbai", href: "/listing?loc=mumbai" },
  { label: "Delhi", href: "/listing?loc=delhi" },
  { label: "Chennai", href: "/listing?loc=chennai" },
  { label: "Hyderabad", href: "/listing?loc=hyderabad" },
];

const inter = localFont({
  src: [
    { path: "../../public/assets/fonts/inter/InterVariable.woff2", style: "normal" },
    { path: "../../public/assets/fonts/inter/InterVariable-Italic.woff2", style: "italic" },
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
  title: "poc-next",
  description: "UI/UX playground — components and experiments",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reqHeaders = await headers();
  const isBareLayout = reqHeaders.get("x-bare-layout") === "1";

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
  const raw         = jar.get(COUNTRY_COOKIE)?.value ?? "";
  const blockedCode = jar.get(BLOCKED_COOKIE)?.value ?? "";
  const allowed     = isAllowedCountry(raw);
  const countryEntry = allowed ? getConfigByIso(raw) : null;
  const countryCode  = countryEntry?.code ?? "in";
  const countryLabel = countryEntry?.config.displayName ?? "";
  const user = await getSession();

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
                <AppHeader variant="default" user={user} />
                <main className="flex-1">{children}</main>
                <AppFooter
                  countryCode={countryCode}
                  countryLabel={countryLabel}
                  variant="default"
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

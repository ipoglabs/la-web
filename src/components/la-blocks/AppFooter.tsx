"use client";

/**
 * AppFooter — la design system common application footer.
 *
 * Variants:
 *   "default" — full footer: collapsible nav + social icons + legal + optional donation banner
 *   "simple"  — minimal footer: logo + tagline + legal + optional donation banner (no nav toggle)
 *
 * Usage:
 *   <AppFooter countryCode="in" countryLabel="India" />
 *   <AppFooter countryCode="uk" countryLabel="UK" variant="simple" />
 *
 * countryCode drives feature flags (e.g. donation banner) via COUNTRY_CONFIGS.
 * countryLabel is display-only — pass it from your country context/session.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Solid_Heart_24by24 } from "@/components/icons/la-icons";
import { getFeatures, COUNTRY_CONFIGS, type CountryCode } from "@/config";
import { LegalDrawer } from "@/components/la-blocks/LegalDrawer";
import { FeedbackPopup } from "@/components/feedback";
import { TimelineSheet } from "@/components/la-blocks/TimelineSheet";
import { isSimpleLayoutRoute, isNoFooterRoute } from "@/lib/layout-routes";

export type AppFooterVariant = "default" | "simple";

export interface NavLink {
  label: string;
  href: string;
  badge?: string;
}

interface AppFooterProps {
  /** ISO country code — used to resolve feature flags from country-config */
  countryCode: CountryCode;
  /** Country name shown beneath the logo (e.g. "India", "UK") */
  countryLabel?: string;
  /** "default" shows collapsible nav + social icons. "simple" shows logo + tagline + legal only. Defaults to "default". */
  variant?: AppFooterVariant;
  /** Popular categories to show in the nav grid. Optional — column hidden if omitted. */
  popularCategories?: NavLink[];
  /** Top locations to show in the nav grid. Optional — column hidden if omitted. */
  topLocations?: NavLink[];
}

/** Reusable social icon row — caller controls display via className */
function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-row gap-2", className)}>
      {/* TODO: real profile URLs — Instagram/LinkedIn/YouTube still placeholders (no accounts yet) */}
      <a href="#" aria-label="Instagram" className="size-9 shrink-0 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-colors">
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.86.061-1.17.255-1.814.42-2.236.21-.57.479-.96.9-1.379.419-.419.81-.689 1.379-.899.42-.166 1.051-.36 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </svg>
      </a>
      <a href="https://www.facebook.com/lokaladscom/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="size-9 shrink-0 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-colors">
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 1.998-.287 1.669h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
        </svg>
      </a>
      <a href="#" aria-label="LinkedIn" className="size-9 shrink-0 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-colors">
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
      <a href="#" aria-label="YouTube" className="size-9 shrink-0 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-colors">
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </a>
    </div>
  );
}

export default function AppFooter({ countryCode, countryLabel, variant, popularCategories, topLocations }: AppFooterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const pathname = usePathname();

  // These routes own a fixed, full-height layout (e.g. /chat's header/list/
  // composer shell) — stacking the footer below would push the page taller
  // than one viewport, forcing a scroll to reach always-visible content.
  if (isNoFooterRoute(pathname)) return null;

  // Derived from the live pathname so it's correct on soft navigation in
  // both directions (see AppHeader.tsx for the full rationale — same
  // shared route list). `variant` still works as an explicit override for
  // callers that pass it directly (e.g. /snippets/app-shell, /feedback).
  const effectiveVariant = variant ?? (isSimpleLayoutRoute(pathname) ? "simple" : "default");

  const features = getFeatures(countryCode);
  const { companyName, companyRegNo } = COUNTRY_CONFIGS[countryCode];
  const colCount = 2 + (popularCategories?.length ? 1 : 0) + (topLocations?.length ? 1 : 0);
  const gridColsClass = colCount === 4 ? "md:grid-cols-4" : colCount === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <footer className="bg-slate-800 border-t-4 border-rose-500">

      <div className="container-app">

        {/* Header: two-row layout — Row 1: Logo | circles (desktop) | toggle. Row 2: tagline */}
        <div className="flex flex-col gap-1.5 py-4">

          {/* Row 1 */}
          <div className="flex items-center gap-3">
            <Link className="flex gap-2 items-center shrink-0" href="/">
              <Image className="size-11" src="/assets/la-logo-symbol-black.svg" alt="lokalads logo" width={44} height={44} />
              <div className="relative">
                <Image className="w-24 h-auto" src="/assets/la-text-white.svg" alt="lokalads" width={96} height={24} />
                {countryLabel && (
                  <span className="absolute right-0 -bottom-3.5 text-[10px] font-normal text-white whitespace-nowrap subpixel-antialiased">{countryLabel}</span>
                )}
              </div>
            </Link>

            <div className="flex-1" />

            {/* Social icons — always visible on desktop */}
            <SocialLinks className="hidden md:flex" />

            {/* Toggle — default variant only */}
            {effectiveVariant === "default" && (
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-controls="footer-nav"
              aria-label={isOpen ? "Collapse footer navigation" : "Expand footer navigation"}
              className="size-10 shrink-0 flex items-center justify-center text-white rounded hover:bg-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                stroke="currentColor" className={cn("h-5 w-5", isOpen && "hidden")}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                stroke="currentColor" className={cn("h-5 w-5", !isOpen && "hidden")}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            )}
          </div>

          {/* Row 2: tagline */}
          <p className="text-slate-300 text-sm font-normal">
            find anything, anywhere with care...
          </p>

        </div>

        {/* Nav columns — always in DOM for aria-controls; hidden/shown via class */}
        <div id="footer-nav" className={cn("grid-cols-2 gap-y-1 pt-2 pb-2", gridColsClass, isOpen ? "grid" : "hidden")}>
          <div className="mb-5">
            <div className="mb-2 text-sm text-slate-200 font-bold">Resources</div>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/tutorials">Tutorials</Link>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/faq">Frequent Questions</Link>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/support">
              Support <span className="text-teal-200 text-sm px-1">New</span>
            </Link>
          </div>
          {popularCategories && popularCategories.length > 0 && (
            <div className="mb-5">
              <div className="mb-2 text-sm text-slate-200 font-bold">Popular Category</div>
              {popularCategories.map((item) => (
                <Link key={item.href} className="my-1 flex items-center gap-1 text-sm text-slate-200 hover:text-white transition-colors" href={item.href}>
                  {item.label}
                  {item.badge && <span className="text-teal-200 text-sm px-1">{item.badge}</span>}
                </Link>
              ))}
            </div>
          )}
          {topLocations && topLocations.length > 0 && (
            <div className="mb-5">
              <div className="mb-2 text-sm text-slate-200 font-bold">Top Locations</div>
              {topLocations.map((item) => (
                <Link key={item.href} className="my-1 flex items-center gap-1 text-sm text-slate-200 hover:text-white transition-colors" href={item.href}>
                  {item.label}
                  {item.badge && <span className="text-teal-200 text-sm px-1">{item.badge}</span>}
                </Link>
              ))}
            </div>
          )}
          <div className="mb-5">
            <div className="mb-2 text-sm text-slate-200 font-bold">About Us</div>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/about">About lokalads</Link>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/team">Our Team</Link>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/why">Why Advertise?</Link>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/career">Careers</Link>
            <TimelineSheet>
              <span className="my-1 block text-sm text-slate-200 hover:text-white transition-colors">Timeline</span>
            </TimelineSheet>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/contact">
              Contact <span className="text-teal-200 text-sm px-1">New</span>
            </Link>
            <Link className="my-1 block text-sm text-slate-200 hover:text-white transition-colors" href="/our-locations">
              Our Locations <span className="text-teal-200 text-sm px-1">New</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Separator + legal — always visible */}
      <div className="flex flex-col items-center pb-3 container mx-auto px-4 max-w-5xl">
        {/* Social icons — mobile only, above separator */}
        <SocialLinks className="flex md:hidden mb-3" />
        <hr className="w-full max-w-sm h-px border-slate-500 mb-2" />
        <div className="flex flex-col items-center gap-1 py-1 text-slate-300 text-center">
          {/* Line 1 — company info */}
          <p className="text-sm">
            &copy;&nbsp;2025 {companyName} | Co. Reg. No. {companyRegNo}.
          </p>
          {/* Line 2 — links */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-y-0.5">
            <span className="inline-flex items-center">
              <LegalDrawer countryCode={countryCode} type="privacy-policy">
                <button type="button" className="text-sm text-slate-300 hover:text-white transition-colors">Privacy Policy</button>
              </LegalDrawer>
              <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-slate-300 mx-2"><circle cx="1" cy="1" r="1" /></svg>
            </span>
            <span className="inline-flex items-center">
              <LegalDrawer countryCode={countryCode} type="terms">
                <button type="button" className="text-sm text-slate-300 hover:text-white transition-colors">Terms &amp; Conditions</button>
              </LegalDrawer>
              <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-slate-300 mx-2"><circle cx="1" cy="1" r="1" /></svg>
            </span>
            <span className="inline-flex items-center">
              <LegalDrawer countryCode={countryCode} type="cookie-policy">
                <button type="button" className="text-sm text-slate-300 hover:text-white transition-colors">Cookie Policy</button>
              </LegalDrawer>
              <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-slate-300 mx-2"><circle cx="1" cy="1" r="1" /></svg>
            </span>
            <span className="inline-flex items-center">
              <TimelineSheet>
                <span className="text-sm text-teal-300 hover:text-teal-100 transition-colors cursor-pointer">Timeline</span>
              </TimelineSheet>
              <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-slate-300 mx-2"><circle cx="1" cy="1" r="1" /></svg>
            </span>
            <button type="button" onClick={() => setFeedbackOpen(true)} className="text-sm text-teal-300 hover:text-teal-100 transition-colors">Feedback</button>
          </div>
        </div>
      </div>

      {/* Donation banner — controlled by features.donationFooter in country-config;
          hidden on "simple" variant (login/register/signup) since a growth/goodwill
          CTA has no place on a conversion-critical single-purpose screen. */}
      {features.donationFooter && effectiveVariant === "default" && (
        <div className="bg-white">
          <div className="container-app py-3 flex flex-col sm:flex-row flex-wrap gap-3 items-center justify-center text-center max-w-5xl">
            <p className="text-lg text-slate-700 italic">&ldquo;Your support makes lokalads possible. Lets grow together!&rdquo;</p>
            <Link
              href="/donate"
              className="shrink-0 pl-5 pr-1.5 py-1.5 border border-yellow-500 bg-yellow-400 hover:bg-yellow-500 rounded-full text-lg text-yellow-900 font-semibold flex items-center justify-center gap-3 transition-colors"
            >
              <span>Support Lokalads</span>
              <span className="size-9 rounded-full bg-yellow-600 flex items-center justify-center shrink-0">
                <Solid_Heart_24by24 className="h-6 w-6 text-white" />
              </span>
            </Link>
          </div>
        </div>
      )}

      <FeedbackPopup open={feedbackOpen} onOpenChange={setFeedbackOpen} journey="footer" />

    </footer>
  );
}

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
import { isSimpleLayoutRoute } from "@/lib/layout-routes";

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
      <a href="#" aria-label="Twitter / X" className="size-9 shrink-0 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-colors">
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {/* Do not add PATH Now */}
        </svg>
      </a>
      <a href="#" aria-label="Facebook" className="size-9 shrink-0 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-colors">
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {/* Do not add PATH Now */}
        </svg>
      </a>
      <a href="#" aria-label="YouTube" className="size-9 shrink-0 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-colors">
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {/* Do not add PATH Now */}
        </svg>
      </a>
      <a href="#" aria-label="LinkedIn" className="size-9 shrink-0 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center text-white transition-colors">
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {/* Do not add PATH Now */}
        </svg>
      </a>
    </div>
  );
}

export default function AppFooter({ countryCode, countryLabel, variant, popularCategories, topLocations }: AppFooterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const pathname = usePathname();

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

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreateAlertDialog } from "@/components/create-alert";
import { LaButton } from "@/components/la/la-button";
import { CircleArrowLeft } from "lucide-react";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";

interface ListingDetailNavBandProps {
  /** Raw category key — e.g. "property" — used to build breadcrumb URLs */
  cat?: string;
  /** Raw subcategory key — e.g. "to_rent" — used to build breadcrumb URLs */
  sub?: string;
  /** Display label for category — e.g. "Property" */
  catLabel?: string;
  /** Display label for subcategory — e.g. "To Rent" */
  subLabel?: string;
}

export default function ListingDetailNavBand({
  cat, sub, catLabel, subLabel,
}: ListingDetailNavBandProps) {
  const router = useRouter();
  const { countryCode } = useCountryConfig();
  const [alertOpen, setAlertOpen] = useState(false);

  const backHref = cat && sub
    ? `/${countryCode}/listings?cat=${cat}&sub=${sub}`
    : cat
    ? `/${countryCode}/listings?cat=${cat}`
    : `/${countryCode}/listings`;

  return (
    <div className="bg-slate-800">
      <div className="container-app h-9 flex items-center gap-2">

        {/* ── ← Back ───────────────────────────────────────────────────── */}
        <LaButton
          intent="ghost"
          size="compact"
          onClick={() => router.back()}
          className="shrink-0 text-slate-300 hover:text-white hover:bg-white/10"
        >
          <CircleArrowLeft className="size-4 shrink-0" aria-hidden="true" />
          <span className="max-sm:hidden">Back to results</span>
        </LaButton>

        {/* Pipe divider — desktop only */}
        <span className="hidden sm:block text-slate-600 select-none" aria-hidden="true">|</span>

        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <nav aria-label="Listing breadcrumb" className="hidden sm:flex flex-1 min-w-0 items-center gap-1 text-sm">
          <Link href="/" className="text-white/60 hover:text-white transition-colors shrink-0">
            Home
          </Link>

          {catLabel && (
            <>
              <span className="text-white/40 select-none" aria-hidden="true">›</span>
              <Link
                href={`/${countryCode}/listings?cat=${cat}`}
                className="text-white/60 hover:text-white transition-colors min-w-0 truncate"
              >
                {catLabel}
              </Link>
            </>
          )}

          {subLabel && (
            <>
              <span className="text-white select-none" aria-hidden="true">›</span>
              <Link
                href={backHref}
                className="text-white hover:text-slate-200 transition-colors min-w-0 truncate"
              >
                {subLabel}
              </Link>
            </>
          )}
        </nav>

        {/* Spacer — fills gap on mobile where breadcrumb is hidden */}
        <div className={cn("flex-1", "sm:hidden")} />

        {/* ── 🔔 Create Alert ──────────────────────────────────────────── */}
        <LaButton
          intent="ghost"
          size="compact"
          onClick={() => setAlertOpen(true)}
          aria-label="Create alert"
          className="shrink-0 text-white bg-white/10 hover:bg-white/20"
        >
          {/* Bell icon (Heroicons 20 mini) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            className="size-4 shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M4 8a6 6 0 1 1 12 0c0 1.887.454 3.665 1.257 5.234a.75.75 0 0 1-.515 1.076 32.903 32.903 0 0 1-3.256.508 3.5 3.5 0 0 1-6.972 0 32.91 32.91 0 0 1-3.256-.508.75.75 0 0 1-.515-1.076A11.448 11.448 0 0 0 4 8Zm6 9.938A2.001 2.001 0 0 1 8.001 16H8a2 2 0 0 0 2 2 2 2 0 0 0 2-2h-.001A2.001 2.001 0 0 1 10 17.938Z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Create Alert</span>
        </LaButton>

      </div>

      <CreateAlertDialog open={alertOpen} onOpenChange={setAlertOpen} />
    </div>
  );
}



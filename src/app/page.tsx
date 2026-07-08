"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import CategoryGrid from "@/components/la-blocks/CategoryGrid";
import { CreateAlertBanner, CreateAlertDialog } from "@/components/create-alert";
import { CATEGORIES } from "@/config/categories";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { LaSearchBar, type SearchQuery } from "@/components/la-search-bar";
import { LocationPicker, type LocationValue } from "@/components/location-picker";
import StatsSection from "./components/HomeComponents/statsSection";

export default function Home() {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [pickedLocation, setPickedLocation] = React.useState<LocationValue | null>(null);
  const { config: countryConfig } = useCountryConfig();

  const visibleCategories = countryConfig.enabledCategories
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter((c) => c !== undefined);
  // TODO [INTEGRATION]: Replace above derived list with a server-fetched category order.
  // API shape expected: GET /api/categories?country={countryCode} → CategoryItem[]
  // The API can also drive featured/trending ordering per country dynamically.

  function handleSearch(q: SearchQuery) {
    const params = new URLSearchParams();
    if (q.keyword?.trim())  params.set("q",   q.keyword.trim());
    if (q.scope?.cat)       params.set("cat", q.scope.cat);
    if (q.scope?.sub)       params.set("sub", q.scope.sub);
    const loc = pickedLocation;
    if (loc?.lat  != null) params.set("lat",    String(loc.lat));
    if (loc?.lng  != null) params.set("lng",    String(loc.lng));
    if (loc?.radius != null && loc.radius > 0) {
      params.set("radius", String(loc.radius));
      params.set("unit",   loc.unit ?? "km");
    }
    if (loc?.label) params.set("loc", loc.label);
    router.push(`/listings${params.size > 0 ? `?${params}` : ""}`);
  }

  return (
    <>
    {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-800 pt-5 pb-5 shadow-lg">
        <div className="container-app mx-auto max-w-2xl">

          {/* Headline */}
          <h1 className="text-center italic text-slate-50 font-light leading-tight mb-5">
            <span className="block text-xl sm:text-3xl">...find anything, anywhere,</span>
            <span className="block text-xl sm:text-3xl font-bold">
              <span className="text-slate-100">with</span> <span className="text-rose-400 not-italic font-extrabold">lokalads...</span>
            </span>
          </h1>

          {/* Search bar */}
          <div className="mb-2">
            <LaSearchBar
              size="lg"
              placeholder="ex: Toyota Hybrid Car in Vehicles"
              onSearch={handleSearch}
            />
          </div>

          {/* Location picker + alert bell */}
          <div className="flex items-center justify-between gap-2">
            <LocationPicker
              value={pickedLocation}
              onChange={setPickedLocation}
              countryScope={countryConfig.locationScope}
              radiusUnit={countryConfig.radiusUnit}
              showRadius
            />
            <button
              type="button"
              onClick={() => setAlertOpen(true)}
              aria-label="Create alert"
              title="Get notified when new listings match your search"
              className="shrink-0 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors focus-visible:outline-none"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">Create Alert</span>
            </button>
            <CreateAlertDialog open={alertOpen} onOpenChange={setAlertOpen} />
          </div>

        </div>
      </div>

      {/* Section: Category Grid */}
      <div className="w-full bg-amber-50">
        <CategoryGrid
          categories={visibleCategories}
          initialVisible={12}
          className="container-app"
        />
      </div>

      {/* Your existing sections */}
      <StatsSection />
    </>
  );
}
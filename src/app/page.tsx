"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";
import WhyLokalads from "@/components/la-blocks/WhyLokalads";
import CategoryGrid from "@/components/la-blocks/CategoryGrid";
import { CreateAlertBanner, CreateAlertDialog } from "@/components/create-alert";
import { CATEGORIES } from "@/config/categories";
import FeaturedListings, { type FeaturedListingItem } from "@/components/la-blocks/FeaturedListings";
import RecentSearches, { type RecentSearchItem } from "@/components/la-blocks/RecentSearches";
import { getFeaturedListings } from "@/app/actions/getFeaturedListings";
import { getPopularSearches } from "@/app/actions/getPopularSearches";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { LaSearchBar, type SearchQuery } from "@/components/la-search-bar";
import { LocationPicker, type LocationValue } from "@/components/location-picker";

export default function LandingPage() {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [pickedLocation, setPickedLocation] = React.useState<LocationValue | null>(null);
  const { config: countryConfig, countryCode } = useCountryConfig();

  const visibleCategories = countryConfig.enabledCategories
    .map((id) => CATEGORIES.find((c) => c.id === id))
    .filter((c) => c !== undefined);
  // TODO [INTEGRATION]: Replace above derived list with a server-fetched category order.
  // API shape expected: GET /api/categories?country={countryCode} → CategoryItem[]
  // The API can also drive featured/trending ordering per country dynamically.

  // Homepage "Featured Listings" — real Post documents, scoped to the active
  // market (see getFeaturedListings.ts). Client Component, so this is a
  // fetch-on-mount rather than a direct server call — same pattern as
  // ChitChat/chat's other client-side data fetches this app already uses.
  // Real post volume is currently tiny (no moderation step exists yet, and
  // few posts have been created) — both lists render empty rather than
  // falling back to fake mock inventory; see the section guards below.
  const [recentPosts, setRecentPosts] = React.useState<FeaturedListingItem[]>([]);
  const [topPicks, setTopPicks] = React.useState<FeaturedListingItem[]>([]);
  const [popularSearches, setPopularSearches] = React.useState<RecentSearchItem[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    getFeaturedListings(countryCode, "recent", 10)
      .then((items) => { if (!cancelled) setRecentPosts(items); })
      .catch(() => { if (!cancelled) setRecentPosts([]); });
    getFeaturedListings(countryCode, "top-picks", 10)
      .then((items) => { if (!cancelled) setTopPicks(items); })
      .catch(() => { if (!cancelled) setTopPicks([]); });
    // "Popular Searches" — derived from real post volume (no search-query
    // logging exists yet), see getPopularSearches.ts. Icon is attached here
    // rather than returned from the server action since RecentSearchItem's
    // icon is a React node, not a value a server action can serialize.
    getPopularSearches(countryCode, 9)
      .then((items) => {
        if (cancelled) return;
        setPopularSearches(items.map((item) => ({ ...item, icon: <History className="h-3.5 w-3.5" /> })));
      })
      .catch(() => { if (!cancelled) setPopularSearches([]); });
    return () => { cancelled = true; };
  }, [countryCode]);

  function handleSearch(q: SearchQuery) {
    const params = new URLSearchParams();
    if (q.keyword?.trim())  params.set("q",   q.keyword.trim());
    if (q.scope?.cat)       params.set("cat", q.scope.cat);
    if (q.scope?.sub)       params.set("sub", q.scope.sub);
    // Use the local location picker state (LaSearchBar returns null for location)
    const loc = pickedLocation;
    if (loc?.lat  != null) params.set("lat",    String(loc.lat));
    if (loc?.lng  != null) params.set("lng",    String(loc.lng));
    if (loc?.radius != null && loc.radius > 0) {
      params.set("radius", String(loc.radius));
      params.set("unit",   loc.unit ?? "km");
    }
    if (loc?.label) params.set("loc", loc.label);
    router.push(`/${countryCode}/listings${params.size > 0 ? `?${params}` : ""}`);
  }

  return (
    <>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-800 pt-5 pb-5 shadow-lg">
        <div className="container-app max-w-2xl">

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
              searchProvider="google"
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

      {/* Core Layout Section */}
      <div className="bg-white">

        {/* Section: Category Grid */}
        <div className="w-full bg-amber-50">
          <CategoryGrid 
            categories={visibleCategories}
            initialVisible={12}
            className="container-app"
            />
        </div>
        

        {/* Section: Popular Searches — real post volume, see getPopularSearches.ts */}
        <RecentSearches
          title="Popular Searches"
          items={popularSearches}
          seeAllHref={`/${countryCode}/listings?view=popular-searches`}
          className="bg-amber-100"
        />


        {/* Section: Featured Listings */}
        {recentPosts.length > 0 && (
          <FeaturedListings
            title="Recent Posts"
            seeAllHref={`/${countryCode}/listings`}
            items={recentPosts}
            showLocation={false}
            showTime={false}
            showDetails={false}
            titleLines={3}
          />
        )}
        {topPicks.length > 0 && (
          <FeaturedListings
            title="Top Picks for You"
            seeAllHref={`/${countryCode}/listings?filter=top-picks`}
            items={topPicks}
            showLocation={false}
            showTime={false}
            showDetails={false}
            titleLines={3}
          />
        )}
        
        {/* Section: Create Alert */}
        <div className="container-app mb-5">
          <CreateAlertBanner />
        </div>

        {/* Section: Why to Use LokalAds ? */}
        <div className="relative overflow-hidden bg-slate-200 border-t border-slate-300">
          <WhyLokalads />
        </div>
      </div>

    </>
  );
}


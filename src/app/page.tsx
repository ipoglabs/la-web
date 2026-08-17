"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { History, TrendingUp } from "lucide-react";
import WhyLokalads from "@/components/la-blocks/WhyLokalads";
import CategoryGrid from "@/components/la-blocks/CategoryGrid";
import { CreateAlertBanner, CreateAlertDialog, useSubmitAlert } from "@/components/create-alert";
import { CATEGORIES } from "@/config/categories";
import { CATEGORY_LABELS } from "@/lib/category-map";
import FeaturedListings, { type FeaturedListingItem } from "@/components/la-blocks/FeaturedListings";
import RecentSearches, { type RecentSearchItem } from "@/components/la-blocks/RecentSearches";
import { getFeaturedListings } from "@/app/actions/getFeaturedListings";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { LaSearchBar, type SearchQuery } from "@/components/la-search-bar";
import { LocationPicker, type LocationValue } from "@/components/location-picker";
import { useSavedLocations } from "@/lib/hooks/useSavedLocations";
import { useRecentSearches, type RecentSearch } from "@/lib/hooks/use-recent-searches";
import { usePopularSearches, type PopularSearchItem } from "@/lib/hooks/use-popular-searches";
import { LaSkeleton } from "@/components/la";

/** Recent search entry → listings URL, mirroring handleSearch's own param
 *  building (keyword/category/subcategory only — location isn't part of a
 *  saved search entry, see searchUtils.ts's mapRecentSearch). */
function recentSearchHref(countryCode: string, item: RecentSearch): string {
  const params = new URLSearchParams();
  if (item.keyword.trim()) params.set("q", item.keyword.trim());
  if (item.scope?.cat) params.set("cat", item.scope.cat);
  if (item.scope?.sub) params.set("sub", item.scope.sub);
  return `/${countryCode}/listings${params.size > 0 ? `?${params}` : ""}`;
}

/** Popular search item → listings URL — same shape as recentSearchHref,
 *  keyed off keyword + category instead of a saved RecentSearch entry. */
function popularSearchHref(countryCode: string, item: PopularSearchItem): string {
  const params = new URLSearchParams();
  if (item.keyword.trim()) params.set("q", item.keyword.trim());
  if (item.category) params.set("cat", item.category);
  return `/${countryCode}/listings${params.size > 0 ? `?${params}` : ""}`;
}

function FeaturedListingsSkeleton({ title }: { title: string }) {
  return (
    <section className="container-app mt-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base-plus font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="flex gap-3 px-4 pb-2 overflow-x-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="shrink-0 w-40 space-y-2">
            <LaSkeleton shape="block" className="aspect-4/3" />
            <LaSkeleton shape="text" className="w-2/5" />
            <LaSkeleton shape="text" className="w-5/6" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const submitAlert = useSubmitAlert();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [pickedLocation, setPickedLocation] = React.useState<LocationValue | null>(null);
  const { config: countryConfig, countryCode } = useCountryConfig();
  const { savedLocations, saveLocation, saveSuggestion, removeSavedLocationById } = useSavedLocations();
  const { recents } = useRecentSearches();
  const popularSearches = usePopularSearches(countryConfig.isoCode, pickedLocation?.city);

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
  const [featuredLoading, setFeaturedLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setFeaturedLoading(true);
    Promise.all([
      getFeaturedListings(countryCode, "recent", 10)
        .then((items) => { if (!cancelled) setRecentPosts(items); })
        .catch(() => { if (!cancelled) setRecentPosts([]); }),
      getFeaturedListings(countryCode, "top-picks", 10)
        .then((items) => { if (!cancelled) setTopPicks(items); })
        .catch(() => { if (!cancelled) setTopPicks([]); }),
    ]).finally(() => { if (!cancelled) setFeaturedLoading(false); });
    return () => { cancelled = true; };
  }, [countryCode]);

  // "Recent Searches" — the signed-in user's own real search history (DB,
  // models/user.ts's recentSearches) or a signed-out guest's localStorage
  // history (lib/stores/recentSearchesStore.ts), see use-recent-searches.ts.
  // Every search submitted via LaSearchBar anywhere in the app saves here.
  const recentSearchItems: RecentSearchItem[] = recents.map((item) => ({
    id: item.id,
    label: item.keyword.trim() || item.scope?.subLabel || item.scope?.label || "Search",
    href: recentSearchHref(countryCode, item),
    icon: <History className="h-3.5 w-3.5" />,
  }));

  // "Popular Searches" — location-weighted ranking read from the nightly
  // batch job (lib/jobs/popular-search.job.ts), see use-popular-searches.ts.
  const popularSearchItems: RecentSearchItem[] = popularSearches.map((item) => ({
    id: `${item.keyword}::${item.category ?? ""}`,
    label: item.keyword.trim() || (item.category ? CATEGORY_LABELS[item.category] ?? item.category : "Search"),
    href: popularSearchHref(countryCode, item),
    icon: <TrendingUp className="h-3.5 w-3.5" />,
  }));

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

    // Fire-and-forget popularity log — never blocks navigation, failure is
    // swallowed (see app/api/search/log/route.ts).
    if (q.keyword?.trim() || q.scope?.cat) {
      fetch("/api/search/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: q.keyword?.trim() ?? "",
          category: q.scope?.cat,
          country: countryConfig.isoCode,
          city: loc?.city,
        }),
      }).catch(() => {});
    }

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
              country={countryConfig.isoCode}
              city={pickedLocation?.city}
            />
          </div>

          {/* Location picker + alert bell */}
          <div className="flex items-center justify-between gap-2">
            <LocationPicker
              value={pickedLocation}
              onChange={(v) => { setPickedLocation(v); saveLocation(v); }}
              savedLocations={savedLocations}
              onSaveLocation={saveSuggestion}
              onRemoveSavedLocation={removeSavedLocationById}
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
            <CreateAlertDialog open={alertOpen} onOpenChange={setAlertOpen} onSubmit={submitAlert} />
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
        

        {/* Section: Recent Searches — the signed-in user's own search
            history (or a guest's localStorage history), see
            use-recent-searches.ts. */}
        <RecentSearches
          items={recentSearchItems}
          className="bg-amber-100"
        />

        {/* Section: Popular Searches — location-weighted ranking, nightly
            batch job (see md/features/popular-searches.md). Renders nothing
            if empty (RecentSearches already no-ops on items: []) — covers
            both a brand-new deployment (no nightly run yet) and a market
            with no search volume. */}
        <RecentSearches
          title="Popular Searches"
          items={popularSearchItems}
          className="bg-slate-50"
        />


        {/* Section: Featured Listings */}
        {featuredLoading ? (
          <>
            <FeaturedListingsSkeleton title="Recent Posts" />
            <FeaturedListingsSkeleton title="Top Picks for You" />
          </>
        ) : (
          <>
            {recentPosts.length > 0 && (
              <FeaturedListings
                title="Recent Posts"
                seeAllHref={`/${countryCode}/listings?sort=newest`}
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
                seeAllHref={`/${countryCode}/listings?sort=top-picks`}
                items={topPicks}
                showLocation={false}
                showTime={false}
                showDetails={false}
                titleLines={3}
              />
            )}
          </>
        )}
        
        {/* Section: Create Alert */}
        <div className="container-app mb-5">
          <CreateAlertBanner onAlertCreated={submitAlert} />
        </div>

        {/* Section: Why to Use LokalAds ? */}
        <div className="relative overflow-hidden bg-slate-200 border-t border-slate-300">
          <WhyLokalads />
        </div>
      </div>

    </>
  );
}


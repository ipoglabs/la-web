/**
 * MyAdsClient: client body of /my-ads — filter tabs, ad card list, status
 * legend, and reference cards. Page-local (co-location rule).
 *
 * Receives real data from the server component (page.tsx's getMyAds()) as
 * `initialAds` — used directly, no local copy. `MyAdCard`'s `onChanged`
 * triggers `router.refresh()` after any real mutation, which re-runs
 * getMyAds() server-side and flows fresh data straight back through this
 * same prop — no client-side mutation of ad data itself.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";
import { ToggleButtonGroup, ToggleGroupButton } from "@/components/toggle-group/CompoundToggleGroup";
import { LaBadge } from "@/components/la/la-badge";
import { LaSeparator } from "@/components/la/la-separator";
import { LaEmpty } from "@/components/la-blocks/la-empty";
import { MyAdsEmptyState } from "./MyAdsEmptyState";
import { MyAdCard } from "./MyAdCard";
import { MyAdsGoodToKnow } from "./MyAdsGoodToKnow";
import { MyAdsListingPolicy } from "./MyAdsListingPolicy";
import { MyAdsInfoCard } from "./MyAdsInfoCard";
import { StatusDots } from "./StatusDots";
import type { MyAd } from "@/app/actions/getMyAds";
import type { MyAdStatus } from "@/lib/myAdsStatus";

const FILTERS: { value: MyAdStatus | "all"; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "off-market", label: "Paused" },
  { value: "expired", label: "Expired" },
  { value: "closed", label: "Closed" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
  { value: "under-review", label: "Reported" },
  { value: "blocked", label: "Suspended" },
  { value: "all", label: "All" },
];

const STATUS_LEGEND: { status: MyAdStatus | "deleted"; label: string; intent: "success" | "warning" | "neutral" | "info" | "danger"; description: string }[] = [
  {
    status: "active",
    label: "Active",
    intent: "success",
    description: "Your ad is live, buyers can find it and message you.",
  },
  {
    status: "off-market",
    label: "Paused",
    intent: "warning",
    description: "Hidden from buyers for now. Resume anytime to make it live again.",
  },
  {
    status: "expired",
    label: "Expired",
    intent: "neutral",
    description: "Its listing period ended, so it's no longer visible to buyers. Renew to bring it back.",
  },
  {
    status: "closed",
    label: "Closed",
    intent: "info",
    description: "No longer for sale, marked as finished (e.g. sold). It stays in your list, but buyers can't see it.",
  },
  {
    status: "pending",
    label: "Pending",
    intent: "neutral",
    description: "Submitted and waiting for moderator approval before it goes live.",
  },
  {
    status: "rejected",
    label: "Rejected",
    intent: "danger",
    description: "Failed moderation before going live. The reason is shown on the ad — post a new ad once it's fixed.",
  },
  {
    status: "under-review",
    label: "Reported",
    intent: "warning",
    description: "A buyer flagged this ad. Our team is reviewing it, no action needed from you right now.",
  },
  {
    status: "blocked",
    label: "Suspended",
    intent: "danger",
    description: "Admin removed it from search for a policy violation. It stays in your list, but buyers can't see it. Contact support to appeal.",
  },
  {
    status: "deleted",
    label: "Deleted",
    intent: "danger",
    description: "Removed from your list — kept in our records, never shown to you or anyone else again.",
  },
];

interface MyAdsClientProps {
  initialAds: MyAd[];
}

export default function MyAdsClient({ initialAds }: MyAdsClientProps) {
  const router = useRouter();

  // No local copy of `initialAds` — router.refresh() (handleChanged, below)
  // re-runs the server component and flows fresh data straight back through
  // this prop, so there's nothing to sync in an effect.
  const ads = initialAds;

  // Default to "Active" on first load, unless there are none, then "All" so
  // the user isn't looking at an empty filter. Lazy initializer — computed
  // once from the ads already present at mount (a server-fetched prop, never
  // an async client load) — never overrides a filter the user picks after.
  const [filter, setFilter] = useState<MyAdStatus | "all">(() =>
    initialAds.some((a) => a.status === "active") ? "active" : "all",
  );

  function handleChanged() {
    router.refresh();
  }

  const filtered = filter === "all" ? ads : ads.filter((a) => a.status === filter);

  function countFor(value: MyAdStatus | "all") {
    return value === "all" ? ads.length : ads.filter((a) => a.status === value).length;
  }

  if (ads.length === 0) return <MyAdsEmptyState />;

  return (
    <>
      <ToggleButtonGroup
        value={[filter]}
        onChange={(next) => setFilter((next[0] ?? "all") as MyAdStatus | "all")}
        singleSelect
        requireSelection
        className="mb-4 items-center"
      >
        {FILTERS.map((f) => (
          <ToggleGroupButton key={f.value} value={f.value} size="lg" className="shrink-0 whitespace-nowrap">
            {f.label} ({countFor(f.value)})
          </ToggleGroupButton>
        ))}
      </ToggleButtonGroup>

      <div className="max-w-2xl">
        {filtered.length === 0 ? (
          <LaEmpty
            icon={Inbox}
            intent="green"
            title="No ads with this status"
            description="Ads that match this filter will show up here."
            action={{ label: "Post an Ad", href: "/post" }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((ad) => (
              <div
                key={ad.id}
                className="rounded-xl border border-slate-400 bg-white p-4"
              >
                <MyAdCard ad={ad} onChanged={handleChanged} />
              </div>
            ))}
          </div>
        )}

        <LaSeparator className="my-8 bg-slate-400" />

        <MyAdsInfoCard
          title="Ad Status Guide"
          titleAdornment={<StatusDots />}
          subtitle="What each badge means, plus what happens when an ad is deleted."
          itemCount={STATUS_LEGEND.length}
        >
          <ul className="divide-y divide-slate-300">
            {STATUS_LEGEND.map((item) => (
              <li key={item.status} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="mt-0.5 min-w-20 shrink-0">
                  <LaBadge intent={item.intent} variant="solid" size="sm" className="w-full justify-center">
                    {item.label}
                  </LaBadge>
                </div>
                <span className="text-base text-slate-700">{item.description}</span>
              </li>
            ))}
          </ul>
        </MyAdsInfoCard>

        <div className="mt-6">
          <MyAdsGoodToKnow />
        </div>

        <div className="mt-6">
          <MyAdsListingPolicy />
        </div>
      </div>
    </>
  );
}

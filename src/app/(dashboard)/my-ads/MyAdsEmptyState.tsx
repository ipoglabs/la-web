/**
 * MyAdsEmptyState: zero-ads state for /my-ads, built on LaEmpty.
 * Page-local (co-location rule): only ever used by MyAdsPage.
 */
"use client";

import { Megaphone } from "lucide-react";
import { LaEmpty } from "@/components/la-blocks/la-empty";
import { MAX_ACTIVE_ADS } from "@/lib/myAdsConstants";
import { MyAdsListingPolicy } from "./MyAdsListingPolicy";

export function MyAdsEmptyState() {
  return (
    <div>
      <LaEmpty
        icon={Megaphone}
        intent="green"
        category="My Ads"
        title="No ads yet"
        description={`Post your first ad to start reaching buyers in your area. You can have up to ${MAX_ACTIVE_ADS} active ads at a time.`}
        action={{ label: "Post an Ad", href: "/post" }}
      />
      <div className="mx-auto max-w-2xl">
        <MyAdsListingPolicy />
      </div>
    </div>
  );
}

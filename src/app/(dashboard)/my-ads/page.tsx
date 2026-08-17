/**
 * /my-ads — Manage Ads (seller dashboard)
 *
 * UI ported from ipoglabs/la-design-aug14's /myads (see the plan for the
 * full mock → real mapping). This server component owns auth + the real
 * data fetch; MyAdsClient.tsx owns filter-tab state and renders the ported
 * card list + reference cards.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMyAds } from "@/app/actions/getMyAds";
import MyAdsClient from "./MyAdsClient";

export const dynamic = "force-dynamic";

export default async function MyAdsPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/my-ads");

  const ads = await getMyAds();

  return (
    <div className="container-app py-6 sm:py-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Manage Ads</h1>
      <p className="text-base text-slate-600 mb-6">
        See how your ads are doing, and make changes whenever you need to.
      </p>
      <MyAdsClient initialAds={ads} />
    </div>
  );
}

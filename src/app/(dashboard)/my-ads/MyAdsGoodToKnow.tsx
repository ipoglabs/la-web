/**
 * MyAdsGoodToKnow: page-local "good to know" reference card for /my-ads.
 * Co-located (only ever used by MyAdsPage) per the co-location rule.
 *
 * Answers the questions a seller actually has in their head while managing
 * ads: bump cooldown rules (country-aware), active-ad limit, whether roles
 * change that limit (they don't, today), and why honest listings matter.
 */
"use client";

import { ListChecks, ShieldCheck, Timer, Users } from "lucide-react";
import { MAX_ACTIVE_ADS } from "@/lib/myAdsConstants";
import { getBumpCooldownHours } from "@/config";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { MyAdsInfoCard } from "./MyAdsInfoCard";

const ICON_WELL = "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600";

export function MyAdsGoodToKnow() {
  const { countryCode, config } = useCountryConfig();
  const bumpCooldownHours = getBumpCooldownHours(countryCode);

  const items = [
    {
      id: "bump",
      icon: Timer,
      title: "How the bump cooldown works",
      description: `You can bump an ad back to the top of search results once every ${bumpCooldownHours} hours in ${config.displayName}. It resets automatically, no need to ask us.`,
    },
    {
      id: "limit",
      icon: ListChecks,
      title: "How many ads can I post?",
      description: `You can have up to ${MAX_ACTIVE_ADS} active ads at once. Paused, expired, or closed ads don't count towards this limit, see "What each status means" above.`,
    },
    {
      id: "roles",
      icon: Users,
      title: "Do my roles change my limits?",
      description: "Not yet. Every account gets the same active-ad limit today, whether you're an Individual, Business Owner, Agent, or any other role.",
    },
    {
      id: "ethics",
      icon: ShieldCheck,
      title: "Why honest listings matter",
      description: "LokalAds only works if buyers can trust what they see. Keep listings accurate, use real photos, avoid duplicate or spammy posts, and never list prohibited items. Reported ads that break these rules can be removed, and repeat violations can affect your account.",
    },
  ] as const;

  return (
    <MyAdsInfoCard
      title="Good To Know"
      subtitle="Everything you need to sell well and stay in good standing."
      itemCount={items.length}
    >
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className={ICON_WELL}>
              <item.icon className="size-4" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-800">{item.title}</p>
              <p className="text-base text-slate-700">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </MyAdsInfoCard>
  );
}

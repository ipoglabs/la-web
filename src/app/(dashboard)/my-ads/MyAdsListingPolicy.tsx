/**
 * MyAdsListingPolicy: page-local "listing policy" reference card for /myads.
 * Co-located (only ever used by MyAdsPage) per the co-location rule, same
 * pattern as MyAdsGoodToKnow.tsx — MyAdsInfoCard wrapper, icon + title + description
 * rows. Simplified seller-facing summary of the full Listing Policy (see
 * public/html/{country}/listing-policy.html via LegalDrawer) — sellers manage
 * ads across many categories here, so this stays universal rather than
 * category-specific like the buyer-facing ListingPolicy on the detail page.
 */
"use client";

import { Camera, Copy, MessageCircleWarning, ShieldAlert } from "lucide-react";
import { LegalDrawer } from "@/components/la-blocks/LegalDrawer";
import { useCountryConfig } from "@/lib/hooks/useCountryConfig";
import { MyAdsInfoCard } from "./MyAdsInfoCard";

const ICON_WELL = "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600";

const items = [
  {
    id: "honesty",
    icon: ShieldAlert,
    title: "Keep it honest and legal",
    description: "Describe the item accurately, own or have the right to sell it, and never list weapons, drugs, counterfeits, stolen goods, or anything else on our Never Allowed list.",
  },
  {
    id: "photos",
    icon: Camera,
    title: "Use real photos",
    description: "Real, unedited photos of the actual item build buyer trust. Stock images, AI-generated images, or someone else's photos are never allowed.",
  },
  {
    id: "duplicate",
    icon: Copy,
    title: "One ad per item",
    description: "Post each item once, in the correct category. Duplicate or multi-category posts get flagged as spam and can be removed.",
  },
  {
    id: "scams",
    icon: MessageCircleWarning,
    title: "Trade safely with buyers",
    description: "Never share OTPs, PINs, or bank details in chat, even with a \"verified\" buyer. Keep conversations in LokalAds chat where possible, it helps us step in if something goes wrong.",
  },
] as const;

export function MyAdsListingPolicy() {
  const { countryCode } = useCountryConfig();

  return (
    <MyAdsInfoCard
      title="Listing Policy"
      subtitle="The essentials for keeping your ads live and your account in good standing."
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

      <LegalDrawer countryCode={countryCode} type="listing-policy">
        <button type="button" className="mt-4 text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          View Full Listing Policy &rarr;
        </button>
      </LegalDrawer>
    </MyAdsInfoCard>
  );
}

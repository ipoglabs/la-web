/**
 * /u/[handle] — Public Profile
 *
 * Moved here from `app/snippets/public-profile/` on 2026-07-12 — this is
 * now the real product route, linked from the private Profile page's
 * "Public Profile" section (lokalads.com/{handle} row, opens new tab).
 * See `PublicProfileClient.tsx` for the moved content + what changed.
 *
 * Refactored 2026-07-12 — deep Technical/Architecture/UX audit. Now renders
 * a real mock seller (`SELLERS.bob` / Bob Harrison) with real linked listings
 * from `ALL_PROPERTY_LISTINGS`, reuses the shared `LaThumbnailListingCard` +
 * `components/ui/tabs` wrapper instead of bespoke/raw-Radix code. See
 * `PublicProfileClient.tsx` top comment for the full findings.
 *
 * `handle` now resolves through `./handle-map.ts` (bob-harrison, alice-chen,
 * sarah-patel, james-obrien, + an `anto27` alias for the private profile's
 * demo "Preview" link) — visiting an unknown handle renders a "Profile not
 * found" state instead of silently showing Bob Harrison for everything.
 * `handle-map.ts` is a separate server-safe module (not exported from the
 * "use client" `PublicProfileClient.tsx`) so `generateMetadata` below can
 * read seller data without pulling a client component into the server bundle.
 *
 * TODO [INTEGRATION]: Replace `HANDLE_TO_SELLER` with a real API lookup
 * once auth/DB ship.
 */

import type { Metadata } from "next";
import PublicProfileClient from "./PublicProfileClient";
import { HANDLE_TO_SELLER, type ProfileHandle } from "./handle-map";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const seller = HANDLE_TO_SELLER[handle as ProfileHandle];

  if (!seller) {
    return { title: "Profile Not Found | LokalAds" };
  }

  const title = `${seller.name} — ${seller.role} | LokalAds`;
  const description = `${seller.tagline} ${seller.location} · Member since ${seller.memberSince}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://lokalads.com/u/${handle}`,
      siteName: "LokalAds",
      type: "profile",
      images: [{ url: seller.avatar, width: 400, height: 400, alt: seller.name }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [seller.avatar],
    },
  };
}

function SellerJsonLd({ handle, seller }: { handle: string; seller: (typeof HANDLE_TO_SELLER)[ProfileHandle] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: seller.name,
    jobTitle: seller.role,
    address: seller.location,
    image: seller.avatar,
    url: `https://lokalads.com/u/${handle}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PublicProfilePage({ params }: Props) {
  const { handle } = await params;
  const seller = HANDLE_TO_SELLER[handle as ProfileHandle];

  return (
    <>
      {seller && <SellerJsonLd handle={handle} seller={seller} />}
      <PublicProfileClient handle={handle} />
    </>
  );
}

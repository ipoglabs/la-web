"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavouritesStore } from "@/lib/stores/favouritesStore";
import { LaThumbnailListingCard } from "@/components/la-blocks/la-thumbnail-listing";

export default function FavouritesGrid() {
  const [hydrated, setHydrated] = useState(false);
  const items = useFavouritesStore((s) => s.items);
  const remove = useFavouritesStore((s) => s.remove);

  // Belt-and-suspenders: AppHeader already rehydrates on mount, but don't
  // depend on mount-order relative to a sibling layout component.
  useEffect(() => {
    useFavouritesStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <p className="mt-8 text-sm text-slate-500">
        No favourites yet. Tap the heart on any listing to save it here.
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <Link key={item.id} href={`/listings/${item.id}`} className="block group">
          <LaThumbnailListingCard
            images={[item.image]}
            priceLabel={item.priceLabel}
            priceSuffix={item.priceSuffix}
            title={item.title}
            detailsLabel={item.detailsLabel}
            locationLabel={item.locationLabel}
            postedAt={item.postedAt}
            status={item.status}
            favorite
            onFavoriteChange={(next) => {
              if (!next) remove(item.id);
            }}
          />
        </Link>
      ))}
    </div>
  );
}

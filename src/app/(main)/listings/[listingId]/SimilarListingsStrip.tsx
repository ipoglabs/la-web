// UNUSED — replaced by FeaturedListings (single-row strip, same as landing page).
// Safe to delete once confirmed no other consumer exists.
// See: app/(main)/listings/[listingId]/page.tsx → SimilarListingsRow
"use client";

import Link from "next/link";
import { LaThumbnailListingCard, type LaThumbnailListingCardProps } from "@/components/la-blocks/la-thumbnail-listing";
import { useFavouritesStore } from "@/lib/stores/favouritesStore";

export interface SimilarListingItem extends LaThumbnailListingCardProps {
  id: string;
  href?: string;
}

interface SimilarListingsStripProps {
  items: SimilarListingItem[];
}

export default function SimilarListingsStrip({ items }: SimilarListingsStripProps) {
  const favItems = useFavouritesStore((s) => s.items);
  const add      = useFavouritesStore((s) => s.add);
  const remove   = useFavouritesStore((s) => s.remove);

  if (items.length === 0) return null;

  const half = Math.ceil(items.length / 2);
  const row1 = items.slice(0, half);
  const row2 = items.slice(half);

  function renderCard({ id, href, ...cardProps }: SimilarListingItem) {
    const isFav = favItems.some((f) => f.id === id);
    const handleFavChange = (next: boolean) => {
      if (next) {
        add({
          id,
          image:        cardProps.images[0] ?? { src: "" },
          priceLabel:   cardProps.priceLabel,
          priceSuffix:  cardProps.priceSuffix,
          title:        cardProps.title,
          detailsLabel: cardProps.detailsLabel,
          locationLabel:cardProps.locationLabel,
          postedAt:     typeof cardProps.postedAt === "string"
                          ? new Date(cardProps.postedAt).getTime()
                          : cardProps.postedAt instanceof Date
                            ? cardProps.postedAt.getTime()
                            : cardProps.postedAt,
          status: cardProps.status,
        });
      } else {
        remove(id);
      }
    };

    const card = (
      <LaThumbnailListingCard
        {...cardProps}
        favorite={isFav}
        onFavoriteChange={handleFavChange}
        showLocation={false}
        showTime={false}
        showDetails={false}
        titleLines={2}
        className="w-full"
      />
    );

    return href ? (
      <Link key={id} href={href} className="snap-start shrink-0 w-40 block">
        {card}
      </Link>
    ) : (
      <div key={id} className="snap-start shrink-0 w-40">
        {card}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none">
      <div className="flex flex-col gap-2 pb-2 w-max">
        <div className="flex gap-2">{row1.map(renderCard)}</div>
        {row2.length > 0 && <div className="flex gap-2">{row2.map(renderCard)}</div>}
        <div className="w-4 shrink-0" aria-hidden />
      </div>
    </div>
  );
}

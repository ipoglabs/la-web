"use client";

import { useRef } from "react";
import Link from "next/link";
import { LaThumbnailListingCard, type LaThumbnailListingCardProps } from "@/components/la-blocks/la-thumbnail-listing";
import { cn } from "@/lib/utils";
import { useFavouritesStore } from "@/lib/stores/favouritesStore";

export interface FeaturedListingItem extends LaThumbnailListingCardProps {
  id: string;
  href?: string;
}

export interface FeaturedListingsProps {
  title: string;
  seeAllHref?: string;
  items: FeaturedListingItem[];
  showLocation?: boolean;
  showTime?: boolean;
  showDetails?: boolean;
  titleLines?: 1 | 2 | 3;
  className?: string;
}

export default function FeaturedListings({ title, seeAllHref, items, showLocation = true, showTime = true, showDetails = true, titleLines = 1, className }: FeaturedListingsProps) {
  const favItems = useFavouritesStore((s) => s.items);
  const add       = useFavouritesStore((s) => s.add);
  const remove    = useFavouritesStore((s) => s.remove);

  // ── Mouse drag-to-scroll ────────────────────────────────────────────────────
  const scrollRef    = useRef<HTMLDivElement>(null);
  const isDown       = useRef(false);
  const startX       = useRef(0);
  const startScroll  = useRef(0);
  const dragDistance = useRef(0);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDown.current      = true;
    dragDistance.current = 0;
    startX.current      = e.clientX;
    startScroll.current = scrollRef.current?.scrollLeft ?? 0;
    scrollRef.current?.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDown.current) return;
    const delta = e.clientX - startX.current;
    dragDistance.current = Math.abs(delta);
    if (scrollRef.current) scrollRef.current.scrollLeft = startScroll.current - delta;
  }

  function onPointerUp() {
    isDown.current = false;
  }

  // Swallow clicks that are actually the end of a drag (> 5 px moved)
  function onClickCapture(e: React.MouseEvent) {
    if (dragDistance.current > 5) e.stopPropagation();
  }

  return (
    <section className={cn("container-app mt-4 mb-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base-plus font-semibold text-slate-800">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            See all →
          </Link>
        )}
      </div>

      {/* Scroll strip */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none cursor-grab active:cursor-grabbing select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClickCapture={onClickCapture}
        >
          <div className="flex gap-3 px-4 pb-2 w-max">
            {items.map(({ id, href, ...cardProps }) => {
              const isFav = favItems.some((f) => f.id === id);
              const handleFavChange = (next: boolean) => {
                if (next) {
                  add({
                    id,
                    image: cardProps.images[0] ?? { src: "" },
                    priceLabel:    cardProps.priceLabel,
                    priceSuffix:   cardProps.priceSuffix,
                    title:         cardProps.title,
                    detailsLabel:  cardProps.detailsLabel,
                    locationLabel: cardProps.locationLabel,
                    postedAt:      typeof cardProps.postedAt === "string"
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
                  showLocation={showLocation}
                  showTime={showTime}
                  showDetails={showDetails}
                  titleLines={titleLines}
                  className="w-full"
                />
              );

              return href ? (
                <Link key={id} href={href} className="snap-start shrink-0 w-40 block">{card}</Link>
              ) : (
                <div key={id} className="snap-start shrink-0 w-40">{card}</div>
              );
            })}
            <div className="w-4 shrink-0" aria-hidden />
          </div>
        </div>


      </div>
    </section>
  );
}

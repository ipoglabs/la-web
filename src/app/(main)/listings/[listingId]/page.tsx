import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";
import ListingGallery from "./ListingGallery";
import ListingTitleBar from "./ListingTitleBar";
import ListingMap from "./ListingMap";
import SellerCard from "./SellerCard";
import ListingDetailsTable from "./ListingDetailsTable";
import ListingUserFacts from "./ListingUserFacts";
import ListingReportButton from "./ListingReportButton";
import ChitChat from "./ChitChat";
import SellerContactGate from "./SellerContactGate";
import ListingDetailNavBand from "./ListingDetailNavBand";
import { LaListingDescription } from "@/components/la-blocks/la-listing-description";
import type { FavItem } from "@/lib/stores/favouritesStore";
import { resolveListingContext, getSimilarListings } from "@/lib/mock/country-map";
import { resolvePostListingContext } from "@/app/actions/getPostByAdsId";
import { getSession } from "@/lib/session";
import FeaturedListings from "@/components/la-blocks/FeaturedListings";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";
import { COUNTRY_CONFIGS, type CountryCode } from "@/config";
import { SITE_URL } from "@/lib/constants";
import type { Listing } from "@/types/listing";

// ─── Shared card surface ──────────────────────────────────────────────────────
const card = "bg-white px-4 py-5 border-y border-slate-200 sm:rounded-xl sm:border sm:shadow-sm";
const imgGalleryCard = "bg-white px-1.5 py-1.5 border border-slate-200 sm:rounded-xl sm:border sm:shadow-sm";

// ─── Page ─────────────────────────────────────────────────────────────────────
interface ListingDetailPageProps {
  params: Promise<{ listingId: string }>;
}

/**
 * Real DB post first, mock catalog as fallback — lets real posted ads
 * (id = adsId, or raw Mongo id) resolve here while every existing mock
 * listing URL (id = a slug like "sports-in-gym-01", never a real post's id
 * shape) keeps working unchanged. See resolvePostListingContext's header
 * for why the two can't be told apart in advance without just trying DB
 * first — a mock-slug lookup in Post is just a fast, cheap, indexed miss.
 */
async function resolveContext(listingId: string) {
  const fromDb = await resolvePostListingContext(listingId);
  if (fromDb) return fromDb;
  return resolveListingContext(listingId);
}

export async function generateMetadata({ params }: ListingDetailPageProps): Promise<Metadata> {
  const { listingId } = await params;
  const context = await resolveContext(listingId);
  if (!context) return { title: "Listing Not Found" };

  const { listing } = context;
  const description = listing.description.replace(/<[^>]*>/g, "").slice(0, 160);
  const image = listing.images[0]?.src;
  const url = `${SITE_URL}/listings/${listing.id}`;

  return {
    title: listing.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: listing.title,
      description,
      url,
      siteName: "LokalAds",
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630, alt: listing.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
      images: image ? [image] : [],
    },
  };
}

/** JSON-LD Product schema — helps Google surface price/availability in results. */
function ListingJsonLd({ listing, market, cat }: { listing: Listing; market: CountryCode | null; cat: string }) {
  const numericPrice = Number(listing.priceLabel.replace(/[^0-9.]/g, ""));
  const currency = COUNTRY_CONFIGS[market ?? "in"].currency;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description.replace(/<[^>]*>/g, "").slice(0, 500),
    image: listing.images.map((img) => img.src),
    url: `${SITE_URL}/listings/${listing.id}`,
    ...(Number.isFinite(numericPrice) && numericPrice > 0
      ? {
          offers: {
            "@type": "Offer",
            price: numericPrice,
            priceCurrency: currency,
            availability:
              listing.status && listing.status !== "active"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            seller: { "@type": "Person", name: listing.seller.name },
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/** JSON-LD BreadcrumbList — navigation context for search results. */
function BreadcrumbJsonLd({ listing, cat, catLabel }: { listing: Listing; cat: string; catLabel?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: catLabel ?? cat, item: `${SITE_URL}/listings?cat=${cat}` },
      { "@type": "ListItem", position: 3, name: listing.title },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { listingId } = await params;

  const context = await resolveContext(listingId);
  if (!context) notFound();

  const { listing, cat, sub, market } = context;
  const catLabel = CATEGORY_LABELS[cat];
  const subLabel = SUBCATEGORY_LABELS[cat]?.[sub];

  // Own-listing guard — a seller should never see contact CTAs (Email/Call/
  // ChitChat) on their own ad. See SellerContactGate.tsx for the rationale.
  const session = await getSession();
  const isOwnListing = !!session && session.id === listing.seller.id;

  const {
    id,
    priceLabel: price,
    priceSuffix,
    title,
    detailsLabel,
    locationLabel: location,
    postedAt,
    advId,
    description,
    keyDetails: keyDetails2,
    goodToKnow,
    images,
    seller,
    coordinates,
  } = listing;

  const favItem: FavItem = {
    id,
    image:        { src: images[0]?.src ?? "", alt: images[0]?.alt },
    priceLabel:   price,
    priceSuffix,
    title,
    detailsLabel: keyDetails2.slice(0, 3).map((d) => d.value).join(" · "),
    locationLabel: location,
    postedAt:     new Date(postedAt).getTime(),
  };

  return (
    <>
      <ListingJsonLd listing={listing} market={market} cat={cat} />
      <BreadcrumbJsonLd listing={listing} cat={cat} catLabel={catLabel} />

      {/* ── Dark nav band: ← Back | Breadcrumb | 🔔 Save Alert ─────── */}
      <ListingDetailNavBand
        cat={cat}
        sub={sub}
        catLabel={catLabel}
        subLabel={subLabel}
      />

      <div className="bg-slate-950/15 min-h-screen pb-10">
        
        <div className="container-app flex flex-col gap-3">

          {/* ── Title bar ─────────────────────────────────────────── */}
          <ListingTitleBar title={title} location={location} postedAt={postedAt} />

          {/* ── 2-column layout ──────────────────────────────────────── */}
          <div className="md:grid md:grid-cols-3 md:gap-3 md:items-start">

          {/* Left column */}
          <div className="flex flex-col gap-3 md:col-span-2">

            {/* Gallery + price + specs + actions */}
            <section className={imgGalleryCard}>
              <ListingGallery images={images} price={price} priceSuffix={priceSuffix} title={title} favItem={favItem} detailsLabel={detailsLabel} />
            </section>

            {/* Seller — left column / mobile only (sections + CTA strip self-contained) */}
            <SellerContactGate seller={seller} variant="left" isOwnListing={isOwnListing} listingId={id} />

            {/* Description */}
            <section className={card}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                <span className="text-sm text-slate-500 flex items-center gap-1">Posted <LaRelativeDate value={postedAt} /></span>
              </div>
              {/* TODO [INTEGRATION]: sanitise description HTML server-side before passing here */}
              <LaListingDescription html={description} />
            </section>

            <ListingDetailsTable title="Listing Details" rows={keyDetails2} className={card} />

            <ListingUserFacts title="Good To Know" items={goodToKnow} className={card} />

            {/* Map — mobile only */}
            <ListingMap location={location} lat={coordinates.lat} lng={coordinates.lng} className="md:hidden" />

            {/* Disclaimer */}
            <section className="bg-amber-200 px-4 py-4 border-y border-amber-200 sm:rounded-xl sm:border sm:shadow-sm">
              <h2 className="text-sm font-semibold text-amber-900 mb-1">Disclaimer</h2>
              <p className="text-sm text-amber-800 leading-relaxed">
                LokalAds does not verify the accuracy, quality, or legitimacy of listings. Always inspect items or
                services in person, verify seller identity, and never transfer money in advance. Exercise due
                diligence before making any decision or payment.
              </p>
            </section>

            {/* Ad ID + Report */}
            <section className={cn(card, "flex items-center gap-3")}>
              <p className="text-sm text-slate-500 flex-1">
                Ad ID: <span className="font-semibold text-slate-800">{advId}</span>
              </p>
              <ListingReportButton
                listingId={listingId}
                target={{
                  adId:       advId,
                  title,
                  thumbnail:  images[0]?.src,
                  sellerName: seller.name,
                  location,
                }}
              />
            </section>

            {/* ChitChat — mobile only. Hidden on your own listing — a seller
                shouldn't be able to message themselves. */}
            {!isOwnListing && (
              <ChitChat
                className="md:hidden"
                listingId={id}
                sellerId={seller.id}
                sellerName={seller.name}
                adTitle={title}
                adPrice={price}
                adImage={images[0]?.src}
              />
            )}

          </div>

          {/* Right column (md+) */}
          <div className="hidden md:flex flex-col gap-3">

            <SellerContactGate seller={seller} isOwnListing={isOwnListing} listingId={id} />

            {!isOwnListing && (
              <ChitChat
                listingId={id}
                sellerId={seller.id}
                sellerName={seller.name}
                adTitle={title}
                adPrice={price}
                adImage={images[0]?.src}
              />
            )}

            <ListingMap location={location} lat={coordinates.lat} lng={coordinates.lng} />

          </div>
        </div>

        </div>
      </div>

      {/* Similar Listings — outside container-app so FeaturedListings can apply its own container + full-width scroll strip */}
      <SimilarListingsRow cat={cat} sub={sub} excludeId={id} subLabel={subLabel} market={market} />
    </>
  );
}

// ─── Similar Listings row ────────────────────────────────────────────────────
// Uses the same FeaturedListings component as the landing page — single scroll row.
//
// TODO [INTEGRATION]: Replace getSimilarListings() with a real API call:
//   fetch(`/api/listings/similar?cat=${cat}&sub=${sub}&exclude=${excludeId}&country=${market}&limit=12`)
// `market` is resolved by resolveListingContext() above from the listing itself —
// no cookie read needed here, it just flows through as a prop.
function SimilarListingsRow({
  cat, sub, excludeId, subLabel, market,
}: { cat: string; sub: string; excludeId: string; subLabel?: string; market: CountryCode | null }) {
  const items = getSimilarListings(cat, sub, excludeId, market, 12);
  if (items.length === 0) return null;

  const seeAllHref = `/listings?cat=${cat}&sub=${sub}`;
  const sectionTitle = subLabel ? `More in ${subLabel}` : "Similar Listings For You";

  return (
    <FeaturedListings
      title={sectionTitle}
      seeAllHref={seeAllHref}
      items={items}
      showLocation={false}
      showTime={false}
      showDetails={false}
      titleLines={2}
    />
  );
}

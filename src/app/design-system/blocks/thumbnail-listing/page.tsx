import { LaThumbnailListingCard } from "@/components/la-blocks/la-thumbnail-listing";

// ── Developer guide code snippets (static strings, no client needed) ──────────

const SNIPPET_IMPORT = `import { LaThumbnailListingCard } from "@/components/la-blocks/la-thumbnail-listing";
// Type import (optional — for images array typing)
import type { ListingImageItem } from "@/components/la-blocks/la-thumbnail-listing";`;

const SNIPPET_MINIMAL = `// Minimal — uncontrolled, no favourite callback
<LaThumbnailListingCard
  images={[
    { src: "/img/photo1.jpg", alt: "Front view" },
    { src: "/img/photo2.jpg", alt: "Living room" },
  ]}
  priceLabel="$4,500"
  priceSuffix="pcm"
  title="Beautiful 5 Bed Villa in Dartford"
  detailsLabel="3 BEDS • 2 BATHS • APARTMENT"
  locationLabel="Dartford, Kent, DA99JW"
  postedAt={listing.createdAt}
/>`;

const SNIPPET_CONTROLLED = `// Controlled favourite — track & persist state in your own component
const [isFav, setIsFav] = useState(false);

<LaThumbnailListingCard
  images={listing.images}
  priceLabel={listing.price}
  title={listing.title}
  detailsLabel={listing.details}
  locationLabel={listing.location}
  postedAt={listing.createdAt}
  favorite={isFav}
  onFavoriteChange={async (next) => {
    setIsFav(next);           // optimistic update
    await toggleFavourite(listing.id, next);  // persist to API
  }}
/>`;

const SNIPPET_UNCONTROLLED = `// Uncontrolled — let the card manage its own state.
// Use defaultFavorite to set the initial state from your data.
// onFavoriteChange still fires so you can side-effect (analytics, toast, etc.)
<LaThumbnailListingCard
  images={listing.images}
  priceLabel={listing.price}
  title={listing.title}
  detailsLabel={listing.details}
  locationLabel={listing.location}
  postedAt={listing.createdAt}
  defaultFavorite={listing.isSaved}
  onFavoriteChange={(next) => {
    trackEvent("favourite_toggle", { listingId: listing.id, value: next });
  }}
/>`;

const SNIPPET_TITLE_LINES = `// titleLines controls how many lines the title shows before truncating.
// Default is 2. Use 1 for very compact grids, 3 to show more detail.
<LaThumbnailListingCard {...props} titleLines={1} />   // one-liner — tightest
<LaThumbnailListingCard {...props} titleLines={2} />   // default
<LaThumbnailListingCard {...props} titleLines={3} />   // relaxed — 3 lines`;

const SNIPPET_IMAGES = `// images — array of { src: string; alt?: string }
//
// • src  must be resolvable by next/image.
//         Public folder:    "/img/photo.jpg"
//         Remote domain:    add hostname to next.config remotePatterns
//         Relative URL:     "https://cdn.example.com/photo.jpg"
// • alt  optional but recommended for accessibility.
// • Any number of images — the carousel loops infinitely.
// • Single image → nav arrows and counter badge are hidden automatically.

const images: ListingImageItem[] = [
  { src: "/img/photo1.jpg", alt: "Front view" },
  { src: "/img/photo2.jpg", alt: "Living room" },
  { src: "/img/photo3.jpg", alt: "Kitchen" },
];`;

const SNIPPET_POSTED_AT = `// postedAt accepts any of:
//   string  — ISO 8601  e.g. "2026-06-01T10:30:00Z"
//   number  — Unix ms   e.g. Date.now() - 3 * 60 * 1000
//   Date    — JS Date   e.g. new Date()
//
// The card uses <LaRelativeDate> which auto-selects the right label:
//   < 1 min   → "just now"
//   < 1 hour  → "3min"
//   < 1 day   → "2h"
//   < 7 days  → "1d"
//   < 30 days → "2w"
//   < 91 days → "1mo"
//   ≥ 91 days → exact date e.g. "Jun 09, 2026"
//
// Clicking the date label toggles between relative and exact display.
<LaThumbnailListingCard {...props} postedAt={listing.createdAt} />
<LaThumbnailListingCard {...props} postedAt="2026-06-01T10:30:00Z" />
<LaThumbnailListingCard {...props} postedAt={Date.now() - 5 * 60 * 1000} />`;

// ── Timestamp constants to showcase all compact relative-time outputs ─────────
const NOW = Date.now();
const T_3MIN = NOW - 3 * 60 * 1000; // 3m ago
const T_45MIN = NOW - 45 * 60 * 1000; // 45m ago
const T_1HR = NOW - 1 * 60 * 60 * 1000; // 1h ago
const T_8HR = NOW - 8 * 60 * 60 * 1000; // 8h ago
const T_1DAY = NOW - 1 * 24 * 60 * 60 * 1000; // 1d ago
const T_2DAY = NOW - 2 * 24 * 60 * 60 * 1000; // 2d ago
const T_2WK = NOW - 14 * 24 * 60 * 60 * 1000; // 14d ago
const T_1MO = NOW - 35 * 24 * 60 * 60 * 1000; // 1mo ago
const T_6MO = NOW - 180 * 24 * 60 * 60 * 1000; // 6mo ago
const T_1YR = NOW - 370 * 24 * 60 * 60 * 1000; // 1y ago
const T_3YR = NOW - 3 * 365 * 24 * 60 * 60 * 1000; // 3y ago

const demoImages = [
  { src: "/img/img1.jpg", alt: "Listing image 1" },
  { src: "/img/img2.jpg", alt: "Listing image 2" },
  { src: "/img/img3.jpg", alt: "Listing image 3" },
  { src: "/img/img4.jpg", alt: "Listing image 4" },
  { src: "/img/img5.jpg", alt: "Listing image 5" },
  { src: "/img/img6.jpg", alt: "Listing image 6" },
  { src: "/img/img7.jpg", alt: "Listing image 7" },
  { src: "/img/img8.jpg", alt: "Listing image 8" },
  { src: "/img/img9.jpg", alt: "Listing image 9" },
  { src: "/img/img1.jpg", alt: "Listing image 10" },
  { src: "/img/img2.jpg", alt: "Listing image 11" },
  { src: "/img/img3.jpg", alt: "Listing image 12" },
  { src: "/img/img4.jpg", alt: "Listing image 13" },
  { src: "/img/img5.jpg", alt: "Listing image 14" },
  { src: "/img/img6.jpg", alt: "Listing image 15" },
  { src: "/img/img7.jpg", alt: "Listing image 16" },
  { src: "/img/img8.jpg", alt: "Listing image 17" },
  { src: "/img/img9.jpg", alt: "Listing image 18" },
];

export default function ThumbnailListingBlockPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="space-y-1.5">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">LA blocks</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Thumbnail Listing</h1>
          <p className="text-sm text-muted-foreground">
            Swipe left/right on the image to move through photos. Tap the heart to favourite.
          Click the posted date to toggle between relative and exact.
          </p>
        </div>

        {/* ── Developer Guide ──────────────────────────────────────────────── */}
        <div className="space-y-6 rounded-xl border border-border bg-muted/30 p-5">

          {/* Header */}
          <div className="space-y-0.5">
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">Developer Guide</p>
            <h2 className="text-base font-semibold text-foreground">How to use this component</h2>
          </div>

          {/* Import */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Import</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
              <code>{SNIPPET_IMPORT}</code>
            </pre>
          </div>

          {/* Props table */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Props</p>
            <div className="overflow-hidden rounded-lg border border-border text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted text-left">
                    <th className="px-3 py-2 font-semibold text-foreground">Prop</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Type</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Default</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["images", "ListingImageItem[]", "—", "Required. Array of { src, alt? } objects for the carousel."],
                    ["priceLabel", "string", "—", "Required. Main price text e.g. \"$4,500\"."],
                    ["priceSuffix", "string", "—", "Optional unit after price e.g. \"pcm\", \"/mo\"."],
                    ["title", "string", "—", "Required. Listing headline. Clamped by titleLines."],
                    ["detailsLabel", "string", "—", "Required. Specs row e.g. \"3 BEDS • 2 BATHS • APARTMENT\"."],
                    ["locationLabel", "string", "—", "Required. Truncated to one line — keep it concise."],
                    ["postedAt", "string | number | Date", "—", "Required. ISO string, Unix ms, or JS Date."],
                    ["titleLines", "1 | 2 | 3", "2", "Lines before title truncates. 1 = compact, 3 = relaxed."],
                    ["favorite", "boolean", "—", "Controlled favourite state. Pair with onFavoriteChange."],
                    ["defaultFavorite", "boolean", "false", "Initial favourite state for uncontrolled usage."],
                    ["onFavoriteChange", "(next: boolean) => void", "—", "Called whenever the heart is toggled."],
                    ["className", "string", "—", "Extra Tailwind classes on the root element."],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="odd:bg-background even:bg-muted/20">
                      <td className="px-3 py-2 font-mono text-sky-600 dark:text-sky-400">{prop}</td>
                      <td className="px-3 py-2 font-mono text-violet-600 dark:text-violet-400 whitespace-nowrap">{type}</td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{def}</td>
                      <td className="px-3 py-2 text-foreground">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Example: minimal */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Minimal usage</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
              <code>{SNIPPET_MINIMAL}</code>
            </pre>
          </div>

          {/* Example: controlled favourite */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Controlled favourite — persist to API</p>
            <p className="text-xs text-muted-foreground">
              Use <code className="font-mono text-sky-600 dark:text-sky-400">favorite</code> +{" "}
              <code className="font-mono text-sky-600 dark:text-sky-400">onFavoriteChange</code> when you own the state
              (e.g. syncing with a server or global store).
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
              <code>{SNIPPET_CONTROLLED}</code>
            </pre>
          </div>

          {/* Example: uncontrolled */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Uncontrolled favourite — fire-and-forget</p>
            <p className="text-xs text-muted-foreground">
              Use <code className="font-mono text-sky-600 dark:text-sky-400">defaultFavorite</code> to seed the initial
              value from your data, then let the card manage its own toggle state.{" "}
              <code className="font-mono text-sky-600 dark:text-sky-400">onFavoriteChange</code> still fires for
              side-effects like analytics or toasts.
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
              <code>{SNIPPET_UNCONTROLLED}</code>
            </pre>
          </div>

          {/* Example: titleLines */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Title line clamping</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
              <code>{SNIPPET_TITLE_LINES}</code>
            </pre>
          </div>

          {/* Example: images */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">Images array format</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
              <code>{SNIPPET_IMAGES}</code>
            </pre>
          </div>

          {/* Example: postedAt */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">postedAt — accepted formats &amp; display behaviour</p>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
              <code>{SNIPPET_POSTED_AT}</code>
            </pre>
          </div>

        </div>

        {/* ── Live demos — all timestamp variants ──────────────────────────── */}
        <div className="space-y-1.5">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">Live demos</p>
          <h2 className="text-base font-semibold text-foreground">All timestamp variants</h2>
          <p className="text-xs text-muted-foreground">
            Each card uses a different <code className="font-mono">postedAt</code> offset to preview every relative-time label.
            Cards 3 &amp; 7 show the <code className="font-mono">status</code> badge — <span className="font-medium text-rose-500">Closed</span> and <span className="font-medium text-slate-500">Off Market</span>.
          </p>
        </div>

        {/* 2-column grid — all timestamp variants for developer reference */}
        <div className="grid grid-cols-2 gap-3">

          {/* 3m ago */}
          <LaThumbnailListingCard
            images={demoImages}
            priceLabel="$4,500"
            priceSuffix="pcm"
            title="Beautiful 5 Bed Room Villa Home in the dartford area"
            detailsLabel="3 BEDS • 2 BATHS • APARTMENT"
            locationLabel="Dartford, Kent, DA99JW"
            postedAt={T_3MIN}
            titleLines={2}
          />

          {/* 45m ago */}
          <LaThumbnailListingCard
            images={demoImages.slice(2)}
            priceLabel="$1,200"
            priceSuffix="pcm"
            title="Cosy Studio Flat Near City Centre"
            detailsLabel="STUDIO • 1 BATH • FLAT"
            locationLabel="London, E1 6RF"
            postedAt={T_45MIN}
            titleLines={2}
            defaultFavorite
          />

          {/* 1h ago — CLOSED */}
          <LaThumbnailListingCard
            images={demoImages.slice(4)}
            priceLabel="$850"
            title="Shared Room in Professional House Share"
            detailsLabel="1 BED • SHARED • HOUSE"
            locationLabel="Manchester, M1 1AD"
            postedAt={T_1HR}
            titleLines={2}
            status="closed"
          />

          {/* 8h ago */}
          <LaThumbnailListingCard
            images={demoImages.slice(6)}
            priceLabel="$3,200"
            priceSuffix="pcm"
            title="Modern 2 Bed Apartment with Gym & Concierge"
            detailsLabel="2 BEDS • 2 BATHS • APARTMENT"
            locationLabel="Canary Wharf, London, E14"
            postedAt={T_8HR}
            titleLines={2}
          />

          {/* 1d ago */}
          <LaThumbnailListingCard
            images={demoImages.slice(1)}
            priceLabel="$680"
            title="Bright Single Room Near Station"
            detailsLabel="1 BED • 1 BATH • ROOM"
            locationLabel="Birmingham, B1 1BB"
            postedAt={T_1DAY}
            titleLines={2}
          />

          {/* 2d ago */}
          <LaThumbnailListingCard
            images={demoImages.slice(3)}
            priceLabel="$2,100"
            priceSuffix="pcm"
            title="Spacious 3 Bed Terraced House with Garden"
            detailsLabel="3 BEDS • 1 BATH • HOUSE"
            locationLabel="Leeds, LS1 4AP"
            postedAt={T_2DAY}
            titleLines={2}
            defaultFavorite
          />

          {/* 14d ago — OFF MARKET */}
          <LaThumbnailListingCard
            images={demoImages.slice(5)}
            priceLabel="$990"
            priceSuffix="pcm"
            title="Modern 1 Bed Flat with Parking"
            detailsLabel="1 BED • 1 BATH • FLAT"
            locationLabel="Bristol, BS1 5TR"
            postedAt={T_2WK}
            titleLines={2}
            status="off-market"
          />

          {/* 1mo ago */}
          <LaThumbnailListingCard
            images={demoImages.slice(7)}
            priceLabel="$1,750"
            priceSuffix="pcm"
            title="City Centre 2 Bed New Build"
            detailsLabel="2 BEDS • 2 BATHS • APARTMENT"
            locationLabel="Edinburgh, EH1 1YZ"
            postedAt={T_1MO}
            titleLines={2}
          />

          {/* 6mo ago */}
          <LaThumbnailListingCard
            images={demoImages.slice(9)}
            priceLabel="$5,800"
            priceSuffix="pcm"
            title="Luxury Penthouse with Panoramic Views"
            detailsLabel="4 BEDS • 3 BATHS • PENTHOUSE"
            locationLabel="Mayfair, London, W1K 2HP"
            postedAt={T_6MO}
            titleLines={2}
          />

          {/* 1y ago */}
          <LaThumbnailListingCard
            images={demoImages.slice(11)}
            priceLabel="$450"
            title="Affordable Studio Near University"
            detailsLabel="STUDIO • 1 BATH • FLAT"
            locationLabel="Nottingham, NG1 1GF"
            postedAt={T_1YR}
            titleLines={2}
            defaultFavorite
          />

          {/* 3y ago */}
          <LaThumbnailListingCard
            images={demoImages.slice(13)}
            priceLabel="$7,500"
            priceSuffix="pcm"
            title="Grand 6 Bed Detached Country Home"
            detailsLabel="6 BEDS • 4 BATHS • DETACHED"
            locationLabel="Surrey, GU1 3SY"
            postedAt={T_3YR}
            titleLines={2}
          />

        </div>

      </div>
    </main>
  );
}

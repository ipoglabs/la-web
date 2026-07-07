"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetCloseButton,
} from "@/components/ui/sheet";
import { LaButton } from "@/components/la/la-button";
import { LaFavouriteThumbnail } from "@/components/la-blocks/la-thumbnail-favourites";
import {
  Outline_Heart_24by24,
  Outline_Heart_50by50_2pt,
  Solid_Heart_24by24,
  Outline_CheckCircle_24by24,
  Outline_Clock_24by24,
} from "@/components/icons/la-icons";
import { cn } from "@/lib/utils";

// ── Code snippets (developer guide) ──────────────────────────────────────────

const SNIPPET_IMPORT = `import { LaFavouriteThumbnail } from "@/components/la-blocks/la-thumbnail-favourites";
import type { LaFavouriteThumbnailProps } from "@/components/la-blocks/la-thumbnail-favourites";`;

const SNIPPET_WIRING = `// 1. sheetOpen drives both the sheet state and the heart icon colour.
//    Solid rose heart = open · Outline slate heart = closed.
const [sheetOpen, setSheetOpen] = useState(false);
const [items, setItems] = useState(myFavourites);

// 2. Heart click — toggle the sheet
function handleHeartClick() {
  setSheetOpen((prev) => !prev);
}

// 3. Remove a single item (sheet stays open — shows empty state if last one)
function handleRemove(id: string) {
  setItems((prev) => prev.filter((i) => i.id !== id));
}

// 4. Heart toggle button — bg-slate-100, switches icon on open state
<div className="relative inline-flex">
  <LaButton
    intent="ghost"
    size="big"
    iconOnly
    data-pressed={sheetOpen}
    aria-label={sheetOpen ? "Close favourites" : "View saved listings"}
    onClick={handleHeartClick}
    className={cn(
      "h-11 w-11 rounded-full bg-slate-100 hover:bg-slate-200 [&_svg]:size-8",
      sheetOpen ? "text-rose-500" : "text-slate-500"
    )}
  >
    {sheetOpen
      ? <Solid_Heart_24by24 />
      : <Outline_Heart_24by24 strokeWidth={1.5} />
    }
  </LaButton>
  {items.length > 0 && (
    <span className="pointer-events-none absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-black tabular-nums text-white">
      {items.length > 9 ? "9+" : items.length}
    </span>
  )}
</div>

// 5. Sheet — onOpenChange handles Esc + overlay-click automatically.
<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
  <SheetContent side="right">
    <SheetHeader>
      <div>
        <SheetTitle>Favourites</SheetTitle>
        <SheetDescription>
          {items.length > 0 ? \`\${items.length} saved listings\` : "No saved listings"}
        </SheetDescription>
      </div>
      <SheetCloseButton />
    </SheetHeader>
    <div className="flex-1 overflow-y-auto bg-slate-50 px-5 pb-2">
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <LaFavouriteThumbnail
            key={item.id}
            image={item.image}
            priceLabel={item.priceLabel}
            priceSuffix={item.priceSuffix}
            title={item.title}
            detailsLabel={item.detailsLabel}
            locationLabel={item.locationLabel}
            postedAt={item.postedAt}
            status={item.status}
            onRemove={() => handleRemove(item.id)}
          />
        ))}
      </div>
    </div>
  </SheetContent>
</Sheet>`;

// ── Mock saved listings ───────────────────────────────────────────────────────

const NOW = Date.now();

type FavItem = {
  id: string;
  image: { src: string; alt?: string };
  priceLabel: string;
  priceSuffix?: string;
  title: string;
  detailsLabel: string;
  locationLabel: string;
  postedAt: number;
  status?: "active" | "closed" | "off-market";
};

const INITIAL_ITEMS: FavItem[] = [
  {
    id: "1",
    image: { src: "/img/img2.jpg", alt: "Corner terrace house" },
    priceLabel: "$3,200",
    priceSuffix: "pcm",
    title: "Bright 3-Bed Corner Terrace in Serangoon",
    detailsLabel: "3 BEDS • 2 BATHS • TERRACE",
    locationLabel: "Serangoon, Singapore",
    postedAt: NOW - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "2",
    image: { src: "/img/img3.jpg", alt: "Modern condo" },
    priceLabel: "$1,850,000",
    title: "Modern 2-Bed High-Floor Condo with City View",
    detailsLabel: "2 BEDS • 2 BATHS • CONDO",
    locationLabel: "Orchard, Singapore",
    postedAt: NOW - 7 * 24 * 60 * 60 * 1000,
    status: "closed",
  },
  {
    id: "3",
    image: { src: "/img/img4.jpg", alt: "Semi-D property" },
    priceLabel: "$5,600",
    priceSuffix: "pcm",
    title: "Spacious Semi-D with Private Garden",
    detailsLabel: "5 BEDS • 4 BATHS • SEMI-D",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: NOW - 35 * 24 * 60 * 60 * 1000,
    status: "off-market",
  },
  {
    id: "4",
    image: { src: "/img/img5.jpg", alt: "HDB flat" },
    priceLabel: "$520,000",
    title: "Well-Maintained 4-Room HDB Near MRT",
    detailsLabel: "4 ROOMS • 1 BATH • HDB FLAT",
    locationLabel: "Tampines, Singapore",
    postedAt: NOW - 3 * 60 * 60 * 1000,
  },
  {
    id: "5",
    image: { src: "/img/img6.jpg", alt: "Studio apartment" },
    priceLabel: "$1,900",
    priceSuffix: "pcm",
    title: "Cosy Studio in CBD Walking Distance to MRT",
    detailsLabel: "STUDIO • 1 BATH • APARTMENT",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: NOW - 90 * 24 * 60 * 60 * 1000,
    status: "off-market",
  },
  {
    id: "6",
    image: { src: "/img/img7.jpg", alt: "Penthouse" },
    priceLabel: "$12,500",
    priceSuffix: "pcm",
    title: "Luxury Penthouse with Infinity Pool & Skyline Views",
    detailsLabel: "4 BEDS • 5 BATHS • PENTHOUSE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: NOW - 14 * 24 * 60 * 60 * 1000,
  },
];

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyFavourites() {
  return (
    <div className="flex flex-col items-center px-2 py-8 text-center">

      {/* Illustration — big heart in a soft rose halo */}
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
        <Outline_Heart_50by50_2pt className="h-10 w-10 text-rose-300" />
      </div>

      {/* Headline */}
      <p className="text-base font-semibold text-slate-700">Nothing saved yet</p>

      {/* Sub-copy */}
      <p className="mt-1.5 max-w-52 text-sm leading-relaxed text-slate-400">
        Browse listings and tap{" "}
        <Outline_Heart_24by24 className="inline h-3.5 w-3.5 align-middle text-rose-400" />{" "}
        to save the ones you love.
      </p>

      {/* Divider */}
      <div className="my-6 w-full border-t border-slate-100" />

      {/* How it works — 3 tip rows */}
      <div className="w-full space-y-4 text-left">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400 text-center">
          How it works
        </p>

        {[
          {
            icon: <Outline_Heart_24by24 className="h-4 w-4 text-rose-400" />,
            bg: "bg-rose-50",
            label: "Tap the heart on any listing",
            sub: "Saves it here instantly — no account step needed.",
          },
          {
            icon: <Outline_CheckCircle_24by24 className="h-4 w-4 text-sky-500" />,
            bg: "bg-sky-50",
            label: "Compare your shortlist",
            sub: "All your saved picks in one place, side by side.",
          },
          {
            icon: <Outline_Clock_24by24 className="h-4 w-4 text-slate-400" />,
            bg: "bg-slate-100",
            label: "Remove when you're done",
            sub: "Tap × on any card to clear it from your list.",
          },
        ].map(({ icon, bg, label, sub }) => (
          <div key={label} className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${bg}`}>
              {icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FavouritePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [items, setItems] = useState<FavItem[]>(INITIAL_ITEMS);
  const [clearConfirm, setClearConfirm] = useState(false);
  const count = items.length;

  function handleHeartClick() {
    setSheetOpen((prev) => !prev);
  }

  function handleRemove(id: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (next.length <= 1) setClearConfirm(false);
      return next;
    });
  }

  function handleClearAll() {
    setItems([]);
    setClearConfirm(false);
  }

  return (
    <>
      <main className="min-h-screen bg-background px-4 py-12 sm:px-6">
        <div className="mx-auto w-full max-w-lg space-y-10">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <header className="space-y-1.5">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              UX Components
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Favourites</h1>
            <p className="text-sm text-muted-foreground">
              Heart toggle button that opens a right-side sheet of saved listings.
              Tap the heart to open · tap again or press × to close.
            </p>
          </header>

          {/* ── Live Demo ──────────────────────────────────────────────────── */}
          <section className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="space-y-0.5">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                Live Demo
              </p>
              <h2 className="text-base font-semibold text-slate-900">Try it</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Tap the heart button below to open your saved listings.
              </p>
            </div>

            {/* Heart toggle — sole entry point */}
            <div className="flex justify-center py-4">
              <div className="relative inline-flex">
                <LaButton
                  intent="ghost"
                  size="big"
                  iconOnly
                  data-pressed={sheetOpen}
                  aria-label={sheetOpen ? "Close favourites" : "View saved listings"}
                  onClick={handleHeartClick}
                  className={cn(
                    "h-11 w-11 rounded-full bg-slate-100 transition-colors hover:bg-slate-200 [&_svg]:size-8",
                    sheetOpen ? "text-rose-500" : "text-slate-500",
                  )}
                >
                  {sheetOpen ? (
                    <Solid_Heart_24by24 />
                  ) : (
                    <Outline_Heart_24by24 strokeWidth={1.5} />
                  )}
                </LaButton>
                {count > 0 && (
                  <span className="pointer-events-none absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-black tabular-nums leading-none text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
            </div>

            {/* Live state indicator */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full transition-colors duration-300",
                  sheetOpen ? "bg-rose-500" : "bg-slate-300",
                )}
              />
              <p className="text-xs text-muted-foreground">
                {sheetOpen
                  ? `Sheet open · ${count} saved listing${count !== 1 ? "s" : ""}`
                  : "Sheet closed · tap the heart button above"}
              </p>
            </div>
          </section>

          {/* ── Developer Guide ────────────────────────────────────────────── */}
          <section className="space-y-6 rounded-xl border border-border bg-muted/30 p-5">
            <div className="space-y-0.5">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                Developer Guide
              </p>
              <h2 className="text-base font-semibold text-foreground">
                LaFavouriteThumbnail
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Compact horizontal card for saved listings. Single primary image, price, title,
                spec line, location, and posted time. Designed for the right-side sheet.
              </p>
            </div>

            {/* Import */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">Import</p>
              <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
                <code>{SNIPPET_IMPORT}</code>
              </pre>
            </div>

            {/* Wiring snippet */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-foreground">
                Heart toggle + sheet wiring
              </p>
              <p className="text-xs text-muted-foreground">
                The heart button and sheet share a single{" "}
                <code className="font-mono text-sky-600">sheetOpen</code> state.
                Heart is rose when the sheet is open; outline when closed.
                Closing the sheet (× button, Esc, or overlay tap) automatically resets the heart.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-200">
                <code>{SNIPPET_WIRING}</code>
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
                      ["image", "{ src: string; alt?: string }", "—", "Required. Single primary image — no carousel."],
                      ["priceLabel", "string", "—", "Required. Main price text e.g. \"$4,500\"."],
                      ["priceSuffix", "string", "—", "Optional unit after price e.g. \"pcm\", \"/mo\"."],
                      ["title", "string", "—", "Required. Listing title — clamped to 1 line."],
                      ["detailsLabel", "string", "—", "Required. Specs row e.g. \"3 BEDS • 2 BATHS\"."],
                      ["locationLabel", "string", "—", "Required. Truncated to one line."],
                      ["postedAt", "string | number | Date", "—", "Required. ISO string, Unix ms, or JS Date."],
                      ["className", "string", "—", "Extra Tailwind classes on the root element."],
                      ["onRemove", "() => void", "—", "Called when the × button is tapped. Omit to hide the button."],
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
          </section>

        </div>
      </main>

      {/* ── Favourites Sheet ─────────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <div>
              <SheetTitle>Favourites</SheetTitle>
              <SheetDescription>
                {count > 0
                  ? `${count} saved listing${count !== 1 ? "s" : ""}`
                  : "No saved listings"}
              </SheetDescription>
            </div>
            <SheetCloseButton />
          </SheetHeader>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-5 pb-2">
            {count === 0 ? (
              <EmptyFavourites />
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <LaFavouriteThumbnail
                    key={item.id}
                    image={item.image}
                    priceLabel={item.priceLabel}
                    priceSuffix={item.priceSuffix}
                    title={item.title}
                    detailsLabel={item.detailsLabel}
                    locationLabel={item.locationLabel}
                    postedAt={item.postedAt}
                    status={item.status}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sheet footer — clear all (only when 2+ items remain) */}
          {count > 1 && (
            <div className="shrink-0 border-t border-slate-100 px-5 py-3">
              {!clearConfirm ? (
                <button
                  type="button"
                  onClick={() => setClearConfirm(true)}
                  className="w-full py-1 text-center text-xs font-medium text-slate-400 transition-colors hover:text-rose-500"
                >
                  Clear all ({count})
                </button>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">Remove all {count} listings?</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setClearConfirm(false)}
                      className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-rose-600"
                    >
                      Remove all
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

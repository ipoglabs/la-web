"use client";

import { useState, useEffect } from "react";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Solid_MapPin_20 } from "@/components/icons/la-icons";

interface ListingMapProps {
  location: string;
  lat?: number;
  lng?: number;
  className?: string;
}

export default function ListingMap({ location, lat, lng, className }: ListingMapProps) {
  const [expanded, setExpanded] = useState(false);

  // Close fullscreen on Escape key
  useEffect(() => {
    if (!expanded) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  // TODO [INTEGRATION]: Replace with Google Maps Embed API key + Maps Embed v1 (place mode) for richer pin
  // Note: lat != null check (not just `lat &&`) handles lat=0 (equator) correctly
  const mapSrc = lat != null && lng != null
    ? `https://maps.google.com/maps?q=${lat},${lng}&output=embed&iwloc=near&z=16`
    : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed&iwloc=near&z=15`;

  return (
    <>
      {/* ── Card ─────────────────────────────────────────────────── */}
      <section className={cn(
        "bg-white border-y border-slate-900/25 sm:rounded-xl sm:border sm:shadow-sm overflow-hidden",
        className
      )}>
        {/* Header */}
        <div className="px-3 pt-3 pb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Solid_MapPin_20 className="size-5 text-slate-500 shrink-0" />
            <h2 className="pt-0.5 text-sm font-semibold text-slate-700">Location Map</h2>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Expand map to fullscreen"
            className="size-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>

        {/* Inline map */}
        <div className="w-full px-1.5 pb-1.5">
          <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-200">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing ${location}`}
            />
          </div>
        </div>
      </section>

      {/* ── Fullscreen overlay ────────────────────────────────────── */}
      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen map for ${location}`}
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          {/* Overlay header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 shrink-0">
            <div className="flex items-center gap-2 text-white min-w-0">
              <Solid_MapPin_20 className="size-4 shrink-0" />
              <span className="text-sm font-medium truncate">{location}</span>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Close fullscreen map"
              className="ml-3 size-9 shrink-0 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Full-height map */}
          <div className="flex-1">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Fullscreen map showing ${location}`}
            />
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { LaButton } from "@/components/la";
import { LaRelativeDate } from "@/components/la-blocks/la-relative-date";
import { Solid_MapPin_20 } from "@/components/icons/la-icons";

interface ListingTitleBarProps {
  title: string;
  location: string;
  postedAt: Date | number | string;
}

export default function ListingTitleBar({ title, location, postedAt }: ListingTitleBarProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;

  return (
    <div className="flex flex-col items-stretch bg-white px-4 py-4 border-b border-slate-900/25 sm:rounded-b-md sm:border-x sm:border-b sm:shadow-md sm:shadow-black/10">
      <h1 className="font-medium text-xl text-gray-800">{title}</h1>

      {/* Location + Direction (left) · Posted (right) */}
      <div className="mt-0.5 flex items-center justify-between gap-3">

        {/* Location label + Direction button — adjacent */}
        <div className="flex items-center gap-2 min-w-0">
          <Solid_MapPin_20 className="size-4 text-slate-600 shrink-0" />
          <span className="text-slate-700 truncate">{location}</span>
          <LaButton
            intent="primary-blue"
            size="compact"
            aria-label="Get directions"
            onClick={() => window.open(mapsUrl, "_blank", "noopener,noreferrer")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3.74 20.25a.75.75 0 0 0 .75-.75V8.999h13.938l-2.47 2.47a.75.75 0 0 0 1.061 1.06l3.75-3.75a.75.75 0 0 0 0-1.06l-3.75-3.75a.75.75 0 0 0-1.06 1.06l2.47 2.47H3.738a.75.75 0 0 0-.75.75V19.5c0 .414.336.75.75.75Z" clipRule="evenodd" />
            </svg>
            <span className="max-sm:hidden">Direction</span>
          </LaButton>
        </div>

        {/* Posted date — far right */}
        <span className="text-sm text-slate-500 shrink-0 flex items-center gap-1">
          Posted <LaRelativeDate value={postedAt} />
        </span>

      </div>
    </div>
  );
}

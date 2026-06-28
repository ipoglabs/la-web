// src/app/components/ReviewSectionMap.tsx
"use client";

import React from "react";
import Link from "next/link";

type Item = {
  title: string;
  value?: string;
  type?: "text" | "bullets";
};

type ImageItem = {
  imageUrl: string;
};

type MapData = {
  lat: number;
  lng: number;
  address?: string;
};

export default function ReviewDetailsSection({
  title,
  dataProvider = [],
  imageProvider = [],
  mapData,
  routeBackTo,
  isLastItem = false,
}: {
  title: string;
  dataProvider?: Item[];
  imageProvider?: ImageItem[];
  mapData?: MapData | null;
  routeBackTo?: string;
  isLastItem?: boolean;
}) {
  return (
    <section
      className={`pt-2 pb-6 ${
        isLastItem ? "" : "border-b border-gray-200"
      }`}
    >
      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>

      {/* Key–Value rows */}
      <div className="space-y-2 mb-2">
        {dataProvider.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-2 gap-4 text-xs sm:text-sm items-start"
          >
            <p className="text-gray-600">{item.title}</p>

            {item.type === "bullets" ? (
              <ul className="text-gray-900 list-disc ml-5">
                {String(item.value || "")
                  .split(",")
                  .map((v, i) => (
                    <li key={i}>{v.trim()}</li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-900 break-words">{item.value ?? "—"}</p>
            )}
          </div>
        ))}
      </div>

      {/* Map */}
      {mapData && (
        <div className="mt-2">
          <iframe
            width="100%"
            height="230"
            loading="lazy"
            allowFullScreen
            className="rounded-none border border-gray-300"
            // 🔥 All controls removed
            src={`https://www.google.com/maps?q=${mapData.lat},${mapData.lng}&hl=en&z=15&output=embed&zoomcontrol=0&maptypecontrol=0&streetviewcontrol=0&fullscreencontrol=0`}
          />
        </div>
      )}

      {/* Photos */}
      {imageProvider.length > 0 && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imageProvider.map((img, i) => (
            <img
              key={i}
              src={img.imageUrl}
              className="w-full h-24 object-cover border border-gray-300"
              alt=""
            />
          ))}
        </div>
      )}

      {/* Change link */}
      {routeBackTo && (
        <div className="mt-2">
          <Link
            href={routeBackTo}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Change
          </Link>
        </div>
      )}
    </section>
  );
}

// src/app/post/pick-location/page.tsx
"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import LocationPickerMap from "@/app/components/LocationPickerMap";
import PostFooter from "../components/PostFooter";
import PostHeader from "../components/PostHeader";
import PageHeader from "../components/PageHeader";
import { usePostFormStore } from "../store/postFormStore";

const libraries: ("places")[] = ["places"];

type StoreLocation = {
  lat?: number;
  lng?: number;
  address?: string;
};

export default function SelectLocationPage() {
  const router = useRouter();

  const location = usePostFormStore((s) => s.location as StoreLocation | undefined);
  const setField = usePostFormStore((s) => s.setField);

  const [query, setQuery] = useState(location?.address ?? "");
  const hasSelection = useMemo(() => Boolean(location?.address), [location]);

  // ✅ Load Google Maps JS here
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  // ref for Places Autocomplete instance
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    const ac = acRef.current;
    if (!ac) return;

    const place = ac.getPlace();
    if (!place?.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const addr = place.formatted_address || query;

    setField("location", { lat, lng, address: addr });
    setQuery(addr);
  };

  // Fallback: user types text and clicks "Locate" without selecting suggestion
  const handleLocate = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        trimmed
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();
      const result = data.results?.[0];
      if (!result) return;

      const lat = result.geometry?.location?.lat;
      const lng = result.geometry?.location?.lng;
      const addr = result.formatted_address || trimmed;

      if (typeof lat === "number" && typeof lng === "number") {
        setField("location", { lat, lng, address: addr });
        setQuery(addr);
      }
    } catch (e) {
      console.error("Geocode failed:", e);
    }
  };

  const forcedPosition =
    location && typeof location.lat === "number" && typeof location.lng === "number"
      ? { lat: location.lat, lng: location.lng, address: location.address }
      : undefined;

  if (!isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading map…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <PostHeader />

      {/* Top Section */}
      <div className="flex flex-col items-center justify-center p-8 pb-0">
        <PageHeader
          title="Select Location"
          description="Select the location most relevant to your post so users can find it easily."
        />
      </div>

      {/* Map + Search */}
      <div className="relative w-full flex-1 mt-4">
        {/* 🔎 Overlay search bar */}
        <div className="absolute top-[1px] left-1/2 -translate-x-1/2 w-full max-w-md flex items-center gap-2 z-20 bg-white border-t border-b border-gray-300 p-4 md:rounded-bl-xl md:rounded-br-xl md:shadow-lg md:shadow-gray-400/10">
          <Autocomplete
            onLoad={(ac) => {
              acRef.current = ac;
            }}
            onPlaceChanged={handlePlaceChanged}
            options={{
              fields: ["geometry", "formatted_address", "name", "address_components"],
              types: ["geocode"],
            }}
          >
            <input
              type="text"
              placeholder="Ex: Trichy, TN"
              className="flex-1 rounded-md border border-gray-300 p-2 bg-gray-300/60 text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Autocomplete>

          <button
            onClick={handleLocate}
            className="px-4 py-2 rounded-md bg-gray-900 text-white font-semibold shadow hover:bg-gray-700 flex items-center justify-center gap-2"
            title="Search"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
              aria-label="Search"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
            <span className="hidden md:inline text-base font-medium">Locate</span>
          </button>
        </div>

        {/* Map container */}
        <div className="w-full min-h-[320px] h-[320px] md:h-[400px] rounded-none overflow-hidden border-2 border-gray-300 bg-gray-200">
          <LocationPickerMap
            hideSearch
            position={forcedPosition}
            onLocationSelect={(loc) => {
              setField("location", loc);
              if (loc?.address) setQuery(loc.address);
            }}
          />
        </div>
      </div>

      {/* Bottom Section: Selected info + footer */}
      <div className="w-full flex flex-col items-center justify-center mt-6 mb-8">
        <div className="w-full max-w-4xl flex flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center min-w-[220px]">
            <div className="mb-2 text-center">
              <div className="text-sm text-gray-700 font-semibold mb-1">
                Selected Coordinates:
              </div>
              <div className="text-base text-gray-900 flex gap-2 justify-center">
                {location?.lat && location?.lng
                  ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
                  : "Lat: 51.4462, Lng: 0.2190"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-700 font-semibold mb-1">
                Address from Map:
              </div>
              <div className="text-base text-gray-900 flex gap-2 justify-center">
                {location?.address
                  ? location.address
                  : "Unit A8, Greatorex Street, London, England, E1 5NF"}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl mt-12">
          <PostFooter
            showBack
            showNext
            showSubmit={false}
            basePath="/post"
            steps={["select-category", "details", "upload-photo", "pick-location", "preview"]}
            isNextDisabled={!hasSelection}
            onNext={() => router.push("/post/preview")}
            onBack={() => router.push("/post/upload-photo")}
          />
        </div>
      </div>
    </main>
  );
}

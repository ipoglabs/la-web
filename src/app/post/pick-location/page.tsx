"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import LocationPickerMap from "@/app/components/LocationPickerMap";
import PostFooter from "../components/PostFooter";
import PostHeader from "../components/PostHeader";
import PageHeader from "../components/PageHeader";
import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";

const libraries: ("places")[] = ["places"];

export default function SelectLocationPage() {
  useWizardGuard("pick-location");

  const router = useRouter();

  // ✅ Use existing store API (no setLocation!)
  const location = usePostFormStore((s) => s.location);
  const setField = usePostFormStore((s) => s.setField);

  const [query, setQuery] = useState(location?.address ?? "");

  const hasSelection = useMemo(
    () => Boolean(location?.address),
    [location]
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const acRef = useRef<google.maps.places.Autocomplete | null>(null);

  // ✅ When selecting from Google autocomplete
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

  // ✅ If location already selected
  const forcedPosition =
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number"
      ? {
          lat: location.lat,
          lng: location.lng,
          address: location.address,
        }
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

      {/* Header */}
      <div className="flex flex-col items-center p-8 pb-0">
        <PageHeader
          title="Select Location"
          description="Select the location most relevant to your post."
        />
      </div>

      {/* Map Section */}
      <div className="relative w-full flex-1 mt-4">
        {/* Search Bar */}
        <div className="absolute top-4 left-4 right-4 z-20">
  <Autocomplete
    onLoad={(ac) => (acRef.current = ac)}
    onPlaceChanged={handlePlaceChanged}
    options={{
      fields: ["geometry", "formatted_address"],
      types: ["geocode"],
    }}
  >
    <input
      type="text"
      placeholder="Search location"
      className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl shadow-md text-base focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  </Autocomplete>
</div>


        {/* Map */}
        <div className="w-full h-[400px]">
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

      {/* ✅ Show Selected Location */}
      {location?.address && (
        <div className="w-full flex justify-center mt-4">
          <div className="max-w-md w-full bg-green-50 border border-green-200 rounded-md p-4 text-sm shadow-sm">
            <strong>Selected Location:</strong>
            <div className="mt-2 text-gray-700">
              {location.address}
            </div>

            {typeof location.lat === "number" &&
              typeof location.lng === "number" && (
                <div className="text-xs text-gray-500 mt-2">
                  Lat: {location.lat.toFixed(6)} | Lng:{" "}
                  {location.lng.toFixed(6)}
                </div>
              )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="w-full flex justify-center mt-6 mb-8">
        <div className="w-full max-w-xl px-6">
          <PostFooter
            showBack
            showNext
            isNextDisabled={!hasSelection}
            onBack={() => router.push("/post/upload-photo")}
            onNext={() => router.push("/post/preview")}
          />
        </div>
      </div>
    </main>
  );
}

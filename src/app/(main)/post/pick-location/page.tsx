"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { toast } from "sonner";

import LocationPickerMap from "@/components/LocationPickerMap";
import PostFooter from "../components/PostFooter";
import PostHeader from "../components/PostHeader";
import PageHeader from "../components/PageHeader";
import { usePostFormStore } from "../store/postFormStore";
import { useWizardGuard } from "../wizard/guard";
import { useAuthStore } from "@/store/authStore";
import { getTimezoneLocation } from "@/lib/timezoneLocation";
import { cn } from "@/lib/utils";
import type { GeoResult } from "@/app/api/geo/route";

type LocationAccuracy = "precise" | "approximate" | "default";

const libraries: ("places")[] = ["places"];

export default function SelectLocationPage() {
  useWizardGuard("pick-location");

  const router = useRouter();

  const location = usePostFormStore((s) => s.location);
  const setField = usePostFormStore((s) => s.setField);
  const userLocality = useAuthStore((s) => s.user?.locality);

  const [query, setQuery] = useState(location?.address ?? "");
  const [accuracy, setAccuracy] = useState<LocationAccuracy | null>(null);
  const [detecting, setDetecting] = useState(false);

  const hasSelection = useMemo(() => Boolean(location?.address), [location]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const acRef = useRef<google.maps.places.Autocomplete | null>(null);

  /* ---------- helpers ---------- */

  const forwardGeocode = useCallback(async (address: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/geo/forward?address=${encodeURIComponent(address)}`);
      if (!res.ok) return false;
      const data = await res.json();
      if (typeof data.lat !== "number" || typeof data.lng !== "number") return false;
      setField("location", { lat: data.lat, lng: data.lng, address: data.address });
      setQuery(data.address);
      setAccuracy("approximate");
      return true;
    } catch {
      return false;
    }
  }, [setField]);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(`/api/geo/reverse?lat=${lat}&lng=${lng}`);
      if (!res.ok) return "Current Location";
      const data = await res.json();
      return data.address || "Current Location";
    } catch {
      return "Current Location";
    }
  }, []);

  const applyTimezoneDefault = useCallback(() => {
    const geo = getTimezoneLocation();
    setField("location", { lat: geo.lat, lng: geo.lng, address: geo.address });
    setQuery(geo.address);
    setAccuracy("default");
  }, [setField]);

  const fetchIPLocation = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/geo");
      if (!res.ok) return false;
      const geo: GeoResult | null = await res.json();
      if (!geo) return false;
      setField("location", { lat: geo.lat, lng: geo.lng, address: geo.address });
      setQuery(geo.address);
      setAccuracy("approximate");
      return true;
    } catch {
      return false;
    }
  }, [setField]);

  /* ---------- auto-detect on mount if no location set ---------- */

  useEffect(() => {
    if (location?.address) return;
    let cancelled = false;

    (async () => {
      setDetecting(true);

      if (!cancelled && userLocality) {
        const ok = await forwardGeocode(userLocality);
        if (!cancelled) setDetecting(false);
        if (ok || cancelled) return;
      }

      const ok = await fetchIPLocation();
      if (!cancelled && !ok) applyTimezoneDefault();
      if (!cancelled) setDetecting(false);
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- autocomplete ---------- */

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
    setAccuracy("precise");
  };

  /* ---------- GPS ---------- */

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.info("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const address = await reverseGeocode(lat, lng);
        setField("location", { lat, lng, address });
        setQuery(address);
        setAccuracy("precise");
        setDetecting(false);
      },
      async () => {
        // Permission denied or unavailable — fall back silently
        const ok = await fetchIPLocation();
        if (!ok) applyTimezoneDefault();
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ---------- map pin drag ---------- */

  const forcedPosition =
    location && typeof location.lat === "number" && typeof location.lng === "number"
      ? { lat: location.lat, lng: location.lng, address: location.address }
      : undefined;

  /* ---------- accuracy badge ---------- */

  const accuracyBadge =
    accuracy === "precise" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        Precise
      </span>
    ) : accuracy === "approximate" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
        Approximate
      </span>
    ) : accuracy === "default" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
        Default region
      </span>
    ) : null;

  /* ---------- render ---------- */

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <PostHeader />

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
          {isLoaded ? (
            <Autocomplete
              onLoad={(ac) => (acRef.current = ac)}
              onPlaceChanged={handlePlaceChanged}
              options={{ fields: ["geometry", "formatted_address"], types: ["geocode"] }}
            >
              <input
                type="text"
                placeholder="Search location"
                className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl shadow-md text-base focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              placeholder="Search location"
              className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl shadow-md text-base focus:outline-none"
              disabled
            />
          )}
        </div>

        {/* GPS button */}
        <div className="absolute top-20 left-4 right-4 z-20 flex justify-end">
          <button
            onClick={handleUseCurrentLocation}
            disabled={detecting}
            className={cn(
              "bg-white px-4 py-2 rounded-xl shadow-md border text-sm transition",
              detecting ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
            )}
          >
            {detecting ? "Detecting…" : "📍 Use Current Location"}
          </button>
        </div>

        {/* Map */}
        <div className="w-full h-[400px]">
          {isLoaded ? (
            <LocationPickerMap
              hideSearch
              position={forcedPosition}
              onLocationSelect={(loc) => {
                setField("location", loc);
                if (loc?.address) setQuery(loc.address);
                setAccuracy("precise");
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-sm text-gray-500">Loading map…</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected location card */}
      {location?.address && (
        <div className="w-full flex justify-center mt-4">
          <div className="max-w-md w-full bg-green-50 border border-green-200 rounded-md p-4 text-sm shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <strong>Selected Location</strong>
              {accuracyBadge}
            </div>
            <div className="text-gray-700">{location.address}</div>
            {typeof location.lat === "number" && typeof location.lng === "number" && (
              <div className="text-xs text-gray-500 mt-2">
                Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
              </div>
            )}
            {accuracy === "approximate" && (
              <p className="text-xs text-amber-600 mt-2">
                Based on your IP address. Search or tap the map for a precise location.
              </p>
            )}
            {accuracy === "default" && (
              <p className="text-xs text-gray-500 mt-2">
                Could not detect your location. Search or tap the map to set it.
              </p>
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
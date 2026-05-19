"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/components/phone-number-input/countries";
import { useCountryStore } from "@/store/countryStore";
import { OverlayCountrySelect } from "../components/OverlayCountrySelect";

export default function SwitchCountryPage() {
  const router          = useRouter();
  const storeCountry    = useCountryStore((s) => s.country);
  const setStoreCountry = useCountryStore((s) => s.setCountry);

  // Start with whatever is already in the store (from cookie), or null for new visitors
  const [selectedCode, setSelectedCode] = useState<string | null>(
    storeCountry?.code ?? null
  );
  // Auto-open the overlay if no country is selected yet (new visitor)
  const [showOverlay, setShowOverlay]   = useState(!storeCountry);
  const [justSwitched, setJustSwitched] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  const country = selectedCode
    ? (COUNTRIES.find((c) => c.code === selectedCode) ?? null)
    : null;

  function handleSelect(code: string) {
    const selected = COUNTRIES.find((c) => c.code === code);
    if (!selected) return;

    setStoreCountry(selected); // writes cookie + updates store
    setSelectedCode(code);
    setShowOverlay(false);
    setJustSwitched(true);

    if (flashTimer.current) clearTimeout(flashTimer.current);
    // Show the success flash briefly then redirect home
    flashTimer.current = setTimeout(() => router.replace("/"), 1500);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 gap-8">

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Select Country</h1>
        <p className="text-sm text-slate-500 mt-1">
          Choose the country you want to browse in
        </p>
      </div>

      {/* Country card — only shown once a country is selected */}
      {country && (
        <div
          className={[
            "bg-white rounded-2xl shadow-md border w-full max-w-xs p-6 flex flex-col items-center gap-4 transition-all duration-300",
            justSwitched
              ? "border-emerald-400 shadow-emerald-100 shadow-lg"
              : "border-slate-200",
          ].join(" ")}
        >
          {/* Flag */}
          <div
            className={[
              "rounded-xl overflow-hidden shadow transition-all duration-300",
              justSwitched ? "ring-2 ring-emerald-400 ring-offset-2" : "",
            ].join(" ")}
          >
            <Image
              src={`/flags/${country.code.toLowerCase()}.svg`}
              alt={country.name}
              width={96}
              height={72}
              className="object-cover"
            />
          </div>

          {/* Country info */}
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{country.name}</p>
            <p className="text-sm text-slate-400 mt-0.5">+{country.dial}</p>
          </div>

          {/* Success flash */}
          <div
            className={[
              "text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full px-3 py-1 transition-all duration-300",
              justSwitched
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none",
            ].join(" ")}
          >
            ✓ Country updated
          </div>

          {/* Switch button */}
          <button
            type="button"
            onClick={() => setShowOverlay(true)}
            className="w-full mt-1 h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 active:scale-95 transition-all duration-100"
          >
            Switch Country
          </button>
        </div>
      )}

      {/* Overlay — non-dismissible for new visitors (no country yet), dismissible otherwise */}
      {showOverlay && (
        <OverlayCountrySelect
          currentCode={selectedCode}
          onSelect={handleSelect}
          onClose={country ? () => setShowOverlay(false) : undefined}
        />
      )}
    </div>
  );
}

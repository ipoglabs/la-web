"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/data/countries";
import { OverlayCountrySelect } from "@/components/overlay-country-select";

// Default to Singapore for demo purposes
const DEFAULT_CODE = "SG";

export default function SwitchCountryPage() {
  const [countryCode, setCountryCode] = useState(DEFAULT_CODE);
  const [showOverlay, setShowOverlay] = useState(false);
  const [justSwitched, setJustSwitched] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  const country = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];

  function handleSelect(code: string) {
    setCountryCode(code);
    setShowOverlay(false);
    setJustSwitched(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setJustSwitched(false), 2500);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 gap-8">

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Switch Country</h1>
        <p className="text-sm text-slate-500 mt-1">Snippet · country selection overlay</p>
      </div>

      {/* Country card */}
      <div
        className={[
          "bg-white rounded-2xl shadow-md border w-full max-w-xs p-6 flex flex-col items-center gap-4 transition-all duration-300",
          justSwitched ? "border-emerald-400 shadow-emerald-100 shadow-lg" : "border-slate-200",
        ].join(" ")}
      >
        {/* Flag */}
        <div className={[
          "rounded-xl overflow-hidden shadow transition-all duration-300",
          justSwitched ? "ring-2 ring-emerald-400 ring-offset-2" : "",
        ].join(" ")}>
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
          <p className="text-sm text-slate-400 mt-0.5">{country.dial}</p>
        </div>

        {/* Success flash */}
        <div className={[
          "text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full px-3 py-1 transition-all duration-300",
          justSwitched ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
        ].join(" ")}>
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

      {/* Output display */}
      <div className="w-full max-w-xs bg-white border border-slate-200 rounded-xl px-4 py-3">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Output</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{country.flag}</span>
          <div>
            <p className="text-sm font-semibold text-slate-800">{country.name}</p>
            <p className="text-xs text-slate-400">{country.code} · {country.dial}</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {showOverlay && (
        <OverlayCountrySelect
          currentCode={countryCode}
          onSelect={handleSelect}
          onClose={() => setShowOverlay(false)}
          navigateOnSelect={false}
        />
      )}
    </div>
  );
}

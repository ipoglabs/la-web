"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isSupportedCountry } from "@/lib/country-context";
import { commitCountry } from "@/lib/country-cookie";
import { COUNTRIES } from "@/lib/data/countries";

interface Props {
  /** Pre-highlight a country when the overlay opens */
  currentCode?: string;
  /** Called with the chosen code after commit. If omitted, falls back to router.refresh() */
  onSelect?: (code: string) => void;
  /** If provided, a close button is shown and called on dismiss */
  onClose?: () => void;
}

export function OverlayCountrySelect({ currentCode, onSelect, onClose }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(currentCode ?? null);

  function handleSelect(code: string) {
    if (!isSupportedCountry(code)) return;
    setSelected(code);
    commitCountry(code);
    if (onSelect) {
      onSelect(code);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm md:max-w-lg min-[900px]:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-7 pb-5 text-center border-b border-slate-100 relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          )}
          <div className="text-3xl mb-3">🌏</div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            Where are you based?
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Select your country to get the right experience
          </p>
        </div>

        {/* Country grid — 2 cols mobile / 4 cols tablet / 5 cols desktop (900px+) */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 min-[900px]:grid-cols-5 gap-2.5 max-h-[60vh] overflow-y-auto">
          {COUNTRIES.map((c) => {
            const isSelected = selected === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c.code)}
                className={[
                  "flex flex-col items-center gap-2 rounded-xl border p-3.5 transition-all duration-100 active:scale-95",
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-400 ring-offset-1"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50",
                ].join(" ")}
              >
                <Image
                  src={`/flags/${c.code.toLowerCase()}.svg`}
                  alt={c.name}
                  width={56}
                  height={42}
                  className="rounded object-cover shadow-sm"
                />
                <span className={[
                  "text-xs font-medium text-center leading-tight",
                  isSelected ? "text-blue-700" : "text-slate-700",
                ].join(" ")}>
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Your preference is saved for 30 days
          </p>
        </div>

      </div>
    </div>
  );
}

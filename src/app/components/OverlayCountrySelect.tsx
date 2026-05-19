"use client";

import { COUNTRIES } from "@/components/phone-number-input/countries";
import { cn } from "@/lib/utils";

type Props = {
  currentCode: string | null;
  onSelect: (code: string) => void;
  onClose?: () => void; // optional — if omitted the backdrop is non-dismissible (forces a pick)
};

export function OverlayCountrySelect({ currentCode, onSelect, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-base font-semibold text-slate-900">Select Country</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose the country you want to browse in
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelect(c.code)}
              className={cn(
                "flex flex-col items-center gap-2 px-3 py-4 rounded-2xl",
                "border-2 transition-colors",
                currentCode === c.code
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
              )}
            >
              <div className="w-14 h-10 rounded-md overflow-hidden shrink-0">
                <c.Flag className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold text-slate-800 text-center leading-tight">
                {c.name}
              </span>
              <span className="text-xs text-slate-400">+{c.dial}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

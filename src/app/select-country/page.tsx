"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCountryStore } from "@/store/countryStore";
import { COUNTRIES, type Country } from "@/components/phone-number-input/countries";
import { cn } from "@/lib/utils";

export default function SelectCountryPage() {
  const router     = useRouter();
  const setCountry = useCountryStore((s) => s.setCountry);
  const [picking, setPicking] = useState<string | null>(null);

  function handleSelect(c: Country) {
    if (picking) return;
    setPicking(c.code);
    setCountry(c);
    router.replace("/");
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl px-6">
      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-1.5">
          <h1 className="text-xl font-semibold text-slate-900">
            Select your country
          </h1>
          <p className="text-sm text-slate-500">
            Choose the country you're browsing from to continue.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              disabled={!!picking}
              onClick={() => handleSelect(c)}
              className={cn(
                "flex flex-col items-center gap-2 px-3 py-5 rounded-2xl",
                "border-2 border-slate-200 bg-slate-50 transition-colors",
                picking === c.code
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50"
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCountryStore } from "@/store/countryStore";

export function CountryBadge() {
  const country = useCountryStore((s) => s.country);

  if (!country) return null;

  return (
    <Link
      href="/switch-country"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 backdrop-blur-sm shadow-md px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:shadow-lg transition-all"
    >
      <div className="w-5 h-4 rounded-sm overflow-hidden shrink-0">
        <Image
          src={`/flags/${country.code.toLowerCase()}.svg`}
          alt={country.name}
          width={20}
          height={16}
          className="w-full h-full object-cover"
        />
      </div>
      {country.name}
    </Link>
  );
}

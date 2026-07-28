"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ALLOWED_COUNTRY_CODES, isAllowedCountry, COUNTRY_COOKIE } from "@/lib/country-context";
import { GLOBAL_CONFIG, COUNTRY_CONFIGS } from "@/config";
import { commitCountry } from "@/lib/country-cookie";
import { COUNTRIES } from "@/lib/data/countries";

// Grid is always filtered to allowed countries only (UK · India · Singapore)
const allowedCountries = COUNTRIES.filter(c => ALLOWED_COUNTRY_CODES.includes(c.code));

// Use displayName from COUNTRY_CONFIGS when available (e.g. "United Kingdom" instead of "UK")
function getDisplayName(isoCode: string, fallback: string): string {
  const entry = Object.values(COUNTRY_CONFIGS).find(c => c.isoCode === isoCode);
  return entry?.displayName ?? fallback;
}

// Look up display name + flag emoji for any ISO code (used for the banner)
function getCountryDisplay(code: string): { name: string; flag: string } {
  const found = COUNTRIES.find(c => c.code === code);
  return found ? { name: found.name, flag: found.flag } : { name: code, flag: "🌍" };
}

// Read the active countryContext cookie value client-side (may be empty on first visit)
function readActiveCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COUNTRY_COOKIE}=([^;]*)`));
  const code = match ? decodeURIComponent(match[1]) : "";
  return isAllowedCountry(code) ? code : null;
}

interface Props {
  /** Pre-highlight a country when the overlay opens */
  currentCode?: string;
  /**
   * ISO code of the country that was detected but is not in the allowed list.
   * When provided, a contextual banner is shown above the picker grid explaining
   * why the user sees this overlay and listing the supported countries.
   */
  detectedCountry?: string;
  /** Called after the cookie is committed and navigation/refresh fires. Use for UI cleanup only (e.g. close a dropdown). */
  onSelect?: (code: string) => void;
  /** If provided, a close button is shown and called on dismiss */
  onClose?: () => void;
  /**
   * Whether selecting a country navigates to "/" (fresh landing for the new
   * market) + router.refresh(). Defaults to true — this is required for
   * correct behaviour anywhere in the real app (see handleSelect for why).
   * Set to false only for isolated design-system/snippet demos that render
   * this component purely for visual reference and must never navigate the
   * user away from the demo page.
   */
  navigateOnSelect?: boolean;
}

export function OverlayCountrySelect({ currentCode, detectedCountry, onSelect, onClose, navigateOnSelect = true }: Props) {
  const router = useRouter();
  // Seed from explicit prop first, then from the active cookie (switch-country flow)
  const [selected, setSelected] = useState<string | null>(
    currentCode ?? readActiveCookie()
  );

  function handleSelect(code: string) {
    if (!isAllowedCountry(code)) return;
    setSelected(code);
    commitCountry(code);

    // Always land on the fresh landing page for the new country — never stay
    // on the current route. Two reasons this matters:
    //  1. Country-prefixed routes (/in/listings, /sg/listings/...) treat the
    //     URL segment as the source of truth (see CountryProvider) — it wins
    //     over the cookie, so refresh() alone would leave the UI looking
    //     unchanged until the user manually navigated away.
    //  2. Listing/browse data is market-specific (ids, currency, mock data) —
    //     refreshing in place would either show stale data for the old
    //     market or mix markets. Returning to "/" guarantees a clean start.
    // push() navigates first, refresh() (same tick) forces the root layout
    // and every Server Component to re-read the just-committed cookie rather
    // than serve a cached render — same pattern used everywhere else in the
    // app, just paired with a navigation this time.
    if (navigateOnSelect) {
      router.push("/");
      router.refresh();
    }
    // Always refresh immediately — before any parent closes/unmounts.
    // The onSelect callback handles UI cleanup only (close dropdown etc.).
    if (onSelect) onSelect(code);

    // TODO(API): Persist country preference to backend when auth is integrated.
    // POST /api/user/preferences  { country: code }
    // This ensures the server-side session reflects the user's selected country
    // and allows per-user overrides beyond the cookie window.
  }

  const detected = detectedCountry ? getCountryDisplay(detectedCountry) : null;
  const supportedList = allowedCountries.map(c => `${c.flag} ${getDisplayName(c.code, c.name)}`).join(" · ");

  const overlay = (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Contextual banner — shown when a non-allowed country was detected ── */}
        {detected && (
          <div className="px-5 pt-5 pb-4 bg-amber-50 border-b border-amber-200">
            <p className="text-sm font-semibold text-amber-900 leading-snug">
              We detected you&rsquo;re browsing from{" "}
              <span className="whitespace-nowrap">{detected.flag} {detected.name}</span>.
            </p>
            <p className="text-sm text-amber-800 mt-1 leading-snug">
              Unfortunately lokalads is not yet available in {detected.name}.
            </p>
            <p className="text-sm text-amber-800 mt-2 leading-snug">
              We currently support:{" "}
              <span className="font-medium">{supportedList}</span>
            </p>
            <p className="text-sm text-amber-700 mt-2">
              If you&rsquo;re in one of these countries, please select below to continue.
            </p>
          </div>
        )}

        {/* ── Standard header ── */}
        <div className="px-6 pt-6 pb-5 text-center border-b border-slate-100 relative">
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
            {detected ? "Select a country to continue" : "Where are you based?"}
          </h2>
          {!detected && (
            <p className="text-sm text-slate-500 mt-1.5">
              Select your country to get the right experience
            </p>
          )}
        </div>

        {/* ── Country grid — 3 allowed countries ── */}
        <div className="p-5 grid grid-cols-3 gap-3">
          {allowedCountries.map((c) => {
            const isSelected = selected === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c.code)}
                className={[
                  "relative flex flex-col items-center gap-2 rounded-xl border p-3.5 transition-all duration-100 active:scale-95",
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-400 ring-offset-1"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50",
                ].join(" ")}
              >
                {/* Tick badge — top-right corner when selected */}
                {isSelected && (
                  <span className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-blue-500">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <Image
                  src={`/flags/${c.code.toLowerCase()}.svg`}
                  alt={c.name}
                  width={56}
                  height={42}
                  className="rounded object-cover shadow-sm"
                />
                <span className={[
                  "text-sm font-medium text-center leading-tight",
                  isSelected ? "text-blue-700" : "text-slate-700",
                ].join(" ")}>
                  {getDisplayName(c.code, c.name)}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Footer note (duration driven from GLOBAL_CONFIG) ── */}
        <div className="px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Your preference is saved for {GLOBAL_CONFIG.cookieMaxAgeDays} days
          </p>
        </div>

      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

"use client";

/**
 * LocationSearch — Search subcomponent for LocationPicker
 *
 * ─── DEVELOPER NOTES: Switching to real Google Places API ────────────────────
 *
 * This component supports two modes:
 *
 * 1. searchProvider="none"  (default)
 *    Filters a built-in static list of cities locally. No API calls, no key.
 *    Good for POC / offline use.
 *
 * 2. searchProvider="google" + googleApiKey="YOUR_KEY"
 *    Calls Google Places Autocomplete API via a Next.js API route (proxy).
 *    The key is NEVER exposed to the browser — all calls go through /api/places.
 *
 *    SETUP STEPS:
 *    a) Enable "Places API" in Google Cloud Console (same project/key as
 *       GOOGLE_MAPS_API_KEY, used elsewhere for Geocoding)
 *       → https://console.cloud.google.com/apis/library/places-backend.googleapis.com
 *    b) No new key needed — the proxy route reuses GOOGLE_MAPS_API_KEY.
 *    c) Create the proxy route (already prepared below at /api/places/route.ts).
 *       The route accepts ?input=<query> and returns normalised suggestions.
 *    d) Pass props to LocationPicker:
 *       <LocationPicker searchProvider="google" />
 *       (all auth is handled server-side via the proxy route)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchSuggestion = {
  label: string;
  sublabel?: string;
  lat?: number;
  lng?: number;
  placeId?: string; // Google Place ID — useful for downstream detail fetches
};

type Props = {
  placeholder?: string;
  onSelect: (s: SearchSuggestion) => void;
  searchProvider?: "google" | "none";
  /** Restrict results to these country codes, e.g. ["UK", "SG", "IN"] */
  countryScope?: string[];
  disabled?: boolean;
};

// ─── Country scope ────────────────────────────────────────────────────────────

export const COUNTRY_KEYWORDS: Record<string, string[]> = {
  UK: ["uk", "united kingdom", "england", "scotland", "wales"],
  SG: ["singapore"],
  IN: ["india"],
  US: ["us", "united states", "usa"],
  AU: ["australia"],
  AE: ["uae", "united arab emirates"],
  CA: ["canada"],
};

export function matchesScope(
  sublabel: string | undefined,
  scope: string[]
): boolean {
  if (!sublabel) return false;
  const lower = sublabel.toLowerCase();
  return scope.some((code) => {
    const keywords = COUNTRY_KEYWORDS[code.toUpperCase()] ?? [code.toLowerCase()];
    return keywords.some((kw) => lower.includes(kw));
  });
}

// ─── Static fallback list (searchProvider="none") ────────────────────────────

export const STATIC_SUGGESTIONS: SearchSuggestion[] = [
  // UK
  { label: "London", sublabel: "Greater London, UK", lat: 51.5074, lng: -0.1278 },
  { label: "Manchester", sublabel: "Greater Manchester, UK", lat: 53.4808, lng: -2.2426 },
  { label: "Birmingham", sublabel: "West Midlands, UK", lat: 52.4862, lng: -1.8904 },
  { label: "Edinburgh", sublabel: "Scotland, UK", lat: 55.9533, lng: -3.1883 },
  { label: "Bristol", sublabel: "England, UK", lat: 51.4545, lng: -2.5879 },
  { label: "Leeds", sublabel: "West Yorkshire, UK", lat: 53.8008, lng: -1.5491 },
  { label: "Glasgow", sublabel: "Scotland, UK", lat: 55.8642, lng: -4.2518 },
  // India
  { label: "Mumbai", sublabel: "Maharashtra, India", lat: 19.076, lng: 72.8777 },
  { label: "Delhi", sublabel: "Delhi, India", lat: 28.7041, lng: 77.1025 },
  { label: "Bangalore", sublabel: "Karnataka, India", lat: 12.9716, lng: 77.5946 },
  { label: "Chennai", sublabel: "Tamil Nadu, India", lat: 13.0827, lng: 80.2707 },
  { label: "Hyderabad", sublabel: "Telangana, India", lat: 17.385, lng: 78.4867 },
  { label: "Kolkata", sublabel: "West Bengal, India", lat: 22.5726, lng: 88.3639 },
  { label: "Pune", sublabel: "Maharashtra, India", lat: 18.5204, lng: 73.8567 },
  // Singapore
  { label: "Singapore", sublabel: "Singapore", lat: 1.3521, lng: 103.8198 },
  { label: "Orchard Road", sublabel: "Central, Singapore", lat: 1.3047, lng: 103.8318 },
  { label: "Jurong East", sublabel: "West Region, Singapore", lat: 1.3329, lng: 103.7436 },
  { label: "Tampines", sublabel: "East Region, Singapore", lat: 1.3543, lng: 103.9436 },
  { label: "Changi", sublabel: "East Region, Singapore", lat: 1.3644, lng: 103.9915 },
  // Others
  { label: "New York", sublabel: "New York, US", lat: 40.7128, lng: -74.006 },
  { label: "Sydney", sublabel: "New South Wales, Australia", lat: -33.8688, lng: 151.2093 },
  { label: "Dubai", sublabel: "UAE", lat: 25.2048, lng: 55.2708 },
  { label: "Toronto", sublabel: "Ontario, Canada", lat: 43.6532, lng: -79.3832 },
];

/**
 * Real Google Places fetch via proxy route (/api/places/route.ts).
 * Note: that route already returns pre-normalised { label, sublabel, placeId }
 * objects, so no further reshaping is needed here — lat/lng aren't returned by
 * Autocomplete and would need a separate Place Details call if a caller needs
 * coordinates immediately on select.
 */
export async function realGoogleSearch(query: string): Promise<SearchSuggestion[]> {
  const res = await fetch(`/api/places?input=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Places API error");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return (data.predictions ?? []) as SearchSuggestion[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LocationSearch({
  placeholder = "Search location…",
  onSelect,
  searchProvider = "none",
  countryScope,
  disabled,
}: Props) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchSuggestion[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); setOpen(false); setFetchError(null); return; }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (searchProvider === "google") {
        setLoading(true);
        setFetchError(null);
        try {
          let suggestions = await realGoogleSearch(q);
          if (countryScope?.length) {
            suggestions = suggestions.filter((s) => matchesScope(s.sublabel, countryScope));
          }
          setResults(suggestions);
          setOpen(suggestions.length > 0);
        } catch {
          setFetchError("Couldn't fetch suggestions. Try again.");
          setResults([]);
          setOpen(false);
        } finally {
          setLoading(false);
        }
      } else {
        // Static local filter
        const lower = q.toLowerCase();
        let filtered = STATIC_SUGGESTIONS.filter(
          (s) =>
            s.label.toLowerCase().includes(lower) ||
            (s.sublabel?.toLowerCase().includes(lower) ?? false)
        );
        if (countryScope?.length) {
          filtered = filtered.filter((s) => matchesScope(s.sublabel, countryScope));
        }
        setResults(filtered);
        setOpen(filtered.length > 0);
      }
    }, searchProvider === "google" ? 350 : 0);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searchProvider, countryScope]);

  function handleSelect(s: SearchSuggestion) {
    setQuery("");
    setResults([]);
    setOpen(false);
    setFetchError(null);
    onSelect(s);
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
        {loading
          ? <svg className="h-4 w-4 text-slate-400 flex-none animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="28 56" strokeLinecap="round" />
            </svg>
          : <svg className="h-4 w-4 text-slate-400 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <circle cx="11" cy="11" r="7" strokeWidth="1.75" />
              <path d="M21 21l-4.35-4.35" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none disabled:cursor-not-allowed"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setOpen(false); setFetchError(null); inputRef.current?.focus(); }}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {fetchError && (
        <p className="px-3 py-2 text-sm text-red-500">{fetchError}</p>
      )}

      {open && (
        <div role="list" aria-label="Location suggestions" className="max-h-48 overflow-y-auto">
          {results.map((s) => (
            <div key={`${s.label}-${s.sublabel}`} role="listitem">
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
              >
                <svg className="h-4 w-4 text-slate-400 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 13 6 13s6-8.582 6-13c0-3.314-2.686-6-6-6z" strokeWidth="1.75" />
                  <circle cx="12" cy="8" r="2" strokeWidth="1.75" />
                </svg>
                <div>
                  <div className="text-sm font-medium text-slate-800">{s.label}</div>
                  {s.sublabel && <div className="text-sm text-slate-500">{s.sublabel}</div>}
                </div>

              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationSearch;
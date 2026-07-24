"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import {
  STATIC_SUGGESTIONS,
  realGoogleSearch,
  matchesScope,
  SearchSuggestion,
} from "./LocationSearch";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RadiusUnit = "mi" | "km";

export type LocationValue = {
  label: string;
  sublabel?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  unit?: RadiusUnit;
};

export type LocationPickerProps = {
  value?: LocationValue | null;
  defaultValue?: LocationValue | null;
  onChange?: (v: LocationValue | null) => void;
  showRadius?: boolean;
  radiusUnit?: RadiusUnit;
  /** Restrict search and suggestions to these country codes, e.g. ["UK", "SG", "IN"] */
  countryScope?: string[];
  searchProvider?: "google" | "none";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Render variant: "pill" (default glass split-pill) or "link" (plain <a> — style freely via triggerClassName) */
  trigger?: "pill" | "link";
  /** Extra classes applied directly to the <a> when trigger="link". No default styles — full developer control. */
  triggerClassName?: string;
};

// ─── Dummy data for Recent / Saved tabs ──────────────────────────────────────

const ALL_RECENT: SearchSuggestion[] = [
  { label: "London", sublabel: "Greater London, UK", lat: 51.5074, lng: -0.1278 },
  { label: "Birmingham", sublabel: "West Midlands, UK", lat: 52.4862, lng: -1.8904 },
  { label: "Manchester", sublabel: "Greater Manchester, UK", lat: 53.4808, lng: -2.2426 },
  { label: "Singapore", sublabel: "Singapore", lat: 1.3521, lng: 103.8198 },
  { label: "Orchard Road", sublabel: "Central, Singapore", lat: 1.3047, lng: 103.8318 },
  { label: "Mumbai", sublabel: "Maharashtra, India", lat: 19.076, lng: 72.8777 },
  { label: "Delhi", sublabel: "Delhi, India", lat: 28.7041, lng: 77.1025 },
  { label: "Bangalore", sublabel: "Karnataka, India", lat: 12.9716, lng: 77.5946 },
];

const ALL_SAVED: SearchSuggestion[] = [
  { label: "Home", sublabel: "Hackney, London, UK", lat: 51.5455, lng: -0.0553 },
  { label: "Office", sublabel: "Canary Wharf, London, UK", lat: 51.5033, lng: -0.0235 },
  { label: "Home", sublabel: "Tampines, Singapore", lat: 1.3543, lng: 103.9436 },
  { label: "Office", sublabel: "Marina Bay, Singapore", lat: 1.2865, lng: 103.8614 },
  { label: "Home", sublabel: "Bandra, Mumbai, India", lat: 19.0596, lng: 72.8295 },
  { label: "Office", sublabel: "Connaught Place, Delhi, India", lat: 28.6329, lng: 77.2195 },
];

// ─── Radius options ───────────────────────────────────────────────────────────

const RADIUS_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCrosshair({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="7" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="2" strokeWidth="1.75" fill="currentColor" stroke="none" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 13 6 13s6-8.582 6-13c0-3.314-2.686-6-6-6z" strokeWidth="1.75" />
      <circle cx="12" cy="8" r="2" strokeWidth="1.75" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Location row ─────────────────────────────────────────────────────────────

function LocationRow({
  suggestion,
  onSelect,
  onClear,
  onSave,
  isSaved,
  isActive,
}: {
  suggestion: SearchSuggestion;
  onSelect: () => void;
  onClear?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isActive?: boolean;
}) {
  return (
    <div className={cn("flex items-center border-l-2 transition-colors", isActive ? "border-l-blue-500 bg-blue-50/60" : "border-l-transparent")}>
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-1 items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-blue-50"
      >
        <IconPin className={cn("h-4.5 w-4.5 flex-none", isActive || isSaved ? "text-blue-500" : "text-slate-400")} />
        <div className="min-w-0">
          <div className={cn("truncate text-sm font-medium", isActive ? "text-blue-700" : "text-slate-800")}>{suggestion.label}</div>
          {suggestion.sublabel && (
            <div className="truncate text-sm font-normal text-slate-500">
              {suggestion.sublabel.split(", ").slice(0, -1).join(", ") || suggestion.sublabel}
            </div>
          )}
        </div>
      </button>
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          aria-label={isSaved ? `Unsave ${suggestion.label}` : `Save ${suggestion.label}`}
          title={isSaved ? "Unsave" : "Save"}
          className={cn(
            "flex h-8 w-8 flex-none items-center justify-center rounded-full transition-colors",
            isSaved
              ? "text-blue-500 hover:bg-blue-50"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          )}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" aria-hidden
            fill={isSaved ? "currentColor" : "none"}
          >
            <path d="M5 3h14a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" strokeWidth="1.75" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {/* Static bookmark badge for saved items (no onSave action) */}
      {isSaved && !onSave && (
        <span className="flex h-8 w-8 flex-none items-center justify-center text-blue-500" aria-label="Saved">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden>
            <path d="M5 3h14a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
        </span>
      )}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Remove ${suggestion.label}`}
          className="mr-2 flex h-8 w-8 flex-none items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Panel content (shared between Drawer and Dialog) ─────────────────────────

type PanelContentProps = {
  current: LocationValue | null;
  showRadius: boolean;
  radiusUnit: RadiusUnit;
  countryScope?: string[];
  searchProvider: "google" | "none";
  placeholder: string;
  disabled: boolean;
  gpsLoading: boolean;
  gpsError: string | null;
  gpsPermissionDenied: boolean;
  recentItems: SearchSuggestion[];
  savedItems: SearchSuggestion[];
  onClearRecent: (index: number) => void;
  onSaveRecent: (index: number) => void;
  onClearSaved: (index: number) => void;
  onRequestGps: () => void;
  onSelect: (s: SearchSuggestion) => void;
  onRadiusChange: (r: number) => void;
  onClose?: () => void;
};

function PanelContent({
  current,
  showRadius,
  radiusUnit,
  countryScope,
  searchProvider,
  placeholder,
  disabled,
  gpsLoading,
  gpsError,
  gpsPermissionDenied,
  recentItems,
  savedItems,
  onClearRecent,
  onSaveRecent,
  onClearSaved,
  onRequestGps,
  onSelect,
  onRadiusChange,
  onClose,
}: PanelContentProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [confirmSavedIndex, setConfirmSavedIndex] = React.useState<number | null>(null);
  const [savedOnly, setSavedOnly] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const radiusScrollRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  // Redirect vertical mouse wheel to horizontal scroll on radius row
  React.useEffect(() => {
    const el = radiusScrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY + e.deltaX;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Auto-focus search input when panel mounts
  React.useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  // Search
  React.useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setFetchError(null);
      return;
    }
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
        } catch {
          setFetchError("Couldn't fetch suggestions. Try again.");
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
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
        setFetchError(null);
      }
    }, searchProvider === "google" ? 350 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchProvider, countryScope]);

  const isTyping = query.trim().length > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* GPS icon + Search input — single combined row */}
      <div className="flex items-center gap-2 border-t border-b border-blue-100 bg-blue-50 px-3 py-2" role="search">
        <button
          type="button"
          onClick={onRequestGps}
          disabled={gpsLoading || disabled}
          aria-label="Use current location"
          title="Use current location"
          className={cn(
            "flex h-8 w-8 flex-none items-center justify-center rounded-lg transition-colors disabled:opacity-50",
            gpsPermissionDenied ? "text-red-500 hover:bg-red-50" : gpsError ? "text-red-400 hover:bg-slate-100" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          {gpsLoading ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="28 56" strokeLinecap="round" />
            </svg>
          ) : (
            <IconCrosshair className="h-4 w-4" />
          )}
        </button>

          <div className="flex flex-1 items-center gap-2 rounded-full border border-slate-400 bg-slate-200 px-3 py-1.5">
          {loading ? (
            <svg className="h-4 w-4 flex-none animate-spin text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="28 56" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="h-4 w-4 flex-none text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <circle cx="11" cy="11" r="7" strokeWidth="1.75" />
              <path d="M21 21l-4.35-4.35" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent text-sm-plus text-slate-800 placeholder:text-slate-500 outline-none disabled:cursor-not-allowed"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setFetchError(null); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className="text-slate-500 transition-colors hover:text-slate-800"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-800"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" />
            </svg>
          </button>
        )}
      </div>

      {/* Error messages — shown below the combined row */}
      {gpsError && <p className="px-4 pt-1.5 pb-0 text-sm text-red-500">{gpsError}</p>}
      {fetchError && <p className="px-4 pt-1.5 pb-0 text-sm text-red-500">{fetchError}</p>}

      {/* Main scrollable area — results when typing, grouped list otherwise */}
      <div className="min-h-0 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-500">
        {isTyping ? (
          results.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <svg className="h-10 w-10 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm text-slate-500">No results for</p>
                <p className="text-lg font-semibold text-slate-600">&ldquo;{query}&rdquo;</p>
              </div>
            </div>
          ) : (
            <div role="list" aria-label="Search results">
              {results.map((s) => (
                <div key={`${s.label}-${s.sublabel}`} role="listitem">
                  <LocationRow
                    suggestion={s}
                    onSelect={() => onSelect(s)}
                    isActive={current?.label === s.label && current?.sublabel === s.sublabel}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div>
            {/* ── Toggle bar ── */}
            <div className="flex items-center justify-between px-4 pt-2 pb-1">
              <button
                type="button"
                onClick={() => setSavedOnly((v) => !v)}
                data-state={savedOnly ? "on" : "off"}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold transition-colors",
                  savedOnly
                    ? "border-teal-300 bg-teal-50 text-teal-600"
                    : "border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700"
                )}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill={savedOnly ? "currentColor" : "none"}
                  aria-hidden
                >
                  <path d="M5 3h14a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" strokeWidth="1.75" strokeLinejoin="round" />
                </svg>
                Saved
              </button>
              {!savedOnly && recentItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => recentItems.forEach((_, i) => onClearRecent(recentItems.length - 1 - i))}
                  className="text-sm text-slate-500 transition-colors hover:text-slate-700"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* ── Recent (hidden when savedOnly) ── */}
            {!savedOnly && (
              recentItems.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500">No recent searches</p>
              ) : (
                <div role="list">
                  {recentItems.map((s, i) => (
                    <div key={`r-${i}-${s.label}`} role="listitem">
                      <LocationRow
                        suggestion={s}
                        onSelect={() => onSelect(s)}
                        onSave={() => onSaveRecent(i)}
                        isSaved={savedItems.some((sv) => sv.label === s.label)}
                        onClear={() => onClearRecent(i)}
                        isActive={current?.label === s.label && current?.sublabel === s.sublabel}
                      />
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── Saved ── */}
            {!savedOnly && (
              <div className="mt-1 border-t border-slate-100" />
            )}
            {savedItems.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-500">No saved locations</p>
            ) : (
              <div role="list">
                {savedItems.map((s, i) => (
                  <div key={`sv-${i}-${s.label}`} role="listitem">
                    <LocationRow
                      suggestion={s}
                      onSelect={() => onSelect(s)}
                      onClear={() => setConfirmSavedIndex(i)}
                      isSaved
                      isActive={current?.label === s.label && current?.sublabel === s.sublabel}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm dialog — remove saved location */}
      <Dialog
        open={confirmSavedIndex !== null}
        onOpenChange={(open) => { if (!open) setConfirmSavedIndex(null); }}
      >
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Remove saved location?</DialogTitle>
            <DialogClose asChild>
              <button type="button" className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-500 transition-colors hover:bg-slate-400/50 hover:text-slate-700" aria-label="Close">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-2 px-5 pt-4 pb-4">
            <p className="text-sm leading-relaxed text-slate-500">
              {confirmSavedIndex !== null && savedItems[confirmSavedIndex] ? (
                <><span className="font-medium text-slate-700">&ldquo;{savedItems[confirmSavedIndex].label}&rdquo;</span> will be removed from your saved locations.</>
              ) : (
                "This location will be removed from your saved locations."
              )}
            </p>
          </div>
          <div className="flex justify-end gap-2 px-5 pb-5">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </DialogClose>

            <button
              type="button"
              onClick={() => {
                if (confirmSavedIndex !== null) {
                  onClearSaved(confirmSavedIndex);
                  setConfirmSavedIndex(null);
                }
              }}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Radius pills — pinned at bottom */}
      {showRadius && (
        <div className="bg-slate-100 border-t border-slate-300 py-3">
          <p className={cn("mb-2 px-4 truncate", current ? "text-sm font-medium text-slate-700" : "text-sm text-slate-400")}>
            {current
              ? [current.label, ...(current.sublabel?.split(", ").slice(0, -1) ?? [])].join(", ")
              : "Select a location to set radius"}
          </p>
          <div
            ref={radiusScrollRef}
            className="flex gap-2 overflow-x-auto px-4 pb-0.5 cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden scrollbar-none [-ms-overflow-style:none]"
            onMouseDown={(e) => {
              dragRef.current = {
                active: true,
                startX: e.clientX,
                scrollLeft: radiusScrollRef.current?.scrollLeft ?? 0,
                moved: false,
              };
            }}
            onMouseMove={(e) => {
              if (!dragRef.current.active || !radiusScrollRef.current) return;
              const dx = e.clientX - dragRef.current.startX;
              if (Math.abs(dx) > 4) dragRef.current.moved = true;
              radiusScrollRef.current.scrollLeft = dragRef.current.scrollLeft - dx;
            }}
            onMouseUp={() => { dragRef.current.active = false; }}
            onMouseLeave={() => { dragRef.current.active = false; }}
          >
            {RADIUS_OPTIONS.map((r) => {
              const sel = current?.radius === r;
              const dis = !current;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => { if (!dragRef.current.moved && !dis) onRadiusChange(r); }}
                  disabled={dis}
                  data-pressed={sel}
                  className={cn(
                    "flex-none whitespace-nowrap rounded-full border text-sm px-4 py-1 font-normal transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-800 focus:outline-none",
                    sel
                      ? "bg-stone-800 text-stone-100 border-stone-800 shadow-sm hover:bg-stone-700"
                      : "bg-white text-stone-900 border-stone-400 hover:bg-stone-100 hover:border-stone-300",
                    dis && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {r} {radiusUnit}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pill helpers ───────────────────────────────────────────────────────────────

// Shown in pill when no location is set — displays scoped country name as hint
const SCOPE_LABELS: Record<string, string> = {
  UK: "United Kingdom", SG: "Singapore", IN: "India",
  US: "United States", AU: "Australia", AE: "UAE", CA: "Canada",
};

// Strips the trailing country segment from sublabel so pill reads "Birmingham, West Midlands"
// rather than "Birmingham, West Midlands, UK" — user already knows their country context.
function buildPillText(label: string, sublabel?: string): string {
  if (!sublabel) return label;
  const parts = sublabel.split(", ");
  const stripped = parts.length > 1 ? parts.slice(0, -1).join(", ") : parts[0];
  if (!stripped || stripped === label) return label;
  return `${label}, ${stripped}`;
}

// ─── Main component ────────────────────────────────────────────────────────────

export function LocationPicker({
  value,
  defaultValue = null,
  onChange,
  showRadius = true,
  radiusUnit = "km",
  countryScope,
  searchProvider = "none",
  placeholder = "Search location…",
  disabled = false,
  className,  trigger = "pill",
  triggerClassName,}: LocationPickerProps) {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [mounted, setMounted] = React.useState(false);
  const controlled = typeof value !== "undefined";
  const [internal, setInternal] = React.useState<LocationValue | null>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [gpsLoading, setGpsLoading] = React.useState(false);
  const [gpsError, setGpsError] = React.useState<string | null>(null);
  const [gpsPermissionDenied, setGpsPermissionDenied] = React.useState(false);

  // Persistent across panel opens — cleared items stay cleared
  const [recentItems, setRecentItems] = React.useState<SearchSuggestion[]>(() =>
    countryScope?.length
      ? ALL_RECENT.filter((s) => matchesScope(s.sublabel, countryScope))
      : ALL_RECENT
  );
  const [savedItems, setSavedItems] = React.useState<SearchSuggestion[]>(() =>
    countryScope?.length
      ? ALL_SAVED.filter((s) => matchesScope(s.sublabel, countryScope))
      : ALL_SAVED
  );

  React.useEffect(() => { setMounted(true); }, []);

  const current = controlled ? (value ?? null) : internal;

  function emit(v: LocationValue | null) {
    if (!controlled) setInternal(v);
    onChange?.(v);
  }

  function requestGps() {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    setGpsPermissionDenied(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const next: LocationValue = {
          label: "Current Location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radius: current?.radius ?? (showRadius ? RADIUS_OPTIONS[0] : undefined),
          unit: current?.unit ?? radiusUnit,
        };
        emit(next);
        setOpen(false);
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsPermissionDenied(true);
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError("Location unavailable. Try again.");
        } else {
          setGpsError("Couldn't get location. Try again.");
        }
      }
    );
  }

  const scopeDefault =
    !current && countryScope?.length === 1
      ? (SCOPE_LABELS[countryScope[0]] ?? countryScope[0])
      : null;

  const pillLabel = current
    ? buildPillText(current.label, current.sublabel)
    : (scopeDefault ?? "Set location");
  // Full tooltip — shows complete sublabel including country on hover
  const pillTitle = current?.sublabel
    ? `${current.label}, ${current.sublabel}`
    : pillLabel;
  const pillRadius =
    current?.radius != null
      ? `±${current.radius} ${current.unit ?? radiusUnit}`
      : null;

  // Shared panel content (mounts fresh on each open inside the Drawer/Dialog)
  const panel = (
    <PanelContent
      current={current}
      showRadius={showRadius}
      radiusUnit={radiusUnit}
      countryScope={countryScope}
      searchProvider={searchProvider}
      placeholder={placeholder}
      disabled={disabled}
      gpsLoading={gpsLoading}
      gpsError={gpsError}
      gpsPermissionDenied={gpsPermissionDenied}
      recentItems={recentItems}
      savedItems={savedItems}
      onClearRecent={(i) => setRecentItems((prev) => prev.filter((_, idx) => idx !== i))}
      onSaveRecent={(i) => {
        const item = recentItems[i];
        if (!item) return;
        const alreadySaved = savedItems.some((sv) => sv.label === item.label);
        if (alreadySaved) {
          setSavedItems((prev) => prev.filter((sv) => sv.label !== item.label));
        } else {
          setSavedItems((prev) => [item, ...prev]);
        }
      }}
      onClearSaved={(i) => setSavedItems((prev) => prev.filter((_, idx) => idx !== i))}
      onRequestGps={requestGps}
      onSelect={(s) => {
        emit({
          ...s,
          radius: current?.radius ?? (showRadius ? RADIUS_OPTIONS[0] : undefined),
          unit: current?.unit ?? radiusUnit,
        });
        setOpen(false);
      }}
      onRadiusChange={(r) => {
        if (current) emit({ ...current, radius: r, unit: radiusUnit });
      }}
    />
  );

  return (
    <>

      {trigger === "link" ? (
        /* ── Link trigger — bare <a> tag, no default styles ── */
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); !disabled && setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); !disabled && setOpen(true); }
          }}
          aria-haspopup="dialog"
          data-disabled={disabled || undefined}
          title={pillTitle}
          className={cn(disabled && "pointer-events-none opacity-50", triggerClassName)}
        >
          {pillLabel}{pillRadius ? ` \u00b7 ${pillRadius}` : ""}
        </a>
      ) : (
      /* ── Split pill — GPS (left) + Location (right) joined as one unit ── */
      <div className={cn("flex items-center", className)}>
      <div className={cn(
        "flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm shadow-md overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed"
      )}>

        {/* GPS half */}
        <button
          type="button"
          onClick={requestGps}
          disabled={disabled || gpsLoading}
          aria-label="Use current location"
          title={gpsPermissionDenied ? "Location access blocked" : gpsError ?? "Use current location"}
          className={cn(
            "flex h-8 w-9 flex-none items-center justify-center transition-colors",
            gpsPermissionDenied ? "text-red-400 hover:bg-red-500/20" : gpsError ? "text-red-400 hover:bg-white/10" : "text-white/70 hover:bg-white/20 hover:text-white",
            "disabled:cursor-not-allowed"
          )}
        >
          {gpsLoading ? (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <circle cx="12" cy="12" r="9" strokeWidth="2" strokeDasharray="28 56" strokeLinecap="round" />
            </svg>
          ) : (
            <IconCrosshair className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Divider */}
        <span className="h-4 w-px bg-white/20 flex-none" aria-hidden />

        {/* Location picker half */}
        <button
          type="button"
          onClick={() => !disabled && setOpen(true)}
          disabled={disabled}
          aria-haspopup="dialog"
          className="flex h-8 min-w-0 items-center gap-2 px-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed"
        >
          <span className="truncate" title={pillTitle}>{pillLabel}</span>
          {pillRadius && (
            <>
              <span className="font-normal text-white/60">·</span>
              <span className="whitespace-nowrap font-normal text-white/80">{pillRadius}</span>
            </>
          )}
          <IconChevron className={cn("h-3.5 w-3.5 flex-none text-white/40 transition-transform", open && "rotate-180")} />
        </button>

      </div>
      </div>
      )}

      {/* Responsive overlay — avoids SSR hydration mismatch */}
      {mounted && (
        isTablet ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent showCloseButton={false} className="flex h-[min(80vh,600px)] max-h-[min(80vh,600px)] flex-col overflow-hidden max-w-sm p-0 gap-0">
              <div className="flex items-center justify-between bg-slate-200 border-b border-slate-300 pl-4 pr-1 py-1.5 rounded-t-xl">
                <DialogTitle className="text-base font-semibold text-slate-800">Set Location</DialogTitle>
                <DialogClose asChild>
                  <button type="button" aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-500 transition-colors hover:bg-slate-400/70 hover:text-slate-800">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
                      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" />
                    </svg>
                  </button>
                </DialogClose>
              </div>
              {panel}
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="flex h-dvh flex-col rounded-none border-0">
              {/* Visually hidden title for screen readers */}
              <DrawerTitle className="sr-only">Set Location</DrawerTitle>
              {React.cloneElement(panel as React.ReactElement<PanelContentProps>, { onClose: () => setOpen(false) })}
            </DrawerContent>
          </Drawer>
        )
      )}
      {/* Location permission denied dialog */}
      {mounted && (
        <Dialog open={gpsPermissionDenied} onOpenChange={(o) => { if (!o) setGpsPermissionDenied(false); }}>
          <DialogContent className="max-w-xs p-0 overflow-hidden border-none">
            {/* Warning hero band */}
            <div className="flex flex-col items-center gap-2 bg-red-500 px-6 pt-6 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 13 6 13s6-8.582 6-13c0-3.314-2.686-6-6-6z" strokeWidth="2" />
                  <circle cx="12" cy="8" r="2" strokeWidth="2" />
                </svg>
              </div>
              <DialogTitle className="text-center text-[15px] font-bold text-white leading-snug">
                Location access is blocked
              </DialogTitle>
              <p className="text-center text-sm text-red-100 leading-relaxed">
                Allow access in your browser settings to use your current location.
              </p>
            </div>

            {/* Steps */}
            <div className="px-5 py-4">
              <ol className="flex flex-col gap-2.5">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 mt-px">1</span>
                  <span className="text-sm text-slate-600 leading-snug">Click the <strong className="text-slate-800">lock icon</strong> in your browser&apos;s address bar</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 mt-px">2</span>
                  <span className="text-sm text-slate-600 leading-snug">Find <strong className="text-slate-800">Location</strong> and set it to <strong className="text-slate-800">Allow</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 mt-px">3</span>
                  <span className="text-sm text-slate-600 leading-snug">Reload the page and try again</span>
                </li>
              </ol>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-0">
              <DialogClose asChild>
                <button
                  type="button"
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  Got it
                </button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}    </>
  );
}

export default LocationPicker;
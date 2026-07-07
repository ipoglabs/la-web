/**
 * components/la-search-bar/LaSearchBar.tsx
 *
 * Composite smart search bar for classifieds.
 *
 * Features:
 *   B1 — On focus: show recent search history (localStorage)
 *   B2 — While typing: suggest best-match category from keyword map
 *   B3 — Scope chip: pre-set or user-selected category scope
 *   B4 — Scope chip: category / subcategory selector with two independent dropdown targets
 *
 * TODO (API Integration — developer checklist before production):
 *   1. Connect onSearch → router.push(buildSearchUrl(query)) in consuming page
 *   2. Build buildSearchUrl(q: SearchQuery): string → encode keyword, scope.cat, lat/lng/radius as URL params
 *   3. Persist selected location to user cookie/session (see country-cookie pattern)
 *   4. Logged-in users: sync recent searches with BE (POST /api/search/recents) — merge with localStorage
 *   5. Analytics: track search_submit event with { keyword, scope.cat, location, source: "bar" }
 *   6. Optional: replace/augment KEYWORD_CATEGORY_MAP with a server-side autocomplete API
 *
 * Output — onSearch(query: SearchQuery):
 *   { keyword, location, scope }
 *
 * Usage:
 *   <LaSearchBar
 *     initialScope={{ cat: "electronics_tech", label: "Electronics & Tech" }}
 *     onSearch={(q) => router.push(buildSearchUrl(q))}
 *   />
 */
"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useRecentSearches, type RecentSearch } from "@/lib/hooks/use-recent-searches";
import { suggestCategory, type CategorySuggestion } from "@/lib/search-keywords";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS } from "@/lib/category-map";

// ── types ─────────────────────────────────────────────────────────────────────

export interface SearchScope {
  cat:      string;
  /** Category display label, e.g. "Property" */
  label:    string;
  /** Subcategory key, e.g. "to_rent" — only set when inside a sub */
  sub?:     string;
  /** Subcategory display label, e.g. "To Rent" — only set when inside a sub */
  subLabel?: string;
}

export interface SearchQuery {
  keyword:  string;
  location: LocationValue | null;
  scope:    SearchScope | null;
}

export interface LaSearchBarProps {
  /** Pre-fill scope — e.g. pass current category when on a listings page */
  initialScope?: SearchScope | null;
  /** Pre-fill keyword — e.g. restore from URL `q` param on listings page */
  initialKeyword?: string;
  /** Called when user submits (Enter or Search button) */
  onSearch?: (query: SearchQuery) => void;
  /** default — listings/details bar (32px); lg — hero/landing bar (44px, 18px text) */
  size?: "default" | "lg";
  placeholder?: string;
  className?: string;
}

// ── small internal icons ──────────────────────────────────────────────────────

function IconSearch({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
    </svg>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  );
}

function IconSparkle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.24a1 1 0 0 0 0 1.962l1.192.24a1 1 0 0 1 .785.785l.24 1.192a1 1 0 0 0 1.962 0l.24-1.192a1 1 0 0 1 .785-.785l1.192-.24a1 1 0 0 0 0-1.962l-1.192-.24a1 1 0 0 1-.785-.785l-.24-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
    </svg>
  );
}

// ── scope chip ────────────────────────────────────────────────────────────────
// Single pill, two zones:
//   No scope:    [All Categories ▾]       → opens unified cat+sub picker
//   Cat only:    [Vehicles ▾ | ×]         → left half opens picker, right clears
//   Cat + Sub:   [Room Rental ▾ | ×]      → shows subLabel only; left opens picker, right clears
//
// Selecting in the dropdown only sets scope — never auto-submits.

function ScopeChip({
  scope,
  onSelect,
  onClear,
}: {
  scope: SearchScope | null;
  onSelect: (s: SearchScope) => void;
  onClear: () => void;
}) {
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!catOpen) return;
    function h(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [catOpen]);

  // Shared category dropdown panel — main + subcategories inline
  const catDropdown = catOpen && (
    <div className="absolute left-0 top-full mt-1 z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      <div className="px-3 pt-2.5 pb-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Select category</span>
      </div>
      <div className="overflow-y-auto max-h-72 pb-1">
        {/* All Categories */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); onClear(); setCatOpen(false); }}
          className={cn(
            "w-full text-left px-4 py-2 text-sm transition-colors",
            !scope ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-50 font-medium"
          )}
        >All Categories</button>

        {/* Main + subcategories */}
        {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
          <div key={cat}>
            {/* Main category row */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect({ cat, label: label as string });
                setCatOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-1.5 text-sm font-semibold transition-colors",
                scope?.cat === cat && !scope.sub
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-800 hover:bg-slate-50"
              )}
            >{label as string}</button>
            {/* Subcategory rows */}
            {Object.entries(SUBCATEGORY_LABELS[cat] ?? {}).map(([subKey, subLabel]) => (
              <button
                key={subKey}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect({ cat, label: label as string, sub: subKey, subLabel: subLabel as string });
                  setCatOpen(false);
                }}
                className={cn(
                  "w-full text-left pl-7 pr-4 py-1 text-sm transition-colors",
                  scope?.cat === cat && scope.sub === subKey
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >{subLabel as string}</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative shrink-0 flex items-center gap-0.5 select-none">

      {/* ── No scope: "All Categories" button opens category list ── */}
      {!scope && (
        <div ref={catRef} className="relative">
          <button
            type="button"
            aria-label="Select category"
            onMouseDown={(e) => { e.preventDefault(); setCatOpen(v => !v); }}
            className={cn(
              "inline-flex items-center gap-1 h-6 px-2.5 rounded-full border transition-colors text-sm font-medium",
              catOpen
                ? "bg-slate-200 border-slate-300 text-slate-800"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
            )}
          >
            All Categories
            <IconChevron className={cn("size-3 transition-transform", catOpen && "rotate-180")} />
          </button>
          {catDropdown}
        </div>
      )}

      {/* ── Scope set: single combined chip opens cat+sub picker ── */}
      {scope && (
        <div ref={catRef} className="relative flex items-center">
          {/* Chip label + chevron — opens picker */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); setCatOpen(v => !v); }}
            className={cn(
              "inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 rounded-l-full border-y border-l transition-colors",
              catOpen
                ? "bg-slate-200 border-slate-300"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200"
            )}
          >
            <span className="truncate max-w-40 text-sm font-semibold text-slate-700">
              {scope.subLabel ?? scope.label}
            </span>
            <IconChevron className={cn("shrink-0 size-3 text-slate-400 transition-transform", catOpen && "rotate-180")} />
          </button>

          {/* × clear — right half of pill */}
          <button
            type="button"
            aria-label="Clear scope"
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onClear(); setCatOpen(false); }}
            className={cn(
              "inline-flex items-center justify-center h-6 w-5 rounded-r-full border-y border-r transition-colors",
              catOpen
                ? "bg-slate-200 border-slate-300 text-slate-600"
                : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            )}
          >
            <IconX className="size-3" />
          </button>

          {catDropdown}
        </div>
      )}

    </div>
  );
}

// ── recent search row ─────────────────────────────────────────────────────────

function RecentRow({
  item,
  onSelect,
  onRemove,
}: {
  item: RecentSearch;
  onSelect: (item: RecentSearch) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 group cursor-pointer rounded-md"
      onMouseDown={(e) => { e.preventDefault(); onSelect(item); }}>
      <IconClock className="size-4 shrink-0 text-slate-400" />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-700 truncate block">
          {item.keyword || <span className="text-slate-400 italic">No keyword</span>}
        </span>
        <span className="text-sm text-slate-500 truncate block">
          {[item.scope?.label, item.location?.label].filter(Boolean).join(" · ") || "All categories · Anywhere"}
        </span>
      </div>
      {item.scope && (
        <span className="shrink-0 text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {item.scope.label}
        </span>
      )}
      <button
        type="button"
        aria-label="Remove this search"
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(item.id); }}
        className="shrink-0 flex items-center justify-center size-6 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <IconX className="size-3.5" />
      </button>
    </div>
  );
}

// ── suggestion row ────────────────────────────────────────────────────────────

interface SuggestionRowProps {
  icon: ReactNode;
  primary: ReactNode;
  onSelect: () => void;
  highlight?: boolean;
}

function SuggestionRow({ icon, primary, onSelect, highlight = false }: SuggestionRowProps) {
  return (
    <div
      onMouseDown={(e) => { e.preventDefault(); onSelect(); }}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-md transition-colors",
        highlight ? "hover:bg-amber-50" : "hover:bg-slate-50"
      )}
    >
      <span className={cn("shrink-0", highlight ? "text-amber-400" : "text-slate-400")}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-sm text-slate-700 block leading-snug">{primary}</span>
      </div>
      {highlight && (
        <span className="shrink-0 text-sm font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          Suggested
        </span>
      )}
    </div>
  );
}

// ── dropdown panel ────────────────────────────────────────────────────────────

function DropdownPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      "absolute left-0 right-0 top-full mt-1 z-50",
      "bg-white border border-slate-200 rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.13)]",
      "overflow-hidden py-1",
      className
    )}>
      {children}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function LaSearchBar({
  initialScope   = null,
  initialKeyword = "",
  onSearch,
  size = "default",
  placeholder = "What are you looking for?",
  className,
}: LaSearchBarProps) {
  const [keyword,  setKeyword]  = useState(initialKeyword);
  const [scope,    setScope]    = useState<SearchScope | null>(initialScope);
  const [focused,  setFocused]  = useState(false);
  const [suggestion, setSuggestion] = useState<CategorySuggestion | null>(null);

  // Sync initialScope + initialKeyword → state when parent navigates (React "adjusting state from parent" pattern)
  const [prevInitialScope,   setPrevInitialScope]   = useState(initialScope);
  const [prevInitialKeyword, setPrevInitialKeyword] = useState(initialKeyword);
  if (prevInitialScope !== initialScope) {
    setPrevInitialScope(initialScope);
    setScope(initialScope ?? null);
  }
  if (prevInitialKeyword !== initialKeyword) {
    setPrevInitialKeyword(initialKeyword);
    setKeyword(initialKeyword ?? "");
  }

  const inputRef    = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { recents, save, remove, clear } = useRecentSearches();

  // ── category suggestion on type ──────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setSuggestion(scope ? null : suggestCategory(keyword));
    }, 200);
    return () => clearTimeout(t);
  }, [keyword, scope]);

  // ── outside click — close dropdown ───────────────────────────────────────
  useEffect(() => {
    if (!focused) return;
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [focused]);

  // ── submit ────────────────────────────────────────────────────────────────
  // scopeOverride lets suggestion handlers pass the new scope directly,
  // bypassing the async state update so the submitted query is always correct.
  const handleSubmit = useCallback((scopeOverride?: SearchScope | null) => {
    const resolvedScope = scopeOverride !== undefined ? scopeOverride : scope;
    // location removed from bar — lives in ContextBar on the listings page
    const query: SearchQuery = { keyword: keyword.trim(), location: null, scope: resolvedScope };
    save({ keyword: keyword.trim(), location: null, scope: resolvedScope });
    setFocused(false);
    onSearch?.(query);
  }, [keyword, scope, save, onSearch]);

  // ── recent search selected ────────────────────────────────────────────────
  const selectRecent = useCallback((item: RecentSearch) => {
    setKeyword(item.keyword);
    setScope(item.scope ?? null);
    setFocused(false);
    // location not restored — user's current location context is in the ContextBar
    onSearch?.({ keyword: item.keyword, location: null, scope: item.scope ?? null });
  }, [onSearch]);

  // ── what to show in dropdown ──────────────────────────────────────────────
  const showRecents    = focused && keyword.trim() === "" && recents.length > 0;
  // Show suggestions whenever user has typed ≥2 chars
  const showSuggestion = focused && keyword.trim().length >= 2;
  // Best category to offer — detected from keyword, or fall back to page scope
  const scopeForSuggestion = suggestion ?? scope;
  const showDropdown   = showRecents || showSuggestion;
  const isLg           = size === "lg";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* ── Bar ── */}
      <div className={cn(
        "rounded-2xl sm:rounded-full border transition-colors",
        focused
          ? "bg-amber-50 border-blue-400 ring-1 ring-blue-300"
          : "bg-white border-slate-200",
      )}>

        {/* Top row — keyword input (always) */}
        <div className="flex items-center">

          {/* Search icon */}
          <span className="shrink-0 pl-2 pr-1">
            <IconSearch className={cn(isLg ? "size-5" : "size-4", "text-slate-400")} />
          </span>

          {/* Keyword input */}
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder={placeholder}
            aria-label="Search keyword"
            className={cn(
              "flex-1 min-w-0 px-1 bg-transparent font-medium text-slate-900 placeholder:text-slate-500 placeholder:font-normal focus:outline-none",
              isLg ? "h-11 text-[18px] placeholder:text-sm" : "h-8 text-base placeholder:text-sm"
            )}
          />

          {/* Clear keyword only — just left of scope chip, never clears scope */}
          {keyword && (
            <button
              type="button"
              aria-label="Clear keyword"
              onMouseDown={(e) => { e.preventDefault(); setKeyword(""); inputRef.current?.focus(); }}
              className={cn(
                "shrink-0 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors",
                isLg ? "size-8" : "size-6"
              )}
            >
              <IconX className={isLg ? "size-4" : "size-3.5"} />
            </button>
          )}

          {/* Scope chip — all breakpoints: current category or "All Categories" */}
          <div className={cn("flex items-center", isLg ? "px-2 h-11" : "px-1.5 h-8")}>
            <ScopeChip
              scope={scope}
              onSelect={(s) => { setScope(s); }}
              onClear={() => { setScope(null); }}
            />
          </div>

          {/* Arrow button — all breakpoints */}
          <span className="flex shrink-0 items-center pt-0.5 pr-0.5 pb-0.5">
            <button
              type="button"
              aria-label="Search"
              onClick={() => handleSubmit()}
              className={cn(
                "flex items-center justify-center rounded-full bg-(--la-primary-blue) hover:bg-(--la-primary-blue-hover) text-white transition-colors",
                isLg ? "h-9 w-9" : "h-6 w-6"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={isLg ? "size-4" : "size-3.5"}>
                <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
              </svg>
            </button>
          </span>
        </div>

      </div>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <DropdownPanel>

          {/* Suggestions — shown whenever user has typed ≥2 chars */}
          {showSuggestion && (
            <div className="px-2 py-1">
              {/* Option 1 — in detected/scope category (only if we have one) */}
              {scopeForSuggestion && (
                <SuggestionRow
                  icon={<IconSparkle className="size-5" />}
                  primary={
                    <><span className="font-semibold text-slate-900">&ldquo;{keyword.trim()}&rdquo;</span><span className="text-slate-400"> in </span><span className="font-medium text-slate-700">&ldquo;{scopeForSuggestion.label}&rdquo;</span></>
                  }
                  highlight
                  onSelect={() => {
                    setScope(scopeForSuggestion);
                    setSuggestion(null);
                    handleSubmit(scopeForSuggestion);
                  }}
                />
              )}
              {/* Option 2 — search all categories */}
              <SuggestionRow
                icon={<IconSearch className="size-4" />}
                primary={
                  <><span className="font-semibold text-slate-900">&ldquo;{keyword.trim()}&rdquo;</span><span className="text-slate-400"> in </span><span className="font-medium text-slate-700">All Categories</span></>
                }
                onSelect={() => {
                  setScope(null);
                  handleSubmit(null);
                }}
              />
            </div>
          )}

          {/* Recent searches */}
          {showRecents && (
            <div className="px-2">
              <div className="flex items-center justify-between px-2 pt-2 pb-1">
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent searches</span>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); clear(); }}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Clear all
                </button>
              </div>
              {recents.map((item) => (
                <RecentRow
                  key={item.id}
                  item={item}
                  onSelect={selectRecent}
                  onRemove={remove}
                />
              ))}
            </div>
          )}

        </DropdownPanel>
      )}
    </div>
  );
}

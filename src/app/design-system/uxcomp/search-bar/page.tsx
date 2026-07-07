"use client";

import { useState } from "react";
import LaSection from "@/components/la/la-section";
import { LaSearchBar, type SearchQuery, type SearchScope } from "@/components/la-search-bar";

// ── shared helpers ────────────────────────────────────────────────────────────

function CaseLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{children}</p>
  );
}

function DarkBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-800 rounded-xl px-5 py-4">
      {children}
    </div>
  );
}

function QueryOutput({ query }: { query: SearchQuery | null }) {
  if (!query) return null;
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">Submitted query</p>
      <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
        {JSON.stringify(query, null, 2)}
      </pre>
    </div>
  );
}

// ── use cases ─────────────────────────────────────────────────────────────────

// UC1 — Default, no pre-set scope
function UC1() {
  const [q, setQ] = useState<SearchQuery | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <CaseLabel>UC1 — Default homepage bar (no scope)</CaseLabel>
      <p className="text-sm text-slate-500">Used on the homepage or global search. No category pre-selected — user discovers via typing or suggestion.</p>
      <DarkBand>
        <LaSearchBar placeholder="What are you looking for?" onSearch={setQ} />
      </DarkBand>
      <QueryOutput query={q} />
    </div>
  );
}

// UC2 — Pre-set scope from category page
function UC2() {
  const [q, setQ] = useState<SearchQuery | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <CaseLabel>UC2 — Category page (pre-set scope)</CaseLabel>
      <p className="text-sm text-slate-500">User is already browsing Electronics &amp; Tech. The scope chip is pre-loaded — search is scoped by default, but removable.</p>
      <DarkBand>
        <LaSearchBar
          initialScope={{ cat: "electronics_tech", label: "Electronics & Tech" }}
          placeholder="Search in Electronics & Tech…"
          onSearch={setQ}
        />
      </DarkBand>
      <QueryOutput query={q} />
    </div>
  );
}

// UC3 — Pre-set scope + location (listings page context)
function UC3() {
  const [q, setQ] = useState<SearchQuery | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <CaseLabel>UC3 — Listings page (scope + location pre-filled)</CaseLabel>
      <p className="text-sm text-slate-500">User is on a Property listings page in London. Both scope and location are pre-loaded from the current page context.</p>
      <DarkBand>
        <LaSearchBar
          initialScope={{ cat: "property", label: "Property" }}
          initialLocation={{ label: "London", sublabel: "Greater London, UK", lat: 51.5074, lng: -0.1278, radius: 10, unit: "km" }}
          placeholder="Search properties in London…"
          onSearch={setQ}
        />
      </DarkBand>
      <QueryOutput query={q} />
    </div>
  );
}

// UC4 — Keyword-only (no location, no scope) — classifieds lightweight embed
function UC4() {
  const [q, setQ] = useState<SearchQuery | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <CaseLabel>UC4 — Vehicles search</CaseLabel>
      <p className="text-sm text-slate-500">Scoped to Vehicles. Try typing "BMW 3 series" or "Tesla Model 3" — the category suggestion fires even though a scope is already set.</p>
      <DarkBand>
        <LaSearchBar
          initialScope={{ cat: "vehicles", label: "Vehicles" }}
          placeholder="Make, model, or keyword…"
          onSearch={setQ}
        />
      </DarkBand>
      <QueryOutput query={q} />
    </div>
  );
}

// UC5 — Jobs search
function UC5() {
  const [q, setQ] = useState<SearchQuery | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <CaseLabel>UC5 — Jobs board search</CaseLabel>
      <p className="text-sm text-slate-500">Scoped to Jobs with a Manchester location. Try typing "React developer" or "remote nurse" to see keyword-driven suggestions override the scope.</p>
      <DarkBand>
        <LaSearchBar
          initialScope={{ cat: "jobs", label: "Jobs" }}
          initialLocation={{ label: "Manchester", sublabel: "Greater Manchester, UK", lat: 53.4808, lng: -2.2426, radius: 20, unit: "km" }}
          placeholder="Job title, skill, or company…"
          onSearch={setQ}
        />
      </DarkBand>
      <QueryOutput query={q} />
    </div>
  );
}

// UC6 — No scope, recent history focus (B1)
function UC6() {
  const [q, setQ] = useState<SearchQuery | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <CaseLabel>UC6 — Recent history on focus (B1)</CaseLabel>
      <p className="text-sm text-slate-500">Click into this bar without typing. If you have saved searches from any other use case above, they appear here. The recent searches are stored in <code className="bg-slate-100 rounded px-1 text-slate-700">localStorage</code> and shared across all instances.</p>
      <DarkBand>
        <LaSearchBar placeholder="Click to see recent searches…" onSearch={setQ} />
      </DarkBand>
      <QueryOutput query={q} />
    </div>
  );
}

// UC7 — Unscoped with dynamic category detection (B2)
function UC7() {
  const [q, setQ] = useState<SearchQuery | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <CaseLabel>UC7 — Smart category suggestion while typing (B2)</CaseLabel>
      <p className="text-sm text-slate-500">
        Type any of these and watch the amber suggestion appear:
        <span className="block mt-1.5 font-mono text-sm text-slate-700 bg-slate-100 rounded px-3 py-1.5 leading-relaxed">
          ipad pro · sofa · guitar · pram · job vacancy · plumber · labrador puppy · football boots
        </span>
      </p>
      <DarkBand>
        <LaSearchBar placeholder="Start typing to see category suggestions…" onSearch={setQ} />
      </DarkBand>
      <QueryOutput query={q} />
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function SearchBarDemoPage() {
  return (
    <>
      <LaSection title="La Search Bar">
        <p className="text-sm text-slate-500 max-w-2xl">
          Composite smart search bar — keyword + category scope chip + location picker. On focus shows recent
          history (localStorage); while typing suggests the best-matching category from a curated keyword map.
          Fully responsive — single row on desktop, stacked row on mobile.
        </p>

        <UC1 />
        <UC2 />
        <UC3 />
        <UC4 />
        <UC5 />
        <UC6 />
        <UC7 />

        {/* ── Developer Guide ──────────────────────────────────────────────── */}
        <div className="mt-4 flex flex-col gap-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-2">Developer Guide</h3>

          {/* Import */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-700">Import</p>
            <pre className="bg-slate-900 text-green-300 rounded-lg px-5 py-4 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">{`import { LaSearchBar } from "@/components/la-search-bar";
import type { SearchQuery, SearchScope } from "@/components/la-search-bar";`}</pre>
          </div>

          {/* Quick usage */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-700">Quick usage</p>
            <pre className="bg-slate-900 text-green-300 rounded-lg px-5 py-4 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">{`// Basic — homepage
<LaSearchBar onSearch={(q) => router.push(buildSearchUrl(q))} />

// Category page — pre-set scope
<LaSearchBar
  initialScope={{ cat: "vehicles", label: "Vehicles" }}
  placeholder="Make, model, or keyword…"
  onSearch={(q) => router.push(buildSearchUrl(q))}
/>

// Listings page — scope + location from page context
<LaSearchBar
  initialScope={currentCategory}
  initialLocation={userLocation}
  onSearch={(q) => router.push(buildSearchUrl(q))}
/>`}</pre>
          </div>

          {/* Props table */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-700">Props</p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold text-slate-700">Prop</th>
                    <th className="px-4 py-2.5 font-semibold text-slate-700">Type</th>
                    <th className="px-4 py-2.5 font-semibold text-slate-700">Default</th>
                    <th className="px-4 py-2.5 font-semibold text-slate-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["initialScope", "SearchScope | null", "null", "Pre-set category scope. Pass current page category on a listings/category page."],
                    ["initialLocation", "LocationValue | null", "null", "Pre-fill the location chip. Both props sync at render-time when parent re-navigates."],
                    ["onSearch", "(query: SearchQuery) => void", "—", "Fires on Enter or Search button. Receives { keyword, location, scope }."],
                    ["placeholder", "string", '"What are you looking for?"', "Input placeholder text."],
                    ["className", "string", "—", "Applied to the outermost wrapper div."],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="even:bg-slate-50">
                      <td className="px-4 py-2.5 font-mono text-blue-700 whitespace-nowrap">{prop}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-600 whitespace-nowrap">{type}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-500 whitespace-nowrap">{def}</td>
                      <td className="px-4 py-2.5 text-slate-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SearchQuery shape */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-700">SearchQuery shape</p>
            <pre className="bg-slate-900 text-green-300 rounded-lg px-5 py-4 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">{`interface SearchQuery {
  keyword:  string;            // trimmed input text
  location: LocationValue | null;
  scope:    SearchScope | null; // { cat: string; label: string }
}

// SearchScope — pass cat to your API as a filter param
interface SearchScope {
  cat:   string;  // e.g. "electronics_tech"
  label: string;  // e.g. "Electronics & Tech"
}`}</pre>
          </div>

          {/* Behaviour notes */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-700">Behaviour notes</p>
            <ul className="flex flex-col gap-1.5 text-sm text-slate-600 list-disc pl-5">
              <li>Recent searches are stored in <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">localStorage</code> under key <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">la:recent-searches</code>. Max 8 entries. Same keyword + scope deduplicates.</li>
              <li>Category suggestion fires after 200 ms debounce on ≥ 2 characters. Suppressed when a scope is already active.</li>
              <li>Accepting a suggestion passes <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">scopeOverride</code> directly into the submit handler — the query is always consistent regardless of React state timing.</li>
              <li><code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">initialScope</code> and <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">initialLocation</code> sync at render-time (not via <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">useEffect</code>) — safe for Next.js navigation without stale state.</li>
            </ul>
          </div>

          {/* API integration TODOs */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-700">API integration TODOs</p>
            <ol className="flex flex-col gap-1.5 text-sm text-slate-600 list-decimal pl-5">
              <li>Connect <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">onSearch</code> → <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">router.push(buildSearchUrl(query))</code> in consuming page.</li>
              <li>Build <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">buildSearchUrl(q)</code> — encode <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">keyword</code>, <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">scope.cat</code>, <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">lat/lng/radius</code> as URL params.</li>
              <li>Logged-in users: sync recent searches with BE (<code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">POST /api/search/recents</code>) — merge with localStorage on load.</li>
              <li>Analytics: track <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">search_submit</code> event with <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">{"{ keyword, scope.cat, location, source: \"bar\" }"}</code>.</li>
              <li>Optional: replace / augment <code className="bg-slate-100 rounded px-1 text-slate-700 font-mono">KEYWORD_CATEGORY_MAP</code> with a server-side autocomplete API for richer suggestions.</li>
            </ol>
          </div>
        </div>
      </LaSection>
    </>
  );
}

"use client";

import React from "react";
import { LocationPicker, LocationValue } from "@/components/location-picker";
import { OverlayCountrySelect } from "@/components/overlay-country-select";
import { COUNTRIES } from "@/lib/data/countries";

// COUNTRIES uses "GB" for UK, but LocationPicker's COUNTRY_KEYWORDS uses "UK".
// Map any mismatches here so scope filtering works correctly.
const SCOPE_CODE_MAP: Record<string, string> = { GB: "UK" };
function toLocationScope(code: string): string {
  return SCOPE_CODE_MAP[code] ?? code;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function LocationCase({
  label,
  hint,
  ...props
}: React.ComponentProps<typeof LocationPicker> & { label: string; hint?: string }) {
  const [val, setVal] = React.useState<LocationValue | null>(
    (props.value ?? props.defaultValue) as LocationValue | null ?? null
  );
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {hint && <p className="text-xs text-slate-400 -mt-1">{hint}</p>}
      <div className="bg-slate-800 rounded-2xl px-6 py-5">
        <LocationPicker {...props} onChange={(v) => { setVal(v); props.onChange?.(v); }} />
      </div>
      {val && (
        <p className="min-w-0 break-all text-xs text-slate-400">
          Output: <span className="font-mono text-slate-600">{JSON.stringify(val)}</span>
        </p>
      )}
    </div>
  );
}

// ─── Country-gated use case ───────────────────────────────────────────────────

function CountryGatedCase() {
  const [countryCode, setCountryCode] = React.useState<string | null>(null);
  const [showPicker, setShowPicker] = React.useState(false);
  const [val, setVal] = React.useState<LocationValue | null>(null);

  const scopeCode = countryCode ? toLocationScope(countryCode) : null;
  const meta = COUNTRIES.find((c) => c.code === countryCode);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-slate-700">Use Case 1 — Country-gated (no scope set)</p>
      <p className="text-xs text-slate-400 -mt-1">
        No <code className="bg-slate-100 px-0.5 rounded">countryScope</code> configured —
        prompt user to pick a country first. LocationPicker only activates after selection.
      </p>

      <div className="bg-slate-800 rounded-2xl px-6 py-5">
        {scopeCode ? (
          <div className="flex items-center gap-3">
            <LocationPicker countryScope={[scopeCode]} onChange={setVal} />
            <button
              type="button"
              onClick={() => { setCountryCode(null); setVal(null); }}
              className="whitespace-nowrap text-xs text-white/40 transition-colors hover:text-white/70"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="flex h-8 items-center gap-2 rounded-full border border-dashed border-white/30 bg-white/5 px-3.5 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white/70"
          >
            <svg className="h-3.5 w-3.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" strokeWidth="1.5" />
              <path d="M2 12h20M12 2c2.5 2.5 3.5 5.5 3.5 10S14.5 19.5 12 22" strokeWidth="1" strokeLinecap="round" />
            </svg>
            Select your country first...
            <svg className="h-3.5 w-3.5 flex-none text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {showPicker && (
        <OverlayCountrySelect
          onSelect={(code) => { setCountryCode(code); setShowPicker(false); }}
          onClose={() => setShowPicker(false)}
          navigateOnSelect={false}
        />
      )}

      {meta && (
        <p className="text-xs text-slate-400">
          Country: <span className="font-mono text-slate-600">{meta.flag} {meta.name} ({scopeCode})</span>
        </p>
      )}
      {val && (
        <p className="min-w-0 break-all text-xs text-slate-400">
          Output: <span className="font-mono text-slate-600">{JSON.stringify(val)}</span>
        </p>
      )}
    </div>
  );
}

// ─── Link trigger use case ───────────────────────────────────────────────────

function LinkTriggerCase() {
  const [val, setVal] = React.useState<LocationValue | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-slate-700">Use Case 7 — Link Trigger</p>
      <p className="text-xs text-slate-400 -mt-1">
        <code className="bg-slate-100 px-0.5 rounded">trigger=&quot;link&quot;</code> — renders as a plain{" "}
        <code className="bg-slate-100 px-0.5 rounded">&lt;a&gt;</code> tag with no default styles.
        Use <code className="bg-slate-100 px-0.5 rounded">triggerClassName</code> to style it for any context.
      </p>

      <div className="flex flex-col gap-3">
        {/* Form row — label + link on same line */}
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Light bg — form row</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Location</span>
            <LocationPicker
              countryScope={["UK"]}
              trigger="link"
              triggerClassName="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors"
              onChange={setVal}
            />
          </div>
        </div>

        {/* Plain underline link */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Plain link style</p>
          <LocationPicker
            countryScope={["SG"]}
            showRadius={false}
            trigger="link"
            triggerClassName="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors"
            onChange={setVal}
          />
        </div>

        {/* Dark bg */}
        <div className="rounded-2xl bg-slate-800 px-5 py-4 flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Dark bg — muted white</p>
          <LocationPicker
            countryScope={["IN"]}
            trigger="link"
            triggerClassName="text-sm text-white/60 hover:text-white transition-colors"
            onChange={setVal}
          />
        </div>
      </div>

      {val && (
        <p className="min-w-0 break-all text-xs text-slate-400">
          Output: <span className="font-mono text-slate-600">{JSON.stringify(val)}</span>
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-bold mb-1">Location Picker</h1>
      <p className="text-sm text-slate-500 mb-8">
        GPS + search + radius picker. Pill opens a responsive drawer (mobile) or dialog (tablet+).
        Output is a structured <code className="bg-slate-100 px-1 rounded">LocationValue</code> object.
      </p>

      {/* Design Pattern note */}
      <div className="mb-10 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 flex flex-col gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">Design Pattern — Country first</p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Since <code className="bg-white/70 px-1 rounded text-xs">LocationPicker</code> is country-scoped, always
          resolve the country <em>before</em> mounting the picker. Without a{" "}
          <code className="bg-white/70 px-1 rounded text-xs">countryScope</code>, suggestions, recent, saved, and
          radius labels are all unscoped. Use{" "}
          <code className="bg-white/70 px-1 rounded text-xs">OverlayCountrySelect</code> as the gate (see Use Case 1).
        </p>
      </div>

      {/* Use Cases */}
      <div className="flex flex-col gap-10">

        <CountryGatedCase />

        <LocationCase
          label="Use Case 2 — UK scope, empty start"
          hint="Pill shows country name until user picks a location. GPS + radius in km."
          countryScope={["UK"]}
        />

        <LocationCase
          label="Use Case 3 — Singapore scope, prefilled"
          hint="defaultValue pre-seeds a location on mount. Demonstrates an edit flow — user can adjust or clear."
          countryScope={["SG"]}
          defaultValue={{ label: "Orchard Road", sublabel: "Central, Singapore", lat: 1.3047, lng: 103.8318, radius: 1, unit: "km" }}
        />

        <LocationCase
          label="Use Case 4 — UK scope, radius in miles"
          hint='radiusUnit="mi" — radius pills and output unit both switch to miles.'
          countryScope={["UK"]}
          radiusUnit="mi"
        />

        <LocationCase
          label="Use Case 5 — Google Places mock (SG)"
          hint='searchProvider="google" — simulates API with 300ms latency. Try "sin", "orchard".'
          countryScope={["SG"]}
          searchProvider="google"
        />

        <LocationCase
          label="Use Case 6 — Disabled"
          hint="disabled=true — crosshair and pill are non-interactive."
          countryScope={["UK"]}
          defaultValue={{ label: "London", sublabel: "Greater London, UK", radius: 2, unit: "km" }}
          disabled
        />

        <LinkTriggerCase />

      </div>

      {/* Developer Guide */}
      <div className="mb-12 mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col gap-6">
        <h2 className="text-base font-semibold text-slate-800">Developer Guide</h2>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Import</p>
          <pre className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100 overflow-x-auto">{`import { LocationPicker } from "@/components/location-picker";
import type { LocationValue } from "@/components/location-picker";
import { OverlayCountrySelect } from "@/components/overlay-country-select";`}</pre>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recommended — Country-gated pattern</p>
          <pre className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100 overflow-x-auto">{`const [countryCode, setCountryCode] = useState<string | null>(null);
const [showPicker, setShowPicker] = useState(false);
const [location, setLocation] = useState<LocationValue | null>(null);

// NOTE: COUNTRIES uses "GB" for UK, but LocationPicker expects "UK".
const scope = countryCode === "GB" ? "UK" : countryCode;

{scope ? (
  <LocationPicker countryScope={[scope]} onChange={setLocation} />
) : (
  <button onClick={() => setShowPicker(true)}>Select country first...</button>
)}

{showPicker && (
  <OverlayCountrySelect
    onSelect={(code) => { setCountryCode(code); setShowPicker(false); }}
    onClose={() => setShowPicker(false)}
  />
)}`}</pre>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quick Usage</p>
          <pre className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100 overflow-x-auto">{`// Uncontrolled — UK scope, GPS + search + radius (km)
<LocationPicker countryScope={["UK"]} onChange={setLocation} />

// Miles unit
<LocationPicker countryScope={["UK"]} radiusUnit="mi" onChange={setLocation} />

// Controlled — Singapore, pre-filled
<LocationPicker countryScope={["SG"]} value={location} onChange={setLocation} />

// No radius
<LocationPicker countryScope={["IN"]} showRadius={false} onChange={setLocation} />

// Link trigger — plain <a> tag, style freely via triggerClassName
<LocationPicker
  countryScope={["UK"]}
  trigger="link"
  triggerClassName="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors"
  onChange={setLocation}
/>`}</pre>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Output Shape</p>
          <pre className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-slate-100 overflow-x-auto">{`type LocationValue = {
  label: string;       // "London"
  sublabel?: string;   // "Greater London, UK"
  lat?: number;        // 51.5074
  lng?: number;        // -0.1278
  radius?: number;     // 2
  unit?: "km" | "mi"; // "km"
}`}</pre>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Props</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2 pr-4 font-semibold">Prop</th>
                  <th className="pb-2 pr-4 font-semibold">Type</th>
                  <th className="pb-2 pr-4 font-semibold">Default</th>
                  <th className="pb-2 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {[
                  ["value", "LocationValue | null", "—", "Controlled value"],
                  ["defaultValue", "LocationValue | null", "null", "Uncontrolled initial value"],
                  ["onChange", "(v) => void", "—", "Fires on every pick"],
                  ["countryScope", "string[]", "—", 'Filter to country codes e.g. ["UK","SG","IN"]'],
                  ["showRadius", "boolean", "true", "Show radius pills at bottom of panel"],
                  ["radiusUnit", '"km" | "mi"', '"km"', "Unit on radius pills and in output"],
                  ["searchProvider", '"none" | "google"', '"none"', "Static list or Google Places (proxy-ready)"],
                  ["placeholder", "string", '"Search location..."', "Search input placeholder"],
                  ["disabled", "boolean", "false", "Disables GPS button and pill"],
                  ["className", "string", "—", "Outer wrapper styles"],
                  ["trigger", '"pill" | "link"', '"pill"', "Trigger variant — pill (glass split-pill) or link (plain <a>)"],
                  ["triggerClassName", "string", "—", "Classes on the <a> when trigger=\"link\". No default styles"],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-mono text-slate-800">{prop}</td>
                    <td className="py-2 pr-4 font-mono text-violet-600">{type}</td>
                    <td className="py-2 pr-4 font-mono text-slate-400">{def}</td>
                    <td className="py-2 text-slate-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">countryScope Codes</p>
          <div className="flex flex-wrap gap-2">
            {[
              ["UK", "England, Scotland, Wales"],
              ["SG", "Singapore"],
              ["IN", "India"],
              ["US", "United States"],
              ["AU", "Australia"],
              ["AE", "UAE"],
              ["CA", "Canada"],
            ].map(([code, label]) => (
              <div key={code} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
                <span className="font-mono text-xs font-semibold text-slate-800">{code}</span>
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold text-amber-700">GB vs UK code mismatch</p>
          <p className="text-xs text-slate-600">
            <code className="bg-white/70 px-1 rounded">COUNTRIES</code> data uses{" "}
            <code className="bg-white/70 px-1 rounded">GB</code> for the United Kingdom, but{" "}
            <code className="bg-white/70 px-1 rounded">COUNTRY_KEYWORDS</code> inside LocationPicker expects{" "}
            <code className="bg-white/70 px-1 rounded">UK</code>.
            When feeding from OverlayCountrySelect into countryScope, apply the mapping:{" "}
            <code className="bg-white/70 px-1 rounded">code === &quot;GB&quot; ? &quot;UK&quot; : code</code>.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Google Places (searchProvider=&quot;google&quot;)</p>
          <p className="text-xs text-slate-600">
            Uses <code className="bg-slate-200 px-1 rounded">mockGoogleSearch()</code> in POC mode (300ms latency).
            Mock prefixes: <code className="bg-slate-200 px-1 rounded">lon man mum del ban sin che hyd</code>.
            To activate real API: add <code className="bg-slate-200 px-1 rounded">GOOGLE_PLACES_API_KEY</code> to{" "}
            <code className="bg-slate-200 px-1 rounded">.env.local</code>, swap{" "}
            <code className="bg-slate-200 px-1 rounded">mockGoogleSearch</code> with{" "}
            <code className="bg-slate-200 px-1 rounded">realGoogleSearch</code> in{" "}
            <code className="bg-slate-200 px-1 rounded">LocationSearch.tsx</code>. Proxy route at{" "}
            <code className="bg-slate-200 px-1 rounded">app/api/places/route.ts</code>.
          </p>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, Globe, AtSign, DollarSign, Lock } from "lucide-react";
import LaSection from "@/components/la/la-section";
import { LaInput, LaTokenRow, LaSeparator, LaText } from "@/components/la";

// ─── tiny code-snippet display helper ────────────────────────────────────────
function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-700 leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

// ─── section sub-label ────────────────────────────────────────────────────────
function SubLabel({ children }: { children: string }) {
  return (
    <LaText
      type="small"
      as="p"
      className="text-xs font-semibold uppercase tracking-widest text-slate-400"
    >
      {children}
    </LaText>
  );
}

export default function InputPage() {
  const [controlled, setControlled] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      {/* ── 1. Basic states ──────────────────────────────────────────────── */}
      <LaSection title="Basic States">
        <LaTokenRow label="default">
          <LaInput placeholder="Enter your name" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="disabled">
          <LaInput disabled placeholder="Not editable" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="read-only">
          <LaInput readOnly value="Read-only value" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="error">
          <LaInput status="error" defaultValue="bad@input" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="success">
          <LaInput status="success" defaultValue="good@input.com" className="max-w-xs" />
        </LaTokenRow>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 2. Prefix / Suffix slots ─────────────────────────────────────── */}
      <LaSection title="Prefix & Suffix">
        <SubLabel>Icon prefix</SubLabel>
        <LaTokenRow label="search">
          <LaInput prefix={<Search className="size-4" />} placeholder="Search…" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="globe">
          <LaInput prefix={<Globe className="size-4" />} placeholder="https://yoursite.com" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="at-sign">
          <LaInput prefix={<AtSign className="size-4" />} placeholder="username" className="max-w-xs" />
        </LaTokenRow>

        <SubLabel>Text prefix / suffix</SubLabel>
        <LaTokenRow label="$ prefix">
          <LaInput prefix={<DollarSign className="size-4" />} placeholder="0.00" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="suffix text">
          <LaInput suffix={<span className="text-xs text-slate-500">kg</span>} placeholder="Weight" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="both sides">
          <LaInput
            prefix={<DollarSign className="size-4" />}
            suffix={<span className="text-xs text-slate-500">USD</span>}
            placeholder="Amount"
            className="max-w-xs"
          />
        </LaTokenRow>

        <Code>{`<LaInput prefix={<Search className="size-4" />} placeholder="Search…" />
<LaInput suffix={<span className="text-xs">kg</span>} placeholder="Weight" />
// Accessible label for screen readers:
<LaInput prefix={<Globe className="size-4" />} prefixLabel="Website URL" />`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 3. Clearable ─────────────────────────────────────────────────── */}
      <LaSection title="Clearable">
        <SubLabel>Uncontrolled — just add clearable</SubLabel>
        <LaTokenRow label="uncontrolled">
          <LaInput clearable placeholder="Type something…" className="max-w-xs" />
        </LaTokenRow>

        <SubLabel>Controlled</SubLabel>
        <LaTokenRow label="controlled">
          <div className="flex flex-col gap-1 max-w-xs w-full">
            <LaInput
              clearable
              value={controlled}
              onChange={(e) => setControlled(e.target.value)}
              placeholder="Controlled value…"
            />
            <LaText type="muted" as="p" className="text-xs">
              value: &quot;{controlled}&quot;
            </LaText>
          </div>
        </LaTokenRow>

        <SubLabel>With prefix + clearable</SubLabel>
        <LaTokenRow label="search + clear">
          <LaInput
            clearable
            prefix={<Search className="size-4" />}
            placeholder="Search listings…"
            className="max-w-xs"
          />
        </LaTokenRow>

        <Code>{`// Uncontrolled
<LaInput clearable placeholder="Type something…" />

// Controlled
const [q, setQ] = useState("");
<LaInput clearable value={q} onChange={(e) => setQ(e.target.value)} />

// With onClear side-effect
<LaInput clearable onClear={() => router.replace("?")} />`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 4. Password toggle ───────────────────────────────────────────── */}
      <LaSection title="Password Toggle">
        <SubLabel>type=&quot;password&quot; + showPasswordToggle</SubLabel>
        <LaTokenRow label="password">
          <LaInput
            type="password"
            showPasswordToggle
            placeholder="Enter password"
            className="max-w-xs"
          />
        </LaTokenRow>
        <LaTokenRow label="+ clearable">
          <LaInput
            type="password"
            showPasswordToggle
            clearable
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="max-w-xs"
          />
        </LaTokenRow>
        <LaTokenRow label="lock icon">
          <LaInput
            type="password"
            showPasswordToggle
            prefix={<Lock className="size-4" />}
            placeholder="Enter password"
            className="max-w-xs"
          />
        </LaTokenRow>

        <SubLabel>All three — prefix + suffix + toggle + clear</SubLabel>
        <LaTokenRow label="full password">
          <LaInput
            type="password"
            showPasswordToggle
            clearable
            prefix={<Lock className="size-4" />}
            suffix={<span className="text-xs text-slate-500">req</span>}
            placeholder="Enter password"
            className="max-w-xs"
          />
        </LaTokenRow>

        <Code>{`<LaInput type="password" showPasswordToggle placeholder="Password" />

// Toggle + clear combined
<LaInput type="password" showPasswordToggle clearable placeholder="Password" />

// Everything together
<LaInput type="password" showPasswordToggle clearable prefix={<Lock className="size-4" />} />`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 5. Status × clearable combinations ──────────────────────────── */}
      <LaSection title="Status + Clearable">
        <LaTokenRow label="error + clear">
          <LaInput
            clearable
            status="error"
            defaultValue="invalid-email"
            className="max-w-xs"
          />
        </LaTokenRow>
        <LaTokenRow label="success + clear">
          <LaInput
            clearable
            status="success"
            defaultValue="good@example.com"
            className="max-w-xs"
          />
        </LaTokenRow>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 6. Fully combined ────────────────────────────────────────────── */}
      <LaSection title="Fully Combined">
        <LaTokenRow label="all props">
          <LaInput
            prefix={<Search className="size-4" />}
            suffix={<span className="text-xs text-slate-500">km</span>}
            clearable
            status="error"
            placeholder="Search near you…"
            className="max-w-xs"
          />
        </LaTokenRow>

        <Code>{`<LaInput
  prefix={<Search className="size-4" />}
  suffix={<span className="text-xs">km</span>}
  clearable
  status="error"
  placeholder="Search near you…"
/>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 7. Developer guide ───────────────────────────────────────────── */}
      <LaSection title="Developer Guide">
        <div className="space-y-5 max-w-2xl">
          <div className="space-y-2">
            <SubLabel>Import</SubLabel>
            <Code>{`import { LaInput } from "@/components/la";`}</Code>
          </div>

          <div className="space-y-2">
            <SubLabel>Props reference</SubLabel>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Prop</th>
                    <th className="px-4 py-2.5 text-left font-medium">Type</th>
                    <th className="px-4 py-2.5 text-left font-medium">Default</th>
                    <th className="px-4 py-2.5 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    ["status", '"default" | "error" | "success"', '"default"', "Visual feedback ring + bg. Auto-sets aria-invalid on error."],
                    ["prefix", "ReactNode", "—", "Left-side decorative slot — icon or short text."],
                    ["suffix", "ReactNode", "—", "Right-side decorative slot — icon or short text."],
                    ["prefixLabel", "string", "—", "aria-label for the prefix slot (screen readers)."],
                    ["suffixLabel", "string", "—", "aria-label for the suffix slot (screen readers)."],
                    ["clearable", "boolean", "false", "Shows × button when input has a value. Works controlled & uncontrolled."],
                    ["onClear", "() => void", "—", "Called after clear fires. Useful for side-effects like resetting a URL query."],
                    ["showPasswordToggle", "boolean", "false", "Eye / EyeOff toggle. Only active when type=\"password\"."],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop}>
                      <td className="px-4 py-2.5 font-mono text-slate-800">{prop}</td>
                      <td className="px-4 py-2.5 font-mono text-blue-700">{type}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">{def}</td>
                      <td className="px-4 py-2.5 text-slate-600">{desc}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-slate-800">…rest</td>
                    <td className="px-4 py-2.5 font-mono text-blue-700">InputHTMLAttributes</td>
                    <td className="px-4 py-2.5 font-mono text-slate-400">—</td>
                    <td className="px-4 py-2.5 text-slate-600">All native input props forwarded (type, value, defaultValue, onChange, disabled, readOnly, …)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <SubLabel>Tips</SubLabel>
            <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside">
              <li>Pair with <code className="text-xs bg-slate-100 rounded px-1 py-0.5">LaField</code> to get label + error message + aria wiring automatically.</li>
              <li><code className="text-xs bg-slate-100 rounded px-1 py-0.5">showPasswordToggle</code> is silently ignored unless <code className="text-xs bg-slate-100 rounded px-1 py-0.5">type=&quot;password&quot;</code>.</li>
              <li>The clear button preserves layout when hidden (uses <code className="text-xs bg-slate-100 rounded px-1 py-0.5">visibility</code>, not <code className="text-xs bg-slate-100 rounded px-1 py-0.5">display:none</code>) so the input width never jumps.</li>
              <li>For controlled inputs, <code className="text-xs bg-slate-100 rounded px-1 py-0.5">clearable</code> fires your existing <code className="text-xs bg-slate-100 rounded px-1 py-0.5">onChange</code> with an empty value — no extra state needed.</li>
              <li>Pass <code className="text-xs bg-slate-100 rounded px-1 py-0.5">className</code> to control the input width (<code className="text-xs bg-slate-100 rounded px-1 py-0.5">max-w-xs</code>, <code className="text-xs bg-slate-100 rounded px-1 py-0.5">w-full</code>, etc.)</li>
            </ul>
          </div>
        </div>
      </LaSection>
    </>
  );
}

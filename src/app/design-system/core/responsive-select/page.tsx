"use client";

import { useState } from "react";
import { LaSelectResponsive } from "@/components/la";
import { LaText } from "@/components/la";

/* ─── helpers ────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <LaText type="h3">{title}</LaText>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <LaText type="small" as="p" className="text-slate-500">{label}</LaText>
      {children}
    </div>
  );
}

function ValueBadge({ value }: { value: string }) {
  return (
    <p className="mt-1 text-xs text-slate-500">
      selected: <span className="font-mono font-medium text-slate-800">&quot;{value}&quot;</span>
    </p>
  );
}

/* ─── shared data ────────────────────────────────────────── */
const fruits = [
  { value: "apple",  label: "Apple"  },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian" },
];

const countries = [
  {
    label: "Asia",
    options: [
      { value: "sg", label: "Singapore" },
      { value: "my", label: "Malaysia"  },
      { value: "th", label: "Thailand"  },
    ],
  },
  {
    label: "Europe",
    options: [
      { value: "gb", label: "United Kingdom" },
      { value: "de", label: "Germany"        },
      { value: "fr", label: "France"         },
    ],
  },
];

/* ─── page ───────────────────────────────────────────────── */
export default function ResponsiveSelectPage() {
  const [basic,   setBasic]   = useState("");
  const [preset,  setPreset]  = useState("banana");
  const [errVal,  setErrVal]  = useState("");
  const [okVal,   setOkVal]   = useState("cherry");
  const [grouped, setGrouped] = useState("");

  return (
    <div className="flex flex-col gap-12 p-8 max-w-xl">

      {/* ── 1. Basic States ──────────────────────────────── */}
      <Section title="Basic States">

        <Row label="Default — nothing selected">
          <LaSelectResponsive
            value={basic}
            onValueChange={setBasic}
            options={fruits}
            placeholder="Pick a fruit"
            label="Fruit"
          />
          <ValueBadge value={basic} />
        </Row>

        <Row label="With pre-selected value">
          <LaSelectResponsive
            value={preset}
            onValueChange={setPreset}
            options={fruits}
            placeholder="Pick a fruit"
            label="Fruit"
          />
          <ValueBadge value={preset} />
        </Row>

        <Row label="Disabled">
          <LaSelectResponsive
            value="apple"
            onValueChange={() => {}}
            options={fruits}
            placeholder="Pick a fruit"
            label="Fruit"
            disabled
          />
          <p className="mt-1 text-xs text-slate-400">disabled — interaction blocked</p>
        </Row>

        <Row label="Status: error">
          <LaSelectResponsive
            value={errVal}
            onValueChange={setErrVal}
            options={fruits}
            placeholder="Pick a fruit"
            label="Fruit"
            status="error"
          />
          <ValueBadge value={errVal} />
        </Row>

        <Row label="Status: success">
          <LaSelectResponsive
            value={okVal}
            onValueChange={setOkVal}
            options={fruits}
            placeholder="Pick a fruit"
            label="Fruit"
            status="success"
          />
          <ValueBadge value={okVal} />
        </Row>

      </Section>

      {/* ── 2. Option Groups ─────────────────────────────── */}
      <Section title="Option Groups">

        <Row label="Grouped options (Asia / Europe)">
          <LaSelectResponsive
            value={grouped}
            onValueChange={setGrouped}
            groups={countries}
            placeholder="Choose a country"
            label="Country"
          />
          <ValueBadge value={grouped} />
        </Row>

      </Section>

      {/* ── 3. Behaviour ─────────────────────────────────── */}
      <Section title="Behaviour">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">Resize to see both modes</p>
          <ul className="list-disc pl-4 space-y-1 text-blue-700">
            <li><strong>Mobile (&lt; md / 768 px)</strong> — tap the field to open a bottom Drawer with a scrollable option list. Selected item gets a blue highlight + check mark.</li>
            <li><strong>Tablet &amp; above (≥ md)</strong> — renders the standard native <code>&lt;select&gt;</code> via LaSelect. OS handles the dropdown.</li>
          </ul>
        </div>
      </Section>

      {/* ── 4. Developer Guide ───────────────────────────── */}
      <Section title="Developer Guide">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed space-y-4">

          <div>
            <LaText type="label" as="p" className="mb-1">Import</LaText>
            <pre className="rounded bg-slate-100 p-2 text-xs overflow-x-auto">
              {`import { LaSelectResponsive } from "@/components/la";`}
            </pre>
          </div>

          <div>
            <LaText type="label" as="p" className="mb-2">Props</LaText>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-1 pr-4 font-medium">Prop</th>
                  <th className="py-1 pr-4 font-medium">Type</th>
                  <th className="py-1 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-1.5 pr-4 font-mono">value</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Controlled selected value.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">onValueChange</td>
                  <td className="py-1.5 pr-4 text-slate-500">(v: string) =&gt; void</td>
                  <td className="py-1.5">Called when user picks an option.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">options</td>
                  <td className="py-1.5 pr-4 text-slate-500">LaSelectOption[]</td>
                  <td className="py-1.5">Flat list. Use either options or groups.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">groups</td>
                  <td className="py-1.5 pr-4 text-slate-500">LaSelectOptionGroup[]</td>
                  <td className="py-1.5">Grouped list with section headers.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">placeholder</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Shown when nothing is selected.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">label</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Drawer title on mobile. Falls back to placeholder.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">status</td>
                  <td className="py-1.5 pr-4 text-slate-500">&quot;default&quot; | &quot;error&quot; | &quot;success&quot;</td>
                  <td className="py-1.5">Applied to both trigger and native select.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">disabled</td>
                  <td className="py-1.5 pr-4 text-slate-500">boolean</td>
                  <td className="py-1.5">Blocks trigger tap and native select.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <LaText type="label" as="p" className="mb-1">Tips</LaText>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Always controlled — pass <code>value</code> + <code>onValueChange</code>.</li>
              <li>Use <code>options</code> for flat lists, <code>groups</code> for categorised lists — not both.</li>
              <li>The breakpoint is <code>md</code> (768 px) — Tailwind&apos;s default.</li>
              <li>Both modes are always rendered in the DOM; CSS <code>hidden/block</code> toggles visibility.</li>
            </ul>
          </div>

        </div>
      </Section>

    </div>
  );
}

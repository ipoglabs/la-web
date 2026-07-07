"use client";

import { useState } from "react";
import { LaListSelect } from "@/components/la";
import { LaText } from "@/components/la";

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

const fruits = [
  { value: "apple",  label: "Apple"  },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian", disabled: true },
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

export default function ListSelectPage() {
  const [flat,    setFlat]    = useState("");
  const [grouped, setGrouped] = useState("sg");

  return (
    <div className="flex flex-col gap-12 p-8 max-w-xl">

      {/* ── 1. Flat List ─────────────────────────────────── */}
      <Section title="Flat List">
        <Row label="Flat options — Durian is disabled">
          <div className="rounded-lg border border-slate-200 bg-white">
            <LaListSelect
              value={flat}
              onValueChange={setFlat}
              options={fruits}
            />
          </div>
          <ValueBadge value={flat} />
        </Row>
      </Section>

      {/* ── 2. Grouped List ──────────────────────────────── */}
      <Section title="Grouped List">
        <Row label="With group headers — pre-selected Singapore">
          <div className="rounded-lg border border-slate-200 bg-white">
            <LaListSelect
              value={grouped}
              onValueChange={setGrouped}
              groups={countries}
            />
          </div>
          <ValueBadge value={grouped} />
        </Row>
      </Section>

      {/* ── 3. Developer Guide ───────────────────────────── */}
      <Section title="Developer Guide">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed space-y-4">

          <div>
            <LaText type="label" as="p" className="mb-1">Import</LaText>
            <pre className="rounded bg-slate-100 p-2 text-xs overflow-x-auto">
              {`import { LaListSelect } from "@/components/la";`}
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
                  <td className="py-1.5 pr-4 text-slate-500">LaListSelectOption[]</td>
                  <td className="py-1.5">Flat list. Use either options or groups.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">groups</td>
                  <td className="py-1.5 pr-4 text-slate-500">LaListSelectOptionGroup[]</td>
                  <td className="py-1.5">Grouped with section headers.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">className</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Applied to the root ul — useful for height/scroll.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <LaText type="label" as="p" className="mb-1">Tips</LaText>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Always controlled — pass <code>value</code> + <code>onValueChange</code>.</li>
              <li>Wrap in a container with <code>overflow-y-auto max-h-*</code> for long lists.</li>
              <li>This is the list primitive consumed by <code>LaSelectResponsive</code> inside its mobile Drawer.</li>
            </ul>
          </div>

        </div>
      </Section>

    </div>
  );
}

"use client";

import { useState } from "react";
import { LaSelect } from "@/components/la";
import { LaText } from "@/components/la";

/* ─── shared option sets ─────────────────────────────────── */
const fruitsOptions = (
  <>
    <option value="">-- Pick a fruit --</option>
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
    <option value="durian">Durian</option>
  </>
);

/* ─── section heading helper ─────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <LaText type="h3">{title}</LaText>
      {children}
    </section>
  );
}

/* ─── live value badge ───────────────────────────────────── */
function ValueBadge({ value }: { value: string }) {
  return (
    <p className="mt-1 text-xs text-slate-500">
      selected: <span className="font-mono font-medium text-slate-800">&quot;{value}&quot;</span>
    </p>
  );
}

/* ─── row wrapper ────────────────────────────────────────── */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <LaText type="small" as="p" className="text-slate-500">{label}</LaText>
      {children}
    </div>
  );
}

export default function SelectPage() {
  /* one piece of state per demo select */
  const [basic,   setBasic]   = useState("");
  const [preset,  setPreset]  = useState("banana");
  const [errVal,  setErrVal]  = useState("");
  const [okVal,   setOkVal]   = useState("cherry");
  const [grouped, setGrouped] = useState("");

  return (
    <div className="flex flex-col gap-12 p-8 max-w-xl">

      {/* ── 1. Basic States ─────────────────────────────────── */}
      <Section title="Basic States">

        <Row label="Default (uncontrolled placeholder)">
          <LaSelect
            aria-label="Default select"
            title="Default select"
            value={basic}
            onChange={e => setBasic(e.target.value)}
          >
            {fruitsOptions}
          </LaSelect>
          <ValueBadge value={basic} />
        </Row>

        <Row label="With pre-selected value">
          <LaSelect
            aria-label="Pre-selected select"
            title="Pre-selected select"
            value={preset}
            onChange={e => setPreset(e.target.value)}
          >
            {fruitsOptions}
          </LaSelect>
          <ValueBadge value={preset} />
        </Row>

        <Row label="Disabled">
          <LaSelect aria-label="Disabled select" title="Disabled select" defaultValue="apple" disabled>
            {fruitsOptions}
          </LaSelect>
          <p className="mt-1 text-xs text-slate-400">disabled — interaction blocked</p>
        </Row>

        <Row label="Status: error">
          <LaSelect
            aria-label="Error select"
            title="Error select"
            status="error"
            value={errVal}
            onChange={e => setErrVal(e.target.value)}
          >
            {fruitsOptions}
          </LaSelect>
          <ValueBadge value={errVal} />
        </Row>

        <Row label="Status: success">
          <LaSelect
            aria-label="Success select"
            title="Success select"
            status="success"
            value={okVal}
            onChange={e => setOkVal(e.target.value)}
          >
            {fruitsOptions}
          </LaSelect>
          <ValueBadge value={okVal} />
        </Row>

      </Section>

      {/* ── 2. Option Groups ────────────────────────────────── */}
      <Section title="Option Groups">

        <Row label="Using &lt;optgroup&gt;">
          <LaSelect
            aria-label="Grouped select"
            title="Grouped select"
            value={grouped}
            onChange={e => setGrouped(e.target.value)}
          >
            <option value="">-- Choose a country --</option>
            <optgroup label="Asia">
              <option value="sg">Singapore</option>
              <option value="my">Malaysia</option>
              <option value="th">Thailand</option>
            </optgroup>
            <optgroup label="Europe">
              <option value="gb">United Kingdom</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
            </optgroup>
          </LaSelect>
          <ValueBadge value={grouped} />
        </Row>

      </Section>

      {/* ── 3. Developer Guide ──────────────────────────────── */}
      <Section title="Developer Guide">

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed space-y-4">

          <div>
            <LaText type="label" as="p" className="mb-1">Import</LaText>
            <pre className="rounded bg-slate-100 p-2 text-xs overflow-x-auto">
              {`import { LaSelect } from "@/components/la";`}
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
                  <td className="py-1.5 pr-4 font-mono">status</td>
                  <td className="py-1.5 pr-4 text-slate-500">&quot;default&quot; | &quot;error&quot; | &quot;success&quot;</td>
                  <td className="py-1.5">Ring + border colour. &quot;error&quot; also sets aria-invalid.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">aria-label</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Required if no visible &lt;label&gt; is associated.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">disabled</td>
                  <td className="py-1.5 pr-4 text-slate-500">boolean</td>
                  <td className="py-1.5">Native disabled behaviour + muted style.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">className</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Merged via cn() — tailwind-merge safe.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">ref</td>
                  <td className="py-1.5 pr-4 text-slate-500">Ref&lt;HTMLSelectElement&gt;</td>
                  <td className="py-1.5">forwardRef — direct access to the &lt;select&gt; node.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <LaText type="label" as="p" className="mb-1">Tips</LaText>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Always add a visible <code>&lt;label&gt;</code> or <code>aria-label</code> — required for accessibility.</li>
              <li>Use <code>value + onChange</code> for controlled; <code>defaultValue</code> for uncontrolled.</li>
              <li>Wrap in a <code>&lt;LaFormField&gt;</code> to get label, hint, and error text automatically.</li>
            </ul>
          </div>

        </div>

      </Section>

    </div>
  );
}

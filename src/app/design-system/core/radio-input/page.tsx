"use client";

import { useState } from "react";
import { LaRadio } from "@/components/la";
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

/* ─── page ───────────────────────────────────────────────── */
export default function RadioInputPage() {
  const [fruit,   setFruit]   = useState("apple");
  const [payment, setPayment] = useState("");
  const [errVal,  setErrVal]  = useState("");
  const [layout,  setLayout]  = useState("list");

  return (
    <div className="flex flex-col gap-12 p-8 max-w-xl">

      {/* ── 1. Basic Group (Vertical) ────────────────────── */}
      <Section title="Basic Group">
        <Row label="Vertical stack — same name, one controlled">
          <div className="flex flex-col gap-3">
            <LaRadio
              name="fruit-v"
              value="apple"
              label="Apple"
              checked={fruit === "apple"}
              onChange={() => setFruit("apple")}
            />
            <LaRadio
              name="fruit-v"
              value="banana"
              label="Banana"
              checked={fruit === "banana"}
              onChange={() => setFruit("banana")}
            />
            <LaRadio
              name="fruit-v"
              value="cherry"
              label="Cherry"
              checked={fruit === "cherry"}
              onChange={() => setFruit("cherry")}
            />
          </div>
          <ValueBadge value={fruit} />
        </Row>
      </Section>

      {/* ── 2. Horizontal Group ──────────────────────────── */}
      <Section title="Horizontal Group">
        <Row label="Inline row layout">
          <div className="flex flex-wrap gap-6">
            {["List", "Grid", "Compact"].map((opt) => (
              <LaRadio
                key={opt}
                name="layout-h"
                value={opt.toLowerCase()}
                label={opt}
                checked={layout === opt.toLowerCase()}
                onChange={() => setLayout(opt.toLowerCase())}
              />
            ))}
          </div>
          <ValueBadge value={layout} />
        </Row>
      </Section>

      {/* ── 3. States ────────────────────────────────────── */}
      <Section title="States">

        <Row label="Default — unchecked">
          <LaRadio name="s1" value="a" label="Unchecked option" />
        </Row>

        <Row label="Default — checked (defaultChecked)">
          <LaRadio name="s2" value="a" label="Pre-selected option" defaultChecked />
        </Row>

        <Row label="Disabled — unchecked">
          <LaRadio name="s3" value="a" label="Unavailable option" disabled />
        </Row>

        <Row label="Disabled — checked">
          <LaRadio name="s4" value="a" label="Locked selection" defaultChecked disabled />
        </Row>

        <Row label="Status: error">
          <div className="flex flex-col gap-3">
            <LaRadio
              name="payment"
              value="card"
              label="Credit / Debit Card"
              status="error"
              checked={errVal === "card"}
              onChange={() => setErrVal("card")}
            />
            <LaRadio
              name="payment"
              value="bank"
              label="Bank Transfer"
              status="error"
              checked={errVal === "bank"}
              onChange={() => setErrVal("bank")}
            />
          </div>
          <p className="mt-1 text-xs text-red-500">Please select a payment method.</p>
          <ValueBadge value={errVal} />
        </Row>

      </Section>

      {/* ── 4. Without Label (circle only) ───────────────── */}
      <Section title="Without Label">
        <Row label="Circle only — label placed externally">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LaRadio
                id="pay-card"
                name="pay-ext"
                value="card"
                checked={payment === "card"}
                onChange={() => setPayment("card")}
              />
              <label htmlFor="pay-card" className="cursor-pointer text-base text-gray-900">
                Card
              </label>
            </div>
            <div className="flex items-center gap-2">
              <LaRadio
                id="pay-cash"
                name="pay-ext"
                value="cash"
                checked={payment === "cash"}
                onChange={() => setPayment("cash")}
              />
              <label htmlFor="pay-cash" className="cursor-pointer text-base text-gray-900">
                Cash
              </label>
            </div>
          </div>
          <ValueBadge value={payment} />
        </Row>
      </Section>

      {/* ── 5. Developer Guide ───────────────────────────── */}
      <Section title="Developer Guide">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed space-y-4">

          <div>
            <LaText type="label" as="p" className="mb-1">Import</LaText>
            <pre className="rounded bg-slate-100 p-2 text-xs overflow-x-auto">
              {`import { LaRadio } from "@/components/la";`}
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
                  <td className="py-1.5 pr-4 font-mono">label</td>
                  <td className="py-1.5 pr-4 text-slate-500">ReactNode</td>
                  <td className="py-1.5">Text next to the circle. Omit to render circle only.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">status</td>
                  <td className="py-1.5 pr-4 text-slate-500">&quot;default&quot; | &quot;error&quot;</td>
                  <td className="py-1.5">Error turns border + fill red.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">name</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Same name groups radios — only one can be checked.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">value</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Value submitted with the form.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">checked</td>
                  <td className="py-1.5 pr-4 text-slate-500">boolean</td>
                  <td className="py-1.5">Controlled mode. Pair with onChange.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">defaultChecked</td>
                  <td className="py-1.5 pr-4 text-slate-500">boolean</td>
                  <td className="py-1.5">Uncontrolled initial state.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">disabled</td>
                  <td className="py-1.5 pr-4 text-slate-500">boolean</td>
                  <td className="py-1.5">Blocks interaction, dims the control.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">className</td>
                  <td className="py-1.5 pr-4 text-slate-500">string</td>
                  <td className="py-1.5">Applied to the root label — for layout spacing.</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-4 font-mono">ref</td>
                  <td className="py-1.5 pr-4 text-slate-500">Ref&lt;HTMLInputElement&gt;</td>
                  <td className="py-1.5">forwardRef — direct access to the input node.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <LaText type="label" as="p" className="mb-1">Tips</LaText>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Give every group a unique <code>name</code> — this is what links them together.</li>
              <li>Use <code>checked + onChange</code> for controlled; <code>defaultChecked</code> for uncontrolled.</li>
              <li><code>className</code> goes on the outer label — use it for gap/margin spacing.</li>
              <li>Omit <code>label</code> if you want to place your own label text externally via <code>htmlFor</code>.</li>
            </ul>
          </div>

        </div>
      </Section>

    </div>
  );
}

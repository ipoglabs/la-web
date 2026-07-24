"use client";

import { useState } from "react";
import LaSection from "@/components/la/la-section";
import { LaAmount, LaMinMax, LaSeparator, LaText, LaTokenRow, formatAmount, type LaAmountCurrency, type LaMinMaxValue } from "@/components/la";

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-700">
      <code>{children}</code>
    </pre>
  );
}

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

const quickAmounts = [
  { value: 100 },
  { value: 200 },
  { value: 300 },
  { value: 500 },
  { value: 1000 },
  { value: 25558 },
  { value: 555555 },
];

export default function AmountInputPage() {
  const [currency] = useState<LaAmountCurrency>("SGD");
  const [amount, setAmount] = useState<number | null>(25558);
  const [hideCurrencyAmount, setHideCurrencyAmount] = useState<number | null>(1200);
  const [range, setRange] = useState<LaMinMaxValue>({ min: 555555, max: 25558 });
  const [validRange, setValidRange] = useState<LaMinMaxValue>({ min: 100, max: 3000 });

  return (
    <>
      <LaSection title="LaAmount">
        <LaTokenRow label="default">
          <div className="w-full max-w-2xl space-y-2">
            <LaAmount
              value={amount}
              onValueChange={setAmount}
              currency={currency}
              options={quickAmounts}
            />
            <LaText type="muted" as="p" className="text-xs">
              Value: {amount == null ? "null" : formatAmount(amount)} {currency}
            </LaText>
          </div>
        </LaTokenRow>

        <LaTokenRow label="hide currency">
          <div className="w-full max-w-2xl space-y-2">
            <LaAmount
              value={hideCurrencyAmount}
              onValueChange={setHideCurrencyAmount}
              showCurrency={false}
              options={quickAmounts}
            />
            <LaText type="muted" as="p" className="text-xs">
              Toggle off the currency pill with showCurrency=false.
            </LaText>
          </div>
        </LaTokenRow>

        <LaTokenRow label="error state">
          <div className="w-full max-w-2xl">
            <LaAmount
              value={555555}
              currency="SGD"
              status="error"
              options={quickAmounts}
              errorMessage="Min. value cannot be more than Max. value"
              readOnly
            />
          </div>
        </LaTokenRow>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      <LaSection title="LaMinMax">
        <SubLabel>Composite min/max range</SubLabel>
        <div className="max-w-6xl">
          <h3 className="mb-4 text-2xl font-bold tracking-tight text-foreground">Price</h3>
          <LaMinMax
            value={range}
            onValueChange={setRange}
            currency={currency}
            options={quickAmounts}
          />
        </div>

        <SubLabel>Valid range</SubLabel>
        <div className="max-w-6xl">
          <h3 className="mb-4 text-2xl font-bold tracking-tight text-foreground">Price</h3>
          <LaMinMax
            value={validRange}
            onValueChange={setValidRange}
            currency="GBP"
            options={quickAmounts}
          />
        </div>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      <LaSection title="Developer Guide">
        <div className="max-w-3xl space-y-5">
          <div className="space-y-2">
            <SubLabel>Import</SubLabel>
            <Code>{`import { LaAmount, LaMinMax } from "@/components/la";`}</Code>
          </div>

          <div className="space-y-2">
            <SubLabel>Quick usage</SubLabel>
            <Code>{`const quickAmounts = [{ value: 100 }, { value: 200 }, { value: 300 }];

const [currency, setCurrency] = useState<LaAmountCurrency>("SGD");
const [amount, setAmount] = useState<number | null>(null);
const [range, setRange] = useState({ min: null, max: null });

<LaAmount
  value={amount}
  onValueChange={setAmount}
  currency={currency}
  options={quickAmounts}
/>

<LaMinMax
  value={range}
  onValueChange={setRange}
  currency={currency}
  options={quickAmounts}
/>`}</Code>
          </div>

          <div className="space-y-2">
            <SubLabel>LaAmount props</SubLabel>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Prop</th>
                    <th className="px-4 py-2.5 text-left font-medium">Type</th>
                    <th className="px-4 py-2.5 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    ["value", "number | null", "Controlled numeric value."],
                    ["onValueChange", "(value) => void", "Returns parsed positive number or null."],
                    ["currency", '"SGD" | "INR" | "GBP"', "Currency display passed in by the parent."],
                    ["showCurrency", "boolean", "Shows or hides the read-only currency pill."],
                    ["options", "{ value:number; label?:string }[]", "Quick-pick amounts shown in a mobile sheet and native desktop select."],
                    ["status", '"default" | "error" | "success"', "Visual state aligned to LA input treatment."],
                    ["errorMessage", "string", "Inline message under the field."],
                  ].map(([prop, type, desc]) => (
                    <tr key={prop}>
                      <td className="px-4 py-2.5 font-mono text-slate-800">{prop}</td>
                      <td className="px-4 py-2.5 font-mono text-blue-700">{type}</td>
                      <td className="px-4 py-2.5 text-slate-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <SubLabel>Behavior notes</SubLabel>
            <ul className="list-disc space-y-1.5 list-inside text-sm text-slate-600">
              <li>Only positive numbers are accepted. Any other character is stripped as the user types.</li>
              <li>While focused, the field shows the raw editable number. On blur, it formats with grouping separators.</li>
              <li>The currency chip is read-only. Pass the displayed currency from the parent component.</li>
              <li>Quick amounts use a bottom sheet on mobile and an anchored dropdown on tablet and above.</li>
              <li>LaMinMax is now a pure field-group component. Render any section title outside the component.</li>
              <li>LaMinMax validates min greater than max and automatically applies the error treatment to both fields.</li>
            </ul>
          </div>
        </div>
      </LaSection>
    </>
  );
}
"use client";

import React from "react";
import LaSection from "@/components/la/la-section";
import { DateInput, DateInputProps } from "@/components/date-input";

/** Self-contained case: owns state, shows live ISO output automatically */
function DateCase({
  label,
  hint,
  ...props
}: DateInputProps & { label: string; hint?: string }) {
  const [iso, setIso] = React.useState<string | null>(
    props.defaultValue ?? props.value ?? null
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {hint && <p className="text-xs text-slate-400 -mt-1">{hint}</p>}
      <DateInput {...props} onChange={(v) => { setIso(v); props.onChange?.(v); }} />
      {iso && (
        <p className="text-xs text-slate-400">
          Output: <span className="font-mono text-slate-600">{iso}</span>
        </p>
      )}
    </div>
  );
}

export default function DateInputPage() {
  return (
    <>
        {/* ── Inputs ───────────────────────────────────────────────────────── */}
      <LaSection title="Date Input">
        

        <p className="text-sm text-slate-500 mb-8">
            Masked single-field date input. Always emits ISO <code className="bg-slate-100 px-1 rounded">YYYY-MM-DD</code>{" "}
            — or <code className="bg-slate-100 px-1 rounded">null</code> when incomplete.
        </p>

        <div className="flex flex-col gap-8">

            <DateCase label="Use Case 1 — Default (DD / MM / YYYY)" hint="Separator: /  ·  Format: DMY" />

            <DateCase label="Use Case 2 — US Format (MM / DD / YYYY)" hint="Separator: /  ·  Format: MDY" inputFormat="MDY" />

            <DateCase label="Use Case 3 — ISO Format (YYYY - MM - DD)" hint="Separator: -  ·  Format: YMD" inputFormat="YMD" separator="-" />

            <DateCase label="Use Case 4 — Dot separator (DD . MM . YYYY)" hint="Separator: .  ·  Format: DMY" separator="." />

            <DateCase label='Use Case 5 — Blur display: long' hint='Click away to see "21 July 2024"' blurDisplay="long" defaultValue="2024-07-21" />

            <DateCase label='Use Case 6 — Blur display: medium' hint='Click away to see "21 Jul 2024"' blurDisplay="medium" defaultValue="2024-07-21" />

            <DateCase label='Use Case 7 — Blur display: short' hint='Click away to see "21/07/2024"' blurDisplay="short" defaultValue="2024-07-21" />

            <DateCase label="Use Case 8 — Disabled with pre-filled date" defaultValue="1990-03-15" disabled />

            <DateCase label="Use Case 9 — Auto inline error on blur" hint='Type "99 / 99 / 2024" then click away' id="case9" />

            <DateCase label="Use Case 10 — External error from form" hint="Server-side or required-field error via prop" id="case10" error="Date of birth is required" />

        </div>

        {/* Developer Reference */}
        <section className="mt-12 border-t pt-8">
            <h2 className="text-base font-bold mb-4">Developer Reference</h2>

            <div className="flex flex-col gap-6">

            <div>
                <h3 className="text-sm font-semibold mb-1">Output contract</h3>
                <p className="text-xs text-slate-600">
                <code className="bg-slate-100 px-1 rounded">onChange</code> always emits{" "}
                <code className="bg-slate-100 px-1 rounded">ISO 8601 (YYYY-MM-DD)</code> when the date
                is complete and valid, or <code className="bg-slate-100 px-1 rounded">null</code>{" "}
                otherwise. The input format only affects what the user types — your code always gets clean ISO.
                </p>
            </div>

            <div>
                <h3 className="text-sm font-semibold mb-2">Quick example</h3>
                <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">{`import { DateInput } from "@/components/date-input";

    const [dob, setDob] = React.useState<string | null>(null);

    <DateInput
    value={dob ?? ""}
    onChange={setDob}
    inputFormat="DMY"
    separator="/"
    blurDisplay="long"
    />`}</pre>
            </div>

            <div>
                <h3 className="text-sm font-semibold mb-2">Props</h3>
                <table className="text-xs w-full border-collapse">
                <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="py-1 pr-4 font-medium">Prop</th>
                    <th className="py-1 pr-4 font-medium">Type</th>
                    <th className="py-1 pr-4 font-medium">Default</th>
                    <th className="py-1 font-medium">Notes</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-100">
                    {[
                    ["value", "string", "—", "Controlled ISO value (YYYY-MM-DD)"],
                    ["defaultValue", "string", "—", "Uncontrolled initial ISO value"],
                    ["onChange", "(iso: string | null) => void", "—", "Emits ISO or null"],
                    ["inputFormat", '"DMY" | "MDY" | "YMD"', '"DMY"', "Field order"],
                    ["separator", '"/" | "-" | "."', '"/"', "Auto-spaced between parts"],
                    ["blurDisplay", '"none" | "long" | "medium" | "short" | "iso"', '"none"', "Friendly display on blur"],
                    ["disabled", "boolean", "false", "—"],
                    ["placeholder", "string", "Auto from format", "Overrides generated placeholder"],
                    ["id / label", "string", "—", "Label association & a11y"],
                    ["className / inputClassName", "string", "—", "Styling hooks"],
                    ].map(([prop, type, def, note]) => (
                    <tr key={prop}>
                        <td className="py-1.5 pr-4 font-mono font-medium text-slate-800">{prop}</td>
                        <td className="py-1.5 pr-4 font-mono text-slate-500">{type}</td>
                        <td className="py-1.5 pr-4 font-mono text-slate-400">{def}</td>
                        <td className="py-1.5 text-slate-600">{note}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            </div>
        </section>
      </LaSection>
    </>
  );
}

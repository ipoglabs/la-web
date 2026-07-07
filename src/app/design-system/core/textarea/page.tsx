"use client";

import { useState } from "react";
import LaSection from "@/components/la/la-section";
import { LaTextarea, LaTokenRow, LaSeparator, LaText, LaField } from "@/components/la";

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

export default function TextareaPage() {
  const [controlled, setControlled] = useState("");

  return (
    <>
      {/* ── 1. Basic States ──────────────────────────────────────────────── */}
      <LaSection title="Basic States">
        <LaTokenRow label="default">
          <LaTextarea placeholder="Tell us more…" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="rows={5}">
          <LaTextarea rows={5} placeholder="Detailed description…" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="disabled">
          <LaTextarea disabled placeholder="Not editable" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="read-only">
          <LaTextarea readOnly value="This is a read-only value." className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="error">
          <LaTextarea status="error" defaultValue="Invalid content here" className="max-w-xs" />
        </LaTokenRow>
        <LaTokenRow label="success">
          <LaTextarea status="success" defaultValue="Looks great!" className="max-w-xs" />
        </LaTokenRow>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 2. Controlled with char count ────────────────────────────────── */}
      <LaSection title="Controlled">
        <SubLabel>Live character counter</SubLabel>
        <LaTokenRow label="controlled">
          <div className="flex w-full max-w-xs flex-col gap-1">
            <LaTextarea
              value={controlled}
              onChange={(e) => setControlled(e.target.value)}
              maxLength={200}
              rows={4}
              placeholder="Type something…"
            />
            <LaText type="muted" as="p" className="text-right text-xs">
              {controlled.length} / 200
            </LaText>
          </div>
        </LaTokenRow>

        <Code>{`const [value, setValue] = useState("");

<LaTextarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
  maxLength={200}
  rows={4}
  placeholder="Type something…"
/>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 3. With LaField ──────────────────────────────────────────────── */}
      <LaSection title="With LaField">
        <SubLabel>hint</SubLabel>
        <LaField
          name="bio"
          label="Short bio"
          hint="Max 200 characters. Keep it punchy."
        >
          <LaTextarea rows={3} placeholder="Tell us about yourself" className="max-w-xs" />
        </LaField>

        <SubLabel>required</SubLabel>
        <LaField
          name="bio-req"
          label="Short bio"
          required
          hint="Max 200 characters."
        >
          <LaTextarea rows={3} placeholder="Tell us about yourself" className="max-w-xs" />
        </LaField>

        <SubLabel>error</SubLabel>
        <LaField
          name="bio-error"
          label="Short bio"
          error="Bio is required."
        >
          <LaTextarea status="error" rows={3} placeholder="Tell us about yourself" className="max-w-xs" />
        </LaField>

        <Code>{`<LaField name="bio" label="Short bio" hint="Max 200 characters.">
  <LaTextarea rows={3} placeholder="Tell us about yourself" />
</LaField>

// with error
<LaField name="bio" label="Short bio" error="Bio is required.">
  <LaTextarea status="error" rows={3} placeholder="Tell us about yourself" />
</LaField>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 4. Developer Guide ───────────────────────────────────────────── */}
      <LaSection title="Developer Guide">
        <div className="max-w-2xl space-y-5">
          <div className="space-y-2">
            <SubLabel>Import</SubLabel>
            <Code>{`import { LaTextarea } from "@/components/la";`}</Code>
          </div>

          <div className="space-y-2">
            <SubLabel>Props reference</SubLabel>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Prop</th>
                    <th className="px-4 py-2.5 text-left font-medium">Type</th>
                    <th className="px-4 py-2.5 text-left font-medium">Default</th>
                    <th className="px-4 py-2.5 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    ["status", '"default" | "error" | "success"', '"default"', "Visual ring + bg. Auto-sets aria-invalid on error."],
                    ["rows", "number", "—", "Number of visible text rows. Sets the initial height."],
                    ["maxLength", "number", "—", "Native HTML maxlength. Combine with a char counter for best UX."],
                    ["disabled", "boolean", "false", "Dims and blocks interaction."],
                    ["readOnly", "boolean", "false", "Value shown but cannot be edited."],
                    ["…rest", "TextareaHTMLAttributes", "—", "All native <textarea> props forwarded."],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop}>
                      <td className="px-4 py-2.5 font-mono text-slate-800">{prop}</td>
                      <td className="px-4 py-2.5 font-mono text-blue-700">{type}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">{def}</td>
                      <td className="px-4 py-2.5 text-slate-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LaSection>
    </>
  );
}

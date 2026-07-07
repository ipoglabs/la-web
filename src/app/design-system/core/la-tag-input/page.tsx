"use client";
import { useState } from "react";
import { LaTagInput } from "@/components/la/la-tag-input";
import LaSection from "@/components/la/la-section";
import { LaText } from "@/components/la/la-text";

// ── Shared helpers ─────────────────────────────────────────────────────────────

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {hint && <p className="text-sm text-slate-500 mt-0.5">{hint}</p>}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
        {children}
      </div>
    </div>
  );
}

function Log({ value }: { value: string[] }) {
  return (
    <p className="mt-3 text-sm text-slate-400">
      Value:{" "}
      <span className="font-mono text-slate-600">
        {value.length === 0 ? "[]" : `["${value.join('", "')}"]`}
      </span>
    </p>
  );
}

// ── Use cases ──────────────────────────────────────────────────────────────────

/** Case 1 — Default, no constraints */
function Case1() {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <>
      <LaTagInput
        value={tags}
        onChange={setTags}
        placeholder="e.g. sofa, dining table…"
        hint="Press Enter, comma, or Tab to add"
      />
      <Log value={tags} />
    </>
  );
}

/** Case 2 — Pre-seeded with values */
function Case2() {
  const [tags, setTags] = useState<string[]>(["leather sofa", "vintage", "ikea"]);
  return (
    <>
      <LaTagInput
        value={tags}
        onChange={setTags}
        placeholder="Add another keyword…"
        hint="Remove a tag with × or Backspace"
      />
      <Log value={tags} />
    </>
  );
}

/** Case 3 — maxTags cap with counter */
function Case3() {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <>
      <LaTagInput
        value={tags}
        onChange={setTags}
        placeholder="Up to 5 keywords…"
        maxTags={5}
        hint="Alerts fire if a listing matches any keyword"
      />
      <Log value={tags} />
    </>
  );
}

/** Case 4 — Used inside a form field context */
function Case4() {
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Keywords <span className="text-red-500">*</span>
        </label>
        <LaTagInput
          value={tags}
          onChange={(v) => { setTags(v); setSubmitted(false); }}
          placeholder="e.g. Furniture, brand name…"
          maxTags={8}
          hint="Alerts fire if a listing matches any keyword"
        />
        {submitted && tags.length === 0 && (
          <p className="text-sm text-red-500">Please add at least one keyword</p>
        )}
      </div>
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        Submit
      </button>
      <Log value={tags} />
    </form>
  );
}

/** Case 5 — Custom hint (search context) */
function Case5() {
  const [tags, setTags] = useState<string[]>(["Honda", "Toyota"]);
  return (
    <>
      <LaTagInput
        value={tags}
        onChange={setTags}
        placeholder="Add a brand…"
        hint="Results will include listings from any of these brands"
      />
      <Log value={tags} />
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LaTagInputPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-14">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">Core UI</p>
          <LaText type="h1" className="text-4xl font-extrabold tracking-tight text-foreground">
            La Tag Input
          </LaText>
          <p className="text-base text-muted-foreground">
            Multi-keyword tag field. Commit on Enter · comma · Tab. Remove with × or Backspace.
          </p>
        </div>

        {/* Use cases */}
        <LaSection title="Use Cases">
          <div className="flex flex-col gap-8">

            <Section
              title="1 — Default"
              hint="No constraints, press Enter/comma/Tab to add a tag."
            >
              <Case1 />
            </Section>

            <Section
              title="2 — Pre-seeded"
              hint="Component initialised with existing tags."
            >
              <Case2 />
            </Section>

            <Section
              title="3 — Max tags cap"
              hint="maxTags={5} — counter shown, input locked once cap reached."
            >
              <Case3 />
            </Section>

            <Section
              title="4 — Inside a form (with validation)"
              hint="Submit with no tags triggers an inline error."
            >
              <Case4 />
            </Section>

            <Section
              title="5 — Custom hint"
              hint="Hint text adapted for a search/filter context."
            >
              <Case5 />
            </Section>

          </div>
        </LaSection>

        {/* Developer guide */}
        <LaSection title="Developer Guide">
          <div className="flex flex-col gap-8">

            {/* Import */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Import</p>
              <pre className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-100 overflow-x-auto">{`import { LaTagInput } from "@/components/la/la-tag-input";`}</pre>
            </div>

            {/* Quick usage */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick Usage</p>
              <pre className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-100 overflow-x-auto">{`const [tags, setTags] = useState<string[]>([]);

// Basic
<LaTagInput value={tags} onChange={setTags} />

// With cap and hint
<LaTagInput
  value={tags}
  onChange={setTags}
  placeholder="e.g. Furniture, brand name…"
  maxTags={8}
  hint="Alerts fire if a listing matches any keyword"
/>`}</pre>
            </div>

            {/* Props table */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Props</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
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
                      ["value", "string[]", "—", "Controlled list of current tags"],
                      ["onChange", "(tags: string[]) => void", "—", "Fires every time tags change"],
                      ["placeholder", "string", '"Type and press Enter…"', "Shown when field is empty"],
                      ["maxTags", "number", "—", "Cap on number of tags; shows counter"],
                      ["hint", "string", '"Alerts fire if a listing matches any keyword"', "Helper text below the field"],
                      ["className", "string", "—", "Extra classes on the root wrapper"],
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

            {/* Behaviour notes */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Behaviour Notes</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-600">
                {[
                  ["Commit triggers", "Enter, comma, and Tab all add the current input as a tag."],
                  ["Backspace to remove", "When input is empty, Backspace removes the last tag."],
                  ["On blur commit", "Typing text and clicking away commits the pending input automatically."],
                  ["Validation", "Only a–z, A–Z, 0–9, spaces. Min 2 chars, max 30 chars. No duplicates (case-insensitive)."],
                  ["maxTags behaviour", "Once the cap is reached the input is hidden and a 'Max N keywords reached' hint appears."],
                  ["Always controlled", "LaTagInput is fully controlled — always pass value + onChange. No internal state for tags."],
                ].map(([term, desc]) => (
                  <li key={term as string} className="flex gap-2">
                    <code className="font-mono text-violet-600 flex-none shrink-0 text-sm">{term}</code>
                    <span className="text-slate-500">— {desc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </LaSection>

      </div>
    </div>
  );
}

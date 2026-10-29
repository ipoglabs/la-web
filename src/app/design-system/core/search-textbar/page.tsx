"use client";
import { useState } from "react";
import { LaSearchTextbar, type LaSearchTextbarOption } from "@/components/la/la-search-textbar";
import LaSection from "@/components/la/la-section";
import { LaText } from "@/components/la/la-text";

// ── Sample data ────────────────────────────────────────────────────────────────

const CAR_MAKES = [
  "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Citroën", "Dacia", "Ferrari", "Fiat", "Ford",
  "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Mahindra", "Maruti Suzuki", "Mazda",
  "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan", "Peugeot", "Porsche", "Range Rover", "Renault",
  "Rolls-Royce", "Seat", "Skoda", "Subaru", "Suzuki", "Tata", "Tesla", "Toyota", "Vauxhall", "Volkswagen", "Volvo",
];

const DOG_BREEDS: LaSearchTextbarOption[] = [
  { value: "labrador", label: "Labrador Retriever", sublabel: "Large · Friendly" },
  { value: "golden", label: "Golden Retriever", sublabel: "Large · Family dog" },
  { value: "gsd", label: "German Shepherd", sublabel: "Large · Working" },
  { value: "beagle", label: "Beagle", sublabel: "Medium · Scent hound" },
  { value: "bulldog", label: "French Bulldog", sublabel: "Small · Low exercise" },
  { value: "pug", label: "Pug", sublabel: "Small · Companion" },
  { value: "shih_tzu", label: "Shih Tzu", sublabel: "Small · Companion" },
  { value: "husky", label: "Siberian Husky", sublabel: "Large · High energy" },
  { value: "indie", label: "Indian Pariah (Indie)", sublabel: "Medium · Hardy" },
  { value: "cocker", label: "Cocker Spaniel", sublabel: "Medium · Gundog" },
];

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

function Log({ value }: { value: string }) {
  return (
    <p className="mt-3 text-sm text-slate-500">
      Value: <span className="font-mono text-slate-700">{value ? `"${value}"` : '""'}</span>
    </p>
  );
}

// ── Use cases ──────────────────────────────────────────────────────────────────

/** Case 1 — String options, starts-with first */
function Case1() {
  const [make, setMake] = useState("");
  return (
    <>
      <LaSearchTextbar options={CAR_MAKES} value={make} onChange={setMake} placeholder="Search make, e.g. ro" aria-label="Make" />
      <Log value={make} />
    </>
  );
}

/** Case 2 — Label / value options with sublabels, pre-selected */
function Case2() {
  const [breed, setBreed] = useState("gsd");
  return (
    <>
      <LaSearchTextbar options={DOG_BREEDS} value={breed} onChange={setBreed} placeholder="Search breed" aria-label="Breed" />
      <Log value={breed} />
    </>
  );
}

/** Case 3 — Inside a form field, with an error state */
function Case3() {
  const [make, setMake] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="ds-search-make" className="text-sm font-medium text-slate-700">
          Make <span className="text-red-500">*</span>
        </label>
        <LaSearchTextbar
          id="ds-search-make"
          options={CAR_MAKES}
          value={make}
          onChange={(v) => { setMake(v); setSubmitted(false); }}
          status={submitted && !make ? "error" : "default"}
          aria-describedby={submitted && !make ? "ds-search-make-error" : undefined}
          placeholder="Start typing a make"
        />
        {submitted && !make && (
          <p id="ds-search-make-error" className="text-sm text-red-500">Please pick a make from the list</p>
        )}
      </div>
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        Submit
      </button>
      <Log value={make} />
    </form>
  );
}

/** Case 4 — Show options from the first letter */
function Case4() {
  const [make, setMake] = useState("");
  return (
    <>
      <LaSearchTextbar options={CAR_MAKES} value={make} onChange={setMake} minChars={1} maxResults={5} placeholder="One letter is enough" aria-label="Make" />
      <Log value={make} />
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LaSearchTextbarPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-14">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">Core UI</p>
          <LaText type="h1" className="text-4xl font-extrabold tracking-tight text-foreground">
            La Search Textbar
          </LaText>
          <p className="text-base text-muted-foreground">
            A search bar instead of a dropdown. Type two letters and matching options appear — those starting with the letters first.
          </p>
        </div>

        {/* Use cases */}
        <LaSection title="Use Cases">
          <div className="flex flex-col gap-8">
            <Section title="1 — Default" hint="Type “ro”: Rolls-Royce first, then Alfa Romeo, Land Rover, Range Rover.">
              <Case1 />
            </Section>
            <Section title="2 — Label / value with sublabels" hint="Shows the label, stores the value. Pre-selected German Shepherd.">
              <Case2 />
            </Section>
            <Section title="3 — In a form" hint="Submit with nothing picked to see the error state.">
              <Case3 />
            </Section>
            <Section title="4 — minChars 1, maxResults 5" hint="Options appear from the first letter, five at most.">
              <Case4 />
            </Section>
          </div>
        </LaSection>

        {/* Props */}
        <LaSection title="Props">
          <div className="flex flex-col gap-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="py-2 pr-4 font-semibold">Prop</th>
                    <th className="py-2 pr-4 font-semibold">Type</th>
                    <th className="py-2 pr-4 font-semibold">Default</th>
                    <th className="py-2 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["options", "(string | {value, label, sublabel?})[]", "—", "What can be picked."],
                    ["value", "string", '""', "Selected option's value."],
                    ["onChange", "(value, option?) => void", "—", "Called on pick, and with \"\" when cleared or unpicked."],
                    ["minChars", "number", "2", "Letters typed before options show."],
                    ["maxResults", "number", "8", "Most options shown at once."],
                    ["emptyText", "string", '"No matches found"', "Shown when nothing matches."],
                    ["status", '"default" | "error" | "success"', '"default"', "Passed to LaInput."],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="border-b border-slate-100">
                      <td className="py-2 pr-4 font-mono text-slate-800">{prop}</td>
                      <td className="py-2 pr-4 font-mono text-violet-600">{type}</td>
                      <td className="py-2 pr-4 font-mono text-slate-500">{def}</td>
                      <td className="py-2 text-slate-700">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Behaviour notes */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Behaviour Notes</p>
              <ul className="flex flex-col gap-3 text-sm text-slate-700">
                {[
                  ["Matching", "Case-insensitive. Labels starting with the letters first, then labels with a later word starting with them."],
                  ["Keyboard", "↑ / ↓ move, Enter picks, Esc closes the list."],
                  ["Pick only", "The value is always one of the options. Typing over a picked option unpicks it (onChange \"\")."],
                  ["On blur", "Leaving the box with half-typed text puts the picked option's label back."],
                  ["Accessibility", "ARIA combobox pattern: role=combobox + listbox, aria-activedescendant follows the highlight."],
                ].map(([term, desc]) => (
                  <li key={term} className="flex gap-2">
                    <code className="font-mono text-violet-600 flex-none shrink-0 text-sm">{term}</code>
                    <span className="text-slate-700">— {desc}</span>
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

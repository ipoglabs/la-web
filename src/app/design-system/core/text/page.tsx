import LaSection from "@/components/la/la-section";
import { LaText, LaSeparator, LaTokenRow } from "@/components/la";

// ─── local helpers ────────────────────────────────────────────────────────────
function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-700 leading-relaxed">
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

export default function TextPage() {
  return (
    <>
      {/* ── 1. Headings ──────────────────────────────────────────────────── */}
      <LaSection title="Headings">
        <SubLabel>h1 — 40px semibold (Inter Display)</SubLabel>
        <LaText type="h1">The quick brown fox</LaText>

        <SubLabel>h2 — 30px normal (Inter Display)</SubLabel>
        <LaText type="h2">The quick brown fox</LaText>

        <SubLabel>h3 — 24px light (Inter Display)</SubLabel>
        <LaText type="h3">The quick brown fox</LaText>

        <SubLabel>h4 — 20px light (Inter Display)</SubLabel>
        <LaText type="h4">The quick brown fox</LaText>

        <SubLabel>h5 — 18px light (Inter Display)</SubLabel>
        <LaText type="h5">The quick brown fox</LaText>

        <Code>{`<LaText type="h1">Page Title</LaText>
<LaText type="h2">Section Title</LaText>
<LaText type="h3">Sub-section</LaText>
<LaText type="h4">Card Title</LaText>
<LaText type="h5">Small Heading</LaText>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 2. Body copy ─────────────────────────────────────────────────── */}
      <LaSection title="Body Copy">
        <SubLabel>body — 16px normal, leading-relaxed (default)</SubLabel>
        <LaText type="body">
          Good typography is invisible — it gets out of the way and lets the content speak.
          When set well, body text has a rhythm that pulls the reader forward without effort.
        </LaText>

        <SubLabel>small — 14px normal, slate-500</SubLabel>
        <LaText type="small">Helper text, captions, secondary info below a field or image.</LaText>

        <SubLabel>muted — 14px normal, slate-400</SubLabel>
        <LaText type="muted">Quiet note. Least visual emphasis — timestamps, metadata, fine print.</LaText>

        <Code>{`<LaText type="body">Paragraph text.</LaText>
<LaText type="small">Helper / caption text.</LaText>
<LaText type="muted">Quiet metadata or fine print.</LaText>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 3. UI types ──────────────────────────────────────────────────── */}
      <LaSection title="UI Types">
        <SubLabel>label — 14px medium, slate-700 (form labels)</SubLabel>
        <LaTokenRow label="default">
          <LaText type="label">Email address</LaText>
        </LaTokenRow>
        <LaTokenRow label="as label tag">
          {/* as="label" + htmlFor makes it a real accessible form label */}
          <LaText type="label" as="label" htmlFor="demo-input">Email address</LaText>
        </LaTokenRow>

        <SubLabel>quote — italic with left border</SubLabel>
        <LaText type="quote">
          Spacing, size, and weight work together to create hierarchy.
          A well-defined type scale means designers and developers speak the same language.
        </LaText>

        <SubLabel>code — inline monospace chip</SubLabel>
        <LaText type="body">
          Call{" "}
          <LaText type="code" as="code">{`router.push('/home')`}</LaText>
          {" "}to navigate programmatically.
        </LaText>
        <LaText type="code">{`const greeting = "hello world";`}</LaText>

        <Code>{`<LaText type="label">Email address</LaText>

// Real <label> element (for htmlFor)
<LaText type="label" as="label" htmlFor="email">Email</LaText>

// Inline code chip
<LaText type="code">router.push('/home')</LaText>

// Block quote
<LaText type="quote">A highlighted excerpt.</LaText>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 4. Tag override (as prop) ────────────────────────────────────── */}
      <LaSection title="Tag Override (as prop)">
        <SubLabel>Visual h2, renders as &lt;p&gt; — no heading in DOM</SubLabel>
        <LaTokenRow label="h2 as p">
          <LaText type="h2" as="p">Looks like h2, renders as p</LaText>
        </LaTokenRow>

        <SubLabel>Visual h3, renders as &lt;h2&gt; — SEO rank control</SubLabel>
        <LaTokenRow label="h3 as h2">
          <LaText type="h3" as="h2">Styled as h3, ranked as h2</LaText>
        </LaTokenRow>

        <SubLabel>Visual muted, renders as &lt;span&gt; — inline usage</SubLabel>
        <LaTokenRow label="muted as span">
          <LaText type="muted" as="span">Inline muted text</LaText>
        </LaTokenRow>

        <Code>{`// Decouple visual style from semantic tag
<LaText type="h2" as="p">Looks h2, no heading in DOM</LaText>
<LaText type="h3" as="h2">Styled h3, SEO weight of h2</LaText>
<LaText type="muted" as="span">Inline quiet text</LaText>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 5. Truncate ──────────────────────────────────────────────────── */}
      <LaSection title="Truncate">
        <SubLabel>Single-line ellipsis clamp</SubLabel>
        <LaTokenRow label="body">
          <LaText type="body" truncate className="max-w-xs">
            This is a very long sentence that will be cut with an ellipsis once it overflows the container.
          </LaText>
        </LaTokenRow>
        <LaTokenRow label="h3">
          <LaText type="h3" truncate className="max-w-xs">
            Very long heading that should be truncated
          </LaText>
        </LaTokenRow>
        <LaTokenRow label="small">
          <LaText type="small" truncate className="max-w-40">
            Truncated caption text in a narrow container
          </LaText>
        </LaTokenRow>

        <Code>{`// truncate adds: overflow-hidden whitespace-nowrap text-ellipsis
<LaText type="body" truncate className="max-w-xs">
  Long text that clips with ellipsis…
</LaText>

// Multi-line clamp? Use className instead:
<LaText type="body" className="line-clamp-2">Long text…</LaText>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 6. className overrides ───────────────────────────────────────── */}
      <LaSection title="className Overrides">
        <SubLabel>Colour override</SubLabel>
        <LaTokenRow label="blue">
          <LaText type="body" className="text-blue-600">Blue body text</LaText>
        </LaTokenRow>
        <LaTokenRow label="danger">
          <LaText type="small" className="text-red-500">Error helper text</LaText>
        </LaTokenRow>

        <SubLabel>Size override</SubLabel>
        <LaTokenRow label="muted xs">
          <LaText type="muted" className="text-xs">Extra small muted (12px)</LaText>
        </LaTokenRow>

        <SubLabel>Weight override</SubLabel>
        <LaTokenRow label="body bold">
          <LaText type="body" className="font-semibold">Bold body for emphasis</LaText>
        </LaTokenRow>

        <Code>{`// className is merged via cn() — override anything safely
<LaText type="small" className="text-red-500">Error message</LaText>
<LaText type="muted" className="text-xs">Extra small</LaText>
<LaText type="body" className="font-semibold">Bold body</LaText>`}</Code>
      </LaSection>

      <LaSeparator className="bg-slate-100" />

      {/* ── 7. Developer guide ───────────────────────────────────────────── */}
      <LaSection title="Developer Guide">
        <div className="space-y-5 max-w-2xl">
          <div className="space-y-2">
            <SubLabel>Import</SubLabel>
            <Code>{`import { LaText } from "@/components/la";`}</Code>
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
                  {([
                    ["type", '"h1"…"h5" | "body" | "small" | "muted" | "label" | "quote" | "code"', '"body"', "Controls visual style: size, weight, colour, and default tag."],
                    ["as", "React.ElementType", "per type", "Override the rendered HTML tag. Decouples visual style from DOM semantics."],
                    ["truncate", "boolean", "false", "Adds overflow-hidden whitespace-nowrap text-ellipsis for single-line clamp."],
                    ["className", "string", "—", "Merged via cn(). Safe to override colour, size, weight, or any Tailwind class."],
                    ["…rest", "HTMLAttributes", "—", "All standard element props forwarded (id, onClick, style, data-*, aria-*, …)."],
                  ] as const).map(([prop, type, def, desc]) => (
                    <tr key={prop}>
                      <td className="px-4 py-2.5 font-mono text-slate-800">{prop}</td>
                      <td className="px-4 py-2.5 font-mono text-blue-700 break-all">{type}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">{def}</td>
                      <td className="px-4 py-2.5 text-slate-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <SubLabel>Type scale reference</SubLabel>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">type</th>
                    <th className="px-4 py-2.5 text-left font-medium">Tag</th>
                    <th className="px-4 py-2.5 text-left font-medium">Size</th>
                    <th className="px-4 py-2.5 text-left font-medium">Weight</th>
                    <th className="px-4 py-2.5 text-left font-medium">Colour</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {([
                    ["h1",    "h1",         "4xl (40px)",  "semibold", "slate-700"],
                    ["h2",    "h2",         "3xl (30px)",  "normal",   "slate-800"],
                    ["h3",    "h3",         "2xl (24px)",  "light",    "slate-900"],
                    ["h4",    "h4",         "xl  (20px)",  "light",    "slate-900"],
                    ["h5",    "h5",         "lg  (18px)",  "light",    "slate-900"],
                    ["body",  "p",          "base (16px)", "normal",   "slate-900"],
                    ["small", "p",          "sm  (14px)",  "normal",   "slate-500"],
                    ["muted", "p",          "sm  (14px)",  "normal",   "slate-400"],
                    ["label", "span",       "sm  (14px)",  "medium",   "slate-700"],
                    ["quote", "blockquote", "base (16px)", "italic",   "slate-600"],
                    ["code",  "code",       "sm  (14px)",  "mono",     "slate-800 / bg-slate-100"],
                  ] as const).map(([t, tag, size, weight, colour]) => (
                    <tr key={t}>
                      <td className="px-4 py-2.5 font-mono text-slate-800">{t}</td>
                      <td className="px-4 py-2.5 font-mono text-blue-700">&lt;{tag}&gt;</td>
                      <td className="px-4 py-2.5 text-slate-600">{size}</td>
                      <td className="px-4 py-2.5 text-slate-600">{weight}</td>
                      <td className="px-4 py-2.5 text-slate-600">{colour}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <SubLabel>Tips</SubLabel>
            <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside">
              <li>Use <code className="text-xs bg-slate-100 rounded px-1 py-0.5">as</code> to decouple visual hierarchy from DOM/SEO semantics — e.g. a card title can look like <code className="text-xs bg-slate-100 rounded px-1 py-0.5">h3</code> but render as <code className="text-xs bg-slate-100 rounded px-1 py-0.5">h2</code>.</li>
              <li><code className="text-xs bg-slate-100 rounded px-1 py-0.5">type=&quot;label&quot;</code> defaults to <code className="text-xs bg-slate-100 rounded px-1 py-0.5">&lt;span&gt;</code>. Pass <code className="text-xs bg-slate-100 rounded px-1 py-0.5">as=&quot;label&quot;</code> + <code className="text-xs bg-slate-100 rounded px-1 py-0.5">htmlFor</code> to get a real accessible form label.</li>
              <li>Headings use <code className="text-xs bg-slate-100 rounded px-1 py-0.5">font-display</code> (Inter Display). Body types use Inter variable.</li>
              <li><code className="text-xs bg-slate-100 rounded px-1 py-0.5">truncate</code> only clips to one line. For multi-line clamp, pass <code className="text-xs bg-slate-100 rounded px-1 py-0.5">className=&quot;line-clamp-2&quot;</code> instead.</li>
              <li>All classes merge via <code className="text-xs bg-slate-100 rounded px-1 py-0.5">cn()</code> — passing <code className="text-xs bg-slate-100 rounded px-1 py-0.5">className</code> is always safe and will override correctly.</li>
            </ul>
          </div>
        </div>
      </LaSection>
    </>
  );
}

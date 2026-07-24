# Rich Text Editor — Component Documentation

## Overview

A Teams-style inline rich text editor with a paired read-only viewer. The two components share a single HTML string as their contract — `RichTextEditor` writes it, `RichTextViewer` renders it.

**Files:**
- `components/rich-text-editor/RichTextEditor.tsx` — Composer (`contentEditable` div + toolbar)
- `components/rich-text-editor/RichTextViewer.tsx` — Renderer (read-only HTML display)
- **Demo:** `app/snippets/rich-text-editor/page.tsx` — side-by-side compose + preview

---

## `RichTextEditor`

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `undefined` | Initial HTML — seeded once on mount |
| `onChange` | `(html: string) => void` | `undefined` | Fires on every keystroke or format change; passes raw HTML (or `""` when empty) |
| `placeholder` | `string` | `"Write something..."` | Shown when editor is empty and unfocused |
| `maxLength` | `number` | `2000` | Character limit — triggers warning colours on counter |

### Basic usage

```tsx
import { RichTextEditor } from "@/components/rich-text-editor/RichTextEditor";

const [html, setHtml] = useState("");

<RichTextEditor
  value={html}
  onChange={setHtml}
  placeholder="Type your message..."
  maxLength={2000}
/>
```

### Visual behaviour

| State | Border |
|---|---|
| Resting | `1.5px solid slate-400` |
| Focused | `1.5px solid slate-400` + `3px solid blue-500` on bottom only |
| Over limit (unfocused) | `1.5px solid red-400` |

- **Placeholder** — visible when empty AND unfocused; hidden on focus
- **Character counter** — always visible bottom-right; amber at 80%, red at 95% and over
- **Overflow label** — bottom-left, shows `Exceeded by N characters` only when over limit
- **Toolbar** — single scrollable row; `32×32` on desktop, `36×36` on mobile

### Toolbar

```
[ B ][ I ][ U ][ S ]   [ H2 ][ ¶ ][ " ]   [ • ][ 1. ]      [ ✕ ]
 ── inline ───────────   ── block ────────   ─ lists ─    clear (right)
```

| Button | Command | Type |
|---|---|---|
| Bold | `bold` | toggle |
| Italic | `italic` | toggle |
| Underline | `underline` | toggle |
| Strikethrough | `strikeThrough` | toggle |
| Title (H2) | `formatBlock → h2` | block toggle |
| Paragraph | `formatBlock → p` | block toggle |
| Quote | `formatBlock → blockquote` | block toggle |
| Bullet list | `insertUnorderedList` | toggle |
| Number list | `insertOrderedList` | toggle |
| Clear format | `removeFormat` + `formatBlock → p` | action |

**Active state:** `bg-slate-300 text-slate-900`, icon `strokeWidth 2.5`  
**Focus retention:** All toolbar buttons use `onMouseDown` with `e.preventDefault()` — preserves selection so `execCommand` applies to the correct range.

### Initial value seeding

`value` is written to the DOM **once** on mount via a `seededRef` guard. Subsequent `value` prop changes do not overwrite the editor. To reset externally, change the component's `key` prop.

---

## `RichTextViewer`

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `html` | `string` | ✅ | Raw HTML string from `RichTextEditor`'s `onChange` |
| `className` | `string` | — | Extra classes on the wrapper `<div>` |

```tsx
import { RichTextViewer } from "@/components/rich-text-editor/RichTextViewer";

<RichTextViewer html={html} />
```

If `html` is empty, whitespace-only, or `"<br>"`, renders `"Nothing to preview yet."` in italic slate-400.

### Shared prose styles

Both components use the same style map — output is visually identical to what the user sees while typing.

| Element | Style |
|---|---|
| `h2` | `text-base font-semibold text-slate-900 mb-1` |
| `p` | `leading-relaxed text-slate-700` |
| `blockquote` | `border-l-4 border-slate-200 pl-3 italic text-slate-500` |
| `ul` | `list-disc pl-5 space-y-0.5` |
| `ol` | `list-decimal pl-5 space-y-0.5` |
| `li` | `leading-relaxed` |

---

## Compose → Review Pattern

```tsx
// Compose
const [html, setHtml] = useState("");
<RichTextEditor onChange={setHtml} />

// Review (same or different route)
<RichTextViewer html={html} />
```

HTML string is the transport layer. Store in React state, URL param, API payload, or localStorage.

---

## API Integration Points

```ts
// TODO: [API] POST /api/listings — send { description: html }
// TODO: [API] GET  /api/listings/:id — fetch saved html for viewer
```

---

## Security

> **Sanitise server-side before persisting or rendering to other users.**  
> The editor outputs raw HTML. Use `sanitize-html` or DOMPurify to prevent XSS.

---

## Notes

- `execCommand` / `queryCommandState` are spec-deprecated but remain the only universally supported way to drive `contentEditable` without a full editor library. All major browsers continue to support them. No replacement API exists yet.
- The editor outputs **HTML**, not Markdown.
- Paste from external sources (Word, Notion) may inject `style=""` or `<span>` noise — sanitise for production.

# GoodToKnow

Two components for displaying structured selling points on a listing:
- `GoodToKnowEditor` — seller fills in label/value pairs in an editable table
- `GoodToKnowUserView` — buyer sees the polished read-only dot-leader display

**File:** `components/good-to-know/GoodToKnow.tsx`

---

## Import

```tsx
import {
  GoodToKnowEditor,
  GoodToKnowUserView,
  type GoodToKnowPoint,
} from "@/components/good-to-know/GoodToKnow";
```

---

## GoodToKnowEditor

Seller-facing component. Each row has a **Label** (e.g. "Parking") and a **Value / Detail** (e.g. "Available"). Rows preview as dot-leader lines once both fields are filled.

### Controlled usage

```tsx
const [points, setPoints] = useState<GoodToKnowPoint[]>([]);
const [title,  setTitle]  = useState("Good To Know");

<GoodToKnowEditor
  maxPoints={8}
  onChange={setPoints}
  onTitleChange={setTitle}
/>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxPoints` | `number` | `10` | Maximum number of rows. |
| `minPoints` | `number` | `1` | Cannot delete below this count. |
| `titleOptions` | `string[]` | See below | Preset title choices in the section-title pill menu. |
| `defaultTitle` | `string` | First titleOption | Initial section title. |
| `initialPoints` | `{ label: string; value: string }[]` | Sample data | Seed rows on first render. |
| `onChange` | `(pts: GoodToKnowPoint[]) => void` | — | Called on every row change. |
| `onTitleChange` | `(title: string) => void` | — | Called when section title changes. |

### Default title options

```
Good To Know · Key Details · At a Glance · Highlights · Quick Facts
```

### GoodToKnowPoint type

```ts
interface GoodToKnowPoint {
  id:    string;  // stable internal key — strip before sending to API
  label: string;
  value: string;
}
```

### UX behaviours

**Section title pill:**
- Renders as a rounded pill button showing the current title + chevron
- Click opens a floating dropdown menu with all title options
- Active option highlighted in blue
- Closes on outside click

**Row edit → preview flow:**
- New rows start in **edit mode** (two side-by-side inputs)
- When focus leaves the row (`onBlur` on wrapper), if **both** label and value are filled → row collapses to **preview mode**
- Tabbing from label → value input within the same row does NOT trigger collapse
- **Preview mode** shows a dot-leader row: `Label ····· Value`
- A pencil (✏️) icon on the right re-opens the row in edit mode and auto-focuses the label input

**Add / Delete:**
- "+ Add point" button disabled while the last row is still empty
- Delete button disabled when at `minPoints`
- New rows auto-focus the label input via `requestAnimationFrame`

**Overflow / truncation:**
- Both label and value are capped at `max-w-[42%]` with `truncate` in preview mode
- The dot-leader always has `min-w-4` so it's always visible

**Field limits:**
- Label: max 40 characters
- Value: max 60 characters

---

## GoodToKnowUserView

Read-only buyer-facing display. Renders only rows where at least one field is filled.

### Usage

```tsx
<GoodToKnowUserView points={points} title={title} />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `points` | `{ label: string; value: string }[]` | required | Array of points to display. |
| `title` | `string` | `"Good To Know"` | Section header text. |

### Visual structure

```
┌─────────────────────────────┐
│ Good To Know                │  ← slate-50 header band
├─────────────────────────────┤
│ Parking ·········· Available│  ← dot-leader row
│ Security ·· 24/7 CCTV      │
│ ...                         │
└─────────────────────────────┘
```

Empty rows (both label and value blank) are filtered out before rendering.
Long text truncates at `max-w-[42%]` on both sides; the dot-leader shrinks to fill remaining space.

---

## Design notes

- Component uses combined `editorState` (single `useState`) to guarantee `points` and `editingIds` share the same generated IDs — prevents stale ID mismatch across HMR / re-mounts
- `filledCount` in the footer only counts rows where **both** fields are filled
- No drag-and-drop (grip handle removed as non-functional decoration)

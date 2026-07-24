# Timeline Component

A lazy-loading product history timeline, displayed inside a right-slide sheet. Shows releases, features, launches and milestones with year dividers, a stats strip and a completion animation.

---

## Files

| File | Role |
|---|---|
| `components/timeline/Timeline.tsx` | Core timeline component |
| `components/ui/sheet.tsx` | Right-slide Sheet primitive (Radix Dialog) |
| `app/snippets/timeline/page.tsx` | Snippet entry point with mock data |
| `app/globals.css` | Keyframe animations for sheet + success state |

---

## Usage

```tsx
import Timeline, { type TimelineEvent } from "@/components/timeline/Timeline";
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetDescription, SheetCloseButton,
} from "@/components/ui/sheet";

const EVENTS: TimelineEvent[] = [ /* ... */ ];

export default function MyPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Timeline</button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <div>
              <SheetTitle>Product Timeline</SheetTitle>
              <SheetDescription>5 years · releases, features &amp; milestones</SheetDescription>
            </div>
            <SheetCloseButton />
          </SheetHeader>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <Timeline events={EVENTS} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
```

---

## TimelineEvent Shape

```ts
export type EventType = "launch" | "release" | "feature" | "milestone";

export interface TimelineEvent {
  id: string;        // Unique identifier
  year: number;      // Used for year-divider grouping
  date: string;      // Display string, e.g. "Jan 2026"
  type: EventType;   // Controls dot + badge colour
  title: string;
  description: string;
  tag?: string;      // Optional version tag, e.g. "v2.0" — rendered in monospace
  points?: string[]; // Optional bullet points below description
}
```

---

## Event Types & Colours

| Type | Dot | Badge |
|---|---|---|
| `launch` | `bg-emerald-500` | `bg-emerald-50 text-emerald-700` |
| `release` | `bg-blue-500` | `bg-blue-50 text-blue-700` |
| `feature` | `bg-violet-500` | `bg-violet-50 text-violet-700` |
| `milestone` | `bg-amber-500` | `bg-amber-50 text-amber-700` |

---

## Timeline Component

### Props

| Prop | Type | Description |
|---|---|---|
| `events` | `TimelineEvent[]` | Full event list, **most recent first** (descending) |

### Behaviour

- **Lazy loading** — renders 6 events on mount, loads the next 6 each time the sentinel element enters the viewport (`IntersectionObserver`, `threshold: 0.5`). Simulates a 700ms async delay with skeleton placeholders.
- **Year dividers** — a dark `bg-slate-900` pill with a filled white dot is injected whenever the year changes in the visible set.
- **Stats strip** — four pastel tiles at the top: Total (rose), Span in years (sky), Features (violet), Releases (emerald).
- **Legend** — colour-coded dot + label for each event type.
- **End state** — when all events are loaded, a pure-CSS success animation appears: green circle pop → white checkmark stroke-draw → 6 sparkle dots, plus "You're all caught up" text.

### Subcomponents (internal)

| Component | Purpose |
|---|---|
| `SuccessAnimation` | SVG + CSS keyframe end-state animation |
| `YearDivider` | Dark pill divider with filled dot on the track |
| `EventItem` | Single event row: badge, tag, date, title, description, bullets |
| `SkeletonRow` | Animated pulse placeholder during lazy load |
| `Legend` | Colour legend row |

---

## Sheet Primitive (`components/ui/sheet.tsx`)

Thin wrapper around `@radix-ui/react-dialog` styled as a right-side slide panel.

### Exports

| Export | Description |
|---|---|
| `Sheet` | Root (= `DialogPrimitive.Root`) |
| `SheetTrigger` | Trigger element |
| `SheetClose` | Raw close primitive |
| `SheetCloseButton` | Pre-styled × button — drop directly into `SheetHeader` |
| `SheetContent` | Panel container — animates in/out from the right |
| `SheetHeader` | Top bar with `justify-between` flex layout and bottom border |
| `SheetTitle` | Bold panel title |
| `SheetDescription` | Muted subtitle below title |

### Overlay

- `bg-black/30` dim + `backdrop-blur-[2px]` — subtle blur on background content when sheet is open.

### Animations

Defined in `app/globals.css`:

```css
@keyframes sheetIn  { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes sheetOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
```

Radix applies `data-state="open"` / `data-state="closed"` automatically. The sheet waits for the `animationend` event before unmounting — no `forceMount` needed.

---

## CSS Keyframes (globals.css)

| Name | Used by | Effect |
|---|---|---|
| `sheetIn` / `sheetOut` | `.sheet-content` | Right-slide enter/exit |
| `overlayIn` / `overlayOut` | `.sheet-overlay` | Overlay fade in/out |
| `successPop` | `.success-circle` | Scale pop on green circle |
| `checkDraw` | `.success-check` | SVG stroke-dashoffset draw |
| `sparkleFly` | `.sparkle-1` – `.sparkle-6` | 6 dots fly outward |

---

## Design Decisions

- **No external animation library** — the success animation is pure CSS/SVG. `@lottiefiles/dotlottie-react` is installed but not used (CDN unreachable at time of build; replaced with self-contained keyframes).
- **Descending order** — events should be passed most-recent-first so the newest appears at the top of the sheet.
- **Sheet width** — `max-w-sm` (384px). Works well on mobile; on wider screens it slides in from the right edge without covering the full viewport.
- **Threshold `0.5`** — the IntersectionObserver fires when the sentinel is 50% visible, which is more reliable on narrow viewports than `threshold: 1`.

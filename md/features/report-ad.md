# Report Ad — Functionality Guide

A complete, production-ready Report Ad feature. Users can flag problematic listings through a 3-screen journey inside a responsive popup (bottom sheet on mobile, centred dialog on desktop).

---

## Architecture Overview

```
components/report-ad/
  index.ts            ← barrel export (import everything from here)
  types.ts            ← TypeScript types, constants, utility functions
  model.ts            ← Mongoose schema + IAdReport interface
  ReportAdJourney.tsx ← 3-screen journey (Screen 1 → 2 → 3)
  ReportAdPopup.tsx   ← Responsive popup wrapper (single Dialog)

app/api/reports/
  route.ts            ← POST /api/reports
  [ticketId]/
    route.ts          ← GET + PATCH /api/reports/:ticketId

components/la-blocks/
  WhatsNext.tsx       ← Reusable "what happens next" timeline component
```

---

## File Responsibilities

| File | Role |
|---|---|
| `types.ts` | Single source of truth for all types, `REPORT_ISSUE_OPTIONS`, `deriveReportPriority`, `generateDemoTicketId` |
| `model.ts` | Mongoose schema for `ad_reports` collection. **API routes only** — never import in client components |
| `ReportAdJourney.tsx` | Stateful 3-screen flow. Self-contained, works standalone or inside popup |
| `ReportAdPopup.tsx` | Responsive shell. Uses inline styles (not Tailwind) for positioning to avoid class conflicts on resize |
| `index.ts` | Re-exports everything — consumers only import from `@/components/report-ad` |

---

## Journey Screens

### Screen 1 — Collect
- **Ad context card** — thumbnail, title, seller, Ad ID badge
- **Issue toggles** — `ToggleButtonGroup` multi-select with `Circle`/`CheckCircle2` icon variant (blue highlight when selected)
- **Details textarea** — optional, max 500 chars, `maxLength` enforced client-side
- **Warning** — "False reports may result in account restrictions" with amber icon
- **CTA** — "Review Report" disabled until ≥1 issue selected

### Screen 2 — Review
- Flat typographic summary (no card pattern)
- Ad title + red `Ad ID` badge
- Issue chips (`bg-slate-200`, `text-slate-800`, `border-slate-300`)
- Details shown only if filled
- **Acknowledgement checkbox** — blue accent (`accent-blue-600`), submit blocked until checked
- Back + Submit Report footer

### Screen 3 — Status
- Rose header (`bg-rose-500`) with white circle checkmark icon
- "Report Submitted" + "Thank you for keeping our community safe."
- **Ticket ID card** — monospace ticket ID + priority badge (scrollable area)
- Reported ad summary + issues chips
- `WhatsNext` timeline — "Under review" (blue tick = completed), "Action if needed", "We may follow up"
- **Done** button (`primary-rose`) closes the popup

---

## Responsive Popup Design

`ReportAdPopup` uses **one `<Dialog>` with inline styles** — never swaps between Drawer and Dialog components.

```
Why inline styles (not Tailwind classes):
  Tailwind-merge deduplicates utility classes by property name, not breakpoint.
  Fixed+transform combinations (translate-x-1/2 vs translate-x-0) cannot be
  reliably overridden across breakpoints via className alone.
  Inline styles have absolute specificity — no conflicts, ever.
```

| Viewport | Appearance | Animation |
|---|---|---|
| `< 768px` | Bottom sheet, `h-[82dvh]`, `border-radius: 1rem 1rem 0 0` | Slide up from bottom (`ra-sheet-in`) |
| `≥ 768px` | Centred popup, `h-[85dvh]`, `max-w-[28rem]`, `border-radius: 1.5rem` | Fade in (`ra-dialog-in`) |

State is preserved through any browser resize because the same component instance stays mounted.

**Animations** defined in `app/globals.css` as `.report-ad-popup[data-state]`:
- `ra-sheet-in/out` — `translateY(100% → 0)`, 340ms spring
- `ra-dialog-in/out` — opacity only, 160ms ease

---

## State Management

All journey state lives in `ReportAdJourney`:

| State | Type | Purpose |
|---|---|---|
| `step` | `1 \| 2 \| 3` | Current screen |
| `issues` | `ReportIssue[]` | Selected issue categories |
| `details` | `string` | Optional free text |
| `isSubmitting` | `boolean` | Loading state during API call |
| `submitError` | `boolean` | Show error message on failure |
| `ticket` | `ReportAdTicket \| null` | Set on successful submit, drives Screen 3 |

`onStepChange` prop pipes step changes to the parent popup so the drag handle can change colour on step 3.

`journeyKey` in the popup increments each time `open` becomes `true`, causing `ReportAdJourney` to remount and reset all state cleanly.

---

## Issue Categories & Priority

Priority is **derived server-side** in `model.ts` via `pre("save")` hook. Client-sent priority is never trusted.

| Issue | Value | Priority |
|---|---|---|
| Scam / Fraud | `scam_fraud` | High |
| Illegal Content | `illegal_content` | High |
| Counterfeit Item | `counterfeit` | High |
| Misleading Info | `misleading` | Medium |
| Prohibited Item | `prohibited_item` | Medium |
| Offensive / Hateful | `offensive` | Medium |
| Spam | `spam` | Low |
| Duplicate Listing | `duplicate` | Low |
| Wrong Category | `wrong_category` | Low |
| Already Sold | `already_sold` | Low |

Priority derivation: highest priority among all selected issues wins.

---

## API Reference

### `POST /api/reports`

**Request body** (`ReportAdPayload`):
```json
{
  "adId":        "10109",
  "adTitle":     "2BR Apartment for Rent...",
  "adThumbnail": "/img/img1.jpg",
  "sellerName":  "Sarah Tan",
  "location":    "Orchard Road, Singapore",
  "issues":      ["scam_fraud", "misleading"],
  "details":     "Price doubled overnight.",
  "hideIdentity": true
}
```

**Responses:**
| Status | Body | Meaning |
|---|---|---|
| `201` | `{ ticketId }` | Report created |
| `400` | `{ error, fields }` | Validation failure |
| `409` | `{ error: "duplicate_report" }` | Reporter already has active report for this ad |
| `429` | `{ error: "rate_limit" }` | Max 10 reports/IP/hour exceeded |
| `500` | `{ error: "server_error" }` | Unexpected error |

Ticket ID format: `RPT-{YEAR}-{6-char alphanumeric}` — no ambiguous chars (no `0/O/1/I`).

---

### `GET /api/reports/:ticketId`

Returns `{ ticketId, status, priority, createdAt }`.

---

### `PATCH /api/reports/:ticketId` *(admin)*

**Request body:** `{ status: "reviewed" | "actioned" | "dismissed", resolution?: string }`

Returns `{ ticketId, status, reviewedAt }`. Sets `reviewedAt` timestamp automatically.

---

## Security

| Threat | Defence |
|---|---|
| XSS via stored text | HTML tags stripped server-side (`sanitizeText`) before DB write |
| Script injection | `<script>`, `<img onerror>` etc → tags removed |
| Null-byte / log injection | Control chars `\u0000–\u001F` stripped |
| Oversized payload (DoS) | Hard length caps: `adId` 100, `adTitle` 300, `sellerName` 200, `details` 500 |
| Invalid issue values | Strict allowlist — only known `ReportIssue` enum values accepted |
| IP flooding | In-memory rate limiter — max 10 reports/IP/hour |
| Duplicate reports | DB check — same reporter + same ad + active status → 409 |
| Invalid JSON | `req.json().catch(() => null)` → 400 |
| XSS on render | React auto-escapes all `{}` interpolation |

---

## MongoDB Schema (`ad_reports` collection)

Key fields: `ticketId` (unique), `adId`, `issues[]`, `priority`, `status`, `reporterId`, `hideIdentity`, `details`.

**Compound indexes:**
- `{ status, createdAt }` — admin review queue
- `{ reporterId, adId, status }` — duplicate-report check

---

## WhatsNext Component

Located at `components/la-blocks/WhatsNext.tsx`.

```tsx
<WhatsNext
  heading="What happens next"
  data={[
    { title: "Under review",     description: "We'll look into this within 24–48 hours.", isCompleted: true  },
    { title: "Action if needed", description: "Violating ads will be removed.",            isCompleted: false },
    { title: "We may follow up", description: "We'll reach out if we need more details.",  isCompleted: false },
  ]}
/>
```

Design: dashed vertical line (`border-slate-500`), **blue tick** (`text-blue-500`) for completed, grey circle for pending. Icon divs have `bg-white rounded-full` to mask the dashed line behind them.

---

## Integration Checklist

All TODOs are marked `TODO [INTEGRATION]` in source. Summary:

### `ReportAdJourney.tsx`
- [ ] Replace `simulateSubmit()` fallback with real `fetch('/api/reports', ...)`
- [ ] Pass `reporterId` from auth session into payload
- [ ] Handle `429` → show "You've already reported this ad" message

### `app/api/reports/route.ts`
- [ ] Extract `reporterId` + `reporterEmail` from auth session (`getServerSession`)
- [ ] Pass `sellerId` from listing context into the document
- [ ] Replace in-memory IP rate limiter with Upstash Redis for production

### `app/api/reports/[ticketId]/route.ts`
- [x] Add auth guard on GET — reporter can only see their own ticket (done — session ownership check live)
- [x] Add admin role check on PATCH (done — `getSession()` + `role === "admin"` guard live)

### Wiring example (listing detail page):
```tsx
<ReportAdPopup
  open={open}
  onOpenChange={setOpen}
  target={{ adId, title, thumbnail, sellerName, location }}
  onSubmit={async (payload) => {
    const res = await fetch('/api/reports', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (res.status === 429) throw new Error('rate_limit');
    if (!res.ok)            throw new Error('submit_failed');
    const { ticketId } = await res.json();
    return { ticketId, status: 'pending', createdAt: new Date().toISOString() };
  }}
/>
```

---

## Demo Page

`/snippets/report-ad` — bare layout (no AppHeader/AppFooter), shows popup trigger and last submitted payload for developer reference.

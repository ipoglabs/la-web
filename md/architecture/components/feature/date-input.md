# DateInput — Component Documentation

## Overview

A single masked text field for date entry. Separators auto-insert as the user types digits — no multi-field complexity, no native date picker inconsistencies. Always outputs a clean ISO `YYYY-MM-DD` string regardless of the display format chosen.

**Philosophy:** One field, one output, zero ambiguity. The user sees their regional format; your code always gets ISO.

---

## At a Glance

| Attribute   | Value                                      |
|-------------|--------------------------------------------|
| Component   | `DateInput`                                |
| Location    | `components/date-input/DateInput.tsx`      |
| Type        | Client Component (`"use client"`)          |
| Output      | ISO `YYYY-MM-DD` or `null`                 |
| Default format | `DMY` — `DD / MM / YYYY`               |
| Demo page   | `/snippets/date-input`                     |

---

## Usage

```tsx
import { DateInput } from "@/components/date-input";

const [dob, setDob] = React.useState<string | null>(null);

// Default — DD / MM / YYYY
<DateInput value={dob ?? ""} onChange={setDob} />

// US format
<DateInput inputFormat="MDY" value={dob ?? ""} onChange={setDob} />

// Friendly blur display
<DateInput blurDisplay="long" value={dob ?? ""} onChange={setDob} />
```

---

## Output Contract

`onChange` always emits one of two things:

| Situation | Emits |
|---|---|
| Complete, valid date | `"2024-07-21"` (ISO 8601) |
| Incomplete or invalid | `null` |

The `inputFormat` prop only changes what the user types — your code always receives clean ISO. Safe to pass directly to `new Date()`, APIs, or databases.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled ISO value (`YYYY-MM-DD`) |
| `defaultValue` | `string` | — | Uncontrolled initial ISO value |
| `onChange` | `(iso: string \| null) => void` | — | Emits ISO or `null` |
| `inputFormat` | `"DMY" \| "MDY" \| "YMD"` | `"DMY"` | Display/entry field order |
| `separator` | `"/" \| "-" \| "."` | `"/"` | Auto-spaced between parts |
| `blurDisplay` | `"none" \| "long" \| "medium" \| "short" \| "iso"` | `"none"` | Friendly display on blur |
| `error` | `string` | — | External error message (overrides internal) |
| `placeholder` | `string` | Auto from format | Overrides the generated placeholder |
| `disabled` | `boolean` | `false` | — |
| `id` | `string` | — | For label association |
| `label` | `string` | — | Screen-reader label (`sr-only`) |
| `className` | `string` | — | Wrapper div styles |
| `inputClassName` | `string` | — | Input element styles |

---

## Input Formats

| `inputFormat` | User sees | ISO out |
|---|---|---|
| `"DMY"` (default) | `21 / 07 / 2024` | `2024-07-21` |
| `"MDY"` | `07 / 21 / 2024` | `2024-07-21` |
| `"YMD"` | `2024 - 07 - 21` | `2024-07-21` |

---

## Separators

| `separator` | Example |
|---|---|
| `"/"` (default) | `21 / 07 / 2024` |
| `"-"` | `21 - 07 - 2024` |
| `"."` | `21 . 07 . 2024` |

---

## Blur Display (`blurDisplay`)

When the user leaves a fully valid date, the input swaps to a friendly read-only display. Clicking or focusing snaps back to the editable masked field instantly.

| Value | Shows on blur |
|---|---|
| `"none"` (default) | Stays as masked input |
| `"long"` | `21 July 2024` |
| `"medium"` | `21 Jul 2024` |
| `"short"` | `21/07/2024` |
| `"iso"` | `2024-07-21` |

---

## Validation & Error States

### Border states
| State | Border colour |
|---|---|
| Empty / untouched | Neutral grey |
| Valid complete date | Green |
| Error | Red |

### Auto inline errors (shown on blur, after user has typed)
| Situation | Message |
|---|---|
| Digits entered but fewer than 8 | `Please complete the date` |
| 8 digits but invalid date (e.g. `31/02`) | `Please enter a valid date` |

### External error prop
Pass `error="..."` to show a form-level or server-side message. External error takes priority over internal auto-messages.

```tsx
<DateInput error="Date of birth is required" />
```

---

## Behaviour Details

- **Digits only** — non-numeric keypresses are blocked at `onKeyDown`
- **Paste support** — strips non-digits and applies mask automatically
- **Separator auto-insert** — separators appear as digits fill each part; backspace strips them cleanly
- **Controlled & uncontrolled** — supports both patterns; use `value` + `onChange` for controlled, `defaultValue` for uncontrolled
- **Ref forwarding** — standard `React.forwardRef` — works with form libraries

---

## File Structure

```
components/date-input/
  DateInput.tsx     ← component + all helpers
  index.ts          ← re-exports component and all types

app/snippets/date-input/
  page.tsx          ← 10 live use cases + developer reference
```

---

## Use Cases (snippet page)

| # | Description |
|---|---|
| 1 | Default — `DMY`, `/` separator |
| 2 | US format — `MDY` |
| 3 | ISO format — `YMD`, `-` separator |
| 4 | Dot separator — `DMY`, `.` |
| 5 | Blur display: `long` |
| 6 | Blur display: `medium` |
| 7 | Blur display: `short` |
| 8 | Disabled with pre-filled date |
| 9 | Auto inline error on blur |
| 10 | External error from form validation |

# Toggle Group — Component Documentation

## Overview
A compound toggle button group for single or multi-select use cases. Built with React context — the parent manages all state and the buttons consume it via context. No props drilling, clean composition.

---

## At a Glance

| Attribute   | Value                                                        |
|-------------|--------------------------------------------------------------|
| Components  | `ToggleButtonGroup`, `ToggleGroupButton`                     |
| Location    | `components/toggle-group/CompoundToggleGroup.tsx`            |
| Type        | Client Component (`"use client"`)                            |
| Demo        | `/snippets/toggle-group`                                     |
| Dependencies | `cn()` from `lib/utils`                                     |

---

## Usage

```tsx
import {
  ToggleButtonGroup,
  ToggleGroupButton,
} from "@/components/toggle-group/CompoundToggleGroup";
```

---

## Use Cases

### 1. Multi-select (default)
Multiple buttons can be toggled on/off independently.

```tsx
<ToggleButtonGroup title="Pick topics" onChange={(selected) => console.log(selected)}>
  <ToggleGroupButton value="react">React</ToggleGroupButton>
  <ToggleGroupButton value="ts">TypeScript</ToggleGroupButton>
  <ToggleGroupButton value="css">CSS</ToggleGroupButton>
</ToggleButtonGroup>
```

### 2. Single-select (radio-like)
Only one item selected at a time.

```tsx
<ToggleButtonGroup title="Choose plan" singleSelect>
  <ToggleGroupButton value="basic">Basic</ToggleGroupButton>
  <ToggleGroupButton value="pro">Pro</ToggleGroupButton>
  <ToggleGroupButton value="enterprise">Enterprise</ToggleGroupButton>
</ToggleButtonGroup>
```

### 3. Mandatory selection (cannot unselect last)
Ensures at least one item is always selected — works for both single and multi modes.

```tsx
<ToggleButtonGroup title="Sort by" singleSelect requireSelection>
  <ToggleGroupButton value="date">Date</ToggleGroupButton>
  <ToggleGroupButton value="name">Name</ToggleGroupButton>
  <ToggleGroupButton value="size">Size</ToggleGroupButton>
</ToggleButtonGroup>
```

### 4. Validation with error message
Show an error when user submits without selecting. Error auto-clears once user makes a selection.

```tsx
const [showError, setShowError] = useState(false);
const [selected, setSelected] = useState<string[]>([]);

function handleChange(values: string[]) {
  setSelected(values);
  if (values.length > 0) setShowError(false);
}

<ToggleButtonGroup
  title="Reason for contact"
  isMandatory
  errorMessage="Please select at least one reason."
  showError={showError}
  onChange={handleChange}
>
  <ToggleGroupButton value="support">Support</ToggleGroupButton>
  <ToggleGroupButton value="billing">Billing</ToggleGroupButton>
  <ToggleGroupButton value="other">Other</ToggleGroupButton>
</ToggleButtonGroup>

<Button onClick={() => setShowError(selected.length === 0)}>Submit</Button>
```

### 5. Disabled options
Disable specific items from the parent — no need to touch each button.

```tsx
<ToggleButtonGroup title="Available filters" disabledItems={["archived", "deleted"]}>
  <ToggleGroupButton value="active">Active</ToggleGroupButton>
  <ToggleGroupButton value="archived">Archived</ToggleGroupButton>
  <ToggleGroupButton value="deleted">Deleted</ToggleGroupButton>
</ToggleButtonGroup>
```

### 6. Per-button disabled
Disable a specific button directly via prop.

```tsx
<ToggleButtonGroup title="Notifications">
  <ToggleGroupButton value="email">Email</ToggleGroupButton>
  <ToggleGroupButton value="sms" disabled>SMS</ToggleGroupButton>
  <ToggleGroupButton value="push">Push</ToggleGroupButton>
</ToggleButtonGroup>
```

### 7. With icons

```tsx
import { SlidersHorizontal } from "lucide-react";

<ToggleButtonGroup title="View options">
  <ToggleGroupButton value="list" icon={SlidersHorizontal}>List</ToggleGroupButton>
  <ToggleGroupButton value="grid" icon={SlidersHorizontal}>Grid</ToggleGroupButton>
</ToggleButtonGroup>
```

## Accessibility

- `role="group"` + `aria-label` on the buttons wrapper — assistive technology knows the buttons are related
- `aria-pressed` on each button — screen readers announce selected/deselected state
- `role="alert"` on error message — announced immediately when it appears
- `disabled` attribute propagated correctly — skipped by screen readers
- **Gap**: no arrow key navigation between buttons. For keyboard-heavy or screen reader-critical UIs, swap internals with Radix `ToggleGroup.Item`.

### 8. Pre-selected values (uncontrolled)
Seed initial selection without owning the state.

```tsx
<ToggleButtonGroup title="Interests" defaultValue={["react", "ts"]}>
  <ToggleGroupButton value="react">React</ToggleGroupButton>
  <ToggleGroupButton value="ts">TypeScript</ToggleGroupButton>
  <ToggleGroupButton value="css">CSS</ToggleGroupButton>
</ToggleButtonGroup>
```

### 9. Controlled mode
Own the state externally — essential for forms, pre-population from API, or reset flows.

```tsx
const [selected, setSelected] = useState<string[]>(["pro"]);

<ToggleButtonGroup
  title="Choose plan"
  singleSelect
  value={selected}
  onChange={setSelected}
>
  <ToggleGroupButton value="basic">Basic</ToggleGroupButton>
  <ToggleGroupButton value="pro">Pro</ToggleGroupButton>
  <ToggleGroupButton value="enterprise">Enterprise</ToggleGroupButton>
</ToggleButtonGroup>
```

### `ToggleButtonGroup` Props

| Prop              | Type                        | Default | Description                                              |
|-------------------|-----------------------------|---------|----------------------------------------------------------|
| `children`        | `ReactNode`                 | —       | `ToggleGroupButton` elements                             |
| `title`           | `string`                    | —       | Label shown above the buttons                            |
| `isMandatory`     | `boolean`                   | —       | Shows a `*` next to the title                            |
| `errorMessage`    | `string`                    | —       | Error text to show when `showError` is true              |
| `showError`       | `boolean`                   | `false` | Controls whether the error message is visible            |
| `onChange`        | `(selected: string[]) => void` | —    | Called on every selection change with current selections |
| `singleSelect`    | `boolean`                   | `false` | Limits selection to one item at a time                   |
| `requireSelection`| `boolean`                   | `false` | Prevents deselecting the last selected item              |
| `disabledItems`   | `string[]`                  | `[]`    | Values to disable from the parent level                  |
| `defaultValue`    | `string[]`                  | `[]`    | Pre-selected values on mount (uncontrolled)              |
| `value`           | `string[]`                  | —       | Controlled selection — pair with `onChange`              |

### `ToggleGroupButton` Props

| Prop       | Type          | Default | Description                              |
|------------|---------------|---------|------------------------------------------|
| `value`    | `string`      | —       | Unique identifier for this option        |
| `children` | `ReactNode`   | —       | Label/content of the button              |
| `icon`     | `ElementType` | —       | Optional lucide (or any) icon component  |
| `disabled` | `boolean`     | —       | Disables this button individually        |

---

## Behaviour Notes

- **`singleSelect` + `requireSelection`**: Clicking the already-selected item does nothing — it stays selected. Perfect for radio-style groups where a value is always required.
- **`requireSelection` in multi-select**: If only one item remains selected, clicking it does nothing. All other items can still be toggled freely.
- **`disabledItems` vs `disabled` prop**: `disabledItems` is controlled from the parent and is ideal for dynamic data (e.g., availability from API). Per-button `disabled` is for static cases.
- **Error state**: The component does not self-manage `showError` — the parent owns that state. This keeps validation timing (on submit, on blur, etc.) fully in parent control.

---

## Design

- Pill-shaped buttons (`rounded-full`)
- Unselected: `bg-white` / `border-stone-200` / `text-stone-900`
- Selected: `bg-stone-800` / `text-stone-100`
- Selected hover: `bg-stone-700` — stays dark, subtle feedback
- Unselected hover: `bg-stone-50` / `border-stone-300`
- Disabled: `opacity-50 cursor-not-allowed`
- No animation or scale effects — intentional, instant feedback

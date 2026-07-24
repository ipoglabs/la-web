**Phone Number Input**

A concise phone number input with country dial selector, flags, and numeric-only input.

**Purpose**: Provide a compact phone-number field with a country picker. Useful for OTP flows and contact forms.

**Component**: [components/phone-number-input/PhoneNumberInput.tsx](components/phone-number-input/PhoneNumberInput.tsx)

**Props**
- **`value`**: string | undefined — Controlled digits-only value (no `+`, digits only).
- **`defaultValue`**: string | undefined — Uncontrolled initial digits value.
- **`onChange`**: (digits: string) => void — Called when digits change.
- **`country`**: `Country` | undefined — Controlled selected country object.
- **`defaultCountry`**: `Country | string` | undefined — Initial country (can pass ISO2 code string).
- **`onCountryChange`**: (c: Country) => void — Called when user selects a country.
- **`placeholder`**: string — Defaults to `Phone number`.
- **`disabled`**: boolean — Disable input.
- **`className`**: string — Wrapper className.
- **`inputRef`**: `React.Ref<HTMLInputElement>` — Pass ref to underlying input.
- **`maxLength`**: number — Limit for digits (default 24).
- **`showFlag`**: boolean — Whether to render flag in selector (default `true`).
- **`countries`**: `Country[]` — Override the full country list.
- **`onlyCountries`**: `string[]` — List of ISO2 codes to restrict the picker.

Additional props added/updated:
- **`id`**: string — `id` applied to the inner `<input>` for label association.
- **`label`**: string — Visible label text; when provided an SR-only `<label>` is rendered for accessibility.
- **`inputClassName`**: string — Class(es) applied specifically to the inner `<input>` so layout/styling can be decoupled from the wrapper.

Notes on `defaultCountry` and refs:
- `defaultCountry` accepts either a `Country` object or an ISO2 code string (e.g. `"sg"`).
- The component merges/forwards refs: it assigns both the forwarded `ref` and the `inputRef` prop to the inner input element.

**Behavior & Notes**
- Input stores digits-only values (non-digits stripped). Paste events are sanitized.
- Controlled vs uncontrolled: provide `value` to control; otherwise `defaultValue` and internal state are used.
- Country selection opens a dialog on desktop and a drawer on mobile (`CountryPicker` handles responsive UI).
- The dial code is shown as `+{dial}` in the selector button; the input itself holds only the local digits.

Defaults & styling
- `maxLength` defaults to `24` when not provided.
- The input uses an `inputMode="numeric"` + `pattern="[0-9]*"` to prefer numeric keyboards on mobile.
- Use `inputClassName` to pass focused/input-specific classes (the wrapper `className` positions the picker/button).

**Types & Data**
- `Country` type and canonical list: [components/phone-number-input/countries.tsx](components/phone-number-input/countries.tsx)
- Flag SVGs: [components/phone-number-input/flags.tsx](components/phone-number-input/flags.tsx)
- Country picker UI: [components/phone-number-input/CountryPicker.tsx](components/phone-number-input/CountryPicker.tsx)

**Usage Example**
```tsx
import PhoneNumberInput, { PhoneNumberInputProps } from "components/phone-number-input";
import * as React from "react";

function Example() {
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState();

  return (
    <PhoneNumberInput
      value={phone}
      onChange={setPhone}
      country={country}
      onCountryChange={setCountry}
      placeholder="Mobile number"
      id="mobile"
      label="Mobile number"
      inputClassName="px-3"
    />
  );
}
```

---

## Component states & UX

| State | Behaviour |
|-------|-----------|
| **Idle** | Shows placeholder or current digits; country button shows selected dial (`+{dial}`) and optional flag |
| **Focused** | Shows configured focus styles via `inputClassName` or built-in classes; `inputMode="numeric"` hints mobile keyboards |
| **Disabled** | Pass `disabled` — visual `opacity` + `cursor` styles apply |
| **Country Picker Open** | Clicking the country button opens `CountryPicker` — modal/dialog on desktop, bottom drawer on mobile; selecting a country updates the dial and calls `onCountryChange` |
| **Paste** | Content is sanitized to digits-only and truncated to `maxLength` |

---

## Validation & errors

The component does not render its own error UI. For form validation:
- Render an error message below the input, controlled by parent state
- Apply an error border via `inputClassName` (e.g. `border-rose-400 focus:ring-rose-300`)

---

## Formatting & E.164

`onChange` returns digits-only (local part — no dial prefix). If you need E.164 (`+{dial}{digits}`), compose it in the parent:

```ts
const e164 = `+${selectedCountry.dial}${digits}`;
```

---

**Accessibility**
- The country selector button has `aria-haspopup="dialog"` and `aria-label`.
- Input uses `inputMode="numeric"` and `pattern="[0-9]*"` for numeric keyboards on mobile.

**Related files**
- [components/phone-number-input/index.tsx](components/phone-number-input/index.tsx)
 - [components/phone-number-input/PhoneNumberInput.tsx](components/phone-number-input/PhoneNumberInput.tsx)
 - [components/phone-number-input/CountryPicker.tsx](components/phone-number-input/CountryPicker.tsx)
 - [components/phone-number-input/countries.tsx](components/phone-number-input/countries.tsx)
 - [components/phone-number-input/flags.tsx](components/phone-number-input/flags.tsx)

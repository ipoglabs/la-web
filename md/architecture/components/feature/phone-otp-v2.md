# Phone OTP v2

Variant of `PhoneOtpCard` that uses `PhoneNumberInput` (SVG flags + searchable country picker modal) instead of a native `<select>` for the country selector. All other flow logic is identical to v1.

> **Why v2 exists:** To compare picker UX side-by-side. Use v1 for lightweight/native feel; use v2 for a richer flag picker experience.

---

## Files

| File | Purpose |
|---|---|
| `components/phone-otp-v2/PhoneOtpCardV2.tsx` | Self-contained component |
| `app/phone-otp-v2/page.tsx` | Route page — wraps the card |

---

## Route

`/phone-otp-v2`

---

## Stages

```
enter-phone → verify-otp → summary
```

| Stage | Description |
|---|---|
| `enter-phone` | PhoneNumberInput with SVG flag picker, Send code button |
| `verify-otp` | 6-digit OTP input, resend timer, Change link |
| `summary` | List of verified numbers with inline delete, Add another, Done |

Supports up to **3 numbers** (Primary + Secondary 1 + Secondary 2).

---

## Key Constants (top of file)

```ts
const MAX_NUMBERS = 3;         // max verifiable numbers
const MIN_DIGITS  = 5;         // minimum phone digits required
const ALLOWED_COUNTRIES = ["SG", "IN", "GB"]; // countries in picker
```

To change the country list, edit `ALLOWED_COUNTRIES` — it is passed to `PhoneNumberInput` via `onlyCountries`.

Default country on load/reset: **Singapore (SG)**

---

## API Integration Points

```ts
// 1. handleSend — replace setStage with your send-OTP call
setStage("verify-otp");
// → replace with: await api.sendOtp({ dial: country.dial, phone });

// 2. handleOtpComplete — replace setTimeout with your verify-OTP call
setTimeout(() => { ... }, 700);
// → replace with: await api.verifyOtp({ dial, phone, otp });
```

---

## v1 vs v2 Comparison

| | v1 (`/phone-otp`) | v2 (`/phone-otp-v2`) |
|---|---|---|
| Country selector | Native `<select>` (invisible overlay) | SVG flag button → searchable modal |
| Flag display | Emoji string (🇸🇬) | Inline SVG React component |
| Country source | `lib/data/countries.ts` (13 markets) | `phone-number-input/countries.tsx` (50+) |
| Filtered to | All 13 supported markets | `ALLOWED_COUNTRIES` (SG, IN, GB) |
| Validation | Per-country `minLen` from data | Generic ≥ 5 digits (`MIN_DIGITS`) |
| Enter key submit | `onKeyDown` on `<Input>` | `useEffect` listener via `inputRef` |
| Flag in summary | Emoji | SVG `<Flag />` component |

---

## Dependencies

| Import | From |
|---|---|
| `PhoneNumberInput` | `@/components/phone-number-input/PhoneNumberInput` |
| `Country`, `COUNTRIES` | `@/components/phone-number-input/countries` |
| `OtpInput` | `@/components/ui/otp-input` |
| `useResendTimer` | `@/lib/hooks/useResendTimer` |
| `VALID_OTP` | `@/lib/constants` (demo: `123456`) |

---

## Usage

```tsx
import { PhoneOtpCardV2 } from "@/components/phone-otp-v2/PhoneOtpCardV2";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <PhoneOtpCardV2 />
    </main>
  );
}
```

No props required — fully self-contained.

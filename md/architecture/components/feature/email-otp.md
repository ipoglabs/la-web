# Email OTP — Component Documentation

## Overview

A single-card email address verification flow. One email, no country picker, clean 3-stage card. Everything happens inside one card that morphs between three stages.

**Philosophy:** Mirrors phone-otp conventions exactly — same patterns, same hooks, same OTP widget. A developer familiar with one immediately understands the other.

---

## At a Glance

| Attribute        | Value                                       |
|------------------|---------------------------------------------|
| Component        | `EmailOtpCard`                              |
| Location         | `components/email-otp/EmailOtpCard.tsx`     |
| Type             | Client Component (`"use client"`)           |
| Max emails       | 1                                           |
| Stages           | `enter-email` → `verify-otp` → `verified`  |
| Demo OTP         | `123456` (from `lib/constants.ts`)          |
| Prop             | `maskMode?: EmailMaskMode` (default `"full"`) |

---

## Usage

```tsx
// Default — full email shown (Option C)
<EmailOtpCard />

// Option A — j***@gmail.com
<EmailOtpCard maskMode="local-first" />

// Option B — jo***ne@gmail.com
<EmailOtpCard maskMode="partial" />
```

Drop into any page — no other props or wiring needed.

---

## Stage Flow

```
┌─────────────────────────────────────────────────────┐
│                   enter-email                       │
│        ✉  [ you@example.com              ]          │
│                 [ Send code ]                       │
└──────────────────────┬──────────────────────────────┘
                       │ handleSend() — validates format + trims
                       ▼
┌─────────────────────────────────────────────────────┐
│                   verify-otp                        │
│   Sent to johndoe@gmail.com · Change                │
│        [ • ][ • ][ • ][ • ][ • ][ • ]              │
│        Didn't receive it? Resend in 28s             │
└──────────────────────┬──────────────────────────────┘
                       │ 6th digit entered → auto-submit
                       │ 700ms verifying shimmer
                       ▼
┌─────────────────────────────────────────────────────┐
│                    verified                         │
│   ✓  Email verified                                 │
│      johndoe@gmail.com                              │
│                  [   Done   ]                       │
└─────────────────────────────────────────────────────┘
```

"Done" resets the entire flow back to `enter-email`.

---

## File Map

```
components/
  email-otp/
    EmailOtpCard.tsx              ← orchestrator (all stages)
  ui/
    otp-input.tsx                 ← 6-digit OTP widget (shared with phone-otp)

lib/
  hooks/
    useResendTimer.ts             ← 30s countdown hook (shared with phone-otp)
  constants.ts                    ← VALID_OTP demo value
  utils.ts                        ← cn(), maskEmail(), EmailMaskMode type
```

---

## Props

| Prop       | Type            | Default  | Description                              |
|------------|-----------------|----------|------------------------------------------|
| `maskMode` | `EmailMaskMode` | `"full"` | How the email is displayed in verify + verified stages |

### `EmailMaskMode` — defined in `lib/utils.ts`

| Value          | Label    | Example output          | When to use                        |
|----------------|----------|-------------------------|------------------------------------|
| `"full"`       | Option C | `johndoe@gmail.com`     | Default — no masking, most readable |
| `"local-first"`| Option A | `j***@gmail.com`        | Light masking — hides most of local part |
| `"partial"`    | Option B | `jo***ne@gmail.com`     | Shows first 2 + last 1 of local part |

> **Default is `"full"` (Option C).** Change the prop to switch mode — no other code changes needed.

---

## Component: `EmailOtpCard`

### State

| State variable | Type      | Purpose                                         |
|----------------|-----------|-------------------------------------------------|
| `stage`        | `Stage`   | Current stage of the flow                       |
| `email`        | `string`  | Verified-trimmed email address                  |
| `emailError`   | `string`  | Inline error under email input                  |
| `otpError`     | `boolean` | Triggers shake animation on OTP input           |
| `otpErrorMsg`  | `string`  | Error text shown below OTP input                |
| `verifying`    | `boolean` | `true` during the 700ms fake API delay          |

### Types

```ts
type Stage = "enter-email" | "verify-otp" | "verified";
```

### Validation

```ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

Checks: non-empty, contains `@`, has a domain with a `.`. Intentionally simple — avoids false negatives on valid but unusual addresses. Real validation happens server-side when the email is actually delivered to.

### Key Handlers

#### `handleSend()`
- Trims and persists the email back to state (normalises stray whitespace)
- Validates against `EMAIL_REGEX`
- Sets `emailError` on failure
- Transitions to `"verify-otp"` on success
- **API point 1:** call send-OTP endpoint here

#### `handleOtpComplete(otp: string)`
- Called automatically when the 6th digit is typed
- Sets `verifying = true` → 700ms `setTimeout`
- On match with `VALID_OTP`: transitions to `"verified"`
- On mismatch: sets `otpError = true` + `otpErrorMsg`
- **API point 2:** call verify-OTP endpoint here

#### `handleChangeEmail()`
- Clears OTP error state
- **Resets the resend timer** (so the next send always starts fresh at 30s)
- Returns to `"enter-email"` — preserves the email value so user can edit, not retype

#### `handleReset()`
- Clears everything — email, all errors, resend timer
- Returns to `"enter-email"` for a completely fresh flow
- Triggered by the "Done" button on the verified screen

---

## API Integration

### Two integration points, clearly marked with `// TODO: [API]`

#### 1. Send OTP — inside `handleSend()`

Replace:
```ts
setStage("verify-otp");
```
With:
```ts
await api.sendEmailOtp({ email });
setStage("verify-otp");
```

#### 2. Verify OTP — inside `handleOtpComplete()`

Replace the entire `setTimeout` block:
```ts
setVerifying(true);
try {
  await api.verifyEmailOtp({ email, otp });
  setStage("verified");
} catch {
  setOtpError(true);
  setOtpErrorMsg("Incorrect code. Try again.");
} finally {
  setVerifying(false);
}
```

The `setVerifying(true/false)` wrapper stays — it drives the disabled state on the OTP input and the "Verifying…" text below it.

---

## Email Masking — `maskEmail()` in `lib/utils.ts`

```ts
maskEmail("johndoe@gmail.com", "full")         // → "johndoe@gmail.com"
maskEmail("johndoe@gmail.com", "local-first")  // → "j***@gmail.com"
maskEmail("johndoe@gmail.com", "partial")      // → "jo***ne@gmail.com"
```

**Edge cases handled:**
- No `@` in string → returns email unchanged
- `local-first` on very short local part → falls back gracefully
- `partial` on local part ≤ 3 chars → degrades to `local-first` behaviour

Masking applies in two places:
1. The "Sent to ___" line in `verify-otp` stage
2. The confirmed email on the `verified` screen

The input itself is always shown unmasked — user must see what they're typing.

---

## UX Decisions Log

| Decision                            | Rationale                                                                  |
|-------------------------------------|----------------------------------------------------------------------------|
| `maskMode` prop, default `"full"`   | PO/designer can choose — no change to component internals                  |
| Auto-submit OTP on 6th digit        | Consistent with phone-otp — eliminates one tap                         |
| 700ms verifying delay               | Avoids jarring instant transitions — same as phone-otp                  |
| `handleChangeEmail` preserves email | User can edit spelling — not forced to retype the whole address            |
| `reset()` called in `handleChangeEmail` | Fresh 30s timer on every new send — stale timer on re-send would confuse |
| `setEmail(trimmed)` in `handleSend` | Persists clean value — API, masking, and verified screen all use same string |
| Mail icon inside input (left)       | Visually signals email field type at a glance                              |
| Error border on input + ring        | Double signal — border colour + focus ring both go destructive on error    |
| Single email only, no add/delete    | Simpler than phone-otp by design — email verification is a one-time act |

---

## Demo Mode

The OTP hint is shown at the bottom of the verify-otp stage:

```
Demo OTP: 123456
```

**To remove for production:**
1. Delete the demo hint `<p>` in `EmailOtpCard.tsx` (verify-otp stage, last element before closing `</>`)
2. Replace the `setTimeout` block in `handleOtpComplete` with a real API call (see API Integration above)
3. Delete `VALID_OTP` from `lib/constants.ts` and its import if no longer used elsewhere

---

## Comparison with Phone OTP v2

| Feature              | Phone OTP v2           | Email OTP              |
|----------------------|------------------------|------------------------|
| Country select       | ✅ Native overlay       | ❌ Not needed           |
| Max entries          | 3 (Primary + 2 backup) | 1                      |
| Input validation     | Digit length           | Email regex            |
| Display masking      | ❌ Not applicable       | ✅ 3 modes via prop     |
| Delete verified      | ✅ Bin icon + confirm   | ❌ Not needed           |
| Resend timer         | ✅ 30s shared hook      | ✅ 30s shared hook      |
| OTP widget           | ✅ `OtpInput` (shared)  | ✅ `OtpInput` (shared)  |
| TODO: [API] markers  | ✅ 2 points             | ✅ 2 points             |

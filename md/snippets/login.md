# Login Snippet

Two-step login form with email/phone identifier, password, Google OAuth stub, shake error animation, and a full-viewport marketplace background.

---

## File

`app/design-system/login/page.tsx`

---

## Flow

```
Step 1 — Identifier
  ├── User selects: Email | Phone
  ├── Enters value → "Continue"
  ├── Validation inline (on blur + on submit attempt)
  └── OR: "Continue with Google"

Step 2 — Password
  ├── Shows "Enter your password for [identifier]" pill
  ├── Password input with show/hide toggle
  ├── "Forgot password?" link (top-right of field)
  ├── "Sign in" → calls mockAuthenticate()
  │     ├── success → toast + router.push("/")
  │     └── fail    → shake animation + inline error
  └── "← Use a different email/phone" → back to Step 1
```

---

## Demo Credentials

| Field | Value |
|---|---|
| Email | any valid email (e.g. `you@example.com`) |
| Phone | any valid format for selected country |
| Password | `123456` → success · anything else → error |

A visible hint is shown below the card (remove in production).

---

## Integration Points

All integration points are clearly marked with comments in the file. Summary:

### 1. Authentication API
Replace the `mockAuthenticate()` function at the top of the file:

```ts
// BEFORE (mock):
async function mockAuthenticate(identifier, password) {
  await new Promise(r => setTimeout(r, 1200));
  if (password === "123456") return { ok: true };
  return { ok: false, error: "Incorrect password." };
}

// AFTER (real):
async function authenticate(identifier: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return { ok: res.ok, error: data.error };
}
```

The `identifier` is either a plain email string or a phone number. Format as E.164 (`+66812345678`) on your backend if needed.

### 2. Post-login redirect
In `handleSignIn()`, replace:
```ts
router.push("/");  // ← change to your authenticated route
// e.g. router.push("/dashboard");
```

### 3. Google OAuth
Replace `mockGoogleLogin()` with:
```ts
import { signIn } from "next-auth/react";
signIn("google", { callbackUrl: "/dashboard" });
```

### 4. Navigation links
Two `<a href="#">` placeholders — replace with Next.js `<Link>`:
```tsx
// Sign up
<Link href="/signup">Sign up</Link>

// Forgot password
<Link href="/forgot-password">Forgot password?</Link>
```

### 5. Background image
`public/bg-market-place-vintage.png` — swap for any full-bleed image:
```tsx
// In LoginSnippet:
className="... bg-[url('/your-image.png')] bg-cover bg-center"
```

---

## State Architecture

```
method            "email" | "phone"     — selected login method
email / phone     string                — identifier values
country           Country               — selected country (phone mode only)
identifierTouched boolean               — triggers inline validation on step 1
step              "identifier"|"password" — which step is rendered
password          string
passwordVisible   boolean               — show/hide toggle
passwordTouched   boolean
loading           boolean               — sign-in loading skeleton
googleLoading     boolean               — google button loading state
loginError        string                — server-returned error message
shake             boolean               — triggers animate-shake + red ring
```

---

## Validation

Sourced from `lib/validation.ts`:

| Helper | Rule |
|---|---|
| `isValidEmail(value)` | RFC-like regex: `[\w-.]+@[\w-]+\.[A-Za-z]{2,}` |
| `isValidPhone(value, minLen)` | Strips non-digits, checks `>= minLen` (default 6) |

Errors appear on blur or on submit attempt — never eagerly on first keystroke.

---

## Components Used

| Component | Source |
|---|---|
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` | `components/ui/card.tsx` |
| `Field`, `FieldLabel`, `FieldDescription` | `components/ui/field.tsx` |
| `Input` | `components/ui/input.tsx` |
| `Button` | `components/ui/button.tsx` |
| `RadioGroup`, `RadioGroupItem` | `components/ui/radio-group.tsx` |
| `PhoneNumberInput` | `components/phone-number-input` |
| `IconEye`, `IconEyeOff` | `components/icons/inline.tsx` |
| `useToast` | (removed) |

---

## UX Details

- **Shake animation** — `animate-shake` keyframe + `ring-2 ring-red-400` on the card on failed sign-in
- **Native password eye hidden** — `[&::-ms-reveal]:hidden` + `[&::-webkit-credentials-auto-fill-button]:hidden` on `Input` to suppress browser-native reveal button clashing with custom toggle
- **Identifier pill** — on step 2 the user's email/phone is shown in a `bg-slate-100 h-10 rounded-md` pill matching the input height, so they can confirm they're signing into the right account before entering a password
- **autoFocus** — password field auto-focuses when step 2 renders
- **Password autofill** — `autoComplete="current-password"` enables browser autofill correctly
- **Loading skeleton** — 4-row animated pulse replaces the form during the sign-in API call

---

## Production Checklist

- [ ] Replace `mockAuthenticate()` with real API call
- [ ] Replace `mockGoogleLogin()` with `signIn("google")`
- [ ] Update `router.push("/")` to correct post-login route
- [ ] Replace `<a href="#">` links with `<Link>` for Sign up + Forgot password
- [ ] Remove the demo hint `<p>` at the bottom of `LoginForm`
- [ ] Consider adding rate-limiting feedback (too many attempts)

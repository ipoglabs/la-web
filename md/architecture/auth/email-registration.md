# Flow 1 — Registration via Email + OTP

> User creates a new LokalAds account using email and password.  
> Email is verified via a 6-digit OTP before the account is activated.

**Routes involved:** `/register` → `/register/create` → `/register/verify` → `/register/success` → `/register/next`

---

## Happy Path

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Next.js
    participant DB
    participant Email

    User->>Browser: Visit /register
    Browser->>User: Join screen — Google / Apple / Email options

    User->>Browser: Click "Continue with Email"
    Browser->>User: /register/create — Full Name, Email, Password, DOB, Terms

    User->>Browser: Submit form (all fields valid, age ≥ 18, terms checked)
    Browser->>Next.js: POST /api/auth/register
    Note right of Browser: { fullName, email, password, dob, marketingConsent }

    Next.js->>Next.js: Validate input (schema + age gate)
    Next.js->>DB: SELECT user WHERE email = ?
    DB-->>Next.js: Not found

    Next.js->>Next.js: Hash password (bcrypt, cost 12)
    Next.js->>DB: INSERT user { status: "unverified", ... }
    Next.js->>Next.js: Generate 6-digit OTP, hash it, set 15min expiry
    Next.js->>DB: INSERT otp_tokens { hash, expiry, email }
    Next.js->>Email: Send OTP email to user
    Email-->>User: Email — "Your LokalAds code is 123456"

    Next.js-->>Browser: 200 { message: "OTP sent" }
    Browser->>User: Redirect /register/verify?email=xxx

    User->>Browser: Enter 6-digit code from email
    Browser->>Next.js: POST /api/auth/verify-email-otp
    Note right of Browser: { email, otp }

    Next.js->>DB: SELECT otp_token WHERE email = ? AND NOT expired AND NOT used
    Next.js->>Next.js: Compare OTP hash
    DB-->>Next.js: Valid match

    Next.js->>DB: UPDATE user SET status = "active"
    Next.js->>DB: UPDATE otp_token SET used = true
    Next.js->>Next.js: Create session token (JWT / Iron Session)
    Next.js-->>Browser: 200 + Set-Cookie: session (HttpOnly, Secure)

    Browser->>User: Redirect /register/success
    Browser->>User: Redirect /register/next — First Goal screen
    User->>Browser: Pick goal → navigate to product
```

---

## Unhappy Paths

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Next.js
    participant DB

    Note over User,DB: Scenario A — Email already registered

    User->>Browser: Submit /register/create
    Browser->>Next.js: POST /api/auth/register { email: existing@email.com, ... }
    Next.js->>DB: SELECT user WHERE email = ?
    DB-->>Next.js: User found (status: active)
    Next.js-->>Browser: 409 { error: "EMAIL_EXISTS" }
    Browser->>User: Inline error on email field — "Already registered. Sign in?"

    Note over User,DB: Scenario B — Under 18

    User->>Browser: Submit form with DOB = 2010-05-01
    Browser->>Next.js: POST /api/auth/register { dob: "2010-05-01", ... }
    Next.js->>Next.js: age = today - dob = 15 years → FAIL
    Next.js-->>Browser: 400 { error: "AGE_REQUIREMENT", field: "dob" }
    Browser->>User: Inline error on DOB — "Must be at least 18 years old"

    Note over User,DB: Scenario C — Wrong OTP

    User->>Browser: Enter wrong 6-digit code
    Browser->>Next.js: POST /api/auth/verify-email-otp { otp: "999999" }
    Next.js->>DB: Compare hash → no match
    Next.js-->>Browser: 401 { error: "INVALID_OTP", attemptsLeft: 2 }
    Browser->>User: Error — "Incorrect code. 2 attempts remaining."

    Note over User,DB: Scenario D — OTP expired

    User->>Browser: Enter code after 15 minutes
    Browser->>Next.js: POST /api/auth/verify-email-otp
    Next.js->>DB: SELECT otp WHERE email = ? → found but expired
    Next.js-->>Browser: 410 { error: "OTP_EXPIRED" }
    Browser->>User: Error — "Code expired. Request a new one."

    Note over User,DB: Scenario E — Resend OTP

    User->>Browser: Click "Resend Code"
    Browser->>Next.js: POST /api/auth/send-email-otp { email }
    Next.js->>DB: Invalidate previous OTP tokens for this email
    Next.js->>Next.js: Generate new OTP, hash, store
    Next.js->>Email: Resend OTP email
    Next.js-->>Browser: 200 { message: "OTP resent" }
    Browser->>User: "Code resent — check your email"
```

---

## API Reference

### `POST /api/auth/register`

**Request:**
```ts
{
  fullName:          string   // 2–100 chars, required
  email:             string   // valid email format, required
  password:          string   // min 8 chars, uppercase, number, special char
  dob:               string   // ISO date "YYYY-MM-DD", must be ≥ 18 years ago
  marketingConsent:  boolean  // optional, default false
}
```

**Responses:**
```ts
201  { message: "OTP sent" }
400  { error: "VALIDATION_ERROR", fields: { ... } }
400  { error: "AGE_REQUIREMENT", field: "dob" }
409  { error: "EMAIL_EXISTS" }
429  { error: "RATE_LIMITED", retryAfter: 900 }
500  { error: "SERVER_ERROR" }
```

---

### `POST /api/auth/send-email-otp`

**Request:**
```ts
{ email: string }
```

**Responses:**
```ts
200  { message: "OTP sent" }
404  { error: "USER_NOT_FOUND" }
429  { error: "RATE_LIMITED", retryAfter: 60 }
```

---

### `POST /api/auth/verify-email-otp`

**Request:**
```ts
{
  email: string
  otp:   string   // 6 digits
}
```

**Responses:**
```ts
200  { message: "Verified" }   + Set-Cookie: session
401  { error: "INVALID_OTP", attemptsLeft: number }
410  { error: "OTP_EXPIRED" }
429  { error: "RATE_LIMITED" }
```

---

## Security Requirements

| Requirement | Detail |
|---|---|
| Password hashing | bcrypt, cost factor 12 — never store plain text |
| OTP storage | Store SHA-256 hash only — raw OTP sent to email, never stored |
| OTP expiry | 15 minutes from generation |
| OTP attempts | Max 3 wrong attempts → invalidate token, force resend |
| Rate limiting | `/register` — 5 req / 15 min per IP · `/send-email-otp` — 3 req / 60s per email |
| Age gate | Validated **server-side** — client check is UX only, not security |
| Session cookie | HttpOnly, Secure, SameSite=Lax, 30 day expiry |

---

## UI Components

| Route | Component | File |
|---|---|---|
| `/register` | `JoinStep` | `app/(auth)/register/JoinStep.tsx` |
| `/register/create` | `CreateAccountStep` | `app/(auth)/register/create/CreateAccountStep.tsx` |
| `/register/verify` | `VerifyEmailStep` | `app/(auth)/register/verify/VerifyEmailStep.tsx` |
| `/register/success` | `AccountCreatedStep` | `app/(auth)/register/success/AccountCreatedStep.tsx` |
| `/register/next` | `FirstGoalStep` | `app/(auth)/register/next/FirstGoalStep.tsx` |

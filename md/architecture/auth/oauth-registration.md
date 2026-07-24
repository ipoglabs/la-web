# Flow 2 — Registration via Google / Apple OAuth

> New user creates a LokalAds account by signing in with Google or Apple.  
> OAuth provides name + email — DOB and terms must be collected separately.

**Routes involved:** `/register` → OAuth provider → `/register/complete` → `/register/success` → `/register/next`

---

## Happy Path

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Next.js
    participant OAuth as Google / Apple
    participant DB

    User->>Browser: Visit /register
    User->>Browser: Click "Continue with Google"

    Browser->>OAuth: Redirect → Google OAuth consent screen
    User->>OAuth: Grant permission (name, email, profile)
    OAuth-->>Browser: Redirect → /api/auth/callback/google?code=xxx

    Browser->>Next.js: GET /api/auth/callback/google?code=xxx
    Next.js->>OAuth: Exchange code for ID token
    OAuth-->>Next.js: { name, email, picture, email_verified: true }

    Next.js->>DB: SELECT user WHERE email = ?
    DB-->>Next.js: Not found (new user)

    Next.js->>DB: INSERT user { name, email, picture, status: "pending-profile", provider: "google" }
    Next.js->>Next.js: Create partial session (no full access yet)
    Next.js-->>Browser: Redirect /register/complete

    Browser->>User: /register/complete — DOB + Terms (only missing fields)
    User->>Browser: Submit DOB + accept Terms & Conditions

    Browser->>Next.js: POST /api/auth/complete-profile
    Note right of Browser: { dob, termsAccepted: true }

    Next.js->>Next.js: Server-side age gate (dob ≥ 18 years)
    Next.js->>DB: UPDATE user SET dob, termsAccepted, status = "active"
    Next.js->>Next.js: Upgrade to full session token
    Next.js-->>Browser: 200 + Set-Cookie: session (HttpOnly, Secure)

    Browser->>User: Redirect /register/success
    Browser->>User: Redirect /register/next — First Goal screen
```

---

## Unhappy Paths

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Next.js
    participant OAuth as Google / Apple
    participant DB

    Note over User,DB: Scenario A — User cancels OAuth consent

    User->>OAuth: Cancels Google permission screen
    OAuth-->>Browser: Redirect /api/auth/callback/google?error=access_denied
    Browser->>Next.js: GET /api/auth/callback/google?error=access_denied
    Next.js-->>Browser: Redirect /register?error=oauth_cancelled
    Browser->>User: Join screen — toast "Sign-in cancelled"

    Note over User,DB: Scenario B — Email already registered (email path)

    Next.js->>DB: SELECT user WHERE email = ?
    DB-->>Next.js: Found — status: "active", provider: "email"
    Next.js-->>Browser: Redirect /login?hint=email&email=xxx
    Browser->>User: Login screen — "Account exists. Sign in instead."

    Note over User,DB: Scenario C — Under 18 at complete-profile step

    User->>Browser: Submit DOB = 2010-05-01
    Browser->>Next.js: POST /api/auth/complete-profile { dob: "2010-05-01" }
    Next.js->>Next.js: age = 15 years → FAIL
    Next.js-->>Browser: 400 { error: "AGE_REQUIREMENT" }
    Browser->>User: Inline error — "Must be at least 18 years old"

    Note over User,DB: Scenario D — Apple name not returned (subsequent logins)

    Note right of OAuth: Apple returns name ONLY on first authorisation
    OAuth-->>Next.js: { email } — no name field
    Next.js->>DB: Check stored name from first auth
    Note right of Next.js: Use stored name — do not prompt again
```

---

## Apple-Specific Notes

> ⚠️ **Critical:** Apple returns the user's `name` **only on the very first authorisation**.  
> On every subsequent login, the name field is absent from the token.

**You must store the name immediately** on first callback — before responding to the browser.

```ts
// In /api/auth/callback/apple
const { email, name } = appleToken; // name only present on first auth

await db.upsertUser({
  email,
  name: name ?? existingUser?.name, // fall back to stored name
  provider: "apple",
});
```

---

## API Reference

### `GET /api/auth/callback/google`
### `GET /api/auth/callback/apple`

**Query params:** `code` (auth code from provider) or `error` (if user cancelled)

**Logic:**
1. Exchange `code` for ID token with provider
2. Verify token signature
3. Extract `{ name, email, email_verified, picture }`
4. Upsert user in DB
5. Redirect to `/register/complete` (new) or `/` (existing)

---

### `POST /api/auth/complete-profile`

**Request:**
```ts
{
  dob:               string   // ISO date "YYYY-MM-DD", must be ≥ 18 years ago
  termsAccepted:     boolean  // must be true
  marketingConsent?: boolean  // optional
}
```

**Responses:**
```ts
200  { message: "Profile complete" }   + Set-Cookie: session (upgrade to full)
400  { error: "AGE_REQUIREMENT", field: "dob" }
400  { error: "TERMS_REQUIRED" }
401  { error: "NO_PARTIAL_SESSION" }   // tampered or expired partial session
```

---

## Security Requirements

| Requirement | Detail |
|---|---|
| OAuth state param | Generate + verify `state` param on every OAuth flow — prevents CSRF |
| Token verification | Always verify ID token signature with provider's public key |
| Email verified check | Only accept `email_verified: true` from Google |
| Partial session | Partial session grants access to `/register/complete` only — not product routes |
| Age gate | Server-side validation in `complete-profile` — client check is UX only |
| Apple name storage | Store name immediately on first callback — never retrievable again from Apple |

---



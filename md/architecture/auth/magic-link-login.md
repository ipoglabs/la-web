# Flow 4 — Login via Magic Link

> Passwordless login — user enters their email and receives a one-click sign-in link.  
> No password required. Link expires after 15 minutes and can only be used once.

**Routes involved:** `/login` → `/login/check-email` → `/api/auth/verify-magic` → `/`

---

## Happy Path

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Next.js
    participant DB
    participant Email

    User->>Browser: Visit /login
    Browser->>User: Login screen — Magic Link option visible

    User->>Browser: Enter email + click "Send magic link"
    Browser->>Next.js: POST /api/auth/magic-link { email }

    Next.js->>DB: SELECT user WHERE email = ? AND status = "active"
    DB-->>Next.js: User found

    Next.js->>Next.js: Generate cryptographically random token (32 bytes)
    Next.js->>Next.js: Hash token (SHA-256) — store hash, not raw token
    Next.js->>DB: INSERT magic_link_tokens { emailHash, tokenHash, expiry: +15min, used: false }
    Next.js->>Email: Send magic link email → /api/auth/verify-magic?token=RAW_TOKEN
    Email-->>User: Email — "Click here to sign in to LokalAds"

    Next.js-->>Browser: 200 { message: "Link sent" }
    Browser->>User: /login/check-email — "Check your email for the sign-in link"

    User->>Email: Open email, click magic link button
    Email->>Browser: GET /api/auth/verify-magic?token=RAW_TOKEN

    Browser->>Next.js: GET /api/auth/verify-magic?token=RAW_TOKEN
    Next.js->>Next.js: Hash the incoming token (SHA-256)
    Next.js->>DB: SELECT token WHERE hash = ? AND NOT expired AND NOT used
    DB-->>Next.js: Valid match found

    Next.js->>DB: UPDATE token SET used = true
    Next.js->>DB: UPDATE user SET lastLoginAt = now()
    Next.js->>Next.js: Create session token
    Next.js-->>Browser: Set-Cookie: session + Redirect /
    Browser->>User: Logged in — lands on home (or redirect param destination)
```

---

## Unhappy Paths

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Next.js
    participant DB

    Note over User,DB: Scenario A — Email not registered

    Browser->>Next.js: POST /api/auth/magic-link { email: unknown@email.com }
    Next.js->>DB: SELECT user WHERE email = ?
    DB-->>Next.js: Not found

    Note right of Next.js: Do NOT reveal whether email exists (security)
    Next.js-->>Browser: 200 { message: "If this email is registered, a link has been sent" }
    Browser->>User: Same "check your email" screen — no indication of failure

    Note over User,DB: Scenario B — Link expired (> 15 minutes)

    User->>Browser: Click magic link after 15 minutes
    Browser->>Next.js: GET /api/auth/verify-magic?token=xxx
    Next.js->>DB: SELECT token WHERE hash = ? → found but expiry < now()
    Next.js-->>Browser: Redirect /login?error=link_expired
    Browser->>User: "This link has expired. Request a new one."

    Note over User,DB: Scenario C — Link already used

    User->>Browser: Click same magic link a second time
    Browser->>Next.js: GET /api/auth/verify-magic?token=xxx
    Next.js->>DB: SELECT token WHERE hash = ? → found but used = true
    Next.js-->>Browser: Redirect /login?error=link_used
    Browser->>User: "This link has already been used. Request a new one."

    Note over User,DB: Scenario D — Tampered token

    Browser->>Next.js: GET /api/auth/verify-magic?token=TAMPERED
    Next.js->>Next.js: Hash incoming token
    Next.js->>DB: SELECT token WHERE hash = ? → not found
    Next.js-->>Browser: Redirect /login?error=link_invalid
    Browser->>User: "Invalid sign-in link."

    Note over User,DB: Scenario E — Rate limit hit

    Browser->>Next.js: POST /api/auth/magic-link (6th request in 15 min)
    Next.js-->>Browser: 429 { error: "RATE_LIMITED", retryAfter: 900 }
    Browser->>User: "Too many requests. Try again in 15 minutes."
```

---

## API Reference

### `POST /api/auth/magic-link`

**Request:**
```ts
{ email: string }
```

**Responses:**
```ts
200  { message: "If this email is registered, a link has been sent" }
// Always 200 — never reveal if email exists or not
429  { error: "RATE_LIMITED", retryAfter: 900 }
500  { error: "SERVER_ERROR" }
```

---

### `GET /api/auth/verify-magic`

**Query params:** `token` — raw token from email link

**Logic:**
1. Hash incoming token with SHA-256
2. Look up hash in DB
3. Check: not expired, not already used
4. Mark token as used
5. Create session + redirect

**Responses:**
```
302  Redirect /               (success — session cookie set)
302  Redirect /login?error=link_expired
302  Redirect /login?error=link_used
302  Redirect /login?error=link_invalid
```

---

## Security Requirements

| Requirement | Detail |
|---|---|
| Token generation | `crypto.randomBytes(32)` — cryptographically random, not predictable |
| Token storage | Store SHA-256 hash only — raw token sent in email, never in DB |
| Token expiry | 15 minutes from generation |
| Single use | Mark `used = true` immediately on first valid use |
| Email enumeration | Always return 200 even if email not found — never reveal registration status |
| Rate limiting | Max 3 magic link requests / 15 min per email address |
| Redirect validation | After login, only allow internal paths — never redirect to external URLs |

---

## Token Generation (reference implementation)

```ts
import crypto from "crypto";

// Generate raw token
const rawToken = crypto.randomBytes(32).toString("hex"); // 64 char hex string

// Hash for storage
const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

// Store hash in DB
await db.magicLinkTokens.create({
  tokenHash,
  email,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
  used: false,
});

// Send raw token in email URL
const magicLink = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify-magic?token=${rawToken}`;
```

---



# Flow 3 — Login via Google / Apple OAuth

> Returning user signs in to their existing LokalAds account using Google or Apple.  
> No password needed — identity is verified by the OAuth provider.

**Routes involved:** `/login` → OAuth provider → `/api/auth/callback/*` → `/`

---

## Happy Path

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Next.js
    participant OAuth as Google / Apple
    participant DB

    User->>Browser: Visit /login
    Browser->>User: Login screen — Google / Apple / Magic Link / Email options

    User->>Browser: Click "Continue with Google"
    Browser->>OAuth: Redirect → Google OAuth consent screen
    User->>OAuth: Grant permission
    OAuth-->>Browser: Redirect → /api/auth/callback/google?code=xxx

    Browser->>Next.js: GET /api/auth/callback/google?code=xxx
    Next.js->>OAuth: Exchange code for ID token
    OAuth-->>Next.js: { email, email_verified: true }

    Next.js->>DB: SELECT user WHERE email = ? AND status = "active"
    DB-->>Next.js: User found

    Next.js->>DB: UPDATE user SET lastLoginAt = now()
    Next.js->>Next.js: Create session token
    Next.js-->>Browser: 200 + Set-Cookie: session (HttpOnly, Secure)

    Browser->>User: Redirect to intended page (or /)
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

    Note over User,DB: Scenario A — No account found

    Next.js->>DB: SELECT user WHERE email = ?
    DB-->>Next.js: Not found
    Next.js-->>Browser: Redirect /register?hint=email&email=xxx
    Browser->>User: Join screen — "No account found. Create one?"

    Note over User,DB: Scenario B — Account exists but was created with email/password

    Next.js->>DB: SELECT user WHERE email = ?
    DB-->>Next.js: Found — provider: "email"
    Next.js-->>Browser: Redirect /login?error=wrong_provider&hint=email
    Browser->>User: "This account uses email + password. Sign in that way."

    Note over User,DB: Scenario C — Account suspended / banned

    Next.js->>DB: SELECT user WHERE email = ?
    DB-->>Next.js: Found — status: "suspended"
    Next.js-->>Browser: Redirect /login?error=account_suspended
    Browser->>User: Error — "Your account has been suspended. Contact support."

    Note over User,DB: Scenario D — User cancels OAuth

    User->>OAuth: Cancels consent screen
    OAuth-->>Browser: Redirect /api/auth/callback/google?error=access_denied
    Next.js-->>Browser: Redirect /login?error=oauth_cancelled
    Browser->>User: Login screen — toast "Sign-in cancelled"
```

---

## API Reference

### `GET /api/auth/callback/google`
### `GET /api/auth/callback/apple`

**Logic:**
1. Verify `state` param (CSRF check)
2. Exchange `code` for ID token
3. Verify token signature with provider public key
4. Extract `email`, verify `email_verified: true`
5. Look up user in DB
6. Branch: existing → login · new → register · suspended → error
7. Set session cookie + redirect

---

## Security Requirements

| Requirement | Detail |
|---|---|
| CSRF protection | Generate `state` param before redirect, verify on callback |
| Token verification | Verify ID token signature using provider's JWKS endpoint |
| Email verified | Reject tokens where `email_verified: false` |
| Provider mismatch | If account exists with different provider → reject with clear error |
| Rate limiting | Max 10 OAuth callback attempts / 15 min per IP |

---

## Redirect After Login

Pass intended destination as a `redirect` query param on the login URL:

```
/login?redirect=/post
/login?redirect=/favourites
```

After successful login, read `redirect` param and navigate there (validate it's an internal path — never redirect to external URLs).

---



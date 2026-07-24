# Journey: Register & Login

> All auth entry points — decision tree + sequences for every path.  
> Detailed flow specs live in `md/architecture/auth/`.  
> Last updated: 2026-07-07

---

## Auth Decision Tree

```
User hits protected route (or clicks Login / Register)
  │
  ├─ Has valid session? ──► Yes ──► proceed
  │
  └─ No session
       │
       ├─ New user ──────────────────► /register
       │                                  │
       │                         ┌────────┴────────┐
       │                         │                 │
       │                    Email path        OAuth path
       │                    (Google / Apple)
       │
       └─ Returning user ────────► /login
                                     │
                              ┌──────┴──────┐
                              │             │
                         Magic link    Email + OTP
                         (passwordless)
                         
                         Also: forgot password → reset password
```

---

## Path 1 — Email Registration

```
User          /register          POST /api/auth/register     Email
  │── fills form ──────────────►│                             │
  │   name, email, dob, pass    │── validate + age gate ─────►│
  │                             │── hash password             │
  │                             │── insert user (unverified)  │
  │                             │── generate OTP              │
  │                             │── store tokenHash ─────────►│ otp_tokens
  │                             │── sendOtp(email, code) ────►│ Resend/SES
  │◄── redirect /register/verify│                             │
  │                             │                             │
  │── enters 6-digit OTP ──────►│ POST /api/auth/verify-otp  │
  │                             │── validate attempts ────────│
  │                             │── mark used + activate user │ ATOMIC
  │                             │── set termsAcceptedAt        │
  │                             │── set lastLoginAt            │
  │                             │── set session cookie         │
  │◄── redirect / (or ?next=)   │                             │
```

---

## Path 2 — OAuth Registration (Google / Apple)

```
User          /register          OAuth Provider        /api/auth/callback
  │── clicks Google ───────────►│── redirect to Google ──────►│
  │                             │◄── auth code ───────────────│
  │                             │── POST /api/auth/callback/google
  │                             │── verify token (Google API) │
  │                             │── upsert user               │
  │                             │   status: pending-profile   │
  │                             │── set session cookie         │
  │◄── redirect /register/complete                            │
  │                             │                             │
  │── fills DOB + accepts T&C ─►│ POST /api/auth/complete-profile
  │                             │── age gate                  │
  │                             │── set termsAcceptedAt        │
  │                             │── status: active            │
  │◄── redirect / ─────────────│                             │
```

---

## Path 3 — Magic Link Login

```
User          /login             POST /api/auth/magic-link    Email
  │── enters email ────────────►│── check email exists ──────►│
  │                             │── generate 64-char token    │
  │                             │── hash SHA-256              │
  │                             │── store (purpose: login)    │
  │                             │── sendMagicLink(email, url)►│
  │◄── "Check your email" ──────│                             │
  │                             │                             │
  │── clicks link in email ────►│ GET /api/auth/verify-magic  │
  │   /auth/verify?token=xxx    │── validate hash + purpose   │
  │                             │── mark used                 │
  │                             │── set lastLoginAt            │
  │                             │── set session cookie         │
  │◄── redirect / ─────────────│                             │
```

---

## Path 4 — Forgot Password

```
User          /login             POST /api/auth/forgot-password  Email
  │── clicks "Forgot password" ►│                                 │
  │── enters email ────────────►│── always return 200            │
  │                             │   (never reveal if exists)      │
  │                             │── if exists: generate token    │
  │                             │   purpose: "reset"             │
  │                             │── sendPasswordReset(email, url)►│
  │◄── "If registered, email sent"                               │
  │                             │                                 │
  │── clicks link in email ────►│ POST /api/auth/reset-password  │
  │── enters new password ─────►│── validate token + purpose     │
  │                             │── bcrypt new password          │
  │                             │── $inc sessionVersion (atomic) │
  │                             │── mark token used              │
  │◄── redirect /login ─────────│                                │
```

---

## Logout

```
User          Client             POST /api/auth/logout
  │── clicks Logout ───────────►│── delete session cookie
  │◄── redirect /login ─────────│
```

---

## Session Lifecycle

```
Login / OTP verify / magic link verify
  │── JWT signed (30 days, includes sessionVersion)
  │── stored in HttpOnly cookie

Every authenticated request
  │── getSession() reads cookie
  │── verifies JWT signature + expiry
  │── checks sessionVersion matches DB
  │   └─ mismatch (password reset) → return null → 401

Password reset
  │── $inc users.sessionVersion
  │── all existing JWTs immediately invalid
```

---

## Redirect Rules

| Trigger | Redirects to |
|---|---|
| Protected route, no session | `/login?next=[original path]` |
| Login success, `?next` param present | `?next` value |
| Login success, no `?next` | `/` |
| OAuth user needing profile completion | `/register/complete` |
| Already logged in, hits `/login` | `/` |

---

## OTP Resend

```
User          /register/verify    POST /api/auth/resend-otp
  │── clicks "Resend code" ──────►│                             │
  │                             │── rate limit:               │
  │                             │   max 3 resends / 10 min    │
  │                             │── invalidate previous OTP   │
  │                             │── generate new OTP          │
  │                             │── sendOtp(email, code) ─────►│ Resend/SES
  │◄── "New code sent"          │                             │
  │   resend button disabled    │                             │
  │   60s (useResendTimer hook) │                             │
```

---

## OAuth Email Conflict

User registers with Google but email already exists as an email/password account.

```
User          /register           POST /api/auth/callback/google
  │── clicks Google ────────────►│── verify Google token      │
  │                             │── look up email ───────────►│
  │                             │◄── exists (method: email) ──│
  │                             │                             │
  │                             │   LokalAds V1: block        │
  │                             │   return 409 email_conflict │
  │◄── "Account already exists. │                             │
  │    Log in with email/pass" ─│                             │
```

- V2 option: prompt user to link accounts (add "google" to `oauthProviders[]`)

---

## Token / OTP Expiry Errors

| Scenario | Error code | Recovery |
|---|---|---|
| OTP entered after 10 min | `otp_expired` (410) | Request resend |
| OTP wrong 5× | `max_attempts_exceeded` (429) | Wait 15 min or resend |
| Magic link clicked after 30 min | `token_expired` (410) | Request new magic link |
| Magic link already used | `token_used` (410) | Request new link |
| Reset link expired / used | `token_expired` / `token_used` (410) | Request new reset email |

---

## Suspended / Banned Account — Login Attempt

```
User          /login              POST /api/auth/login         DB
  │── submits credentials ──────►│── validate password ───────►│
  │                             │── fetch user ──────────────►│
  │                             │◄── { status: "suspended" } ─│
  │                             │                             │
  │                             │   suspended → 403           │
  │                             │     account_suspended       │
  │                             │   banned → 403              │
  │                             │     account_banned          │
  │◄── error shown ─────────────│                             │
  │   "Your account has been    │                             │
  │    suspended. Contact support"                            │
```

- Same status check applies to magic link (after token verify) and OAuth (after token verify)
- No session cookie is ever issued for suspended or banned accounts

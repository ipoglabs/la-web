# LokalAds — Authentication Architecture

> Entry point for all auth developer documentation.  
> Last updated: 2026-07-07

---

## Flows

| # | Flow | File |
|---|---|---|
| 1 | Registration via Email + OTP | [email-registration.md](./email-registration.md) |
| 2 | Registration via Google / Apple OAuth | [oauth-registration.md](./oauth-registration.md) |
| 3 | Login via Google / Apple OAuth | [oauth-login.md](./oauth-login.md) |
| 4 | Login via Magic Link | [magic-link-login.md](./magic-link-login.md) |
| 5 | Session Management | [session-management.md](./session-management.md) |

---

## Actors (used across all diagrams)

| Actor | Description |
|---|---|
| **User** | Person using the browser |
| **Browser** | Next.js client — React components, pages |
| **Next.js** | App Router server — pages + `app/api/` route handlers |
| **DB** | MongoDB via Mongoose (`lib/db.ts`) |
| **OAuth** | Google / Apple identity provider |
| **Email** | Transactional email service (e.g. Resend, SendGrid) |

---

## Route Map

| Route | Purpose | Auth required |
|---|---|---|
| `/register` | Choose auth method | No |
| `/register/create` | Fill account details (email path) | No |
| `/register/verify` | OTP entry (email path) | No |
| `/register/complete` | Collect DOB + terms after OAuth | Partial (OAuth token) |
| `/register/success` | Account created confirmation | No |
| `/register/next` | First goal / onboarding destination | No |
| `/login` | Login entry point | No |
| `/api/auth/register` | Create pending user | No |
| `/api/auth/send-email-otp` | Send OTP to email | No |
| `/api/auth/verify-email-otp` | Verify OTP + activate account | No |
| `/api/auth/magic-link` | Send magic link email | No |
| `/api/auth/verify-magic` | Validate magic link token | No |
| `/api/auth/callback/google` | Google OAuth callback | No |
| `/api/auth/callback/apple` | Apple OAuth callback | No |
| `/api/auth/complete-profile` | Save DOB + terms after OAuth | Partial |
| `/api/auth/session` | Get current user session | Yes |

---

## Global Security Requirements

- All auth endpoints must be rate-limited: **max 5 attempts / 15 min per IP**
- Passwords: hashed with **bcrypt** (cost factor 12), never stored plain
- Tokens (OTP, magic link): stored as **SHA-256 hash** in DB, raw value sent only via email
- Session cookie: **HttpOnly, Secure, SameSite=Lax**
- Age gate: DOB validation must happen **server-side** — never trust client-only validation
- All `/api/auth/*` routes must sanitise and validate inputs before DB access

---

## Developer TODO Checklist

- [ ] `POST /api/auth/register` — validate, hash password, create pending user
- [ ] `POST /api/auth/send-email-otp` — generate OTP, store hash + expiry, send email
- [ ] `POST /api/auth/verify-email-otp` — validate OTP, activate user, issue session
- [ ] `GET /api/auth/callback/google` — exchange code, upsert user, issue session
- [ ] `GET /api/auth/callback/apple` — exchange code, store name on first auth only
- [ ] `POST /api/auth/complete-profile` — save DOB + terms for OAuth users
- [ ] `POST /api/auth/magic-link` — generate signed token (15 min TTL), send email
- [ ] `GET /api/auth/verify-magic` — validate token, mark used, issue session
- [ ] `lib/session.ts` — implement signed JWT or Iron Session (HttpOnly cookie)
- [ ] Add rate limiting middleware to all `/api/auth/*` routes

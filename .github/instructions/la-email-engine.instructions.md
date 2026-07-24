---
applyTo: "lib/email/**"
---

# Email Engine Rules — poc-next

The email engine lives entirely in `lib/email/`. It is **frozen at Phase 8 (CODE FREEZE)**.
FSD: `md/feature-spec-doc/email-engine.md`

---

## Architecture at a Glance

```
lib/email/
  index.ts          ← ONLY public export: sendEmail(event: EmailEvent)
  types.ts          ← Discriminated union — 28 EmailEvent members (source of truth)
  subjects.ts       ← Pure function getSubject(event) — all subject line copy
  renderer.ts       ← renderEmail(event) → { subject, html, text }
  provider.ts       ← Resend wrapper — only file that knows about Resend
  preview-data.ts   ← 71 mock entries for design-system demo
  templates/
    _base.tsx       ← APP_URL · baseEmail() · s() · esc() — no JSX, no react-dom/server
    account/        ← 14 templates (otp, account-created, email-verified, ...)
    listings/       ← 8 templates (listing-live, listing-status, ...)
    alerts/         ← 3 templates (alert-match, alert-digest, alert-no-matches)
    reports/        ← 4 templates (report-ticket-created, counter-report, ...)
    engagement/     ← 6 templates (onboarding-nudge, win-back, milestone, ...)
    platform/       ← 3 templates (gdpr-notice, platform-notice, admin-message)
```

---

## HARD RULE — No JSX, No react-dom/server

Next.js 16 Turbopack **bans `react-dom/server`** from the entire App Router bundle.
**Templates must return HTML strings, never JSX components.**

```ts
// ✅ CORRECT — plain string function
export function OtpEmail(data: OtpData): string {
  return baseEmail(`<h1 style="${s({...})}">...</h1>`);
}

// ❌ WRONG — JSX + react-dom/server — will break at build time
export function OtpEmail(data: OtpData) {
  return <div>...</div>;
}
```

---

## The 3 Base Helpers (from `_base.tsx`)

Always import from `"../_base"` (one level up from any group subfolder):

```ts
import { baseEmail, s, esc, APP_URL } from "../_base";
```

| Helper | Purpose | Example |
|---|---|---|
| `baseEmail(content, preview?)` | Wraps content in full email shell (logo, header, footer) | `return baseEmail(content, "Preview text here")` |
| `s(obj)` | camelCase style object → inline CSS string | `style="${s({ fontSize: 16, fontWeight: 700 })}"` |
| `esc(str)` | HTML-escapes user-supplied strings (XSS prevention) | `${esc(data.firstName)}` |
| `APP_URL` | Base URL from env (`NEXT_PUBLIC_APP_URL`) | `href="${APP_URL}/listings"` |

**Always use `esc()` on any user-supplied data** — listing titles, names, messages, etc.

---

## Adding a New Email Type — 6-Step Checklist

Do these steps in order. Do not skip any.

### Step 1 — `types.ts`
Add a new union member to `EmailEvent`:
```ts
| {
    type: "MY_NEW_TYPE";
    to: string;
    data: { firstName: string; /* ... */ };
  }
```

### Step 2 — `subjects.ts`
Add a `case "MY_NEW_TYPE":` to the `getSubject()` switch.
The switch must remain exhaustive — TypeScript will error if a case is missing.

### Step 3 — Create template file
Pick the correct group subfolder. Create `templates/[group]/my-new-type.tsx`:
```ts
import { baseEmail, s, esc, APP_URL } from "../_base";

type MyNewTypeData = { firstName: string; /* ... */ };

export function MyNewTypeEmail(data: MyNewTypeData): string {
  const content = `...`;
  return baseEmail(content, "Preview text");
}

export function myNewTypeText(data: MyNewTypeData): string {
  return ["Plain text version"].join("\n");
}
```

### Step 4 — `renderer.ts`
Add import at the top (in the correct group section):
```ts
import { MyNewTypeEmail, myNewTypeText } from "./templates/[group]/my-new-type";
```
Add case to the switch:
```ts
case "MY_NEW_TYPE":
  html = MyNewTypeEmail(event.data);
  text = myNewTypeText(event.data);
  break;
```

### Step 5 — `preview-data.ts`
Add a mock entry to `PREVIEW_DATA`:
```ts
{
  label: "My New Type — scenario name",
  event: {
    type: "MY_NEW_TYPE",
    to: "gopi@example.com",
    data: { firstName: "Gopi" },
  },
},
```

### Step 6 — Restart dev server
**Always restart the dev server after adding/moving template files.**
Turbopack caches module paths — it will return 404 until restarted.

---

## Calling `sendEmail()` — From API Routes Only

```ts
// app/api/auth/otp/route.ts
import { sendEmail } from "@/lib/email";

const result = await sendEmail({
  type: "OTP",
  to: "user@example.com",
  data: { code: "847291", expiresInMinutes: 10, purpose: "login" },
});

if (!result.success) {
  return Response.json({ error: "Email delivery failed" }, { status: 500 });
}
```

**Never call `sendEmail()` from a page, component, or Server Component.**
Always call it from an `app/api/` route handler.

---

## Production Wiring Checklist (before first real send)

- [ ] `RESEND_API_KEY=re_...` in `.env.local`
- [ ] `EMAIL_FROM=no-reply@yourdomain.com` in `.env.local`
- [ ] `NEXT_PUBLIC_APP_URL=https://yourdomain.com` in production env
- [ ] Sending domain verified in Resend dashboard
- [ ] Smoke test: trigger one real email end-to-end

---

## What is NOT built (by design)

- **Unsubscribe footer link** — needs token-based `/api/unsubscribe` endpoint first. Phase 11 Enhancement #3.
- **2FA emails** — not in roadmap.
- **Email preference centre** — Phase 11 Enhancement #3.

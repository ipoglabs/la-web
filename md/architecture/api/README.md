# API Architecture — LokalAds

> Status: ✅ Complete  
> Priority: **1 — Do this first.** Developer builds `/api/` routes immediately after DB setup.

---

## Files in this folder

| File | Topic |
|---|---|
| `01-conventions.md` | Route naming rules · HTTP method decisions · folder structure under `app/api/` · standard route file structure · external API proxy rule |
| `02-auth-guards.md` | `getSession()` contract · 4 access levels · guard patterns with code · check order · session cookie spec · CSRF protection |
| `03-response-shapes.md` | Success envelopes · error envelope · complete HTTP status code table · full error codes list · `lib/api-response.ts` helpers |
| `04-input-validation.md` | Validation layer map · full `lib/validation.ts` · field length limits · enum validation · rich text sanitisation · coordinate validation |
| `05-rate-limiting.md` | Upstash Redis setup · `lib/rate-limit.ts` · per-route limits table · OTP double-lock pattern · local dev fallback |
| `06-route-inventory.md` | All 48 routes · method · auth level · rate limiter · build status · implementation task reference |
| `07-real-api-gap-inventory.md` | Flat, domain-grouped list of every backend API the whole app still needs (categories, listings, alerts, auth, chat, favourites, profile, etc.) with status + "used by" screens — the deep gap-analysis reference |

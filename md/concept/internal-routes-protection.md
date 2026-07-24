# Internal Routes Protection

`/design-system` and `/snippets` are internal reference areas — component demos, design tokens, and code snippets used by the dev team. They must never appear in search results or be accessible to the public.

Three independent protection layers are in place.

---

## Layer 1 — HTTP Basic Auth (middleware)

**File:** `proxy.ts` (renamed from `middleware.ts` 2026-07-13 — Next.js 16 deprecated the `middleware` file convention)

Every request to `/design-system/**` or `/snippets/**` is intercepted by Next.js Edge Middleware before it reaches any page. If the `Authorization` header is missing or incorrect the server returns `401 Unauthorized` with a `WWW-Authenticate` challenge — the browser shows its native credential dialog.

### Credentials

| Variable | Default | Purpose |
|---|---|---|
| `BASIC_AUTH_USER` | none — must be set | Username |
| `BASIC_AUTH_PASS` | none — must be set | Password |

> **Fixed 2026-07-13:** there is no hardcoded fallback. If either variable is
> unset, every request is rejected — fail closed, rather than silently
> accepting a well-known default that would also work in production if the
> real env vars were ever missing on the hosting platform.

**In production:** set both variables in your hosting platform's environment config (Vercel → Project Settings → Environment Variables). Never commit real credentials to the repo.

```bash
# .env.local (never committed)
BASIC_AUTH_USER=your-team-username
BASIC_AUTH_PASS=a-strong-random-password
```

### How it works

```
Browser → GET /design-system/button
            ↓
        proxy.ts: requiresAuth() → true
            ↓
        checkBasicAuth() → no Authorization header
            ↓
        401 + WWW-Authenticate header
            ↓
        Browser shows login dialog
            ↓
        User enters credentials → Base64 encoded → resent
            ↓
        checkBasicAuth() → match → NextResponse.next()
            ↓
        Page renders normally
```

> **Why Basic Auth?** Zero dependencies, works at the edge, no extra login page to maintain. Perfect for internal tooling where team members log in once per browser session.

---

## Layer 2 — robots.txt (crawl block)

**File:** `app/robots.ts`

Generates `/robots.txt` at build time. All well-behaved bots read this before crawling.

```
User-agent: *
Disallow: /design-system/
Disallow: /snippets/
```

Covers: Google, Bing, DuckDuckBot, GPTBot (OpenAI), CCBot (Common Crawl), Applebot, Amazonbot, and every other standards-compliant crawler.

---

## Layer 3 — X-Robots-Tag HTTP header

**File:** `next.config.ts`

Sent with every HTTP response from the internal paths:

```
X-Robots-Tag: noindex, nofollow, noarchive, noimageindex
```

| Directive | Effect |
|---|---|
| `noindex` | Don't add this page to any search index |
| `nofollow` | Don't follow links on this page |
| `noarchive` | Don't show a cached version |
| `noimageindex` | Don't index images on this page |

This layer catches crawlers that skip `robots.txt` — including some AI training pipelines and headless scrapers — because the header is enforced at the HTTP level before any HTML is parsed.

---

## Layer comparison

| Layer | Stops | Doesn't stop |
|---|---|---|
| Basic Auth | All unauthenticated HTTP requests (bots + humans) | Nothing — blocks everything without credentials |
| robots.txt | All well-behaved crawlers | Bad-actor scrapers that ignore robots.txt |
| X-Robots-Tag | Headless scrapers, AI crawlers, cached proxies | Determined bad actors |

With Basic Auth in place, Layers 2 and 3 are defence-in-depth — even if auth is ever misconfigured, the crawlers will still be told to stay away.

---

## Local development

`.env.local` ships with `BASIC_AUTH_USER=dev` / `BASIC_AUTH_PASS=dev123` so the team can access internal routes without extra setup — this file is gitignored and never committed, so these values never reach production. To use custom credentials locally:

```bash
# .env.local
BASIC_AUTH_USER=myuser
BASIC_AUTH_PASS=mypassword
```

Then restart the dev server (`pnpm dev`).

To bypass auth entirely in local dev (not recommended for shared environments), remove or comment out the `requiresAuth` guard block in `proxy.ts` temporarily.

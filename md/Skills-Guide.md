# Skills Practical Guide — LokalAds / poc-next

> Last updated: 2026-07-09 · Owner: Gopi
> This is YOUR guide — written in plain English. Not for the AI.

---

## What Are Skills?

Skills are deep knowledge files that live in `.github/skills/`.

Think of each skill as a **specialist you can call in on demand**. Copilot always has the general project brief loaded (from `copilot-instructions.md`), but when you go deep on a specific area — design, database, auth, SEO — it reads the relevant skill file to get expert-level, project-specific guidance.

**You never read the skill files yourself.** They are written for Copilot, not for you. This guide tells you *when to trigger them* and *what you'll get back*.

---

## How Skills Get Activated

### Automatic (you say nothing)
Copilot automatically reads the right skill based on what you're building:
- Talking about a form or component → `la-frontend-dev` + `la-ux-design`
- Talking about a database query → `la-mongodb`
- Talking about login/protect a page → `la-auth`

### Explicit (you ask directly)
If you want to make sure the right skill is loaded, just say the topic naturally:
> "I want to build a new feature"  → triggers `la-new-feature`
> "How do I deploy this?"          → triggers `la-devops-infra`
> "Add SEO to the listing page"    → triggers `la-seo`

You never need to say "load skill la-mongodb". Just talk about what you want to do.

---

## The 8 Skills — What Each One Does For You

---

### 1. `la-new-feature` — Starting anything new

**When:** You want to build something that doesn't exist yet.

**Say:**
> "New feature: Post an Ad"
> "I want to build the login flow"
> "Can we add email alerts?"

**What you get:**
Copilot runs a structured conversation with you — asking about the problem, who's affected, what's in scope, what's out. It won't write a single line of code until you've both agreed on the plan. This saves hours of rework later.

The output is a Feature Spec Document (FSD) in `md/feature-spec-doc/`. Your idea, structured and signed off before building starts.

---

### 2. `la-architecture-owner` — Structural decisions

**When:** You're adding a new route, changing how the app is structured, or wondering "where should this live?"

**Say:**
> "I need a new route for seller onboarding"
> "Should this be a Zustand store or local state?"
> "I want to add a new layout type"

**What you get:**
Copilot checks the middleware order, the layout signal system, the state architecture rules — and tells you the right approach for THIS codebase. Not a generic Next.js answer. Your specific setup.

---

### 3. `la-frontend-dev` — Building any UI

**When:** You're building a page, a component, a form, anything visual.

**Say:**
> "Build the profile page"
> "Add a responsive form for the contact section"
> "Where should this component live?"

**What you get:**
Copilot picks the right `la/` component, follows your colour system, applies accessibility rules, co-locates files correctly, and never imports raw Radix in a page. All automatically.

---

### 4. `la-ux-design` — Design decisions and the design system

**When:** You're unsure which component to use, want to validate a design feels right, or are building something new for the design system.

**Say:**
> "What component should I use to show a listing status?"
> "Does this feel right for LokalAds brand?"
> "I need a new component for X — how do we build it properly?"

**What you get:**
Copilot checks the full design system inventory (every `la/` and `la-blocks/` component with all their variants), validates against your brand voice (Trustworthy · Approachable · Local · Confident · Calm), and either finds an existing component or guides you through the ritual to build a new one correctly.

This skill also knows your accessibility constraints (low vision, `text-sm` minimum, contrast rules) and will flag violations.

---

### 5. `la-mongodb` — Database and queries

**When:** You're writing API routes that touch MongoDB, creating new models, or designing how data should be stored.

**Say:**
> "Write the API route to fetch listings by country"
> "I need to store user reviews — how should the schema look?"
> "How do I paginate the listings results?"

**What you get:**
Copilot writes Mongoose v9 models with the right pattern (singleton guard, timestamps, explicit collection names), uses `.lean()` and `.select()` correctly, follows the embed-vs-reference decision guide, and never returns `passwordHash` or `sessionVersion` in responses.

---

### 6. `la-auth` — Login, sessions, protecting pages

**When:** You're building anything that requires a user to be logged in.

**Say:**
> "Make the /myads page require login"
> "Write an API route that only the listing owner can call"
> "How do I read the current user in a Server Component?"

**What you get:**
Copilot writes the exact `getSession()` pattern, the right guard level (Public / Authenticated / Owner-only / Admin-only), the correct order of checks, and the `redirect()` pattern for protected pages. Correct and secure, first time.

---

### 7. `la-seo` — Search engine visibility

**When:** You're adding metadata to a page, setting up sitemaps, or thinking about how Google sees the site.

**Say:**
> "Add SEO metadata to the listing detail page"
> "Set up hreflang for our 3 markets"
> "Generate a sitemap"

**What you get:**
Copilot writes `generateMetadata()` with Open Graph, Twitter card, and canonical URL. For listing pages it adds `hreflang` for IN/GB/SG. It knows the POC→PROD URL migration plan (cookie-based now → `/in/` `/gb/` `/sg/` subdirectories in production).

---

### 8. `la-devops-infra` — Deployment and infrastructure

**When:** You're deploying, setting up a new machine, configuring env vars, or debugging something infrastructure-related.

**Say:**
> "What env vars do I need in Vercel?"
> "Set up the cron job for alert matching"
> "Email isn't sending — what do I check?"

**What you get:**
The complete env var list with what each one does, step-by-step Vercel deployment, Cloudflare country detection setup, cron job wiring, Resend email config, and a production security checklist.

---

## How Skills Stay Up to Date — Self-Update Protocol

Every skill file ends with a **"How This Skill Evolves"** section. This means:

- When you build something and a better pattern is discovered → Copilot updates the skill
- When you make a design decision → Copilot updates `la-ux-design`
- When you add a new env var → Copilot updates `la-devops-infra`
- When a new `la/` component is built → Copilot updates `la-ux-design` inventory

**You never need to maintain the skill files manually.** They grow automatically as the project grows. The only thing you need to do is say **`Update session log`** at the end of each session so Copilot records what changed.

---

## Quick Reference — What to Say for Common Situations

| Situation | What to say |
|---|---|
| Starting something new | `"New feature: [name]"` |
| Building a page | `"Build the /[page] page"` |
| Not sure which component | `"What component for [X]?"` |
| Design feels off | `"Does this feel right for LokalAds?"` |
| Writing a DB query | `"Write the API route for [X]"` |
| Protecting a page | `"Make /[page] require login"` |
| Adding SEO | `"Add metadata to [page]"` |
| Deploying | `"What do I need to deploy this?"` |
| End of session | `"Update session log"` |
| Something feels wrong with Copilot | `"Full sync"` |

---

## Where the Skill Files Live

```
.github/skills/
  la-new-feature/       SKILL.md
  la-architecture-owner/ SKILL.md
  la-frontend-dev/      SKILL.md
  la-ux-design/         SKILL.md
  la-mongodb/           SKILL.md
  la-auth/              SKILL.md
  la-seo/               SKILL.md
  la-devops-infra/      SKILL.md
```

You don't need to open these. They are Copilot's reference, not yours. This guide is yours.

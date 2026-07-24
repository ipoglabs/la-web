---
applyTo: "app/**,components/**,lib/**"
---

# New Feature Ritual — poc-next

When the user says anything like:
- "I want to build X"
- "New feature: X"
- "Can we add X?"
- "Let's start X"
- "We need X"

Follow this ritual **exactly and completely** before writing any code.

---

## Step 1 — Check the POC Gap Tracker

Read `/memories/repo/poc-tracker.md`.

- Is this feature already tracked? If yes, note its current status.
- If it is a new untracked feature, it will be added after DISCOVERY is complete.

---

## Step 2 — Check for Existing FSD

Look for `md/feature-spec-doc/[feature-slug].md`.

- **Exists** → read it, confirm phase, continue from where it left off. Do not restart.
- **Does not exist** → proceed to Step 3.

---

## Step 3 — STOP. Do Not Write Code Yet.

Explicitly tell the user:

> "No FSD exists for this feature yet. Let's go through DISCOVERY before we build anything. This will take a few minutes and will save hours later."

Then begin filling DISCOVERY together.

---

## Step 4 — Create the FSD from Template

1. Copy `md/feature-spec-doc/_TEMPLATE.md`
2. Name it `md/feature-spec-doc/[feature-slug].md`
3. Fill the **Header** section:
   - Feature Name
   - Short Slug
   - Owner: Gopi
   - Created: today's date
   - Current Phase: 🔵 DISCOVERY

---

## Step 5 — Fill DISCOVERY Together (Phase 1)

Work through each section with the user — do NOT fill it alone:

1. **Problem Statement** — ask: _"In plain English, what problem does this solve and why now?"_
2. **Who Is Affected** — list every user type touched
3. **All Use Cases** — be exhaustive. Ask: _"What else? Any edge cases? Admin side? Scheduled events?"_
4. **What This Is NOT** — explicitly list out-of-scope items to prevent scope creep

**Gate:** Do not advance to REFINEMENT until all 4 sections are filled and owner confirms.

---

## Step 6 — Fill REFINEMENT Together (Phase 2)

1. **Agreed Scope (in)** — which use cases are in for v1?
2. **Deferred to Later** — which are explicitly out, and why?
3. **Constraints & Non-Negotiables** — accessibility, security, performance
4. **Dependencies** — what must exist before this can be built?
5. **Open Questions** — list everything unresolved. Each must be answered before ARCHITECTURE.

**Gate:** All open questions answered before moving to DESIGN.

---

## Step 7 — DESIGN Phase (Phase 3)

Ask: _"Does this feature have a user-facing UI?"_

- **Yes** → Fill user flows, screen inventory, interaction notes, accessibility decisions. Get design sign-off.
- **No (pure backend/service)** → Mark Phase 3 as N/A with explanation. Move to ARCHITECTURE.

**Gate:** Design sign-off by owner before ARCHITECTURE.

---

## Step 8 — ARCHITECTURE Phase (Phase 4)

1. List every realistic approach (minimum 2, ideally 3+)
2. For each: description, pros, cons, verdict
3. Define the chosen approach clearly
4. Document: folder structure, data contracts (TypeScript types), integration points, env vars

**Gate — Architecture Review (MANDATORY):**
- Review the completed architecture against all criteria
- Score it out of 10
- If **9.0 or above** → recommend sign-off, list any gaps as PLANNING tasks
- If **below 9.0** → fix gaps first, re-score
- Record review in Decisions Log
- Get explicit owner sign-off before advancing

---

## Step 9 — PLANNING Phase (Phase 5)

Break the architecture into numbered, sequenced tasks:
- Group into milestones
- Note build-order dependencies
- Include any gap-fix tasks from the architecture review

**Gate:** All tasks listed before implementation starts. Owner reviews task list.

---

## Step 10 — POC Stage Check (Before IMPLEMENTATION)

Before writing a single line of implementation code, ask:

> **"Does any planned task require a real API key, external service account, or production credential that isn't available at POC stage?"**

Common examples:
- Sending real emails → needs `RESEND_API_KEY` / `SENDGRID_API_KEY`
- Payment processing → needs Stripe live/test key
- SMS delivery → needs Twilio credentials
- Push notifications → needs FCM/APNS keys
- Third-party OAuth → needs client ID + secret

If **yes** to any of the above:
1. Tell the user: _"Task [N] requires [credential] — not available at POC stage. Shall I replace this with a design system demo page instead?"_
2. Wait for user confirmation
3. If confirmed: replace the wire-up task with → create `/design-system/feature/[feature-name]` demo page that visually previews the feature
4. Update the FSD task description accordingly (do NOT silently skip it — it must be replaced, not dropped)

---

## Step 11 — Advance to IMPLEMENTATION

Only after Steps 4–10 are complete:

1. Update FSD header: Current Phase → 🔨 IMPLEMENTATION
2. Update Phase History
3. Update Session Log
4. Begin Milestone 1, Task 1

From this point, follow `la-feature-spec.instructions.md` for all implementation behaviour.

---

## Step 12 — After Any File Move or Rename

Whenever implementation involves moving, renaming, or reorganising files:

> **"Files were moved — please restart the dev server before testing."**

Turbopack caches module resolution paths at startup. Moved files will return 404 or
module-not-found errors until the dev server is restarted. This is not a code error.

---

## Checklist Summary (copy this mentally for every new feature)

```
[ ] 1.  Checked POC gap tracker
[ ] 2.  No existing FSD — creating new
[ ] 3.  FSD created from _TEMPLATE.md
[ ] 4.  DISCOVERY complete — owner confirmed
[ ] 5.  REFINEMENT complete — all open questions answered
[ ] 6.  DESIGN complete (or N/A confirmed)
[ ] 7.  ARCHITECTURE complete — scored 9+, owner signed off
[ ] 8.  PLANNING complete — all tasks listed
[ ] 9.  POC stage check done — any credential-blocked tasks replaced with demo pages
[ ] 10. IMPLEMENTATION started — Milestone 1, Task 1
```

**Do not skip a step. Do not merge steps. The ritual is the protection.**

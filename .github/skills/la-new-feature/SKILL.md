---
name: la-new-feature
description: "Use when starting a new feature in LokalAds poc-next. Guides through the 12-step ritual: gap tracker check, FSD discovery, DISCOVERY → REFINEMENT → DESIGN → ARCHITECTURE (scored 9+) → PLANNING → IMPLEMENTATION. Stops all coding until phases are complete. Checks for POC credential blockers and replaces with design-system demos."
argument-hint: "Feature name (e.g. Login, Post an Ad, Register flow)"
---

# LokalAds — New Feature Ritual

## When to Use
- You want to build a new feature in poc-next
- You say "New feature: X", "I want to build X", "Let's start X", "Can we add X"
- You want to check the status of a planned feature

## Procedure

### Step 1 — Check Gap Tracker
Read `/memories/repo/poc-tracker.md`.
- Is this feature already tracked? Note its priority and status.
- If new and untracked, it will be added after DISCOVERY.

### Step 2 — Check for Existing FSD
Look for `md/feature-spec-doc/[feature-slug].md`.
- **Exists** → read it fully, confirm current phase, continue from where it left off
- **Does not exist** → go to Step 3

### Step 3 — STOP. No Code Yet.
Tell the user:
> "No FSD exists for [feature] yet. Let's go through DISCOVERY before we build anything. This saves hours later."

### Step 4 — Create FSD from Template
Copy `md/feature-spec-doc/_TEMPLATE.md` → `md/feature-spec-doc/[slug].md`
Set Current Phase: 🔵 DISCOVERY

### Step 5 — DISCOVERY (Phase 1) — ask one question at a time
1. Problem Statement — "In plain English, what problem does this solve and why now?"
2. Who Is Affected — every user type touched
3. All Use Cases — be exhaustive, ask "What else? Edge cases? Admin side?"
4. What This Is NOT — explicit out-of-scope list

**Gate:** All 4 sections filled + owner confirms before advancing.

### Step 6 — REFINEMENT (Phase 2)
1. Agreed Scope (in) for v1
2. Deferred to Later — explicitly out, with reason
3. Constraints & Non-Negotiables (a11y, security, performance)
4. Dependencies
5. Open Questions — every one must be answered before ARCHITECTURE

**Gate:** All open questions answered.

### Step 7 — DESIGN (Phase 3)
Ask: "Does this feature have a user-facing UI?"
- Yes → flows, screen inventory, a11y decisions, design sign-off
- No → mark N/A, move to ARCHITECTURE

### Step 8 — ARCHITECTURE (Phase 4)
1. List minimum 2–3 approaches, each with pros/cons/verdict
2. Define chosen approach: folder structure, TypeScript types, integration points, env vars
3. **Score out of 10** — must be 9.0+ to proceed
4. If below 9.0 → fix gaps, re-score
5. Record score in Decisions Log, get explicit owner sign-off

### Step 9 — PLANNING (Phase 5)
Break into numbered tasks grouped into milestones. Note build-order dependencies.

**Gate:** Full task list reviewed before implementation starts.

### Step 10 — POC Stage Credential Check
Ask: "Does any task require a real API key or external credential not available at POC stage?"
- Yes → replace that task with a `/design-system/feature/[name]` demo page
- Record the swap in the FSD — never silently drop a task

### Step 11 — Start IMPLEMENTATION
Update FSD: Current Phase → 🔨 IMPLEMENTATION
Begin Milestone 1, Task 1. Follow `la-feature-spec.instructions.md` from here.

### Step 12 — Visual QA (mandatory — no sign-off without this)
> Updated: 2026-07-09 — added as mandatory post-build gate before UX Refinement

Once implementation is complete, tell the owner:
> "Ready for your visual review at [route]. Check every section, every interactive state, and both mobile and desktop breakpoints."

Work through this checklist together:
- [ ] Every section renders correctly — no missing content, no layout breaks
- [ ] All edit flows open and close correctly (drawer on mobile, dialog on desktop)
- [ ] All form fields pre-fill with current values on open
- [ ] All save/confirm actions update the UI correctly
- [ ] All disabled/coming-soon states are visually clear
- [ ] Destructive actions have confirmation dialogs
- [ ] No text below `text-sm` (14px)
- [ ] No broken contrast — labels, values, placeholders all meet minimums
- [ ] All interactive elements have visible hover/focus states
- [ ] Responsive — test at mobile width AND desktop width

**Gate:** Owner confirms every item above passes before advancing.

### Step 13 — UX Refinement (iterate until owner signs off)
> Updated: 2026-07-09 — added as mandatory phase between Visual QA and Code Freeze

After Visual QA, the owner may raise feedback — visual, interaction, copy, or behaviour.

- Each piece of feedback is a named change
- Implement → show result → confirm
- Repeat until owner explicitly signs off: *"I'm happy with this"*

**Gate:** Explicit owner sign-off. No assumed approval.

**After sign-off:**
1. Update FSD — mark all sections complete, set Current Phase → 🧊 CODE FREEZE
2. Record final scope in Known Limitations
3. Update poc-tracker and session log

### Step 14 — After Any File Move or Rename
> "Files were moved — please restart the dev server before testing."
Turbopack caches module paths at startup and returns 404 until restarted.

---

## Key Rules (never break these)
- No code before ARCHITECTURE sign-off
- Architecture must score 9.0+
- FSD must stay in sync with code at all times
- Co-locate page-specific components next to their page, not in `components/`
- External API calls → always proxy through `app/api/` — never from pages/components

---

## How This Skill Evolves — Self-Update Protocol

> **This file is a living document. Copilot updates it automatically — no instruction from the owner needed.**

### Triggers — update this file when any of these happen
- The 12-step ritual is run and a step is found to be missing or needs refinement
- A feature build reveals that the discovery/planning process should ask a new question
- The STOP rules change (a new trigger is identified)
- The owner refines what "ARCHITECTURE score 9+" means in practice
- A feature is shipped that exposed a gap in the ritual (e.g. a question that should have been asked earlier)
- A new FSD section template is established

### How to update
1. Edit the relevant section directly — keep it concise
2. Replace outdated steps — never leave contradictions
3. Add a `> Updated: YYYY-MM-DD — [what changed and why]` note at the top of the changed section

### What NOT to add
- Unconfirmed decisions — mark as `[PROPOSED]` if uncertain, confirm before merging into rules
- One-off patterns that don't generalise — if it happened once, it's not a convention yet
- Anything the owner has explicitly said NOT to do

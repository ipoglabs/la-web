---
applyTo: "app/**,components/**,lib/**"
---

# Feature Spec Document (FSD) Rules — poc-next

Every feature in this workspace is governed by a Feature Spec Document (FSD).
The FSD is the single source of truth. Chat is disposable. The FSD is not.

All FSD files live in `md/feature-spec-doc/[feature-slug].md`.
The blank template is at `md/feature-spec-doc/_TEMPLATE.md`.

---

## 1. Session Start — Always Do This First

When the user mentions a feature by name (e.g. "email engine", "create alert", "register flow"):

1. **Check if an FSD exists** — look in `md/feature-spec-doc/[feature-slug].md`
2. **If it exists** — read it fully before writing any code or making any suggestion
3. **If it does not exist** — STOP. Follow the New Feature ritual (see `la-new-feature.instructions.md`)
4. **Confirm current phase** out loud before doing anything: _"Email Engine is in PLANNING phase, next task is #3."_

---

## 2. Phase Gates — Never Skip, Never Go Back

The 12 phases are sequential. Each has a gate condition.

| # | Phase | Gate — do not advance until... |
|---|---|---|
| 1 | 🔵 DISCOVERY | Problem statement + all use cases + out-of-scope written |
| 2 | 🟣 REFINEMENT | Scope agreed, constraints locked, all open questions answered |
| 3 | 🎨 DESIGN | Flows + screens + a11y decisions agreed, design sign-off by owner |
| 4 | 🟠 ARCHITECTURE | Options evaluated, decision locked, data contracts defined, owner sign-off |
| 5 | 🟡 PLANNING | All tasks numbered, sequenced, milestones named |
| 6 | 🔨 IMPLEMENTATION | All planned tasks complete, no known broken states |
| 7 | 🧪 TESTING | All 4 checklists ticked, owner sign-off |
| 8 | 🧊 CODE FREEZE | Scope locked, limitations documented |
| 9 | 🚀 DEPLOYMENT | Env vars confirmed, smoke test passed, rollback plan noted |
| 10 | 🐛 HOTFIX | Post-deployment only, append-only log |
| 11 | ✨ ENHANCEMENT | Each addition scoped + agreed before work starts |
| 12 | 🔧 MAINTENANCE | Stable, watch items noted |

**HARD RULES:**
- Do NOT write code for a feature that is still in DISCOVERY, REFINEMENT, or DESIGN phase
- Do NOT advance past ARCHITECTURE without explicit owner sign-off (`Agreed by Owner` field filled)
- Do NOT advance past TESTING without explicit owner sign-off (`Tested by` field filled)
- Do NOT start IMPLEMENTATION without a complete PLANNING task list

---

## 3. Architecture Sign-off Rule

Before moving any FSD from ARCHITECTURE → PLANNING:

1. Review the full Architecture section against these criteria:
   - All approaches considered and documented with verdicts
   - Chosen approach clearly described
   - Folder & file structure complete
   - Data contracts defined (types/interfaces)
   - Integration points documented
   - Env vars listed
2. **Score it out of 10**. State the score and any gaps found.
3. If score is **9.0 or above** → recommend sign-off, list minor gaps as PLANNING tasks
4. If score is **below 9.0** → do NOT recommend sign-off → fix the gaps first, re-score
5. Record the review score and gap summary in the Decisions Log

---

## 4. During Implementation — FSD Must Stay in Sync

Every time a task is completed:

1. Mark it `[x]` in the PLANNING task list (Phase 5)
2. Add the file to **Files Created** or **Files Modified** table (Phase 6)
3. If any unexpected decision was made during coding → add it to **Implementation Notes** (Phase 6)
4. If a decision changes the architecture → update the Decisions Log immediately

**Never leave the FSD stale.** If the code and FSD disagree, the FSD is wrong — fix it.

---

## 5. POC Stage — External Service Tasks

When an implementation task requires a live external service (email provider, payment gateway, SMS, OAuth, push notifications):

**Before starting the task, always check:**

> "Is this POC stage? Is the required credential / API key available in `.env.local`?"

| Credential available? | Action |
|---|---|
| ✅ Yes, key exists | Proceed with wire-up as planned |
| ❌ No, POC stage | Ask user: _"Task [N] needs [SERVICE_KEY] — unavailable at POC. Replace with design system demo?"_ |

**If replacing with a demo:**
1. Create `/design-system/feature/[feature-name]/page.tsx` — visual preview using mock data
2. Add entry to `lib/design-system-menu.ts` under "Feature Demos" section
3. Update the FSD task description: do NOT drop the task — change its description to the demo task
4. Mark the task `[x]` once the demo page is built
5. Log the decision in the Decisions Log: `"Wire-up replaced with design system demo — POC stage, no [CREDENTIAL] available"`

**This is not a workaround — it is the correct POC behaviour.** Demos prove the engine works before credentials exist.

---

## 6. Session End — Always Do This

At the end of any session that touched a feature:

1. Update the **Session Log** table at the bottom of the FSD — one line entry with date + phase + summary
2. Update **Last Updated** date in the Header
3. Confirm current phase is correctly set in the Header
4. If the user says **"update memory"** → also update `/memories/repo/poc-next.md` with a session entry

---

## 6. Decisions Log — Append-Only

The Decisions Log in every FSD is **immutable and append-only**.

- Never edit or delete an existing entry
- Every architectural, product, or UX decision goes here — not just big ones
- Format: `| # | Date | Phase | Decision | Rationale | Decided By |`
- "Decided By" is always `Gopi` or `Gopi + Copilot` — never just `Copilot`

---

## 7. What Belongs in the FSD vs What Belongs in Chat

| Belongs in FSD | Stays in chat only |
|---|---|
| Architecture decisions + rationale | Exploratory brainstorming |
| Agreed scope | Initial back-and-forth |
| Task breakdown + status | Casual questions |
| Files created/modified | |
| Open questions + answers | |
| All sign-offs | |
| Session log | |

If something was agreed in chat and it matters → it goes in the FSD before the session ends.

---

## 8. Adding a New Email Type (example of feature-specific extension rule)

When a new `EmailEvent` type is needed:

1. Check `md/feature-spec-doc/email-engine.md` — is it in the use cases list?
2. If yes and in scope → add to `types.ts`, create template file, update renderer, check task list
3. If not in use cases list → add to DISCOVERY use cases, discuss with owner, update scope if agreed
4. Never add a new email type that has no corresponding FSD entry

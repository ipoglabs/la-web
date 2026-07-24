# Feature Spec Doc — [FEATURE NAME]

> **How to use this template:**
> Copy this file → rename to `[feature-slug].md` → fill section by section.
> Move to the next phase ONLY after current phase is filled, agreed, and dated.
> This file is the single source of truth. Chat is disposable. This is not.

---

## 📌 Header

| Field | Value |
|---|---|
| **Feature Name** | |
| **Short Slug** | `feature-slug` (used in file names, routes, component folders) |
| **Owner** | Gopi |
| **Created** | YYYY-MM-DD |
| **Last Updated** | YYYY-MM-DD |
| **Current Phase** | 🔵 DISCOVERY |
| **Phase History** | DISCOVERY → |

### Phase Reference
| # | Phase | Emoji | Gate — do not advance until... |
|---|---|---|---|
| 1 | DISCOVERY | 🔵 | Problem statement written, all use cases listed, out-of-scope explicit |
| 2 | REFINEMENT | 🟣 | Scope agreed, constraints locked, all open questions answered |
| 3 | DESIGN | 🎨 | User flows + screen behaviour agreed, responsive + a11y decisions made |
| 4 | ARCHITECTURE | 🟠 | Architecture decided, data contracts defined, sign-off by owner |
| 5 | PLANNING | 🟡 | All tasks numbered, sequenced, milestones named |
| 6 | IMPLEMENTATION | 🔨 | All planned tasks complete, no known broken states |
| 7 | TESTING | 🧪 | All checklists ticked (functional + a11y + responsive + browser), sign-off by owner |
| 8 | CODE FREEZE | 🧊 | Final scope locked, known limitations documented |
| 9 | DEPLOYMENT | 🚀 | Env vars confirmed, smoke test passed, rollback plan noted |
| 10 | HOTFIX | 🐛 | Post-deployment fixes only — each logged with root cause |
| 11 | ENHANCEMENT | ✨ | Each addition scoped + agreed before work starts |
| 12 | MAINTENANCE | 🔧 | Stable, ongoing watch items noted |

---

## 🔵 Phase 1 — DISCOVERY

> Goal: Understand the problem deeply before touching any code or design.

### Problem Statement
<!--
Plain English. What pain does this solve? Who experiences it? Why now?
Bad: "We need an email system."
Good: "Users need to receive OTPs, alerts, and notifications reliably. Currently nothing is wired.
As we build auth and alerts, every feature will need email — so we need one shared engine
before any feature ships, not after."
-->


### Who Is Affected

| User Type | How They Are Affected |
|---|---|
| | |

### All Use Cases
<!--
Number every scenario. Be exhaustive — better to list 30 and scope out 10 than miss something.
-->

| # | Use Case | Trigger | Recipient |
|---|---|---|---|
| 1 | | | |

### What This Is NOT (explicit out-of-scope)
<!--
Explicit exclusions prevent scope creep. If it is not listed here or in use cases, it does not exist.
-->
-

---

## 🟣 Phase 2 — REFINEMENT

> Goal: Agree on scope, constraints, and non-negotiables before design or architecture.

### Agreed Scope (in)
-

### Deferred to Later (out for now)

| Use Case | Reason Deferred |
|---|---|
| | |

### Constraints & Non-Negotiables
- **Accessibility:**
- **Security:**
- **Performance:**
- **Other:**

### Dependencies

| Dependency | Status |
|---|---|
| | |

### Open Questions
<!--
Each must be answered and dated before moving to DESIGN.
-->

| # | Question | Raised | Answered | Answer |
|---|---|---|---|---|
| 1 | | | | |

---

## 🎨 Phase 3 — DESIGN

> Goal: Agree on user flows, screen behaviour, and interaction details BEFORE architecture is locked.
> This phase exists so the designer hat is worn fully before the developer hat goes on.

### User Flows
<!--
Describe each flow as a numbered step sequence. No wireframes required — clear words are enough.
-->

**Flow 1 — [Name]**
1. User does X
2. System responds with Y
3. User sees Z

### Screen Inventory
<!--
List every screen / state / modal / drawer that this feature introduces or modifies.
-->

| Screen / State | Description | Responsive Notes |
|---|---|---|
| | | |

### Interaction & Behaviour Notes
<!--
Edge cases in UX — loading states, empty states, error states, disabled states.
-->
-

### Accessibility Decisions
<!--
Made here, not discovered during testing. Decisions recorded upfront.
-->
- Minimum text size:
- Focus management:
- Keyboard navigation:
- ARIA requirements:

### Design Sign-off
| | Name | Date |
|---|---|---|
| **Agreed by Owner** | Gopi | |

---

## 🟠 Phase 4 — ARCHITECTURE

> Goal: Lock the architecture. Every decision recorded with rationale. No code until signed off.

### Approaches Considered

#### Option A — [Name]
**Description:**
**Pros:**
**Cons:**
**Verdict:** Rejected / Selected / Deferred

#### Option B — [Name]
**Description:**
**Pros:**
**Cons:**
**Verdict:** Rejected / Selected / Deferred

### Agreed Architecture
<!--
Describe clearly enough that a new dev understands it in 5 minutes.
-->


### Folder & File Structure
<!--
Every file that will be created. Agreed before implementation starts.
-->

### Data Contracts

### Integration Points

| Direction | Caller / Called | How |
|---|---|---|
| This feature calls | | |
| This feature is called by | | |

### Env Vars Required

| Var | Purpose | Required / Optional |
|---|---|---|
| | | |

### Architecture Sign-off
| | Name | Date |
|---|---|---|
| **Agreed by Owner** | Gopi | |

---

## 🟡 Phase 5 — PLANNING

> Goal: Break the agreed architecture into numbered, sequenced, actionable tasks.
> No task gets built without being listed here first.

### Task Breakdown

Legend: [ ] = todo  [~] = in progress  [x] = done  [!] = blocked

**Milestone 1 — [Name]**
- [ ] 1.
- [ ] 2.

**Milestone 2 — [Name]**
- [ ] 3.
- [ ] 4.

### Build Order Notes
-

---

## 🔨 Phase 6 — IMPLEMENTATION

> Updated as work progresses. One entry per task completed.

### Files Created

| File | Purpose |
|---|---|
| | |

### Files Modified

| File | What Changed | Why |
|---|---|---|
| | | |

### Task Progress

### Implementation Notes
-

---

## 🧪 Phase 7 — TESTING

> Nothing moves to CODE FREEZE until every applicable checkbox is ticked and signed off.

### Functional Checklist
- [ ] Happy path works end-to-end
- [ ] Error states handled (empty input, invalid input, API failure)
- [ ] Loading states correct
- [ ] Edge cases below all covered

### Edge Cases

| # | Scenario | Expected | Tested |
|---|---|---|---|
| 1 | | | [ ] |

### Accessibility Checklist (non-negotiable — owner has low vision)
- [ ] All text is text-sm minimum (14px) — no text-xs anywhere in this feature
- [ ] All readable text is text-slate-700 minimum on white backgrounds
- [ ] Placeholder / hint text is text-slate-500 minimum
- [ ] All interactive elements have a visible focus ring
- [ ] All meaningful icons have aria-label or accompanying visible text
- [ ] Decorative icons are aria-hidden
- [ ] Keyboard navigation works for all interactive elements (Tab, Enter, Escape, Arrow keys)
- [ ] No content relies on colour alone to convey meaning
- [ ] Logical DOM order matches visual order

### Responsive Checklist
- [ ] 375px (small mobile) — no overflow, no broken layout
- [ ] 768px (tablet) — layout switches correctly if applicable
- [ ] 1280px (desktop) — correct max-width and spacing
- [ ] Bottom sheet (mobile) behaves correctly if applicable
- [ ] Dialog (tablet+) behaves correctly if applicable

### Browser Checklist
- [ ] Chrome 105+
- [ ] Edge 105+
- [ ] Firefox 110+
- [ ] Safari 16.4+

### Testing Sign-off
| | Name | Date |
|---|---|---|
| **Tested by** | Gopi | |

---

## 🧊 Phase 8 — CODE FREEZE

> Scope is locked. Any new work goes into ENHANCEMENT, not here.

### Freeze Date
YYYY-MM-DD

### What Is In (final scope)
-

### Known Limitations (accepted, not bugs)
-

### Tech Debt Created (intentional shortcuts)

| Item | Reason | Priority to Fix |
|---|---|---|
| | | |

---

## 🚀 Phase 9 — DEPLOYMENT

> Gate before MAINTENANCE. Confirms the feature is safely live.

### Deployment Checklist
- [ ] All required env vars set in production environment
- [ ] Feature tested in production after deploy (smoke test)
- [ ] No console errors in production build
- [ ] No TypeScript errors (npm run build clean)
- [ ] Old/temp code removed (no TODO:REMOVE left behind)
- [ ] Rollback plan noted below

### Smoke Test Cases
- [ ]
- [ ]

### Rollback Plan


### Deployment Sign-off
| | Name | Date |
|---|---|---|
| **Deployed by** | Gopi | |

---

## 🐛 Phase 10 — HOTFIX

> Post-deployment hotfixes only. Append-only — never edit or delete an entry.

| # | Date | Bug Description | Root Cause | Fix Applied | Files Changed |
|---|---|---|---|---|---|
| 1 | | | | | |

---

## ✨ Phase 11 — ENHANCEMENT

> Agreed additions after code freeze. Each must be scoped and agreed before implementation starts.

| # | Date Agreed | Enhancement | Scope | Status |
|---|---|---|---|---|
| 1 | | | | |

---

## 🔧 Phase 12 — MAINTENANCE

> Stable and ongoing. Things to watch, monitor, or revisit.
-

---

## 📋 Decisions Log

> Append-only. Never edit or delete an entry.
> Every architectural, product, or UX decision recorded here with rationale.

| # | Date | Phase | Decision | Rationale | Decided By |
|---|---|---|---|---|---|
| 1 | | | | | |

---

## 💬 Session Log

> One line per session that touched this feature. Keeps context alive across sessions.

| Date | Phase At Time | Session Summary |
|---|---|---|
| | | |

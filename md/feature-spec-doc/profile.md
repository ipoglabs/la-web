# Feature Spec Doc — Private Profile

---

## 📌 Header

| Field | Value |
|---|---|
| **Feature Name** | Private Profile |
| **Short Slug** | `profile` |
| **Owner** | Gopi |
| **Created** | 2026-07-09 |
| **Last Updated** | 2026-07-12 |
| **Current Phase** | 🧊 CODE FREEZE (v1.1) — Roles section added + implemented 2026-07-12, see reference below |
| **Phase History** | DISCOVERY ✅ → REFINEMENT ✅ → DESIGN ✅ → ARCHITECTURE ✅ → PLANNING ✅ → IMPLEMENTATION ✅ → VISUAL QA ✅ → UX REFINEMENT ✅ → CODE FREEZE 🧊 → ENHANCEMENT ✅ (Roles, 2026-07-12) |

---

## 📎 Reference — User Roles (Account-Level) — ✅ IMPLEMENTED 2026-07-12

> Moved here from the now-deleted standalone `user-roles.md` (2026-07-11 discovery
> work). Gopi handed full decision + implementation control over to Copilot
> on 2026-07-12 ("I leave this ROLES section completely to you"). All open
> questions below are now resolved and built into the POC.

### Problem This Solves
Users participate in the marketplace in many capacities at once — e.g. someone
can own a small apartment (rent it out), run a small food business, work
part-time as a property agent, AND casually sell personal items, all at the
same time. Account-level roles let a user self-declare **how they participate**
(identity), shown as badges on their public profile. This is completely
separate from `AuthUser.role` (`"member" | "admin"`) in `types/auth.ts`, which
is an **access-level** permission, not an identity — no relation to this list.

### The Final Role List — 13 roles (source of truth: `src/config/roles.ts`)

| # | Role (`id`) | Plain-English meaning |
|---|---|---|
| 1 | Individual Seller (`individual_seller`) | Just a regular person selling their own stuff, occasionally |
| 2 | Business Owner (`business_owner`) | Runs a registered shop, store, or small business (online or physical) |
| 3 | Property Owner / Landlord (`property_owner`) | Owns property they rent, lease, or sell |
| 4 | Agent / Broker (`agent_broker`) | Represents other people's property, business, or goods for a fee |
| 5 | Service Provider (`service_provider`) | Offers a professional/specialist service — tutoring, consulting, coaching, therapy |
| 6 | Skilled Worker / Tradesperson (`skilled_worker`) | Hands-on trade or repair work — plumbing, carpentry, electrical, driving, and similar |
| 7 | Host (`host`) | Offers a room, stay, or experience to travellers |
| 8 | Employer / Recruiter (`employer_recruiter`) | Posts jobs on behalf of a company or themselves |
| 9 | Job Seeker (`job_seeker`) | Looking for work, not offering it |
| 10 | Dealer / Reseller (`dealer_reseller`) | Buys and resells goods, often used or in volume |
| 11 | Educator / Coach (`educator_coach`) | Teaches, tutors, trains, or coaches |
| 12 | Community Member (`community_member`) | Posts for a cause, group, event, or gives things away free |
| 13 | Animal Care Provider (`animal_care_provider`) | Breeds, shelters, or cares for animals professionally |

**Design intent:** multi-select, stackable (e.g. Property Owner + Business
Owner + Agent/Broker + Individual Seller all at once — matches Gopi's own
real-world example), plain English, global (identical across IN/UK/SG, not
country-specific).

### Category × Role Validation (summary)
Cross-checked against all 21 main categories in `config/categories/*.ts` — every
role maps to at least 2 categories, no dead roles found:
- **Individual Seller** + **Business Owner** are the two universal/default roles (~18-19 of 21 categories) — "default + upgrade" pair.
- **Job Seeker** / **Employer-Recruiter** is the one pair that's near-mutually-exclusive per-post (Jobs category only), not freely stackable like the rest.
- **Community Member** (Community category) and **Animal Care Provider** (Pets category) are the cleanest 1:1 mappings.

### Decisions Made (2026-07-12, under full delegated authority)

| # | Question | Decision |
|---|---|---|
| 1 | Skilled Worker/Tradesperson vs Service Provider? | **Split — Option B.** Added as its own role (`skilled_worker`). "Service Provider" reads like a consultant/professional; a plumber/carpenter/driver deserves a label that matches how they'd actually describe themselves. Final list is 13 roles, not 12. |
| 2 | Where do roles live in the Profile UI? | **Own dedicated section** (Gopi's explicit request) — a new "Roles" section between Basic Info and Contact Information, not folded into Basic Info. `role` was removed entirely from `BasicInfoValues`. |
| 3 | Hero Card — single badge or all roles? | First 2 role badges shown + a `+N` overflow badge if more are selected — keeps the hero card clean per accessibility/no-clutter philosophy while still surfacing multi-role identity at a glance. |
| 4 | Section UI — radio (single-select) or multi-select? | Multi-select toggle cards (label + description, `aria-pressed`, violet selected state) inside a `RolesEditor` dialog/drawer — consistent with the existing `ResponsiveEditor` pattern used by every other editor on this page. |
| 5 | Public profile page (separate, still-stub feature) | Deferred — reuse the same badge rendering (`getRoleLabel()` from `config/roles.ts`) when that page is built. Not in scope for this pass. |
| 6 | Max roles a user can pick | **Capped at 5** (`MAX_ROLES_PER_ACCOUNT` in `config/roles.ts`) — a UX cap, not a technical one, to keep the badge row readable. Attempting a 6th shows a toast and is blocked. |
| 7 | What's the default role for a new account, and can a profile ever show zero roles? | **"Individual Seller" is the default and the floor** (`DEFAULT_ROLE_ID` in `config/roles.ts`) — every classifieds marketplace user is at minimum an occasional seller. New accounts start with it pre-selected; `RolesEditor` blocks deselecting the last remaining role (toast: "You need at least one role selected") so a profile can never reach zero roles. |

### Implementation Summary
- **New file:** `src/config/roles.ts` — `ROLES` (13 items, `id`/`label`/`description`), `RoleId` type, `MAX_ROLES_PER_ACCOUNT = 5`, `getRoleById()`, `getRoleLabel()`. Single source of truth — same pattern as `config/categories/*.ts`.
- **`app/(dashboard)/profile/page.tsx` changes:**
  - Removed `role` from `BasicInfoValues` and its editor (radio group deleted).
  - Added `roleIds: RoleId[]` state, seeded with `["individual_seller", "business_owner", "property_owner", "agent_broker"]` — deliberately mirrors Gopi's own multi-hat example (flat owner + small business + part-time agent + casual seller).
  - New `RolesEditor` component (co-located, page-scoped) — multi-select toggle cards using `ResponsiveEditor`, enforces `MAX_ROLES_PER_ACCOUNT` with a toast when exceeded.
  - New "Roles" section (Section 3) rendering selected roles as violet badge chips, or an empty-state message if none selected, with an "Edit" action opening `RolesEditor`.
  - Hero Card now renders up to 2 role badges + `+N` overflow instead of the old single `basicInfo.role` badge.
- **`get_errors`**: clean on both files after implementation.

### Known Limitation (same pattern as rest of this feature)
| Limitation | Fix when |
|---|---|
| Roles saved to local component state only, no persistence | Auth + DB wired — `TODO [INTEGRATION]` comment in `config/roles.ts` documents the future `roles: string[]` field on the user document and the rule to always validate against `ROLES` server-side |

### Post-Implementation Gap Review (2026-07-12) — ✅ 4 gaps fixed
Live-tested in browser by Gopi after the Roles build. A full "check the whole
Profile page for gaps" review surfaced 4 items, all now resolved:

| # | Gap | Fix |
|---|---|---|
| 1 | `RolesEditor` Dialog (desktop) overflowed the viewport — no max-height or scroll, 13 items pushed off-screen | `ResponsiveEditor`'s `DialogContent` given `flex max-h-[85vh] flex-col`, children wrapper given `min-h-0 flex-1 overflow-y-auto` — fixed header/footer, scrollable middle. Drawer variant already had `max-h-[90dvh]` and was unaffected. |
| 2 | No affordance to preview the public-facing version of the profile | Added a "See what buyers see when they view your profile" row + disabled `LaButton` labelled "Preview — Soon" in the Public Profile section, with an informational toast. Real preview deferred until the public profile page exists. |
| 3 | "Member since 2022" hardcoded | Accepted as a known limitation (mock data has no real join date) — no fix needed for POC. |
| 4 | Email row's "Edit" button looked fully interactive but only opens a "contact support" toast — misleading affordance | `ContactRow` gained an `editLabel?: string` prop (defaults to `"Edit"`). Email row now passes `editLabel="Locked"`, rendered with a small `Lock` icon and muted slate-400 styling instead of the normal actionable slate-500/hover-dark treatment — reads as "locked", not "clickable edit". |

Also fixed alongside this review: Hero Card avatar showed hardcoded initials
`"GK"` regardless of the actual name. Added a `getInitials(fullName)` helper
(first letter of first two words, uppercased, `"?"` fallback) and wired
`Avatar initials={getInitials(basicInfo.fullName)}` in place of the literal
string.

`get_errors` clean on `page.tsx` after all of the above.

### v2 Redesign (2026-07-12, same day) — Single-View + Base Role + Custom Role
Gopi debated the picker UX and pushed for three changes, all agreed and built:

| # | Change | Rationale |
|---|---|---|
| 1 | Single view, not a 2-step wizard | A live "Selected" strip that updates as you tap *is* the review — no extra screen, no new stepper primitive needed (would've been a new-primitive STOP-rule trigger). Fewer navigation actions = better for low-vision use. |
| 2 | Individual Seller made fully implicit — pulled OUT of `ROLES`/`roleIds` entirely into a new `BASE_ROLE` constant in `config/roles.ts` | Directly reflects the product framing: "everyone is a seller, other roles are just hats you wear." `MAX_ROLES_PER_ACCOUNT` (5) now applies only to *additional* roles — no floor/never-zero logic needed since the base identity can't be unchecked, it isn't a checkbox. |
| 3 | Added a free-text "Say it in your own words" custom role — one slot, counts toward the cap of 5, validated 2–40 chars (`CUSTOM_ROLE_MIN_LENGTH`/`CUSTOM_ROLE_MAX_LENGTH` in `config/roles.ts`) | The 12 canonical roles are buckets; a real business (e.g. "Egg Farm Owner") never fits one exactly. Rendered with a dashed border everywhere to visually distinguish "your own words" from canonical/filterable roles. |
| 4 | Roles color switched from violet → blue everywhere (picker selected state, Hero Card badges, Roles section chips) | Violet was already doing double duty elsewhere on the page (identity card stripe, primary-location pill). Giving Roles its own color reduces cross-feature visual confusion. |

**Implementation:** `RolesEditor` now manages `{roleIds, customRole}` as one draft shape; live blue "Selected" strip renders above the picker list as roles/custom entries are toggled/added, with inline × remove per chip. Hero Card and the Roles section both now render `BASE_ROLE.label` first, then `roleIds`, then `customRole` (dashed chip) — combined into one label list for the Hero Card's first-2 + `+N` overflow logic.

`get_errors` clean on `page.tsx` and `config/roles.ts` after the v2 rebuild.

### Public Profile Section Cleanup (2026-07-12, same day)
Live-tested by Gopi again after `/u/[handle]` was moved from a snippet to a
real product route (see poc-tracker / repo memory) — three UX debates, all
agreed and built:

| # | Change | Rationale |
|---|---|---|
| 1 | "PROFILE HANDLE" label row removed — collapsed into an inline "Handle: @anto27" row | The `@` prefix is self-describing (same convention as Twitter/Instagram/GitHub) — a separate uppercase caption above it was redundant, not just tall. `lokalads.com/{handle}` link now sits directly below on its own line. |
| 2 | Handle link color darkened + made permanently underlined | `text-blue-700` + hover-only underline meant the only "this is clickable" signal was color, and only on hover (no signal at all on touch). Changed to `text-blue-800` + always-on `underline` — a real, input-agnostic link affordance, not just a color cue. |
| 3 | "Preview — Soon" disabled button → real enabled "Preview" button (`intent="primary-blue"`) linking to `/u/{handle}` | Now that `/u/[handle]` is a real route (moved from snippet this same session), keeping it disabled no longer made sense. This also resolved a live debate about the 3-line "See what buyers see…" helper text — it was over-explaining a button that didn't work; now it correctly describes a working action. |

`InfoRow`'s `subtextHref` link styling (used elsewhere for the same link-with-subtext pattern) updated to match — same darker/underlined treatment.

`get_errors` clean on `page.tsx` after all three changes.

### Handle Editor Redesign (2026-07-12, same day)
Live UX review of the "Set Your Handle" dialog/drawer — same debate-first pattern, multiple rounds:

| # | Change | Rationale |
|---|---|---|
| 1 | Removed the separate "Your public profile URL" preview card + struck-through old-handle line + manual "Check Availability" button | The preview card duplicated info already visible on the page just before opening this dialog; the manual check button forced an extra click for something that should just happen as you type (GitHub/Instagram/Vercel pattern). |
| 2 | Availability now auto-checks on type, debounced 500ms via `AbortController`-cancelled `fetch`, no button | Removes a whole interaction step. Same `POST /api/profile/check-handle` endpoint, just auto-triggered instead of manually gated. |
| 3 | Live URL preview moved to its own line **above** the input (`lokalads.com/{draft}`, `text-xl`, `break-all` so long handles wrap instead of truncating) | Gopi wanted a clear, read-only "preview" that's visually distinct from the editable field below — first tried baking the domain prefix into the input itself (chip-style), but decided a separate preview line above reads more unambiguously as "this is what you'll get," while the input stays a plain, single-purpose edit field. |
| 4 | Input kept plain (no prefix chip inside) — just the handle text, trailing status icon (spinner/check/✕) | Once the domain moved to its own preview line, baking `lokalads.com/` into the input as well was redundant and blurred what's actually editable vs. decorative. |
| 5 | Inline text feedback ("Available" / "Already taken — try another") replaces the old colored panel boxes | Panels were heavier than the message warranted; a single colored line under the input matches the compactness of the rest of the redesign. |
| 6 | Max handle length reduced from 30 → 20 characters (`HANDLE_REGEX`, char counter, helper text, slice cap) — updated in both `page.tsx` and `app/api/profile/check-handle/route.ts` | Compared against Twitter (15), Instagram (30), TikTok (24), GitHub (39), Facebook (50), LinkedIn (100, rarely used in full). 20 comfortably fits real names/business names for a seller-facing handle without inviting unwieldy URLs — chosen as the practical middle ground. |

**Implementation:** `HandleEditor`'s `form` JSX rewritten — live preview `<p>` (read-only) sits above a plain bordered input wrapper; a `useEffect` debounce replaced the old manual `checkAvailability()` handler; `canCheck`/manual-trigger logic removed entirely since checking is now automatic. Regex and slice cap updated in two files to stay in sync.

`get_errors` clean on `page.tsx` and `app/api/profile/check-handle/route.ts` after all changes.

---

## 🔵 DISCOVERY ✅ — Signed off 2026-07-09

### Problem Statement
Users have no place to manage their identity, contact details, or account settings. Gap #6 in poc-tracker. Without a real profile page, trust features, public URLs, and account safety flows have no entry point.

### Who Is Affected

| User Type | How They Are Affected |
|---|---|
| Authenticated user | Cannot manage their own profile, contact info, or account |
| Buyer viewing a listing | Cannot click through to a seller's public profile URL |
| Admin | Cannot verify user identity without residence/contact data |

### All Use Cases

| # | Use Case |
|---|---|
| 1 | View my profile hero (name, handle, member since) |
| 2 | Set or change my custom handle |
| 3 | Check if a desired handle is available before committing |
| 4 | Edit basic info (name, DOB, gender, role) |
| 5 | View my email with verified status |
| 6 | Edit primary phone number |
| 7 | Edit secondary phone number |
| 8 | Remove secondary phone number |
| 9 | Add a saved location |
| 10 | Remove a saved location |
| 11 | Edit my residence details (country, state, city, postal) |
| 12 | Navigate to Reset Password |
| 13 | See 2FA and Notifications as coming-soon (non-interactive) |
| 14 | Initiate account deletion (Danger Zone) |
| 15 | Unauthenticated visitor — sees mock data with TODO guard (POC only) |

### What This Is NOT (explicit out-of-scope for v1)
- Photo upload (button hidden — ship when real)
- Email change / re-verification flow (security-sensitive — v2)
- Real auth guard (session stub returns a mock logged-in user, not null — see `.github/skills/la-auth/SKILL.md` — commented TODO)
- Trust score display (no algorithm yet — introduce when earned)
- 2FA implementation
- Notification preferences
- Connected accounts
- Public profile view (separate feature)

### Open Questions — All Answered ✅

| # | Question | Answer | Date |
|---|---|---|---|
| 1 | Show Trust score in hero card? | No — Member since only. Trust score when algorithm is real | 2026-07-09 |
| 2 | Edit photo button? | Hidden — ship when real. No false affordance | 2026-07-09 |
| 3 | Handle format rules? | 3–30 chars, `[a-z0-9_]`, auto-lowercased, no hyphens | 2026-07-09 |
| 4 | Handle availability check in scope? | Yes — `POST /api/profile/check-handle` | 2026-07-09 |
| 5 | Email editable? | Read-only + Verified badge. No edit in v1 | 2026-07-09 |
| 6 | Phone behaviour? | Primary: edit only. Secondary: edit + removable | 2026-07-09 |
| 7 | Unauthenticated access? | Mock data for POC, prominent TODO comment for real guard | 2026-07-09 |

---

## 🟣 REFINEMENT ✅ — Signed off 2026-07-09

### Agreed Scope (v1 — in)
- Hero card: name, @handle, role badge, Member since
- Section 1 — Set handle with availability check (`POST /api/profile/check-handle`)
- Section 2 — Edit basic info (name, DOB, gender, role)
- Section 3 — Email read-only + Verified badge · Primary phone edit · Secondary phone edit + removable
- Section 4 — Saved locations: add via LocationPicker, remove with confirmation
- Section 5 — Residence: country*, state*, city*, postal (optional) — edit drawer
- Section 6 — Reset Password row (interactive) · 2FA row (disabled/soon) · Notifications row (disabled/soon)
- Section 7 — Danger Zone → `useDeleteAccountStore` → delete account flow

### Deferred to Later

| Item | Reason |
|---|---|
| Photo upload | No upload infrastructure yet |
| Email change | Security-sensitive re-verification flow — own feature |
| Real auth guard | Session stub returns a mock logged-in user (not null) — add real redirect-if-null guard when auth provider is wired |
| Trust score | No algorithm yet — introduce when earned |
| 2FA | Requires separate auth infrastructure |
| Notification preferences | Requires notification system |
| Public profile view | Separate feature |

### Constraints & Non-Negotiables
- **Accessibility:** `text-sm` minimum everywhere · `font-medium`/`font-semibold` for labels · `border-slate-300` minimum for interactive borders · all actions have `aria-label`
- **Security:** Handle input stripped of disallowed chars on type · API validates + sanitises server-side · No PII logged
- **Performance:** Handle check is on-demand (user taps button) — not on every keystroke

### Dependencies

| Dependency | Status |
|---|---|
| `LocationPicker` | ✅ Exists |
| `DateInput` | ✅ Exists |
| `useDeleteAccountStore` | ✅ Exists |
| `useMediaQuery` | ✅ Exists |
| `Dialog`, `Drawer`, `AlertDialog` | ✅ Exists |
| `POST /api/profile/check-handle` | ❌ New — to be built |
| Real auth / session | ❌ Not available — mock data for POC |

---

## 🎨 DESIGN ✅ — Signed off 2026-07-09

### User Flows

| Flow | Steps |
|---|---|
| A — Set Handle | Tap "Set Handle" → drawer/dialog → type handle (auto-lowercased, bad chars stripped) → tap "Check Availability" → green (available) or red (taken) feedback → "Set Handle" enables only when available → tap → drawer closes → handle updates on page |
| B — Edit Basic Info / Residence | Tap "Edit" → drawer/dialog with current values pre-filled → edit → "Save Changes" → closes → values update |
| C — Edit Phone | Tap "Edit" next to phone → drawer with current number → edit → "Save" → closes → number updates |
| D — Remove Secondary Phone | Tap remove icon → confirmation AlertDialog → confirm → row removed |
| E — Saved Locations | "Add" → LocationPicker → select → added to list · Trash icon → confirmation AlertDialog → confirm → removed |
| F — Danger Zone | "Delete Account" → `checkEligibility()` → eligible → redirect to delete-account confirm flow |
| G — Reset Password | Tap row → toast "Password reset link sent to your email" |

### Screen Inventory

| Screen / State | Trigger |
|---|---|
| Profile page (default) | `/profile` |
| Handle editor (drawer mobile / dialog desktop) | "Set Handle" tap |
| Basic info editor (drawer / dialog) | "Edit" on Basic Info |
| Phone editor (drawer / dialog) | "Edit" on any phone row |
| Residence editor (drawer / dialog) | "Edit" on My Residence |
| Location remove confirmation (AlertDialog) | Trash icon on saved location |
| Delete account confirm flow | "Delete Account" button |
| Reset Password feedback | Toast — stays on profile page |

### Responsive & Accessibility Decisions
- All editors: Dialog on `md+` (768px+), Drawer on mobile — single `ResponsiveEditor` wrapper
- All drawer/dialog titles are semantic headings via `DialogTitle` / `DrawerTitle`
- Destructive confirm buttons use `variant="destructive"`
- All icon-only buttons have `aria-label`
- Disabled rows (2FA, Notifications) have `disabled` attribute + "Soon" badge

---

## 🟠 ARCHITECTURE ✅ — Signed off 2026-07-09 · Score 9.2/10

### Chosen Approach — Option C
Single `"use client"` page file. `ResponsiveEditor` wrapper extracts Dialog/Drawer chrome (reused 4×). `HandleEditor` standalone — needs custom save-disabled logic tied to availability check state.

### New Files
```
src/app/(dashboard)/profile/page.tsx          — rewrite stub (single file, all editors inline)
src/app/api/profile/check-handle/route.ts     — POST handle availability check
```

### TypeScript Types (all local to page.tsx)
```ts
type BasicInfoValues  = { fullName: string; dateOfBirthIso: string; gender: "Male"|"Female"|"Other"; role: "Individual"|"Business"|"Agent" }
type ResidenceValues  = { country: string; state: string; city: string; postalCode: string }
type ContactValues    = { email: string; emailVerified: boolean; primaryPhone: string; secondaryPhone: string }
type SavedLocation    = { id: number; flag: string; city: string; region: string; country: string; primary?: boolean }
```

### API Contract — POST /api/profile/check-handle
```
Request:  { handle: string }
Response: { available: boolean, handle: string }
Errors:   400 { error: string }
```

### Handle Rules
- Regex: `^[a-z0-9_]{3,30}$`
- Stripped on type (disallowed chars removed, auto-lowercased)
- Check is on-demand (button tap) — not on every keystroke

### Component Map
| Component | Source |
|---|---|
| `Avatar` | `@/components/avatar/Avatar` |
| `LaButton`, `LaCard`, `LaInput`, `LaRadio` | `@/components/la` |
| `LocationPicker` | `@/components/location-picker` |
| `DateInput` | `@/components/date-input` |
| `Dialog`, `Drawer`, `AlertDialog` | `@/components/ui/*` |
| `useDeleteAccountStore` | `@/lib/stores/deleteAccountStore` |
| `useMediaQuery` | `@/lib/hooks/useMediaQuery` |
| `toast` (sonner) | `sonner` |

### Key Patterns
- Conditional render: `{open && <Editor open={open} .../>}` — fresh state on every open
- Responsive: `useMediaQuery("(min-width: 768px)")` → Dialog (desktop) / Drawer (mobile)
- Auth guard: prominent TODO comment — mock data for POC

---

## 🟡 PLANNING ✅ — Signed off 2026-07-09

### Milestone 1 — API Route
| # | Task | Status |
|---|---|---|
| 1.1 | Create `app/api/profile/check-handle/route.ts` | ⬜ |

### Milestone 2 — Page Foundation
| # | Task | Status |
|---|---|---|
| 2.1 | Rewrite stub — page shell, sticky inner header, `bg-slate-50` main | ⬜ |
| 2.2 | Hero Card — avatar (no edit button), name, @handle, role badge, Member since only | ⬜ |
| 2.3 | Layout atoms — `Section`, `InfoRow`, `ContactRow`, `SettingsRow` | ⬜ |
| 2.4 | `ResponsiveEditor` wrapper (Dialog desktop / Drawer mobile) | ⬜ |

### Milestone 3 — Sections
| # | Task | Status |
|---|---|---|
| 3.1 | Section 1 — Public Profile + `HandleEditor` (format validation, availability check, URL preview) | ⬜ |
| 3.2 | Section 2 — Basic Info + `BasicInfoEditor` (name, DOB, gender, role) | ⬜ |
| 3.3 | Section 3 — Contact Info (email read-only + badge, primary edit, secondary edit + removable) | ⬜ |
| 3.4 | Section 4 — Saved Locations (add via LocationPicker, remove with AlertDialog) | ⬜ |
| 3.5 | Section 5 — Residence + `ResidenceEditor` | ⬜ |
| 3.6 | Section 6 — Account Settings (Reset Password → toast, 2FA/Notifications disabled + Soon badge) | ⬜ |
| 3.7 | Section 7 — Danger Zone (`useDeleteAccountStore` wired) | ⬜ |

### Milestone 4 — Polish & Verify
| # | Task | Status |
|---|---|---|
| 4.1 | Accessibility pass — all `aria-label`, min text sizes, contrast | ⬜ |
| 4.2 | TypeScript + lint clean | ⬜ |

### POC Credential Check
No external API keys needed. `check-handle` uses local reserved list. ✅ No design-system swap needed.

---

## 🔨 IMPLEMENTATION ✅ — Completed 2026-07-09

### Milestone 1 — API Route
| # | Task | Status |
|---|---|---|
| 1.1 | Create `app/api/profile/check-handle/route.ts` | ✅ |

### Milestone 2 — Page Foundation
| # | Task | Status |
|---|---|---|
| 2.1 | Rewrite stub — page shell, sticky inner header, `bg-slate-50` main | ✅ |
| 2.2 | Hero Card — avatar (no edit button), name, @handle, role badge, Member since only | ✅ |
| 2.3 | Layout atoms — `Section`, `InfoRow`, `ContactRow`, `SettingsRow` | ✅ |
| 2.4 | `ResponsiveEditor` wrapper (Dialog desktop / Drawer mobile) | ✅ |

### Milestone 3 — Sections
| # | Task | Status |
|---|---|---|
| 3.1 | Section 1 — Public Profile + `HandleEditor` | ✅ |
| 3.2 | Section 2 — Basic Info + `BasicInfoEditor` | ✅ |
| 3.3 | Section 3 — Contact Info (email read-only, primary edit, secondary edit + removable) | ✅ |
| 3.4 | Section 4 — Saved Locations | ✅ |
| 3.5 | Section 5 — Residence + `ResidenceEditor` | ✅ |
| 3.6 | Section 6 — Account Settings | ✅ |
| 3.7 | Section 7 — Danger Zone | ✅ |

### Milestone 4 — Polish & Verify
| # | Task | Status |
|---|---|---|
| 4.1 | Accessibility pass | ✅ |
| 4.2 | TypeScript + lint clean | ✅ |

### Known Limitations (v1)
| Limitation | Fix when |
|---|---|
| Mock data only — no DB reads/writes | Auth + DB wired |
| Handle check uses hard-coded reserved list | User model has `handle` field indexed |
| All edits save locally (no API) | Profile API endpoints built |
| Delete account routes to `/snippets/...` | Real delete-account route built |
| Auth guard is a TODO comment | Real auth provider wired |

---

**Current Phase: � CODE FREEZE — Signed off 2026-07-09**

### Final Status
- Visual QA: ✅ Passed
- UX Refinement: ✅ Owner signed off
- All planned tasks: ✅ Complete
- TypeScript + lint: ✅ Clean

### Known Limitations (v1)
| Limitation | Fix when |
|---|---|
| Mock data only — no DB reads/writes | Auth + DB wired |
| Handle check uses hard-coded reserved list | User model has `handle` field indexed |
| All edits save locally (no API) | Profile API endpoints built |
| Delete account routes to `/snippets/...` | Real delete-account route built |
| Auth guard is a TODO comment | Real auth provider wired |

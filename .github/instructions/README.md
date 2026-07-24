# Copilot Instruction Files

These files are auto-loaded by GitHub Copilot based on the files you are editing.
No manual action needed — the right rules inject automatically.

---

## How They Work

Each file has a front-matter `applyTo` glob. When Copilot edits a file matching that
glob, the instruction file is injected into context automatically.

---

## Files

| File | applyTo | Purpose |
|---|---|---|
| `component-styling.instructions.md` | `components/**/*.tsx` · `app/**/*.tsx` | Component layer hierarchy (la/ → la-blocks/ → ui/), co-location rule, Tailwind colour conventions, accessibility rules |
| `la-feature-spec.instructions.md` | `app/**` · `components/**` · `lib/**` | FSD (Feature Spec Document) rules — 12-phase lifecycle, phase gates, architecture sign-off scoring, keeping FSD in sync during implementation |
| `la-new-feature.instructions.md` | `app/**` · `components/**` · `lib/**` | New feature ritual — 12-step checklist from DISCOVERY through to IMPLEMENTATION; POC stage checks; file-move dev server restart reminder |
| `la-email-engine.instructions.md` | `lib/email/**` | Email engine architecture, the no-JSX/no-react-dom rule, 3 base helpers (baseEmail · s · esc), 6-step checklist for adding a new email type, production wiring checklist |
| `la-api-route.instructions.md` | `app/api/**` | API route rules — no direct external calls from components, response shape convention, input sanitisation, dev-only guards, rate limiting, DB singleton usage, email sending pattern |

---

## Adding a New Instruction File

1. Create `[name].instructions.md` in this folder
2. Add front-matter: `applyTo: "glob/pattern/**"`
3. Add a row to the table above
4. Prefix with `la-` if it's a LokalAds workflow rule; no prefix if it's a generic coding rule

# Component Architecture — LokalAds

> Status: ✅ Complete  
> Priority: **4 — Any contributor building or extending UI.**

---

## Files

| File | Topic |
|---|---|
| `01-three-layer-system.md` | `la/` → `la-blocks/` → `ui/` — what belongs where, import rules, why the layers exist |
| `02-la-primitives.md` | Every component in `components/la/` — props, variants, usage examples |
| `03-la-blocks.md` | Every component in `components/la-blocks/` — purpose, props, rules |
| `04-feature-components.md` | Self-contained feature components — index, barrel pattern, when to create |
| `05-conventions.md` | File naming · CVA patterns · `cn()` usage · no inline styles · accessibility rules |

## `feature/` subfolder

Detailed per-component documentation for all 14 documented feature components:

`avatar.md` · `create-alert.md` · `date-input.md` · `email-otp.md` · `good-to-know.md`  
`image-gallery.md` · `la-search-bar.md` · `location-picker.md` · `overlay-country-select.md` · `phone-number-input.md`  
`phone-otp-v2.md` · `rich-text-editor.md` · `timeline.md` · `toggle-group.md`

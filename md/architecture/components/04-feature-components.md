# Feature Components — Index

> Self-contained feature components in `components/`.  
> Each has an `index.ts` barrel. Each has a design-system or snippets demo.  
> Last updated: 2026-07-07

---

## All Feature Components

| Component | Folder | Demo | Detailed doc |
|---|---|---|---|
| Avatar + AvatarDropdown | `avatar/` | `/design-system/feature/avatar` | [feature/avatar.md](feature/avatar.md) |
| Create Alert | `create-alert/` | `/snippets/create-alert` | [feature/create-alert.md](feature/create-alert.md) |
| Date Input | `date-input/` | `/snippets/date-input` | [feature/date-input.md](feature/date-input.md) |
| Email OTP | `email-otp/` | `/snippets/login` | [feature/email-otp.md](feature/email-otp.md) |
| Good To Know | `good-to-know/` | `/design-system/feature/good-to-know` | [feature/good-to-know.md](feature/good-to-know.md) |
| Image Gallery | `la-image-gallery/` | `/design-system/uxcomp/image-gallery` | [feature/image-gallery.md](feature/image-gallery.md) |
| Location Picker | `location-picker/` | `/snippets/location-picker` | [feature/location-picker.md](feature/location-picker.md) |
| Overlay Country Select | `overlay-country-select/` | `/snippets/switch-country` | [feature/overlay-country-select.md](feature/overlay-country-select.md) |
| Phone Number Input | `phone-number-input/` | `/snippets/phone-number-input` | [feature/phone-number-input.md](feature/phone-number-input.md) |
| Phone OTP v2 | `phone-otp-v2/` | `/phone-otp-v2` | [feature/phone-otp-v2.md](feature/phone-otp-v2.md) |
| Rich Text Editor | `rich-text-editor/` | `/snippets/rich-text-editor` | [feature/rich-text-editor.md](feature/rich-text-editor.md) |
| Timeline | `timeline/` | `/snippets/timeline` | [feature/timeline.md](feature/timeline.md) |
| Toggle Group | `toggle-group/` | `/snippets/toggle-group` | [feature/toggle-group.md](feature/toggle-group.md) |

---

## Components without detailed docs (stubs)

These exist in `components/` but have no standalone documentation yet:

| Component | Folder | Status |
|---|---|---|
| Browser Guard | `browser-guard/` | No doc — see `proxy.ts` for UA-block logic |
| Collapsible Panel | `collapsible/` | No doc |
| Country Provider + Badge | `country/` | See `state/01-principles.md` |
| Error Page | `error-page/` | No doc |
| Feedback | `feedback/` | No doc |
| Icons | `icons/` | No doc — use `lucide-react` directly for standard icons |
| Report Ad | `report-ad/` | No doc — API wired to `app/api/reports/` |
| Responsive Dialog | `responsive-dialog/` | No doc |
| LA Search Bar | `la-search-bar/` | [feature/la-search-bar.md](feature/la-search-bar.md) |

---

## What "Self-Contained" Means

A feature component:

1. Has a named folder in `components/[feature-name]/`
2. Exports everything via `index.ts` — pages import from the barrel, never from internal files
3. Owns its own types, sub-components, and internal hooks
4. Has a demo page — either `/design-system/` or `/snippets/`
5. Registered in `lib/design-system-menu.ts` if it has a design-system demo

---

## When to Create a New Feature Component

```
Does it need to be used on 2+ separate pages?   → YES → new components/[name]/ + barrel + demo
Is it only used by one page?                    → NO  → co-locate with page.tsx
Is it a UI primitive (button, text, field)?     → NO  → it belongs in components/la/ instead
```

---

## Barrel Export Pattern

Every feature component must export via `index.ts`:

```ts
// components/create-alert/index.ts
export { CreateAlertBanner } from "./CreateAlertBanner";
export { CreateAlertDialog } from "./CreateAlertDialog";
export type { AlertPayload } from "./types";

// Usage in page:
import { CreateAlertBanner, type AlertPayload } from "@/components/create-alert";
```

Never import from internal files directly:
```ts
// ❌ Wrong
import { CreateAlertJourney } from "@/components/create-alert/CreateAlertJourney";

// ✅ Right
import { CreateAlertBanner } from "@/components/create-alert";
```

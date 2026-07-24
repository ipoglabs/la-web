# Avatar & AvatarDropdown

Two components that work together:
- `Avatar` — displays a user image with initials fallback, status dot, and shape variant
- `AvatarDropdown` — clickable avatar that opens a profile navigation menu (popover on desktop, drawer on mobile)

**Files:**
- `components/avatar/Avatar.tsx`
- `components/avatar/AvatarDropdown.tsx`

---

## Avatar

### Import

```tsx
import { Avatar } from "@/components/avatar/Avatar";
```

### Usage

```tsx
// With image + status
<Avatar src="/img/user.jpg" alt="Jane Doe" initials="JD" size="md" status="online" />

// Initials only
<Avatar initials="KG" size="lg" status="busy" />

// Rounded shape (for non-person entities)
<Avatar initials="SC" size="md" shape="rounded" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image URL. Falls back to initials on load error. |
| `alt` | `string` | `""` | Alt text for the image. |
| `initials` | `string` | `"?"` | 1–2 characters shown when no image available. |
| `size` | `"xs"` `"sm"` `"md"` `"lg"` `"xl"` | `"md"` | Visual size. |
| `status` | `"online"` `"busy"` `"offline"` `"none"` | `"none"` | Status dot shown at bottom-right. |
| `shape` | `"circle"` `"rounded"` | `"circle"` | `circle` = `rounded-full`, `rounded` = `rounded-xl`. |
| `className` | `string` | — | Extra classes on the root element. |

### Size reference

| Size | Container | Use case |
|---|---|---|
| `xs` | 24×24px | Compact lists, timestamps |
| `sm` | 32×32px | Table rows, comments |
| `md` | 40×40px | Standard use (default) |
| `lg` | 48×48px | Profile headers |
| `xl` | 64×64px | Full profile view |

### Status dot colours

| Status | Colour |
|---|---|
| `online` | Emerald green |
| `busy` | Rose red |
| `offline` | Slate grey |
| `none` | Hidden |

### Image error handling

If `src` fails to load, the component automatically falls back to the `initials` display.
When `src` changes (e.g. user updates photo), the error state resets so the new image is retried.

---

## AvatarDropdown

### Import

```tsx
import { AvatarDropdown } from "@/components/avatar/AvatarDropdown";
```

### Usage

```tsx
<AvatarDropdown
  name="Karthik G"
  subtitle="Member"
  initials="KG"
  src="/img/user.jpg"
/>
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | required | User's display name shown in the menu header. |
| `subtitle` | `string` | `"Member"` | Secondary line — role, email, plan, etc. |
| `initials` | `string` | `"?"` | Fallback for the avatar when no image. |
| `src` | `string` | — | Avatar image URL. |

### Menu items

| Item | Icon | Action |
|---|---|---|
| My Ads | LayoutGrid | Navigate to user's listings |
| Chat | MessageCircle | Navigate to messages |
| Profile | User | Navigate to profile settings |
| Switch Country | Globe2 | Navigate to country switcher |
| Sign out | LogOut (rose) | Triggers sign-out flow |

### Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| Mobile (`< sm`) | Vaul Drawer slides up from bottom — native feel on touch devices |
| Desktop (`≥ sm`) | Floating popover card (`w-56`) positioned below the avatar, closes on outside click |

The component detects breakpoint via `window.matchMedia("(min-width: 640px)")` on mount and updates on resize.

### Design notes

- Avatar in the menu header always shows `status="online"` (can be made dynamic if needed)
- Sign out is visually separated with a divider and rendered in rose to signal a destructive action
- Popover uses `z-50` to sit above all standard page content

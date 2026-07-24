# LaImageGallery — Component Documentation

## Overview

A full-featured image gallery and carousel with slide/fade transitions, fullscreen overlay, touch swipe, keyboard navigation, thumbnail strip, autoplay, and per-image error recovery.

**Files:**
- `components/la-image-gallery/LaImageGallery.tsx`
- `components/la-image-gallery/index.ts`
- **Demo:** `app/design-system/uxcomp/image-gallery/page.tsx` (11 use cases)

---

## At a Glance

| Attribute | Value |
|---|---|
| Component | `LaImageGallery` |
| Location | `components/la-image-gallery/` |
| Type | Client Component (`"use client"`) |
| Max images | 10 |
| Image element | Plain `<img>` (not next/image — arbitrary URLs work without hostname config) |

---

## Usage

```tsx
import { LaImageGallery, type GalleryImageItem } from "@/components/la-image-gallery";

const images: GalleryImageItem[] = [
  { src: "/img/listing-1.jpg", alt: "Front view", caption: "Main entrance" },
  { src: "/img/listing-2.jpg", alt: "Living room" },
];

<LaImageGallery images={images} />
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `images` | `GalleryImageItem[]` | required | Image list — max 10 |
| `badge` | `string` | — | Badge text shown top-left |
| `badgeVariant` | `"default" \| "rose" \| "amber" \| "blue" \| "green"` | `"default"` | Badge colour |
| `aspectRatio` | `"4/3" \| "16/9" \| "3/2" \| "1/1"` | `"4/3"` | Viewport aspect ratio |
| `showThumbnails` | `boolean` | `true` | Show scrollable thumbnail strip |
| `showPhotoCount` | `boolean` | `true` | Show `1/N` counter badge |
| `allowFullscreen` | `boolean` | `true` | Show expand-to-fullscreen button |
| `transition` | `"slide" \| "fade"` | `"slide"` | Transition between images |
| `autoPlay` | `boolean` | `false` | Auto-advance slideshow |
| `autoPlayInterval` | `number` | `3000` | Autoplay interval in ms |
| `onImageChange` | `(index: number) => void` | — | Called on every image change |
| `className` | `string` | — | Extra classes on root element |

### `GalleryImageItem`

```ts
interface GalleryImageItem {
  src: string;
  alt?: string;
  caption?: string;   // shown in frosted bar in fullscreen only
}
```

---

## Features

| Feature | Details |
|---|---|
| Navigation arrows | Desktop: hover-reveal dark circle buttons |
| Touch swipe | Mobile: ≥36px threshold triggers prev/next |
| Keyboard | `←` `→` navigate · `Esc` closes fullscreen |
| Thumbnail strip | Scrollable, thick-ring active highlight, auto-scrolls into view |
| Pagination dots | Shown when `showThumbnails={false}`, pill-style, max 10 |
| Fullscreen | `Maximize2` button → fixed `inset-0` dark overlay · `X` to close |
| Caption | Frosted bar in fullscreen only (not shown in normal view) |
| AutoPlay | Play/pause hover-reveal button, pauses when fullscreen opens |
| Body scroll lock | Locked when fullscreen is open, restored on close |
| Photo counter | `1/N` badge — hide with `showPhotoCount={false}` |
| Image preload | ±1 neighbour images preloaded for instant prev/next |
| Error recovery | Broken `src` → grey tile + `ImageOff` icon (per slot, independent) |
| Empty state | `images={[]}` → Camera icon + "No photos available" |

---

## Fullscreen Layout

```
┌────────────────────────────────────┐
│  [←]    [Image]    [→]   [X]       │
│                                     │
│  Caption bar (above thumbnails)     │
│  1 / 5 counter                      │
│  ─────────────────────────────────  │
│  [thumb][thumb][thumb][thumb]        │ ← 104px strip
└────────────────────────────────────┘
```

- Counter: `bottom-28` — clears the ~104px thumbnail strip
- Caption bar: `bottom-36` — sits above counter
- Thumbnail strip: `absolute bottom-0`, height ~104px

---

## Use Cases (demo page)

| # | Description |
|---|---|
| 1 | Default — slide transition, thumbnails |
| 2 | Fade transition |
| 3 | No thumbnails (dots pagination) |
| 4 | `16/9` aspect ratio |
| 5 | `1/1` square |
| 6 | Badge (variant: rose) |
| 7 | AutoPlay enabled |
| 8 | Fullscreen disabled (`allowFullscreen={false}`) |
| 9 | Single image |
| 10 | With captions |
| 11 | Error recovery (broken src URLs) |

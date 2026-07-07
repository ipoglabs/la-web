"use client";

import { LaImageGallery } from "@/components/la-image-gallery";

// ─── Image sets — placehold.co (themed colours, no network config needed) ─────
// Uses plain <img> so any URL works — no next.config.ts remotePatterns required.

const IMAGES_8 = [
  { src: "https://placehold.co/900x675/334155/e2e8f0?text=Living+Room",    alt: "Living room",    caption: "Spacious living room with natural light" },
  { src: "https://placehold.co/900x675/1e3a5f/bfdbfe?text=Master+Bedroom", alt: "Master bedroom", caption: "Master bedroom with en-suite" },
  { src: "https://placehold.co/900x675/1c3d2e/bbf7d0?text=Kitchen",        alt: "Kitchen",        caption: "Modern open-plan kitchen" },
  { src: "https://placehold.co/900x675/2d4a22/d9f99d?text=Garden",         alt: "Garden",         caption: "Private garden — south facing" },
  { src: "https://placehold.co/900x675/1a3a4a/bae6fd?text=Bathroom",       alt: "Bathroom",       caption: "Family bathroom with walk-in shower" },
  { src: "https://placehold.co/900x675/3d2a1a/fed7aa?text=Dining+Area",    alt: "Dining area",    caption: "Dining area with garden view" },
  { src: "https://placehold.co/900x675/2a1a3d/e9d5ff?text=Home+Office",    alt: "Office",         caption: "Home office / 4th bedroom" },
  { src: "https://placehold.co/900x675/1a1a2e/c7d2fe?text=Exterior",       alt: "Exterior",       caption: "Front elevation — quiet cul-de-sac" },
];

const IMAGES_6_WIDE = [
  { src: "https://placehold.co/1280x720/0f172a/94a3b8?text=City+Skyline",     alt: "City skyline" },
  { src: "https://placehold.co/1280x720/172554/93c5fd?text=Rooftop+Terrace",  alt: "Rooftop terrace" },
  { src: "https://placehold.co/1280x720/052e16/86efac?text=Pool+Area",        alt: "Pool area" },
  { src: "https://placehold.co/1280x720/2d1b69/c4b5fd?text=Lounge+Bar",      alt: "Lounge bar" },
  { src: "https://placehold.co/1280x720/431407/fdba74?text=Gym",              alt: "Gym" },
  { src: "https://placehold.co/1280x720/164e63/67e8f9?text=Spa",              alt: "Spa" },
];

const IMAGES_5_SQ = [
  { src: "https://placehold.co/700x700/334155/e2e8f0?text=Interior+1", alt: "Interior 1" },
  { src: "https://placehold.co/700x700/1e3a5f/bfdbfe?text=Interior+2", alt: "Interior 2" },
  { src: "https://placehold.co/700x700/1c3d2e/bbf7d0?text=Interior+3", alt: "Interior 3" },
  { src: "https://placehold.co/700x700/3d2a1a/fed7aa?text=Interior+4", alt: "Interior 4" },
  { src: "https://placehold.co/700x700/2a1a3d/e9d5ff?text=Interior+5", alt: "Interior 5" },
];

const IMAGE_SINGLE = [
  { src: "https://placehold.co/900x675/334155/e2e8f0?text=Property+Photo", alt: "Property", caption: "Only photo available" },
];

// Mixed: valid placehold.co + broken hostnames — onError fires, grey tile shown
const IMAGES_MIXED_BROKEN = [
  { src: "https://placehold.co/900x675/334155/e2e8f0?text=Image+1", alt: "OK image 1" },
  { src: "https://broken.invalid/image.jpg",                        alt: "Broken image" },
  { src: "https://placehold.co/900x675/1c3d2e/bbf7d0?text=Image+3", alt: "OK image 2" },
  { src: "https://broken.invalid/photo.jpg",                        alt: "Another broken" },
  { src: "https://placehold.co/900x675/1a3a4a/bae6fd?text=Image+5", alt: "OK image 3" },
];

const IMAGES_ALL_BROKEN = [
  { src: "https://broken.invalid/1.jpg", alt: "Broken 1" },
  { src: "https://broken.invalid/2.jpg", alt: "Broken 2" },
  { src: "https://broken.invalid/3.jpg", alt: "Broken 3" },
];

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

// ─── Developer Guide sub-components ──────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-900 px-5 py-4 text-xs leading-relaxed text-slate-200">
      <code>{children}</code>
    </pre>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ImageGalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-16">

        {/* ── Header ── */}
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">
            UX Components
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Image Gallery
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Full-featured image carousel. Swipe, keyboard nav, thumbnail strip, pagination dots,
            fullscreen overlay, per-image captions, auto-play slideshow, slide/fade transitions,
            and per-image error recovery.
          </p>
        </div>

        {/* ════════════════════════ USE CASES ════════════════════════ */}

        {/* 1 — Full gallery */}
        <Section
          id="full"
          title="1 — Full Gallery"
          description="8 images · badge · thumbnail strip · fullscreen · slide transition. Hover the image for nav arrows and expand button."
        >
          <div className="max-w-lg">
            <LaImageGallery
              images={IMAGES_8}
              badge="For Sale"
              badgeVariant="blue"
              aspectRatio="4/3"
              showThumbnails
              showPhotoCount
              allowFullscreen
              transition="slide"
            />
          </div>
        </Section>

        {/* 2 — Cinematic 16/9 with fade */}
        <Section
          id="cinematic"
          title="2 — Cinematic 16 / 9 · Fade Transition"
          description="Wide format — great for property hero shots, hotel listings, venue showcases."
        >
          <LaImageGallery
            images={IMAGES_6_WIDE}
            badge="Featured"
            badgeVariant="amber"
            aspectRatio="16/9"
            showThumbnails
            transition="fade"
            allowFullscreen
          />
        </Section>

        {/* 3 — Square aspect */}
        <Section
          id="square"
          title="3 — Square Format (1:1)"
          description="Perfect for social-style listings or product galleries."
        >
          <div className="max-w-sm">
            <LaImageGallery
              images={IMAGES_5_SQ}
              aspectRatio="1/1"
              showThumbnails
              allowFullscreen
            />
          </div>
        </Section>

        {/* 4 — No thumbnails → pagination dots */}
        <Section
          id="dots"
          title="4 — No Thumbnails → Pagination Dots"
          description="showThumbnails={false} collapses the strip and shows pill-dots instead. Active dot expands to a wider pill."
        >
          <div className="max-w-lg">
            <LaImageGallery
              images={IMAGES_8.slice(0, 6)}
              badge="New"
              badgeVariant="green"
              aspectRatio="4/3"
              showThumbnails={false}
              showPhotoCount={false}
              allowFullscreen
            />
          </div>
        </Section>

        {/* 5 — Auto-play slideshow */}
        <Section
          id="autoplay"
          title="5 — Auto-Play Slideshow"
          description="autoPlay demo — currently paused so it doesn't jump while scrolling. Click the play button on the gallery to start the 2 s slideshow."
        >
          <div className="max-w-lg">
            <LaImageGallery
              images={IMAGES_8}
              badge="Open Day"
              badgeVariant="rose"
              aspectRatio="4/3"
              showThumbnails
              autoPlay={false}
              autoPlayInterval={2000}
              allowFullscreen
            />
          </div>
        </Section>

        {/* 6 — No counter, no fullscreen (embed mode) */}
        <Section
          id="embed"
          title="6 — Embed Mode"
          description="allowFullscreen={false} · showPhotoCount={false} — ideal for tight card layouts where fullscreen would be disruptive."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LaImageGallery
              images={IMAGES_8.slice(0, 4)}
              aspectRatio="4/3"
              showThumbnails={false}
              showPhotoCount={false}
              allowFullscreen={false}
            />
            <LaImageGallery
              images={IMAGES_5_SQ.slice(0, 3)}
              aspectRatio="4/3"
              showThumbnails={false}
              showPhotoCount={false}
              allowFullscreen={false}
            />
          </div>
        </Section>

        {/* 7 — Single image */}
        <Section
          id="single"
          title="7 — Single Image"
          description="When only one photo is available: no arrows, no counter, no thumbnail strip — clean and minimal."
        >
          <div className="max-w-sm">
            <LaImageGallery
              images={IMAGE_SINGLE}
              badge="Sold"
              badgeVariant="rose"
              aspectRatio="4/3"
              allowFullscreen
            />
          </div>
        </Section>

        {/* 8 — Empty state */}
        <Section
          id="empty"
          title="8 — Empty State"
          description='images={[]} — no photos uploaded yet. Shows camera icon + friendly message.'
        >
          <div className="max-w-sm">
            <LaImageGallery images={[]} aspectRatio="4/3" />
          </div>
        </Section>

        {/* 9 — Mixed valid + broken */}
        <Section
          id="mixed"
          title="9 — Mixed: Valid + Broken Images"
          description="Images 2 and 4 have invalid URLs. Each slot fails gracefully with its own error tile — other images are unaffected."
        >
          <div className="max-w-lg">
            <LaImageGallery
              images={IMAGES_MIXED_BROKEN}
              aspectRatio="4/3"
              showThumbnails
              allowFullscreen
            />
          </div>
        </Section>

        {/* 10 — All broken */}
        <Section
          id="all-broken"
          title="10 — All Images Broken"
          description="Every src is invalid. Each image slot shows its own fallback tile independently — the gallery still navigates normally."
        >
          <div className="max-w-sm">
            <LaImageGallery
              images={IMAGES_ALL_BROKEN}
              aspectRatio="4/3"
              showThumbnails
              allowFullscreen
            />
          </div>
        </Section>

        {/* 11 — 3/2 ratio with captions */}
        <Section
          id="captions"
          title="11 — 3:2 with Captions"
          description="Captions appear as a frosted overlay bar at the bottom in fullscreen mode. Open fullscreen to see them."
        >
          <div className="max-w-lg">
            <LaImageGallery
              images={IMAGES_8}
              aspectRatio="3/2"
              showThumbnails
              allowFullscreen
            />
          </div>
        </Section>

        {/* ════════════════════════ DEVELOPER GUIDE ════════════════════════ */}

        <div className="border-t border-slate-200 pt-12 space-y-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Developer Guide
            </p>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              LaImageGallery
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Full-feature image carousel block. Drop-in ready. Zero external carousel dependencies.
            </p>
          </div>

          {/* Import */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Import</p>
            <CodeBlock>{`import { LaImageGallery } from "@/components/la-image-gallery";`}</CodeBlock>
          </div>

          {/* Quick usage */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Minimal Usage</p>
            <CodeBlock>{`<LaImageGallery
  images={[
    { src: "/photos/room1.jpg", alt: "Living room", caption: "Bright living area" },
    { src: "/photos/room2.jpg", alt: "Kitchen" },
  ]}
/>`}</CodeBlock>
          </div>

          {/* Full usage */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Full Props Example</p>
            <CodeBlock>{`<LaImageGallery
  images={photos}
  badge="For Sale"
  badgeVariant="blue"
  aspectRatio="16/9"
  showThumbnails={true}
  showPhotoCount={true}
  allowFullscreen={true}
  transition="fade"
  autoPlay={true}
  autoPlayInterval={3000}
  onImageChange={(index) => console.log("Active:", index)}
  className="max-w-xl"
/>`}</CodeBlock>
          </div>

          {/* GalleryImageItem */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">GalleryImageItem</p>
            <CodeBlock>{`interface GalleryImageItem {
  src: string;       // URL — relative or absolute
  alt?: string;      // Screen reader alt text
  caption?: string;  // Shown in fullscreen as frosted overlay
}`}</CodeBlock>
          </div>

          {/* Props table */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Props</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600">Prop</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600">Type</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600">Default</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-slate-600">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 px-4">
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">images</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">GalleryImageItem[]</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">required</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Array of image objects. Empty array shows the empty state.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">badge</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">string</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">—</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{`Top-left badge text e.g. "For Sale", "Featured", "New".`}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">badgeVariant</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">{`"default" | "rose" | "amber" | "blue" | "green"`}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">{`"default"`}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Colour of the badge.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">aspectRatio</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">{`"4/3" | "16/9" | "3/2" | "1/1"`}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">{`"4/3"`}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Aspect ratio of the main carousel viewport.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">showThumbnails</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">boolean</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">true</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Show scrollable thumbnail strip below the carousel. When false, pagination dots appear instead (≤10 images).</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">showPhotoCount</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">boolean</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">true</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{`Show "1 / N" counter badge at bottom-left. Hidden when dots are shown.`}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">allowFullscreen</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">boolean</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">true</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Show the expand button. Set false for embedded/card contexts.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">transition</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">{`"slide" | "fade"`}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">{`"slide"`}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Animation between images. Slide translates X; fade cross-fades.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">autoPlay</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">boolean</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">false</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Enable slideshow auto-advance. Pauses in fullscreen. Play/pause button appears on hover.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">autoPlayInterval</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">number</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">3000</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Interval in ms between auto-advance steps.</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">onImageChange</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">(index: number) =&gt; void</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">—</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Fires whenever the active image changes. Useful for analytics.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-800">className</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-blue-600">string</td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">—</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Extra Tailwind classes on the outer wrapper.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Behaviour notes */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Behaviour Notes</p>
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
              {[
                ["Keyboard", "← / → arrows navigate while the gallery is focused. Esc closes fullscreen from anywhere on the page."],
                ["Touch / Swipe", "Touch-start + touch-end with ≥36 px horizontal delta triggers prev/next. Works in both inline and fullscreen."],
                ["Preloading", "The ±1 neighbour images are rendered (but invisible) so the next/prev image loads before the user gets there."],
                ["Error recovery", "Each image slot tracks its own load state. A broken src shows a grey tile + icon independently — other images are unaffected."],
                ["Empty state", "images={[]} renders a camera-icon empty state instead of a broken carousel."],
                ["Thumbnail strip", "Scrolls horizontally. The active thumbnail auto-scrolls into view via scrollIntoView({ inline: 'center' })."],
                ["Pagination dots", "Shown automatically when showThumbnails={false} and images count ≤ 10. Active dot expands to a pill shape."],
                ["Fullscreen", "Opens a fixed inset-0 overlay (z-50). Thumbnail strip is always shown inside fullscreen regardless of the showThumbnails prop. Esc or X button closes it."],
                ["Captions", "Per-image caption prop is shown only in fullscreen as a frosted overlay — keeps the inline view clean."],
                ["Auto-play", "Pauses automatically when fullscreen opens. The play/pause icon button appears on hover in the top-right control cluster."],
                ["Single image", "With total === 1: no arrows, no counter, no thumbnail strip, no dots — all navigation chrome is hidden."],
              ].map(([label, desc]) => (
                <div key={label} className="flex gap-4 px-4 py-3">
                  <span className="w-32 shrink-0 text-xs font-semibold text-slate-700">{label}</span>
                  <span className="text-xs text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* placehold.co note */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-xs font-semibold text-amber-800 mb-1">Demo images — placehold.co</p>
            <p className="text-xs text-amber-700">
              This demo uses <code className="font-mono">https://placehold.co/&#123;w&#125;x&#123;h&#125;/&#123;bg&#125;/&#123;fg&#125;?text=Label</code> for themed placeholder images with zero network config.
              Because the component uses plain <code className="font-mono">&lt;img&gt;</code> (not <code className="font-mono">next/image</code>), any URL works without adding to <code className="font-mono">remotePatterns</code>.
              Replace with your own image URLs in production.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

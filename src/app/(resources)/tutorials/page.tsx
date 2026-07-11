import Link from "next/link";
import { cn } from "@/lib/utils";
import { laButtonVariants } from "@/components/la/la-button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TUTORIALS = [
  {
    slug: "create-your-account",
    title: "Create your free account",
    description: "Sign up in under a minute — no credit card, no fee. Just an email and you're in.",
    audience: "Everyone",
    readTime: "2 min",
    popular: true,
  },
  {
    slug: "search-and-find-listings",
    title: "Search & find listings",
    description: "Use the search bar, filters, and location radius to zero in on exactly what you need.",
    audience: "Buyers",
    readTime: "3 min",
    popular: true,
  },
  {
    slug: "post-your-first-ad",
    title: "Post your first ad",
    description: "Choose a category, add photos, set a price and go live — in under 5 minutes.",
    audience: "Sellers",
    readTime: "4 min",
    popular: true,
  },
  {
    slug: "set-up-a-search-alert",
    title: "Set up a search alert",
    description: "Pick a category, add keywords and filters — get notified the moment a match appears.",
    audience: "Buyers",
    readTime: "3 min",
    popular: false,
  },
  {
    slug: "contact-a-seller",
    title: "Contact a seller",
    description: "Send a message through ChitChat — no phone numbers shared until you choose to.",
    audience: "Buyers",
    readTime: "2 min",
    popular: false,
  },
  {
    slug: "save-and-manage-favourites",
    title: "Save & manage favourites",
    description: "Heart any listing to save it. Access your saved ads any time from the header.",
    audience: "Buyers",
    readTime: "2 min",
    popular: false,
  },
  {
    slug: "stay-safe-on-lokalads",
    title: "Stay safe on LokalAds",
    description: "How to spot a scam, report a suspicious ad, and keep your contact details private.",
    audience: "Everyone",
    readTime: "5 min",
    popular: false,
  },
  {
    slug: "write-a-great-ad",
    title: "Write a great ad",
    description: "What makes buyers click — the right title, clear photos, honest price, and what to never do.",
    audience: "Sellers",
    readTime: "4 min",
    popular: false,
  },
  {
    slug: "update-your-profile",
    title: "Update your profile",
    description: "Add a photo, verify your contact details, and set your location to build buyer confidence.",
    audience: "Everyone",
    readTime: "2 min",
    popular: false,
  },
  {
    slug: "your-public-profile",
    title: "Your public profile",
    description: "What buyers see when they look you up — your listings, join date, and trust signals.",
    audience: "Everyone",
    readTime: "2 min",
    popular: false,
  },
  {
    slug: "manage-and-edit-your-ads",
    title: "Manage & edit your ads",
    description: "Edit details, renew an expiring ad, pause it, or mark it as sold — all from My Ads.",
    audience: "Sellers",
    readTime: "3 min",
    popular: false,
  },
];

// ─── Audience pill ────────────────────────────────────────────────────────────
function AudiencePill({ label }: { label: string }) {
  const colours: Record<string, string> = {
    Sellers:  "bg-rose-50 text-rose-700",
    Buyers:   "bg-blue-50 text-blue-700",
    Everyone: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", colours[label] ?? "bg-slate-100 text-slate-600")}>
      {label}
    </span>
  );
}

// ─── Screenshot placeholder ───────────────────────────────────────────────────
function ScreenshotPlaceholder() {
  return (
    <div className="w-full aspect-video bg-slate-200 rounded-t-xl flex items-center justify-center">
      <p className="text-sm font-medium text-slate-400">Screenshot coming soon</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TutorialsPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container-app pt-8 pb-6">
        <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-3">
          Tutorials
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight max-w-2xl">
          Learn the essentials — fast.
        </h1>
        <p className="mt-3 text-lg text-slate-700 leading-relaxed max-w-2xl">
          Short, practical guides covering everything you need to buy, sell, and stay safe on LokalAds.
        </p>
      </section>

      {/* ── Tutorial cards ───────────────────────────────────────────────── */}
      <section className="container-app pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TUTORIALS.map((t) => (
            <Link
              key={t.slug}
              href={`/tutorials/${t.slug}`}
              className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
            >
              {/* Popular ribbon */}
              {t.popular && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              {/* Screenshot placeholder */}
              <ScreenshotPlaceholder />

              {/* Card body */}
              <div className="px-5 py-4">
                {/* Audience + read time */}
                <div className="flex items-center justify-between mb-2">
                  <AudiencePill label={t.audience} />
                  <span className="text-sm text-slate-500">{t.readTime} read</span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-slate-900 leading-snug mb-1 group-hover:text-blue-700 transition-colors">
                  {t.title}
                </h2>

                {/* Description */}
                <p className="text-base text-slate-600 leading-relaxed">
                  {t.description}
                </p>

                {/* Read affordance */}
                <p className="mt-3 text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                  Read guide →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="bg-slate-100 border-t border-slate-200">
        <div className="container-app py-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Ready to dive in?
          </h2>
          <p className="text-base text-slate-700 mb-6">
            Browse listings or post your first ad — it&apos;s completely free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/listings" className={cn(laButtonVariants({ intent: "primary", size: "default" }))}>
              Browse listings
            </Link>
            <Link href="/post" className={cn(laButtonVariants({ intent: "primary-rose", size: "default" }))}>
              Post a free ad
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}


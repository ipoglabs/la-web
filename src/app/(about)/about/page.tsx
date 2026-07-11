import Link from "next/link";
import { laButtonVariants } from "@/components/la/la-button";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    number: "01",
    title: "Trust first",
    body: "Every feature we build starts with one question — does this make our community safer? Verified profiles, honest reviews, and clear reporting tools are not extras. They are the foundation.",
  },
  {
    number: "02",
    title: "Locally rooted",
    body: "Whether you're in Singapore, India, or the UK — LokalAds feels like your neighbourhood, not a global warehouse. Local context, local language, local trust.",
  },
  {
    number: "03",
    title: "Safer together",
    body: "A market is only as safe as the people in it. We make it easy to flag bad actors, protect your contact details, and transact with confidence. We watch out for each other.",
  },
];

const STATS = [
  { value: "3",   label: "Countries"  },
  { value: "21",  label: "Categories" },
  { value: "Free", label: "Always"   },
];

// ─── Inline SVG illustration — community/trust motif ─────────────────────────
function TrustIllustration() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm opacity-90" aria-hidden>
      {/* Background circles */}
      <circle cx="200" cy="110" r="90" fill="#f0fdf4" />
      <circle cx="200" cy="110" r="65" fill="#dcfce7" />
      {/* Shield */}
      <path d="M200 48 L240 66 L240 108 C240 132 222 152 200 160 C178 152 160 132 160 108 L160 66 Z" fill="#16a34a" opacity="0.15"/>
      <path d="M200 56 L234 72 L234 108 C234 129 218 147 200 154 C182 147 166 129 166 108 L166 72 Z" fill="#16a34a" opacity="0.25"/>
      {/* Checkmark */}
      <path d="M185 108 L196 120 L218 96" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      {/* People dots — left */}
      <circle cx="120" cy="105" r="18" fill="#dbeafe"/>
      <circle cx="120" cy="98" r="7" fill="#3b82f6" opacity="0.7"/>
      <path d="M105 116 Q120 110 135 116" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      {/* People dots — right */}
      <circle cx="280" cy="105" r="18" fill="#fce7f3"/>
      <circle cx="280" cy="98" r="7" fill="#ec4899" opacity="0.7"/>
      <path d="M265 116 Q280 110 295 116" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
      {/* Connecting lines */}
      <line x1="138" y1="105" x2="162" y2="105" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3"/>
      <line x1="238" y1="105" x2="262" y2="105" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3"/>
      {/* Location pins */}
      <circle cx="155" cy="155" r="6" fill="#f59e0b"/>
      <circle cx="245" cy="155" r="6" fill="#f59e0b"/>
      <circle cx="200" cy="170" r="6" fill="#f59e0b"/>
      <line x1="155" y1="155" x2="200" y2="170" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5"/>
      <line x1="245" y1="155" x2="200" y2="170" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container-app pt-8 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-3">
              Our story
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight max-w-2xl">
              Built on trust.<br />Grown by community.
            </h1>
            <p className="mt-4 text-lg text-slate-700 leading-relaxed max-w-xl">
              LokalAds is a free classifieds marketplace where real people buy, sell,
              and connect — safely, simply, and locally.
            </p>
          </div>
          <div className="shrink-0 flex justify-center sm:justify-end w-full sm:w-auto">
            <TrustIllustration />
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 mt-6" />

      {/* ── Mission ──────────────────────────────────────────────────────── */}
      <section className="container-app pt-5 pb-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What we believe</h2>
          <p className="text-base text-slate-700 leading-relaxed">
            A marketplace is only as good as the trust within it. Spam, scams, and
            shady deals don't just hurt individuals — they erode the communities we all
            depend on. We started LokalAds because we believe buying and selling
            locally should feel safe, honest, and human.
          </p>
          <p className="mt-3 text-base text-slate-700 leading-relaxed">
            So we built a platform where trust is not a feature — it's the whole point.
          </p>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-100 border-y border-slate-200">
        <div className="container-app py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {VALUES.map((v) => (
              <div key={v.number} className="pr-2">
                <p className="text-sm font-bold tracking-widest text-slate-400 mb-2">{v.number}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-base text-slate-700 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pull quote ───────────────────────────────────────────────────── */}
      <section className="container-app pt-4 pb-8">
        <blockquote className="border-l-[6px] border-emerald-500 bg-emerald-50 pl-6 py-4 pr-4 rounded-r-xl max-w-2xl">
          <p className="text-xl font-semibold text-slate-800 leading-snug italic">
            &ldquo;Safer community, safer market. That&apos;s not a tagline — it&apos;s how we
            make every decision.&rdquo;
          </p>
          <cite className="mt-1.5 block text-sm font-medium text-slate-500 not-italic">
            — The LokalAds team
          </cite>
        </blockquote>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900">
        <div className="container-app py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="container-app py-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Your community is waiting.
        </h2>
        <p className="text-base text-slate-700 mb-6">
          Join thousands of people already buying, selling, and connecting locally — for free.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/listings" className={cn(laButtonVariants({ intent: "primary", size: "big" }))}>
            Browse listings
          </Link>
          <Link href="/post" className={cn(laButtonVariants({ intent: "primary-rose", size: "big" }))}>
            Post a free ad
          </Link>
        </div>
      </section>

    </div>
  );
}


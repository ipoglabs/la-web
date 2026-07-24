import Link from "next/link";
import { laButtonVariants } from "@/components/la/la-button";
import { cn } from "@/lib/utils";
import { ListingsLink } from "@/components/la-blocks/ListingsLink";

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDIVIDUALS = [
  { title: "100% free", body: "Post as many ads as you like. No listing fees, no hidden charges — ever." },
  { title: "Reach local buyers", body: "Your ad goes straight to people nearby who are already looking for what you're selling." },
  { title: "Live in minutes", body: "No approval queues. Fill in the details, hit post, and you're live." },
  { title: "Your privacy protected", body: "Your contact details stay hidden until you choose to share them." },
];

const BUSINESSES = [
  { title: "Targeted local visibility", body: "Get seen by the right people in the right area — not random traffic from across the globe." },
  { title: "Post multiple listings", body: "List your full inventory, all your services, or every vacancy — no caps, no cost." },
  { title: "Build your reputation", body: "Collect reviews from real buyers and build a trusted profile that keeps customers coming back." },
  { title: "21 categories", body: "One account covers property, vehicles, jobs, services, and 17 more categories." },
];

const STEPS = [
  { number: "1", title: "Create your free account", body: "Sign up in under a minute. No credit card needed." },
  { number: "2", title: "Post your ad", body: "Add photos, a description, your price, and your location." },
  { number: "3", title: "Connect with buyers", body: "Interested people message you directly. You choose who to respond to." },
];

// ─── Check icon ───────────────────────────────────────────────────────────────
function Check({ color }: { color: "blue" | "rose" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="size-5 shrink-0 mt-0.5" aria-hidden>
      <circle cx="10" cy="10" r="10" fill={color === "blue" ? "#1d4ed8" : "#e11d48"} opacity="0.12" />
      <path d="M6 10.5l2.5 2.5 5-5" stroke={color === "blue" ? "#1d4ed8" : "#e11d48"}
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhyPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="container-app pt-8 pb-6">
        <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-3">
          Why advertise
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight max-w-2xl">
          Whether you're clearing your garage or growing your business — LokalAds works for you.
        </h1>
        <p className="mt-4 text-lg text-slate-700 leading-relaxed max-w-2xl">
          Free to post. Easy to use. Trusted by real people in your community.
        </p>
      </section>

      {/* Audience split */}
      <section className="container-app pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-1">For individuals</p>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Sell it. Rent it. Find it.</h2>
            <ul className="space-y-4">
              {INDIVIDUALS.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Check color="blue" />
                  <div>
                    <p className="text-base font-bold text-slate-900 leading-snug">{item.title}</p>
                    <p className="text-base text-slate-600 leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/post" className={cn(laButtonVariants({ intent: "primary-rose", size: "default" }))}>
                Post a free ad
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">For businesses</p>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Grow locally. Stand out.</h2>
            <ul className="space-y-4">
              {BUSINESSES.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Check color="rose" />
                  <div>
                    <p className="text-base font-bold text-slate-900 leading-snug">{item.title}</p>
                    <p className="text-base text-slate-600 leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/post" className={cn(laButtonVariants({ intent: "primary-rose", size: "default" }))}>
                Start listing today
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-100 border-y border-slate-200">
        <div className="container-app py-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.number} className="flex gap-4 items-start">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                  <span className="text-base font-bold text-white">{s.number}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 mb-1">{s.title}</p>
                  <p className="text-base text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-app py-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-4xl font-bold text-slate-900">Free</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Always, forever</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900">21</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Categories</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900">3</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Countries</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900">
        <div className="container-app py-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Ready to reach your community?
          </h2>
          <p className="text-base text-slate-400 mb-6">
            Post your first ad in minutes. No cost. No catch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/post" className={cn(laButtonVariants({ intent: "primary-rose", size: "big" }))}>
              Post a free ad
            </Link>
            <ListingsLink href="/listings" className={cn(laButtonVariants({ intent: "secondary", size: "big" }))}>
              Browse listings
            </ListingsLink>
          </div>
        </div>
      </section>

    </div>
  );
}

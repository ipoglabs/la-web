import Link from "next/link";
import { cn } from "@/lib/utils";
import { laButtonVariants } from "@/components/la/la-button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACT_CHANNELS = [
  {
    label: "Press & Media",
    email: "press@lokalads.com",
    description: "Journalists, bloggers, and media enquiries. We aim to respond within 24 hours.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden>
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
        <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>
      </svg>
    ),
  },
  {
    label: "Partnerships & Business",
    email: "partners@lokalads.com",
    description: "Integrations, API access, sponsorships, and commercial opportunities.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: "Careers",
    email: "careers@lokalads.com",
    description: "Open roles, speculative applications, and questions about working with us.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden>
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
];

const LOCATIONS = [
  {
    country: "India",
    flag: "🇮🇳",
    note: "Primary engineering & operations hub",
    tz: "IST (UTC+5:30)",
  },
  {
    country: "Singapore",
    flag: "🇸🇬",
    note: "APAC growth & partnerships",
    tz: "SGT (UTC+8:00)",
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    note: "European market & compliance",
    tz: "GMT (UTC+0:00)",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container-app pt-8 pb-6 max-w-3xl">
        <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-3">
          Contact
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          Let&apos;s talk.
        </h1>
        <p className="mt-3 text-lg text-slate-700 leading-relaxed">
          We&apos;re a small, distributed team — real people who read every message.
          Whether you&apos;re a journalist, a potential partner, or just curious about LokalAds,
          the right inbox is below.
        </p>
      </section>

      {/* ── Got a support issue? redirect ────────────────────────────────── */}
      <section className="container-app pb-8 max-w-3xl">
        <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="size-5 shrink-0 mt-0.5 text-amber-700" aria-hidden>
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
          <div>
            <p className="text-base font-semibold text-slate-900">Got a product issue?</p>
            <p className="text-sm text-slate-700 mt-0.5">
              For help with listings, your account, or reporting a scam —{" "}
              <Link href="/support" className="font-semibold text-blue-700 hover:underline underline-offset-2">
                visit our Support page
              </Link>
              . This page is for press, partnerships, and careers only.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact channels ─────────────────────────────────────────────── */}
      <section className="container-app pb-12 max-w-3xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
          Get in touch
        </h2>
        <div className="space-y-4">
          {CONTACT_CHANNELS.map((c) => (
            <div key={c.label}
              className="flex items-start gap-5 rounded-xl border border-slate-200 bg-white px-5 py-5">
              <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-900">{c.label}</p>
                <p className="text-sm text-slate-600 mt-0.5 mb-2">{c.description}</p>
                <a
                  href={`mailto:${c.email}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline underline-offset-2 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  {c.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Where we are ─────────────────────────────────────────────────── */}
      <section className="bg-slate-100 border-y border-slate-200">
        <div className="container-app py-10 max-w-3xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">
            Where we are
          </h2>
          <p className="text-base text-slate-700 mb-6">
            LokalAds is a distributed team — no single HQ. We work across three countries,
            in the time zones of the communities we serve.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LOCATIONS.map((loc) => (
              <div key={loc.country}
                className="rounded-xl border border-slate-200 bg-white px-5 py-5">
                <div className="text-3xl mb-3" aria-hidden>{loc.flag}</div>
                <p className="text-base font-bold text-slate-900">{loc.country}</p>
                <p className="text-sm text-slate-600 mt-1">{loc.note}</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">{loc.tz}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Careers nudge ────────────────────────────────────────────────── */}
      <section className="container-app py-10 max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Want to join the team?
            </h2>
            <p className="text-base text-slate-700">
              We actively prioritise people with disabilities. If you have the drive, we have a place for you.
            </p>
          </div>
          <Link
            href="/career"
            className={cn(laButtonVariants({ intent: "primary", size: "default" }), "shrink-0")}
          >
            See open roles
          </Link>
        </div>
      </section>

    </div>
  );
}


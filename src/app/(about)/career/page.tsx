import Link from "next/link";
import { laButtonVariants } from "@/components/la/la-button";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PASSIONS = [
  { area: "Community & trust", description: "You care deeply about people feeling safe and supported online." },
  { area: "Design & UX", description: "You believe every interaction should feel effortless and human." },
  { area: "Technology & building", description: "You love turning ideas into real, working products." },
  { area: "Growth & outreach", description: "You know how to find people, tell stories, and build audiences." },
  { area: "Trust & safety", description: "You want to make the internet a fairer, safer place." },
];

const HOW_WE_WORK = [
  { title: "Remote-first", body: "Work from wherever you're most comfortable. Always." },
  { title: "Flexible hours", body: "We care about what you deliver, not when you clock in." },
  { title: "Outcome-based", body: "No micromanagement. Own your work, trust your instincts." },
];

const ROLES = [
  { title: "UX Designer", type: "Part-time · Remote" },
  { title: "Frontend Developer", type: "Full-time · Remote" },
  { title: "Community Manager", type: "Part-time · Remote" },
  { title: "Trust & Safety Analyst", type: "Full-time · Remote" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CareerPage() {
  return (
    <div className="bg-white">
      <div className="container-app pt-10 pb-20 max-w-2xl">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-3">
          Careers
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
          Physical limits don't<br />limit potential.
        </h1>
        <p className="mt-5 text-lg text-slate-700 leading-relaxed">
          At LokalAds, we actively prioritise people with disabilities — not out of obligation,
          but because diverse minds, lived experiences, and unstoppable passion build better products.
          If you have the drive, we have a place for you.
        </p>

        {/* ── Pull quote / Motto ───────────────────────────────────────────── */}
        <blockquote className="mt-8 pl-5 border-l-4 border-blue-700">
          <p className="text-xl font-semibold italic text-blue-700 leading-snug">
            "Physical limitation is not a limitation to fly."
          </p>
          <p className="mt-2 text-sm text-slate-500 font-medium">— Our founding belief</p>
        </blockquote>

        {/* ── Commitment ───────────────────────────────────────────────────── */}
        <div className="mt-12 pt-10 border-t border-slate-200">
          <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-4">Our commitment</p>
          <p className="text-8xl font-black text-blue-700 leading-none">80%</p>
          <p className="mt-3 text-xl font-bold text-slate-900 leading-snug max-w-md">
            of our roles are reserved for candidates with disabilities.
          </p>
          <p className="mt-4 text-base text-slate-700 leading-relaxed">
            We don't just welcome applicants with disabilities — we seek them out. Remote work,
            flexible hours, and outcome-based culture mean the playing field is truly level here.
            Your ambition is all that matters.
          </p>
        </div>

        {/* ── What we look for ─────────────────────────────────────────────── */}
        <div className="mt-12 pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">We hire for passion, not perfection.</h2>
          <p className="text-base text-slate-600 mb-7">Excited about any of these? You belong here.</p>
          <div className="flex flex-col gap-5">
            {PASSIONS.map((p, i) => (
              <div key={p.area} className="flex gap-4">
                <span className="text-sm font-black text-blue-700 w-6 shrink-0 pt-0.5 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-base font-bold text-slate-900">{p.area}</p>
                  <p className="text-base text-slate-600 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How we work ──────────────────────────────────────────────────── */}
        <div className="mt-12 pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">How we work</h2>
          <div className="flex flex-col gap-3">
            {HOW_WE_WORK.map((h) => (
              <p key={h.title} className="text-base text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">{h.title}</span> — {h.body}
              </p>
            ))}
          </div>
        </div>

        {/* ── Open roles ───────────────────────────────────────────────────── */}
        <div className="mt-12 pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Open positions</h2>
          <p className="text-base text-slate-600 mb-6">All roles are remote. All applications welcome.</p>
          <div className="flex flex-col divide-y divide-slate-200 border-y border-slate-200">
            {ROLES.map((role) => (
              <div key={role.title} className="flex items-center justify-between py-4 gap-4">
                <div>
                  <p className="text-base font-bold text-slate-900">{role.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{role.type}</p>
                </div>
                <Link
                  href={`mailto:careers@lokalads.com?subject=Application — ${role.title}`}
                  className={cn(laButtonVariants({ intent: "primary-rose", size: "compact" }))}
                >
                  Apply
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Catch-all CTA ────────────────────────────────────────────────── */}
        <div className="mt-12 pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Don't see your role?
          </h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            We're always looking for passionate people. Send us a note about who you are
            and what you'd love to build — we read every message.
          </p>
          <Link
            href="mailto:careers@lokalads.com?subject=Open Application"
            className={cn(laButtonVariants({ intent: "primary", size: "big" }))}
          >
            Tell us your story →
          </Link>
        </div>

      </div>
    </div>
  );
}


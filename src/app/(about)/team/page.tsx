import Link from "next/link";
import { laButtonVariants } from "@/components/la/la-button";
import { cn } from "@/lib/utils";

// ─── Avatar SVGs ──────────────────────────────────────────────────────────────
function Avatar({ bg, head, body }: { bg: string; head: string; body: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-20 rounded-full shrink-0" aria-hidden>
      <circle cx="60" cy="60" r="60" fill={bg} />
      <circle cx="60" cy="46" r="19" fill={head} />
      <path d="M24 104 Q27 77 60 74 Q93 77 96 104" fill={body} opacity="0.8" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: "G. Kumar",
    role: "Founder · CVO · CEO",
    bg: "#dbeafe", head: "#93c5fd", body: "#3b82f6",
    quote: "I\u2019ve always believed the best products come from personal frustration. I wanted a marketplace that felt local \u2014 not a global warehouse with a local filter slapped on. Somewhere safe. Simple. Human.",
    tag: "Product \u00b7 Vision \u00b7 Operations",
    showMotto: true,
  },
  {
    name: "S. Rajan",
    role: "Chief Architect",
    bg: "#dcfce7", head: "#86efac", body: "#22c55e",
    quote: "Architecture is not about technology \u2014 it\u2019s about decisions. Every system we design is built to be simple to understand, easy to change, and hard to break.",
    tag: "Systems \u00b7 Infrastructure \u00b7 Scalability",
    showMotto: false,
  },
  {
    name: "P. Menon",
    role: "Chief Engineer",
    bg: "#fef9c3", head: "#fde047", body: "#eab308",
    quote: "Engineering is craft. We don\u2019t just ship features \u2014 we ship reliability. Every line of code is a promise to the person on the other end of the screen.",
    tag: "Engineering \u00b7 Quality \u00b7 Delivery",
    showMotto: false,
  },
  {
    name: "M. Iyer",
    role: "Design Thinker",
    bg: "#fce7f3", head: "#f9a8d4", body: "#ec4899",
    quote: "The best design is invisible. When a user completes a task without thinking about how they did it \u2014 that\u2019s the win. We obsess over the feeling, not just the look.",
    tag: "UX \u00b7 Research \u00b7 Accessibility",
    showMotto: false,
  },
  {
    name: "K. Nair",
    role: "Head of Trust & Safety",
    bg: "#fee2e2", head: "#fca5a5", body: "#ef4444",
    quote: "A marketplace is only as strong as the trust inside it. My job is to make sure every person on LokalAds feels safe \u2014 and that bad actors have no place to hide.",
    tag: "Fraud \u00b7 Moderation \u00b7 Community Safety",
    showMotto: false,
  },
  {
    name: "T. Sharma",
    role: "Head of Growth & Community",
    bg: "#ffedd5", head: "#fdba74", body: "#f97316",
    quote: "Marketplaces live and die on network effect. My role is to make sure buyers and sellers find each other \u2014 and that every community we enter feels like LokalAds was built just for them.",
    tag: "Growth \u00b7 Outreach \u00b7 Community",
    showMotto: false,
  },
  {
    name: "D. Pillai",
    role: "DevOps & Platform Lead",
    bg: "#f3e8ff", head: "#d8b4fe", body: "#a855f7",
    quote: "Reliability is a feature. Users don\u2019t think about uptime until it\u2019s gone \u2014 and then it\u2019s all they think about. I make sure LokalAds is always there when people need it.",
    tag: "Infrastructure \u00b7 CI/CD \u00b7 Uptime",
    showMotto: false,
  },
  {
    name: "R. Krishnan",
    role: "Data & Insights Lead",
    bg: "#e0f2fe", head: "#7dd3fc", body: "#0ea5e9",
    quote: "Without data, decisions are just opinions. I turn user behaviour into clarity \u2014 so every feature we build is backed by what real people actually do, not what we think they do.",
    tag: "Analytics \u00b7 Metrics \u00b7 Product Intelligence",
    showMotto: false,
  },
  {
    name: "V. Suresh",
    role: "Legal & Compliance Lead",
    bg: "#f1f5f9", head: "#94a3b8", body: "#475569",
    quote: "Operating across countries means operating across laws. My job is to make sure LokalAds is always on the right side of every regulation \u2014 so the product never has to stop because of a legal blind spot.",
    tag: "Legal \u00b7 GDPR \u00b7 Multi-country Compliance",
    showMotto: false,
  },
  {
    name: "A. Bose",
    role: "Finance & Revenue Lead",
    bg: "#ecfdf5", head: "#6ee7b7", body: "#10b981",
    quote: "Free to users doesn\u2019t mean free to run. Someone has to make sure the lights stay on, the servers keep running, and the mission stays funded. Sustainability is a feature too.",
    tag: "Finance \u00b7 Revenue \u00b7 Sustainability",
    showMotto: false,
  },
  {
    name: "L. Nambiar",
    role: "Customer Support Lead",
    bg: "#fff7ed", head: "#fcd34d", body: "#f59e0b",
    quote: "Trust & Safety prevents problems. I resolve them. Every frustrated user who gets a fast, human response becomes a loyal one. My team is the last line between a bad experience and a lost user.",
    tag: "Support \u00b7 Resolution \u00b7 User Trust",
    showMotto: false,
  },
  {
    name: "B. Verma",
    role: "Head of Product",
    bg: "#ede9fe", head: "#c4b5fd", body: "#7c3aed",
    quote: "Vision sets the direction. Engineering builds the road. Product makes sure we\u2019re building the right road to the right destination. I own the map \u2014 what we build, in what order, and why.",
    tag: "Roadmap \u00b7 Prioritisation \u00b7 Product Strategy",
    showMotto: false,
  },
  {
    name: "C. Ramesh",
    role: "Chief Information Security Officer",
    bg: "#fdf2f8", head: "#f0abfc", body: "#a21caf",
    quote: "We hold personal data across three countries. One breach doesn\u2019t just hurt users \u2014 it ends the product. My job is to make sure LokalAds is never the weakest link in anyone\u2019s trust chain.",
    tag: "Security \u00b7 OWASP \u00b7 Data Protection",
    showMotto: false,
  },
  {
    name: "N. Gopal",
    role: "Head of Localisation & Country Ops",
    bg: "#f0fdf4", head: "#bbf7d0", body: "#16a34a",
    quote: "Being in three countries doesn\u2019t mean translating three times. It means understanding three cultures, three sets of laws, three user mindsets. I make sure LokalAds feels built for each place \u2014 not just deployed there.",
    tag: "Localisation \u00b7 Country Strategy \u00b7 Cultural Fit",
    showMotto: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  return (
    <div className="bg-white">
      <div className="container-app pt-10 pb-20 max-w-2xl">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-3">
          Our Team
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
          Small team.<br />Huge conviction.
        </h1>
        <p className="mt-4 text-lg text-slate-700 leading-relaxed">
          LokalAds is built by a founder-led team — each person owning their domain
          completely, driven by mission, and committed to building something that matters.
        </p>

        {/* ── Team members ─────────────────────────────────────────────────── */}
        {TEAM.map((person, i) => (
          <div key={person.name} className="mt-10 pt-10 border-t border-slate-200">
            <div className="flex items-center gap-5 mb-4">
              <Avatar bg={person.bg} head={person.head} body={person.body} />
              <div>
                <p className="text-xl font-bold text-slate-900">{person.name}</p>
                <p className="text-base font-semibold text-blue-700">{person.role}</p>
                <p className="text-sm text-slate-500 mt-0.5">{person.tag}</p>
              </div>
            </div>
            <p className="text-base text-slate-700 leading-relaxed">{person.quote}</p>
            {person.showMotto && (
              <blockquote className="mt-6 pl-5 border-l-4 border-blue-700">
                <p className="text-lg font-semibold italic text-blue-700 leading-snug">
                  &ldquo;Physical limitation is not a limitation to fly.&rdquo;
                </p>
              </blockquote>
            )}
          </div>
        ))}

        {/* ── Join nudge ───────────────────────────────────────────────────── */}
        <div className="mt-12 pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Want to be on this page?</h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            We&apos;re actively growing the team — especially welcoming applicants with disabilities,
            because diverse minds build better products.
          </p>
          <Link
            href="/career"
            className={cn(laButtonVariants({ intent: "primary", size: "big" }))}
          >
            See open positions →
          </Link>
        </div>

      </div>
    </div>
  );
}

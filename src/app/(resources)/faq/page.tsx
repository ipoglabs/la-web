import Link from "next/link";
import { cn } from "@/lib/utils";
import { laButtonVariants } from "@/components/la/la-button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: "General",
    items: [
      {
        q: "Is LokalAds free to use?",
        a: "Yes — completely. Posting ads, browsing listings, messaging sellers, and setting alerts are all free. There are no listing fees, no hidden charges, and no premium tiers. Free means free.",
      },
      {
        q: "Which countries does LokalAds support?",
        a: "LokalAds currently operates in India, the United Kingdom, and Singapore. Each country has its own localised experience — categories, currency, and location search are all tailored to where you are.",
      },
      {
        q: "Do I need an account to browse listings?",
        a: "No. Anyone can browse and search listings without signing in. You only need an account when you want to post an ad, contact a seller, save favourites, or set up alerts.",
      },
      {
        q: "Is LokalAds available as a mobile app?",
        a: "Not yet — but the website is fully responsive and works great on any phone or tablet. A dedicated app is on the roadmap.",
      },
    ],
  },
  {
    title: "Posting Ads",
    items: [
      {
        q: "How many ads can I post?",
        a: "As many as you like. There is no cap on the number of active listings per account. Post your full inventory, all your services, or everything in your garage — no limits.",
      },
      {
        q: "How long does my ad stay live?",
        a: "Ads are active for 60 days by default. You'll get a reminder before your ad expires, and you can renew it with one click from your My Ads dashboard.",
      },
      {
        q: "Can I edit my ad after posting?",
        a: "Yes. Go to My Ads, find the listing, and tap Edit. You can update the title, description, photos, price, and location at any time while the ad is active.",
      },
      {
        q: "Why was my ad removed or rejected?",
        a: "Ads are removed if they violate our community guidelines — this includes prohibited items, misleading descriptions, duplicate listings, or suspected fraud. If you believe your ad was removed in error, contact our support team and we'll review it.",
      },
    ],
  },
  {
    title: "Buying & Finding",
    items: [
      {
        q: "How do I contact a seller?",
        a: "Open any listing and tap the ChitChat button. This opens a private, in-app message thread between you and the seller. Your phone number and email are never shared unless you choose to share them yourself.",
      },
      {
        q: "Can I negotiate the price?",
        a: "That's between you and the seller — LokalAds doesn't control pricing. Most sellers are open to reasonable offers. Just send a message through ChitChat and ask.",
      },
      {
        q: "What if the item is no longer available?",
        a: "If an ad is still visible, it may still be available — the seller just hasn't marked it as sold yet. Send a message to check. If you get no response within a few days, the item is likely gone.",
      },
      {
        q: "How do search alerts work?",
        a: "A search alert saves your search — keywords, category, filters, and location — and notifies you by email or WhatsApp the moment a matching listing goes live. Set one up from the bell icon on the home screen or any search result page.",
      },
    ],
  },
  {
    title: "Safety & Trust",
    items: [
      {
        q: "Is my phone number visible to other users?",
        a: "No. Your contact details are hidden by default. You control when and whether to share them. All initial communication happens through ChitChat — your number stays private unless you choose to give it out.",
      },
      {
        q: "How do I report a suspicious ad or seller?",
        a: "Open the listing and tap the Report button. Choose a reason — scam, prohibited item, misleading info, or other — and submit. Our trust and safety team reviews every report, usually within 24 hours.",
      },
      {
        q: "What are the signs of a scam?",
        a: "Red flags include: prices that seem too good to be true, sellers who refuse to meet in person, requests for payment before viewing an item, and anyone asking you to communicate outside LokalAds. If something feels off, trust that instinct and report it.",
      },
      {
        q: "Does LokalAds verify sellers?",
        a: "We offer optional profile verification — a verified badge shows that a seller's identity has been checked. Verification is not required to post, but verified sellers tend to attract more responses. Always check a seller's profile, reviews, and listing history before transacting.",
      },
    ],
  },
  {
    title: "Account & Profile",
    items: [
      {
        q: "How do I switch my country?",
        a: "Tap your avatar in the top-right corner and select Switch Country. You can change your active country at any time. Your listings stay in the country they were posted in.",
      },
      {
        q: "Can I have multiple accounts?",
        a: "One account per person. LokalAds is built on trust, and multiple accounts undermine that. If you need to manage listings for a business alongside personal ads, you can do both from a single account.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to your Profile, scroll to the Danger Zone section, and tap Delete Account. You'll go through a short eligibility check — active listings must be closed first. Deletion is permanent and cannot be undone.",
      },
      {
        q: "What does my public profile show?",
        a: "Other users can see your display name, profile photo, the date you joined, your active listings, and any reviews left by past buyers or sellers. Your email, phone number, and address are never publicly visible.",
      },
    ],
  },
];

// ─── FAQ row ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-slate-200 last:border-0">
      <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none">
        <span className="text-base font-semibold text-slate-900 group-open:text-blue-700 transition-colors">
          {q}
        </span>
        {/* Chevron — rotates on open */}
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          className="size-5 shrink-0 text-slate-400 group-open:rotate-180 transition-transform"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <p className="pb-4 text-base text-slate-700 leading-relaxed">
        {a}
      </p>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="container-app pt-8 pb-6 max-w-3xl">
        <p className="text-base font-bold uppercase tracking-widest text-blue-700 mb-3">
          Frequent Questions
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          Got a question? We&apos;ve got you.
        </h1>
        <p className="mt-3 text-lg text-slate-700 leading-relaxed">
          Everything you need to know about buying, selling, and staying safe on LokalAds.
        </p>
      </section>

      {/* ── FAQ sections ─────────────────────────────────────────────────── */}
      <section className="container-app pb-12 max-w-3xl">
        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              {/* Section label */}
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3 pl-1">
                {section.title}
              </h2>
              {/* Items */}
              <div className="rounded-xl border border-slate-300 bg-white px-5">
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Still need help ──────────────────────────────────────────────── */}
      <section className="bg-slate-100 border-t border-slate-200">
        <div className="container-app py-10 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Still can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="text-base text-slate-700">
                Our support team is here to help — usually within a few hours.
              </p>
            </div>
            <Link
              href="/support"
              className={cn(laButtonVariants({ intent: "primary", size: "default" }), "shrink-0")}
            >
              Contact support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

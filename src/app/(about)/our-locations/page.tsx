import Image from "next/image";

const COUNTRIES = [
  {
    flag: "/flags/gb.svg",
    iso: "uk",
    name: "United Kingdom",
    summary:
      "Our UK base — serving England, Scotland, Wales, and Northern Ireland. Fully compliant with UK GDPR, with a small team focused on community and trust.",
    address: {
      line1: "12 Placeholder Street",
      line2: "London, EC1A 1BB",
      country: "United Kingdom",
    },
  },
  {
    flag: "/flags/in.svg",
    iso: "in",
    name: "India",
    summary:
      "Where LokalAds began. Our founding team and core operations are based here, with support across all 21 active categories.",
    address: {
      line1: "Placeholder Building, 4th Floor",
      line2: "Bangalore, Karnataka 560001",
      country: "India",
    },
  },
  {
    flag: "/flags/sg.svg",
    iso: "sg",
    name: "Singapore",
    summary:
      "Our Asia-Pacific hub. A small, focused team handling regional growth and partnerships across Southeast Asia.",
    address: {
      line1: "1 Placeholder Road, #08-01",
      line2: "Singapore 048616",
      country: "Singapore",
    },
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OurLocationsPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="container-app pt-10 pb-8 max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-700 mb-3">
          Where we operate
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          Every country. One idea.
        </h1>
        <p className="mt-3 text-base text-slate-700 leading-relaxed">
          Local classifieds — free, safe, and built around the communities we serve.
        </p>
      </section>

      {/* Country list */}
      <section className="container-app pb-16 max-w-2xl">
        <div className="divide-y divide-slate-200">
          {COUNTRIES.map((c) => (
            <div key={c.iso} className="py-8">

              {/* Flag + name */}
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={c.flag}
                  alt={c.name}
                  width={28}
                  height={20}
                  className="rounded-sm shrink-0"
                />
                <h2 className="text-xl font-bold text-slate-900">{c.name}</h2>
              </div>

              {/* Summary */}
              <p className="text-base text-slate-700 leading-relaxed mb-5">{c.summary}</p>

              {/* Address */}
              <div className="text-sm text-slate-600 leading-relaxed">
                <p>{c.address.line1}</p>
                <p>{c.address.line2}</p>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

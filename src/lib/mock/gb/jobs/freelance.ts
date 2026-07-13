import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── freelance ─────────────────────────────────────────────────────────────────
export const JOBS_FREELANCE: MockListing[] = [
  {
    id: "job-free-01", href: "/listings/job-free-01", advId: "30021",
    images: [{ src: img(5), alt: "Design workspace" }],
    priceLabel: "£400–£600",
    priceSuffix: "/ day",
    title: "Freelance Brand Designer — Logo & Identity, Remote OK",
    detailsLabel: "FREELANCE • REMOTE • DESIGN",
    locationLabel: "Remote (UK)",
    postedAt: hrsAgo(1),
    description: "<p>Growing digital agency looking for a talented <strong>Freelance Brand Designer</strong> for a 6-week brand refresh project. Deliverables: logo suite, brand guidelines, and social media templates. Remote working, UK hours.</p>",
    keyDetails: [
      { key: "Contract",    value: "Freelance / project"   },
      { key: "Duration",    value: "6 weeks"               },
      { key: "Arrangement", value: "Fully remote"          },
      { key: "Day Rate",    value: "£400–£600/day"         },
      { key: "Start Date",  value: "ASAP"                  },
    ],
    goodToKnow: [
      { key: "Tools",       value: "Figma, Adobe CC"        },
      { key: "Portfolio",   value: "Required with proposal" },
      { key: "Experience",  value: "5+ yrs brand design"   },
      { key: "IR35",        value: "Outside IR35"           },
      { key: "Apply Via",   value: "Message with portfolio" },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.bizConsult,
  },
  {
    id: "job-free-02", href: "/listings/job-free-02", advId: "30022",
    images: [{ src: img(6), alt: "Video editing suite" }],
    priceLabel: "£250–£350",
    priceSuffix: "/ day",
    title: "Freelance Video Editor — Social Content, 3-Month Contract, Remote",
    detailsLabel: "FREELANCE • REMOTE • VIDEO",
    locationLabel: "Remote (UK)",
    postedAt: daysAgo(1),
    description: "<p>Fast-growing lifestyle brand seeking an experienced <strong>Freelance Video Editor</strong> for ongoing social content. Output: 3–5 short-form videos per week for Instagram Reels, TikTok, and YouTube Shorts. Shoot footage provided — editing only.</p><p>Initial 3-month contract with strong likelihood of extension. Fully remote with flexible hours around agreed deadlines.</p>",
    keyDetails: [
      { key: "Contract",    value: "Freelance, 3 months+"        },
      { key: "Volume",      value: "3–5 videos/week"              },
      { key: "Arrangement", value: "Fully remote"                },
      { key: "Day Rate",    value: "£250–£350/day (pro-rata)"    },
      { key: "Start Date",  value: "ASAP"                        },
    ],
    goodToKnow: [
      { key: "Tools",      value: "Premiere Pro or DaVinci"  },
      { key: "Portfolio",  value: "Required with proposal"   },
      { key: "IR35",       value: "Outside IR35"             },
      { key: "Payment",    value: "Monthly, net 30"          },
      { key: "Apply Via",  value: "Message with portfolio"   },
    ],
    coordinates: { lat: 51.4975, lng: -0.1419 },
    seller: SELLERS.bizConsult,
  },
  {
    id: "job-free-03", href: "/listings/job-free-03", advId: "30023",
    images: [{ src: img(7), alt: "Developer at laptop" }],
    priceLabel: "£550–£700",
    priceSuffix: "/ day",
    title: "Freelance Node.js Developer — FinTech API, 4-Month Contract, Outside IR35",
    detailsLabel: "FREELANCE • HYBRID • BACKEND DEV",
    locationLabel: "City of London",
    postedAt: daysAgo(2),
    description: "<p>London-based FinTech seeking a senior <strong>Freelance Node.js Backend Developer</strong> for a 4-month greenfield payments API project. Stack: Node.js, TypeScript, PostgreSQL, and AWS Lambda. 1–2 days per week on-site at our City of London office.</p><p>Must be available within 2 weeks. Clear outside IR35 determination provided by client legal team.</p>",
    keyDetails: [
      { key: "Contract",    value: "Freelance, 4 months"           },
      { key: "Arrangement", value: "Hybrid (1–2 days on-site)"     },
      { key: "Day Rate",    value: "£550–£700/day"                 },
      { key: "Start Date",  value: "2 weeks from agreement"        },
      { key: "Extension",   value: "Likely — budget confirmed"     },
    ],
    goodToKnow: [
      { key: "Stack",      value: "Node.js, TS, Postgres, AWS"   },
      { key: "IR35",       value: "Outside — confirmed"           },
      { key: "Payment",    value: "Weekly via Ltd or umbrella"   },
      { key: "Visa",       value: "Right to work in UK"          },
      { key: "Apply Via",  value: "Message with LinkedIn / CV"   },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.techCo,
  },
];


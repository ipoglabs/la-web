import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── freelance_contractors ──────────────────────────────────────────────────────
export const BUSINESS_FREELANCE: MockListing[] = [
  {
    id: "biz-free-01", href: "/listings/biz-free-01", advId: "70021",
    images: [{ src: img(5), alt: "Developer at laptop" }],
    priceLabel: "£600",
    priceSuffix: "/ day",
    title: "Senior Full-Stack Developer Available — React/Node, Outside IR35",
    detailsLabel: "FREELANCE • TECH • REMOTE / HYBRID",
    locationLabel: "London (Remote available)",
    postedAt: hrsAgo(1),
    description: "<p>Senior <strong>Full-Stack Contractor</strong> with 8 years experience in React, Node.js, TypeScript, and AWS. Available from July 2026. Comfortable outside IR35, immediate start possible. Strong references from previous contracts.</p>",
    keyDetails: [
      { key: "Skills",     value: "React, Node.js, TS, AWS" },
      { key: "Experience", value: "8 years"                 },
      { key: "Day Rate",   value: "£550–£650/day"           },
      { key: "IR35",       value: "Outside IR35"            },
    ],
    goodToKnow: [
      { key: "Available",   value: "From July 2026"       },
      { key: "Notice",      value: "Immediate start"      },
      { key: "References",  value: "Available on request" },
      { key: "Location",    value: "Remote / Hybrid, London" },
    ],
    coordinates: { lat: 51.5245, lng: -0.0789 },
    seller: SELLERS.techCo,
  },
  {
    id: "biz-free-02", href: "/listings/biz-free-02", advId: "70022",
    images: [{ src: img(6), alt: "Freelance designer" }],
    priceLabel: "£350",
    priceSuffix: "/ day",
    title: "Freelance Brand Designer Available — Figma, Print & Motion, Remote",
    detailsLabel: "FREELANCE • DESIGN • REMOTE / LONDON",
    locationLabel: "London (Remote available)",
    postedAt: daysAgo(1),
    description: "<p>Experienced <strong>freelance brand and UX designer</strong> with 6 years across agency and in-house. Specialising in brand identity, Figma UI/UX, print, and motion graphics. Available immediately for project or day-rate contracts.</p>",
    keyDetails: [
      { key: "Skills",     value: "Brand, Figma, Motion"    },
      { key: "Experience", value: "6 years agency + in-house" },
      { key: "Day Rate",   value: "£300–£400/day"            },
      { key: "IR35",       value: "Outside IR35"            },
    ],
    goodToKnow: [
      { key: "Available",  value: "Immediately"             },
      { key: "Portfolio",  value: "Available on request"    },
      { key: "References", value: "Provided"                },
      { key: "Location",   value: "Remote / London hybrid"  },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.bizConsult,
  },
  {
    id: "biz-free-03", href: "/listings/biz-free-03", advId: "70023",
    images: [{ src: img(7), alt: "Freelance accountant" }],
    priceLabel: "£450",
    priceSuffix: "/ day",
    title: "Interim FD / Finance Contractor — ACA Qualified, £400–500/Day",
    detailsLabel: "FREELANCE • FINANCE • LONDON / REMOTE",
    locationLabel: "London / Remote",
    postedAt: daysAgo(2),
    description: "<p>ACA-qualified <strong>interim Finance Director and CFO contractor</strong> with 15 years experience across PE-backed and listed businesses. Board reporting, M&A, fundraising, and financial restructuring. Available from August 2026.</p>",
    keyDetails: [
      { key: "Role",       value: "Interim FD / CFO"        },
      { key: "Experience", value: "15 years, PE + listed"   },
      { key: "Day Rate",   value: "£400–£500/day"            },
      { key: "IR35",       value: "Outside IR35"            },
    ],
    goodToKnow: [
      { key: "Available",  value: "From August 2026"        },
      { key: "Notice",     value: "2 weeks"                 },
      { key: "References", value: "Available on request"    },
      { key: "Location",   value: "Hybrid, London-based"    },
    ],
    coordinates: { lat: 51.5054, lng: -0.0235 },
    seller: SELLERS.bizConsult,
  },
];


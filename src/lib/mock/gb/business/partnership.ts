import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── partnership ────────────────────────────────────────────────────────────────
export const BUSINESS_PARTNERSHIP: MockListing[] = [
  {
    id: "biz-partner-01", href: "/listings/biz-partner-01", advId: "70031",
    images: [{ src: img(6), alt: "Startup founders" }],
    priceLabel: "Equity deal",
    title: "Seeking Technical Co-Founder — HealthTech App, MVP Stage, London",
    detailsLabel: "PARTNERSHIP • STARTUP • HEALTHTECH",
    locationLabel: "London",
    postedAt: hrsAgo(5),
    description: "<p>Business-side founder of a <strong>HealthTech startup</strong> (GP appointment marketplace) seeking a technical co-founder. MVP designed, market validated, and first NHS trust in discussion. Equity split negotiable. £30K seed funding secured.</p>",
    keyDetails: [
      { key: "Sector",     value: "HealthTech (GP App)"     },
      { key: "Stage",      value: "MVP / pre-seed"          },
      { key: "Equity",     value: "Negotiable (25–40%)"     },
      { key: "Funding",    value: "£30K seed secured"       },
    ],
    goodToKnow: [
      { key: "Role Needed", value: "CTO / Tech Co-Founder"  },
      { key: "Skills",      value: "React Native, Node.js"  },
      { key: "NHS",         value: "Trust in discussion"    },
      { key: "Commitment",  value: "Full-time preferred"    },
    ],
    coordinates: { lat: 51.5245, lng: -0.0789 },
    seller: SELLERS.startupHub,
  },
  {
    id: "biz-partner-02", href: "/listings/biz-partner-02", advId: "70032",
    images: [{ src: img(7), alt: "Food franchise opportunity" }],
    priceLabel: "From £25,000",
    title: "Food Franchise Opportunity — Proven Brand, 3 London Sites Available",
    detailsLabel: "PARTNERSHIP • FRANCHISE • LONDON",
    locationLabel: "Greater London",
    postedAt: daysAgo(1),
    description: "<p>Opportunity to operate a <strong>proven street food franchise</strong> in 3 pre-identified London locations (Shoreditch, Canary Wharf, King's Cross). Full training, branding, and supply chain support provided. First year revenue guarantee for qualifying franchisees.</p>",
    keyDetails: [
      { key: "Model",    value: "Food franchise"          },
      { key: "Sites",    value: "3 London locations"      },
      { key: "Fee",      value: "From £25,000"            },
      { key: "Support",  value: "Training + supply chain" },
    ],
    goodToKnow: [
      { key: "Revenue Guarantee", value: "Year 1 guarantee"        },
      { key: "Exclusive",         value: "Territory exclusivity"    },
      { key: "Experience",        value: "F&B background preferred" },
      { key: "Info Pack",         value: "NDA then prospectus"      },
    ],
    coordinates: { lat: 51.5181, lng: -0.0877 },
    seller: SELLERS.startupHub,
  },
  {
    id: "biz-partner-03", href: "/listings/biz-partner-03", advId: "70033",
    images: [{ src: img(8), alt: "Investor meeting" }],
    priceLabel: "Investment: £50K",
    title: "Angel Investor Sought — EdTech SaaS, 18% Equity, Post-Revenue",
    detailsLabel: "PARTNERSHIP • INVESTMENT • EDTECH",
    locationLabel: "London",
    postedAt: daysAgo(3),
    description: "<p>Post-revenue <strong>EdTech SaaS platform</strong> (school communication tool, 140 paying schools) seeking £50K angel investment for sales hire and marketing. Offering 18% equity. Current ARR £120K, 40% YoY growth.</p>",
    keyDetails: [
      { key: "Sector",    value: "EdTech SaaS"            },
      { key: "ARR",       value: "£120K (40% YoY growth)"  },
      { key: "Equity",    value: "18% for £50K"           },
      { key: "Customers", value: "140 paying schools"      },
    ],
    goodToKnow: [
      { key: "Use of Funds", value: "Sales hire + marketing" },
      { key: "Deck",         value: "Available under NDA"    },
      { key: "Founders",     value: "Ex-teacher + ex-Google" },
      { key: "Board Seat",   value: "Offered"               },
    ],
    coordinates: { lat: 51.5165, lng: -0.0948 },
    seller: SELLERS.startupHub,
  },
];


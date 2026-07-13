import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── home_services ─────────────────────────────────────────────────────────────
export const SERVICES_HOME: MockListing[] = [
  {
    id: "svc-home-01", href: "/listings/svc-home-01", advId: "40001",
    images: [{ src: img(1), alt: "Plumber at work" }],
    priceLabel: "From £80",
    priceSuffix: "/ job",
    title: "Gas Safe Plumber & Heating Engineer — 24/7 London",
    detailsLabel: "HOME SERVICES • GAS SAFE • LONDON",
    locationLabel: "All London Boroughs",
    postedAt: hrsAgo(1),
    description: "<p>Fully qualified <strong>Gas Safe registered plumber and heating engineer</strong> covering all London boroughs 24/7. Boiler servicing, repairs, and installations. Leaks, drains, and full bathroom fit-outs.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Plumbing & Heating"   },
      { key: "Coverage",       value: "All London boroughs"  },
      { key: "Availability",   value: "24/7 emergency"       },
      { key: "Qualifications", value: "Gas Safe, NVQ Level 3" },
    ],
    goodToKnow: [
      { key: "Call-out",   value: "From £80 (8am–6pm)"    },
      { key: "Estimates",  value: "Free, no obligation"   },
      { key: "Registered", value: "Gas Safe #123456"      },
      { key: "Insurance",  value: "£2M public liability"  },
    ],
    coordinates: { lat: 51.5282, lng: -0.1078 },
    seller: SELLERS.handyFix,
  },
  {
    id: "svc-home-02", href: "/listings/svc-home-02", advId: "40002",
    images: [{ src: img(2), alt: "Electrician wiring" }],
    priceLabel: "From £60",
    priceSuffix: "/hr",
    title: "NICEIC Electrician — Rewires, Consumer Units, Certificates",
    detailsLabel: "HOME SERVICES • NICEIC • LONDON",
    locationLabel: "South & South-East London",
    postedAt: hrsAgo(4),
    description: "<p>Fully qualified <strong>NICEIC approved electrician</strong> covering South and South-East London. Full or partial rewires, consumer unit upgrades, EICRs, and EV charger installations. Electrical Installation Certificates issued.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Electrical"           },
      { key: "Coverage",       value: "South & SE London"    },
      { key: "Availability",   value: "Mon–Sat 7am–7pm"      },
      { key: "Qualifications", value: "NICEIC, 18th Edition" },
    ],
    goodToKnow: [
      { key: "Quote",      value: "Free, within 24hrs"    },
      { key: "Registered", value: "NICEIC #7654321"       },
      { key: "Insurance",  value: "£2M public liability"  },
      { key: "EICR",       value: "Certificates issued"   },
    ],
    coordinates: { lat: 51.4613, lng: -0.1157 },
    seller: SELLERS.handyFix,
  },
  {
    id: "svc-home-03", href: "/listings/svc-home-03", advId: "40003",
    images: [{ src: img(3), alt: "Painter and decorator" }],
    priceLabel: "From £180",
    priceSuffix: "/ day",
    title: "Self-Employed Painter & Decorator — Interiors, Feature Walls, Wallpapering",
    detailsLabel: "HOME SERVICES • SELF-EMPLOYED • NORTH LONDON",
    locationLabel: "North & East London",
    postedAt: daysAgo(2),
    description: "<p>Experienced self-employed <strong>painter and decorator</strong> covering North and East London. Interior and exterior painting, feature walls, coving, and wallpapering. Competitive day rates — no job too small.</p>",
    keyDetails: [
      { key: "Service Type",  value: "Painting & Decorating"  },
      { key: "Coverage",      value: "North & East London"    },
      { key: "Availability",  value: "Mon–Fri, some weekends" },
      { key: "Experience",    value: "18 years trade exp."    },
    ],
    goodToKnow: [
      { key: "Quote",      value: "Free site visit"         },
      { key: "Materials",  value: "Can supply or use yours" },
      { key: "Insurance",  value: "£1M public liability"    },
      { key: "Deposit",    value: "10% to secure booking"   },
    ],
    coordinates: { lat: 51.5453, lng: -0.0553 },
    seller: SELLERS.handyFix,
  },
];


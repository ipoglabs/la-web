import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── travel_services ────────────────────────────────────────────────────────────
export const TRAVEL_SERVICES: MockListing[] = [
  {
    id: "travel-svc-01", href: "/listings/travel-svc-01", advId: "14041",
    images: [{ src: img(7), alt: "Travel insurance" }],
    priceLabel: "From £18",
    priceSuffix: "/ trip",
    title: "Annual Travel Insurance — Worldwide, Medical Up to £10M, FCDO Cover",
    detailsLabel: "TRAVEL SERVICE • INSURANCE • UK-WIDE",
    locationLabel: "UK-wide",
    postedAt: hrsAgo(1),
    description: "<p>Comprehensive <strong>annual worldwide travel insurance</strong> from a 5-star Defaqto-rated provider. Medical cover up to £10M, cancellation £7,500, and gadget cover included. FCDO disruption cover and 24/7 emergency helpline.</p>",
    keyDetails: [
      { key: "Medical",     value: "Up to £10M"            },
      { key: "Cancellation", value: "Up to £7,500"         },
      { key: "Coverage",    value: "Worldwide, annual"     },
      { key: "Rating",      value: "5-star Defaqto"        },
    ],
    goodToKnow: [
      { key: "Helpline",   value: "24/7 emergency line"    },
      { key: "FCDO",       value: "Disruption cover incl." },
      { key: "Over 65",    value: "Specialist options"     },
      { key: "Activities", value: "40+ sports included"    },
    ],
    coordinates: { lat: 51.4952, lng: -0.1441 },
    seller: SELLERS.travelPro,
  },
  {
    id: "travel-svc-02", href: "/listings/travel-svc-02", advId: "14042",
    images: [{ src: img(8), alt: "Airport transfer" }],
    priceLabel: "£35",
    priceSuffix: "/ transfer",
    title: "Airport Transfer Service — Fixed Price, Meet & Greet, All London Airports",
    detailsLabel: "TRAVEL SERVICE • AIRPORT TRANSFER • LONDON",
    locationLabel: "London (all airports)",
    postedAt: hrsAgo(3),
    description: "<p>Professional <strong>fixed-price airport transfer</strong> covering Heathrow, Gatwick, Stansted, Luton, and London City. Meet & greet in arrivals, flight tracking, and up to 60 mins free waiting. Clean executive vehicles, no surge pricing.</p>",
    keyDetails: [
      { key: "Airports",  value: "LHR, LGW, STN, LTN, LCY" },
      { key: "Price",     value: "Fixed — no surge pricing" },
      { key: "Waiting",   value: "60 min free after landing" },
      { key: "Vehicles",  value: "Executive cars + MPVs"    },
    ],
    goodToKnow: [
      { key: "Tracking",  value: "Flight tracked"           },
      { key: "Meet",      value: "Arrivals hall with sign"   },
      { key: "Booking",   value: "48hrs+ notice preferred"  },
      { key: "Payment",   value: "Card or cash"             },
    ],
    coordinates: { lat: 51.4700, lng: -0.4543 },
    seller: SELLERS.travelPro,
  },
  {
    id: "travel-svc-03", href: "/listings/travel-svc-03", advId: "14043",
    images: [{ src: img(9), alt: "Visa application service" }],
    priceLabel: "From £45",
    priceSuffix: "/ application",
    title: "Visa Application Service — UK-Based, US, Schengen, India & More",
    detailsLabel: "TRAVEL SERVICE • VISA ASSISTANCE • UK-WIDE",
    locationLabel: "London / Online (UK-wide)",
    postedAt: daysAgo(1),
    description: "<p>IATA-accredited <strong>visa application service</strong> for US B1/B2, Schengen, India e-Visa, UAE, Canada, and more. Document checklist, form completion, and submission support. Turnaround 24–48 hours. Refund if visa refused on our error.</p>",
    keyDetails: [
      { key: "Visas",     value: "US, Schengen, India, UAE" },
      { key: "Format",    value: "Online or in-person"      },
      { key: "Turnaround", value: "24–48 hours"             },
      { key: "Accredited", value: "IATA member"             },
    ],
    goodToKnow: [
      { key: "Refund",    value: "If refused on our error"  },
      { key: "Doc Check", value: "Free pre-check included"  },
      { key: "Urgent",    value: "Same-day service + £25"   },
      { key: "Reviews",   value: "4.9★ (500+ customers)"   },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.travelPro,
  },
];


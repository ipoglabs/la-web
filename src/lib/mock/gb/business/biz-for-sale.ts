import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── biz_for_sale ──────────────────────────────────────────────────────────────
export const BUSINESS_FOR_SALE: MockListing[] = [
  {
    id: "biz-sale-01", href: "/listings/biz-sale-01", advId: "70001",
    images: [{ src: img(1), alt: "Coffee shop exterior" }],
    priceLabel: "£65,000",
    title: "Thriving Independent Coffee Shop — Central Location, £180K Turnover",
    detailsLabel: "F&B • £180K/YR • GOING CONCERN",
    locationLabel: "Shoreditch, London",
    postedAt: hrsAgo(4),
    description: "<p>Established <strong>independent coffee shop</strong> trading 6+ years in a prime Shoreditch location. Turnover £180K p.a., net profit ~£45K. 25-seat capacity, full commercial kitchen, and A3 lease (3 yrs remaining at £22K pa). Loyal customer base and excellent online reviews.</p>",
    keyDetails: [
      { key: "Business Type",  value: "Coffee Shop / Café"    },
      { key: "Annual Turnover", value: "~£180,000"            },
      { key: "Net Profit",     value: "~£45,000 p.a."         },
      { key: "Lease",          value: "3 yrs remaining, £22K pa" },
      { key: "Seats",          value: "25 covers"             },
    ],
    goodToKnow: [
      { key: "Staff",      value: "3 PT staff, transferable" },
      { key: "Licence",    value: "Alcohol licence included" },
      { key: "Reason",     value: "Retirement"               },
      { key: "Viewings",   value: "Strictly by appointment"  },
      { key: "NDA",        value: "Required before details"  },
    ],
    coordinates: { lat: 51.5245, lng: -0.0789 },
    seller: SELLERS.bizBroker,
  },
  {
    id: "biz-sale-02", href: "/listings/biz-sale-02", advId: "70002",
    images: [{ src: img(2), alt: "Digital agency" }],
    priceLabel: "£120,000",
    title: "Digital Marketing Agency — SaaS Clients, £240K ARR, Remote Team",
    detailsLabel: "DIGITAL • £240K ARR • GOING CONCERN",
    locationLabel: "Remote / London",
    postedAt: daysAgo(1),
    description: "<p>Profitable <strong>digital marketing agency</strong> with £240K annual recurring revenue from 22 retained SaaS clients. Fully remote team of 6. Owner seeking exit after 8 years — happy to provide 6-month handover. Strong systems and processes documented.</p>",
    keyDetails: [
      { key: "Business Type",  value: "Digital Marketing Agency" },
      { key: "ARR",            value: "£240,000 (22 clients)"     },
      { key: "Team",           value: "6 remote staff"            },
      { key: "Assets",         value: "Systems, IP, client base"  },
      { key: "Handover",       value: "6 months included"         },
    ],
    goodToKnow: [
      { key: "Profit Margin",  value: "~35%"                     },
      { key: "Churn",          value: "<5% annually"             },
      { key: "Location",       value: "Fully remote"             },
      { key: "Reason",         value: "Owner retirement"         },
      { key: "NDA",            value: "Required before details"  },
    ],
    coordinates: { lat: 51.5226, lng: -0.0794 },
    seller: SELLERS.bizBroker,
  },
  {
    id: "biz-sale-03", href: "/listings/biz-sale-03", advId: "70003",
    images: [{ src: img(3), alt: "Laundromat" }],
    priceLabel: "£38,000",
    title: "Self-Service Laundromat — 10 Machines, Semi-Managed, SE London",
    detailsLabel: "LAUNDRY • SEMI-MANAGED • GOING CONCERN",
    locationLabel: "New Cross, London",
    postedAt: daysAgo(2),
    description: "<p>Well-located <strong>self-service laundromat</strong> with 10 commercial machines (6 washers, 4 dryers) in New Cross. Card payment only, CCTV monitored, semi-managed. Turnover ~£70K pa, lease 4 years remaining at £18K pa.</p>",
    keyDetails: [
      { key: "Business Type",   value: "Self-service laundromat" },
      { key: "Annual Turnover", value: "~£70,000"               },
      { key: "Machines",        value: "6 washers + 4 dryers"   },
      { key: "Lease",           value: "4 yrs remaining, £18K pa" },
      { key: "Management",      value: "Semi-managed, low hours" },
    ],
    goodToKnow: [
      { key: "CCTV",     value: "Full coverage"              },
      { key: "Payments", value: "Card only (no cash)"        },
      { key: "Reason",   value: "Portfolio consolidation"    },
      { key: "Viewings", value: "By appointment only"        },
      { key: "NDA",      value: "Required before financials" },
    ],
    coordinates: { lat: 51.4741, lng: -0.0440 },
    seller: SELLERS.bizBroker,
  },
];


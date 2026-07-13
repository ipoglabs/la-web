import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── b2b_service ───────────────────────────────────────────────────────────────
export const BUSINESS_B2B: MockListing[] = [
  {
    id: "biz-b2b-01", href: "/listings/biz-b2b-01", advId: "70011",
    images: [{ src: img(3), alt: "HR consulting" }],
    priceLabel: "From £1,500",
    priceSuffix: "/ mo",
    title: "Outsourced HR for SMEs — Employment Law, Contracts, Compliance",
    detailsLabel: "B2B SERVICE • CIPD • UK-WIDE",
    locationLabel: "London / Remote",
    postedAt: hrsAgo(2),
    description: "<p>CIPD-qualified <strong>outsourced HR consultancy</strong> supporting SMEs (5–150 employees). Contracts of employment, disciplinary support, TUPE, redundancy processes, and ongoing employment law advice. Cost-effective alternative to in-house HR.</p>",
    keyDetails: [
      { key: "Service",       value: "Outsourced HR"         },
      { key: "Coverage",      value: "UK-wide (remote)"      },
      { key: "Availability",  value: "Mon–Fri, same-day resp." },
      { key: "Qualifications", value: "CIPD Level 7"          },
    ],
    goodToKnow: [
      { key: "Contract",   value: "Monthly rolling"         },
      { key: "Staff Size", value: "5–150 employees"         },
      { key: "First Month", value: "Free HR audit"          },
      { key: "Insurance",  value: "PI insured"              },
    ],
    coordinates: { lat: 51.5054, lng: -0.0235 },
    seller: SELLERS.bizConsult,
  },
  {
    id: "biz-b2b-02", href: "/listings/biz-b2b-02", advId: "70012",
    images: [{ src: img(4), alt: "Logistics" }],
    priceLabel: "From £0.85",
    priceSuffix: "/ parcel",
    title: "B2B Same-Day & Next-Day Courier — London to UK, API Integration",
    detailsLabel: "B2B SERVICE • LOGISTICS • LONDON",
    locationLabel: "Park Royal, London",
    postedAt: daysAgo(1),
    description: "<p>Reliable <strong>B2B courier service</strong> offering same-day London runs and next-day UK delivery from £0.85/parcel. API integration for eCommerce platforms (Shopify, WooCommerce). Dedicated account manager and track-and-trace.</p>",
    keyDetails: [
      { key: "Service",      value: "B2B Courier"          },
      { key: "Same Day",     value: "London — by 10pm"     },
      { key: "Next Day",     value: "UK mainland"          },
      { key: "Integration",  value: "Shopify, WooCommerce" },
    ],
    goodToKnow: [
      { key: "Min. Volume",  value: "20 parcels/week"       },
      { key: "Insurance",    value: "£100 included/parcel"  },
      { key: "Contract",     value: "Monthly rolling"       },
      { key: "Account Mgr",  value: "Dedicated contact"     },
    ],
    coordinates: { lat: 51.5313, lng: -0.2813 },
    seller: SELLERS.bizBroker,
  },
  {
    id: "biz-b2b-03", href: "/listings/biz-b2b-03", advId: "70013",
    images: [{ src: img(5), alt: "Commercial cleaning team" }],
    priceLabel: "From £120",
    priceSuffix: "/ visit",
    title: "Commercial Office Cleaning — Daily / Weekly, London, Insured",
    detailsLabel: "B2B SERVICE • CLEANING • LONDON",
    locationLabel: "Greater London",
    postedAt: daysAgo(2),
    description: "<p>Professional <strong>commercial cleaning company</strong> serving offices, retail units, and shared workspaces across Greater London. Daily, weekly, and one-off deep cleans. ISO 9001 accredited, fully insured, DBS-checked staff.</p>",
    keyDetails: [
      { key: "Service",      value: "Commercial Cleaning"   },
      { key: "Coverage",     value: "Greater London"        },
      { key: "Availability", value: "Early mornings & eves" },
      { key: "Accreditation", value: "ISO 9001, Safe Contractor" },
    ],
    goodToKnow: [
      { key: "Staff",    value: "DBS checked, uniformed"  },
      { key: "Insurance", value: "£5M public liability"     },
      { key: "Contract", value: "Monthly rolling"          },
      { key: "Trial",    value: "Free one-off clean"       },
    ],
    coordinates: { lat: 51.5181, lng: -0.0877 },
    seller: SELLERS.bizConsult,
  },
];


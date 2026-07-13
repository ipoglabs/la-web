import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── equipment_supplies ─────────────────────────────────────────────────────────
export const BUSINESS_EQUIPMENT: MockListing[] = [
  {
    id: "biz-equip-01", href: "/listings/biz-equip-01", advId: "70041",
    images: [{ src: img(7), alt: "Commercial catering equipment" }],
    priceLabel: "£3,200",
    title: "Commercial Kitchen Equipment Bundle — Oven, Fryer, Prep Table",
    detailsLabel: "EQUIPMENT • CATERING • SOUTH LONDON",
    locationLabel: "Peckham, London",
    postedAt: daysAgo(2),
    description: "<p>Full <strong>commercial kitchen equipment bundle</strong> from a closing restaurant. Includes: 6-burner range oven (Lincat), double basket fryer (Falcon), 1.8m stainless prep table, and under-counter fridge. All tested and working.</p>",
    keyDetails: [
      { key: "Items",     value: "Oven, fryer, table, fridge" },
      { key: "Brand",     value: "Lincat / Falcon"            },
      { key: "Condition", value: "Good — all tested"          },
      { key: "Bundle",    value: "Sold together or separate"  },
    ],
    goodToKnow: [
      { key: "Reason",     value: "Restaurant closure"      },
      { key: "Collection", value: "Peckham — must collect"  },
      { key: "Tested",     value: "Yes — working"           },
      { key: "Separate",   value: "Items can be split"      },
    ],
    coordinates: { lat: 51.4741, lng: -0.0686 },
    seller: SELLERS.bizBroker,
  },
  {
    id: "biz-equip-02", href: "/listings/biz-equip-02", advId: "70042",
    images: [{ src: img(8), alt: "Office furniture" }],
    priceLabel: "£850",
    title: "Office Furniture Clearance — 20 Desks, Chairs & Pedestals, EC1",
    detailsLabel: "EQUIPMENT • OFFICE FURNITURE • EAST LONDON",
    locationLabel: "Clerkenwell, London",
    postedAt: hrsAgo(6),
    description: "<p>Office relocation clearance of <strong>20 sit-stand desks</strong> (Steelcase), 20 ergonomic task chairs (Herman Miller), and 20 3-drawer pedestals. Excellent condition throughout — office upgrade forced the change. Must collect within 5 days.</p>",
    keyDetails: [
      { key: "Items",     value: "20 desks + chairs + peds" },
      { key: "Brand",     value: "Steelcase / Herman Miller" },
      { key: "Condition", value: "Excellent"                 },
      { key: "Bundle",    value: "Full lot or split by item" },
    ],
    goodToKnow: [
      { key: "Deadline",   value: "Collect within 5 days"   },
      { key: "Collection", value: "Clerkenwell EC1 — van req." },
      { key: "Dismantle",  value: "Help available"           },
      { key: "Reason",     value: "Office relocation"        },
    ],
    coordinates: { lat: 51.5228, lng: -0.1063 },
    seller: SELLERS.bizBroker,
  },
  {
    id: "biz-equip-03", href: "/listings/biz-equip-03", advId: "70043",
    images: [{ src: img(9), alt: "Lease photocopier" }],
    priceLabel: "From £65",
    priceSuffix: "/ mo",
    title: "Photocopier & Managed Print Lease — A3 Colour, Low Cost Per Page",
    detailsLabel: "EQUIPMENT • MANAGED PRINT • LONDON",
    locationLabel: "London / South East",
    postedAt: daysAgo(3),
    description: "<p>Supply and manage <strong>A3 colour photocopiers</strong> for businesses of all sizes on flexible lease terms. Canon and Konica Minolta ranges. Low pence-per-page contracts, on-site maintenance included, and free toner delivery.</p>",
    keyDetails: [
      { key: "Service",   value: "Managed Print Lease"    },
      { key: "Coverage",  value: "London & South East"    },
      { key: "Brands",    value: "Canon, Konica Minolta"  },
      { key: "Contract",  value: "12–60 month terms"      },
    ],
    goodToKnow: [
      { key: "Toner",     value: "Free delivery included" },
      { key: "Service",   value: "On-site maintenance"    },
      { key: "Min. Term", value: "12 months"              },
      { key: "Trial",     value: "Free demo available"    },
    ],
    coordinates: { lat: 51.5054, lng: -0.0235 },
    seller: SELLERS.bizConsult,
  },
];


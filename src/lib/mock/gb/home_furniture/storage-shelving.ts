import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── storage_shelving ────────────────────────────────────────────────────────────
export const HOME_STORAGE: MockListing[] = [
  {
    id: "home-store-01", href: "/listings/home-store-01", advId: "18041",
    images: [{ src: img(6), alt: "IKEA KALLAX shelving" }],
    priceLabel: "£60",
    title: "IKEA KALLAX 4×4 Shelving Unit — White, 147×147cm, Good Condition",
    detailsLabel: "STORAGE & SHELVING • GOOD • KALLAX 4×4",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(6),
    description: "<p><strong>IKEA KALLAX 4×4 shelving unit</strong> (147×147cm) in white. 16 cubes — 4 with doors, rest open. Good condition — some small marks on side panels. Flat-pack for transport. Must collect.</p>",
    keyDetails: [
      { key: "Brand",     value: "IKEA KALLAX 4×4"         },
      { key: "Size",      value: "147 × 147 cm"            },
      { key: "Doors",     value: "4 inserts with doors"    },
      { key: "Condition", value: "Good — minor marks"      },
    ],
    goodToKnow: [
      { key: "Dismantle",  value: "Yes — flat-pack"         },
      { key: "Marks",      value: "Small side panel marks"  },
      { key: "Collection", value: "Hackney E8"              },
      { key: "Help",       value: "Help dismantling"        },
    ],
    coordinates: { lat: 51.5465, lng: -0.0554 },
    seller: SELLERS.homeStore,
  },
  {
    id: "home-store-02", href: "/listings/home-store-02", advId: "18042",
    images: [{ src: img(7), alt: "Chrome wire shelving" }],
    priceLabel: "£75",
    title: "5-Tier Chrome Wire Shelving System — 90×45×180cm, Commercial Grade",
    detailsLabel: "STORAGE & SHELVING • GOOD • WIRE SHELVING",
    locationLabel: "Stratford, London",
    postedAt: daysAgo(2),
    description: "<p>Commercial-grade <strong>5-tier chrome wire shelving unit</strong> (90×45×180cm) with adjustable shelf heights at 25mm increments. All 5 shelves, poles, and connectors present. Used in garage storage. Solid, no wobble.</p>",
    keyDetails: [
      { key: "Size",      value: "90×45×180 cm"             },
      { key: "Tiers",     value: "5 adjustable shelves"     },
      { key: "Material",  value: "Chrome wire"              },
      { key: "Condition", value: "Good"                    },
    ],
    goodToKnow: [
      { key: "Adjustable",  value: "25mm increments"        },
      { key: "Grade",       value: "Commercial wire"        },
      { key: "Dismantle",   value: "Yes"                   },
      { key: "Collection",  value: "Stratford E15"          },
    ],
    coordinates: { lat: 51.5428, lng: -0.0019 },
    seller: SELLERS.dave,
  },
  {
    id: "home-store-03", href: "/listings/home-store-03", advId: "18043",
    images: [{ src: img(8), alt: "IKEA BILLY bookcases" }],
    priceLabel: "£95",
    title: "IKEA BILLY Bookcases ×3 — White 80cm, Excellent, Full Hardware",
    detailsLabel: "STORAGE & SHELVING • EXCELLENT • BOOKCASES",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(3),
    description: "<p>Set of 3 <strong>IKEA BILLY bookcases</strong> (80×28×202cm each) in white. All adjustable shelves, wall fixings, and original hardware. Excellent condition — can be flat-packed for transport. Moving house — no room in new place.</p>",
    keyDetails: [
      { key: "Item",      value: "3× BILLY 80cm white"      },
      { key: "Size",      value: "80×28×202 cm each"        },
      { key: "Shelves",   value: "Adjustable"               },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Set",        value: "All 3 together"          },
      { key: "Dismantle",  value: "Yes — flat pack"         },
      { key: "Fixings",    value: "All hardware included"   },
      { key: "Collection", value: "Hackney E8"              },
    ],
    coordinates: { lat: 51.5465, lng: -0.0554 },
    seller: SELLERS.homePrivate,
  },
];


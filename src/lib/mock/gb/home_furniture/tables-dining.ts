import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── tables_dining ──────────────────────────────────────────────────────────────
export const HOME_TABLES: MockListing[] = [
  {
    id: "home-table-01", href: "/listings/home-table-01", advId: "18021",
    images: [{ src: img(4), alt: "Marble dining table" }],
    priceLabel: "£550",
    title: "Marble Effect Dining Table 180cm + 6 Velvet Chairs — Barker & Stonehouse",
    detailsLabel: "TABLES & DINING • EXCELLENT • DINING SET",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(2),
    description: "<p>Elegant <strong>marble-effect glass-top dining table (180×90cm)</strong> with 6 dusty pink velvet chairs. Barker & Stonehouse set — RRP £1,800. 18 months old, in superb condition. Reluctant sale — downsizing.</p>",
    keyDetails: [
      { key: "Brand",     value: "Barker & Stonehouse"       },
      { key: "Table",     value: "Marble effect, 180×90cm"   },
      { key: "Chairs",    value: "6× dusty pink velvet"      },
      { key: "Condition", value: "Excellent — 18 months"     },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£1,800"                   },
      { key: "Collection", value: "Chiswick W4 — van needed" },
      { key: "Smoke Free", value: "Yes"                      },
      { key: "Pet Free",   value: "Yes"                      },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-table-02", href: "/listings/home-table-02", advId: "18022",
    images: [{ src: img(5), alt: "Solid oak dining table" }],
    priceLabel: "£320",
    title: "Solid Oak Dining Table (160cm) + 6 Chairs — Excellent Condition",
    detailsLabel: "TABLES & DINING • EXCELLENT • DINING SET",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(2),
    description: "<p>Beautiful <strong>solid oak dining table (160×90cm)</strong> with six matching upholstered chairs in slate grey. Bought from John Lewis — RRP £1,200. Downsizing, reluctant sale.</p>",
    keyDetails: [
      { key: "Item",      value: "Table + 6 chairs"   },
      { key: "Material",  value: "Solid oak"          },
      { key: "Size",      value: "160 × 90 cm"        },
      { key: "Condition", value: "Excellent"          },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£1,200 (John Lewis)" },
      { key: "Age",        value: "2 years"             },
      { key: "Help",       value: "Help loading avail." },
      { key: "Collection", value: "Chiswick only"       },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-table-03", href: "/listings/home-table-03", advId: "18023",
    images: [{ src: img(6), alt: "Electric standing desk" }],
    priceLabel: "£280",
    title: "Fully Electric Standing Desk 180cm — Height Memory, Like New",
    detailsLabel: "HOME OFFICE • LIKE NEW • STANDING DESK",
    locationLabel: "Bermondsey, London",
    postedAt: hrsAgo(3),
    description: "<p>Nearly new <strong>electric height-adjustable standing desk</strong> (180×80cm) with 4 memory presets. Bought for home office, never fully set up. Dismantled, ready to collect. Box and instructions included.</p>",
    keyDetails: [
      { key: "Item",      value: "Electric standing desk" },
      { key: "Size",      value: "180 × 80 cm"            },
      { key: "Motor",     value: "Dual-motor electric"    },
      { key: "Condition", value: "Like new"               },
    ],
    goodToKnow: [
      { key: "Memory",     value: "4 height presets"   },
      { key: "Load",       value: "Max 120kg"           },
      { key: "Box",        value: "Original box"        },
      { key: "Collection", value: "Bermondsey only"     },
    ],
    coordinates: { lat: 51.4993, lng: -0.0637 },
    seller: SELLERS.quickSell,
  },
];


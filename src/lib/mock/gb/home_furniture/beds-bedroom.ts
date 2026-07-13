import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── beds_bedroom ───────────────────────────────────────────────────────────────
export const HOME_BEDS: MockListing[] = [
  {
    id: "home-bed-01", href: "/listings/home-bed-01", advId: "18011",
    images: [{ src: img(2), alt: "King bed frame" }],
    priceLabel: "£280",
    title: "Superking Ottoman Bed Frame — Grey Velvet, Storage, Excellent",
    detailsLabel: "BEDS & BEDROOM • EXCELLENT • OTTOMAN BED",
    locationLabel: "Wimbledon, London",
    postedAt: hrsAgo(5),
    description: "<p>Beautiful <strong>superking ottoman bed frame</strong> in grey velvet with hydraulic gas-lift storage base. Headboard with LED strip lights. Slats included (no mattress). Moving house — too large for new property.</p>",
    keyDetails: [
      { key: "Size",      value: "Superking (6ft)"          },
      { key: "Storage",   value: "Ottoman hydraulic base"   },
      { key: "Colour",    value: "Grey velvet"              },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Mattress",   value: "Not included"            },
      { key: "LED",        value: "Headboard LEDs included" },
      { key: "Dismantle",  value: "Yes — all bolted"        },
      { key: "Collection", value: "Wimbledon SW19"          },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-bed-02", href: "/listings/home-bed-02", advId: "18012",
    images: [{ src: img(3), alt: "Wardrobe" }],
    priceLabel: "£350",
    title: "IKEA PAX Wardrobe 3×250cm — Sliding Mirrors, White, Excellent",
    detailsLabel: "BEDS & BEDROOM • EXCELLENT • WARDROBE",
    locationLabel: "Putney, London",
    postedAt: daysAgo(1),
    description: "<p>Full-width <strong>IKEA PAX wardrobe system</strong> — 3 × 100cm units (300cm total) with mirrored sliding doors, internal rail, and drawers. White finish, excellent condition. 5 years old but looks near new.</p>",
    keyDetails: [
      { key: "Brand",     value: "IKEA PAX system"          },
      { key: "Width",     value: "300cm (3 × 100cm)"        },
      { key: "Doors",     value: "Mirrored sliding"         },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Internal",   value: "Rail + 4 drawers"        },
      { key: "Dismantle",  value: "Yes — flat pack"         },
      { key: "Collection", value: "Putney SW15 — van needed" },
      { key: "Age",        value: "5 years"                  },
    ],
    coordinates: { lat: 51.4618, lng: -0.2156 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-bed-03", href: "/listings/home-bed-03", advId: "18013",
    images: [{ src: img(4), alt: "Chest of drawers" }],
    priceLabel: "£195",
    title: "Solid Oak Chest of 6 Drawers — Dovetail Joints, Oak Furnitureland",
    detailsLabel: "BEDS & BEDROOM • GREAT • CHEST OF DRAWERS",
    locationLabel: "Twickenham, London",
    postedAt: daysAgo(2),
    description: "<p>Solid oak <strong>chest of 6 drawers</strong> (3 wide + 3 narrow) with smooth dovetail-jointed solid pine drawer boxes. Purchased from Oak Furnitureland — 4 years old, great condition, light polish marks only.</p>",
    keyDetails: [
      { key: "Material",  value: "Solid oak"               },
      { key: "Drawers",   value: "6 (3 wide + 3 narrow)"   },
      { key: "Joints",    value: "Dovetail"                },
      { key: "Condition", value: "Great — light marks only" },
    ],
    goodToKnow: [
      { key: "Brand",      value: "Oak Furnitureland"       },
      { key: "Age",        value: "4 years"                },
      { key: "Collection", value: "Twickenham TW1"          },
      { key: "Delivery",   value: "Not available"           },
    ],
    coordinates: { lat: 51.4488, lng: -0.3365 },
    seller: SELLERS.homePrivate,
  },
];


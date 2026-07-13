import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── travel_accessories ─────────────────────────────────────────────────────────
export const TRAVEL_ACCESSORIES: MockListing[] = [
  {
    id: "travel-acc-01", href: "/listings/travel-acc-01", advId: "14051",
    images: [{ src: img(8), alt: "Samsonite luggage" }],
    priceLabel: "£180",
    title: "Samsonite Pro-DLX5 Spinner Set — 2 Cases, Black, Like New",
    detailsLabel: "TRAVEL ACCESSORIES • LIKE NEW • LUGGAGE",
    locationLabel: "Mayfair, London",
    postedAt: daysAgo(1),
    description: "<p>Barely used <strong>Samsonite Pro-DLX5 2-piece spinner set</strong> in black — cabin (55cm) and medium (69cm). TSA-approved locks, silent dual wheels, and USB port. Purchased 2025 — used twice. Selling due to upgrade.</p>",
    keyDetails: [
      { key: "Brand",     value: "Samsonite Pro-DLX5"     },
      { key: "Set",       value: "Cabin + medium (2 cases)" },
      { key: "Colour",    value: "Black"                  },
      { key: "Condition", value: "Like new — used twice"  },
    ],
    goodToKnow: [
      { key: "TSA",        value: "TSA-approved locks"    },
      { key: "Wheels",     value: "Silent dual spinner"   },
      { key: "USB",        value: "USB port built-in"     },
      { key: "Collection", value: "Mayfair W1 only"       },
    ],
    coordinates: { lat: 51.5107, lng: -0.1471 },
    seller: SELLERS.quickSell,
  },
  {
    id: "travel-acc-02", href: "/listings/travel-acc-02", advId: "14052",
    images: [{ src: img(9), alt: "Travel accessories bundle" }],
    priceLabel: "£28",
    title: "Travel Essentials Bundle — Neck Pillow, Eye Mask, Adaptor, Packing Cubes",
    detailsLabel: "TRAVEL ACCESSORIES • NEW • BUNDLE",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(3),
    description: "<p>Surplus travel kit — never used, still packaged. <strong>Bundle includes:</strong> memory foam neck pillow, 3D contour eye mask, universal travel adaptor (150+ countries), and 4-piece compression packing cube set. All new in packaging.</p>",
    keyDetails: [
      { key: "Includes",  value: "Pillow, mask, adaptor, cubes" },
      { key: "Condition", value: "New, still in packaging"      },
      { key: "Adaptor",   value: "Works in 150+ countries"      },
      { key: "Cubes",     value: "4-piece compression set"      },
    ],
    goodToKnow: [
      { key: "Bundle",     value: "All 4 items only"         },
      { key: "Collection", value: "Islington N1"             },
      { key: "Postage",    value: "£3.95 tracked 48hr"       },
      { key: "Offers",     value: "Fixed price"              },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.alice,
  },
  {
    id: "travel-acc-03", href: "/listings/travel-acc-03", advId: "14053",
    images: [{ src: img(1), alt: "Osprey backpack" }],
    priceLabel: "£85",
    title: "Osprey Farpoint 40 Travel Backpack — Blue, Carry-On, Excellent Cond.",
    detailsLabel: "TRAVEL ACCESSORIES • EXCELLENT • BACKPACK",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(2),
    description: "<p>Excellent condition <strong>Osprey Farpoint 40L travel backpack</strong> in Muted Space Blue. Carry-on compliant for most airlines. StraightJacket compression straps, lockable zip sliders, and detachable daypack. Used on 3 trips only.</p>",
    keyDetails: [
      { key: "Brand",     value: "Osprey Farpoint 40"       },
      { key: "Colour",    value: "Muted Space Blue"         },
      { key: "Capacity",  value: "40L (carry-on)"           },
      { key: "Condition", value: "Excellent — 3 trips"      },
    ],
    goodToKnow: [
      { key: "Daypack",    value: "Detachable 13L included" },
      { key: "Airline",    value: "Carry-on most airlines"  },
      { key: "Collection", value: "Hackney E8"              },
      { key: "Postage",    value: "Available (£7 tracked)"  },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.dave,
  },
];


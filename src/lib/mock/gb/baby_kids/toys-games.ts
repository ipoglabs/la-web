import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── toys_games ─────────────────────────────────────────────────────────────────
export const BABY_TOYS: MockListing[] = [
  {
    id: "baby-toys-01", href: "/listings/baby-toys-01", advId: "15001",
    images: [{ src: img(1), alt: "ELC toy bundle" }],
    priceLabel: "£35",
    title: "Toddler Toy Bundle — 12 Items, ELC / Fisher-Price, Age 1–3",
    detailsLabel: "TOYS & GAMES • GOOD • TODDLER",
    locationLabel: "Wimbledon, London",
    postedAt: hrsAgo(3),
    description: "<p>Bundle of <strong>12 toddler toys</strong> — mix of ELC and Fisher-Price including shape sorters, stacking rings, activity cube, bath toys, and soft books. Age 1–3. All safety checked and thoroughly cleaned. Smoke-free, pet-free home.</p>",
    keyDetails: [
      { key: "Quantity",   value: "12 items"                     },
      { key: "Brands",     value: "ELC, Fisher-Price"            },
      { key: "Age",        value: "1–3 years"                    },
      { key: "Condition",  value: "Good — cleaned"               },
    ],
    goodToKnow: [
      { key: "Smoke Free", value: "Yes"                         },
      { key: "Pet Free",   value: "Yes"                         },
      { key: "Collection", value: "Wimbledon, SW19"             },
      { key: "Bundle",     value: "Sold together only"          },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.babyShop,
  },
  {
    id: "baby-toys-02", href: "/listings/baby-toys-02", advId: "15002",
    images: [{ src: img(9), alt: "LEGO Technic Bugatti Chiron" }],
    priceLabel: "£85",
    title: "LEGO Technic Bugatti Chiron 42083 — Complete, Rare Retired Set",
    detailsLabel: "TOYS & GAMES • GOOD • LEGO",
    locationLabel: "Islington, London",
    postedAt: daysAgo(1),
    description: "<p>Complete <strong>LEGO Technic Bugatti Chiron (42083)</strong> — all 3,599 pieces, original instruction booklets, and box. Retired set now fetching premium prices. Assembled once, carefully stored.</p>",
    keyDetails: [
      { key: "Set",       value: "LEGO Technic 42083"   },
      { key: "Pieces",    value: "3,599 — complete"     },
      { key: "Condition", value: "Good — once assembled" },
      { key: "Age",       value: "18+"                  },
    ],
    goodToKnow: [
      { key: "Box",        value: "Original box included"  },
      { key: "Retired",    value: "Discontinued set"       },
      { key: "Collection", value: "Islington, N1"          },
      { key: "Offers",     value: "No offers — firm price" },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.quickSell,
  },
  {
    id: "baby-toys-03", href: "/listings/baby-toys-03", advId: "15003",
    images: [{ src: img(1), alt: "Schleich animals" }],
    priceLabel: "£20",
    title: "Schleich Animal Figure Bundle — 18 Figures, Farm & Wild, Age 3+",
    detailsLabel: "TOYS & GAMES • GOOD • SCHLEICH",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(1),
    description: "<p>Bundle of <strong>18 Schleich animal figures</strong> — mix of farm animals (cows, horses, pigs, sheep) and wild animals (lion, elephant, giraffe, zebra). All in good condition, thoroughly cleaned. Age 3+. Smoke-free, pet-free home.</p>",
    keyDetails: [
      { key: "Brand",     value: "Schleich"               },
      { key: "Quantity",  value: "18 figures"             },
      { key: "Types",     value: "Farm + wild animals"    },
      { key: "Age",       value: "3+"                    },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Good, cleaned"         },
      { key: "Smoke Free", value: "Yes"                   },
      { key: "Pet Free",   value: "Yes"                   },
      { key: "Collection", value: "Chiswick, W4"          },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.alice,
  },
];


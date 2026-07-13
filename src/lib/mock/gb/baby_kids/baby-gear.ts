import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── baby_gear ──────────────────────────────────────────────────────────────────
export const BABY_GEAR: MockListing[] = [
  {
    id: "baby-gear-01", href: "/listings/baby-gear-01", advId: "15011",
    images: [{ src: img(2), alt: "Moses basket" }],
    priceLabel: "£45",
    title: "Moses Basket + Stand + Mattress — John Lewis, Excellent Cond.",
    detailsLabel: "BABY GEAR • EXCELLENT • MOSES BASKET",
    locationLabel: "Putney, London",
    postedAt: hrsAgo(5),
    description: "<p><strong>John Lewis Moses basket</strong> in natural with white lining, rocking stand, and a brand-new foam mattress. Used for 3 months with one child. Thoroughly cleaned, no stains. Stand adjusts for height.</p>",
    keyDetails: [
      { key: "Item",      value: "Moses basket + stand"   },
      { key: "Brand",     value: "John Lewis"             },
      { key: "Mattress",  value: "New foam mattress"      },
      { key: "Condition", value: "Excellent — 3 mo. use"  },
    ],
    goodToKnow: [
      { key: "Mattress",   value: "Brand new — safety first" },
      { key: "Smoke Free", value: "Yes"                       },
      { key: "Pet Free",   value: "Yes"                       },
      { key: "Collection", value: "Putney, SW15"              },
    ],
    coordinates: { lat: 51.4618, lng: -0.2156 },
    seller: SELLERS.babyShop,
  },
  {
    id: "baby-gear-02", href: "/listings/baby-gear-02", advId: "15012",
    images: [{ src: img(3), alt: "Baby monitor" }],
    priceLabel: "£65",
    title: "Motorola MBP36XL Video Baby Monitor — 4.3\" Screen, Like New",
    detailsLabel: "BABY GEAR • LIKE NEW • MONITOR",
    locationLabel: "Chiswick, London",
    postedAt: daysAgo(1),
    description: "<p>Near-new <strong>Motorola MBP36XL video baby monitor</strong> with 4.3-inch colour screen. Night vision, room temperature display, two-way audio, and 300m range. Used for 4 months — baby now in own room with door monitor.</p>",
    keyDetails: [
      { key: "Brand",     value: "Motorola MBP36XL"       },
      { key: "Screen",    value: "4.3\" colour display"   },
      { key: "Features",  value: "Night vision, 2-way audio" },
      { key: "Condition", value: "Like new — 4 months use" },
    ],
    goodToKnow: [
      { key: "Range",      value: "300m"                  },
      { key: "Box",        value: "Original box + docs"   },
      { key: "Collection", value: "Chiswick, W4"          },
      { key: "Postage",    value: "£5 tracked"            },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.babyShop,
  },
  {
    id: "baby-gear-03", href: "/listings/baby-gear-03", advId: "15013",
    images: [{ src: img(4), alt: "Bugaboo Fox 3 pram" }],
    priceLabel: "£380",
    title: "Bugaboo Fox 3 Pram — Full Travel System, Forest Green",
    detailsLabel: "BABY GEAR • EXCELLENT • PRAM",
    locationLabel: "Wimbledon, London",
    postedAt: hrsAgo(3),
    description: "<p>Excellent condition <strong>Bugaboo Fox 3 full travel system</strong> in Forest Green. Includes carrycot, seat, maxi-cosi car seat adapters, rain cover, footmuff, and cup holder. 18 months old — baby now walking.</p>",
    keyDetails: [
      { key: "Item",      value: "Bugaboo Fox 3"        },
      { key: "Includes",  value: "Full travel system"   },
      { key: "Colour",    value: "Forest Green"         },
      { key: "Condition", value: "Excellent"            },
    ],
    goodToKnow: [
      { key: "Age",        value: "18 months"            },
      { key: "Extras",     value: "Footmuff, rain cover" },
      { key: "Smoke Free", value: "Yes"                  },
      { key: "Collection", value: "Wimbledon, SW19"      },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.babyShop,
  },
];


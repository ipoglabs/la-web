import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── womens_clothing ────────────────────────────────────────────────────────────
export const FASHION_WOMENS: MockListing[] = [
  {
    id: "fash-wmns-01", href: "/listings/fash-wmns-01", advId: "19011",
    images: [{ src: img(3), alt: "Zara dresses" }],
    priceLabel: "£60",
    title: "Summer Dress Bundle × 6 — Zara / & Other Stories, Size 10",
    detailsLabel: "WOMENS CLOTHING • EXCELLENT • SUMMER DRESSES",
    locationLabel: "Clapham, London",
    postedAt: hrsAgo(3),
    description: "<p>Bundle of <strong>6 summer dresses</strong> (size 10) — mix of Zara, & Other Stories, and H&M Conscious. Linen, cotton, and broderie anglaise styles. All washed and in excellent condition. Wardrobe refresh.</p>",
    keyDetails: [
      { key: "Quantity",  value: "6 dresses"                },
      { key: "Brands",    value: "Zara, & Other Stories, H&M" },
      { key: "Size",      value: "UK 10"                    },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Fabrics",   value: "Linen, cotton, broderie"  },
      { key: "Bundle",    value: "All 6 — or split (£12ea)" },
      { key: "Collection", value: "Clapham SW4"             },
      { key: "Postage",   value: "Available £4"             },
    ],
    coordinates: { lat: 51.4624, lng: -0.1380 },
    seller: SELLERS.fashionPrivate,
  },
  {
    id: "fash-wmns-02", href: "/listings/fash-wmns-02", advId: "19012",
    images: [{ src: img(4), alt: "Prada trench coat" }],
    priceLabel: "£480",
    title: "Prada Re-Nylon Trench Coat — Camel, Size 40 (UK 12), Near New",
    detailsLabel: "WOMENS CLOTHING • NEAR NEW • DESIGNER",
    locationLabel: "Chelsea, London",
    postedAt: hrsAgo(6),
    description: "<p>Barely worn <strong>Prada Re-Nylon trench coat</strong> in camel. Italian size 40 (UK 12). Purchased from Selfridges — receipt available. Worn once to an event. Stored in dust bag. All buttons and belt in perfect condition.</p>",
    keyDetails: [
      { key: "Brand",     value: "Prada Re-Nylon"           },
      { key: "Style",     value: "Trench coat"              },
      { key: "Size",      value: "IT 40 / UK 12"            },
      { key: "Condition", value: "Near new — worn once"     },
    ],
    goodToKnow: [
      { key: "Receipt",    value: "Selfridges receipt avail." },
      { key: "Dust Bag",   value: "Included"                 },
      { key: "Collection", value: "Chelsea SW3"              },
      { key: "Auth.",      value: "Entrupy cert. available"  },
    ],
    coordinates: { lat: 51.4876, lng: -0.1749 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-wmns-03", href: "/listings/fash-wmns-03", advId: "19013",
    images: [{ src: img(5), alt: "Monsoon bundle" }],
    priceLabel: "£40",
    title: "Women's Smart-Casual Bundle ×8 — Monsoon + White Stuff, Size 12",
    detailsLabel: "WOMENS CLOTHING • EXCELLENT • BUNDLE",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(2),
    description: "<p>Bundle of 8 women's pieces (size 12) — 3 Monsoon tops, 2 White Stuff blouses, 2 midi skirts, and 1 cardigan. Mix of occasion and everyday smart-casual wear. All washed, ironed, and in excellent condition.</p>",
    keyDetails: [
      { key: "Quantity",  value: "8 pieces"                 },
      { key: "Brands",    value: "Monsoon, White Stuff"     },
      { key: "Size",      value: "UK 12"                    },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Items",      value: "Tops, blouses, skirts"  },
      { key: "Washed",     value: "Yes — ready to wear"    },
      { key: "Collection", value: "Richmond TW10"          },
      { key: "Postage",    value: "Available (£5)"          },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.alice,
  },
];


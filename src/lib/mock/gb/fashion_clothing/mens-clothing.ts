import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── mens_clothing ──────────────────────────────────────────────────────────────
export const FASHION_MENS: MockListing[] = [
  {
    id: "fash-mens-01", href: "/listings/fash-mens-01", advId: "19001",
    images: [{ src: img(1), alt: "Ted Baker shirt bundle" }],
    priceLabel: "£75",
    title: "Ted Baker Men's Shirts Bundle × 5 — Size M, Excellent Condition",
    detailsLabel: "MENS CLOTHING • EXCELLENT • SHIRTS",
    locationLabel: "Notting Hill, London",
    postedAt: hrsAgo(2),
    description: "<p>Bundle of <strong>5 Ted Baker men's formal shirts</strong> in size Medium. Mix of prints, checks, and solids — all dry-cleaned and in excellent condition. Selling as a bundle — no splitting. RRP ~£300 total.</p>",
    keyDetails: [
      { key: "Brand",     value: "Ted Baker"                },
      { key: "Quantity",  value: "5 shirts"                 },
      { key: "Size",      value: "Medium (15.5\" collar)"   },
      { key: "Condition", value: "Excellent — dry-cleaned"  },
    ],
    goodToKnow: [
      { key: "RRP",       value: "~£300 total"              },
      { key: "Bundle",    value: "All 5 — not split"        },
      { key: "Collection", value: "Notting Hill W11"        },
      { key: "Postage",   value: "Available £5"             },
    ],
    coordinates: { lat: 51.5134, lng: -0.2063 },
    seller: SELLERS.fashionPrivate,
  },
  {
    id: "fash-mens-02", href: "/listings/fash-mens-02", advId: "19002",
    images: [{ src: img(2), alt: "Canada Goose jacket" }],
    priceLabel: "£550",
    title: "Canada Goose Expedition Parka — Men's L, Black, Excellent",
    detailsLabel: "MENS CLOTHING • EXCELLENT • CANADA GOOSE",
    locationLabel: "Kensington, London",
    postedAt: hrsAgo(5),
    description: "<p>Authentic <strong>Canada Goose Expedition Parka</strong> in black, men's Large. Arctic-grade goose down, coyote fur trim. Excellent condition — no damage or repairs. Receipt and original tags stored. Worn 2 winters.</p>",
    keyDetails: [
      { key: "Brand",     value: "Canada Goose"             },
      { key: "Style",     value: "Expedition Parka"         },
      { key: "Size",      value: "Men's Large"              },
      { key: "Condition", value: "Excellent — 2 seasons"    },
    ],
    goodToKnow: [
      { key: "Authenticity", value: "Receipt available"     },
      { key: "Fur",          value: "Coyote fur trim"       },
      { key: "Collection",   value: "Kensington W8"         },
      { key: "Offers",       value: "Sensible offers only"  },
    ],
    coordinates: { lat: 51.5006, lng: -0.1932 },
    seller: SELLERS.fashionPrivate,
  },
  {
    id: "fash-mens-03", href: "/listings/fash-mens-03", advId: "19003",
    images: [{ src: img(3), alt: "Arc'teryx Atom" }],
    priceLabel: "£55",
    title: "Arc'teryx Atom LT Hoody — Pillar Blue, Men's M, Like New",
    detailsLabel: "MENS CLOTHING • LIKE NEW • ARC'TERYX",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(2),
    description: "<p>Nearly new <strong>Arc'teryx Atom LT mid-layer hoody</strong> in Pillar Blue, men's Medium. Coreloft Compact 60 insulation — ideal shoulder-season layer under a shell. Worn 3 times. No pulls, all zips perfect. Wrong size after weight loss.</p>",
    keyDetails: [
      { key: "Brand",      value: "Arc'teryx Atom LT"       },
      { key: "Colour",     value: "Pillar Blue"             },
      { key: "Size",       value: "Men's Medium"            },
      { key: "Condition",  value: "Like new — 3 wears"     },
    ],
    goodToKnow: [
      { key: "Insulation",  value: "Coreloft Compact 60"   },
      { key: "Reason",      value: "Wrong size"            },
      { key: "Collection",  value: "Wimbledon SW19"        },
      { key: "Postage",     value: "Available (£5)"         },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.dave,
  },
];


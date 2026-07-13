import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── bags_accessories ───────────────────────────────────────────────────────────
export const FASHION_BAGS: MockListing[] = [
  {
    id: "fash-bag-01", href: "/listings/fash-bag-01", advId: "19041",
    images: [{ src: img(8), alt: "Louis Vuitton bag" }],
    priceLabel: "£680",
    title: "Louis Vuitton Speedy 30 — Monogram Canvas, Excellent, Date Code",
    detailsLabel: "BAGS & ACCESSORIES • EXCELLENT • LOUIS VUITTON",
    locationLabel: "Knightsbridge, London",
    postedAt: hrsAgo(4),
    description: "<p>Authentic <strong>Louis Vuitton Speedy 30</strong> in classic Monogram Canvas. Excellent condition — honey patina, clean canvas, brass hardware with no wear. Comes with padlock, keys, and dust bag. Date code present: FL2024.</p>",
    keyDetails: [
      { key: "Brand",     value: "Louis Vuitton Speedy 30"  },
      { key: "Canvas",    value: "Classic Monogram"         },
      { key: "Date Code", value: "FL2024"                   },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Patina",      value: "Honey — natural ageing" },
      { key: "Dust Bag",    value: "Included"               },
      { key: "Lock & Keys", value: "Original set"           },
      { key: "Auth.",       value: "Open to Entrupy check"  },
    ],
    coordinates: { lat: 51.5023, lng: -0.1607 },
    seller: SELLERS.fashionBtq,
  },
  {
    id: "fash-bag-02", href: "/listings/fash-bag-02", advId: "19042",
    images: [{ src: img(9), alt: "Mulberry Bayswater" }],
    priceLabel: "£295",
    title: "Mulberry Bayswater Tote — Oak Natural Grain, Postman's Lock, Excellent",
    detailsLabel: "BAGS & ACCESSORIES • EXCELLENT • MULBERRY",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(5),
    description: "<p>Classic <strong>Mulberry Bayswater tote</strong> in oak natural grain leather. Postman's lock hardware gleams, canvas lining pristine. An iconic British investment piece. Includes original dust bag.</p>",
    keyDetails: [
      { key: "Brand",     value: "Mulberry Bayswater"       },
      { key: "Colour",    value: "Oak / natural grain"      },
      { key: "Hardware",  value: "Postman's lock"           },
      { key: "Condition", value: "Excellent"                },
    ],
    goodToKnow: [
      { key: "Dust Bag",   value: "Included"               },
      { key: "Auth.",      value: "Open to Entrupy check"  },
      { key: "Collection", value: "Islington N1"           },
      { key: "Postage",    value: "Available — insured"    },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.fashionPrivate,
  },
  {
    id: "fash-bag-03", href: "/listings/fash-bag-03", advId: "19043",
    images: [{ src: img(1), alt: "Eastpak backpack" }],
    priceLabel: "£45",
    title: "Eastpak Padded Pak'r 24L Backpack — Black, Like New, Lifetime Warranty",
    detailsLabel: "BAGS & ACCESSORIES • LIKE NEW • BACKPACK",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Like-new <strong>Eastpak Padded Pak'r 24L backpack</strong> in black. Used 3 times. Padded laptop sleeve (up to 15 inch), ergonomic straps, and key clip. Upgrading to a work bag. Eastpak lifetime guarantee transfers to new owner.</p>",
    keyDetails: [
      { key: "Brand",     value: "Eastpak Padded Pak'r"    },
      { key: "Capacity",  value: "24 litres"              },
      { key: "Laptop",    value: "Fits up to 15\""         },
      { key: "Condition", value: "Like new — 3 uses"      },
    ],
    goodToKnow: [
      { key: "Warranty",   value: "Lifetime guarantee"    },
      { key: "Weight",     value: "0.5 kg"                },
      { key: "Collection", value: "Hackney E8"            },
      { key: "Postage",    value: "Available (£4)"         },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.alice,
  },
];


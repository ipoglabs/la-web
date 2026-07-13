import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── sportswear ─────────────────────────────────────────────────────────────────
export const SPORTS_WEAR: MockListing[] = [
  {
    id: "sport-wear-01", href: "/listings/sport-wear-01", advId: "16041",
    images: [{ src: img(7), alt: "Lululemon bundle" }],
    priceLabel: "£120",
    title: "Lululemon Women's Bundle — 4 Leggings + 3 Sports Bras, Size 8",
    detailsLabel: "SPORTSWEAR • EXCELLENT • LULULEMON",
    locationLabel: "Chelsea, London",
    postedAt: hrsAgo(3),
    description: "<p>Bundle of <strong>4 Lululemon Align leggings (size 8) and 3 sports bras (size XS/S)</strong>. All in excellent condition — washed correctly, no pilling. Mix of colours. Selling as a moving-abroad clearance.</p>",
    keyDetails: [
      { key: "Brand",     value: "Lululemon"                 },
      { key: "Items",     value: "4 leggings + 3 sports bras" },
      { key: "Size",      value: "Leggings 8, Bras XS/S"     },
      { key: "Condition", value: "Excellent"                  },
    ],
    goodToKnow: [
      { key: "Reason",     value: "Moving abroad clearance"  },
      { key: "Collection", value: "Chelsea, SW3"             },
      { key: "Postage",    value: "Available £4"             },
      { key: "Bundle",     value: "Sold together only"       },
    ],
    coordinates: { lat: 51.4876, lng: -0.1749 },
    seller: SELLERS.fashionPrivate,
  },
  {
    id: "sport-wear-02", href: "/listings/sport-wear-02", advId: "16042",
    images: [{ src: img(8), alt: "Nike running bundle" }],
    priceLabel: "£65",
    title: "Nike Dri-FIT Running Bundle — 6 Pieces, Men's M, Like New",
    detailsLabel: "SPORTSWEAR • LIKE NEW • NIKE RUNNING",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(4),
    description: "<p>6-piece <strong>Nike Dri-FIT running bundle</strong> in men's Medium — 2 shorts, 2 long-sleeve tops, 1 lightweight windrunner jacket, and 1 running tights. All like new, worn max 2 times. Switched to cycling.</p>",
    keyDetails: [
      { key: "Brand",     value: "Nike Dri-FIT"             },
      { key: "Items",     value: "6 pieces"                 },
      { key: "Size",      value: "Men's Medium"             },
      { key: "Condition", value: "Like new"                 },
    ],
    goodToKnow: [
      { key: "Reason",     value: "Switched to cycling"    },
      { key: "Washed",     value: "Yes, fresh"             },
      { key: "Collection", value: "Hackney E8"             },
      { key: "Bundle",     value: "All 6 together only"    },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.dave,
  },
  {
    id: "sport-wear-03", href: "/listings/sport-wear-03", advId: "16043",
    images: [{ src: img(9), alt: "Gym wear clearance" }],
    priceLabel: "From £15",
    title: "Gym Wear Clearance — New Tagged Stock, Leggings, Bras, Hoodies, XS–2XL",
    detailsLabel: "SPORTSWEAR • NEW • GYM WEAR",
    locationLabel: "Walthamstow, London",
    postedAt: daysAgo(1),
    description: "<p>End-of-season <strong>gym wear clearance</strong> — new tagged stock. High-waist leggings, sports bras, running hoodies, and shorts. Sizes XS–2XL. Mix of brands. Minimum order 3 items. Local collection or delivery available.</p>",
    keyDetails: [
      { key: "Condition",  value: "New — all tagged"        },
      { key: "Sizes",      value: "XS to 2XL"              },
      { key: "Items",      value: "Leggings, bras, hoodies" },
      { key: "Min. Order", value: "3 items"                },
    ],
    goodToKnow: [
      { key: "Delivery",  value: "UK-wide free over £35"   },
      { key: "Returns",   value: "28 days"                 },
      { key: "Payment",   value: "Card only"               },
      { key: "Stock",     value: "Limited sizes"           },
    ],
    coordinates: { lat: 51.5860, lng: -0.0207 },
    seller: SELLERS.sportStore,
  },
];


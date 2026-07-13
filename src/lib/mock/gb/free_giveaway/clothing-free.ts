import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── clothing_free ─────────────────────────────────────────────────────────────
export const FREE_CLOTHING: MockListing[] = [
  {
    id: "free-cloth-01", href: "/listings/free-cloth-01", advId: "23011",
    images: [{ src: img(7), alt: "Men's clothing bundle" }],
    priceLabel: "Free",
    title: "Men's Clothing Bundle 20+ Items — Size M/L, Smart & Casual, FREE Brixton",
    detailsLabel: "FREE • CLOTHING • MENS BUNDLE",
    locationLabel: "Brixton, London",
    postedAt: hrsAgo(2),
    description: "<p>Free bundle of <strong>20+ men's clothing items</strong> — shirts, jeans, t-shirts, and jumpers in sizes M and L. All washed and clean. Includes ASOS, H&M, and M&S pieces. Decluttering after losing weight. Collection Brixton SW9.</p>",
    keyDetails: [
      { key: "Qty",       value: "20+ items"                 },
      { key: "Size",      value: "M / L mixed"               },
      { key: "Types",     value: "Shirts, jeans, tees, jumpers" },
      { key: "Condition", value: "Good — all washed"         },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Brands",     value: "ASOS, H&M, M&S"          },
      { key: "Reason",     value: "Weight loss"              },
      { key: "Collection", value: "Brixton SW9"              },
    ],
    coordinates: { lat: 51.4612, lng: -0.1149 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-cloth-02", href: "/listings/free-cloth-02", advId: "23012",
    images: [{ src: img(8), alt: "Kids clothing bundle" }],
    priceLabel: "Free",
    title: "Kids Clothing Bundle Age 2–4 — 30+ Pieces All Seasons, FREE Wimbledon",
    detailsLabel: "FREE • CLOTHING • KIDS AGE 2–4",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(1),
    description: "<p>Free bundle of <strong>30+ children's clothing items ages 2–4</strong> — all seasons covered: coats, dungarees, dresses, and sleepsuits. Mix of M&S, Next, and Mothercare. All washed and ready. Message to arrange collection.</p>",
    keyDetails: [
      { key: "Qty",       value: "30+ items"                 },
      { key: "Age",       value: "2–4 years"                 },
      { key: "Includes",  value: "Coats, dresses, sleepsuits" },
      { key: "Condition", value: "Good — all washed"         },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Brands",     value: "M&S, Next, Mothercare"    },
      { key: "Message",    value: "Contact to arrange"       },
      { key: "Collection", value: "Wimbledon SW19"           },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-cloth-03", href: "/listings/free-cloth-03", advId: "23013",
    images: [{ src: img(9), alt: "Women's office workwear" }],
    priceLabel: "Free",
    title: "Women's Office Workwear Bundle 15 Pieces — Size 14, FREE Canary Wharf",
    detailsLabel: "FREE • CLOTHING • WOMENS WORKWEAR",
    locationLabel: "Canary Wharf, London",
    postedAt: hrsAgo(4),
    description: "<p>Free bundle of <strong>15 women's office workwear pieces size 14</strong> — blazers, blouses, smart trousers, and pencil skirts. M&S, Hobbs, and Banana Republic pieces. Moved to a full-time WFH role — won't wear again. Dry-cleaned.</p>",
    keyDetails: [
      { key: "Qty",       value: "15 pieces"                 },
      { key: "Size",      value: "UK 14"                     },
      { key: "Types",     value: "Blazers, blouses, trousers, skirts" },
      { key: "Condition", value: "Excellent — dry-cleaned"   },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Brands",     value: "M&S, Hobbs, Banana Republic" },
      { key: "Reason",     value: "WFH — no longer needed"   },
      { key: "Collection", value: "Canary Wharf E14"         },
    ],
    coordinates: { lat: 51.5055, lng: -0.0235 },
    seller: SELLERS.giveawayPrivate,
  },
];

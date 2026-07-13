import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── food_free ─────────────────────────────────────────────────────────────────
export const FREE_FOOD: MockListing[] = [
  {
    id: "free-food-01", href: "/listings/free-food-01", advId: "23031",
    images: [{ src: img(4), alt: "OLIO community food share box" }],
    priceLabel: "Free",
    title: "OLIO Community Food Share — 8 Tins + Bread + Veg, Hackney Today",
    detailsLabel: "FREE • FOOD SHARE • COMMUNITY • OLIO",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(1),
    description: "<p>Community food share via <strong>OLIO</strong> — 8 tinned goods (chickpeas, tomatoes, tuna, baked beans, lentils, sweetcorn), 1 loaf of bread, and mixed veg (carrots, courgettes, peppers). All in date. First message, first served. Collection today only.</p>",
    keyDetails: [
      { key: "Items",     value: "8 tins + bread + veg"      },
      { key: "Use-by",    value: "All in date"               },
      { key: "Method",    value: "First message, first served" },
      { key: "Urgency",   value: "Today only"                },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE — no conditions"     },
      { key: "Via",        value: "OLIO community share"     },
      { key: "Collection", value: "Hackney E8 — today only"  },
      { key: "Contact",    value: "Message immediately"      },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.communityMgr,
  },
  {
    id: "free-food-02", href: "/listings/free-food-02", advId: "23032",
    images: [{ src: img(5), alt: "Homegrown courgettes and tomatoes" }],
    priceLabel: "Free",
    title: "Homegrown Courgettes + Cherry Tomatoes — Help Yourself, Front Gate Chiswick",
    detailsLabel: "FREE • FOOD • HOMEGROWN • VEG",
    locationLabel: "Chiswick, London",
    postedAt: hrsAgo(2),
    description: "<p>Help yourself to <strong>homegrown courgettes and cherry tomatoes</strong> — left in a box outside the front garden gate. No knock needed, just take what you want. No pesticides. Far too much surplus this year — please take!</p>",
    keyDetails: [
      { key: "Produce",   value: "Courgettes + cherry tomatoes" },
      { key: "Grown",     value: "Homegrown — no pesticides"   },
      { key: "Access",    value: "Box at front gate"           },
      { key: "Qty",       value: "Unlimited — take freely"     },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "No knock",   value: "Just take from the box"   },
      { key: "Address",    value: "Sent on message"          },
      { key: "Location",   value: "Chiswick W4"              },
    ],
    coordinates: { lat: 51.4927, lng: -0.2613 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-food-03", href: "/listings/free-food-03", advId: "23033",
    images: [{ src: img(6), alt: "Allotment eggs and vegetables" }],
    priceLabel: "Free",
    title: "Allotment Surplus — Free-Range Eggs × 12 + Kale + Rainbow Chard, Wimbledon",
    detailsLabel: "FREE • FOOD • ALLOTMENT • EGGS & VEG",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(1),
    description: "<p>Free <strong>allotment surplus</strong>: a dozen free-range eggs (our own hens, laid this morning), a large bunch of curly kale, and rainbow chard. Collection from outside the plot. Message for plot number. First come, first served — today only.</p>",
    keyDetails: [
      { key: "Items",     value: "12 eggs + kale + chard"    },
      { key: "Eggs",      value: "Free-range (own hens)"     },
      { key: "Freshness", value: "Laid this morning"         },
      { key: "Urgency",   value: "Today only"                },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Location",   value: "Wimbledon Allotments"     },
      { key: "Plot No.",   value: "Sent on message"          },
      { key: "Collection", value: "Today only"               },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.giveawayPrivate,
  },
];

import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── garden_outdoor ──────────────────────────────────────────────────────────────
export const HOME_GARDEN: MockListing[] = [
  {
    id: "home-garden-01", href: "/listings/home-garden-01", advId: "18061",
    images: [{ src: img(8), alt: "Charcoal BBQ" }],
    priceLabel: "£85",
    title: "Weber Original Kettle 57cm BBQ — Charcoal, Excellent, Barely Used",
    detailsLabel: "GARDEN & OUTDOOR • EXCELLENT • BBQ",
    locationLabel: "Richmond, London",
    postedAt: hrsAgo(2),
    description: "<p>Classic <strong>Weber Original Kettle 57cm BBQ</strong> in black. Purchased spring 2025, used on 3 occasions. Excellent condition — cleaned and stored in garage each time. Charcoal grate, ash catcher, and grill included.</p>",
    keyDetails: [
      { key: "Brand",     value: "Weber Original Kettle"   },
      { key: "Size",      value: "57cm diameter"           },
      { key: "Fuel",      value: "Charcoal"                },
      { key: "Condition", value: "Excellent — 3 uses"      },
    ],
    goodToKnow: [
      { key: "Age",        value: "Spring 2025"             },
      { key: "Cover",      value: "Not included"            },
      { key: "Collection", value: "Richmond TW9"            },
      { key: "Delivery",   value: "Not available"           },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-garden-02", href: "/listings/home-garden-02", advId: "18062",
    images: [{ src: img(9), alt: "Rattan garden furniture set" }],
    priceLabel: "£350",
    title: "Rattan Garden Furniture Set — 4-Seat, Cushions, Good Cond.",
    detailsLabel: "GARDEN & OUTDOOR • GOOD • FURNITURE SET",
    locationLabel: "Twickenham, London",
    postedAt: daysAgo(2),
    description: "<p>Sturdy <strong>4-seat rattan garden furniture set</strong> in dark brown with cream cushions. Table (120cm dia.) and four armchairs. Stored under cover each winter. Some fading to cushions — otherwise solid. Must collect.</p>",
    keyDetails: [
      { key: "Item",      value: "4-seat rattan set"     },
      { key: "Includes",  value: "Table + 4 armchairs"   },
      { key: "Cushions",  value: "Cream — some fading"   },
      { key: "Condition", value: "Good (outdoor use)"    },
    ],
    goodToKnow: [
      { key: "Table",      value: "120cm diameter"           },
      { key: "Cover",      value: "Stored covered"           },
      { key: "Collection", value: "Twickenham — essential"   },
      { key: "Delivery",   value: "Not available"            },
    ],
    coordinates: { lat: 51.4488, lng: -0.3365 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-garden-03", href: "/listings/home-garden-03", advId: "18063",
    images: [{ src: img(1), alt: "Bosch cordless garden bundle" }],
    priceLabel: "£220",
    title: "Bosch Cordless Garden Bundle — Lawnmower + Strimmer + Blower, 2×36V",
    detailsLabel: "GARDEN & OUTDOOR • GOOD • GARDEN TOOLS",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(2),
    description: "<p>Complete <strong>Bosch Power4All cordless garden bundle</strong> — 36V AdvancedRotak lawnmower (36cm deck), EasyGrassCut strimmer, and EasyBlower leaf blower. 2×4Ah batteries + charger. 2 years old, good condition.</p>",
    keyDetails: [
      { key: "System",    value: "Bosch Power4All 36V"      },
      { key: "Items",     value: "Mower + strimmer + blower" },
      { key: "Batteries", value: "2×4Ah included"           },
      { key: "Deck",      value: "36cm cutting width"       },
    ],
    goodToKnow: [
      { key: "Age",        value: "2 years"                 },
      { key: "Condition",  value: "Good working order"      },
      { key: "Collection", value: "Wimbledon SW19"          },
      { key: "Delivery",   value: "Not available"           },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.homePrivate,
  },
];


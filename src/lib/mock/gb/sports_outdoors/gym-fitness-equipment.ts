import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── gym_fitness_equipment ──────────────────────────────────────────────────────
export const SPORTS_GYM_EQUIPMENT: MockListing[] = [
  {
    id: "sport-gym-01", href: "/listings/sport-gym-01", advId: "16001",
    images: [{ src: img(1), alt: "Power rack" }],
    priceLabel: "£750",
    title: "Commercial Power Rack + Olympic Barbell + 150kg Plates — Home Gym",
    detailsLabel: "GYM EQUIPMENT • COMMERCIAL • HOME GYM",
    locationLabel: "Croydon, London",
    postedAt: hrsAgo(2),
    description: "<p>Full <strong>home gym power rack setup</strong>: Mirafit M3 commercial-grade cage, 7ft Olympic barbell, 150kg bumper plate set (pairs from 5kg to 25kg), and J-cups. Used for 2 years — solid condition. Must collect with a van.</p>",
    keyDetails: [
      { key: "Items",      value: "Rack + bar + 150kg plates" },
      { key: "Brand",      value: "Mirafit M3"                },
      { key: "Bar",        value: "7ft Olympic barbell"       },
      { key: "Condition",  value: "Good — 2 years use"        },
    ],
    goodToKnow: [
      { key: "Collection", value: "Large van required"        },
      { key: "Dismantle",  value: "Help available"            },
      { key: "Delivery",   value: "Not available"             },
      { key: "Reason",     value: "Relocating"                },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.sportStore,
  },
  {
    id: "sport-gym-02", href: "/listings/sport-gym-02", advId: "16002",
    images: [{ src: img(2), alt: "Rowing machine" }],
    priceLabel: "£550",
    title: "Concept2 Model D Rowing Machine — PM5 Monitor, Excellent Cond.",
    detailsLabel: "GYM EQUIPMENT • CONCEPT2 • ROWER",
    locationLabel: "Hammersmith, London",
    postedAt: hrsAgo(5),
    description: "<p>The industry-standard <strong>Concept2 Model D ergometer</strong> with PM5 performance monitor. Used in home gym — well maintained and fully functional. All original parts and tools. Separates into two pieces for storage.</p>",
    keyDetails: [
      { key: "Brand",     value: "Concept2 Model D"          },
      { key: "Monitor",   value: "PM5 (latest)"              },
      { key: "Condition", value: "Excellent — home use only" },
      { key: "Separates", value: "Yes — for storage"        },
    ],
    goodToKnow: [
      { key: "Collection", value: "Hammersmith W6"           },
      { key: "Help",       value: "Help loading available"   },
      { key: "Delivery",   value: "Man & van can arrange"    },
      { key: "Reason",     value: "Upgrading to SkiErg"      },
    ],
    coordinates: { lat: 51.4921, lng: -0.2233 },
    seller: SELLERS.sportStore,
  },
  {
    id: "sport-gym-03", href: "/listings/sport-gym-03", advId: "16003",
    images: [{ src: img(3), alt: "Peloton Bike+" }],
    priceLabel: "£950",
    title: "Peloton Bike+ — Includes 12 Month Subscription, Mint Condition",
    detailsLabel: "GYM EQUIPMENT • LIKE NEW • EXERCISE BIKE",
    locationLabel: "Putney, London",
    postedAt: hrsAgo(6),
    description: "<p>Barely used <strong>Peloton Bike+</strong> with 12 months subscription remaining. Auto-follow resistance, 24-inch swivel touchscreen, and SPD-compatible pedals. Serious enquiries only — collection or delivery (£80 fee).</p>",
    keyDetails: [
      { key: "Item",         value: "Peloton Bike+"          },
      { key: "Screen",       value: "24\" swivel HD"         },
      { key: "Subscription", value: "12 months remaining"    },
      { key: "Condition",    value: "Like new — minimal use" },
    ],
    goodToKnow: [
      { key: "Delivery",   value: "Available within London (£80)" },
      { key: "Collection", value: "Putney, SW15"                  },
      { key: "Shoes",      value: "Size 9 cycling shoes incl."    },
      { key: "Reason",     value: "Relocating overseas"           },
    ],
    coordinates: { lat: 51.4618, lng: -0.2156 },
    seller: SELLERS.quickSell,
  },
];


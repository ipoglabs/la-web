import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── outdoor_adventure ──────────────────────────────────────────────────────────
export const SPORTS_OUTDOOR: MockListing[] = [
  {
    id: "sport-outdoor-01", href: "/listings/sport-outdoor-01", advId: "16021",
    images: [{ src: img(4), alt: "Camping tent" }],
    priceLabel: "£180",
    title: "Vango Odyssey 600 Tent — 6 Person, Air Inflate, 3-Season",
    detailsLabel: "OUTDOOR ADVENTURE • EXCELLENT • TENT",
    locationLabel: "Twickenham, London",
    postedAt: daysAgo(2),
    description: "<p>Spacious <strong>Vango Odyssey Air 600 inflatable tent</strong> for 6 people. Air-inflate system (no poles), inner bedroom divider, and large living area. Used on 3 trips — excellent condition. Full footprint groundsheet included.</p>",
    keyDetails: [
      { key: "Brand",     value: "Vango Odyssey Air 600"    },
      { key: "Capacity",  value: "6 persons"                },
      { key: "Season",    value: "3-season"                 },
      { key: "Condition", value: "Excellent — 3 trips"      },
    ],
    goodToKnow: [
      { key: "Footprint",  value: "Full footprint included" },
      { key: "Pump",       value: "Electric pump incl."     },
      { key: "Collection", value: "Twickenham TW1"          },
      { key: "Delivery",   value: "Possible (£15)"          },
    ],
    coordinates: { lat: 51.4488, lng: -0.3365 },
    seller: SELLERS.sportStore,
  },
  {
    id: "sport-outdoor-02", href: "/listings/sport-outdoor-02", advId: "16022",
    images: [{ src: img(5), alt: "Mountain bike" }],
    priceLabel: "£650",
    title: "Trek Marlin 7 Mountain Bike — 27.5\", Medium, Hydraulic Disc",
    detailsLabel: "OUTDOOR ADVENTURE • GOOD • MOUNTAIN BIKE",
    locationLabel: "Kingston, London",
    postedAt: hrsAgo(4),
    description: "<p>Solid <strong>Trek Marlin 7 hardtail mountain bike</strong> in medium frame. Shimano 1×12 drivetrain, hydraulic disc brakes, and SR Suntour fork. Used regularly for trail riding — serviced October 2025. New chain, cables, and brake pads.</p>",
    keyDetails: [
      { key: "Brand",     value: "Trek Marlin 7"           },
      { key: "Size",      value: "Medium frame (27.5\")"   },
      { key: "Brakes",    value: "Hydraulic disc"          },
      { key: "Gears",     value: "Shimano 1×12"            },
    ],
    goodToKnow: [
      { key: "Serviced",   value: "October 2025"           },
      { key: "New Parts",  value: "Chain, cables, pads"    },
      { key: "Collection", value: "Kingston, KT1"          },
      { key: "Test Ride",  value: "Welcome with ID"        },
    ],
    coordinates: { lat: 51.4085, lng: -0.3064 },
    seller: SELLERS.sportStore,
  },
  {
    id: "sport-outdoor-03", href: "/listings/sport-outdoor-03", advId: "16023",
    images: [{ src: img(6), alt: "Camping sleeping bag" }],
    priceLabel: "£155",
    title: "Mountain Equipment Helium 400 Down Sleeping Bag — -7°C, 750FP, Like New",
    detailsLabel: "OUTDOOR ADVENTURE • LIKE NEW • SLEEPING BAG",
    locationLabel: "Kingston, London",
    postedAt: hrsAgo(6),
    description: "<p>Barely used <strong>Mountain Equipment Helium 400 down sleeping bag</strong> — comfort rating -7°C, 750+ fill power. Compresses to the size of a cantaloupe for ultralight backpacking. Used on 2 trips. Freshly washed.</p>",
    keyDetails: [
      { key: "Brand",     value: "Mountain Equipment Helium 400" },
      { key: "Comfort",   value: "-7°C / Limit -12°C"       },
      { key: "Fill",      value: "750+ fill power down"      },
      { key: "Condition", value: "Like new — 2 trips"        },
    ],
    goodToKnow: [
      { key: "Weight",    value: "790g"                     },
      { key: "Pack Size", value: "Ultralight / compact"     },
      { key: "Washed",    value: "Freshly cleaned"          },
      { key: "Collection", value: "Kingston KT1"            },
    ],
    coordinates: { lat: 51.4085, lng: -0.3064 },
    seller: SELLERS.dave,
  },
];


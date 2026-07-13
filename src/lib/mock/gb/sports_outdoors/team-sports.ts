import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── team_sports ────────────────────────────────────────────────────────────────
export const SPORTS_TEAM: MockListing[] = [
  {
    id: "sport-team-01", href: "/listings/sport-team-01", advId: "16011",
    images: [{ src: img(3), alt: "Football boots" }],
    priceLabel: "£85",
    title: "Nike Phantom GX Elite FG Football Boots — Size 10, Like New",
    detailsLabel: "TEAM SPORTS • LIKE NEW • FOOTBALL BOOTS",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(1),
    description: "<p>Near-new <strong>Nike Phantom GX Elite FG</strong> in blue/white. Size UK10 / EU44.5. Bought for a trial, played in once on soft grass — no mud. Original box, spare studs, and laces included.</p>",
    keyDetails: [
      { key: "Brand",     value: "Nike Phantom GX Elite"    },
      { key: "Size",      value: "UK 10 / EU 44.5"          },
      { key: "Surface",   value: "Firm Ground (FG)"         },
      { key: "Condition", value: "Like new — worn once"     },
    ],
    goodToKnow: [
      { key: "Box",        value: "Original box"            },
      { key: "Studs",      value: "Spare set included"      },
      { key: "Collection", value: "Lewisham, SE13"          },
      { key: "Postage",    value: "Available £5"            },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.sportStore,
  },
  {
    id: "sport-team-02", href: "/listings/sport-team-02", advId: "16012",
    images: [{ src: img(4), alt: "Cricket bundle" }],
    priceLabel: "£120",
    title: "Cricket Bundle — Gray-Nicolls Bat, Pads, Gloves + Bag, Harrow",
    detailsLabel: "TEAM SPORTS • EXCELLENT • CRICKET",
    locationLabel: "Twickenham, London",
    postedAt: daysAgo(2),
    description: "<p>Complete cricket batting bundle — <strong>Gray-Nicolls Maverick bat (Harrow)</strong>, full batting pads, batting gloves (pair), thigh pad, and Gray-Nicolls wheelie kit bag. Excellent condition — 1 season use, bat oiled.</p>",
    keyDetails: [
      { key: "Bat",     value: "Gray-Nicolls Maverick Harrow" },
      { key: "Pads",    value: "Full batting pads"            },
      { key: "Gloves",  value: "Pair included"               },
      { key: "Bag",     value: "Gray-Nicolls wheelie bag"     },
    ],
    goodToKnow: [
      { key: "Season",     value: "1 season use"            },
      { key: "Bat",        value: "Oiled and ready"         },
      { key: "Collection", value: "Twickenham TW1"          },
      { key: "Delivery",   value: "Not available (bulky)"   },
    ],
    coordinates: { lat: 51.4488, lng: -0.3365 },
    seller: SELLERS.dave,
  },
  {
    id: "sport-team-03", href: "/listings/sport-team-03", advId: "16013",
    images: [{ src: img(5), alt: "Basketball hoop" }],
    priceLabel: "£145",
    title: "Portable Basketball Hoop — Height Adjustable 1.8–3m, Size 7 Ball",
    detailsLabel: "TEAM SPORTS • EXCELLENT • BASKETBALL",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(3),
    description: "<p>Adjustable height <strong>portable basketball system</strong> — 1.8m to 3.05m (official NBA height), 18L water-filled base, size 7 ball included. Used in garden for 2 seasons. Excellent condition, no cracks or damage.</p>",
    keyDetails: [
      { key: "Height",   value: "1.8–3.05m adjustable"    },
      { key: "Base",     value: "18L water-filled"          },
      { key: "Ball",     value: "Size 7 included"           },
      { key: "Condition", value: "Excellent — 2 seasons"   },
    ],
    goodToKnow: [
      { key: "Dismantle",  value: "Partially for transport" },
      { key: "Van",        value: "Large estate or van"     },
      { key: "Collection", value: "Lewisham SE13"           },
      { key: "Delivery",   value: "Not available"           },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.dave,
  },
];


import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── water_sports ───────────────────────────────────────────────────────────────
export const SPORTS_WATER: MockListing[] = [
  {
    id: "sport-water-01", href: "/listings/sport-water-01", advId: "16031",
    images: [{ src: img(6), alt: "SUP board" }],
    priceLabel: "£320",
    title: "Red Paddle Co 10'8\" Inflatable SUP Board — Full Kit, Excellent",
    detailsLabel: "WATER SPORTS • EXCELLENT • SUP BOARD",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(1),
    description: "<p>Top-quality <strong>Red Paddle Co 10'8\" Ride inflatable SUP</strong> with full kit — carbon paddle, pump, leash, fin, and carry bag. Used approx. 10 times on flat water. One of the best all-round beginner/intermediate boards available.</p>",
    keyDetails: [
      { key: "Brand",     value: "Red Paddle Co 10'8\"" },
      { key: "Condition", value: "Excellent — ~10 uses" },
      { key: "Includes",  value: "Full kit (paddle, pump)" },
      { key: "Level",     value: "Beginner / Intermediate" },
    ],
    goodToKnow: [
      { key: "Carry Bag", value: "Included"             },
      { key: "Leash",     value: "Included"             },
      { key: "Collection", value: "Richmond, TW9"       },
      { key: "Delivery",  value: "Available (£20)"      },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.sportStore,
  },
  {
    id: "sport-water-02", href: "/listings/sport-water-02", advId: "16032",
    images: [{ src: img(7), alt: "Wetsuit" }],
    priceLabel: "£85",
    title: "Rip Curl E-Bomb 3/2mm Wetsuit — Men's MS, Chest Zip, Like New",
    detailsLabel: "WATER SPORTS • LIKE NEW • WETSUIT",
    locationLabel: "Kingston, London",
    postedAt: daysAgo(1),
    description: "<p>Barely used <strong>Rip Curl E-Bomb 3/2mm summer wetsuit</strong> in men's medium-short, chest zip with BioLite collar for zero-flush seal. Used 3 times in open water. Excellent condition — no repairs, flush seals intact.</p>",
    keyDetails: [
      { key: "Brand",     value: "Rip Curl E-Bomb"          },
      { key: "Thickness", value: "3/2mm"                   },
      { key: "Size",      value: "Men's MS (medium-short)"  },
      { key: "Closure",   value: "Chest zip"               },
    ],
    goodToKnow: [
      { key: "Uses",       value: "3 open water swims"     },
      { key: "Condition",  value: "No repairs — excellent" },
      { key: "Care",       value: "Always rinsed + hung"   },
      { key: "Collection", value: "Kingston KT1"           },
    ],
    coordinates: { lat: 51.4085, lng: -0.3064 },
    seller: SELLERS.dave,
  },
  {
    id: "sport-water-03", href: "/listings/sport-water-03", advId: "16033",
    images: [{ src: img(8), alt: "Inflatable kayak" }],
    priceLabel: "£220",
    title: "2-Person Inflatable Kayak — Paddles + Pump + Bag, River Tested",
    detailsLabel: "WATER SPORTS • EXCELLENT • KAYAK",
    locationLabel: "Putney, London",
    postedAt: daysAgo(2),
    description: "<p>2-person <strong>inflatable kayak</strong> with high-pressure drop-stitch floor (feels like a hardshell), 2 aluminium paddles, foot pump, and carry rucksack. Tested on the Thames and the Wye. Excellent condition.</p>",
    keyDetails: [
      { key: "Type",     value: "2-person inflatable"       },
      { key: "Paddles",  value: "2× aluminium"             },
      { key: "Floor",    value: "Drop-stitch high pressure" },
      { key: "Tested",   value: "Thames + River Wye"        },
    ],
    goodToKnow: [
      { key: "Carry Bag", value: "Rucksack included"        },
      { key: "Pump",      value: "Foot pump included"       },
      { key: "Condition", value: "Excellent"               },
      { key: "Collection", value: "Putney SW15"            },
    ],
    coordinates: { lat: 51.4618, lng: -0.2156 },
    seller: SELLERS.alice,
  },
];


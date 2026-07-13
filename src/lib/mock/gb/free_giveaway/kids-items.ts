import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── kids_items_free ────────────────────────────────────────────────────────────
export const FREE_KIDS: MockListing[] = [
  {
    id: "free-kids-01", href: "/listings/free-kids-01", advId: "23041",
    images: [{ src: img(7), alt: "Chicco Polly highchair" }],
    priceLabel: "Free",
    title: "Chicco Polly Magic 6-in-1 Highchair — Baby Outgrown, FREE Battersea",
    detailsLabel: "FREE • BABY • HIGHCHAIR • CHICCO",
    locationLabel: "Battersea, London",
    postedAt: hrsAgo(3),
    description: "<p>Free <strong>Chicco Polly Magic 6-in-1 highchair</strong> in anthracite. Adjustable height (7 positions), 3-position reclining seat, removable tray. Fabric cleaned, all joints and mechanisms work. Baby has outgrown it — to a good home. Suitable from 6 months.</p>",
    keyDetails: [
      { key: "Item",      value: "Chicco Polly Magic 6-in-1" },
      { key: "Recline",   value: "3 positions"               },
      { key: "Height",    value: "7 adjustable positions"    },
      { key: "Condition", value: "Good — fabric cleaned"     },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "From",       value: "6 months+"                },
      { key: "Tray",       value: "Removable"                },
      { key: "Collection", value: "Battersea SW11"           },
    ],
    coordinates: { lat: 51.4796, lng: -0.1481 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-kids-02", href: "/listings/free-kids-02", advId: "23042",
    images: [{ src: img(8), alt: "Mountain Buggy pushchair" }],
    priceLabel: "Free",
    title: "Mountain Buggy Urban Jungle Pushchair — Flat Tyres, Otherwise Excellent",
    detailsLabel: "FREE • BABY • PUSHCHAIR • MOUNTAIN BUGGY",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Free <strong>Mountain Buggy Urban Jungle all-terrain pushchair</strong> — both tyres flat (inner tubes ~£8 each on Amazon). Frame solid, fabric clean and washed, fold mechanism works. Raincover included. Easy fix for a confident parent.</p>",
    keyDetails: [
      { key: "Item",      value: "Mountain Buggy Urban Jungle" },
      { key: "Tyres",     value: "Both flat — tubes needed"  },
      { key: "Frame",     value: "Solid"                     },
      { key: "Raincover", value: "Included"                  },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Fix cost",   value: "~£16 for both inner tubes" },
      { key: "Fabric",     value: "Clean + washed"           },
      { key: "Collection", value: "Hackney E8"               },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-kids-03", href: "/listings/free-kids-03", advId: "23043",
    images: [{ src: img(9), alt: "Children's picture books box" }],
    priceLabel: "Free",
    title: "Children's Picture Books 50+ Titles — Age 3–7, FREE Collection Wimbledon",
    detailsLabel: "FREE • BOOKS • CHILDREN'S • PICTURE BOOKS",
    locationLabel: "Wimbledon, London",
    postedAt: hrsAgo(4),
    description: "<p>Over <strong>50 children's picture books ages 3–7</strong> — includes Julia Donaldson (Gruffalo, Zog, Tiddler), Eric Carle, Dr. Seuss, and many more. All clean and very readable. Kids have grown up — ideal for a school, nursery, or young family.</p>",
    keyDetails: [
      { key: "Qty",       value: "50+ picture books"         },
      { key: "Age",       value: "3–7 years"                 },
      { key: "Authors",   value: "Donaldson, Carle, Seuss + more" },
      { key: "Condition", value: "Good — all readable"       },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Ideal for",  value: "School / nursery donation" },
      { key: "Collection", value: "Wimbledon SW19"           },
      { key: "Urgency",    value: "This week"                },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.giveawayPrivate,
  },
];

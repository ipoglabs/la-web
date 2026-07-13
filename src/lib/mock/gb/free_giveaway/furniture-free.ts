import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── furniture_free ────────────────────────────────────────────────────────────
export const FREE_FURNITURE: MockListing[] = [
  {
    id: "free-furn-01", href: "/listings/free-furn-01", advId: "23001",
    images: [{ src: img(4), alt: "IKEA KALLAX shelving unit" }],
    priceLabel: "Free",
    title: "IKEA KALLAX 4×4 Shelving Unit — White, Great Condition, Collection Hackney",
    detailsLabel: "FREE • FURNITURE • IKEA KALLAX",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(1),
    description: "<p>Free to a good home — <strong>IKEA KALLAX 4×4 shelving unit in white</strong>. Great condition, just needs a dust. All shelves intact, brackets present. Needs a large car or small van. Collection Hackney E8 today or tomorrow preferred.</p>",
    keyDetails: [
      { key: "Item",      value: "IKEA KALLAX 4×4"           },
      { key: "Colour",    value: "White"                     },
      { key: "Size",      value: "147×147cm"                 },
      { key: "Condition", value: "Great — needs a dust"      },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Dismantle",  value: "Help available"           },
      { key: "Vehicle",    value: "Large car or small van"   },
      { key: "Collection", value: "Hackney E8"               },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-furn-02", href: "/listings/free-furn-02", advId: "23002",
    images: [{ src: img(5), alt: "3-seater sofa giveaway" }],
    priceLabel: "Free",
    title: "3-Seater Sofa — Solid Frame + Good Springs, Needs Reupholstering, FREE",
    detailsLabel: "FREE • FURNITURE • SOFA",
    locationLabel: "Peckham, London",
    postedAt: hrsAgo(3),
    description: "<p>Free <strong>3-seater sofa</strong> — solid frame and great springs, but fabric is worn and needs reupholstering. Superb project piece for an upholstery student or DIYer. Two people needed to carry. Collection only, today or tomorrow preferred.</p>",
    keyDetails: [
      { key: "Item",      value: "3-seater sofa"             },
      { key: "Frame",     value: "Solid wood — good"         },
      { key: "Fabric",    value: "Worn — reupholstery needed" },
      { key: "Condition", value: "Good bones, project piece" },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE"                     },
      { key: "Help",       value: "2 people needed to carry" },
      { key: "Urgency",    value: "Today/tomorrow preferred" },
      { key: "Collection", value: "Peckham SE15"             },
    ],
    coordinates: { lat: 51.4741, lng: -0.0686 },
    seller: SELLERS.giveawayPrivate,
  },
  {
    id: "free-furn-03", href: "/listings/free-furn-03", advId: "23003",
    images: [{ src: img(6), alt: "Coffee table and bedside tables" }],
    priceLabel: "Free",
    title: "Coffee Table + 2 Bedside Tables — Oak-Effect, FREE Collection Lewisham",
    detailsLabel: "FREE • FURNITURE • BUNDLE",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(1),
    description: "<p>Free furniture bundle — <strong>oak-effect coffee table + 2 matching bedside tables</strong>. Light surface scratches but structurally solid. Moving abroad this week — everything must go. Take one or all three.</p>",
    keyDetails: [
      { key: "Items",     value: "Coffee table + 2 bedsides" },
      { key: "Finish",    value: "Oak-effect laminate"       },
      { key: "Condition", value: "Good — light scratches"    },
      { key: "Urgency",   value: "Moving abroad this week"   },
    ],
    goodToKnow: [
      { key: "Price",      value: "FREE — take any or all"   },
      { key: "Reason",     value: "Moving abroad"            },
      { key: "Urgency",    value: "This week only"           },
      { key: "Collection", value: "Lewisham SE13"            },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.giveawayPrivate,
  },
];

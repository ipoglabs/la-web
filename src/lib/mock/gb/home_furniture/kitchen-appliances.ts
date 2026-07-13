import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── kitchen_appliances ──────────────────────────────────────────────────────────
export const HOME_KITCHEN: MockListing[] = [
  {
    id: "home-kit-01", href: "/listings/home-kit-01", advId: "18031",
    images: [{ src: img(5), alt: "KitchenAid mixer" }],
    priceLabel: "£320",
    title: "KitchenAid Artisan Stand Mixer — 4.8L, Empire Red, Like New",
    detailsLabel: "KITCHEN APPLIANCES • LIKE NEW • STAND MIXER",
    locationLabel: "Fulham, London",
    postedAt: hrsAgo(4),
    description: "<p>Near-new <strong>KitchenAid Artisan 4.8L Stand Mixer</strong> in Empire Red. Used only a few times — gifted and not a baker! All three attachments (flat beater, dough hook, wire whip) and original box.</p>",
    keyDetails: [
      { key: "Brand",     value: "KitchenAid Artisan"       },
      { key: "Capacity",  value: "4.8 litres"               },
      { key: "Colour",    value: "Empire Red"               },
      { key: "Condition", value: "Like new — few uses"      },
    ],
    goodToKnow: [
      { key: "Attachments", value: "All 3 original"         },
      { key: "Box",         value: "Original box"           },
      { key: "Collection",  value: "Fulham SW6"             },
      { key: "Delivery",    value: "Available £15"          },
    ],
    coordinates: { lat: 51.4752, lng: -0.2017 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-kit-02", href: "/listings/home-kit-02", advId: "18032",
    images: [{ src: img(6), alt: "Nespresso machine" }],
    priceLabel: "£95",
    title: "Nespresso Vertuo Next + Aeroccino 3 Milk Frother — Black, Like New",
    detailsLabel: "KITCHEN APPLIANCES • LIKE NEW • COFFEE MACHINE",
    locationLabel: "Chelsea, London",
    postedAt: hrsAgo(4),
    description: "<p>Like-new <strong>Nespresso Vertuo Next</strong> in matte black with Aeroccino 3 milk frother. Used fewer than 30 times — upgrading to a bean-to-bean machine. Fully descaled and cleaned. Includes 1 sleeve of Vertuo pods.</p>",
    keyDetails: [
      { key: "Machine",  value: "Nespresso Vertuo Next"     },
      { key: "Frother",  value: "Aeroccino 3"              },
      { key: "Colour",   value: "Matte black"              },
      { key: "Condition", value: "Like new — <30 uses"     },
    ],
    goodToKnow: [
      { key: "Pods",       value: "1 sleeve included"       },
      { key: "Descaled",   value: "Yes — clean"            },
      { key: "Box",        value: "Original"               },
      { key: "Collection", value: "Chelsea SW3"            },
    ],
    coordinates: { lat: 51.4876, lng: -0.1749 },
    seller: SELLERS.homePrivate,
  },
  {
    id: "home-kit-03", href: "/listings/home-kit-03", advId: "18033",
    images: [{ src: img(7), alt: "Air fryer" }],
    priceLabel: "£110",
    title: "Instant Vortex Plus 10L Air Fryer Oven — 7-in-1, Rotisserie, New in Box",
    detailsLabel: "KITCHEN APPLIANCES • NEW • AIR FRYER",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(1),
    description: "<p>Brand new, sealed <strong>Instant Vortex Plus 10L 7-in-1 air fryer oven</strong> with rotisserie function. Cook, roast, bake, grill, dehydrate, reheat, and air fry — fits a whole chicken. RRP £149. Unwanted gift.</p>",
    keyDetails: [
      { key: "Brand",     value: "Instant Vortex Plus"      },
      { key: "Capacity",  value: "10 litres"               },
      { key: "Functions", value: "7-in-1 + rotisserie"     },
      { key: "Condition", value: "Brand new, sealed"        },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£149"                   },
      { key: "Reason",     value: "Unwanted gift"           },
      { key: "Collection", value: "Wimbledon SW19"          },
      { key: "Postage",    value: "Available (£9)"          },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.alice,
  },
];


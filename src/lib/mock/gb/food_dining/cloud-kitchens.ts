import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── cloud_kitchens ─────────────────────────────────────────────────────────────
export const FOOD_CLOUD_KITCHENS: MockListing[] = [
  {
    id: "food-cloud-01", href: "/listings/food-cloud-01", advId: "13041",
    images: [{ src: img(7), alt: "Smash burgers" }],
    priceLabel: "From £9.95",
    title: "Smash Burger Co — Delivery Only, East London, Order on UberEats",
    detailsLabel: "CLOUD KITCHEN • BURGERS • EAST LONDON",
    locationLabel: "Bethnal Green, London",
    postedAt: daysAgo(1),
    description: "<p><strong>Smash Burger Co</strong> — delivery-only premium smash burgers from our Bethnal Green cloud kitchen. Single, double, and loaded smash stacks, crinkle fries, and thick shakes. Available via UberEats and Deliveroo 12pm–10pm daily.</p>",
    keyDetails: [
      { key: "Concept",    value: "Smash burgers"           },
      { key: "Order Via",  value: "UberEats, Deliveroo"     },
      { key: "Hours",      value: "12pm–10pm daily"         },
      { key: "Area",       value: "East London delivery"    },
    ],
    goodToKnow: [
      { key: "Dietary",    value: "Vegan patty available"   },
      { key: "Allergens",  value: "Menu on app"             },
      { key: "Free",       value: "Free side on 1st order"  },
      { key: "Followers",  value: "@smashburgerco on IG"    },
    ],
    coordinates: { lat: 51.5276, lng: -0.0538 },
    seller: SELLERS.foodPro,
  },
  {
    id: "food-cloud-02", href: "/listings/food-cloud-02", advId: "13042",
    images: [{ src: img(8), alt: "Ramen delivery" }],
    priceLabel: "From £12.50",
    title: "Tonkotsu Ramen Lab — Delivery Only, North London, Deliveroo",
    detailsLabel: "CLOUD KITCHEN • RAMEN • NORTH LONDON",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(3),
    description: "<p><strong>Tonkotsu Ramen Lab</strong> — delivery-only artisan ramen from our Islington cloud kitchen. Rich 14-hour pork broth, chashu pork, soft-boiled egg, and nori. Chicken and vegan broth options. Deliveroo 12pm–10pm Tue–Sun.</p>",
    keyDetails: [
      { key: "Concept",   value: "Artisan tonkotsu ramen"   },
      { key: "Order Via", value: "Deliveroo"                },
      { key: "Hours",     value: "12pm–10pm Tue–Sun"        },
      { key: "Area",      value: "N1, N5, N7, EC1 delivery" },
    ],
    goodToKnow: [
      { key: "Broth",    value: "Pork, chicken, or vegan"  },
      { key: "Add-ons",  value: "Extra chashu, corn, egg"  },
      { key: "Promo",    value: "Free gyoza on 1st order"  },
      { key: "IG",       value: "@tonkotsuramenlab"        },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.foodPro,
  },
  {
    id: "food-cloud-03", href: "/listings/food-cloud-03", advId: "13043",
    images: [{ src: img(9), alt: "Vegan Caribbean food" }],
    priceLabel: "From £10",
    title: "Vegan Vibes Kitchen — Jerk Jackfruit, Plantain, Caribbean, Deliveroo",
    detailsLabel: "CLOUD KITCHEN • VEGAN CARIBBEAN • SOUTH LONDON",
    locationLabel: "Brixton, London",
    postedAt: daysAgo(2),
    description: "<p><strong>Vegan Vibes Kitchen</strong> — 100% plant-based Caribbean food. Jerk jackfruit, plantain, black-eyed pea stew, and rice & peas. All dishes free from dairy and gluten. Available on Deliveroo and UberEats, 12pm–9pm Wed–Sun.</p>",
    keyDetails: [
      { key: "Concept",   value: "Vegan Caribbean"          },
      { key: "Order Via", value: "Deliveroo, UberEats"       },
      { key: "Hours",     value: "12pm–9pm Wed–Sun"         },
      { key: "Area",      value: "SW2, SW4, SW9 delivery"   },
    ],
    goodToKnow: [
      { key: "Dietary",  value: "100% vegan, GF"           },
      { key: "Allergens", value: "Full menu on app"         },
      { key: "New",      value: "Free plantain chips on 1st" },
      { key: "IG",       value: "@veganvibeskitchen"        },
    ],
    coordinates: { lat: 51.4613, lng: -0.1144 },
    seller: SELLERS.foodPro,
  },
];


import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── baked_goods ────────────────────────────────────────────────────────────────
export const FOOD_BAKED: MockListing[] = [
  {
    id: "food-bake-01", href: "/listings/food-bake-01", advId: "13051",
    images: [{ src: img(8), alt: "Custom cakes" }],
    priceLabel: "From £65",
    priceSuffix: "/ cake",
    title: "Custom Celebration Cakes — Birthdays, Weddings, Bespoke Designs",
    detailsLabel: "BAKED GOODS • CUSTOM CAKES • LONDON",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(5),
    description: "<p>Professional <strong>custom cake designer</strong> creating stunning bespoke celebration cakes for birthdays, weddings, and corporate events. All flavours available. Minimum 1 week notice. Taster boxes available before ordering.</p>",
    keyDetails: [
      { key: "Service",    value: "Custom celebration cakes" },
      { key: "Occasions",  value: "Birthday, wedding, corp." },
      { key: "Notice",     value: "Minimum 1 week"           },
      { key: "Flavours",   value: "All flavours available"   },
    ],
    goodToKnow: [
      { key: "Tasters",    value: "Taster box £15 (refunded)" },
      { key: "Allergens",  value: "GF and vegan options"      },
      { key: "Delivery",   value: "London-wide available"     },
      { key: "Consultation", value: "Free design consult"     },
    ],
    coordinates: { lat: 51.5465, lng: -0.0554 },
    seller: SELLERS.cateringCo,
  },
  {
    id: "food-bake-02", href: "/listings/food-bake-02", advId: "13052",
    images: [{ src: img(9), alt: "Sourdough bread" }],
    priceLabel: "£6",
    priceSuffix: "/ loaf",
    title: "Artisan Sourdough Bread — Weekly Bake, Collection or Local Delivery",
    detailsLabel: "BAKED GOODS • SOURDOUGH • PECKHAM",
    locationLabel: "Peckham, London",
    postedAt: daysAgo(2),
    description: "<p>Weekly-baked <strong>artisan sourdough loaves</strong> from a home baker in Peckham. Classic white, seeded, and rye available. Baked fresh every Friday morning — order by Wednesday. Collection from SE15 or local delivery (£1.50).</p>",
    keyDetails: [
      { key: "Product",   value: "Artisan sourdough"       },
      { key: "Varieties", value: "White, seeded, rye"      },
      { key: "Bake Day",  value: "Every Friday"            },
      { key: "Order By",  value: "Wednesday 8pm"           },
    ],
    goodToKnow: [
      { key: "Ingredients", value: "All natural, no additives" },
      { key: "Collection",  value: "Peckham SE15"             },
      { key: "Delivery",    value: "Local (£1.50)"            },
      { key: "Freezes",     value: "Freezes well"             },
    ],
    coordinates: { lat: 51.4741, lng: -0.0686 },
    seller: SELLERS.foodPro,
  },
  {
    id: "food-bake-03", href: "/listings/food-bake-03", advId: "13053",
    images: [{ src: img(1), alt: "Brownies and traybakes" }],
    priceLabel: "£18",
    priceSuffix: "/ box (12)",
    title: "Luxury Brownie & Traybake Boxes — 12 Pieces, Gift-Ready, Nationwide Post",
    detailsLabel: "BAKED GOODS • BROWNIES • NATIONWIDE",
    locationLabel: "Lewisham, London (posts UK-wide)",
    postedAt: hrsAgo(2),
    description: "<p>Indulgent <strong>brownie and traybake gift boxes</strong> — 12 generous pieces per box. Flavours include salted caramel, triple chocolate, Biscoff, and white choc raspberry. Perfect for gifting. Posted UK-wide in insulated boxes, arrive fresh.</p>",
    keyDetails: [
      { key: "Box",       value: "12 pieces"                  },
      { key: "Flavours",  value: "Salted caramel, choc, Biscoff" },
      { key: "Delivery",  value: "UK-wide (tracked 48hr)"     },
      { key: "Made To",   value: "Order — 3 days notice"      },
    ],
    goodToKnow: [
      { key: "Shelf Life", value: "5 days from dispatch"      },
      { key: "Gift Box",   value: "Ribbon + message card"     },
      { key: "GF Option",  value: "Gluten-free box available" },
      { key: "Min Order",  value: "1 box"                    },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.foodPro,
  },
];


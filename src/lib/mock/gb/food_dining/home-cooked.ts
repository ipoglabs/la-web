import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── home_cooked ────────────────────────────────────────────────────────────────
export const FOOD_HOME_COOKED: MockListing[] = [
  {
    id: "food-home-01", href: "/listings/food-home-01", advId: "13001",
    images: [{ src: img(1), alt: "Home cooked meals" }],
    priceLabel: "£8",
    priceSuffix: "/ portion",
    title: "Authentic Ghanaian Home-Cooked Meals — Fufu, Jollof, Soups",
    detailsLabel: "HOME COOKED • GHANAIAN • BRIXTON",
    locationLabel: "Brixton, London",
    postedAt: hrsAgo(3),
    description: "<p>Freshly prepared <strong>authentic Ghanaian home meals</strong> made to order — Fufu with Light or Groundnut Soup, Jollof Rice with Chicken, and Kelewele. Generous portions, natural ingredients. Order by 6pm for next-day collection or local delivery.</p>",
    keyDetails: [
      { key: "Cuisine",    value: "Ghanaian"               },
      { key: "Menu",       value: "Fufu, Jollof, Soups"    },
      { key: "Order By",   value: "6pm for next day"       },
      { key: "Portions",   value: "Generous (feeds 1–2)"   },
    ],
    goodToKnow: [
      { key: "Delivery",  value: "Local Brixton (£2)"     },
      { key: "Halal",     value: "Halal meat used"        },
      { key: "Allergens", value: "Stated on menu"         },
      { key: "Min. Order", value: "2 portions"            },
    ],
    coordinates: { lat: 51.4613, lng: -0.1144 },
    seller: SELLERS.foodPro,
  },
  {
    id: "food-home-02", href: "/listings/food-home-02", advId: "13002",
    images: [{ src: img(2), alt: "Indian meals" }],
    priceLabel: "£7",
    priceSuffix: "/ portion",
    title: "Home-Made South Indian Meals — Dosas, Curries, Sambar, Southall",
    detailsLabel: "HOME COOKED • SOUTH INDIAN • SOUTHALL",
    locationLabel: "Southall, London",
    postedAt: hrsAgo(6),
    description: "<p>Freshly made <strong>South Indian home food</strong> — crispy Masala Dosas, Sambar, Rasam, curries, and chutneys. Pure vegetarian, no onion/garlic available on request. Made fresh daily in a registered home kitchen.</p>",
    keyDetails: [
      { key: "Cuisine",    value: "South Indian"              },
      { key: "Menu",       value: "Dosas, curries, sambar"    },
      { key: "Diet",       value: "Pure vegetarian"           },
      { key: "Frequency",  value: "Made fresh daily"          },
    ],
    goodToKnow: [
      { key: "No Onion",  value: "Available on request"      },
      { key: "Hygiene",   value: "Food hygiene cert. 5-star" },
      { key: "Collection", value: "Southall, UB1"            },
      { key: "Order",     value: "WhatsApp/message by 7pm"   },
    ],
    coordinates: { lat: 51.5117, lng: -0.3756 },
    seller: SELLERS.foodPro,
  },
  {
    id: "food-home-03", href: "/listings/food-home-03", advId: "13003",
    images: [{ src: img(3), alt: "Polish home cooking" }],
    priceLabel: "£7",
    priceSuffix: "/ portion",
    title: "Home-Made Polish Meals — Pierogi, Bigos, Zurek, Ealing",
    detailsLabel: "HOME COOKED • POLISH • EALING",
    locationLabel: "Ealing, London",
    postedAt: daysAgo(1),
    description: "<p>Authentic <strong>home-cooked Polish meals</strong> prepared fresh in Ealing. Hand-made pierogi (potato & cheese, meat, or mushroom & sauerkraut), Bigos hunter stew, and Zurek soup with egg and sausage. Order by 7pm for next-day collection.</p>",
    keyDetails: [
      { key: "Cuisine",   value: "Traditional Polish"         },
      { key: "Menu",      value: "Pierogi, bigos, zurek"      },
      { key: "Order By",  value: "7pm for next day"           },
      { key: "Made By",   value: "Home kitchen (hygiene cert)" },
    ],
    goodToKnow: [
      { key: "Delivery",  value: "Local Ealing (£2)"         },
      { key: "Collection", value: "Ealing, W5"               },
      { key: "Portions",  value: "Generous — feeds 1–2"     },
      { key: "Freezable", value: "Pierogi freeze well"       },
    ],
    coordinates: { lat: 51.5130, lng: -0.3089 },
    seller: SELLERS.foodPro,
  },
];


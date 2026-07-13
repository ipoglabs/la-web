import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── tiffin_services ────────────────────────────────────────────────────────────
export const FOOD_TIFFIN: MockListing[] = [
  {
    id: "food-tiffin-01", href: "/listings/food-tiffin-01", advId: "13021",
    images: [{ src: img(4), alt: "Tiffin box" }],
    priceLabel: "£6",
    priceSuffix: "/ day",
    title: "Daily Tiffin Service — Fresh Hot Lunch Delivered, East London",
    detailsLabel: "TIFFIN SERVICE • DAILY • EAST LONDON",
    locationLabel: "Tower Hamlets / Newham",
    postedAt: hrsAgo(2),
    description: "<p>Hot freshly cooked <strong>daily tiffin lunch delivery</strong> to your home or office in Tower Hamlets and Newham. 2-dish dal-sabzi-roti menu rotated daily. Subscribe weekly or monthly — first week at half price.</p>",
    keyDetails: [
      { key: "Service",    value: "Daily tiffin delivery"  },
      { key: "Menu",       value: "Dal, sabzi, roti (rotated)" },
      { key: "Coverage",   value: "Tower Hamlets, Newham"  },
      { key: "Delivery",   value: "12pm–2pm daily"         },
    ],
    goodToKnow: [
      { key: "Trial",      value: "First week 50% off"     },
      { key: "Halt",       value: "Pause anytime"          },
      { key: "Hygiene",    value: "5-star food hygiene"    },
      { key: "Subscribe",  value: "Weekly or monthly"      },
    ],
    coordinates: { lat: 51.5155, lng: -0.0191 },
    seller: SELLERS.cateringCo,
  },
  {
    id: "food-tiffin-02", href: "/listings/food-tiffin-02", advId: "13022",
    images: [{ src: img(5), alt: "Healthy meal prep" }],
    priceLabel: "£9",
    priceSuffix: "/ meal",
    title: "Healthy Meal Prep Boxes — 5 or 10 Meals/Week, Macros Tracked",
    detailsLabel: "TIFFIN SERVICE • MEAL PREP • LONDON",
    locationLabel: "North & Central London",
    postedAt: daysAgo(1),
    description: "<p><strong>Macro-tracked meal prep boxes</strong> for fitness-focused individuals. Choose from high-protein, low-carb, or balanced plans. 5 or 10 meals per week, delivered Sunday evenings. Fully customisable — calorie range 400–800kcal per meal.</p>",
    keyDetails: [
      { key: "Options",    value: "5 or 10 meals/week"      },
      { key: "Plans",      value: "High-protein, low-carb, balanced" },
      { key: "Delivery",   value: "Sunday evenings"         },
      { key: "Calories",   value: "400–800kcal options"     },
    ],
    goodToKnow: [
      { key: "Allergens",  value: "Full info provided"      },
      { key: "Containers", value: "Recyclable trays"        },
      { key: "Min. Order", value: "5 meals/week"            },
      { key: "Cancel",     value: "Pause or cancel anytime" },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.foodPro,
  },
  {
    id: "food-tiffin-03", href: "/listings/food-tiffin-03", advId: "13023",
    images: [{ src: img(6), alt: "Afro-Caribbean tiffin" }],
    priceLabel: "£8.50",
    priceSuffix: "/ day",
    title: "Afro-Caribbean Tiffin Delivery — Hot Lunch Mon–Fri, Hackney",
    detailsLabel: "TIFFIN SERVICE • AFRO-CARIBBEAN • HACKNEY",
    locationLabel: "Hackney / Stoke Newington",
    postedAt: daysAgo(1),
    description: "<p>Hot <strong>Afro-Caribbean tiffin lunch delivery</strong> in Hackney and Stoke Newington, Monday to Friday. Rotating menu of rice & peas, stewed chicken, ackee & saltfish, and plantain. Halal. Subscribe weekly or monthly.</p>",
    keyDetails: [
      { key: "Cuisine",   value: "Afro-Caribbean"           },
      { key: "Days",      value: "Monday to Friday"         },
      { key: "Delivery",  value: "12pm–2pm"                },
      { key: "Coverage",  value: "Hackney + Stoke Newington" },
    ],
    goodToKnow: [
      { key: "Halal",     value: "Halal certified"          },
      { key: "Trial",     value: "First 3 days £20 (trial)" },
      { key: "Pause",     value: "Pause anytime"            },
      { key: "Hygiene",   value: "5-star food hygiene"      },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.cateringCo,
  },
];


import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── catering ───────────────────────────────────────────────────────────────────
export const FOOD_CATERING: MockListing[] = [
  {
    id: "food-cater-01", href: "/listings/food-cater-01", advId: "13011",
    images: [{ src: img(3), alt: "Wedding catering" }],
    priceLabel: "From £35",
    priceSuffix: "/ head",
    title: "Wedding & Event Catering — Full Service, Bespoke Menus, London",
    detailsLabel: "CATERING • EVENTS • LONDON",
    locationLabel: "Greater London",
    postedAt: daysAgo(1),
    description: "<p>Award-winning <strong>event catering company</strong> covering weddings, corporate events, and private parties across Greater London. From 20 to 500 guests. Full service including front-of-house, linen, and equipment hire.</p>",
    keyDetails: [
      { key: "Service",     value: "Full-service catering"   },
      { key: "Guests",      value: "20–500 guests"           },
      { key: "Coverage",    value: "Greater London"          },
      { key: "Menu Style",  value: "Bespoke to brief"        },
    ],
    goodToKnow: [
      { key: "Tasting",    value: "Complimentary for weddings" },
      { key: "Insurance",  value: "£5M public liability"       },
      { key: "Halal/Vegan", value: "Fully accommodated"        },
      { key: "Quote",      value: "Free within 48 hours"       },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.cateringCo,
  },
  {
    id: "food-cater-02", href: "/listings/food-cater-02", advId: "13012",
    images: [{ src: img(4), alt: "Street food van" }],
    priceLabel: "From £500",
    priceSuffix: "/ event",
    title: "Street Food Van for Hire — BBQ Smokehouse, 4hrs min, London-wide",
    detailsLabel: "CATERING • STREET FOOD VAN • LONDON",
    locationLabel: "Greater London",
    postedAt: daysAgo(1),
    description: "<p>Book our <strong>BBQ Smokehouse street food van</strong> for your event — festivals, corporate away-days, private parties, and fetes. Slow-smoked brisket, pulled pork, and chicken with all the trimmings. 4-hour minimum, serves 50–300 guests.</p>",
    keyDetails: [
      { key: "Concept",   value: "BBQ Smokehouse"           },
      { key: "Capacity",  value: "50–300 guests"            },
      { key: "Minimum",   value: "4 hours"                 },
      { key: "Coverage",  value: "London + 50-mile radius" },
    ],
    goodToKnow: [
      { key: "Vegan",     value: "Vegan options available"  },
      { key: "Insurance",  value: "£5M public liability"    },
      { key: "Generator", value: "Self-sufficient"         },
      { key: "Quote",     value: "Free in 24 hours"        },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.cateringCo,
  },
  {
    id: "food-cater-03", href: "/listings/food-cater-03", advId: "13013",
    images: [{ src: img(5), alt: "Office lunch catering" }],
    priceLabel: "£12",
    priceSuffix: "/ head",
    title: "Corporate Lunch Catering — Daily Office Delivery, Minimum 10 People",
    detailsLabel: "CATERING • CORPORATE LUNCH • CENTRAL LONDON",
    locationLabel: "Central London (delivery)",
    postedAt: hrsAgo(6),
    description: "<p>Daily <strong>corporate lunch delivery</strong> to your office — individually boxed, labelled, and allergen-listed. Rotating weekly menu of sandwiches, salads, hot dishes, and wraps. Minimum 10 people, contract or one-off bookings available.</p>",
    keyDetails: [
      { key: "Minimum",   value: "10 people"              },
      { key: "Format",    value: "Individually boxed"     },
      { key: "Menu",      value: "Weekly rotating"        },
      { key: "Delivery",  value: "Central London offices" },
    ],
    goodToKnow: [
      { key: "Allergens", value: "Labelled per box"        },
      { key: "Dietary",   value: "Vegan, GF, Halal"        },
      { key: "Contract",  value: "Discounts for 5-day/wk" },
      { key: "Order By",  value: "9am for same day"        },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.cateringCo,
  },
];


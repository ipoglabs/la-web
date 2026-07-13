import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── food_dining ───────────────────────────────────────────────────────────────
export const SERVICES_FOOD: MockListing[] = [
  {
    id: "svc-food-01", href: "/listings/svc-food-01", advId: "40061",
    images: [{ src: img(1), alt: "Private chef" }],
    priceLabel: "From £300",
    priceSuffix: "/ event",
    title: "Private Chef for Dinner Parties — Fine Dining at Home",
    detailsLabel: "FOOD & DINING • PRIVATE CHEF • LONDON",
    locationLabel: "All London",
    postedAt: hrsAgo(6),
    description: "<p>Award-winning <strong>private chef</strong> bringing restaurant-quality fine dining to your home. From intimate dinner parties to special celebrations — custom menus designed around your preferences and dietary needs.</p>",
    keyDetails: [
      { key: "Service Type",  value: "Private chef events"  },
      { key: "Coverage",      value: "All London"           },
      { key: "Availability",  value: "Fri–Sun evenings"     },
      { key: "Guests",        value: "4 to 30 people"       },
    ],
    goodToKnow: [
      { key: "Menu",       value: "Fully bespoke"           },
      { key: "Dietary",    value: "All requirements catered" },
      { key: "Includes",   value: "Ingredients + service"   },
      { key: "Booking",    value: "14 days advance notice"  },
    ],
    coordinates: { lat: 51.5136, lng: -0.1601 },
    seller: SELLERS.chefPro,
  },
  {
    id: "svc-food-02", href: "/listings/svc-food-02", advId: "40062",
    images: [{ src: img(2), alt: "Home-cooked South Asian meals" }],
    priceLabel: "From £8",
    priceSuffix: "/ meal",
    title: "Authentic South Asian Home-Cooked Meals — Weekly Tiffin, Wembley",
    detailsLabel: "FOOD & DINING • HOME COOK • WEMBLEY",
    locationLabel: "Wembley & Surrounding Areas",
    postedAt: daysAgo(2),
    description: "<p>Home-cooked <strong>South Asian meals</strong> prepared fresh daily with traditional recipes and halal ingredients. Weekly tiffin subscriptions available — curries, rice, rotis, and sides. Free delivery within 5 miles of Wembley.</p>",
    keyDetails: [
      { key: "Service Type",  value: "Home-cooked meals"      },
      { key: "Coverage",      value: "5 miles from Wembley"   },
      { key: "Availability",  value: "Mon–Sat, order by noon" },
      { key: "Dietary",       value: "Halal, vegetarian opt." },
    ],
    goodToKnow: [
      { key: "Minimum",      value: "2 meals per order"      },
      { key: "Subscription", value: "Weekly tiffin plans"    },
      { key: "Hygiene",      value: "Food hygiene cert. 5/5" },
      { key: "Delivery",     value: "Free within 5 miles"    },
    ],
    coordinates: { lat: 51.5536, lng: -0.2964 },
    seller: SELLERS.foodPro,
  },
  {
    id: "svc-food-03", href: "/listings/svc-food-03", advId: "40063",
    images: [{ src: img(3), alt: "Event catering buffet" }],
    priceLabel: "From £45",
    priceSuffix: "/ head",
    title: "Full-Service Event Catering — Weddings, Corporates & Private Parties",
    detailsLabel: "FOOD & DINING • FULL-SERVICE CATERER • LONDON",
    locationLabel: "All London & Home Counties",
    postedAt: daysAgo(3),
    description: "<p>Award-winning <strong>full-service catering company</strong> for weddings, corporate events, and private parties across London and the Home Counties. Multi-cuisine menus, waiting staff, crockery, and complete event management.</p>",
    keyDetails: [
      { key: "Service Type",  value: "Event Catering"         },
      { key: "Coverage",      value: "London & Home Counties" },
      { key: "Availability",  value: "7 days, by arrangement" },
      { key: "Min. Guests",   value: "30 minimum"             },
    ],
    goodToKnow: [
      { key: "Tasting",   value: "Free tasting for 50+ pax" },
      { key: "Includes",  value: "Staff, crockery, setup"   },
      { key: "Deposit",   value: "25% to confirm booking"   },
      { key: "Insurance", value: "£5M event liability"       },
    ],
    coordinates: { lat: 51.5130, lng: -0.3016 },
    seller: SELLERS.cateringCo,
  },
];


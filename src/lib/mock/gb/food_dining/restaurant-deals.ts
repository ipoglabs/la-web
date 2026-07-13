import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── restaurant_deals ───────────────────────────────────────────────────────────
export const FOOD_RESTAURANT_DEALS: MockListing[] = [
  {
    id: "food-rest-01", href: "/listings/food-rest-01", advId: "13031",
    images: [{ src: img(6), alt: "Restaurant set menu" }],
    priceLabel: "£22",
    priceSuffix: "/ person (3 courses)",
    title: "Set Lunch Menu — 3 Courses £22, Modern British, Covent Garden",
    detailsLabel: "RESTAURANT DEALS • £22 SET MENU • COVENT GARDEN",
    locationLabel: "Covent Garden, London",
    postedAt: hrsAgo(4),
    description: "<p>Acclaimed Modern British restaurant offering an exceptional <strong>3-course set lunch for £22/person</strong>. Seasonal menu changes weekly — choose from 3 starters, 4 mains, and 3 desserts. Available Mon–Fri 12–3pm.</p>",
    keyDetails: [
      { key: "Offer",     value: "3 courses for £22/person"  },
      { key: "Available", value: "Mon–Fri 12pm–3pm"          },
      { key: "Menu",      value: "Weekly seasonal change"    },
      { key: "Cuisine",   value: "Modern British"            },
    ],
    goodToKnow: [
      { key: "Booking",   value: "Recommended"              },
      { key: "Wine",      value: "House wine from £6/glass" },
      { key: "Dietary",   value: "Vegan/GF options avail."  },
      { key: "Service",   value: "12.5% discretionary"      },
    ],
    coordinates: { lat: 51.5117, lng: -0.1240 },
    seller: SELLERS.foodPro,
  },
  {
    id: "food-rest-02", href: "/listings/food-rest-02", advId: "13032",
    images: [{ src: img(7), alt: "Bottomless brunch" }],
    priceLabel: "£45",
    priceSuffix: "/ person",
    title: "Bottomless Brunch — 90 Mins Prosecco + Full Cooked, Every Saturday",
    detailsLabel: "RESTAURANT DEALS • BOTTOMLESS • SHOREDITCH",
    locationLabel: "Shoreditch, London",
    postedAt: hrsAgo(3),
    description: "<p>Every Saturday: <strong>bottomless brunch</strong> at our Shoreditch restaurant — 90 minutes of unlimited Prosecco, Aperol Spritz, or Bloody Mary plus a full cooked brunch. Sittings at 11am, 1pm, and 3pm. Booking essential, max 8 per table.</p>",
    keyDetails: [
      { key: "Offer",     value: "90-min unlimited drinks + brunch" },
      { key: "Available", value: "Every Saturday"          },
      { key: "Sittings",  value: "11am, 1pm, 3pm"          },
      { key: "Drinks",    value: "Prosecco, Aperol, Bloody Mary" },
    ],
    goodToKnow: [
      { key: "Booking",   value: "Essential — fills fast"  },
      { key: "Max Table", value: "8 people"                },
      { key: "Dietary",   value: "Vegan brunch available" },
      { key: "Deposit",   value: "£10pp to secure"        },
    ],
    coordinates: { lat: 51.5267, lng: -0.0818 },
    seller: SELLERS.foodPro,
  },
  {
    id: "food-rest-03", href: "/listings/food-rest-03", advId: "13033",
    images: [{ src: img(8), alt: "BYOB Indian restaurant" }],
    priceLabel: "No Corkage",
    title: "BYOB Indian Restaurant — No Corkage Fee, BYO Wine or Beer, Tooting",
    detailsLabel: "RESTAURANT DEALS • BYOB • TOOTING",
    locationLabel: "Tooting, London",
    postedAt: daysAgo(2),
    description: "<p>Bring your own wine, beer, or spirits to our <strong>authentic North Indian restaurant</strong> in Tooting with <strong>zero corkage charge</strong>. All dishes under £14. Beloved neighbourhood gem with 4.8★ on Google. Booking available, walk-ins welcome.</p>",
    keyDetails: [
      { key: "BYOB",      value: "Wine, beer, spirits"    },
      { key: "Corkage",   value: "FREE — no charge"       },
      { key: "Cuisine",   value: "North Indian"           },
      { key: "Dishes",    value: "All under £14"          },
    ],
    goodToKnow: [
      { key: "Rating",    value: "4.8★ Google (800+ reviews)" },
      { key: "Booking",   value: "Available + walk-ins"  },
      { key: "Hours",     value: "Mon–Sun 5pm–11pm"        },
      { key: "BYOB Tip",  value: "Off-licence next door"  },
    ],
    coordinates: { lat: 51.4275, lng: -0.1670 },
    seller: SELLERS.foodPro,
  },
];


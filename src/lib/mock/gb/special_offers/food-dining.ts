import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── food_dining ────────────────────────────────────────────────────────────────
export const SPECIAL_OFFERS_FOOD: MockListing[] = [
  {
    id: "offer-food-01", href: "/listings/offer-food-01", advId: "90031",
    images: [{ src: img(5), alt: "Restaurant 2-for-1" }],
    priceLabel: "2-for-1 Mains",
    title: "2-for-1 on All Main Courses — Weekday Lunches, SW London",
    detailsLabel: "FOOD & DINING • 2-FOR-1 • DINE-IN",
    locationLabel: "Clapham, London",
    postedAt: hrsAgo(4),
    description: "<p>Enjoy <strong>2-for-1 on all main courses</strong> during weekday lunches (Mon–Fri, 12pm–3pm) at our Clapham restaurant. No voucher needed — just mention LokalAds. Valid through July 2026. Terms apply.</p>",
    keyDetails: [
      { key: "Offer",     value: "2-for-1 main courses"    },
      { key: "Valid",     value: "Mon–Fri 12pm–3pm"        },
      { key: "Period",    value: "Throughout July 2026"    },
      { key: "How",       value: "Mention LokalAds"        },
    ],
    goodToKnow: [
      { key: "Booking",   value: "Recommended — 020 XXXX" },
      { key: "Excludes",  value: "Set menu & bank holidays" },
      { key: "Minimum",   value: "Table of 2 required"    },
      { key: "Drinks",    value: "Not included in offer"  },
    ],
    coordinates: { lat: 51.4613, lng: -0.1357 },
    seller: SELLERS.foodPro,
  },
  {
    id: "offer-food-02", href: "/listings/offer-food-02", advId: "90032",
    images: [{ src: img(6), alt: "Meal kit subscription" }],
    priceLabel: "50% Off",
    priceSuffix: "first 3 boxes",
    title: "Meal Kit Subscription — 50% Off First 3 Boxes, Skip or Cancel Anytime",
    detailsLabel: "FOOD & DINING • 50% OFF • MEAL KIT",
    locationLabel: "UK-wide (delivery)",
    postedAt: hrsAgo(2),
    description: "<p>Get your first 3 meal kit boxes at <strong>50% off</strong> — choose 2, 3, or 4 recipes per box. Fresh pre-portioned ingredients delivered weekly. Vegetarian, meat, and family plans available. Pause or cancel anytime, no hidden fees.</p>",
    keyDetails: [
      { key: "Offer",    value: "50% off first 3 boxes"  },
      { key: "Recipes",  value: "2–4 per box"           },
      { key: "Plans",    value: "Veg, meat, family"     },
      { key: "Delivery", value: "Weekly, chosen day"    },
    ],
    goodToKnow: [
      { key: "Cancel",   value: "Anytime, no fee"       },
      { key: "After",    value: "Full price from box 4" },
      { key: "Waste",    value: "Pre-portioned — zero waste" },
      { key: "Code",     value: "Applied at checkout"   },
    ],
    coordinates: { lat: 51.4613, lng: -0.1357 },
    seller: SELLERS.foodPro,
  },
  {
    id: "offer-food-03", href: "/listings/offer-food-03", advId: "90033",
    images: [{ src: img(7), alt: "Cafe grand opening" }],
    priceLabel: "FREE Coffee",
    title: "Grand Opening — Free Coffee with Any Hot Meal, The Arch Café, Peckham",
    detailsLabel: "FOOD & DINING • FREE COFFEE • LOCAL CAFÉ",
    locationLabel: "Peckham, London",
    postedAt: hrsAgo(1),
    description: "<p>We're open! <strong>The Arch Café on Rye Lane, Peckham</strong> is celebrating our grand opening with a free coffee with every hot meal — valid throughout July 2026. Breakfast, brunch, and lunch. Dog-friendly with outdoor seating.</p>",
    keyDetails: [
      { key: "Offer",    value: "Free coffee with hot meal" },
      { key: "Valid",    value: "All of July 2026"       },
      { key: "Location", value: "Rye Lane, Peckham SE15" },
      { key: "Hours",    value: "8am – 4pm daily"        },
    ],
    goodToKnow: [
      { key: "Dogs",     value: "Welcome inside"         },
      { key: "Outdoor",  value: "Seating available"      },
      { key: "One Per",  value: "One free coffee per meal" },
      { key: "Card Only", value: "No cash accepted"      },
    ],
    coordinates: { lat: 51.4741, lng: -0.0686 },
    seller: SELLERS.foodPro,
  },
];


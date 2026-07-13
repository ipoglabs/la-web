import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── banking_finance ────────────────────────────────────────────────────────────
export const SG_OFFERS_BANKING_FINANCE: MockListing[] = [
  {
    id: "offers-sg-banking-01", href: "/listings/offers-sg-banking-01", advId: "37001",
    images: [{ src: img(1), alt: "Credit card cashback" }],
    priceLabel: "10% cashback",
    title: "DBS Credit Card \u2014 10% Cashback on Online Shopping This Week",
    detailsLabel: "OFFER \u2022 BANKING \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Get 10% instant cashback (up to S$50) when you shop online using your DBS credit card this week. Valid on select partner sites.</p>",
    keyDetails: [
      { key: "Discount", value: "10% cashback, up to S$50" },
      { key: "Valid Till", value: "End of this week" },
    ],
    goodToKnow: [
      { key: "Eligibility", value: "DBS credit cardholders only" },
    ],
    coordinates: { lat: 1.2830, lng: 103.8607 },
    seller: SELLERS.dbsOffersDeskSG,
  },
  {
    id: "offers-sg-banking-02", href: "/listings/offers-sg-banking-02", advId: "37002",
    images: [{ src: img(2), alt: "Zero forex fee" }],
    priceLabel: "0% forex markup",
    title: "Zero Forex Markup on International Spends \u2014 Limited Time",
    detailsLabel: "OFFER \u2022 BANKING \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Enjoy zero forex markup fee on international transactions made with select DBS debit and credit cards for a limited period.</p>",
    keyDetails: [
      { key: "Benefit", value: "0% forex markup" },
    ],
    goodToKnow: [
      { key: "Cards", value: "Select debit & credit cards" },
    ],
    coordinates: { lat: 1.2830, lng: 103.8607 },
    seller: SELLERS.dbsOffersDeskSG,
  },
];

// ── travel_tourism ─────────────────────────────────────────────────────────────
export const SG_OFFERS_TRAVEL_TOURISM: MockListing[] = [
  {
    id: "offers-sg-travel-01", href: "/listings/offers-sg-travel-01", advId: "37011",
    images: [{ src: img(3), alt: "Flight deal" }],
    priceLabel: "Up to 30% off",
    title: "Flash Sale \u2014 Up to 30% Off Regional Flights This Weekend",
    detailsLabel: "OFFER \u2022 TRAVEL \u2022 SINGAPORE",
    locationLabel: "Changi, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Book regional flights this weekend and save up to 30% on select routes across major airlines.</p>",
    keyDetails: [
      { key: "Discount", value: "Up to 30% off" },
      { key: "Routes", value: "Select regional routes" },
    ],
    goodToKnow: [
      { key: "Booking Window", value: "This weekend only" },
    ],
    coordinates: { lat: 1.3644, lng: 103.9915 },
    seller: SELLERS.changiTravelDealsSG,
  },
  {
    id: "offers-sg-travel-02", href: "/listings/offers-sg-travel-02", advId: "37012",
    images: [{ src: img(4), alt: "Hotel deal" }],
    priceLabel: "Flat S$80 off",
    title: "Flat S$80 Off on Bintan Beach Resort Bookings",
    detailsLabel: "OFFER \u2022 TRAVEL \u2022 SINGAPORE",
    locationLabel: "Changi, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Book any partner beach resort in Bintan for 2+ nights and get a flat S$80 discount on your total booking.</p>",
    keyDetails: [
      { key: "Discount", value: "Flat S$80 off" },
      { key: "Minimum Stay", value: "2 nights" },
    ],
    goodToKnow: [
      { key: "Location", value: "Select Bintan resorts" },
    ],
    coordinates: { lat: 1.3644, lng: 103.9915 },
    seller: SELLERS.changiTravelDealsSG,
  },
];

// ── retail_shopping ─────────────────────────────────────────────────────────────
export const SG_OFFERS_RETAIL_SHOPPING: MockListing[] = [
  {
    id: "offers-sg-retail-01", href: "/listings/offers-sg-retail-01", advId: "37021",
    images: [{ src: img(5), alt: "Weekend sale" }],
    priceLabel: "Up to 50% off",
    title: "Weekend Mega Sale \u2014 Up to 50% Off on Apparel & Home",
    detailsLabel: "OFFER \u2022 RETAIL \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Massive weekend sale across apparel, home decor, and kitchenware categories \u2014 discounts up to 50% storewide.</p>",
    keyDetails: [
      { key: "Discount", value: "Up to 50% off" },
      { key: "Categories", value: "Apparel, home, kitchenware" },
    ],
    goodToKnow: [
      { key: "Valid", value: "This weekend only" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.ntucDealsSG,
  },
  {
    id: "offers-sg-retail-02", href: "/listings/offers-sg-retail-02", advId: "37022",
    images: [{ src: img(6), alt: "Buy one get one" }],
    priceLabel: "Buy 1 Get 1 Free",
    title: "Buy 1 Get 1 Free on Select Grocery Items",
    detailsLabel: "OFFER \u2022 RETAIL \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Buy one, get one free on select grocery staples including rice, noodles, and cooking oil this month.</p>",
    keyDetails: [
      { key: "Offer", value: "Buy 1 Get 1 Free" },
    ],
    goodToKnow: [
      { key: "Applicable", value: "Select SKUs only" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.ntucDealsSG,
  },
];

// ── food_dining ────────────────────────────────────────────────────────────────
export const SG_OFFERS_FOOD_DINING: MockListing[] = [
  {
    id: "offers-sg-food-01", href: "/listings/offers-sg-food-01", advId: "37031",
    images: [{ src: img(7), alt: "Food delivery discount" }],
    priceLabel: "Flat 40% off",
    title: "Flat 40% Off on First 3 Orders \u2014 New Users",
    detailsLabel: "OFFER \u2022 FOOD DELIVERY \u2022 SINGAPORE",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: hrsAgo(1),
    description: "<p>New users get a flat 40% discount (up to S$8) on their first 3 orders across all partner restaurants.</p>",
    keyDetails: [
      { key: "Discount", value: "40% off, up to S$8" },
      { key: "Eligible", value: "New users only" },
    ],
    goodToKnow: [
      { key: "Orders", value: "Applies to first 3 orders" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.foodpandaOffersSG,
  },
  {
    id: "offers-sg-food-02", href: "/listings/offers-sg-food-02", advId: "37032",
    images: [{ src: img(8), alt: "Free delivery" }],
    priceLabel: "Free delivery",
    title: "Free Delivery on Orders Above S$15 \u2014 This Week",
    detailsLabel: "OFFER \u2022 FOOD DELIVERY \u2022 SINGAPORE",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Enjoy free delivery on all orders above S$15 across partner restaurants for a limited time this week.</p>",
    keyDetails: [
      { key: "Minimum Order", value: "S$15" },
    ],
    goodToKnow: [
      { key: "Valid Till", value: "End of this week" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.foodpandaOffersSG,
  },
];

// ── electronics_gadgets ──────────────────────────────────────────────────────────
export const SG_OFFERS_ELECTRONICS_GADGETS: MockListing[] = [
  {
    id: "offers-sg-electronics-01", href: "/listings/offers-sg-electronics-01", advId: "37041",
    images: [{ src: img(9), alt: "Laptop exchange offer" }],
    priceLabel: "Up to S$300 exchange bonus",
    title: "Laptop Exchange Offer \u2014 Extra S$300 Bonus on Old Devices",
    detailsLabel: "OFFER \u2022 ELECTRONICS \u2022 SINGAPORE",
    locationLabel: "Jurong, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Trade in your old laptop and get an additional exchange bonus of up to S$300 on top of the standard exchange value.</p>",
    keyDetails: [
      { key: "Bonus", value: "Up to S$300 extra" },
    ],
    goodToKnow: [
      { key: "Applicable", value: "Select laptop models" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.courtsDealsSG,
  },
  {
    id: "offers-sg-electronics-02", href: "/listings/offers-sg-electronics-02", advId: "37042",
    images: [{ src: img(1), alt: "No cost installment" }],
    priceLabel: "0% installment",
    title: "0% Installment Plan on Smartphones Above S$800",
    detailsLabel: "OFFER \u2022 ELECTRONICS \u2022 SINGAPORE",
    locationLabel: "Jurong, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Purchase any smartphone priced above S$800 with 0% installment options for up to 12 months.</p>",
    keyDetails: [
      { key: "Installment Tenure", value: "Up to 12 months" },
    ],
    goodToKnow: [
      { key: "Minimum Price", value: "S$800" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.courtsDealsSG,
  },
];

// ── health_wellness ───────────────────────────────────────────────────────────────
export const SG_OFFERS_HEALTH_WELLNESS: MockListing[] = [
  {
    id: "offers-sg-health-01", href: "/listings/offers-sg-health-01", advId: "37051",
    images: [{ src: img(2), alt: "Gym membership offer" }],
    priceLabel: "3 months at price of 2",
    title: "Annual Gym Membership \u2014 Get 3 Months Free",
    detailsLabel: "OFFER \u2022 WELLNESS \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>Sign up for an annual gym membership this month and get 3 additional months absolutely free.</p>",
    keyDetails: [
      { key: "Offer", value: "3 months free with annual plan" },
    ],
    goodToKnow: [
      { key: "Valid Till", value: "End of this month" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.fitnessFirstOffersSG,
  },
  {
    id: "offers-sg-health-02", href: "/listings/offers-sg-health-02", advId: "37052",
    images: [{ src: img(3), alt: "Yoga class discount" }],
    priceLabel: "50% off first month",
    title: "50% Off First Month of Yoga & Pilates Classes",
    detailsLabel: "OFFER \u2022 WELLNESS \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: daysAgo(3),
    description: "<p>New members get 50% off their first month of unlimited yoga and pilates classes.</p>",
    keyDetails: [
      { key: "Discount", value: "50% off first month" },
    ],
    goodToKnow: [
      { key: "Eligibility", value: "New members only" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.fitnessFirstOffersSG,
  },
];

// ── education_learning ───────────────────────────────────────────────────────────
export const SG_OFFERS_EDUCATION_LEARNING: MockListing[] = [
  {
    id: "offers-sg-education-01", href: "/listings/offers-sg-education-01", advId: "37061",
    images: [{ src: img(4), alt: "Course discount" }],
    priceLabel: "40% off annual plan",
    title: "40% Off Annual Learning Plan \u2014 Primary to Secondary",
    detailsLabel: "OFFER \u2022 EDUCATION \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: hrsAgo(12),
    description: "<p>Get 40% off the annual subscription plan for Primary to Secondary levels, covering all major subjects and doubt-solving sessions.</p>",
    keyDetails: [
      { key: "Discount", value: "40% off annual plan" },
      { key: "Levels", value: "Primary to Secondary" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Doubt-solving sessions" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.mindChampsOffersSG,
  },
  {
    id: "offers-sg-education-02", href: "/listings/offers-sg-education-02", advId: "37062",
    images: [{ src: img(5), alt: "Free trial" }],
    priceLabel: "14-day free trial",
    title: "14-Day Free Trial \u2014 All Courses Unlocked",
    detailsLabel: "OFFER \u2022 EDUCATION \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: daysAgo(4),
    description: "<p>Try any course free for 14 days with full access to video lessons, practice tests, and live doubt sessions.</p>",
    keyDetails: [
      { key: "Trial Period", value: "14 days" },
    ],
    goodToKnow: [
      { key: "Cancellation", value: "Cancel anytime during trial" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.mindChampsOffersSG,
  },
];

// ── holiday_seasonal ──────────────────────────────────────────────────────────────
export const SG_OFFERS_HOLIDAY_SEASONAL: MockListing[] = [
  {
    id: "offers-sg-holiday-01", href: "/listings/offers-sg-holiday-01", advId: "37071",
    images: [{ src: img(6), alt: "Deepavali sale" }],
    priceLabel: "Up to 60% off",
    title: "Deepavali Mega Sale \u2014 Up to 60% Off Storewide",
    detailsLabel: "OFFER \u2022 SEASONAL \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Our biggest sale of the year is here \u2014 up to 60% off across all categories for the Deepavali season.</p>",
    keyDetails: [
      { key: "Discount", value: "Up to 60% off" },
    ],
    goodToKnow: [
      { key: "Duration", value: "2 weeks, Deepavali season" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.festiveDealsSG,
  },
  {
    id: "offers-sg-holiday-02", href: "/listings/offers-sg-holiday-02", advId: "37072",
    images: [{ src: img(7), alt: "New year sale" }],
    priceLabel: "Flat 25% off",
    title: "New Year Clearance Sale \u2014 Flat 25% Off Everything",
    detailsLabel: "OFFER \u2022 SEASONAL \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Ring in the new year with a flat 25% discount storewide, no minimum purchase required.</p>",
    keyDetails: [
      { key: "Discount", value: "Flat 25% off" },
    ],
    goodToKnow: [
      { key: "Minimum Purchase", value: "None" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.festiveDealsSG,
  },
];

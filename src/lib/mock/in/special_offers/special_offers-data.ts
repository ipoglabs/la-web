import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── banking_finance ────────────────────────────────────────────────────────────
export const IN_OFFERS_BANKING_FINANCE: MockListing[] = [
  {
    id: "offers-in-banking-01", href: "/listings/offers-in-banking-01", advId: "27001",
    images: [{ src: img(1), alt: "Credit card cashback" }],
    priceLabel: "10% cashback",
    title: "HDFC Credit Card \u2014 10% Cashback on Online Shopping This Week",
    detailsLabel: "OFFER \u2022 BANKING \u2022 MUMBAI",
    locationLabel: "Nariman Point, Mumbai",
    postedAt: hrsAgo(2),
    description: "<p>Get 10% instant cashback (up to \u20b91,500) when you shop online using your HDFC credit card this week. Valid on select partner sites.</p>",
    keyDetails: [
      { key: "Discount", value: "10% cashback, up to \u20b91,500" },
      { key: "Valid Till", value: "End of this week" },
    ],
    goodToKnow: [
      { key: "Eligibility", value: "HDFC credit cardholders only" },
    ],
    coordinates: { lat: 18.9256, lng: 72.8242 },
    seller: SELLERS.hdfcOffersDesk,
  },
  {
    id: "offers-in-banking-02", href: "/listings/offers-in-banking-02", advId: "27002",
    images: [{ src: img(2), alt: "Zero forex fee" }],
    priceLabel: "0% forex markup",
    title: "Zero Forex Markup on International Spends \u2014 Limited Time",
    detailsLabel: "OFFER \u2022 BANKING \u2022 MUMBAI",
    locationLabel: "Nariman Point, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Enjoy zero forex markup fee on international transactions made with select HDFC debit and credit cards for a limited period.</p>",
    keyDetails: [
      { key: "Benefit", value: "0% forex markup" },
    ],
    goodToKnow: [
      { key: "Cards", value: "Select debit & credit cards" },
    ],
    coordinates: { lat: 18.9256, lng: 72.8242 },
    seller: SELLERS.hdfcOffersDesk,
  },
];

// ── travel_tourism ─────────────────────────────────────────────────────────────
export const IN_OFFERS_TRAVEL_TOURISM: MockListing[] = [
  {
    id: "offers-in-travel-01", href: "/listings/offers-in-travel-01", advId: "27011",
    images: [{ src: img(3), alt: "Flight deal" }],
    priceLabel: "Up to 30% off",
    title: "Flash Sale \u2014 Up to 30% Off Domestic Flights This Weekend",
    detailsLabel: "OFFER \u2022 TRAVEL \u2022 DELHI",
    locationLabel: "Gurugram, Delhi/NCR",
    postedAt: hrsAgo(4),
    description: "<p>Book domestic flights this weekend and save up to 30% on select routes across major Indian airlines.</p>",
    keyDetails: [
      { key: "Discount", value: "Up to 30% off" },
      { key: "Routes", value: "Select domestic routes" },
    ],
    goodToKnow: [
      { key: "Booking Window", value: "This weekend only" },
    ],
    coordinates: { lat: 28.4595, lng: 77.0266 },
    seller: SELLERS.makeMyDealsIndia,
  },
  {
    id: "offers-in-travel-02", href: "/listings/offers-in-travel-02", advId: "27012",
    images: [{ src: img(4), alt: "Hotel deal" }],
    priceLabel: "Flat \u20b92,000 off",
    title: "Flat \u20b92,000 Off on Goa Beach Resort Bookings",
    detailsLabel: "OFFER \u2022 TRAVEL \u2022 DELHI",
    locationLabel: "Gurugram, Delhi/NCR",
    postedAt: daysAgo(2),
    description: "<p>Book any partner beach resort in Goa for 2+ nights and get a flat \u20b92,000 discount on your total booking.</p>",
    keyDetails: [
      { key: "Discount", value: "Flat \u20b92,000 off" },
      { key: "Minimum Stay", value: "2 nights" },
    ],
    goodToKnow: [
      { key: "Location", value: "Select Goa resorts" },
    ],
    coordinates: { lat: 28.4595, lng: 77.0266 },
    seller: SELLERS.makeMyDealsIndia,
  },
];

// ── retail_shopping ─────────────────────────────────────────────────────────────
export const IN_OFFERS_RETAIL_SHOPPING: MockListing[] = [
  {
    id: "offers-in-retail-01", href: "/listings/offers-in-retail-01", advId: "27021",
    images: [{ src: img(5), alt: "Weekend sale" }],
    priceLabel: "Up to 50% off",
    title: "Weekend Mega Sale \u2014 Up to 50% Off on Apparel & Home",
    detailsLabel: "OFFER \u2022 RETAIL \u2022 MUMBAI",
    locationLabel: "Andheri, Mumbai",
    postedAt: hrsAgo(6),
    description: "<p>Massive weekend sale across apparel, home decor, and kitchenware categories \u2014 discounts up to 50% storewide.</p>",
    keyDetails: [
      { key: "Discount", value: "Up to 50% off" },
      { key: "Categories", value: "Apparel, home, kitchenware" },
    ],
    goodToKnow: [
      { key: "Valid", value: "This weekend only" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8468 },
    seller: SELLERS.bigBazaarDeals,
  },
  {
    id: "offers-in-retail-02", href: "/listings/offers-in-retail-02", advId: "27022",
    images: [{ src: img(6), alt: "Buy one get one" }],
    priceLabel: "Buy 1 Get 1 Free",
    title: "Buy 1 Get 1 Free on Select Grocery Items",
    detailsLabel: "OFFER \u2022 RETAIL \u2022 MUMBAI",
    locationLabel: "Andheri, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Buy one, get one free on select grocery staples including rice, pulses, and cooking oil this month.</p>",
    keyDetails: [
      { key: "Offer", value: "Buy 1 Get 1 Free" },
    ],
    goodToKnow: [
      { key: "Applicable", value: "Select SKUs only" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8468 },
    seller: SELLERS.bigBazaarDeals,
  },
];

// ── food_dining ────────────────────────────────────────────────────────────────
export const IN_OFFERS_FOOD_DINING: MockListing[] = [
  {
    id: "offers-in-food-01", href: "/listings/offers-in-food-01", advId: "27031",
    images: [{ src: img(7), alt: "Food delivery discount" }],
    priceLabel: "Flat 40% off",
    title: "Flat 40% Off on First 3 Orders \u2014 New Users",
    detailsLabel: "OFFER \u2022 FOOD DELIVERY \u2022 BENGALURU",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: hrsAgo(1),
    description: "<p>New users get a flat 40% discount (up to \u20b9120) on their first 3 orders across all partner restaurants.</p>",
    keyDetails: [
      { key: "Discount", value: "40% off, up to \u20b9120" },
      { key: "Eligible", value: "New users only" },
    ],
    goodToKnow: [
      { key: "Orders", value: "Applies to first 3 orders" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.swiggyOffersHub,
  },
  {
    id: "offers-in-food-02", href: "/listings/offers-in-food-02", advId: "27032",
    images: [{ src: img(8), alt: "Free delivery" }],
    priceLabel: "Free delivery",
    title: "Free Delivery on Orders Above \u20b9199 \u2014 This Week",
    detailsLabel: "OFFER \u2022 FOOD DELIVERY \u2022 BENGALURU",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Enjoy free delivery on all orders above \u20b9199 across partner restaurants for a limited time this week.</p>",
    keyDetails: [
      { key: "Minimum Order", value: "\u20b9199" },
    ],
    goodToKnow: [
      { key: "Valid Till", value: "End of this week" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.swiggyOffersHub,
  },
];

// ── electronics_gadgets ──────────────────────────────────────────────────────────
export const IN_OFFERS_ELECTRONICS_GADGETS: MockListing[] = [
  {
    id: "offers-in-electronics-01", href: "/listings/offers-in-electronics-01", advId: "27041",
    images: [{ src: img(9), alt: "Laptop exchange offer" }],
    priceLabel: "Up to \u20b98,000 exchange bonus",
    title: "Laptop Exchange Offer \u2014 Extra \u20b98,000 Bonus on Old Devices",
    detailsLabel: "OFFER \u2022 ELECTRONICS \u2022 MUMBAI",
    locationLabel: "Powai, Mumbai",
    postedAt: hrsAgo(5),
    description: "<p>Trade in your old laptop and get an additional exchange bonus of up to \u20b98,000 on top of the standard exchange value.</p>",
    keyDetails: [
      { key: "Bonus", value: "Up to \u20b98,000 extra" },
    ],
    goodToKnow: [
      { key: "Applicable", value: "Select laptop models" },
    ],
    coordinates: { lat: 19.1176, lng: 72.9060 },
    seller: SELLERS.cromaDealsIndia,
  },
  {
    id: "offers-in-electronics-02", href: "/listings/offers-in-electronics-02", advId: "27042",
    images: [{ src: img(1), alt: "No cost EMI" }],
    priceLabel: "No cost EMI",
    title: "No Cost EMI on Smartphones Above \u20b920,000",
    detailsLabel: "OFFER \u2022 ELECTRONICS \u2022 MUMBAI",
    locationLabel: "Powai, Mumbai",
    postedAt: daysAgo(2),
    description: "<p>Purchase any smartphone priced above \u20b920,000 with no-cost EMI options for up to 12 months.</p>",
    keyDetails: [
      { key: "EMI Tenure", value: "Up to 12 months" },
    ],
    goodToKnow: [
      { key: "Minimum Price", value: "\u20b920,000" },
    ],
    coordinates: { lat: 19.1176, lng: 72.9060 },
    seller: SELLERS.cromaDealsIndia,
  },
];

// ── health_wellness ───────────────────────────────────────────────────────────────
export const IN_OFFERS_HEALTH_WELLNESS: MockListing[] = [
  {
    id: "offers-in-health-01", href: "/listings/offers-in-health-01", advId: "27051",
    images: [{ src: img(2), alt: "Gym membership offer" }],
    priceLabel: "3 months at price of 2",
    title: "Annual Gym Membership \u2014 Get 3 Months Free",
    detailsLabel: "OFFER \u2022 WELLNESS \u2022 BENGALURU",
    locationLabel: "HSR Layout, Bengaluru",
    postedAt: hrsAgo(9),
    description: "<p>Sign up for an annual gym membership this month and get 3 additional months absolutely free.</p>",
    keyDetails: [
      { key: "Offer", value: "3 months free with annual plan" },
    ],
    goodToKnow: [
      { key: "Valid Till", value: "End of this month" },
    ],
    coordinates: { lat: 12.9121, lng: 77.6446 },
    seller: SELLERS.cultFitOffers,
  },
  {
    id: "offers-in-health-02", href: "/listings/offers-in-health-02", advId: "27052",
    images: [{ src: img(3), alt: "Yoga class discount" }],
    priceLabel: "50% off first month",
    title: "50% Off First Month of Yoga & Meditation Classes",
    detailsLabel: "OFFER \u2022 WELLNESS \u2022 BENGALURU",
    locationLabel: "HSR Layout, Bengaluru",
    postedAt: daysAgo(3),
    description: "<p>New members get 50% off their first month of unlimited yoga and meditation classes.</p>",
    keyDetails: [
      { key: "Discount", value: "50% off first month" },
    ],
    goodToKnow: [
      { key: "Eligibility", value: "New members only" },
    ],
    coordinates: { lat: 12.9121, lng: 77.6446 },
    seller: SELLERS.cultFitOffers,
  },
];

// ── education_learning ───────────────────────────────────────────────────────────
export const IN_OFFERS_EDUCATION_LEARNING: MockListing[] = [
  {
    id: "offers-in-education-01", href: "/listings/offers-in-education-01", advId: "27061",
    images: [{ src: img(4), alt: "Course discount" }],
    priceLabel: "40% off annual plan",
    title: "40% Off Annual Learning Plan \u2014 Grades 6-12",
    detailsLabel: "OFFER \u2022 EDUCATION \u2022 BENGALURU",
    locationLabel: "Whitefield, Bengaluru",
    postedAt: hrsAgo(12),
    description: "<p>Get 40% off the annual subscription plan for grades 6-12, covering all major subjects and doubt-solving sessions.</p>",
    keyDetails: [
      { key: "Discount", value: "40% off annual plan" },
      { key: "Grades", value: "6-12" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Doubt-solving sessions" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.byjusOffersDesk,
  },
  {
    id: "offers-in-education-02", href: "/listings/offers-in-education-02", advId: "27062",
    images: [{ src: img(5), alt: "Free trial" }],
    priceLabel: "14-day free trial",
    title: "14-Day Free Trial \u2014 All Courses Unlocked",
    detailsLabel: "OFFER \u2022 EDUCATION \u2022 BENGALURU",
    locationLabel: "Whitefield, Bengaluru",
    postedAt: daysAgo(4),
    description: "<p>Try any course free for 14 days with full access to video lessons, practice tests, and live doubt sessions.</p>",
    keyDetails: [
      { key: "Trial Period", value: "14 days" },
    ],
    goodToKnow: [
      { key: "Cancellation", value: "Cancel anytime during trial" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.byjusOffersDesk,
  },
];

// ── holiday_seasonal ──────────────────────────────────────────────────────────────
export const IN_OFFERS_HOLIDAY_SEASONAL: MockListing[] = [
  {
    id: "offers-in-holiday-01", href: "/listings/offers-in-holiday-01", advId: "27071",
    images: [{ src: img(6), alt: "Diwali sale" }],
    priceLabel: "Up to 60% off",
    title: "Diwali Mega Sale \u2014 Up to 60% Off Storewide",
    detailsLabel: "OFFER \u2022 SEASONAL \u2022 DELHI",
    locationLabel: "Connaught Place, Delhi",
    postedAt: hrsAgo(3),
    description: "<p>Our biggest sale of the year is here \u2014 up to 60% off across all categories for the Diwali season.</p>",
    keyDetails: [
      { key: "Discount", value: "Up to 60% off" },
    ],
    goodToKnow: [
      { key: "Duration", value: "2 weeks, Diwali season" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    seller: SELLERS.festiveDealsIndia,
  },
  {
    id: "offers-in-holiday-02", href: "/listings/offers-in-holiday-02", advId: "27072",
    images: [{ src: img(7), alt: "New year sale" }],
    priceLabel: "Flat 25% off",
    title: "New Year Clearance Sale \u2014 Flat 25% Off Everything",
    detailsLabel: "OFFER \u2022 SEASONAL \u2022 DELHI",
    locationLabel: "Connaught Place, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Ring in the new year with a flat 25% discount storewide, no minimum purchase required.</p>",
    keyDetails: [
      { key: "Discount", value: "Flat 25% off" },
    ],
    goodToKnow: [
      { key: "Minimum Purchase", value: "None" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    seller: SELLERS.festiveDealsIndia,
  },
];

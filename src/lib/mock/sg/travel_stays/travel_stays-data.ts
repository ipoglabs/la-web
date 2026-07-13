import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── holiday_rentals ──────────────────────────────────────────────────────────────
export const SG_TRAVEL_HOLIDAY_RENTALS: MockListing[] = [
  {
    id: "travel-sg-rentals-01", href: "/listings/travel-sg-rentals-01", advId: "41001",
    images: [{ src: img(1), alt: "Beachfront villa" }],
    priceLabel: "S$450", priceSuffix: "/ night",
    title: "Beachfront Villa \u2014 3BR, Private Pool, Sentosa",
    detailsLabel: "HOLIDAY RENTAL \u2022 VILLA \u2022 SENTOSA",
    locationLabel: "Sentosa, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Spacious 3-bedroom beachfront villa with a private pool, just 2 minutes walk from Palawan Beach. Fully furnished with modern amenities.</p>",
    keyDetails: [
      { key: "Bedrooms", value: "3" },
      { key: "Amenities", value: "Private pool, AC" },
    ],
    goodToKnow: [
      { key: "Min. Stay", value: "2 nights" },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.sentosaHolidayRentalsSG,
  },
  {
    id: "travel-sg-rentals-02", href: "/listings/travel-sg-rentals-02", advId: "41002",
    images: [{ src: img(2), alt: "Beach apartment" }],
    priceLabel: "S$180", priceSuffix: "/ night",
    title: "Cozy Beach Apartment \u2014 1BR, Walking Distance to Beach",
    detailsLabel: "HOLIDAY RENTAL \u2022 APARTMENT \u2022 SENTOSA",
    locationLabel: "Sentosa, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Comfortable 1-bedroom apartment just a short walk from the beach, ideal for couples or solo travelers.</p>",
    keyDetails: [
      { key: "Bedrooms", value: "1" },
    ],
    goodToKnow: [
      { key: "Min. Stay", value: "1 night" },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.sentosaHolidayRentalsSG,
  },
];

// ── hotels_guesthouses ──────────────────────────────────────────────────────────────
export const SG_TRAVEL_HOTELS_GUESTHOUSES: MockListing[] = [
  {
    id: "travel-sg-guesthouse-01", href: "/listings/travel-sg-guesthouse-01", advId: "41011",
    images: [{ src: img(3), alt: "Peranakan guesthouse" }],
    priceLabel: "S$120", priceSuffix: "/ night",
    title: "Peranakan Heritage Guesthouse \u2014 AC Room, Breakfast Included",
    detailsLabel: "GUESTHOUSE \u2022 STAY \u2022 SINGAPORE",
    locationLabel: "Joo Chiat, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Charming heritage guesthouse in a restored Peranakan shophouse, with AC rooms and complimentary breakfast.</p>",
    keyDetails: [
      { key: "Room Type", value: "AC, heritage shophouse" },
      { key: "Meals", value: "Breakfast included" },
    ],
    goodToKnow: [
      { key: "Style", value: "Peranakan heritage" },
    ],
    coordinates: { lat: 1.3131, lng: 103.9046 },
    seller: SELLERS.boutiqueGuesthouseSG,
  },
  {
    id: "travel-sg-guesthouse-02", href: "/listings/travel-sg-guesthouse-02", advId: "41012",
    images: [{ src: img(4), alt: "Budget guesthouse" }],
    priceLabel: "S$70", priceSuffix: "/ night",
    title: "Budget Guesthouse Room \u2014 Fan Room, Near MRT",
    detailsLabel: "GUESTHOUSE \u2022 STAY \u2022 SINGAPORE",
    locationLabel: "Joo Chiat, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Affordable fan-cooled guesthouse room within walking distance of the nearest MRT station, ideal for budget travelers.</p>",
    keyDetails: [
      { key: "Room Type", value: "Fan room" },
    ],
    goodToKnow: [
      { key: "Location", value: "5 min walk to MRT" },
    ],
    coordinates: { lat: 1.3131, lng: 103.9046 },
    seller: SELLERS.boutiqueGuesthouseSG,
  },
];

// ── tour_packages ──────────────────────────────────────────────────────────────
export const SG_TRAVEL_TOUR_PACKAGES: MockListing[] = [
  {
    id: "travel-sg-tourpackage-01", href: "/listings/travel-sg-tourpackage-01", advId: "41021",
    images: [{ src: img(5), alt: "Bali tour" }],
    priceLabel: "S$650", priceSuffix: "/ person",
    title: "5-Day Bali Explorer Package \u2014 Guided, Breakfast Included",
    detailsLabel: "TOUR PACKAGE \u2022 REGIONAL \u2022 INDONESIA",
    locationLabel: "Bugis, Singapore",
    postedAt: hrsAgo(7),
    description: "<p>5-day guided Bali tour package including breakfast, temple visits, and an experienced local guide.</p>",
    keyDetails: [
      { key: "Duration", value: "5 days" },
      { key: "Includes", value: "Breakfast + guide" },
    ],
    goodToKnow: [
      { key: "Departure", value: "From Singapore" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.regionTourSG,
  },
  {
    id: "travel-sg-tourpackage-02", href: "/listings/travel-sg-tourpackage-02", advId: "41022",
    images: [{ src: img(6), alt: "River rafting tour" }],
    priceLabel: "S$95", priceSuffix: "/ person",
    title: "River Rafting Day Tour \u2014 Bali, Beginner Friendly",
    detailsLabel: "TOUR PACKAGE \u2022 ADVENTURE \u2022 INDONESIA",
    locationLabel: "Bugis, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Beginner-friendly river rafting day tour in Bali, including safety gear and professional guide.</p>",
    keyDetails: [
      { key: "Level", value: "Beginner friendly" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Safety gear + guide" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.regionTourSG,
  },
];

// ── staycations ──────────────────────────────────────────────────────────────
export const SG_TRAVEL_STAYCATIONS: MockListing[] = [
  {
    id: "travel-sg-staycation-01", href: "/listings/travel-sg-staycation-01", advId: "41031",
    images: [{ src: img(7), alt: "Resort staycation" }],
    priceLabel: "S$380", priceSuffix: "/ package",
    title: "Weekend Staycation \u2014 Marina Bay Resort with Pool, 2 Nights",
    detailsLabel: "STAYCATION \u2022 RESORT \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>2-night weekend staycation package at a Marina Bay resort with pool access and breakfast included.</p>",
    keyDetails: [
      { key: "Duration", value: "2 nights" },
      { key: "Includes", value: "Pool access + breakfast" },
    ],
    goodToKnow: [
      { key: "Booking", value: "Weekend dates only" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8607 },
    seller: SELLERS.staycationDealsSG,
  },
  {
    id: "travel-sg-staycation-02", href: "/listings/travel-sg-staycation-02", advId: "41032",
    images: [{ src: img(8), alt: "Spa staycation" }],
    priceLabel: "S$520", priceSuffix: "/ package",
    title: "Spa & Wellness Staycation \u2014 2 Nights, Couples Package",
    detailsLabel: "STAYCATION \u2022 WELLNESS \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Relaxing couples staycation with spa treatments, wellness activities, and a stunning bay-view stay.</p>",
    keyDetails: [
      { key: "Duration", value: "2 nights" },
    ],
    goodToKnow: [
      { key: "Includes", value: "1 spa session per person" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8607 },
    seller: SELLERS.staycationDealsSG,
  },
];

// ── travel_services ──────────────────────────────────────────────────────────────
export const SG_TRAVEL_SERVICES: MockListing[] = [
  {
    id: "travel-sg-services-01", href: "/listings/travel-sg-services-01", advId: "41041",
    images: [{ src: img(9), alt: "Visa assistance" }],
    priceLabel: "S$120", priceSuffix: "/ application",
    title: "Schengen Visa Assistance \u2014 Document Prep & Appointment Booking",
    detailsLabel: "TRAVEL SERVICE \u2022 VISA \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: hrsAgo(11),
    description: "<p>Complete Schengen visa assistance including document preparation, form filling, and appointment booking support.</p>",
    keyDetails: [
      { key: "Visa Type", value: "Schengen" },
    ],
    goodToKnow: [
      { key: "Turnaround", value: "5-7 business days" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.travelServicesSG,
  },
  {
    id: "travel-sg-services-02", href: "/listings/travel-sg-services-02", advId: "41042",
    images: [{ src: img(1), alt: "Itinerary planning" }],
    priceLabel: "S$60", priceSuffix: "/ itinerary",
    title: "Custom Travel Itinerary Planning \u2014 Any Destination",
    detailsLabel: "TRAVEL SERVICE \u2022 PLANNING \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Personalised travel itinerary planning service covering accommodation, activities, and local transport for any destination.</p>",
    keyDetails: [
      { key: "Scope", value: "Any destination worldwide" },
    ],
    goodToKnow: [
      { key: "Turnaround", value: "3 business days" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.travelServicesSG,
  },
];

// ── travel_accessories ──────────────────────────────────────────────────────────────
export const SG_TRAVEL_ACCESSORIES: MockListing[] = [
  {
    id: "travel-sg-accessories-01", href: "/listings/travel-sg-accessories-01", advId: "41051",
    images: [{ src: img(2), alt: "Travel backpack" }],
    priceLabel: "S$140",
    title: "60L Travel Backpack \u2014 Rain Cover Included, Barely Used",
    detailsLabel: "TRAVEL ACCESSORIES \u2022 BACKPACK \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: hrsAgo(13),
    description: "<p>60-litre travel backpack with multiple compartments and rain cover, used for one trek trip only.</p>",
    keyDetails: [
      { key: "Capacity", value: "60L" },
      { key: "Condition", value: "Barely used" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Rain cover" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.travelGearSG,
  },
  {
    id: "travel-sg-accessories-02", href: "/listings/travel-sg-accessories-02", advId: "41052",
    images: [{ src: img(3), alt: "Cabin luggage" }],
    priceLabel: "S$100",
    title: "Hard-Shell Cabin Luggage \u2014 4-Wheel, TSA Lock",
    detailsLabel: "TRAVEL ACCESSORIES \u2022 LUGGAGE \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: daysAgo(4),
    description: "<p>Durable hard-shell cabin luggage with 360-degree wheels and TSA-approved lock, cabin-size compliant.</p>",
    keyDetails: [
      { key: "Size", value: "Cabin (55cm)" },
    ],
    goodToKnow: [
      { key: "Lock", value: "TSA-approved" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.travelGearSG,
  },
];

import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── holiday_rentals ──────────────────────────────────────────────────────────────
export const IN_TRAVEL_HOLIDAY_RENTALS: MockListing[] = [
  {
    id: "travel-in-rentals-01", href: "/listings/travel-in-rentals-01", advId: "31001",
    images: [{ src: img(1), alt: "Beachfront villa" }],
    priceLabel: "\u20b98,500", priceSuffix: "/ night",
    title: "Beachfront Villa \u2014 3BHK, Private Pool, Calangute",
    detailsLabel: "HOLIDAY RENTAL \u2022 VILLA \u2022 GOA",
    locationLabel: "Calangute, Goa",
    postedAt: hrsAgo(3),
    description: "<p>Spacious 3BHK beachfront villa with a private pool, just 2 minutes walk from Calangute Beach. Fully furnished with modern amenities.</p>",
    keyDetails: [
      { key: "Bedrooms", value: "3" },
      { key: "Amenities", value: "Private pool, AC" },
    ],
    goodToKnow: [
      { key: "Min. Stay", value: "2 nights" },
    ],
    coordinates: { lat: 15.5439, lng: 73.7553 },
    seller: SELLERS.goaHolidayRentalsIndia,
  },
  {
    id: "travel-in-rentals-02", href: "/listings/travel-in-rentals-02", advId: "31002",
    images: [{ src: img(2), alt: "Beach apartment" }],
    priceLabel: "\u20b93,500", priceSuffix: "/ night",
    title: "Cozy Beach Apartment \u2014 1BHK, Walking Distance to Beach",
    detailsLabel: "HOLIDAY RENTAL \u2022 APARTMENT \u2022 GOA",
    locationLabel: "Calangute, Goa",
    postedAt: daysAgo(1),
    description: "<p>Comfortable 1BHK apartment just a short walk from the beach, ideal for couples or solo travelers.</p>",
    keyDetails: [
      { key: "Bedrooms", value: "1" },
    ],
    goodToKnow: [
      { key: "Min. Stay", value: "1 night" },
    ],
    coordinates: { lat: 15.5439, lng: 73.7553 },
    seller: SELLERS.goaHolidayRentalsIndia,
  },
];

// ── hotels_guesthouses ──────────────────────────────────────────────────────────────
export const IN_TRAVEL_HOTELS_GUESTHOUSES: MockListing[] = [
  {
    id: "travel-in-guesthouse-01", href: "/listings/travel-in-guesthouse-01", advId: "31011",
    images: [{ src: img(3), alt: "Backwater guesthouse" }],
    priceLabel: "\u20b92,800", priceSuffix: "/ night",
    title: "Backwater View Guesthouse \u2014 AC Room, Breakfast Included",
    detailsLabel: "GUESTHOUSE \u2022 STAY \u2022 KERALA",
    locationLabel: "Alleppey, Kerala",
    postedAt: hrsAgo(5),
    description: "<p>Peaceful guesthouse with backwater views, AC rooms, and complimentary breakfast. Houseboat bookings can be arranged.</p>",
    keyDetails: [
      { key: "Room Type", value: "AC, backwater view" },
      { key: "Meals", value: "Breakfast included" },
    ],
    goodToKnow: [
      { key: "Add-on", value: "Houseboat bookings available" },
    ],
    coordinates: { lat: 9.4981, lng: 76.3388 },
    seller: SELLERS.keralaGuesthouseIndia,
  },
  {
    id: "travel-in-guesthouse-02", href: "/listings/travel-in-guesthouse-02", advId: "31012",
    images: [{ src: img(4), alt: "Budget guesthouse" }],
    priceLabel: "\u20b91,500", priceSuffix: "/ night",
    title: "Budget Guesthouse \u2014 Fan Room, Near Boat Jetty",
    detailsLabel: "GUESTHOUSE \u2022 STAY \u2022 KERALA",
    locationLabel: "Alleppey, Kerala",
    postedAt: daysAgo(2),
    description: "<p>Affordable fan-cooled guesthouse room within walking distance of the main boat jetty, ideal for budget travelers.</p>",
    keyDetails: [
      { key: "Room Type", value: "Fan room" },
    ],
    goodToKnow: [
      { key: "Location", value: "5 min walk to jetty" },
    ],
    coordinates: { lat: 9.4981, lng: 76.3388 },
    seller: SELLERS.keralaGuesthouseIndia,
  },
];

// ── tour_packages ──────────────────────────────────────────────────────────────
export const IN_TRAVEL_TOUR_PACKAGES: MockListing[] = [
  {
    id: "travel-in-tourpackage-01", href: "/listings/travel-in-tourpackage-01", advId: "31021",
    images: [{ src: img(5), alt: "Himalayan trek" }],
    priceLabel: "\u20b915,000", priceSuffix: "/ person",
    title: "5-Day Himalayan Trek Package \u2014 Guided, All Meals Included",
    detailsLabel: "TOUR PACKAGE \u2022 TREKKING \u2022 HIMACHAL PRADESH",
    locationLabel: "Manali, Himachal Pradesh",
    postedAt: hrsAgo(7),
    description: "<p>5-day guided Himalayan trek package including all meals, camping equipment, and an experienced trek leader.</p>",
    keyDetails: [
      { key: "Duration", value: "5 days" },
      { key: "Includes", value: "Meals + equipment" },
    ],
    goodToKnow: [
      { key: "Fitness Level", value: "Moderate to high" },
    ],
    coordinates: { lat: 32.2432, lng: 77.1892 },
    seller: SELLERS.himalayanTourIndia,
  },
  {
    id: "travel-in-tourpackage-02", href: "/listings/travel-in-tourpackage-02", advId: "31022",
    images: [{ src: img(6), alt: "River rafting tour" }],
    priceLabel: "\u20b92,500", priceSuffix: "/ person",
    title: "River Rafting Day Tour \u2014 Beas River, Beginner Friendly",
    detailsLabel: "TOUR PACKAGE \u2022 ADVENTURE \u2022 HIMACHAL PRADESH",
    locationLabel: "Manali, Himachal Pradesh",
    postedAt: daysAgo(1),
    description: "<p>Beginner-friendly river rafting day tour on the Beas River, including safety gear and professional guide.</p>",
    keyDetails: [
      { key: "Level", value: "Beginner friendly" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Safety gear + guide" },
    ],
    coordinates: { lat: 32.2432, lng: 77.1892 },
    seller: SELLERS.himalayanTourIndia,
  },
];

// ── staycations ──────────────────────────────────────────────────────────────
export const IN_TRAVEL_STAYCATIONS: MockListing[] = [
  {
    id: "travel-in-staycation-01", href: "/listings/travel-in-staycation-01", advId: "31031",
    images: [{ src: img(7), alt: "Resort staycation" }],
    priceLabel: "\u20b96,500", priceSuffix: "/ package",
    title: "Weekend Staycation \u2014 Resort with Pool, 2 Nights",
    detailsLabel: "STAYCATION \u2022 RESORT \u2022 LONAVALA",
    locationLabel: "Lonavala, Maharashtra",
    postedAt: hrsAgo(9),
    description: "<p>2-night weekend staycation package at a hill-view resort with pool access and breakfast included.</p>",
    keyDetails: [
      { key: "Duration", value: "2 nights" },
      { key: "Includes", value: "Pool access + breakfast" },
    ],
    goodToKnow: [
      { key: "Booking", value: "Weekend dates only" },
    ],
    coordinates: { lat: 18.7546, lng: 73.4062 },
    seller: SELLERS.staycationDealsIndia,
  },
  {
    id: "travel-in-staycation-02", href: "/listings/travel-in-staycation-02", advId: "31032",
    images: [{ src: img(8), alt: "Spa staycation" }],
    priceLabel: "\u20b99,500", priceSuffix: "/ package",
    title: "Spa & Wellness Staycation \u2014 2 Nights, Couples Package",
    detailsLabel: "STAYCATION \u2022 WELLNESS \u2022 LONAVALA",
    locationLabel: "Lonavala, Maharashtra",
    postedAt: daysAgo(2),
    description: "<p>Relaxing couples staycation with spa treatments, wellness activities, and a scenic hill-view stay.</p>",
    keyDetails: [
      { key: "Duration", value: "2 nights" },
    ],
    goodToKnow: [
      { key: "Includes", value: "1 spa session per person" },
    ],
    coordinates: { lat: 18.7546, lng: 73.4062 },
    seller: SELLERS.staycationDealsIndia,
  },
];

// ── travel_services ──────────────────────────────────────────────────────────────
export const IN_TRAVEL_SERVICES: MockListing[] = [
  {
    id: "travel-in-services-01", href: "/listings/travel-in-services-01", advId: "31041",
    images: [{ src: img(9), alt: "Visa assistance" }],
    priceLabel: "\u20b93,000", priceSuffix: "/ application",
    title: "Schengen Visa Assistance \u2014 Document Prep & Appointment Booking",
    detailsLabel: "TRAVEL SERVICE \u2022 VISA \u2022 DELHI",
    locationLabel: "Connaught Place, Delhi",
    postedAt: hrsAgo(11),
    description: "<p>Complete Schengen visa assistance including document preparation, form filling, and appointment booking support.</p>",
    keyDetails: [
      { key: "Visa Type", value: "Schengen" },
    ],
    goodToKnow: [
      { key: "Turnaround", value: "5-7 business days" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    seller: SELLERS.travelServicesIndia,
  },
  {
    id: "travel-in-services-02", href: "/listings/travel-in-services-02", advId: "31042",
    images: [{ src: img(1), alt: "Itinerary planning" }],
    priceLabel: "\u20b91,500", priceSuffix: "/ itinerary",
    title: "Custom Travel Itinerary Planning \u2014 Any Destination",
    detailsLabel: "TRAVEL SERVICE \u2022 PLANNING \u2022 DELHI",
    locationLabel: "Connaught Place, Delhi",
    postedAt: daysAgo(3),
    description: "<p>Personalised travel itinerary planning service covering accommodation, activities, and local transport for any destination.</p>",
    keyDetails: [
      { key: "Scope", value: "Any destination worldwide" },
    ],
    goodToKnow: [
      { key: "Turnaround", value: "3 business days" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    seller: SELLERS.travelServicesIndia,
  },
];

// ── travel_accessories ──────────────────────────────────────────────────────────────
export const IN_TRAVEL_ACCESSORIES: MockListing[] = [
  {
    id: "travel-in-accessories-01", href: "/listings/travel-in-accessories-01", advId: "31051",
    images: [{ src: img(2), alt: "Travel backpack" }],
    priceLabel: "\u20b94,200",
    title: "60L Travel Backpack \u2014 Rain Cover Included, Barely Used",
    detailsLabel: "TRAVEL ACCESSORIES \u2022 BACKPACK \u2022 BENGALURU",
    locationLabel: "Commercial Street, Bengaluru",
    postedAt: hrsAgo(13),
    description: "<p>60-litre travel backpack with multiple compartments and rain cover, used for one trek trip only.</p>",
    keyDetails: [
      { key: "Capacity", value: "60L" },
      { key: "Condition", value: "Barely used" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Rain cover" },
    ],
    coordinates: { lat: 12.9829, lng: 77.6079 },
    seller: SELLERS.travelGearIndia,
  },
  {
    id: "travel-in-accessories-02", href: "/listings/travel-in-accessories-02", advId: "31052",
    images: [{ src: img(3), alt: "Cabin luggage" }],
    priceLabel: "\u20b93,000",
    title: "Hard-Shell Cabin Luggage \u2014 4-Wheel, TSA Lock",
    detailsLabel: "TRAVEL ACCESSORIES \u2022 LUGGAGE \u2022 BENGALURU",
    locationLabel: "Commercial Street, Bengaluru",
    postedAt: daysAgo(4),
    description: "<p>Durable hard-shell cabin luggage with 360-degree wheels and TSA-approved lock, cabin-size compliant.</p>",
    keyDetails: [
      { key: "Size", value: "Cabin (55cm)" },
    ],
    goodToKnow: [
      { key: "Lock", value: "TSA-approved" },
    ],
    coordinates: { lat: 12.9829, lng: 77.6079 },
    seller: SELLERS.travelGearIndia,
  },
];

import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── toys_games ──────────────────────────────────────────────────────────────────
export const IN_KIDS_TOYS_GAMES: MockListing[] = [
  {
    id: "kids-in-toys-01", href: "/listings/kids-in-toys-01", advId: "32001",
    images: [{ src: img(1), alt: "Building blocks set" }],
    priceLabel: "\u20b91,800",
    title: "Educational Building Blocks Set \u2014 250 Pieces, Ages 4+",
    detailsLabel: "TOYS & GAMES \u2022 EDUCATIONAL \u2022 MUMBAI",
    locationLabel: "Malad, Mumbai",
    postedAt: hrsAgo(2),
    description: "<p>250-piece educational building blocks set that encourages creativity and problem-solving, suitable for ages 4 and up.</p>",
    keyDetails: [
      { key: "Pieces", value: "250" },
      { key: "Age Group", value: "4+" },
    ],
    goodToKnow: [
      { key: "Material", value: "BPA-free plastic" },
    ],
    coordinates: { lat: 19.1874, lng: 72.8484 },
    seller: SELLERS.toyBoxIndia,
  },
  {
    id: "kids-in-toys-02", href: "/listings/kids-in-toys-02", advId: "32002",
    images: [{ src: img(2), alt: "Board game" }],
    priceLabel: "\u20b9950",
    title: "Family Board Game Bundle \u2014 3 Games, Ages 6+",
    detailsLabel: "TOYS & GAMES \u2022 BOARD GAMES \u2022 MUMBAI",
    locationLabel: "Malad, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Bundle of 3 family-friendly board games suitable for game nights, ages 6 and up.</p>",
    keyDetails: [
      { key: "Games Included", value: "3" },
    ],
    goodToKnow: [
      { key: "Players", value: "2-6 per game" },
    ],
    coordinates: { lat: 19.1874, lng: 72.8484 },
    seller: SELLERS.toyBoxIndia,
  },
];

// ── baby_gear ──────────────────────────────────────────────────────────────────
export const IN_KIDS_BABY_GEAR: MockListing[] = [
  {
    id: "kids-in-babygear-01", href: "/listings/kids-in-babygear-01", advId: "32011",
    images: [{ src: img(3), alt: "Baby stroller" }],
    priceLabel: "\u20b96,500",
    title: "Foldable Baby Stroller \u2014 Lightweight, Reclining Seat",
    detailsLabel: "BABY GEAR \u2022 STROLLER \u2022 BENGALURU",
    locationLabel: "Jayanagar, Bengaluru",
    postedAt: hrsAgo(4),
    description: "<p>Lightweight foldable stroller with reclining seat and sun canopy, easy to carry while traveling.</p>",
    keyDetails: [
      { key: "Weight", value: "6.5 kg" },
    ],
    goodToKnow: [
      { key: "Recline", value: "3-position" },
    ],
    coordinates: { lat: 12.9250, lng: 77.5938 },
    seller: SELLERS.babyGearIndia,
  },
  {
    id: "kids-in-babygear-02", href: "/listings/kids-in-babygear-02", advId: "32012",
    images: [{ src: img(4), alt: "Car seat" }],
    priceLabel: "\u20b98,900",
    title: "Convertible Baby Car Seat \u2014 Rear & Forward Facing",
    detailsLabel: "BABY GEAR \u2022 CAR SEAT \u2022 BENGALURU",
    locationLabel: "Jayanagar, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Convertible car seat suitable for both rear-facing infants and forward-facing toddlers, ISOFIX compatible.</p>",
    keyDetails: [
      { key: "Compatibility", value: "ISOFIX" },
    ],
    goodToKnow: [
      { key: "Age Range", value: "0-4 years" },
    ],
    coordinates: { lat: 12.9250, lng: 77.5938 },
    seller: SELLERS.babyGearIndia,
  },
];

// ── kids_clothing ──────────────────────────────────────────────────────────────
export const IN_KIDS_CLOTHING: MockListing[] = [
  {
    id: "kids-in-clothing-01", href: "/listings/kids-in-clothing-01", advId: "32021",
    images: [{ src: img(5), alt: "Kids clothing set" }],
    priceLabel: "\u20b91,200",
    title: "Kids Summer Wear Bundle \u2014 5 Sets, Age 4-6",
    detailsLabel: "KIDS CLOTHING \u2022 BUNDLE \u2022 PUNE",
    locationLabel: "Camp, Pune",
    postedAt: hrsAgo(6),
    description: "<p>Bundle of 5 summer wear sets for kids aged 4-6, gently used and in good condition.</p>",
    keyDetails: [
      { key: "Age Group", value: "4-6 years" },
      { key: "Sets", value: "5" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Gently used" },
    ],
    coordinates: { lat: 18.5089, lng: 73.8794 },
    seller: SELLERS.kidsClothingIndia,
  },
  {
    id: "kids-in-clothing-02", href: "/listings/kids-in-clothing-02", advId: "32022",
    images: [{ src: img(6), alt: "Kids ethnic wear" }],
    priceLabel: "\u20b91,500",
    title: "Kids Ethnic Wear Set \u2014 Kurta Pyjama, Age 3-5, New",
    detailsLabel: "KIDS CLOTHING \u2022 ETHNIC \u2022 PUNE",
    locationLabel: "Camp, Pune",
    postedAt: daysAgo(1),
    description: "<p>Brand new ethnic wear set for boys, kurta pyjama style, perfect for festive occasions.</p>",
    keyDetails: [
      { key: "Age Group", value: "3-5 years" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Brand new" },
    ],
    coordinates: { lat: 18.5089, lng: 73.8794 },
    seller: SELLERS.kidsClothingIndia,
  },
];

// ── childcare ──────────────────────────────────────────────────────────────────
export const IN_KIDS_CHILDCARE: MockListing[] = [
  {
    id: "kids-in-childcare-01", href: "/listings/kids-in-childcare-01", advId: "32031",
    images: [{ src: img(7), alt: "Daycare centre" }],
    priceLabel: "\u20b98,000", priceSuffix: "/ mo",
    title: "Full-Day Daycare \u2014 Ages 2-5, Nutritious Meals Included",
    detailsLabel: "CHILDCARE \u2022 DAYCARE \u2022 DELHI",
    locationLabel: "Vasant Kunj, Delhi",
    postedAt: hrsAgo(8),
    description: "<p>Full-day daycare service for children aged 2-5, with nutritious meals, nap time, and structured activities.</p>",
    keyDetails: [
      { key: "Age Group", value: "2-5 years" },
      { key: "Hours", value: "8 AM - 6 PM" },
    ],
    goodToKnow: [
      { key: "Meals", value: "Included" },
    ],
    coordinates: { lat: 28.5245, lng: 77.1590 },
    seller: SELLERS.childcareIndia,
  },
  {
    id: "kids-in-childcare-02", href: "/listings/kids-in-childcare-02", advId: "32032",
    images: [{ src: img(8), alt: "After-school care" }],
    priceLabel: "\u20b94,500", priceSuffix: "/ mo",
    title: "After-School Care Programme \u2014 Homework Help & Snacks",
    detailsLabel: "CHILDCARE \u2022 AFTER-SCHOOL \u2022 DELHI",
    locationLabel: "Vasant Kunj, Delhi",
    postedAt: daysAgo(2),
    description: "<p>After-school care programme with homework assistance, healthy snacks, and supervised play until pickup.</p>",
    keyDetails: [
      { key: "Hours", value: "3 PM - 7 PM" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Homework help + snacks" },
    ],
    coordinates: { lat: 28.5245, lng: 77.1590 },
    seller: SELLERS.childcareIndia,
  },
];

// ── school_supplies ──────────────────────────────────────────────────────────────
export const IN_KIDS_SCHOOL_SUPPLIES: MockListing[] = [
  {
    id: "kids-in-supplies-01", href: "/listings/kids-in-supplies-01", advId: "32041",
    images: [{ src: img(9), alt: "School bag" }],
    priceLabel: "\u20b91,100",
    title: "School Backpack \u2014 Ergonomic Straps, Multiple Compartments",
    detailsLabel: "SCHOOL SUPPLIES \u2022 BAGS \u2022 CHENNAI",
    locationLabel: "Anna Nagar, Chennai",
    postedAt: hrsAgo(10),
    description: "<p>Ergonomic school backpack with padded straps and multiple compartments for books, lunch box, and water bottle.</p>",
    keyDetails: [
      { key: "Compartments", value: "4" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "6 months on zippers" },
    ],
    coordinates: { lat: 13.0850, lng: 80.2101 },
    seller: SELLERS.schoolSuppliesIndia,
  },
  {
    id: "kids-in-supplies-02", href: "/listings/kids-in-supplies-02", advId: "32042",
    images: [{ src: img(1), alt: "Stationery kit" }],
    priceLabel: "\u20b9450",
    title: "Complete Stationery Kit \u2014 Notebooks, Pens, Geometry Box",
    detailsLabel: "SCHOOL SUPPLIES \u2022 STATIONERY \u2022 CHENNAI",
    locationLabel: "Anna Nagar, Chennai",
    postedAt: daysAgo(1),
    description: "<p>Complete stationery kit including notebooks, pens, pencils, and a geometry box for the new school term.</p>",
    keyDetails: [
      { key: "Includes", value: "Notebooks + pens + geometry box" },
    ],
    goodToKnow: [
      { key: "Suitable For", value: "Grades 4-8" },
    ],
    coordinates: { lat: 13.0850, lng: 80.2101 },
    seller: SELLERS.schoolSuppliesIndia,
  },
];

// ── kids_activities ──────────────────────────────────────────────────────────────
export const IN_KIDS_ACTIVITIES: MockListing[] = [
  {
    id: "kids-in-activities-01", href: "/listings/kids-in-activities-01", advId: "32051",
    images: [{ src: img(2), alt: "Art workshop" }],
    priceLabel: "\u20b9800", priceSuffix: "/ session",
    title: "Weekend Art & Craft Workshop \u2014 Ages 5-10",
    detailsLabel: "KIDS ACTIVITY \u2022 ART \u2022 BENGALURU",
    locationLabel: "HSR Layout, Bengaluru",
    postedAt: hrsAgo(12),
    description: "<p>Fun weekend art and craft workshop for kids aged 5-10, covering painting, collage, and simple crafts.</p>",
    keyDetails: [
      { key: "Age Group", value: "5-10 years" },
    ],
    goodToKnow: [
      { key: "Materials", value: "All supplies included" },
    ],
    coordinates: { lat: 12.9121, lng: 77.6446 },
    seller: SELLERS.kidsActivitiesIndia,
  },
  {
    id: "kids-in-activities-02", href: "/listings/kids-in-activities-02", advId: "32052",
    images: [{ src: img(3), alt: "Sports camp" }],
    priceLabel: "\u20b91,200", priceSuffix: "/ week",
    title: "Kids Summer Sports Camp \u2014 Football & Basketball",
    detailsLabel: "KIDS ACTIVITY \u2022 SPORTS \u2022 BENGALURU",
    locationLabel: "HSR Layout, Bengaluru",
    postedAt: daysAgo(3),
    description: "<p>Week-long summer sports camp for kids featuring football and basketball training with certified coaches.</p>",
    keyDetails: [
      { key: "Duration", value: "1 week" },
    ],
    goodToKnow: [
      { key: "Coaching", value: "Certified coaches" },
    ],
    coordinates: { lat: 12.9121, lng: 77.6446 },
    seller: SELLERS.kidsActivitiesIndia,
  },
];

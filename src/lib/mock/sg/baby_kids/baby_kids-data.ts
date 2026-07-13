import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── toys_games ──────────────────────────────────────────────────────────────────
export const SG_KIDS_TOYS_GAMES: MockListing[] = [
  {
    id: "kids-sg-toys-01", href: "/listings/kids-sg-toys-01", advId: "42001",
    images: [{ src: img(1), alt: "Building blocks set" }],
    priceLabel: "S$60",
    title: "Educational Building Blocks Set \u2014 250 Pieces, Ages 4+",
    detailsLabel: "TOYS & GAMES \u2022 EDUCATIONAL \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>250-piece educational building blocks set that encourages creativity and problem-solving, suitable for ages 4 and up.</p>",
    keyDetails: [
      { key: "Pieces", value: "250" },
      { key: "Age Group", value: "4+" },
    ],
    goodToKnow: [
      { key: "Material", value: "BPA-free plastic" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.toyBoxSG,
  },
  {
    id: "kids-sg-toys-02", href: "/listings/kids-sg-toys-02", advId: "42002",
    images: [{ src: img(2), alt: "Board game" }],
    priceLabel: "S$32",
    title: "Family Board Game Bundle \u2014 3 Games, Ages 6+",
    detailsLabel: "TOYS & GAMES \u2022 BOARD GAMES \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Bundle of 3 family-friendly board games suitable for game nights, ages 6 and up.</p>",
    keyDetails: [
      { key: "Games Included", value: "3" },
    ],
    goodToKnow: [
      { key: "Players", value: "2-6 per game" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.toyBoxSG,
  },
];

// ── baby_gear ──────────────────────────────────────────────────────────────────
export const SG_KIDS_BABY_GEAR: MockListing[] = [
  {
    id: "kids-sg-babygear-01", href: "/listings/kids-sg-babygear-01", advId: "42011",
    images: [{ src: img(3), alt: "Baby stroller" }],
    priceLabel: "S$220",
    title: "Foldable Baby Stroller \u2014 Lightweight, Reclining Seat",
    detailsLabel: "BABY GEAR \u2022 STROLLER \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Lightweight foldable stroller with reclining seat and sun canopy, easy to carry while traveling.</p>",
    keyDetails: [
      { key: "Weight", value: "6.5 kg" },
    ],
    goodToKnow: [
      { key: "Recline", value: "3-position" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.babyGearSG,
  },
  {
    id: "kids-sg-babygear-02", href: "/listings/kids-sg-babygear-02", advId: "42012",
    images: [{ src: img(4), alt: "Car seat" }],
    priceLabel: "S$300",
    title: "Convertible Baby Car Seat \u2014 Rear & Forward Facing",
    detailsLabel: "BABY GEAR \u2022 CAR SEAT \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Convertible car seat suitable for both rear-facing infants and forward-facing toddlers, ISOFIX compatible.</p>",
    keyDetails: [
      { key: "Compatibility", value: "ISOFIX" },
    ],
    goodToKnow: [
      { key: "Age Range", value: "0-4 years" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.babyGearSG,
  },
];

// ── kids_clothing ──────────────────────────────────────────────────────────────
export const SG_KIDS_CLOTHING: MockListing[] = [
  {
    id: "kids-sg-clothing-01", href: "/listings/kids-sg-clothing-01", advId: "42021",
    images: [{ src: img(5), alt: "Kids clothing set" }],
    priceLabel: "S$40",
    title: "Kids Summer Wear Bundle \u2014 5 Sets, Age 4-6",
    detailsLabel: "KIDS CLOTHING \u2022 BUNDLE \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Bundle of 5 summer wear sets for kids aged 4-6, gently used and in good condition.</p>",
    keyDetails: [
      { key: "Age Group", value: "4-6 years" },
      { key: "Sets", value: "5" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Gently used" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.kidsClothingSG,
  },
  {
    id: "kids-sg-clothing-02", href: "/listings/kids-sg-clothing-02", advId: "42022",
    images: [{ src: img(6), alt: "Kids ethnic wear" }],
    priceLabel: "S$50",
    title: "Kids Traditional Wear Set \u2014 Age 3-5, New",
    detailsLabel: "KIDS CLOTHING \u2022 TRADITIONAL \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Brand new traditional wear set for boys, perfect for festive occasions like Chinese New Year or Deepavali.</p>",
    keyDetails: [
      { key: "Age Group", value: "3-5 years" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Brand new" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.kidsClothingSG,
  },
];

// ── childcare ──────────────────────────────────────────────────────────────────
export const SG_KIDS_CHILDCARE: MockListing[] = [
  {
    id: "kids-sg-childcare-01", href: "/listings/kids-sg-childcare-01", advId: "42031",
    images: [{ src: img(7), alt: "Daycare centre" }],
    priceLabel: "S$1,200", priceSuffix: "/ mo",
    title: "Full-Day Daycare \u2014 Ages 2-5, Nutritious Meals Included",
    detailsLabel: "CHILDCARE \u2022 DAYCARE \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>Full-day daycare service for children aged 2-5, with nutritious meals, nap time, and structured activities.</p>",
    keyDetails: [
      { key: "Age Group", value: "2-5 years" },
      { key: "Hours", value: "8 AM - 6 PM" },
    ],
    goodToKnow: [
      { key: "Meals", value: "Included" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.childcareSG,
  },
  {
    id: "kids-sg-childcare-02", href: "/listings/kids-sg-childcare-02", advId: "42032",
    images: [{ src: img(8), alt: "After-school care" }],
    priceLabel: "S$600", priceSuffix: "/ mo",
    title: "After-School Care Programme \u2014 Homework Help & Snacks",
    detailsLabel: "CHILDCARE \u2022 AFTER-SCHOOL \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: daysAgo(2),
    description: "<p>After-school care programme with homework assistance, healthy snacks, and supervised play until pickup.</p>",
    keyDetails: [
      { key: "Hours", value: "3 PM - 7 PM" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Homework help + snacks" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.childcareSG,
  },
];

// ── school_supplies ──────────────────────────────────────────────────────────────
export const SG_KIDS_SCHOOL_SUPPLIES: MockListing[] = [
  {
    id: "kids-sg-supplies-01", href: "/listings/kids-sg-supplies-01", advId: "42041",
    images: [{ src: img(9), alt: "School bag" }],
    priceLabel: "S$45",
    title: "School Backpack \u2014 Ergonomic Straps, Multiple Compartments",
    detailsLabel: "SCHOOL SUPPLIES \u2022 BAGS \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>Ergonomic school backpack with padded straps and multiple compartments for books, lunch box, and water bottle.</p>",
    keyDetails: [
      { key: "Compartments", value: "4" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "6 months on zippers" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.schoolSuppliesSG,
  },
  {
    id: "kids-sg-supplies-02", href: "/listings/kids-sg-supplies-02", advId: "42042",
    images: [{ src: img(1), alt: "Stationery kit" }],
    priceLabel: "S$20",
    title: "Complete Stationery Kit \u2014 Notebooks, Pens, Geometry Set",
    detailsLabel: "SCHOOL SUPPLIES \u2022 STATIONERY \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Complete stationery kit including notebooks, pens, pencils, and a geometry set for the new school term.</p>",
    keyDetails: [
      { key: "Includes", value: "Notebooks + pens + geometry set" },
    ],
    goodToKnow: [
      { key: "Suitable For", value: "Primary 4-6" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.schoolSuppliesSG,
  },
];

// ── kids_activities ──────────────────────────────────────────────────────────────
export const SG_KIDS_ACTIVITIES: MockListing[] = [
  {
    id: "kids-sg-activities-01", href: "/listings/kids-sg-activities-01", advId: "42051",
    images: [{ src: img(2), alt: "Art workshop" }],
    priceLabel: "S$40", priceSuffix: "/ session",
    title: "Weekend Art & Craft Workshop \u2014 Ages 5-10",
    detailsLabel: "KIDS ACTIVITY \u2022 ART \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: hrsAgo(12),
    description: "<p>Fun weekend art and craft workshop for kids aged 5-10, covering painting, collage, and simple crafts.</p>",
    keyDetails: [
      { key: "Age Group", value: "5-10 years" },
    ],
    goodToKnow: [
      { key: "Materials", value: "All supplies included" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.kidsActivitiesSG,
  },
  {
    id: "kids-sg-activities-02", href: "/listings/kids-sg-activities-02", advId: "42052",
    images: [{ src: img(3), alt: "Sports camp" }],
    priceLabel: "S$180", priceSuffix: "/ week",
    title: "Kids Holiday Sports Camp \u2014 Football & Basketball",
    detailsLabel: "KIDS ACTIVITY \u2022 SPORTS \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Week-long holiday sports camp for kids featuring football and basketball training with certified coaches.</p>",
    keyDetails: [
      { key: "Duration", value: "1 week" },
    ],
    goodToKnow: [
      { key: "Coaching", value: "Certified coaches" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.kidsActivitiesSG,
  },
];

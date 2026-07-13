import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── gym_fitness_equipment ──────────────────────────────────────────────────────
export const IN_SPORTS_GYM_EQUIPMENT: MockListing[] = [
  {
    id: "sports-in-gym-01", href: "/listings/sports-in-gym-01", advId: "33001",
    images: [{ src: img(4), alt: "Adjustable dumbbells" }],
    priceLabel: "\u20b98,500",
    title: "Adjustable Dumbbell Set \u2014 5kg to 25kg, Pair",
    detailsLabel: "GYM EQUIPMENT \u2022 WEIGHTS \u2022 MUMBAI",
    locationLabel: "Andheri, Mumbai",
    postedAt: hrsAgo(3),
    description: "<p>Adjustable dumbbell pair, 5kg to 25kg per side, ideal for home strength training.</p>",
    keyDetails: [
      { key: "Weight Range", value: "5-25 kg" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Like new" },
    ],
    coordinates: { lat: 19.1136, lng: 72.8697 },
    seller: SELLERS.gymEquipIndia,
  },
  {
    id: "sports-in-gym-02", href: "/listings/sports-in-gym-02", advId: "33002",
    images: [{ src: img(5), alt: "Treadmill" }],
    priceLabel: "\u20b924,000",
    title: "Motorized Treadmill \u2014 Foldable, 12 Speed Levels",
    detailsLabel: "GYM EQUIPMENT \u2022 CARDIO \u2022 MUMBAI",
    locationLabel: "Andheri, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Foldable motorized treadmill with 12 speed levels and incline settings, great for home cardio.</p>",
    keyDetails: [
      { key: "Speed Levels", value: "12" },
    ],
    goodToKnow: [
      { key: "Foldable", value: "Yes" },
    ],
    coordinates: { lat: 19.1136, lng: 72.8697 },
    seller: SELLERS.gymEquipIndia,
  },
];

// ── team_sports ──────────────────────────────────────────────────────────────
export const IN_SPORTS_TEAM_SPORTS: MockListing[] = [
  {
    id: "sports-in-team-01", href: "/listings/sports-in-team-01", advId: "33011",
    images: [{ src: img(6), alt: "Cricket kit" }],
    priceLabel: "\u20b93,200",
    title: "Full Cricket Kit \u2014 Bat, Pads, Gloves & Bag",
    detailsLabel: "TEAM SPORTS \u2022 CRICKET \u2022 KOLKATA",
    locationLabel: "Salt Lake, Kolkata",
    postedAt: hrsAgo(5),
    description: "<p>Complete cricket kit including bat, batting pads, gloves and a carry bag, suitable for club-level play.</p>",
    keyDetails: [
      { key: "Includes", value: "Bat + pads + gloves + bag" },
    ],
    goodToKnow: [
      { key: "Bat Weight", value: "1180g" },
    ],
    coordinates: { lat: 22.5798, lng: 88.4155 },
    seller: SELLERS.teamSportsIndia,
  },
  {
    id: "sports-in-team-02", href: "/listings/sports-in-team-02", advId: "33012",
    images: [{ src: img(7), alt: "Football" }],
    priceLabel: "\u20b91,400",
    title: "Match-Grade Football \u2014 Size 5, FIFA Approved",
    detailsLabel: "TEAM SPORTS \u2022 FOOTBALL \u2022 KOLKATA",
    locationLabel: "Salt Lake, Kolkata",
    postedAt: daysAgo(2),
    description: "<p>FIFA-approved size 5 football suitable for league matches and training sessions.</p>",
    keyDetails: [
      { key: "Size", value: "5" },
    ],
    goodToKnow: [
      { key: "Certification", value: "FIFA approved" },
    ],
    coordinates: { lat: 22.5798, lng: 88.4155 },
    seller: SELLERS.teamSportsIndia,
  },
];

// ── outdoor_adventure ──────────────────────────────────────────────────────────
export const IN_SPORTS_OUTDOOR_ADVENTURE: MockListing[] = [
  {
    id: "sports-in-outdoor-01", href: "/listings/sports-in-outdoor-01", advId: "33021",
    images: [{ src: img(8), alt: "Camping tent" }],
    priceLabel: "\u20b95,500",
    title: "4-Person Camping Tent \u2014 Waterproof, Easy Setup",
    detailsLabel: "OUTDOOR ADVENTURE \u2022 CAMPING \u2022 MANALI",
    locationLabel: "Manali, Himachal Pradesh",
    postedAt: hrsAgo(7),
    description: "<p>Waterproof 4-person camping tent with easy quick-pitch setup, ideal for trekking trips.</p>",
    keyDetails: [
      { key: "Capacity", value: "4 persons" },
    ],
    goodToKnow: [
      { key: "Waterproof Rating", value: "3000mm" },
    ],
    coordinates: { lat: 32.2432, lng: 77.1892 },
    seller: SELLERS.outdoorAdvIndia,
  },
  {
    id: "sports-in-outdoor-02", href: "/listings/sports-in-outdoor-02", advId: "33022",
    images: [{ src: img(9), alt: "Trekking backpack" }],
    priceLabel: "\u20b93,800",
    title: "60L Trekking Backpack \u2014 Rain Cover Included",
    detailsLabel: "OUTDOOR ADVENTURE \u2022 TREKKING \u2022 MANALI",
    locationLabel: "Manali, Himachal Pradesh",
    postedAt: daysAgo(1),
    description: "<p>60-litre trekking backpack with adjustable straps and rain cover, suitable for multi-day treks.</p>",
    keyDetails: [
      { key: "Capacity", value: "60L" },
    ],
    goodToKnow: [
      { key: "Rain Cover", value: "Included" },
    ],
    coordinates: { lat: 32.2432, lng: 77.1892 },
    seller: SELLERS.outdoorAdvIndia,
  },
];

// ── water_sports ──────────────────────────────────────────────────────────────
export const IN_SPORTS_WATER_SPORTS: MockListing[] = [
  {
    id: "sports-in-water-01", href: "/listings/sports-in-water-01", advId: "33031",
    images: [{ src: img(1), alt: "Surfboard" }],
    priceLabel: "\u20b912,000",
    title: "Beginner Surfboard \u2014 7ft Foam Board",
    detailsLabel: "WATER SPORTS \u2022 SURFING \u2022 GOA",
    locationLabel: "Calangute, Goa",
    postedAt: hrsAgo(9),
    description: "<p>7ft foam surfboard perfect for beginners learning to surf along Goa's beaches.</p>",
    keyDetails: [
      { key: "Length", value: "7 ft" },
    ],
    goodToKnow: [
      { key: "Skill Level", value: "Beginner" },
    ],
    coordinates: { lat: 15.5439, lng: 73.7553 },
    seller: SELLERS.waterSportsIndia,
  },
  {
    id: "sports-in-water-02", href: "/listings/sports-in-water-02", advId: "33032",
    images: [{ src: img(2), alt: "Kayak" }],
    priceLabel: "\u20b918,000",
    title: "Single Seater Kayak \u2014 Includes Paddle & Life Vest",
    detailsLabel: "WATER SPORTS \u2022 KAYAKING \u2022 GOA",
    locationLabel: "Calangute, Goa",
    postedAt: daysAgo(3),
    description: "<p>Single-seater kayak with paddle and life vest included, great for calm-water paddling.</p>",
    keyDetails: [
      { key: "Seating", value: "1 person" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Paddle + life vest" },
    ],
    coordinates: { lat: 15.5439, lng: 73.7553 },
    seller: SELLERS.waterSportsIndia,
  },
];

// ── sportswear ──────────────────────────────────────────────────────────────
export const IN_SPORTS_SPORTSWEAR: MockListing[] = [
  {
    id: "sports-in-wear-01", href: "/listings/sports-in-wear-01", advId: "33041",
    images: [{ src: img(3), alt: "Running shoes" }],
    priceLabel: "\u20b93,500",
    title: "Running Shoes \u2014 Lightweight, Breathable Mesh, Size 9",
    detailsLabel: "SPORTSWEAR \u2022 FOOTWEAR \u2022 BENGALURU",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: hrsAgo(11),
    description: "<p>Lightweight running shoes with breathable mesh upper, size 9, barely used.</p>",
    keyDetails: [
      { key: "Size", value: "9" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Barely used" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.sportswearIndia,
  },
  {
    id: "sports-in-wear-02", href: "/listings/sports-in-wear-02", advId: "33042",
    images: [{ src: img(4), alt: "Yoga wear set" }],
    priceLabel: "\u20b91,600",
    title: "Yoga Wear Set \u2014 Leggings & Tank Top, Size M",
    detailsLabel: "SPORTSWEAR \u2022 YOGA \u2022 BENGALURU",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Comfortable yoga leggings and tank top set, size medium, moisture-wicking fabric.</p>",
    keyDetails: [
      { key: "Size", value: "M" },
    ],
    goodToKnow: [
      { key: "Fabric", value: "Moisture-wicking" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.sportswearIndia,
  },
];

// ── fitness_coaching ──────────────────────────────────────────────────────────
export const IN_SPORTS_FITNESS_COACHING: MockListing[] = [
  {
    id: "sports-in-coach-01", href: "/listings/sports-in-coach-01", advId: "33051",
    images: [{ src: img(5), alt: "Personal trainer session" }],
    priceLabel: "\u20b91,000", priceSuffix: "/ session",
    title: "1-on-1 Personal Training \u2014 Strength & Weight Loss",
    detailsLabel: "FITNESS COACHING \u2022 PERSONAL TRAINER \u2022 HYDERABAD",
    locationLabel: "Banjara Hills, Hyderabad",
    postedAt: hrsAgo(2),
    description: "<p>Personalized one-on-one training sessions focused on strength building and weight loss goals.</p>",
    keyDetails: [
      { key: "Session Length", value: "60 min" },
    ],
    goodToKnow: [
      { key: "Certification", value: "ACE Certified" },
    ],
    coordinates: { lat: 17.4126, lng: 78.4483 },
    seller: SELLERS.fitnessCoachIndia,
  },
  {
    id: "sports-in-coach-02", href: "/listings/sports-in-coach-02", advId: "33052",
    images: [{ src: img(6), alt: "Sports performance coaching" }],
    priceLabel: "\u20b96,000", priceSuffix: "/ mo",
    title: "Sports Performance Coaching \u2014 4 Sessions per Week",
    detailsLabel: "FITNESS COACHING \u2022 SPORTS PERFORMANCE \u2022 HYDERABAD",
    locationLabel: "Banjara Hills, Hyderabad",
    postedAt: daysAgo(2),
    description: "<p>Monthly sports performance coaching package with 4 sessions per week, tailored to athletic goals.</p>",
    keyDetails: [
      { key: "Sessions", value: "4 / week" },
    ],
    goodToKnow: [
      { key: "Focus", value: "Speed & agility" },
    ],
    coordinates: { lat: 17.4126, lng: 78.4483 },
    seller: SELLERS.fitnessCoachIndia,
  },
];

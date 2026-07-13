import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── gym_fitness_equipment ──────────────────────────────────────────────────────
export const SG_SPORTS_GYM_EQUIPMENT: MockListing[] = [
  {
    id: "sports-sg-gym-01", href: "/listings/sports-sg-gym-01", advId: "43001",
    images: [{ src: img(4), alt: "Adjustable dumbbells" }],
    priceLabel: "S$150",
    title: "Adjustable Dumbbell Set \u2014 5kg to 25kg, Pair",
    detailsLabel: "GYM EQUIPMENT \u2022 WEIGHTS \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Adjustable dumbbell pair, 5kg to 25kg per side, ideal for home strength training.</p>",
    keyDetails: [
      { key: "Weight Range", value: "5-25 kg" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Like new" },
    ],
    coordinates: { lat: 1.3300, lng: 103.8998 },
    seller: SELLERS.gymEquipSG,
  },
  {
    id: "sports-sg-gym-02", href: "/listings/sports-sg-gym-02", advId: "43002",
    images: [{ src: img(5), alt: "Treadmill" }],
    priceLabel: "S$480",
    title: "Motorized Treadmill \u2014 Foldable, 12 Speed Levels",
    detailsLabel: "GYM EQUIPMENT \u2022 CARDIO \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Foldable motorized treadmill with 12 speed levels and incline settings, great for home cardio.</p>",
    keyDetails: [
      { key: "Speed Levels", value: "12" },
    ],
    goodToKnow: [
      { key: "Foldable", value: "Yes" },
    ],
    coordinates: { lat: 1.3300, lng: 103.8998 },
    seller: SELLERS.gymEquipSG,
  },
];

// ── team_sports ──────────────────────────────────────────────────────────────
export const SG_SPORTS_TEAM_SPORTS: MockListing[] = [
  {
    id: "sports-sg-team-01", href: "/listings/sports-sg-team-01", advId: "43011",
    images: [{ src: img(6), alt: "Basketball" }],
    priceLabel: "S$45",
    title: "Official Size Basketball \u2014 Indoor/Outdoor",
    detailsLabel: "TEAM SPORTS \u2022 BASKETBALL \u2022 SINGAPORE",
    locationLabel: "Jurong East, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Official size basketball suitable for both indoor and outdoor courts.</p>",
    keyDetails: [
      { key: "Size", value: "7" },
    ],
    goodToKnow: [
      { key: "Use", value: "Indoor/Outdoor" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.teamSportsSG,
  },
  {
    id: "sports-sg-team-02", href: "/listings/sports-sg-team-02", advId: "43012",
    images: [{ src: img(7), alt: "Football" }],
    priceLabel: "S$38",
    title: "Match-Grade Football \u2014 Size 5, FIFA Approved",
    detailsLabel: "TEAM SPORTS \u2022 FOOTBALL \u2022 SINGAPORE",
    locationLabel: "Jurong East, Singapore",
    postedAt: daysAgo(2),
    description: "<p>FIFA-approved size 5 football suitable for league matches and training sessions.</p>",
    keyDetails: [
      { key: "Size", value: "5" },
    ],
    goodToKnow: [
      { key: "Certification", value: "FIFA approved" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.teamSportsSG,
  },
];

// ── outdoor_adventure ──────────────────────────────────────────────────────────
export const SG_SPORTS_OUTDOOR_ADVENTURE: MockListing[] = [
  {
    id: "sports-sg-outdoor-01", href: "/listings/sports-sg-outdoor-01", advId: "43021",
    images: [{ src: img(8), alt: "Camping tent" }],
    priceLabel: "S$140",
    title: "4-Person Camping Tent \u2014 Waterproof, Easy Setup",
    detailsLabel: "OUTDOOR ADVENTURE \u2022 CAMPING \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: hrsAgo(7),
    description: "<p>Waterproof 4-person camping tent with easy quick-pitch setup, ideal for weekend camping trips.</p>",
    keyDetails: [
      { key: "Capacity", value: "4 persons" },
    ],
    goodToKnow: [
      { key: "Waterproof Rating", value: "3000mm" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.outdoorAdvSG,
  },
  {
    id: "sports-sg-outdoor-02", href: "/listings/sports-sg-outdoor-02", advId: "43022",
    images: [{ src: img(9), alt: "Trekking backpack" }],
    priceLabel: "S$95",
    title: "60L Trekking Backpack \u2014 Rain Cover Included",
    detailsLabel: "OUTDOOR ADVENTURE \u2022 TREKKING \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: daysAgo(1),
    description: "<p>60-litre trekking backpack with adjustable straps and rain cover, suitable for multi-day treks.</p>",
    keyDetails: [
      { key: "Capacity", value: "60L" },
    ],
    goodToKnow: [
      { key: "Rain Cover", value: "Included" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.outdoorAdvSG,
  },
];

// ── water_sports ──────────────────────────────────────────────────────────────
export const SG_SPORTS_WATER_SPORTS: MockListing[] = [
  {
    id: "sports-sg-water-01", href: "/listings/sports-sg-water-01", advId: "43031",
    images: [{ src: img(1), alt: "Surfboard" }],
    priceLabel: "S$320",
    title: "Beginner Surfboard \u2014 7ft Foam Board",
    detailsLabel: "WATER SPORTS \u2022 SURFING \u2022 SINGAPORE",
    locationLabel: "Sentosa, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>7ft foam surfboard perfect for beginners, ideal for Sentosa's wave pool sessions.</p>",
    keyDetails: [
      { key: "Length", value: "7 ft" },
    ],
    goodToKnow: [
      { key: "Skill Level", value: "Beginner" },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.waterSportsSG,
  },
  {
    id: "sports-sg-water-02", href: "/listings/sports-sg-water-02", advId: "43032",
    images: [{ src: img(2), alt: "Kayak" }],
    priceLabel: "S$480",
    title: "Single Seater Kayak \u2014 Includes Paddle & Life Vest",
    detailsLabel: "WATER SPORTS \u2022 KAYAKING \u2022 SINGAPORE",
    locationLabel: "Sentosa, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Single-seater kayak with paddle and life vest included, great for calm-water paddling.</p>",
    keyDetails: [
      { key: "Seating", value: "1 person" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Paddle + life vest" },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.waterSportsSG,
  },
];

// ── sportswear ──────────────────────────────────────────────────────────────
export const SG_SPORTS_SPORTSWEAR: MockListing[] = [
  {
    id: "sports-sg-wear-01", href: "/listings/sports-sg-wear-01", advId: "43041",
    images: [{ src: img(3), alt: "Running shoes" }],
    priceLabel: "S$90",
    title: "Running Shoes \u2014 Lightweight, Breathable Mesh, Size 9",
    detailsLabel: "SPORTSWEAR \u2022 FOOTWEAR \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: hrsAgo(11),
    description: "<p>Lightweight running shoes with breathable mesh upper, size 9, barely used.</p>",
    keyDetails: [
      { key: "Size", value: "9" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Barely used" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.sportswearSG,
  },
  {
    id: "sports-sg-wear-02", href: "/listings/sports-sg-wear-02", advId: "43042",
    images: [{ src: img(4), alt: "Yoga wear set" }],
    priceLabel: "S$42",
    title: "Yoga Wear Set \u2014 Leggings & Tank Top, Size M",
    detailsLabel: "SPORTSWEAR \u2022 YOGA \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Comfortable yoga leggings and tank top set, size medium, moisture-wicking fabric.</p>",
    keyDetails: [
      { key: "Size", value: "M" },
    ],
    goodToKnow: [
      { key: "Fabric", value: "Moisture-wicking" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.sportswearSG,
  },
];

// ── fitness_coaching ──────────────────────────────────────────────────────────
export const SG_SPORTS_FITNESS_COACHING: MockListing[] = [
  {
    id: "sports-sg-coach-01", href: "/listings/sports-sg-coach-01", advId: "43051",
    images: [{ src: img(5), alt: "Personal trainer session" }],
    priceLabel: "S$80", priceSuffix: "/ session",
    title: "1-on-1 Personal Training \u2014 Strength & Weight Loss",
    detailsLabel: "FITNESS COACHING \u2022 PERSONAL TRAINER \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Personalized one-on-one training sessions focused on strength building and weight loss goals.</p>",
    keyDetails: [
      { key: "Session Length", value: "60 min" },
    ],
    goodToKnow: [
      { key: "Certification", value: "ACE Certified" },
    ],
    coordinates: { lat: 1.2818, lng: 103.8607 },
    seller: SELLERS.fitnessCoachSG,
  },
  {
    id: "sports-sg-coach-02", href: "/listings/sports-sg-coach-02", advId: "43052",
    images: [{ src: img(6), alt: "Sports performance coaching" }],
    priceLabel: "S$480", priceSuffix: "/ mo",
    title: "Sports Performance Coaching \u2014 4 Sessions per Week",
    detailsLabel: "FITNESS COACHING \u2022 SPORTS PERFORMANCE \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Monthly sports performance coaching package with 4 sessions per week, tailored to athletic goals.</p>",
    keyDetails: [
      { key: "Sessions", value: "4 / week" },
    ],
    goodToKnow: [
      { key: "Focus", value: "Speed & agility" },
    ],
    coordinates: { lat: 1.2818, lng: 103.8607 },
    seller: SELLERS.fitnessCoachSG,
  },
];

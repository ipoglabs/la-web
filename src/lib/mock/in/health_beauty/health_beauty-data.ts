import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── gyms_fitness ──────────────────────────────────────────────────────────────
export const IN_HEALTH_GYMS_FITNESS: MockListing[] = [
  {
    id: "health-in-gyms-01", href: "/listings/health-in-gyms-01", advId: "29001",
    images: [{ src: img(1), alt: "Gym membership" }],
    priceLabel: "\u20b92,500", priceSuffix: "/ mo",
    title: "Premium Gym Membership \u2014 Group Classes & Personal Training",
    detailsLabel: "GYM & FITNESS \u2022 MEMBERSHIP \u2022 MUMBAI",
    locationLabel: "Bandra, Mumbai",
    postedAt: hrsAgo(3),
    description: "<p>Full access gym membership including unlimited group classes and 2 personal training sessions per month.</p>",
    keyDetails: [
      { key: "Includes", value: "Group classes + 2 PT sessions" },
    ],
    goodToKnow: [
      { key: "Contract", value: "Monthly, no lock-in" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    seller: SELLERS.fitZoneGymIndia,
  },
  {
    id: "health-in-gyms-02", href: "/listings/health-in-gyms-02", advId: "29002",
    images: [{ src: img(2), alt: "Yoga classes" }],
    priceLabel: "\u20b91,200", priceSuffix: "/ mo",
    title: "Morning Yoga & Meditation Classes \u2014 Small Batches",
    detailsLabel: "GYM & FITNESS \u2022 YOGA \u2022 MUMBAI",
    locationLabel: "Bandra, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Early morning yoga and meditation classes in small batches, suitable for all fitness levels.</p>",
    keyDetails: [
      { key: "Batch Size", value: "Max 12" },
    ],
    goodToKnow: [
      { key: "Timing", value: "6 AM daily" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    seller: SELLERS.fitZoneGymIndia,
  },
];

// ── salons_spas ───────────────────────────────────────────────────────────────
export const IN_HEALTH_SALONS_SPAS: MockListing[] = [
  {
    id: "health-in-salons-01", href: "/listings/health-in-salons-01", advId: "29011",
    images: [{ src: img(3), alt: "Spa package" }],
    priceLabel: "\u20b93,500",
    title: "Full Body Spa Package \u2014 90 Minutes, Aromatherapy Included",
    detailsLabel: "SALON & SPA \u2022 SPA \u2022 HYDERABAD",
    locationLabel: "Jubilee Hills, Hyderabad",
    postedAt: hrsAgo(5),
    description: "<p>Relaxing 90-minute full body spa package with aromatherapy oils, suitable for stress relief and muscle relaxation.</p>",
    keyDetails: [
      { key: "Duration", value: "90 minutes" },
    ],
    goodToKnow: [
      { key: "Booking", value: "Advance booking recommended" },
    ],
    coordinates: { lat: 17.4325, lng: 78.4071 },
    seller: SELLERS.glamourSalonIndia,
  },
  {
    id: "health-in-salons-02", href: "/listings/health-in-salons-02", advId: "29012",
    images: [{ src: img(4), alt: "Haircut and styling" }],
    priceLabel: "\u20b91,200",
    title: "Haircut & Styling \u2014 Unisex, Senior Stylist",
    detailsLabel: "SALON & SPA \u2022 HAIR \u2022 HYDERABAD",
    locationLabel: "Jubilee Hills, Hyderabad",
    postedAt: daysAgo(2),
    description: "<p>Professional haircut and styling by a senior stylist, unisex service with consultation included.</p>",
    keyDetails: [
      { key: "Service", value: "Haircut + styling" },
    ],
    goodToKnow: [
      { key: "Consultation", value: "Included" },
    ],
    coordinates: { lat: 17.4325, lng: 78.4071 },
    seller: SELLERS.glamourSalonIndia,
  },
];

// ── medical ────────────────────────────────────────────────────────────────────
export const IN_HEALTH_MEDICAL: MockListing[] = [
  {
    id: "health-in-medical-01", href: "/listings/health-in-medical-01", advId: "29021",
    images: [{ src: img(5), alt: "General consultation" }],
    priceLabel: "\u20b9500", priceSuffix: "/ visit",
    title: "General Physician Consultation \u2014 Same Day Appointments",
    detailsLabel: "MEDICAL \u2022 GENERAL PHYSICIAN \u2022 NAVI MUMBAI",
    locationLabel: "Vashi, Navi Mumbai",
    postedAt: hrsAgo(7),
    description: "<p>General physician consultations with same-day appointment availability for common ailments and health checkups.</p>",
    keyDetails: [
      { key: "Appointment", value: "Same day available" },
    ],
    goodToKnow: [
      { key: "Insurance", value: "Cashless for select providers" },
    ],
    coordinates: { lat: 19.0771, lng: 73.0007 },
    seller: SELLERS.drSharmaClinic,
  },
  {
    id: "health-in-medical-02", href: "/listings/health-in-medical-02", advId: "29022",
    images: [{ src: img(6), alt: "Health checkup package" }],
    priceLabel: "\u20b92,999",
    title: "Full Body Health Checkup Package \u2014 45 Parameters",
    detailsLabel: "MEDICAL \u2022 HEALTH CHECKUP \u2022 NAVI MUMBAI",
    locationLabel: "Vashi, Navi Mumbai",
    postedAt: daysAgo(3),
    description: "<p>Comprehensive full body health checkup covering 45 parameters including blood work, ECG, and consultation.</p>",
    keyDetails: [
      { key: "Parameters", value: "45" },
    ],
    goodToKnow: [
      { key: "Fasting", value: "Required 8-10 hours before" },
    ],
    coordinates: { lat: 19.0771, lng: 73.0007 },
    seller: SELLERS.drSharmaClinic,
  },
];

// ── beauty_products ───────────────────────────────────────────────────────────────
export const IN_HEALTH_BEAUTY_PRODUCTS: MockListing[] = [
  {
    id: "health-in-beautyproducts-01", href: "/listings/health-in-beautyproducts-01", advId: "29031",
    images: [{ src: img(7), alt: "Skincare set" }],
    priceLabel: "\u20b91,800",
    title: "Korean Skincare Routine Set \u2014 Cleanser, Toner, Serum, Moisturiser",
    detailsLabel: "BEAUTY PRODUCTS \u2022 SKINCARE \u2022 MUMBAI",
    locationLabel: "Linking Road, Mumbai",
    postedAt: hrsAgo(10),
    description: "<p>Complete Korean skincare routine set including cleanser, toner, vitamin C serum, and moisturiser. Suitable for all skin types.</p>",
    keyDetails: [
      { key: "Items", value: "4-piece set" },
    ],
    goodToKnow: [
      { key: "Skin Type", value: "Suitable for all types" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8347 },
    seller: SELLERS.beautyEssentialsIndia,
  },
  {
    id: "health-in-beautyproducts-02", href: "/listings/health-in-beautyproducts-02", advId: "29032",
    images: [{ src: img(8), alt: "Makeup kit" }],
    priceLabel: "\u20b92,400",
    title: "Professional Makeup Kit \u2014 Foundation, Eyeshadow Palette, Brushes",
    detailsLabel: "BEAUTY PRODUCTS \u2022 MAKEUP \u2022 MUMBAI",
    locationLabel: "Linking Road, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Professional-grade makeup kit with foundation shades, eyeshadow palette, and a full set of brushes.</p>",
    keyDetails: [
      { key: "Includes", value: "Foundation + palette + brushes" },
    ],
    goodToKnow: [
      { key: "Suitable For", value: "Beginners & professionals" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8347 },
    seller: SELLERS.beautyEssentialsIndia,
  },
];

// ── wellness ───────────────────────────────────────────────────────────────────
export const IN_HEALTH_WELLNESS: MockListing[] = [
  {
    id: "health-in-wellness-01", href: "/listings/health-in-wellness-01", advId: "29041",
    images: [{ src: img(9), alt: "Ayurveda therapy" }],
    priceLabel: "\u20b94,500",
    title: "Ayurvedic Panchakarma Therapy \u2014 3-Day Package",
    detailsLabel: "WELLNESS \u2022 AYURVEDA \u2022 BENGALURU",
    locationLabel: "Whitefield, Bengaluru",
    postedAt: hrsAgo(12),
    description: "<p>Traditional 3-day Panchakarma therapy package including consultation, personalised treatments, and dietary guidance.</p>",
    keyDetails: [
      { key: "Duration", value: "3 days" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Consultation + dietary guidance" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.wellnessRetreatIndia,
  },
  {
    id: "health-in-wellness-02", href: "/listings/health-in-wellness-02", advId: "29042",
    images: [{ src: img(1), alt: "Massage therapy" }],
    priceLabel: "\u20b91,800", priceSuffix: "/ session",
    title: "Deep Tissue Massage Therapy \u2014 60 Minutes",
    detailsLabel: "WELLNESS \u2022 MASSAGE \u2022 BENGALURU",
    locationLabel: "Whitefield, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>60-minute deep tissue massage therapy session for muscle tension relief, performed by certified therapists.</p>",
    keyDetails: [
      { key: "Duration", value: "60 minutes" },
    ],
    goodToKnow: [
      { key: "Booking", value: "Advance booking recommended" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.wellnessRetreatIndia,
  },
];

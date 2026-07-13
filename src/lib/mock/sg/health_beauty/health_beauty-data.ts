import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── gyms_fitness ──────────────────────────────────────────────────────────────
export const SG_HEALTH_GYMS_FITNESS: MockListing[] = [
  {
    id: "health-sg-gyms-01", href: "/listings/health-sg-gyms-01", advId: "39001",
    images: [{ src: img(1), alt: "Gym membership" }],
    priceLabel: "S$150", priceSuffix: "/ mo",
    title: "Premium Gym Membership \u2014 Group Classes & Personal Training",
    detailsLabel: "GYM & FITNESS \u2022 MEMBERSHIP \u2022 SINGAPORE",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Full access gym membership including unlimited group classes and 2 personal training sessions per month.</p>",
    keyDetails: [
      { key: "Includes", value: "Group classes + 2 PT sessions" },
    ],
    goodToKnow: [
      { key: "Contract", value: "Monthly, no lock-in" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.fitZoneGymSG,
  },
  {
    id: "health-sg-gyms-02", href: "/listings/health-sg-gyms-02", advId: "39002",
    images: [{ src: img(2), alt: "Yoga classes" }],
    priceLabel: "S$90", priceSuffix: "/ mo",
    title: "Morning Yoga & Meditation Classes \u2014 Small Batches",
    detailsLabel: "GYM & FITNESS \u2022 YOGA \u2022 SINGAPORE",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Early morning yoga and meditation classes in small batches, suitable for all fitness levels.</p>",
    keyDetails: [
      { key: "Batch Size", value: "Max 12" },
    ],
    goodToKnow: [
      { key: "Timing", value: "6 AM daily" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.fitZoneGymSG,
  },
];

// ── salons_spas ───────────────────────────────────────────────────────────────
export const SG_HEALTH_SALONS_SPAS: MockListing[] = [
  {
    id: "health-sg-salons-01", href: "/listings/health-sg-salons-01", advId: "39011",
    images: [{ src: img(3), alt: "Spa package" }],
    priceLabel: "S$180",
    title: "Full Body Spa Package \u2014 90 Minutes, Aromatherapy Included",
    detailsLabel: "SALON & SPA \u2022 SPA \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Relaxing 90-minute full body spa package with aromatherapy oils, suitable for stress relief and muscle relaxation.</p>",
    keyDetails: [
      { key: "Duration", value: "90 minutes" },
    ],
    goodToKnow: [
      { key: "Booking", value: "Advance booking recommended" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.glamourSalonSG,
  },
  {
    id: "health-sg-salons-02", href: "/listings/health-sg-salons-02", advId: "39012",
    images: [{ src: img(4), alt: "Haircut and styling" }],
    priceLabel: "S$68",
    title: "Haircut & Styling \u2014 Unisex, Senior Stylist",
    detailsLabel: "SALON & SPA \u2022 HAIR \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Professional haircut and styling by a senior stylist, unisex service with consultation included.</p>",
    keyDetails: [
      { key: "Service", value: "Haircut + styling" },
    ],
    goodToKnow: [
      { key: "Consultation", value: "Included" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.glamourSalonSG,
  },
];

// ── medical ────────────────────────────────────────────────────────────────────
export const SG_HEALTH_MEDICAL: MockListing[] = [
  {
    id: "health-sg-medical-01", href: "/listings/health-sg-medical-01", advId: "39021",
    images: [{ src: img(5), alt: "General consultation" }],
    priceLabel: "S$45", priceSuffix: "/ visit",
    title: "General Physician Consultation \u2014 Same Day Appointments",
    detailsLabel: "MEDICAL \u2022 GENERAL PHYSICIAN \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: hrsAgo(7),
    description: "<p>General physician consultations with same-day appointment availability for common ailments and health checkups.</p>",
    keyDetails: [
      { key: "Appointment", value: "Same day available" },
    ],
    goodToKnow: [
      { key: "Insurance", value: "Panel for select providers" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.drTanClinicSG,
  },
  {
    id: "health-sg-medical-02", href: "/listings/health-sg-medical-02", advId: "39022",
    images: [{ src: img(6), alt: "Health checkup package" }],
    priceLabel: "S$280",
    title: "Full Body Health Checkup Package \u2014 45 Parameters",
    detailsLabel: "MEDICAL \u2022 HEALTH CHECKUP \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Comprehensive full body health checkup covering 45 parameters including blood work, ECG, and consultation.</p>",
    keyDetails: [
      { key: "Parameters", value: "45" },
    ],
    goodToKnow: [
      { key: "Fasting", value: "Required 8-10 hours before" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.drTanClinicSG,
  },
];

// ── beauty_products ───────────────────────────────────────────────────────────────
export const SG_HEALTH_BEAUTY_PRODUCTS: MockListing[] = [
  {
    id: "health-sg-beautyproducts-01", href: "/listings/health-sg-beautyproducts-01", advId: "39031",
    images: [{ src: img(7), alt: "Skincare set" }],
    priceLabel: "S$95",
    title: "Korean Skincare Routine Set \u2014 Cleanser, Toner, Serum, Moisturiser",
    detailsLabel: "BEAUTY PRODUCTS \u2022 SKINCARE \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>Complete Korean skincare routine set including cleanser, toner, vitamin C serum, and moisturiser. Suitable for all skin types.</p>",
    keyDetails: [
      { key: "Items", value: "4-piece set" },
    ],
    goodToKnow: [
      { key: "Skin Type", value: "Suitable for all types" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.beautyEssentialsSG,
  },
  {
    id: "health-sg-beautyproducts-02", href: "/listings/health-sg-beautyproducts-02", advId: "39032",
    images: [{ src: img(8), alt: "Makeup kit" }],
    priceLabel: "S$120",
    title: "Professional Makeup Kit \u2014 Foundation, Eyeshadow Palette, Brushes",
    detailsLabel: "BEAUTY PRODUCTS \u2022 MAKEUP \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Professional-grade makeup kit with foundation shades, eyeshadow palette, and a full set of brushes.</p>",
    keyDetails: [
      { key: "Includes", value: "Foundation + palette + brushes" },
    ],
    goodToKnow: [
      { key: "Suitable For", value: "Beginners & professionals" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.beautyEssentialsSG,
  },
];

// ── wellness ───────────────────────────────────────────────────────────────────
export const SG_HEALTH_WELLNESS: MockListing[] = [
  {
    id: "health-sg-wellness-01", href: "/listings/health-sg-wellness-01", advId: "39041",
    images: [{ src: img(9), alt: "Spa retreat" }],
    priceLabel: "S$320",
    title: "Weekend Wellness Retreat Package \u2014 Sentosa, 1 Night",
    detailsLabel: "WELLNESS \u2022 RETREAT \u2022 SINGAPORE",
    locationLabel: "Sentosa, Singapore",
    postedAt: hrsAgo(12),
    description: "<p>Overnight wellness retreat package at Sentosa including spa treatments, healthy meals, and guided meditation sessions.</p>",
    keyDetails: [
      { key: "Duration", value: "1 night" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Meals + guided meditation" },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.wellnessRetreatSG,
  },
  {
    id: "health-sg-wellness-02", href: "/listings/health-sg-wellness-02", advId: "39042",
    images: [{ src: img(1), alt: "Massage therapy" }],
    priceLabel: "S$120", priceSuffix: "/ session",
    title: "Deep Tissue Massage Therapy \u2014 60 Minutes",
    detailsLabel: "WELLNESS \u2022 MASSAGE \u2022 SINGAPORE",
    locationLabel: "Sentosa, Singapore",
    postedAt: daysAgo(2),
    description: "<p>60-minute deep tissue massage therapy session for muscle tension relief, performed by certified therapists.</p>",
    keyDetails: [
      { key: "Duration", value: "60 minutes" },
    ],
    goodToKnow: [
      { key: "Booking", value: "Advance booking recommended" },
    ],
    coordinates: { lat: 1.2494, lng: 103.8303 },
    seller: SELLERS.wellnessRetreatSG,
  },
];

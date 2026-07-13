import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── furniture_free ───────────────────────────────────────────────────────────
export const SG_FREE_FURNITURE_FREE: MockListing[] = [
  {
    id: "free-sg-furniture-01", href: "/listings/free-sg-furniture-01", advId: "50001",
    images: [{ src: img(1), alt: "Wooden dining table" }],
    priceLabel: "Free",
    title: "Wooden Dining Table \u2014 Seats 4, Minor Wear",
    detailsLabel: "FREE \u2022 FURNITURE \u2022 SINGAPORE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Free wooden dining table, seats 4, some minor scratches but sturdy. Pickup only.</p>",
    keyDetails: [
      { key: "Seats", value: "4" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.furnitureFreeSG,
  },
  {
    id: "free-sg-furniture-02", href: "/listings/free-sg-furniture-02", advId: "50002",
    images: [{ src: img(2), alt: "Bookshelf" }],
    priceLabel: "Free",
    title: "Wooden Bookshelf \u2014 5 Tier, Good Condition",
    detailsLabel: "FREE \u2022 FURNITURE \u2022 SINGAPORE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Free 5-tier wooden bookshelf in good condition, no damage. Pickup only.</p>",
    keyDetails: [
      { key: "Tiers", value: "5" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.furnitureFreeSG,
  },
];

// ── clothing_free ────────────────────────────────────────────────────────────
export const SG_FREE_CLOTHING_FREE: MockListing[] = [
  {
    id: "free-sg-clothing-01", href: "/listings/free-sg-clothing-01", advId: "50011",
    images: [{ src: img(3), alt: "Winter jackets" }],
    priceLabel: "Free",
    title: "Jackets Bundle \u2014 4 Pieces, Assorted Sizes",
    detailsLabel: "FREE \u2022 CLOTHING \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Free bundle of 4 jackets, assorted sizes, gently used.</p>",
    keyDetails: [
      { key: "Quantity", value: "4" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Gently used" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.clothingFreeSG,
  },
  {
    id: "free-sg-clothing-02", href: "/listings/free-sg-clothing-02", advId: "50012",
    images: [{ src: img(4), alt: "Traditional dress collection" }],
    priceLabel: "Free",
    title: "Traditional Dress Collection \u2014 6 Pieces, Free to Good Home",
    detailsLabel: "FREE \u2022 CLOTHING \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Free collection of 6 traditional dresses, lightly worn, various colours.</p>",
    keyDetails: [
      { key: "Quantity", value: "6" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Lightly worn" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.clothingFreeSG,
  },
];

// ── electronics_free ─────────────────────────────────────────────────────────
export const SG_FREE_ELECTRONICS_FREE: MockListing[] = [
  {
    id: "free-sg-electronics-01", href: "/listings/free-sg-electronics-01", advId: "50021",
    images: [{ src: img(5), alt: "Old CRT TV" }],
    priceLabel: "Free",
    title: "Old CRT Television \u2014 Working, Free for Pickup",
    detailsLabel: "FREE \u2022 ELECTRONICS \u2022 SINGAPORE",
    locationLabel: "Jurong East, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Free working CRT television, bulky but functional. Pickup only.</p>",
    keyDetails: [
      { key: "Condition", value: "Working" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.electronicsFreeSG,
  },
  {
    id: "free-sg-electronics-02", href: "/listings/free-sg-electronics-02", advId: "50022",
    images: [{ src: img(6), alt: "Desktop computer" }],
    priceLabel: "Free",
    title: "Desktop Computer \u2014 Old Spec, Free for Parts or Use",
    detailsLabel: "FREE \u2022 ELECTRONICS \u2022 SINGAPORE",
    locationLabel: "Jurong East, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Free old desktop computer, works but slow, good for spare parts or basic use.</p>",
    keyDetails: [
      { key: "Condition", value: "Working, slow" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.electronicsFreeSG,
  },
];

// ── food_free ──────────────────────────────────────────────────────────────
export const SG_FREE_FOOD_FREE: MockListing[] = [
  {
    id: "free-sg-food-01", href: "/listings/free-sg-food-01", advId: "50031",
    images: [{ src: img(7), alt: "Homemade meals" }],
    priceLabel: "Free",
    title: "Surplus Homemade Meals \u2014 Available Today Only",
    detailsLabel: "FREE \u2022 FOOD \u2022 SINGAPORE",
    locationLabel: "Bedok, Singapore",
    postedAt: hrsAgo(1),
    description: "<p>Free surplus homemade meals, halal, available for pickup today only.</p>",
    keyDetails: [
      { key: "Type", value: "Halal" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Today only" },
    ],
    coordinates: { lat: 1.3236, lng: 103.9273 },
    seller: SELLERS.foodFreeSG,
  },
  {
    id: "free-sg-food-02", href: "/listings/free-sg-food-02", advId: "50032",
    images: [{ src: img(8), alt: "Bread loaves" }],
    priceLabel: "Free",
    title: "Fresh Bread Loaves \u2014 Baked Today, Free Pickup",
    detailsLabel: "FREE \u2022 FOOD \u2022 SINGAPORE",
    locationLabel: "Bedok, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Free fresh bread loaves baked today, extra batch from home bakery.</p>",
    keyDetails: [
      { key: "Freshness", value: "Baked today" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Limited quantity" },
    ],
    coordinates: { lat: 1.3236, lng: 103.9273 },
    seller: SELLERS.foodFreeSG,
  },
];

// ── kids_items ─────────────────────────────────────────────────────────────
export const SG_FREE_KIDS_ITEMS: MockListing[] = [
  {
    id: "free-sg-kids-01", href: "/listings/free-sg-kids-01", advId: "50041",
    images: [{ src: img(9), alt: "Kids toys" }],
    priceLabel: "Free",
    title: "Kids Toys Bundle \u2014 Outgrown, Free to Good Family",
    detailsLabel: "FREE \u2022 KIDS ITEMS \u2022 SINGAPORE",
    locationLabel: "Punggol, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Free bundle of kids toys, outgrown by our children, all in good condition.</p>",
    keyDetails: [
      { key: "Condition", value: "Good" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 1.4043, lng: 103.9021 },
    seller: SELLERS.kidsItemsSG,
  },
  {
    id: "free-sg-kids-02", href: "/listings/free-sg-kids-02", advId: "50042",
    images: [{ src: img(1), alt: "Baby stroller" }],
    priceLabel: "Free",
    title: "Baby Stroller \u2014 Free, Slight Wear on Wheels",
    detailsLabel: "FREE \u2022 KIDS ITEMS \u2022 SINGAPORE",
    locationLabel: "Punggol, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Free baby stroller, slight wear on wheels but folds and functions well.</p>",
    keyDetails: [
      { key: "Condition", value: "Functional" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 1.4043, lng: 103.9021 },
    seller: SELLERS.kidsItemsSG,
  },
];

// ── general_free ─────────────────────────────────────────────────────────────
export const SG_FREE_GENERAL_FREE: MockListing[] = [
  {
    id: "free-sg-general-01", href: "/listings/free-sg-general-01", advId: "50051",
    images: [{ src: img(2), alt: "Household items box" }],
    priceLabel: "Free",
    title: "Assorted Household Items \u2014 Box Lot, First Come First Served",
    detailsLabel: "FREE \u2022 GENERAL \u2022 SINGAPORE",
    locationLabel: "Ang Mo Kio, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Free box lot of assorted household items \u2014 kitchenware, decor, and more.</p>",
    keyDetails: [
      { key: "Type", value: "Assorted" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 1.3691, lng: 103.8454 },
    seller: SELLERS.generalFreeSG,
  },
  {
    id: "free-sg-general-02", href: "/listings/free-sg-general-02", advId: "50052",
    images: [{ src: img(3), alt: "Moving boxes" }],
    priceLabel: "Free",
    title: "Cardboard Moving Boxes \u2014 15 Boxes, Free for Pickup",
    detailsLabel: "FREE \u2022 GENERAL \u2022 SINGAPORE",
    locationLabel: "Ang Mo Kio, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Free 15 cardboard moving boxes, various sizes, used once, good condition.</p>",
    keyDetails: [
      { key: "Quantity", value: "15" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 1.3691, lng: 103.8454 },
    seller: SELLERS.generalFreeSG,
  },
];

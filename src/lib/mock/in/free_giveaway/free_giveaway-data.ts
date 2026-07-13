import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── furniture_free ───────────────────────────────────────────────────────────
export const IN_FREE_FURNITURE_FREE: MockListing[] = [
  {
    id: "free-in-furniture-01", href: "/listings/free-in-furniture-01", advId: "40001",
    images: [{ src: img(1), alt: "Wooden dining table" }],
    priceLabel: "Free",
    title: "Wooden Dining Table \u2014 Seats 4, Minor Wear",
    detailsLabel: "FREE \u2022 FURNITURE \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: hrsAgo(2),
    description: "<p>Free wooden dining table, seats 4, some minor scratches but sturdy. Pickup only.</p>",
    keyDetails: [
      { key: "Seats", value: "4" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.furnitureFreeIndia,
  },
  {
    id: "free-in-furniture-02", href: "/listings/free-in-furniture-02", advId: "40002",
    images: [{ src: img(2), alt: "Bookshelf" }],
    priceLabel: "Free",
    title: "Wooden Bookshelf \u2014 5 Tier, Good Condition",
    detailsLabel: "FREE \u2022 FURNITURE \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: daysAgo(1),
    description: "<p>Free 5-tier wooden bookshelf in good condition, no damage. Pickup only.</p>",
    keyDetails: [
      { key: "Tiers", value: "5" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.furnitureFreeIndia,
  },
];

// ── clothing_free ────────────────────────────────────────────────────────────
export const IN_FREE_CLOTHING_FREE: MockListing[] = [
  {
    id: "free-in-clothing-01", href: "/listings/free-in-clothing-01", advId: "40011",
    images: [{ src: img(3), alt: "Winter jackets" }],
    priceLabel: "Free",
    title: "Winter Jackets \u2014 Bundle of 4, Assorted Sizes",
    detailsLabel: "FREE \u2022 CLOTHING \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: hrsAgo(4),
    description: "<p>Free bundle of 4 winter jackets, assorted sizes, gently used.</p>",
    keyDetails: [
      { key: "Quantity", value: "4" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Gently used" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.clothingFreeIndia,
  },
  {
    id: "free-in-clothing-02", href: "/listings/free-in-clothing-02", advId: "40012",
    images: [{ src: img(4), alt: "Saree collection" }],
    priceLabel: "Free",
    title: "Saree Collection \u2014 6 Pieces, Free to Good Home",
    detailsLabel: "FREE \u2022 CLOTHING \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Free collection of 6 sarees, lightly worn, various colours.</p>",
    keyDetails: [
      { key: "Quantity", value: "6" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Lightly worn" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.clothingFreeIndia,
  },
];

// ── electronics_free ─────────────────────────────────────────────────────────
export const IN_FREE_ELECTRONICS_FREE: MockListing[] = [
  {
    id: "free-in-electronics-01", href: "/listings/free-in-electronics-01", advId: "40021",
    images: [{ src: img(5), alt: "Old CRT TV" }],
    priceLabel: "Free",
    title: "Old CRT Television \u2014 Working, Free for Pickup",
    detailsLabel: "FREE \u2022 ELECTRONICS \u2022 MUMBAI",
    locationLabel: "Powai, Mumbai",
    postedAt: hrsAgo(6),
    description: "<p>Free working CRT television, bulky but functional. Pickup only.</p>",
    keyDetails: [
      { key: "Condition", value: "Working" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 19.1176, lng: 72.9060 },
    seller: SELLERS.electronicsFreeIndia,
  },
  {
    id: "free-in-electronics-02", href: "/listings/free-in-electronics-02", advId: "40022",
    images: [{ src: img(6), alt: "Desktop computer" }],
    priceLabel: "Free",
    title: "Desktop Computer \u2014 Old Spec, Free for Parts or Use",
    detailsLabel: "FREE \u2022 ELECTRONICS \u2022 MUMBAI",
    locationLabel: "Powai, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Free old desktop computer, works but slow, good for spare parts or basic use.</p>",
    keyDetails: [
      { key: "Condition", value: "Working, slow" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 19.1176, lng: 72.9060 },
    seller: SELLERS.electronicsFreeIndia,
  },
];

// ── food_free ──────────────────────────────────────────────────────────────
export const IN_FREE_FOOD_FREE: MockListing[] = [
  {
    id: "free-in-food-01", href: "/listings/free-in-food-01", advId: "40031",
    images: [{ src: img(7), alt: "Homemade meals" }],
    priceLabel: "Free",
    title: "Surplus Homemade Meals \u2014 Available Today Only",
    detailsLabel: "FREE \u2022 FOOD \u2022 CHENNAI",
    locationLabel: "Adyar, Chennai",
    postedAt: hrsAgo(1),
    description: "<p>Free surplus homemade meals, vegetarian, available for pickup today only.</p>",
    keyDetails: [
      { key: "Type", value: "Vegetarian" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Today only" },
    ],
    coordinates: { lat: 13.0012, lng: 80.2565 },
    seller: SELLERS.foodFreeIndia,
  },
  {
    id: "free-in-food-02", href: "/listings/free-in-food-02", advId: "40032",
    images: [{ src: img(8), alt: "Bread loaves" }],
    priceLabel: "Free",
    title: "Fresh Bread Loaves \u2014 Baked Today, Free Pickup",
    detailsLabel: "FREE \u2022 FOOD \u2022 CHENNAI",
    locationLabel: "Adyar, Chennai",
    postedAt: daysAgo(1),
    description: "<p>Free fresh bread loaves baked today, extra batch from home bakery.</p>",
    keyDetails: [
      { key: "Freshness", value: "Baked today" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Limited quantity" },
    ],
    coordinates: { lat: 13.0012, lng: 80.2565 },
    seller: SELLERS.foodFreeIndia,
  },
];

// ── kids_items ─────────────────────────────────────────────────────────────
export const IN_FREE_KIDS_ITEMS: MockListing[] = [
  {
    id: "free-in-kids-01", href: "/listings/free-in-kids-01", advId: "40041",
    images: [{ src: img(9), alt: "Kids toys" }],
    priceLabel: "Free",
    title: "Kids Toys Bundle \u2014 Outgrown, Free to Good Family",
    detailsLabel: "FREE \u2022 KIDS ITEMS \u2022 DELHI",
    locationLabel: "Vasant Kunj, Delhi",
    postedAt: hrsAgo(3),
    description: "<p>Free bundle of kids toys, outgrown by our children, all in good condition.</p>",
    keyDetails: [
      { key: "Condition", value: "Good" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 28.5244, lng: 77.1590 },
    seller: SELLERS.kidsItemsIndia,
  },
  {
    id: "free-in-kids-02", href: "/listings/free-in-kids-02", advId: "40042",
    images: [{ src: img(1), alt: "Baby stroller" }],
    priceLabel: "Free",
    title: "Baby Stroller \u2014 Free, Slight Wear on Wheels",
    detailsLabel: "FREE \u2022 KIDS ITEMS \u2022 DELHI",
    locationLabel: "Vasant Kunj, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Free baby stroller, slight wear on wheels but folds and functions well.</p>",
    keyDetails: [
      { key: "Condition", value: "Functional" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 28.5244, lng: 77.1590 },
    seller: SELLERS.kidsItemsIndia,
  },
];

// ── general_free ─────────────────────────────────────────────────────────────
export const IN_FREE_GENERAL_FREE: MockListing[] = [
  {
    id: "free-in-general-01", href: "/listings/free-in-general-01", advId: "40051",
    images: [{ src: img(2), alt: "Household items box" }],
    priceLabel: "Free",
    title: "Assorted Household Items \u2014 Box Lot, First Come First Served",
    detailsLabel: "FREE \u2022 GENERAL \u2022 HYDERABAD",
    locationLabel: "Banjara Hills, Hyderabad",
    postedAt: hrsAgo(2),
    description: "<p>Free box lot of assorted household items \u2014 kitchenware, decor, and more.</p>",
    keyDetails: [
      { key: "Type", value: "Assorted" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 17.4126, lng: 78.4482 },
    seller: SELLERS.generalFreeIndia,
  },
  {
    id: "free-in-general-02", href: "/listings/free-in-general-02", advId: "40052",
    images: [{ src: img(3), alt: "Moving boxes" }],
    priceLabel: "Free",
    title: "Cardboard Moving Boxes \u2014 15 Boxes, Free for Pickup",
    detailsLabel: "FREE \u2022 GENERAL \u2022 HYDERABAD",
    locationLabel: "Banjara Hills, Hyderabad",
    postedAt: daysAgo(1),
    description: "<p>Free 15 cardboard moving boxes, various sizes, used once, good condition.</p>",
    keyDetails: [
      { key: "Quantity", value: "15" },
    ],
    goodToKnow: [
      { key: "Pickup", value: "Self pickup only" },
    ],
    coordinates: { lat: 17.4126, lng: 78.4482 },
    seller: SELLERS.generalFreeIndia,
  },
];

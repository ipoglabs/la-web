import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── home_cooked ──────────────────────────────────────────────────────────────────
export const SG_FOOD_HOME_COOKED: MockListing[] = [
  {
    id: "food-sg-homecooked-01", href: "/listings/food-sg-homecooked-01", advId: "40001",
    images: [{ src: img(1), alt: "Peranakan meal" }],
    priceLabel: "S$12", priceSuffix: "/ meal",
    title: "Authentic Peranakan Meal Set \u2014 Home-Cooked, Daily Fresh",
    detailsLabel: "HOME-COOKED \u2022 PERANAKAN \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Freshly prepared Peranakan meal set with rice, sambal, and two traditional side dishes. Made fresh daily to order.</p>",
    keyDetails: [
      { key: "Cuisine", value: "Peranakan" },
      { key: "Prep", value: "Fresh daily" },
    ],
    goodToKnow: [
      { key: "Delivery", value: "Within 3km radius" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.homeChefSG,
  },
  {
    id: "food-sg-homecooked-02", href: "/listings/food-sg-homecooked-02", advId: "40002",
    images: [{ src: img(2), alt: "Home-cooked meal" }],
    priceLabel: "S$14", priceSuffix: "/ meal",
    title: "North Indian Home-Cooked Meal \u2014 Roti, Sabzi, Dal, Rice",
    detailsLabel: "HOME-COOKED \u2022 NORTH INDIAN \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Wholesome North Indian home-cooked meal with fresh rotis, seasonal sabzi, dal, and steamed rice.</p>",
    keyDetails: [
      { key: "Cuisine", value: "North Indian" },
    ],
    goodToKnow: [
      { key: "Order Ahead", value: "2 hours notice preferred" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.homeChefSG,
  },
];

// ── catering ──────────────────────────────────────────────────────────────────────
export const SG_FOOD_CATERING: MockListing[] = [
  {
    id: "food-sg-catering-01", href: "/listings/food-sg-catering-01", advId: "40011",
    images: [{ src: img(3), alt: "Wedding catering" }],
    priceLabel: "S$45", priceSuffix: "/ pax",
    title: "Wedding Catering Package \u2014 Multi-Cuisine, 200+ Guests",
    detailsLabel: "CATERING \u2022 WEDDING \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Complete wedding catering package with multi-cuisine menu options, suitable for 200+ guests. Includes service staff and setup.</p>",
    keyDetails: [
      { key: "Minimum Guests", value: "200" },
      { key: "Cuisine", value: "Multi-cuisine" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Service staff + setup" },
    ],
    coordinates: { lat: 1.3298, lng: 103.8925 },
    seller: SELLERS.cateringServiceSG,
  },
  {
    id: "food-sg-catering-02", href: "/listings/food-sg-catering-02", advId: "40012",
    images: [{ src: img(4), alt: "Corporate catering" }],
    priceLabel: "S$25", priceSuffix: "/ pax",
    title: "Corporate Event Catering \u2014 Buffet Style, Min. 50 Pax",
    detailsLabel: "CATERING \u2022 CORPORATE \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Buffet-style catering for corporate events and conferences, minimum 50 guests, with vegetarian and non-vegetarian options.</p>",
    keyDetails: [
      { key: "Minimum Guests", value: "50" },
    ],
    goodToKnow: [
      { key: "Menu", value: "Veg & non-veg options" },
    ],
    coordinates: { lat: 1.3298, lng: 103.8925 },
    seller: SELLERS.cateringServiceSG,
  },
];

// ── tiffin_services ──────────────────────────────────────────────────────────────
export const SG_FOOD_TIFFIN_SERVICES: MockListing[] = [
  {
    id: "food-sg-tiffin-01", href: "/listings/food-sg-tiffin-01", advId: "40021",
    images: [{ src: img(5), alt: "Office meal delivery" }],
    priceLabel: "S$240", priceSuffix: "/ mo",
    title: "Daily Office Meal Delivery \u2014 Monthly Subscription",
    detailsLabel: "TIFFIN SERVICE \u2022 OFFICE \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Monthly meal subscription delivering fresh home-style lunch to your office, Monday to Friday.</p>",
    keyDetails: [
      { key: "Frequency", value: "Mon-Fri" },
    ],
    goodToKnow: [
      { key: "Delivery Time", value: "12:30 PM daily" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.homeCookSG,
  },
  {
    id: "food-sg-tiffin-02", href: "/listings/food-sg-tiffin-02", advId: "40022",
    images: [{ src: img(6), alt: "Diet meal plan" }],
    priceLabel: "S$300", priceSuffix: "/ mo",
    title: "Low-Calorie Diet Meal Plan \u2014 Custom Portion Sizes",
    detailsLabel: "TIFFIN SERVICE \u2022 DIET PLAN \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Nutritionist-designed low-calorie meal plan with custom portion sizes based on your dietary goals.</p>",
    keyDetails: [
      { key: "Plan Type", value: "Low-calorie diet" },
    ],
    goodToKnow: [
      { key: "Customisation", value: "Portion size adjustable" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.homeCookSG,
  },
];

// ── restaurant_deals ──────────────────────────────────────────────────────────────
export const SG_FOOD_RESTAURANT_DEALS: MockListing[] = [
  {
    id: "food-sg-restaurantdeals-01", href: "/listings/food-sg-restaurantdeals-01", advId: "40031",
    images: [{ src: img(7), alt: "Weekday lunch special" }],
    priceLabel: "S$18", priceSuffix: "/ set",
    title: "Weekday Lunch Special \u2014 3-Course Set Menu",
    detailsLabel: "RESTAURANT DEAL \u2022 LUNCH \u2022 SINGAPORE",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>3-course weekday lunch set menu including starter, main course, and dessert, available Monday to Friday.</p>",
    keyDetails: [
      { key: "Availability", value: "Mon-Fri lunch" },
    ],
    goodToKnow: [
      { key: "Reservation", value: "Recommended for groups" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.restaurantDealsSG,
  },
  {
    id: "food-sg-restaurantdeals-02", href: "/listings/food-sg-restaurantdeals-02", advId: "40032",
    images: [{ src: img(8), alt: "Weekend brunch buffet" }],
    priceLabel: "S$58", priceSuffix: "/ person",
    title: "Weekend Brunch Buffet \u2014 Unlimited Food & Drinks",
    detailsLabel: "RESTAURANT DEAL \u2022 BRUNCH \u2022 SINGAPORE",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Unlimited weekend brunch buffet with a wide spread of Asian and continental dishes, plus soft drinks.</p>",
    keyDetails: [
      { key: "Includes", value: "Food + soft drinks" },
    ],
    goodToKnow: [
      { key: "Timing", value: "11 AM - 3 PM, Sat-Sun" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.restaurantDealsSG,
  },
];

// ── cloud_kitchens ──────────────────────────────────────────────────────────────
export const SG_FOOD_CLOUD_KITCHENS: MockListing[] = [
  {
    id: "food-sg-cloudkitchen-01", href: "/listings/food-sg-cloudkitchen-01", advId: "40041",
    images: [{ src: img(9), alt: "Laksa delivery" }],
    priceLabel: "S$12", priceSuffix: "/ box",
    title: "Katong Laksa \u2014 Delivery Only, Made Fresh",
    detailsLabel: "CLOUD KITCHEN \u2022 LAKSA \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: hrsAgo(1),
    description: "<p>Authentic Katong-style laksa, made fresh and delivered hot. Delivery-only kitchen, no dine-in.</p>",
    keyDetails: [
      { key: "Style", value: "Katong laksa" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Delivery only" },
    ],
    coordinates: { lat: 1.3298, lng: 103.8925 },
    seller: SELLERS.cloudKitchenSG,
  },
  {
    id: "food-sg-cloudkitchen-02", href: "/listings/food-sg-cloudkitchen-02", advId: "40042",
    images: [{ src: img(1), alt: "Grilled platter" }],
    priceLabel: "S$16", priceSuffix: "/ platter",
    title: "Mixed Grill Platter \u2014 Satay, Chicken & Sides",
    detailsLabel: "CLOUD KITCHEN \u2022 GRILLS \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Mixed grill platter with assorted satay skewers, grilled chicken, and sides. Delivered hot, delivery-only kitchen.</p>",
    keyDetails: [
      { key: "Includes", value: "Satay + chicken + sides" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Delivery only" },
    ],
    coordinates: { lat: 1.3298, lng: 103.8925 },
    seller: SELLERS.cloudKitchenSG,
  },
];

// ── baked_goods ──────────────────────────────────────────────────────────────────
export const SG_FOOD_BAKED_GOODS: MockListing[] = [
  {
    id: "food-sg-bakedgoods-01", href: "/listings/food-sg-bakedgoods-01", advId: "40051",
    images: [{ src: img(2), alt: "Custom birthday cake" }],
    priceLabel: "S$65",
    title: "Custom Birthday Cake \u2014 1kg, Choice of Flavour & Design",
    detailsLabel: "BAKED GOODS \u2022 CAKES \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>Custom-designed 1kg birthday cake with your choice of flavour and decoration theme. Order 2 days in advance.</p>",
    keyDetails: [
      { key: "Weight", value: "1 kg" },
      { key: "Lead Time", value: "2 days" },
    ],
    goodToKnow: [
      { key: "Customisation", value: "Flavour & design" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.bakedGoodsSG,
  },
  {
    id: "food-sg-bakedgoods-02", href: "/listings/food-sg-bakedgoods-02", advId: "40052",
    images: [{ src: img(3), alt: "Artisan bread" }],
    priceLabel: "S$9",
    title: "Artisan Sourdough Bread \u2014 Freshly Baked Daily",
    detailsLabel: "BAKED GOODS \u2022 BREAD \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Freshly baked artisan sourdough bread, made with a 3-day fermented starter. Baked daily in small batches.</p>",
    keyDetails: [
      { key: "Type", value: "Sourdough" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Limited daily batches" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.bakedGoodsSG,
  },
];

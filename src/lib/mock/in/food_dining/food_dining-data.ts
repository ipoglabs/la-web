import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── home_cooked ──────────────────────────────────────────────────────────────────
export const IN_FOOD_HOME_COOKED: MockListing[] = [
  {
    id: "food-in-homecooked-01", href: "/listings/food-in-homecooked-01", advId: "30001",
    images: [{ src: img(1), alt: "South Indian thali" }],
    priceLabel: "\u20b9150", priceSuffix: "/ meal",
    title: "Authentic South Indian Thali \u2014 Home-Cooked, Daily Fresh",
    detailsLabel: "HOME-COOKED \u2022 SOUTH INDIAN \u2022 CHENNAI",
    locationLabel: "T. Nagar, Chennai",
    postedAt: hrsAgo(2),
    description: "<p>Freshly prepared South Indian thali with rice, sambar, rasam, curd, and two vegetable sides. Made fresh daily to order.</p>",
    keyDetails: [
      { key: "Cuisine", value: "South Indian" },
      { key: "Prep", value: "Fresh daily" },
    ],
    goodToKnow: [
      { key: "Delivery", value: "Within 3km radius" },
    ],
    coordinates: { lat: 13.0418, lng: 80.2341 },
    seller: SELLERS.homeChefIndia,
  },
  {
    id: "food-in-homecooked-02", href: "/listings/food-in-homecooked-02", advId: "30002",
    images: [{ src: img(2), alt: "North Indian meal" }],
    priceLabel: "\u20b9180", priceSuffix: "/ meal",
    title: "North Indian Home-Cooked Meal \u2014 Roti, Sabzi, Dal, Rice",
    detailsLabel: "HOME-COOKED \u2022 NORTH INDIAN \u2022 CHENNAI",
    locationLabel: "T. Nagar, Chennai",
    postedAt: daysAgo(1),
    description: "<p>Wholesome North Indian home-cooked meal with fresh rotis, seasonal sabzi, dal, and steamed rice.</p>",
    keyDetails: [
      { key: "Cuisine", value: "North Indian" },
    ],
    goodToKnow: [
      { key: "Order Ahead", value: "2 hours notice preferred" },
    ],
    coordinates: { lat: 13.0418, lng: 80.2341 },
    seller: SELLERS.homeChefIndia,
  },
];

// ── catering ──────────────────────────────────────────────────────────────────────
export const IN_FOOD_CATERING: MockListing[] = [
  {
    id: "food-in-catering-01", href: "/listings/food-in-catering-01", advId: "30011",
    images: [{ src: img(3), alt: "Wedding catering" }],
    priceLabel: "\u20b9450", priceSuffix: "/ plate",
    title: "Wedding Catering Package \u2014 Multi-Cuisine, 200+ Guests",
    detailsLabel: "CATERING \u2022 WEDDING \u2022 DELHI",
    locationLabel: "Rajouri Garden, Delhi",
    postedAt: hrsAgo(4),
    description: "<p>Complete wedding catering package with multi-cuisine menu options, suitable for 200+ guests. Includes service staff and setup.</p>",
    keyDetails: [
      { key: "Minimum Guests", value: "200" },
      { key: "Cuisine", value: "Multi-cuisine" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Service staff + setup" },
    ],
    coordinates: { lat: 28.6469, lng: 77.1201 },
    seller: SELLERS.cateringServiceIndia,
  },
  {
    id: "food-in-catering-02", href: "/listings/food-in-catering-02", advId: "30012",
    images: [{ src: img(4), alt: "Corporate catering" }],
    priceLabel: "\u20b9250", priceSuffix: "/ plate",
    title: "Corporate Event Catering \u2014 Buffet Style, Min. 50 Pax",
    detailsLabel: "CATERING \u2022 CORPORATE \u2022 DELHI",
    locationLabel: "Rajouri Garden, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Buffet-style catering for corporate events and conferences, minimum 50 guests, with vegetarian and non-vegetarian options.</p>",
    keyDetails: [
      { key: "Minimum Guests", value: "50" },
    ],
    goodToKnow: [
      { key: "Menu", value: "Veg & non-veg options" },
    ],
    coordinates: { lat: 28.6469, lng: 77.1201 },
    seller: SELLERS.cateringServiceIndia,
  },
];

// ── tiffin_services ──────────────────────────────────────────────────────────────
export const IN_FOOD_TIFFIN_SERVICES: MockListing[] = [
  {
    id: "food-in-tiffin-01", href: "/listings/food-in-tiffin-01", advId: "30021",
    images: [{ src: img(5), alt: "Office tiffin" }],
    priceLabel: "\u20b93,000", priceSuffix: "/ mo",
    title: "Daily Office Tiffin Service \u2014 Monthly Subscription",
    detailsLabel: "TIFFIN SERVICE \u2022 OFFICE \u2022 MUMBAI",
    locationLabel: "Andheri, Mumbai",
    postedAt: hrsAgo(6),
    description: "<p>Monthly tiffin subscription delivering fresh home-style lunch to your office, Monday to Saturday.</p>",
    keyDetails: [
      { key: "Frequency", value: "Mon-Sat" },
    ],
    goodToKnow: [
      { key: "Delivery Time", value: "12:30 PM daily" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8468 },
    seller: SELLERS.tiffinWalaIndia,
  },
  {
    id: "food-in-tiffin-02", href: "/listings/food-in-tiffin-02", advId: "30022",
    images: [{ src: img(6), alt: "Diet tiffin" }],
    priceLabel: "\u20b93,800", priceSuffix: "/ mo",
    title: "Low-Calorie Diet Tiffin Plan \u2014 Custom Portion Sizes",
    detailsLabel: "TIFFIN SERVICE \u2022 DIET PLAN \u2022 MUMBAI",
    locationLabel: "Andheri, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Nutritionist-designed low-calorie tiffin plan with custom portion sizes based on your dietary goals.</p>",
    keyDetails: [
      { key: "Plan Type", value: "Low-calorie diet" },
    ],
    goodToKnow: [
      { key: "Customisation", value: "Portion size adjustable" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8468 },
    seller: SELLERS.tiffinWalaIndia,
  },
];

// ── restaurant_deals ──────────────────────────────────────────────────────────────
export const IN_FOOD_RESTAURANT_DEALS: MockListing[] = [
  {
    id: "food-in-restaurantdeals-01", href: "/listings/food-in-restaurantdeals-01", advId: "30031",
    images: [{ src: img(7), alt: "Weekday lunch special" }],
    priceLabel: "\u20b9299", priceSuffix: "/ set",
    title: "Weekday Lunch Special \u2014 3-Course Set Menu",
    detailsLabel: "RESTAURANT DEAL \u2022 LUNCH \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: hrsAgo(3),
    description: "<p>3-course weekday lunch set menu including starter, main course, and dessert, available Monday to Friday.</p>",
    keyDetails: [
      { key: "Availability", value: "Mon-Fri lunch" },
    ],
    goodToKnow: [
      { key: "Reservation", value: "Recommended for groups" },
    ],
    coordinates: { lat: 12.9784, lng: 77.6408 },
    seller: SELLERS.restaurantDealsIndia,
  },
  {
    id: "food-in-restaurantdeals-02", href: "/listings/food-in-restaurantdeals-02", advId: "30032",
    images: [{ src: img(8), alt: "Weekend brunch buffet" }],
    priceLabel: "\u20b9899", priceSuffix: "/ person",
    title: "Weekend Brunch Buffet \u2014 Unlimited Food & Drinks",
    detailsLabel: "RESTAURANT DEAL \u2022 BRUNCH \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Unlimited weekend brunch buffet with a wide spread of Indian and continental dishes, plus soft drinks.</p>",
    keyDetails: [
      { key: "Includes", value: "Food + soft drinks" },
    ],
    goodToKnow: [
      { key: "Timing", value: "11 AM - 3 PM, Sat-Sun" },
    ],
    coordinates: { lat: 12.9784, lng: 77.6408 },
    seller: SELLERS.restaurantDealsIndia,
  },
];

// ── cloud_kitchens ──────────────────────────────────────────────────────────────
export const IN_FOOD_CLOUD_KITCHENS: MockListing[] = [
  {
    id: "food-in-cloudkitchen-01", href: "/listings/food-in-cloudkitchen-01", advId: "30041",
    images: [{ src: img(9), alt: "Biryani delivery" }],
    priceLabel: "\u20b9280", priceSuffix: "/ box",
    title: "Hyderabadi Chicken Biryani \u2014 Delivery Only, Made Fresh",
    detailsLabel: "CLOUD KITCHEN \u2022 BIRYANI \u2022 BENGALURU",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: hrsAgo(1),
    description: "<p>Authentic Hyderabadi-style chicken biryani, made fresh and delivered hot. Delivery-only kitchen, no dine-in.</p>",
    keyDetails: [
      { key: "Style", value: "Hyderabadi" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Delivery only" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.cloudKitchenIndia,
  },
  {
    id: "food-in-cloudkitchen-02", href: "/listings/food-in-cloudkitchen-02", advId: "30042",
    images: [{ src: img(1), alt: "Grilled platter" }],
    priceLabel: "\u20b9350", priceSuffix: "/ platter",
    title: "Mixed Grill Platter \u2014 Kebabs, Tikka & Sides",
    detailsLabel: "CLOUD KITCHEN \u2022 GRILLS \u2022 BENGALURU",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Mixed grill platter with assorted kebabs, chicken tikka, and sides. Delivered hot, delivery-only kitchen.</p>",
    keyDetails: [
      { key: "Includes", value: "Kebabs + tikka + sides" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Delivery only" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.cloudKitchenIndia,
  },
];

// ── baked_goods ──────────────────────────────────────────────────────────────────
export const IN_FOOD_BAKED_GOODS: MockListing[] = [
  {
    id: "food-in-bakedgoods-01", href: "/listings/food-in-bakedgoods-01", advId: "30051",
    images: [{ src: img(2), alt: "Custom birthday cake" }],
    priceLabel: "\u20b91,500",
    title: "Custom Birthday Cake \u2014 1kg, Choice of Flavour & Design",
    detailsLabel: "BAKED GOODS \u2022 CAKES \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: hrsAgo(8),
    description: "<p>Custom-designed 1kg birthday cake with your choice of flavour and decoration theme. Order 2 days in advance.</p>",
    keyDetails: [
      { key: "Weight", value: "1 kg" },
      { key: "Lead Time", value: "2 days" },
    ],
    goodToKnow: [
      { key: "Customisation", value: "Flavour & design" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.bakedGoodsIndia,
  },
  {
    id: "food-in-bakedgoods-02", href: "/listings/food-in-bakedgoods-02", advId: "30052",
    images: [{ src: img(3), alt: "Artisan bread" }],
    priceLabel: "\u20b9180",
    title: "Artisan Sourdough Bread \u2014 Freshly Baked Daily",
    detailsLabel: "BAKED GOODS \u2022 BREAD \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: daysAgo(1),
    description: "<p>Freshly baked artisan sourdough bread, made with a 3-day fermented starter. Baked daily in small batches.</p>",
    keyDetails: [
      { key: "Type", value: "Sourdough" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Limited daily batches" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.bakedGoodsIndia,
  },
];

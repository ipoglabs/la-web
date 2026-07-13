import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── sofas_seating ──────────────────────────────────────────────────────────
export const IN_HOME_SOFAS_SEATING: MockListing[] = [
  {
    id: "home-in-sofa-01", href: "/listings/home-in-sofa-01", advId: "35001",
    images: [{ src: img(6), alt: "3-seater sofa" }],
    priceLabel: "\u20b918,000",
    title: "3-Seater Fabric Sofa \u2014 Grey, Excellent Condition",
    detailsLabel: "SOFAS & SEATING \u2022 SOFA \u2022 HYDERABAD",
    locationLabel: "Kondapur, Hyderabad",
    postedAt: hrsAgo(2),
    description: "<p>Comfortable 3-seater fabric sofa in grey, excellent condition, no tears or stains.</p>",
    keyDetails: [
      { key: "Seating", value: "3-seater" },
    ],
    goodToKnow: [
      { key: "Material", value: "Fabric" },
    ],
    coordinates: { lat: 17.4615, lng: 78.3502 },
    seller: SELLERS.sofaSeatingIndia,
  },
  {
    id: "home-in-sofa-02", href: "/listings/home-in-sofa-02", advId: "35002",
    images: [{ src: img(7), alt: "Recliner chair" }],
    priceLabel: "\u20b912,500",
    title: "Single Recliner Chair \u2014 Leatherette, Manual Recline",
    detailsLabel: "SOFAS & SEATING \u2022 RECLINER \u2022 HYDERABAD",
    locationLabel: "Kondapur, Hyderabad",
    postedAt: daysAgo(1),
    description: "<p>Single recliner chair in leatherette upholstery with manual recline mechanism.</p>",
    keyDetails: [
      { key: "Material", value: "Leatherette" },
    ],
    goodToKnow: [
      { key: "Recline Type", value: "Manual" },
    ],
    coordinates: { lat: 17.4615, lng: 78.3502 },
    seller: SELLERS.sofaSeatingIndia,
  },
];

// ── beds_bedroom ──────────────────────────────────────────────────────────
export const IN_HOME_BEDS_BEDROOM: MockListing[] = [
  {
    id: "home-in-bed-01", href: "/listings/home-in-bed-01", advId: "35011",
    images: [{ src: img(8), alt: "Queen size bed" }],
    priceLabel: "\u20b915,000",
    title: "Queen Size Bed Frame \u2014 Solid Wood, Storage Included",
    detailsLabel: "BEDS & BEDROOM \u2022 BED FRAME \u2022 PUNE",
    locationLabel: "Baner, Pune",
    postedAt: hrsAgo(4),
    description: "<p>Queen size solid wood bed frame with under-bed storage drawers.</p>",
    keyDetails: [
      { key: "Size", value: "Queen" },
    ],
    goodToKnow: [
      { key: "Storage", value: "Included" },
    ],
    coordinates: { lat: 18.5590, lng: 73.7868 },
    seller: SELLERS.bedsIndia,
  },
  {
    id: "home-in-bed-02", href: "/listings/home-in-bed-02", advId: "35012",
    images: [{ src: img(9), alt: "Mattress" }],
    priceLabel: "\u20b98,500",
    title: "Memory Foam Mattress \u2014 Queen Size, 8 Inch",
    detailsLabel: "BEDS & BEDROOM \u2022 MATTRESS \u2022 PUNE",
    locationLabel: "Baner, Pune",
    postedAt: daysAgo(2),
    description: "<p>8-inch memory foam mattress, queen size, provides excellent back support.</p>",
    keyDetails: [
      { key: "Thickness", value: "8 inch" },
    ],
    goodToKnow: [
      { key: "Material", value: "Memory foam" },
    ],
    coordinates: { lat: 18.5590, lng: 73.7868 },
    seller: SELLERS.bedsIndia,
  },
];

// ── tables_dining ──────────────────────────────────────────────────────────
export const IN_HOME_TABLES_DINING: MockListing[] = [
  {
    id: "home-in-dining-01", href: "/listings/home-in-dining-01", advId: "35021",
    images: [{ src: img(1), alt: "6-seater dining table" }],
    priceLabel: "\u20b922,000",
    title: "6-Seater Dining Table Set \u2014 Solid Wood, With Chairs",
    detailsLabel: "TABLES & DINING \u2022 DINING SET \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: hrsAgo(6),
    description: "<p>Solid wood 6-seater dining table set including matching chairs, sturdy build.</p>",
    keyDetails: [
      { key: "Seating", value: "6" },
    ],
    goodToKnow: [
      { key: "Material", value: "Solid wood" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.diningIndia,
  },
  {
    id: "home-in-dining-02", href: "/listings/home-in-dining-02", advId: "35022",
    images: [{ src: img(2), alt: "Coffee table" }],
    priceLabel: "\u20b93,500",
    title: "Coffee Table \u2014 Glass Top, Metal Legs",
    detailsLabel: "TABLES & DINING \u2022 COFFEE TABLE \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Modern coffee table with tempered glass top and sturdy metal legs.</p>",
    keyDetails: [
      { key: "Top Material", value: "Tempered glass" },
    ],
    goodToKnow: [
      { key: "Legs", value: "Metal" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.diningIndia,
  },
];

// ── kitchen_appliances ──────────────────────────────────────────────────────────
export const IN_HOME_KITCHEN_APPLIANCES: MockListing[] = [
  {
    id: "home-in-kitchen-01", href: "/listings/home-in-kitchen-01", advId: "35031",
    images: [{ src: img(3), alt: "Refrigerator" }],
    priceLabel: "\u20b916,500",
    title: "Double Door Refrigerator \u2014 300L, Frost Free",
    detailsLabel: "KITCHEN APPLIANCES \u2022 REFRIGERATOR \u2022 NAVI MUMBAI",
    locationLabel: "Vashi, Navi Mumbai",
    postedAt: hrsAgo(8),
    description: "<p>300L double door frost-free refrigerator, energy efficient and spacious.</p>",
    keyDetails: [
      { key: "Capacity", value: "300L" },
    ],
    goodToKnow: [
      { key: "Type", value: "Frost free" },
    ],
    coordinates: { lat: 19.0771, lng: 73.0028 },
    seller: SELLERS.kitchenApplIndia,
  },
  {
    id: "home-in-kitchen-02", href: "/listings/home-in-kitchen-02", advId: "35032",
    images: [{ src: img(4), alt: "Microwave oven" }],
    priceLabel: "\u20b94,800",
    title: "Convection Microwave Oven \u2014 25L, Grill Function",
    detailsLabel: "KITCHEN APPLIANCES \u2022 MICROWAVE \u2022 NAVI MUMBAI",
    locationLabel: "Vashi, Navi Mumbai",
    postedAt: daysAgo(1),
    description: "<p>25L convection microwave oven with grill function, great for baking and reheating.</p>",
    keyDetails: [
      { key: "Capacity", value: "25L" },
    ],
    goodToKnow: [
      { key: "Function", value: "Convection + Grill" },
    ],
    coordinates: { lat: 19.0771, lng: 73.0028 },
    seller: SELLERS.kitchenApplIndia,
  },
];

// ── storage_shelving ──────────────────────────────────────────────────────────
export const IN_HOME_STORAGE_SHELVING: MockListing[] = [
  {
    id: "home-in-storage-01", href: "/listings/home-in-storage-01", advId: "35041",
    images: [{ src: img(5), alt: "Bookshelf" }],
    priceLabel: "\u20b94,200",
    title: "5-Tier Bookshelf \u2014 Engineered Wood, Open Design",
    detailsLabel: "STORAGE & SHELVING \u2022 BOOKSHELF \u2022 CHENNAI",
    locationLabel: "Alwarpet, Chennai",
    postedAt: hrsAgo(10),
    description: "<p>5-tier open bookshelf made of engineered wood, sturdy and easy to assemble.</p>",
    keyDetails: [
      { key: "Tiers", value: "5" },
    ],
    goodToKnow: [
      { key: "Material", value: "Engineered wood" },
    ],
    coordinates: { lat: 13.0339, lng: 80.2542 },
    seller: SELLERS.storageIndia,
  },
  {
    id: "home-in-storage-02", href: "/listings/home-in-storage-02", advId: "35042",
    images: [{ src: img(6), alt: "Storage cabinet" }],
    priceLabel: "\u20b96,000",
    title: "Multi-Purpose Storage Cabinet \u2014 3 Doors, Lockable",
    detailsLabel: "STORAGE & SHELVING \u2022 CABINET \u2022 CHENNAI",
    locationLabel: "Alwarpet, Chennai",
    postedAt: daysAgo(2),
    description: "<p>3-door multi-purpose storage cabinet with lockable doors, ideal for closets or utility rooms.</p>",
    keyDetails: [
      { key: "Doors", value: "3" },
    ],
    goodToKnow: [
      { key: "Lockable", value: "Yes" },
    ],
    coordinates: { lat: 13.0339, lng: 80.2542 },
    seller: SELLERS.storageIndia,
  },
];

// ── home_decor ──────────────────────────────────────────────────────────────
export const IN_HOME_DECOR: MockListing[] = [
  {
    id: "home-in-decor-01", href: "/listings/home-in-decor-01", advId: "35051",
    images: [{ src: img(7), alt: "Wall art" }],
    priceLabel: "\u20b91,800",
    title: "Abstract Canvas Wall Art \u2014 Set of 3, Framed",
    detailsLabel: "HOME DECOR \u2022 WALL ART \u2022 DELHI",
    locationLabel: "CP, Delhi",
    postedAt: hrsAgo(12),
    description: "<p>Set of 3 framed abstract canvas wall art pieces, ready to hang.</p>",
    keyDetails: [
      { key: "Pieces", value: "3" },
    ],
    goodToKnow: [
      { key: "Framed", value: "Yes" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    seller: SELLERS.homeDecorIndia,
  },
  {
    id: "home-in-decor-02", href: "/listings/home-in-decor-02", advId: "35052",
    images: [{ src: img(8), alt: "Table lamp" }],
    priceLabel: "\u20b92,200",
    title: "Ceramic Table Lamp \u2014 Warm White LED, Modern Design",
    detailsLabel: "HOME DECOR \u2022 LIGHTING \u2022 DELHI",
    locationLabel: "CP, Delhi",
    postedAt: daysAgo(1),
    description: "<p>Modern ceramic table lamp with warm white LED bulb, adds ambient lighting to any room.</p>",
    keyDetails: [
      { key: "Bulb Type", value: "LED" },
    ],
    goodToKnow: [
      { key: "Light Color", value: "Warm white" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    seller: SELLERS.homeDecorIndia,
  },
];

// ── garden_outdoor ──────────────────────────────────────────────────────────
export const IN_HOME_GARDEN_OUTDOOR: MockListing[] = [
  {
    id: "home-in-garden-01", href: "/listings/home-in-garden-01", advId: "35061",
    images: [{ src: img(9), alt: "Ceramic planters" }],
    priceLabel: "\u20b91,500",
    title: "Ceramic Planter Set \u2014 3 Sizes, Drainage Holes",
    detailsLabel: "GARDEN & OUTDOOR \u2022 PLANTERS \u2022 BENGALURU",
    locationLabel: "Whitefield, Bengaluru",
    postedAt: hrsAgo(14),
    description: "<p>Set of 3 ceramic planters in different sizes, each with drainage holes for healthy plants.</p>",
    keyDetails: [
      { key: "Set Size", value: "3" },
    ],
    goodToKnow: [
      { key: "Drainage", value: "Yes" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.gardenIndia,
  },
  {
    id: "home-in-garden-02", href: "/listings/home-in-garden-02", advId: "35062",
    images: [{ src: img(1), alt: "Outdoor bench" }],
    priceLabel: "\u20b95,500",
    title: "Wooden Outdoor Bench \u2014 Weather Resistant, 2-Seater",
    detailsLabel: "GARDEN & OUTDOOR \u2022 FURNITURE \u2022 BENGALURU",
    locationLabel: "Whitefield, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Weather-resistant wooden outdoor bench, seats 2 comfortably, perfect for gardens or patios.</p>",
    keyDetails: [
      { key: "Seating", value: "2-seater" },
    ],
    goodToKnow: [
      { key: "Weather Resistant", value: "Yes" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.gardenIndia,
  },
];

// ── diy_tools ──────────────────────────────────────────────────────────────
export const IN_HOME_DIY_TOOLS: MockListing[] = [
  {
    id: "home-in-diy-01", href: "/listings/home-in-diy-01", advId: "35071",
    images: [{ src: img(2), alt: "Cordless drill" }],
    priceLabel: "\u20b93,800",
    title: "Cordless Drill Machine \u2014 18V, With Battery & Charger",
    detailsLabel: "DIY & TOOLS \u2022 POWER TOOLS \u2022 BENGALURU",
    locationLabel: "Peenya, Bengaluru",
    postedAt: hrsAgo(16),
    description: "<p>18V cordless drill machine with rechargeable battery and charger, suitable for home DIY projects.</p>",
    keyDetails: [
      { key: "Voltage", value: "18V" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Battery + charger" },
    ],
    coordinates: { lat: 13.0284, lng: 77.5205 },
    seller: SELLERS.diyToolsIndia,
  },
  {
    id: "home-in-diy-02", href: "/listings/home-in-diy-02", advId: "35072",
    images: [{ src: img(3), alt: "Tool kit" }],
    priceLabel: "\u20b92,000",
    title: "Complete Tool Kit \u2014 45 Pieces, Carrying Case",
    detailsLabel: "DIY & TOOLS \u2022 TOOL KIT \u2022 BENGALURU",
    locationLabel: "Peenya, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>45-piece complete tool kit with carrying case, ideal for household repairs and DIY tasks.</p>",
    keyDetails: [
      { key: "Pieces", value: "45" },
    ],
    goodToKnow: [
      { key: "Case Included", value: "Yes" },
    ],
    coordinates: { lat: 13.0284, lng: 77.5205 },
    seller: SELLERS.diyToolsIndia,
  },
];

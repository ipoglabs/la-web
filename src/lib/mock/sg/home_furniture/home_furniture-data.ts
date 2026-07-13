import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── sofas_seating ──────────────────────────────────────────────────────────
export const SG_HOME_SOFAS_SEATING: MockListing[] = [
  {
    id: "home-sg-sofa-01", href: "/listings/home-sg-sofa-01", advId: "45001",
    images: [{ src: img(6), alt: "3-seater sofa" }],
    priceLabel: "S$380",
    title: "3-Seater Fabric Sofa \u2014 Grey, Excellent Condition",
    detailsLabel: "SOFAS & SEATING \u2022 SOFA \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Comfortable 3-seater fabric sofa in grey, excellent condition, no tears or stains.</p>",
    keyDetails: [
      { key: "Seating", value: "3-seater" },
    ],
    goodToKnow: [
      { key: "Material", value: "Fabric" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.sofaSeatingSG,
  },
  {
    id: "home-sg-sofa-02", href: "/listings/home-sg-sofa-02", advId: "45002",
    images: [{ src: img(7), alt: "Recliner chair" }],
    priceLabel: "S$260",
    title: "Single Recliner Chair \u2014 Leatherette, Manual Recline",
    detailsLabel: "SOFAS & SEATING \u2022 RECLINER \u2022 SINGAPORE",
    locationLabel: "Tampines, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Single recliner chair in leatherette upholstery with manual recline mechanism.</p>",
    keyDetails: [
      { key: "Material", value: "Leatherette" },
    ],
    goodToKnow: [
      { key: "Recline Type", value: "Manual" },
    ],
    coordinates: { lat: 1.3496, lng: 103.9568 },
    seller: SELLERS.sofaSeatingSG,
  },
];

// ── beds_bedroom ──────────────────────────────────────────────────────────
export const SG_HOME_BEDS_BEDROOM: MockListing[] = [
  {
    id: "home-sg-bed-01", href: "/listings/home-sg-bed-01", advId: "45011",
    images: [{ src: img(8), alt: "Queen size bed" }],
    priceLabel: "S$320",
    title: "Queen Size Bed Frame \u2014 Solid Wood, Storage Included",
    detailsLabel: "BEDS & BEDROOM \u2022 BED FRAME \u2022 SINGAPORE",
    locationLabel: "Bedok, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Queen size solid wood bed frame with under-bed storage drawers.</p>",
    keyDetails: [
      { key: "Size", value: "Queen" },
    ],
    goodToKnow: [
      { key: "Storage", value: "Included" },
    ],
    coordinates: { lat: 1.3236, lng: 103.9273 },
    seller: SELLERS.bedsSG,
  },
  {
    id: "home-sg-bed-02", href: "/listings/home-sg-bed-02", advId: "45012",
    images: [{ src: img(9), alt: "Mattress" }],
    priceLabel: "S$180",
    title: "Memory Foam Mattress \u2014 Queen Size, 8 Inch",
    detailsLabel: "BEDS & BEDROOM \u2022 MATTRESS \u2022 SINGAPORE",
    locationLabel: "Bedok, Singapore",
    postedAt: daysAgo(2),
    description: "<p>8-inch memory foam mattress, queen size, provides excellent back support.</p>",
    keyDetails: [
      { key: "Thickness", value: "8 inch" },
    ],
    goodToKnow: [
      { key: "Material", value: "Memory foam" },
    ],
    coordinates: { lat: 1.3236, lng: 103.9273 },
    seller: SELLERS.bedsSG,
  },
];

// ── tables_dining ──────────────────────────────────────────────────────────
export const SG_HOME_TABLES_DINING: MockListing[] = [
  {
    id: "home-sg-dining-01", href: "/listings/home-sg-dining-01", advId: "45021",
    images: [{ src: img(1), alt: "6-seater dining table" }],
    priceLabel: "S$450",
    title: "6-Seater Dining Table Set \u2014 Solid Wood, With Chairs",
    detailsLabel: "TABLES & DINING \u2022 DINING SET \u2022 SINGAPORE",
    locationLabel: "Joo Chiat, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Solid wood 6-seater dining table set including matching chairs, sturdy build.</p>",
    keyDetails: [
      { key: "Seating", value: "6" },
    ],
    goodToKnow: [
      { key: "Material", value: "Solid wood" },
    ],
    coordinates: { lat: 1.3130, lng: 103.9027 },
    seller: SELLERS.diningSG,
  },
  {
    id: "home-sg-dining-02", href: "/listings/home-sg-dining-02", advId: "45022",
    images: [{ src: img(2), alt: "Coffee table" }],
    priceLabel: "S$75",
    title: "Coffee Table \u2014 Glass Top, Metal Legs",
    detailsLabel: "TABLES & DINING \u2022 COFFEE TABLE \u2022 SINGAPORE",
    locationLabel: "Joo Chiat, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Modern coffee table with tempered glass top and sturdy metal legs.</p>",
    keyDetails: [
      { key: "Top Material", value: "Tempered glass" },
    ],
    goodToKnow: [
      { key: "Legs", value: "Metal" },
    ],
    coordinates: { lat: 1.3130, lng: 103.9027 },
    seller: SELLERS.diningSG,
  },
];

// ── kitchen_appliances ──────────────────────────────────────────────────────────
export const SG_HOME_KITCHEN_APPLIANCES: MockListing[] = [
  {
    id: "home-sg-kitchen-01", href: "/listings/home-sg-kitchen-01", advId: "45031",
    images: [{ src: img(3), alt: "Refrigerator" }],
    priceLabel: "S$350",
    title: "Double Door Refrigerator \u2014 300L, Frost Free",
    detailsLabel: "KITCHEN APPLIANCES \u2022 REFRIGERATOR \u2022 SINGAPORE",
    locationLabel: "Jurong West, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>300L double door frost-free refrigerator, energy efficient and spacious.</p>",
    keyDetails: [
      { key: "Capacity", value: "300L" },
    ],
    goodToKnow: [
      { key: "Type", value: "Frost free" },
    ],
    coordinates: { lat: 1.3404, lng: 103.7090 },
    seller: SELLERS.kitchenApplSG,
  },
  {
    id: "home-sg-kitchen-02", href: "/listings/home-sg-kitchen-02", advId: "45032",
    images: [{ src: img(4), alt: "Microwave oven" }],
    priceLabel: "S$100",
    title: "Convection Microwave Oven \u2014 25L, Grill Function",
    detailsLabel: "KITCHEN APPLIANCES \u2022 MICROWAVE \u2022 SINGAPORE",
    locationLabel: "Jurong West, Singapore",
    postedAt: daysAgo(1),
    description: "<p>25L convection microwave oven with grill function, great for baking and reheating.</p>",
    keyDetails: [
      { key: "Capacity", value: "25L" },
    ],
    goodToKnow: [
      { key: "Function", value: "Convection + Grill" },
    ],
    coordinates: { lat: 1.3404, lng: 103.7090 },
    seller: SELLERS.kitchenApplSG,
  },
];

// ── storage_shelving ──────────────────────────────────────────────────────────
export const SG_HOME_STORAGE_SHELVING: MockListing[] = [
  {
    id: "home-sg-storage-01", href: "/listings/home-sg-storage-01", advId: "45041",
    images: [{ src: img(5), alt: "Bookshelf" }],
    priceLabel: "S$90",
    title: "5-Tier Bookshelf \u2014 Engineered Wood, Open Design",
    detailsLabel: "STORAGE & SHELVING \u2022 BOOKSHELF \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>5-tier open bookshelf made of engineered wood, sturdy and easy to assemble.</p>",
    keyDetails: [
      { key: "Tiers", value: "5" },
    ],
    goodToKnow: [
      { key: "Material", value: "Engineered wood" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.storageSG,
  },
  {
    id: "home-sg-storage-02", href: "/listings/home-sg-storage-02", advId: "45042",
    images: [{ src: img(6), alt: "Storage cabinet" }],
    priceLabel: "S$130",
    title: "Multi-Purpose Storage Cabinet \u2014 3 Doors, Lockable",
    detailsLabel: "STORAGE & SHELVING \u2022 CABINET \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: daysAgo(2),
    description: "<p>3-door multi-purpose storage cabinet with lockable doors, ideal for closets or utility rooms.</p>",
    keyDetails: [
      { key: "Doors", value: "3" },
    ],
    goodToKnow: [
      { key: "Lockable", value: "Yes" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.storageSG,
  },
];

// ── home_decor ──────────────────────────────────────────────────────────────
export const SG_HOME_DECOR: MockListing[] = [
  {
    id: "home-sg-decor-01", href: "/listings/home-sg-decor-01", advId: "45051",
    images: [{ src: img(7), alt: "Wall art" }],
    priceLabel: "S$40",
    title: "Abstract Canvas Wall Art \u2014 Set of 3, Framed",
    detailsLabel: "HOME DECOR \u2022 WALL ART \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: hrsAgo(12),
    description: "<p>Set of 3 framed abstract canvas wall art pieces, ready to hang.</p>",
    keyDetails: [
      { key: "Pieces", value: "3" },
    ],
    goodToKnow: [
      { key: "Framed", value: "Yes" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.homeDecorSG,
  },
  {
    id: "home-sg-decor-02", href: "/listings/home-sg-decor-02", advId: "45052",
    images: [{ src: img(8), alt: "Table lamp" }],
    priceLabel: "S$48",
    title: "Ceramic Table Lamp \u2014 Warm White LED, Modern Design",
    detailsLabel: "HOME DECOR \u2022 LIGHTING \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Modern ceramic table lamp with warm white LED bulb, adds ambient lighting to any room.</p>",
    keyDetails: [
      { key: "Bulb Type", value: "LED" },
    ],
    goodToKnow: [
      { key: "Light Color", value: "Warm white" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.homeDecorSG,
  },
];

// ── garden_outdoor ──────────────────────────────────────────────────────────
export const SG_HOME_GARDEN_OUTDOOR: MockListing[] = [
  {
    id: "home-sg-garden-01", href: "/listings/home-sg-garden-01", advId: "45061",
    images: [{ src: img(9), alt: "Ceramic planters" }],
    priceLabel: "S$35",
    title: "Ceramic Planter Set \u2014 3 Sizes, Drainage Holes",
    detailsLabel: "GARDEN & OUTDOOR \u2022 PLANTERS \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: hrsAgo(14),
    description: "<p>Set of 3 ceramic planters in different sizes, each with drainage holes for healthy plants.</p>",
    keyDetails: [
      { key: "Set Size", value: "3" },
    ],
    goodToKnow: [
      { key: "Drainage", value: "Yes" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.gardenSG,
  },
  {
    id: "home-sg-garden-02", href: "/listings/home-sg-garden-02", advId: "45062",
    images: [{ src: img(1), alt: "Outdoor bench" }],
    priceLabel: "S$130",
    title: "Wooden Outdoor Bench \u2014 Weather Resistant, 2-Seater",
    detailsLabel: "GARDEN & OUTDOOR \u2022 FURNITURE \u2022 SINGAPORE",
    locationLabel: "Yishun, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Weather-resistant wooden outdoor bench, seats 2 comfortably, perfect for gardens or patios.</p>",
    keyDetails: [
      { key: "Seating", value: "2-seater" },
    ],
    goodToKnow: [
      { key: "Weather Resistant", value: "Yes" },
    ],
    coordinates: { lat: 1.4304, lng: 103.8354 },
    seller: SELLERS.gardenSG,
  },
];

// ── diy_tools ──────────────────────────────────────────────────────────────
export const SG_HOME_DIY_TOOLS: MockListing[] = [
  {
    id: "home-sg-diy-01", href: "/listings/home-sg-diy-01", advId: "45071",
    images: [{ src: img(2), alt: "Cordless drill" }],
    priceLabel: "S$90",
    title: "Cordless Drill Machine \u2014 18V, With Battery & Charger",
    detailsLabel: "DIY & TOOLS \u2022 POWER TOOLS \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: hrsAgo(16),
    description: "<p>18V cordless drill machine with rechargeable battery and charger, suitable for home DIY projects.</p>",
    keyDetails: [
      { key: "Voltage", value: "18V" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Battery + charger" },
    ],
    coordinates: { lat: 1.3300, lng: 103.8998 },
    seller: SELLERS.diyToolsSG,
  },
  {
    id: "home-sg-diy-02", href: "/listings/home-sg-diy-02", advId: "45072",
    images: [{ src: img(3), alt: "Tool kit" }],
    priceLabel: "S$48",
    title: "Complete Tool Kit \u2014 45 Pieces, Carrying Case",
    detailsLabel: "DIY & TOOLS \u2022 TOOL KIT \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: daysAgo(1),
    description: "<p>45-piece complete tool kit with carrying case, ideal for household repairs and DIY tasks.</p>",
    keyDetails: [
      { key: "Pieces", value: "45" },
    ],
    goodToKnow: [
      { key: "Case Included", value: "Yes" },
    ],
    coordinates: { lat: 1.3300, lng: 103.8998 },
    seller: SELLERS.diyToolsSG,
  },
];

import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── mobile_tablets ──────────────────────────────────────────────────────────
export const IN_TECH_MOBILE_TABLETS: MockListing[] = [
  {
    id: "tech-in-mobile-01", href: "/listings/tech-in-mobile-01", advId: "34001",
    images: [{ src: img(1), alt: "Smartphone" }],
    priceLabel: "\u20b922,000",
    title: "Smartphone \u2014 128GB, 6.5\" AMOLED, Dual SIM",
    detailsLabel: "MOBILE & TABLETS \u2022 SMARTPHONE \u2022 DELHI",
    locationLabel: "Nehru Place, Delhi",
    postedAt: hrsAgo(1),
    description: "<p>128GB smartphone with 6.5-inch AMOLED display, dual SIM support, and fast charging.</p>",
    keyDetails: [
      { key: "Storage", value: "128GB" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "3 months seller warranty" },
    ],
    coordinates: { lat: 28.5487, lng: 77.2519 },
    seller: SELLERS.mobileTabletsIndia,
  },
  {
    id: "tech-in-mobile-02", href: "/listings/tech-in-mobile-02", advId: "34002",
    images: [{ src: img(2), alt: "Tablet" }],
    priceLabel: "\u20b915,500",
    title: "10-inch Tablet \u2014 64GB, Wi-Fi + Cellular",
    detailsLabel: "MOBILE & TABLETS \u2022 TABLET \u2022 DELHI",
    locationLabel: "Nehru Place, Delhi",
    postedAt: daysAgo(1),
    description: "<p>10-inch tablet with 64GB storage, Wi-Fi and cellular connectivity, great for media and browsing.</p>",
    keyDetails: [
      { key: "Screen Size", value: "10 inch" },
    ],
    goodToKnow: [
      { key: "Connectivity", value: "Wi-Fi + Cellular" },
    ],
    coordinates: { lat: 28.5487, lng: 77.2519 },
    seller: SELLERS.mobileTabletsIndia,
  },
];

// ── laptops_computers ──────────────────────────────────────────────────────────
export const IN_TECH_LAPTOPS_COMPUTERS: MockListing[] = [
  {
    id: "tech-in-laptop-01", href: "/listings/tech-in-laptop-01", advId: "34011",
    images: [{ src: img(3), alt: "Laptop" }],
    priceLabel: "\u20b942,000",
    title: "Refurbished Laptop \u2014 i5, 16GB RAM, 512GB SSD",
    detailsLabel: "LAPTOPS & COMPUTERS \u2022 LAPTOP \u2022 BENGALURU",
    locationLabel: "SP Road, Bengaluru",
    postedAt: hrsAgo(3),
    description: "<p>Refurbished laptop with Intel i5 processor, 16GB RAM and 512GB SSD, 6-month warranty included.</p>",
    keyDetails: [
      { key: "Processor", value: "Intel i5" },
      { key: "RAM", value: "16GB" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "6 months" },
    ],
    coordinates: { lat: 12.9756, lng: 77.5773 },
    seller: SELLERS.laptopsIndia,
  },
  {
    id: "tech-in-laptop-02", href: "/listings/tech-in-laptop-02", advId: "34012",
    images: [{ src: img(4), alt: "Desktop PC" }],
    priceLabel: "\u20b935,000",
    title: "Desktop PC \u2014 Ryzen 5, 16GB RAM, GTX 1660",
    detailsLabel: "LAPTOPS & COMPUTERS \u2022 DESKTOP \u2022 BENGALURU",
    locationLabel: "SP Road, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Gaming-ready desktop PC with Ryzen 5 processor, 16GB RAM and GTX 1660 graphics card.</p>",
    keyDetails: [
      { key: "GPU", value: "GTX 1660" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "3 months" },
    ],
    coordinates: { lat: 12.9756, lng: 77.5773 },
    seller: SELLERS.laptopsIndia,
  },
];

// ── tvs_audio ──────────────────────────────────────────────────────────────
export const IN_TECH_TVS_AUDIO: MockListing[] = [
  {
    id: "tech-in-tv-01", href: "/listings/tech-in-tv-01", advId: "34021",
    images: [{ src: img(5), alt: "Smart TV" }],
    priceLabel: "\u20b928,000",
    title: "55-inch 4K Smart TV \u2014 HDR, Android TV",
    detailsLabel: "TVS & AUDIO \u2022 SMART TV \u2022 MUMBAI",
    locationLabel: "Lamington Road, Mumbai",
    postedAt: hrsAgo(6),
    description: "<p>55-inch 4K Smart TV with HDR support and built-in Android TV for streaming apps.</p>",
    keyDetails: [
      { key: "Screen Size", value: "55 inch" },
    ],
    goodToKnow: [
      { key: "Resolution", value: "4K UHD" },
    ],
    coordinates: { lat: 18.9614, lng: 72.8228 },
    seller: SELLERS.tvAudioIndia,
  },
  {
    id: "tech-in-tv-02", href: "/listings/tech-in-tv-02", advId: "34022",
    images: [{ src: img(6), alt: "Soundbar" }],
    priceLabel: "\u20b96,500",
    title: "Soundbar with Subwoofer \u2014 2.1 Channel, Bluetooth",
    detailsLabel: "TVS & AUDIO \u2022 SOUNDBAR \u2022 MUMBAI",
    locationLabel: "Lamington Road, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>2.1 channel soundbar with wireless subwoofer and Bluetooth connectivity for immersive audio.</p>",
    keyDetails: [
      { key: "Channels", value: "2.1" },
    ],
    goodToKnow: [
      { key: "Connectivity", value: "Bluetooth + HDMI ARC" },
    ],
    coordinates: { lat: 18.9614, lng: 72.8228 },
    seller: SELLERS.tvAudioIndia,
  },
];

// ── gaming ──────────────────────────────────────────────────────────────
export const IN_TECH_GAMING: MockListing[] = [
  {
    id: "tech-in-gaming-01", href: "/listings/tech-in-gaming-01", advId: "34031",
    images: [{ src: img(7), alt: "Gaming console" }],
    priceLabel: "\u20b932,000",
    title: "Gaming Console \u2014 1TB, 2 Controllers, 3 Games",
    detailsLabel: "GAMING \u2022 CONSOLE \u2022 DELHI",
    locationLabel: "Rajouri Garden, Delhi",
    postedAt: hrsAgo(4),
    description: "<p>1TB gaming console bundle with 2 controllers and 3 popular games included.</p>",
    keyDetails: [
      { key: "Storage", value: "1TB" },
    ],
    goodToKnow: [
      { key: "Includes", value: "2 controllers + 3 games" },
    ],
    coordinates: { lat: 28.6469, lng: 77.1197 },
    seller: SELLERS.gamingIndia,
  },
  {
    id: "tech-in-gaming-02", href: "/listings/tech-in-gaming-02", advId: "34032",
    images: [{ src: img(8), alt: "Gaming headset" }],
    priceLabel: "\u20b93,200",
    title: "Wireless Gaming Headset \u2014 7.1 Surround Sound",
    detailsLabel: "GAMING \u2022 ACCESSORIES \u2022 DELHI",
    locationLabel: "Rajouri Garden, Delhi",
    postedAt: daysAgo(1),
    description: "<p>Wireless gaming headset with 7.1 surround sound and noise-cancelling microphone.</p>",
    keyDetails: [
      { key: "Sound", value: "7.1 Surround" },
    ],
    goodToKnow: [
      { key: "Battery Life", value: "20 hours" },
    ],
    coordinates: { lat: 28.6469, lng: 77.1197 },
    seller: SELLERS.gamingIndia,
  },
];

// ── cameras_photography ──────────────────────────────────────────────────────────
export const IN_TECH_CAMERAS_PHOTOGRAPHY: MockListing[] = [
  {
    id: "tech-in-camera-01", href: "/listings/tech-in-camera-01", advId: "34041",
    images: [{ src: img(9), alt: "Mirrorless camera" }],
    priceLabel: "\u20b955,000",
    title: "Mirrorless Camera \u2014 24MP, 4K Video, Kit Lens",
    detailsLabel: "CAMERAS & PHOTOGRAPHY \u2022 MIRRORLESS \u2022 MUMBAI",
    locationLabel: "Fort, Mumbai",
    postedAt: hrsAgo(2),
    description: "<p>24MP mirrorless camera with 4K video recording and a kit lens included.</p>",
    keyDetails: [
      { key: "Resolution", value: "24MP" },
    ],
    goodToKnow: [
      { key: "Video", value: "4K @ 30fps" },
    ],
    coordinates: { lat: 18.9322, lng: 72.8347 },
    seller: SELLERS.cameraIndia,
  },
  {
    id: "tech-in-camera-02", href: "/listings/tech-in-camera-02", advId: "34042",
    images: [{ src: img(1), alt: "Camera tripod" }],
    priceLabel: "\u20b92,800",
    title: "Aluminum Camera Tripod \u2014 Adjustable, 1.7m Max Height",
    detailsLabel: "CAMERAS & PHOTOGRAPHY \u2022 ACCESSORIES \u2022 MUMBAI",
    locationLabel: "Fort, Mumbai",
    postedAt: daysAgo(3),
    description: "<p>Lightweight aluminum tripod with adjustable height up to 1.7m, suitable for cameras and phones.</p>",
    keyDetails: [
      { key: "Max Height", value: "1.7 m" },
    ],
    goodToKnow: [
      { key: "Material", value: "Aluminum" },
    ],
    coordinates: { lat: 18.9322, lng: 72.8347 },
    seller: SELLERS.cameraIndia,
  },
];

// ── computer_parts ──────────────────────────────────────────────────────────────
export const IN_TECH_COMPUTER_PARTS: MockListing[] = [
  {
    id: "tech-in-parts-01", href: "/listings/tech-in-parts-01", advId: "34051",
    images: [{ src: img(2), alt: "Graphics card" }],
    priceLabel: "\u20b924,000",
    title: "Graphics Card \u2014 8GB GDDR6, Ray Tracing Support",
    detailsLabel: "COMPUTER PARTS \u2022 GPU \u2022 CHENNAI",
    locationLabel: "Ritchie Street, Chennai",
    postedAt: hrsAgo(5),
    description: "<p>8GB GDDR6 graphics card with ray tracing support, great for gaming and video editing.</p>",
    keyDetails: [
      { key: "VRAM", value: "8GB GDDR6" },
    ],
    goodToKnow: [
      { key: "Ray Tracing", value: "Supported" },
    ],
    coordinates: { lat: 13.0569, lng: 80.2609 },
    seller: SELLERS.computerPartsIndia,
  },
  {
    id: "tech-in-parts-02", href: "/listings/tech-in-parts-02", advId: "34052",
    images: [{ src: img(3), alt: "Motherboard" }],
    priceLabel: "\u20b98,500",
    title: "Motherboard \u2014 ATX, DDR4, Wi-Fi Built-in",
    detailsLabel: "COMPUTER PARTS \u2022 MOTHERBOARD \u2022 CHENNAI",
    locationLabel: "Ritchie Street, Chennai",
    postedAt: daysAgo(1),
    description: "<p>ATX motherboard supporting DDR4 RAM with built-in Wi-Fi and Bluetooth connectivity.</p>",
    keyDetails: [
      { key: "Form Factor", value: "ATX" },
    ],
    goodToKnow: [
      { key: "Wi-Fi", value: "Built-in" },
    ],
    coordinates: { lat: 13.0569, lng: 80.2609 },
    seller: SELLERS.computerPartsIndia,
  },
];

// ── wearables_smart ──────────────────────────────────────────────────────────────
export const IN_TECH_WEARABLES_SMART: MockListing[] = [
  {
    id: "tech-in-wearable-01", href: "/listings/tech-in-wearable-01", advId: "34061",
    images: [{ src: img(4), alt: "Smartwatch" }],
    priceLabel: "\u20b98,900",
    title: "Smartwatch \u2014 AMOLED Display, SpO2, GPS",
    detailsLabel: "WEARABLES & SMART \u2022 SMARTWATCH \u2022 PUNE",
    locationLabel: "MG Road, Pune",
    postedAt: hrsAgo(8),
    description: "<p>Smartwatch with AMOLED display, SpO2 monitoring, built-in GPS and 7-day battery life.</p>",
    keyDetails: [
      { key: "Display", value: "AMOLED" },
    ],
    goodToKnow: [
      { key: "Battery Life", value: "7 days" },
    ],
    coordinates: { lat: 18.5195, lng: 73.8553 },
    seller: SELLERS.wearablesIndia,
  },
  {
    id: "tech-in-wearable-02", href: "/listings/tech-in-wearable-02", advId: "34062",
    images: [{ src: img(5), alt: "Fitness band" }],
    priceLabel: "\u20b92,500",
    title: "Fitness Band \u2014 Heart Rate, Sleep Tracking, Waterproof",
    detailsLabel: "WEARABLES & SMART \u2022 FITNESS BAND \u2022 PUNE",
    locationLabel: "MG Road, Pune",
    postedAt: daysAgo(2),
    description: "<p>Waterproof fitness band with heart rate monitoring, sleep tracking and step counter.</p>",
    keyDetails: [
      { key: "Water Resistance", value: "5 ATM" },
    ],
    goodToKnow: [
      { key: "Battery Life", value: "10 days" },
    ],
    coordinates: { lat: 18.5195, lng: 73.8553 },
    seller: SELLERS.wearablesIndia,
  },
];

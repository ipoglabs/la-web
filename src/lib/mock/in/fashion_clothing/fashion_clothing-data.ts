import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── mens_clothing ──────────────────────────────────────────────────────────
export const IN_FASHION_MENS_CLOTHING: MockListing[] = [
  {
    id: "fashion-in-mens-01", href: "/listings/fashion-in-mens-01", advId: "36001",
    images: [{ src: img(8), alt: "Men's blazer" }],
    priceLabel: "\u20b92,800",
    title: "Men's Formal Blazer \u2014 Navy Blue, Size 40, Slim Fit",
    detailsLabel: "MEN'S CLOTHING \u2022 BLAZER \u2022 MUMBAI",
    locationLabel: "Linking Road, Mumbai",
    postedAt: hrsAgo(2),
    description: "<p>Navy blue slim-fit formal blazer, size 40, barely worn, great for office and events.</p>",
    keyDetails: [
      { key: "Size", value: "40" },
    ],
    goodToKnow: [
      { key: "Fit", value: "Slim" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    seller: SELLERS.mensClothingIndia,
  },
  {
    id: "fashion-in-mens-02", href: "/listings/fashion-in-mens-02", advId: "36002",
    images: [{ src: img(9), alt: "Men's jeans" }],
    priceLabel: "\u20b91,200",
    title: "Men's Slim Jeans \u2014 Dark Wash, Size 32, New",
    detailsLabel: "MEN'S CLOTHING \u2022 JEANS \u2022 MUMBAI",
    locationLabel: "Linking Road, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Brand new dark wash slim-fit jeans, size 32, tags still attached.</p>",
    keyDetails: [
      { key: "Size", value: "32" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Brand new" },
    ],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    seller: SELLERS.mensClothingIndia,
  },
];

// ── womens_clothing ──────────────────────────────────────────────────────────
export const IN_FASHION_WOMENS_CLOTHING: MockListing[] = [
  {
    id: "fashion-in-womens-01", href: "/listings/fashion-in-womens-01", advId: "36011",
    images: [{ src: img(1), alt: "Women's dress" }],
    priceLabel: "\u20b91,800",
    title: "Floral Summer Dress \u2014 Size M, Lightweight Cotton",
    detailsLabel: "WOMEN'S CLOTHING \u2022 DRESS \u2022 BENGALURU",
    locationLabel: "Commercial Street, Bengaluru",
    postedAt: hrsAgo(4),
    description: "<p>Lightweight cotton floral summer dress, size M, worn only twice.</p>",
    keyDetails: [
      { key: "Size", value: "M" },
    ],
    goodToKnow: [
      { key: "Fabric", value: "Cotton" },
    ],
    coordinates: { lat: 12.9822, lng: 77.6083 },
    seller: SELLERS.womensClothingIndia,
  },
  {
    id: "fashion-in-womens-02", href: "/listings/fashion-in-womens-02", advId: "36012",
    images: [{ src: img(2), alt: "Women's jacket" }],
    priceLabel: "\u20b92,400",
    title: "Women's Denim Jacket \u2014 Size S, Cropped Fit",
    detailsLabel: "WOMEN'S CLOTHING \u2022 JACKET \u2022 BENGALURU",
    locationLabel: "Commercial Street, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Cropped denim jacket, size S, versatile layering piece for all seasons.</p>",
    keyDetails: [
      { key: "Size", value: "S" },
    ],
    goodToKnow: [
      { key: "Fit", value: "Cropped" },
    ],
    coordinates: { lat: 12.9822, lng: 77.6083 },
    seller: SELLERS.womensClothingIndia,
  },
];

// ── ethnic_traditional ──────────────────────────────────────────────────────────
export const IN_FASHION_ETHNIC_TRADITIONAL: MockListing[] = [
  {
    id: "fashion-in-ethnic-01", href: "/listings/fashion-in-ethnic-01", advId: "36021",
    images: [{ src: img(3), alt: "Silk saree" }],
    priceLabel: "\u20b94,500",
    title: "Banarasi Silk Saree \u2014 Maroon, With Blouse Piece",
    detailsLabel: "ETHNIC & TRADITIONAL \u2022 SAREE \u2022 DELHI",
    locationLabel: "Chandni Chowk, Delhi",
    postedAt: hrsAgo(6),
    description: "<p>Elegant Banarasi silk saree in maroon with matching blouse piece, perfect for weddings.</p>",
    keyDetails: [
      { key: "Fabric", value: "Silk" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Blouse piece" },
    ],
    coordinates: { lat: 28.6506, lng: 77.2303 },
    seller: SELLERS.ethnicIndia,
  },
  {
    id: "fashion-in-ethnic-02", href: "/listings/fashion-in-ethnic-02", advId: "36022",
    images: [{ src: img(4), alt: "Kurta set" }],
    priceLabel: "\u20b91,600",
    title: "Men's Kurta Pyjama Set \u2014 Cream, Size L, Festive Wear",
    detailsLabel: "ETHNIC & TRADITIONAL \u2022 KURTA \u2022 DELHI",
    locationLabel: "Chandni Chowk, Delhi",
    postedAt: daysAgo(1),
    description: "<p>Cream-colored kurta pyjama set, size L, ideal for festive occasions.</p>",
    keyDetails: [
      { key: "Size", value: "L" },
    ],
    goodToKnow: [
      { key: "Occasion", value: "Festive" },
    ],
    coordinates: { lat: 28.6506, lng: 77.2303 },
    seller: SELLERS.ethnicIndia,
  },
];

// ── shoes_footwear ──────────────────────────────────────────────────────────
export const IN_FASHION_SHOES_FOOTWEAR: MockListing[] = [
  {
    id: "fashion-in-shoes-01", href: "/listings/fashion-in-shoes-01", advId: "36031",
    images: [{ src: img(5), alt: "Leather formal shoes" }],
    priceLabel: "\u20b92,200",
    title: "Men's Leather Formal Shoes \u2014 Black, Size 9",
    detailsLabel: "SHOES & FOOTWEAR \u2022 FORMAL \u2022 CHENNAI",
    locationLabel: "T Nagar, Chennai",
    postedAt: hrsAgo(8),
    description: "<p>Genuine leather formal shoes in black, size 9, polished and well maintained.</p>",
    keyDetails: [
      { key: "Size", value: "9" },
    ],
    goodToKnow: [
      { key: "Material", value: "Genuine leather" },
    ],
    coordinates: { lat: 13.0418, lng: 80.2341 },
    seller: SELLERS.footwearIndia,
  },
  {
    id: "fashion-in-shoes-02", href: "/listings/fashion-in-shoes-02", advId: "36032",
    images: [{ src: img(6), alt: "Sneakers" }],
    priceLabel: "\u20b93,000",
    title: "Casual Sneakers \u2014 White, Size 8, Unisex",
    detailsLabel: "SHOES & FOOTWEAR \u2022 SNEAKERS \u2022 CHENNAI",
    locationLabel: "T Nagar, Chennai",
    postedAt: daysAgo(1),
    description: "<p>White casual sneakers, unisex, size 8, comfortable for daily wear.</p>",
    keyDetails: [
      { key: "Size", value: "8" },
    ],
    goodToKnow: [
      { key: "Style", value: "Unisex" },
    ],
    coordinates: { lat: 13.0418, lng: 80.2341 },
    seller: SELLERS.footwearIndia,
  },
];

// ── bags_accessories ──────────────────────────────────────────────────────────
export const IN_FASHION_BAGS_ACCESSORIES: MockListing[] = [
  {
    id: "fashion-in-bags-01", href: "/listings/fashion-in-bags-01", advId: "36041",
    images: [{ src: img(7), alt: "Leather handbag" }],
    priceLabel: "\u20b93,500",
    title: "Leather Handbag \u2014 Tan, Structured Shape",
    detailsLabel: "BAGS & ACCESSORIES \u2022 HANDBAG \u2022 MUMBAI",
    locationLabel: "Colaba, Mumbai",
    postedAt: hrsAgo(10),
    description: "<p>Structured tan leather handbag with multiple compartments, great everyday accessory.</p>",
    keyDetails: [
      { key: "Color", value: "Tan" },
    ],
    goodToKnow: [
      { key: "Material", value: "Genuine leather" },
    ],
    coordinates: { lat: 18.9067, lng: 72.8147 },
    seller: SELLERS.bagsAccessoriesIndia,
  },
  {
    id: "fashion-in-bags-02", href: "/listings/fashion-in-bags-02", advId: "36042",
    images: [{ src: img(8), alt: "Travel backpack" }],
    priceLabel: "\u20b92,600",
    title: "Travel Backpack \u2014 40L, Water Resistant",
    detailsLabel: "BAGS & ACCESSORIES \u2022 BACKPACK \u2022 MUMBAI",
    locationLabel: "Colaba, Mumbai",
    postedAt: daysAgo(2),
    description: "<p>40L water-resistant travel backpack with laptop sleeve, ideal for trips and commuting.</p>",
    keyDetails: [
      { key: "Capacity", value: "40L" },
    ],
    goodToKnow: [
      { key: "Water Resistant", value: "Yes" },
    ],
    coordinates: { lat: 18.9067, lng: 72.8147 },
    seller: SELLERS.bagsAccessoriesIndia,
  },
];

// ── jewellery_watches ──────────────────────────────────────────────────────────
export const IN_FASHION_JEWELLERY_WATCHES: MockListing[] = [
  {
    id: "fashion-in-jewellery-01", href: "/listings/fashion-in-jewellery-01", advId: "36051",
    images: [{ src: img(9), alt: "Silver necklace" }],
    priceLabel: "\u20b95,500",
    title: "Sterling Silver Necklace \u2014 Handcrafted, With Pendant",
    detailsLabel: "JEWELLERY & WATCHES \u2022 NECKLACE \u2022 MUMBAI",
    locationLabel: "Zaveri Bazaar, Mumbai",
    postedAt: hrsAgo(3),
    description: "<p>Handcrafted sterling silver necklace with an elegant pendant, hallmark certified.</p>",
    keyDetails: [
      { key: "Material", value: "Sterling silver" },
    ],
    goodToKnow: [
      { key: "Certification", value: "Hallmarked" },
    ],
    coordinates: { lat: 18.9508, lng: 72.8331 },
    seller: SELLERS.jewelleryIndia,
  },
  {
    id: "fashion-in-jewellery-02", href: "/listings/fashion-in-jewellery-02", advId: "36052",
    images: [{ src: img(1), alt: "Wristwatch" }],
    priceLabel: "\u20b98,000",
    title: "Men's Automatic Wristwatch \u2014 Stainless Steel, Sapphire Glass",
    detailsLabel: "JEWELLERY & WATCHES \u2022 WATCH \u2022 MUMBAI",
    locationLabel: "Zaveri Bazaar, Mumbai",
    postedAt: daysAgo(1),
    description: "<p>Automatic wristwatch with stainless steel case and scratch-resistant sapphire glass.</p>",
    keyDetails: [
      { key: "Movement", value: "Automatic" },
    ],
    goodToKnow: [
      { key: "Glass", value: "Sapphire" },
    ],
    coordinates: { lat: 18.9508, lng: 72.8331 },
    seller: SELLERS.jewelleryIndia,
  },
];

// ── designer_luxury ──────────────────────────────────────────────────────────
export const IN_FASHION_DESIGNER_LUXURY: MockListing[] = [
  {
    id: "fashion-in-luxury-01", href: "/listings/fashion-in-luxury-01", advId: "36061",
    images: [{ src: img(2), alt: "Designer handbag" }],
    priceLabel: "\u20b945,000",
    title: "Authenticated Designer Handbag \u2014 Pre-Owned, With Dust Bag",
    detailsLabel: "DESIGNER & LUXURY \u2022 HANDBAG \u2022 GURUGRAM",
    locationLabel: "DLF Mall, Gurugram",
    postedAt: hrsAgo(5),
    description: "<p>Authenticated pre-owned designer handbag in excellent condition, includes original dust bag.</p>",
    keyDetails: [
      { key: "Authentication", value: "Verified" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Dust bag" },
    ],
    coordinates: { lat: 28.4818, lng: 77.0946 },
    seller: SELLERS.designerLuxuryIndia,
  },
  {
    id: "fashion-in-luxury-02", href: "/listings/fashion-in-luxury-02", advId: "36062",
    images: [{ src: img(3), alt: "Luxury sunglasses" }],
    priceLabel: "\u20b98,500",
    title: "Designer Sunglasses \u2014 Polarized, Original Case",
    detailsLabel: "DESIGNER & LUXURY \u2022 SUNGLASSES \u2022 GURUGRAM",
    locationLabel: "DLF Mall, Gurugram",
    postedAt: daysAgo(1),
    description: "<p>Designer polarized sunglasses with original case and cleaning cloth included.</p>",
    keyDetails: [
      { key: "Lens", value: "Polarized" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Original case" },
    ],
    coordinates: { lat: 28.4818, lng: 77.0946 },
    seller: SELLERS.designerLuxuryIndia,
  },
];

// ── vintage_secondhand ──────────────────────────────────────────────────────────
export const IN_FASHION_VINTAGE_SECONDHAND: MockListing[] = [
  {
    id: "fashion-in-vintage-01", href: "/listings/fashion-in-vintage-01", advId: "36071",
    images: [{ src: img(4), alt: "Vintage denim jacket" }],
    priceLabel: "\u20b91,400",
    title: "Vintage Denim Jacket \u2014 90s Style, Size M",
    detailsLabel: "VINTAGE & SECONDHAND \u2022 JACKET \u2022 DELHI",
    locationLabel: "Hauz Khas, Delhi",
    postedAt: hrsAgo(9),
    description: "<p>Authentic 90s-style vintage denim jacket, size M, well-preserved condition.</p>",
    keyDetails: [
      { key: "Era", value: "1990s" },
    ],
    goodToKnow: [
      { key: "Size", value: "M" },
    ],
    coordinates: { lat: 28.5494, lng: 77.2001 },
    seller: SELLERS.vintageIndia,
  },
  {
    id: "fashion-in-vintage-02", href: "/listings/fashion-in-vintage-02", advId: "36072",
    images: [{ src: img(5), alt: "Retro handbag" }],
    priceLabel: "\u20b9950",
    title: "Retro Leather Satchel \u2014 Secondhand, Good Condition",
    detailsLabel: "VINTAGE & SECONDHAND \u2022 BAG \u2022 DELHI",
    locationLabel: "Hauz Khas, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Retro-style leather satchel bag, secondhand but in good condition with minor wear.</p>",
    keyDetails: [
      { key: "Condition", value: "Good" },
    ],
    goodToKnow: [
      { key: "Style", value: "Retro" },
    ],
    coordinates: { lat: 28.5494, lng: 77.2001 },
    seller: SELLERS.vintageIndia,
  },
];

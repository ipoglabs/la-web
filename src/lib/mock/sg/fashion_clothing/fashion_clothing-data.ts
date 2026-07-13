import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── mens_clothing ──────────────────────────────────────────────────────────
export const SG_FASHION_MENS_CLOTHING: MockListing[] = [
  {
    id: "fashion-sg-mens-01", href: "/listings/fashion-sg-mens-01", advId: "46001",
    images: [{ src: img(8), alt: "Men's blazer" }],
    priceLabel: "S$80",
    title: "Men's Formal Blazer \u2014 Navy Blue, Size 40, Slim Fit",
    detailsLabel: "MEN'S CLOTHING \u2022 BLAZER \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: hrsAgo(2),
    description: "<p>Navy blue slim-fit formal blazer, size 40, barely worn, great for office and events.</p>",
    keyDetails: [
      { key: "Size", value: "40" },
    ],
    goodToKnow: [
      { key: "Fit", value: "Slim" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.mensClothingSG,
  },
  {
    id: "fashion-sg-mens-02", href: "/listings/fashion-sg-mens-02", advId: "46002",
    images: [{ src: img(9), alt: "Men's jeans" }],
    priceLabel: "S$35",
    title: "Men's Slim Jeans \u2014 Dark Wash, Size 32, New",
    detailsLabel: "MEN'S CLOTHING \u2022 JEANS \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Brand new dark wash slim-fit jeans, size 32, tags still attached.</p>",
    keyDetails: [
      { key: "Size", value: "32" },
    ],
    goodToKnow: [
      { key: "Condition", value: "Brand new" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.mensClothingSG,
  },
];

// ── womens_clothing ──────────────────────────────────────────────────────────
export const SG_FASHION_WOMENS_CLOTHING: MockListing[] = [
  {
    id: "fashion-sg-womens-01", href: "/listings/fashion-sg-womens-01", advId: "46011",
    images: [{ src: img(1), alt: "Women's dress" }],
    priceLabel: "S$45",
    title: "Floral Summer Dress \u2014 Size M, Lightweight Cotton",
    detailsLabel: "WOMEN'S CLOTHING \u2022 DRESS \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Lightweight cotton floral summer dress, size M, worn only twice.</p>",
    keyDetails: [
      { key: "Size", value: "M" },
    ],
    goodToKnow: [
      { key: "Fabric", value: "Cotton" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.womensClothingSG,
  },
  {
    id: "fashion-sg-womens-02", href: "/listings/fashion-sg-womens-02", advId: "46012",
    images: [{ src: img(2), alt: "Women's jacket" }],
    priceLabel: "S$60",
    title: "Women's Denim Jacket \u2014 Size S, Cropped Fit",
    detailsLabel: "WOMEN'S CLOTHING \u2022 JACKET \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Cropped denim jacket, size S, versatile layering piece for all seasons.</p>",
    keyDetails: [
      { key: "Size", value: "S" },
    ],
    goodToKnow: [
      { key: "Fit", value: "Cropped" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.womensClothingSG,
  },
];

// ── ethnic_traditional ──────────────────────────────────────────────────────────
export const SG_FASHION_ETHNIC_TRADITIONAL: MockListing[] = [
  {
    id: "fashion-sg-ethnic-01", href: "/listings/fashion-sg-ethnic-01", advId: "46021",
    images: [{ src: img(3), alt: "Silk saree" }],
    priceLabel: "S$110",
    title: "Banarasi Silk Saree \u2014 Maroon, With Blouse Piece",
    detailsLabel: "ETHNIC & TRADITIONAL \u2022 SAREE \u2022 SINGAPORE",
    locationLabel: "Little India, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Elegant Banarasi silk saree in maroon with matching blouse piece, perfect for weddings.</p>",
    keyDetails: [
      { key: "Fabric", value: "Silk" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Blouse piece" },
    ],
    coordinates: { lat: 1.3067, lng: 103.8517 },
    seller: SELLERS.ethnicSG,
  },
  {
    id: "fashion-sg-ethnic-02", href: "/listings/fashion-sg-ethnic-02", advId: "46022",
    images: [{ src: img(4), alt: "Kurta set" }],
    priceLabel: "S$40",
    title: "Men's Kurta Pyjama Set \u2014 Cream, Size L, Festive Wear",
    detailsLabel: "ETHNIC & TRADITIONAL \u2022 KURTA \u2022 SINGAPORE",
    locationLabel: "Little India, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Cream-colored kurta pyjama set, size L, ideal for festive occasions.</p>",
    keyDetails: [
      { key: "Size", value: "L" },
    ],
    goodToKnow: [
      { key: "Occasion", value: "Festive" },
    ],
    coordinates: { lat: 1.3067, lng: 103.8517 },
    seller: SELLERS.ethnicSG,
  },
];

// ── shoes_footwear ──────────────────────────────────────────────────────────
export const SG_FASHION_SHOES_FOOTWEAR: MockListing[] = [
  {
    id: "fashion-sg-shoes-01", href: "/listings/fashion-sg-shoes-01", advId: "46031",
    images: [{ src: img(5), alt: "Leather formal shoes" }],
    priceLabel: "S$55",
    title: "Men's Leather Formal Shoes \u2014 Black, Size 9",
    detailsLabel: "SHOES & FOOTWEAR \u2022 FORMAL \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>Genuine leather formal shoes in black, size 9, polished and well maintained.</p>",
    keyDetails: [
      { key: "Size", value: "9" },
    ],
    goodToKnow: [
      { key: "Material", value: "Genuine leather" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.footwearSG,
  },
  {
    id: "fashion-sg-shoes-02", href: "/listings/fashion-sg-shoes-02", advId: "46032",
    images: [{ src: img(6), alt: "Sneakers" }],
    priceLabel: "S$75",
    title: "Casual Sneakers \u2014 White, Size 8, Unisex",
    detailsLabel: "SHOES & FOOTWEAR \u2022 SNEAKERS \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: daysAgo(1),
    description: "<p>White casual sneakers, unisex, size 8, comfortable for daily wear.</p>",
    keyDetails: [
      { key: "Size", value: "8" },
    ],
    goodToKnow: [
      { key: "Style", value: "Unisex" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8486 },
    seller: SELLERS.footwearSG,
  },
];

// ── bags_accessories ──────────────────────────────────────────────────────────
export const SG_FASHION_BAGS_ACCESSORIES: MockListing[] = [
  {
    id: "fashion-sg-bags-01", href: "/listings/fashion-sg-bags-01", advId: "46041",
    images: [{ src: img(7), alt: "Leather handbag" }],
    priceLabel: "S$90",
    title: "Leather Handbag \u2014 Tan, Structured Shape",
    detailsLabel: "BAGS & ACCESSORIES \u2022 HANDBAG \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>Structured tan leather handbag with multiple compartments, great everyday accessory.</p>",
    keyDetails: [
      { key: "Color", value: "Tan" },
    ],
    goodToKnow: [
      { key: "Material", value: "Genuine leather" },
    ],
    coordinates: { lat: 1.2841, lng: 103.8515 },
    seller: SELLERS.bagsAccessoriesSG,
  },
  {
    id: "fashion-sg-bags-02", href: "/listings/fashion-sg-bags-02", advId: "46042",
    images: [{ src: img(8), alt: "Travel backpack" }],
    priceLabel: "S$65",
    title: "Travel Backpack \u2014 40L, Water Resistant",
    detailsLabel: "BAGS & ACCESSORIES \u2022 BACKPACK \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: daysAgo(2),
    description: "<p>40L water-resistant travel backpack with laptop sleeve, ideal for trips and commuting.</p>",
    keyDetails: [
      { key: "Capacity", value: "40L" },
    ],
    goodToKnow: [
      { key: "Water Resistant", value: "Yes" },
    ],
    coordinates: { lat: 1.2841, lng: 103.8515 },
    seller: SELLERS.bagsAccessoriesSG,
  },
];

// ── jewellery_watches ──────────────────────────────────────────────────────────
export const SG_FASHION_JEWELLERY_WATCHES: MockListing[] = [
  {
    id: "fashion-sg-jewellery-01", href: "/listings/fashion-sg-jewellery-01", advId: "46051",
    images: [{ src: img(9), alt: "Silver necklace" }],
    priceLabel: "S$140",
    title: "Sterling Silver Necklace \u2014 Handcrafted, With Pendant",
    detailsLabel: "JEWELLERY & WATCHES \u2022 NECKLACE \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Handcrafted sterling silver necklace with an elegant pendant, hallmark certified.</p>",
    keyDetails: [
      { key: "Material", value: "Sterling silver" },
    ],
    goodToKnow: [
      { key: "Certification", value: "Hallmarked" },
    ],
    coordinates: { lat: 1.2818, lng: 103.8607 },
    seller: SELLERS.jewellerySG,
  },
  {
    id: "fashion-sg-jewellery-02", href: "/listings/fashion-sg-jewellery-02", advId: "46052",
    images: [{ src: img(1), alt: "Wristwatch" }],
    priceLabel: "S$200",
    title: "Men's Automatic Wristwatch \u2014 Stainless Steel, Sapphire Glass",
    detailsLabel: "JEWELLERY & WATCHES \u2022 WATCH \u2022 SINGAPORE",
    locationLabel: "Marina Bay, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Automatic wristwatch with stainless steel case and scratch-resistant sapphire glass.</p>",
    keyDetails: [
      { key: "Movement", value: "Automatic" },
    ],
    goodToKnow: [
      { key: "Glass", value: "Sapphire" },
    ],
    coordinates: { lat: 1.2818, lng: 103.8607 },
    seller: SELLERS.jewellerySG,
  },
];

// ── designer_luxury ──────────────────────────────────────────────────────────
export const SG_FASHION_DESIGNER_LUXURY: MockListing[] = [
  {
    id: "fashion-sg-luxury-01", href: "/listings/fashion-sg-luxury-01", advId: "46061",
    images: [{ src: img(2), alt: "Designer handbag" }],
    priceLabel: "S$1,100",
    title: "Authenticated Designer Handbag \u2014 Pre-Owned, With Dust Bag",
    detailsLabel: "DESIGNER & LUXURY \u2022 HANDBAG \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Authenticated pre-owned designer handbag in excellent condition, includes original dust bag.</p>",
    keyDetails: [
      { key: "Authentication", value: "Verified" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Dust bag" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.designerLuxurySG,
  },
  {
    id: "fashion-sg-luxury-02", href: "/listings/fashion-sg-luxury-02", advId: "46062",
    images: [{ src: img(3), alt: "Luxury sunglasses" }],
    priceLabel: "S$210",
    title: "Designer Sunglasses \u2014 Polarized, Original Case",
    detailsLabel: "DESIGNER & LUXURY \u2022 SUNGLASSES \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Designer polarized sunglasses with original case and cleaning cloth included.</p>",
    keyDetails: [
      { key: "Lens", value: "Polarized" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Original case" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.designerLuxurySG,
  },
];

// ── vintage_secondhand ──────────────────────────────────────────────────────────
export const SG_FASHION_VINTAGE_SECONDHAND: MockListing[] = [
  {
    id: "fashion-sg-vintage-01", href: "/listings/fashion-sg-vintage-01", advId: "46071",
    images: [{ src: img(4), alt: "Vintage denim jacket" }],
    priceLabel: "S$35",
    title: "Vintage Denim Jacket \u2014 90s Style, Size M",
    detailsLabel: "VINTAGE & SECONDHAND \u2022 JACKET \u2022 SINGAPORE",
    locationLabel: "Tiong Bahru, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>Authentic 90s-style vintage denim jacket, size M, well-preserved condition.</p>",
    keyDetails: [
      { key: "Era", value: "1990s" },
    ],
    goodToKnow: [
      { key: "Size", value: "M" },
    ],
    coordinates: { lat: 1.2857, lng: 103.8322 },
    seller: SELLERS.vintageSG,
  },
  {
    id: "fashion-sg-vintage-02", href: "/listings/fashion-sg-vintage-02", advId: "46072",
    images: [{ src: img(5), alt: "Retro handbag" }],
    priceLabel: "S$25",
    title: "Retro Leather Satchel \u2014 Secondhand, Good Condition",
    detailsLabel: "VINTAGE & SECONDHAND \u2022 BAG \u2022 SINGAPORE",
    locationLabel: "Tiong Bahru, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Retro-style leather satchel bag, secondhand but in good condition with minor wear.</p>",
    keyDetails: [
      { key: "Condition", value: "Good" },
    ],
    goodToKnow: [
      { key: "Style", value: "Retro" },
    ],
    coordinates: { lat: 1.2857, lng: 103.8322 },
    seller: SELLERS.vintageSG,
  },
];

import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── beauty_products ────────────────────────────────────────────────────────────
export const HEALTH_BEAUTY_PRODUCTS: MockListing[] = [
  {
    id: "hb-prod-01", href: "/listings/hb-prod-01", advId: "12031",
    images: [{ src: img(6), alt: "Skincare set" }],
    priceLabel: "£85",
    priceSuffix: "(full set)",
    title: "La Mer Moisturising Cream Set — Full Size, Sealed, 30% Off RRP",
    detailsLabel: "BEAUTY PRODUCTS • SEALED • SKINCARE",
    locationLabel: "Knightsbridge, London",
    postedAt: hrsAgo(6),
    description: "<p>Brand new, sealed <strong>La Mer Moisturising Soft Cream (60ml) + Eye Concentrate (15ml)</strong> set. Purchased as a gift but already have — selling at 30% below RRP. Authenticity guaranteed — receipt available.</p>",
    keyDetails: [
      { key: "Brand",     value: "La Mer"                  },
      { key: "Items",     value: "Moisturising Cream + Eye" },
      { key: "Condition", value: "Sealed, unused"          },
      { key: "Saving",    value: "30% below RRP"           },
    ],
    goodToKnow: [
      { key: "Receipt",    value: "Available on request"   },
      { key: "Expiry",     value: "2028"                   },
      { key: "Collection", value: "Knightsbridge or post"  },
      { key: "Postage",    value: "£3.95 tracked"          },
    ],
    coordinates: { lat: 51.5023, lng: -0.1607 },
    seller: SELLERS.alice,
  },
  {
    id: "hb-prod-02", href: "/listings/hb-prod-02", advId: "12032",
    images: [{ src: img(7), alt: "Dyson Airwrap Complete Long" }],
    priceLabel: "£280",
    title: "Dyson Airwrap Complete Long — All Attachments, Boxed",
    detailsLabel: "BEAUTY PRODUCTS • LIKE NEW • HAIR TOOL",
    locationLabel: "Marylebone, London",
    postedAt: hrsAgo(4),
    description: "<p>Nearly new <strong>Dyson Airwrap Complete Long</strong> in Prussian Blue/Rich Copper. All 6 original attachments, storage case, and box. Purchased December 2025 — used fewer than 10 times.</p>",
    keyDetails: [
      { key: "Item",      value: "Dyson Airwrap Complete Long" },
      { key: "Colour",    value: "Prussian Blue / Rich Copper" },
      { key: "Condition", value: "Like new — <10 uses"        },
      { key: "Warranty",  value: "2yr Dyson warranty"         },
    ],
    goodToKnow: [
      { key: "Attachments", value: "All 6 included"      },
      { key: "Case",        value: "Travel case included" },
      { key: "Box",         value: "Original box"         },
      { key: "Collection",  value: "Marylebone only"      },
    ],
    coordinates: { lat: 51.5222, lng: -0.1557 },
    seller: SELLERS.quickSell,
  },
  {
    id: "hb-prod-03", href: "/listings/hb-prod-03", advId: "12033",
    images: [{ src: img(8), alt: "Unopened perfume" }],
    priceLabel: "£65",
    title: "Chanel Chance Eau Tendre EDP 100ml — Unopened, Sealed Box",
    detailsLabel: "BEAUTY PRODUCTS • SEALED • FRAGRANCE",
    locationLabel: "Chelsea, London",
    postedAt: daysAgo(1),
    description: "<p>Brand new, sealed <strong>Chanel Chance Eau Tendre EDP 100ml</strong>. Unwanted birthday gift — not my scent. Sealed cellophane wrap intact, receipt available. Selling well below RRP (£135 at counter).</p>",
    keyDetails: [
      { key: "Brand",     value: "Chanel"                      },
      { key: "Fragrance", value: "Chance Eau Tendre EDP"       },
      { key: "Size",      value: "100ml"                       },
      { key: "Condition", value: "Sealed — cellophane intact"  },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£135 at Chanel counter"    },
      { key: "Receipt",    value: "Available on request"       },
      { key: "Expiry",     value: "2029"                       },
      { key: "Collection", value: "Chelsea or tracked post"    },
    ],
    coordinates: { lat: 51.4892, lng: -0.1697 },
    seller: SELLERS.alice,
  },
];


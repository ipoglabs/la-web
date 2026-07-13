import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── holiday_seasonal ───────────────────────────────────────────────────────────
export const SPECIAL_OFFERS_SEASONAL: MockListing[] = [
  {
    id: "offer-seasonal-01", href: "/listings/offer-seasonal-01", advId: "90071",
    images: [{ src: img(9), alt: "Summer sale" }],
    priceLabel: "Up to 60% OFF",
    title: "Summer Sale Now On — Furniture, Homewares, Garden Up to 60% Off",
    detailsLabel: "SEASONAL • UP TO 60% OFF • SUMMER SALE",
    locationLabel: "Online & London Stores",
    postedAt: daysAgo(1),
    description: "<p>Our biggest <strong>summer sale</strong> is on now — up to 60% off furniture, homewares, and garden products. Thousands of lines reduced across all departments. Free delivery on orders over £100.</p>",
    keyDetails: [
      { key: "Discount",  value: "Up to 60% off"            },
      { key: "Categories", value: "Furniture, Home, Garden" },
      { key: "Delivery",  value: "Free over £100"           },
      { key: "Valid",     value: "While stocks last"        },
    ],
    goodToKnow: [
      { key: "Returns",   value: "14-day returns policy"   },
      { key: "In-Store",  value: "London stores also"      },
      { key: "Finance",   value: "Available on orders £250+" },
      { key: "Ends",      value: "Bank Holiday Monday"     },
    ],
    coordinates: { lat: 51.5152, lng: -0.1422 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-seasonal-02", href: "/listings/offer-seasonal-02", advId: "90072",
    images: [{ src: img(2), alt: "Back to school" }],
    priceLabel: "Up to 40% OFF",
    title: "Back to School Early Deals — Stationery, Bags & Uniform Up to 40% Off",
    detailsLabel: "SEASONAL • UP TO 40% OFF • BACK TO SCHOOL",
    locationLabel: "Online & London Stores",
    postedAt: daysAgo(1),
    description: "<p>Get ahead of the rush — our <strong>back-to-school sale</strong> is on early with up to 40% off stationery sets, backpacks, lunch boxes, and uniform. Free delivery on orders over £35. Sizes from age 3 to 16.</p>",
    keyDetails: [
      { key: "Discount",   value: "Up to 40% off"           },
      { key: "Categories", value: "Stationery, bags, uniform" },
      { key: "Ages",       value: "3–16 years"              },
      { key: "Delivery",   value: "Free over £35"           },
    ],
    goodToKnow: [
      { key: "Returns",   value: "30-day exchanges"         },
      { key: "In-Store",  value: "London stores included"   },
      { key: "Ends",      value: "31 August 2026"           },
      { key: "Stock",     value: "Uniform sizes limited"    },
    ],
    coordinates: { lat: 51.5152, lng: -0.1422 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-seasonal-03", href: "/listings/offer-seasonal-03", advId: "90073",
    images: [{ src: img(3), alt: "Garden clearance" }],
    priceLabel: "Up to 70% OFF",
    title: "End-of-Season Garden Clearance — BBQs, Rattan, Parasols Up to 70% Off",
    detailsLabel: "SEASONAL • UP TO 70% OFF • GARDEN CLEARANCE",
    locationLabel: "Online & London Stores",
    postedAt: daysAgo(2),
    description: "<p>Last chance at summer prices — <strong>end-of-season garden clearance</strong> with up to 70% off BBQs, rattan sets, parasols, and garden furniture. Stock is clearing fast. Free delivery on orders over £80.</p>",
    keyDetails: [
      { key: "Discount",  value: "Up to 70% off"            },
      { key: "Items",     value: "BBQ, furniture, parasols" },
      { key: "Delivery",  value: "Free over £80"           },
      { key: "Stock",     value: "Last chance to buy"       },
    ],
    goodToKnow: [
      { key: "Ends",      value: "While stocks last"        },
      { key: "In-Store",  value: "Click & collect available" },
      { key: "Returns",   value: "14-day returns policy"   },
      { key: "Online",    value: "Sale continues 24/7"      },
    ],
    coordinates: { lat: 51.5152, lng: -0.1422 },
    seller: SELLERS.dealsPro,
  },
];


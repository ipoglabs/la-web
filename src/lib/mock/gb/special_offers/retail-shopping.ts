import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── retail_shopping ────────────────────────────────────────────────────────────
export const SPECIAL_OFFERS_RETAIL: MockListing[] = [
  {
    id: "offer-retail-01", href: "/listings/offer-retail-01", advId: "90021",
    images: [{ src: img(4), alt: "Mid-season sale" }],
    priceLabel: "Up to 50% OFF",
    title: "Mid-Season Sale — Up to 50% Off Men's & Women's Fashion",
    detailsLabel: "RETAIL • UP TO 50% OFF • FASHION",
    locationLabel: "Online & London Stores",
    postedAt: hrsAgo(3),
    description: "<p><strong>Mid-season clearance sale</strong> — up to 50% off across men's and women's clothing, shoes, and accessories. Over 3,000 lines reduced. Free delivery on orders over £40. Limited stock at these prices.</p>",
    keyDetails: [
      { key: "Discount",  value: "Up to 50% off"            },
      { key: "Category",  value: "Clothing, shoes, bags"    },
      { key: "Lines",     value: "3,000+ items reduced"     },
      { key: "Delivery",  value: "Free over £40"            },
    ],
    goodToKnow: [
      { key: "Returns",    value: "28 days free returns"    },
      { key: "Ends",       value: "While stocks last"       },
      { key: "In-Store",   value: "London stores included"  },
      { key: "Code",       value: "No code needed"          },
    ],
    coordinates: { lat: 51.5152, lng: -0.1422 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-retail-02", href: "/listings/offer-retail-02", advId: "90022",
    images: [{ src: img(5), alt: "Independent boutique sale" }],
    priceLabel: "20% OFF",
    title: "Independent Boutique Summer Sale — 20% Off Everything, Stoke Newington",
    detailsLabel: "RETAIL • 20% OFF • INDEPENDENT BOUTIQUE",
    locationLabel: "Stoke Newington, London",
    postedAt: hrsAgo(6),
    description: "<p><strong>Ember & Oak Boutique</strong> on Church Street, Stoke Newington is offering 20% off all in-store items throughout July 2026. Womenswear, jewellery, gifts, and homeware from independent makers. Mention LokalAds at checkout.</p>",
    keyDetails: [
      { key: "Discount",  value: "20% off all items"         },
      { key: "Valid",     value: "All of July 2026"          },
      { key: "Location",  value: "Church St, Stoke Newington" },
      { key: "How",       value: "Mention LokalAds in-store" },
    ],
    goodToKnow: [
      { key: "Items",     value: "Clothing, jewellery, gifts" },
      { key: "Hours",     value: "Tue–Sun, 10am–6pm"        },
      { key: "Online",    value: "Discount in-store only"   },
      { key: "Payment",   value: "Card + contactless only"  },
    ],
    coordinates: { lat: 51.5634, lng: -0.0748 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-retail-03", href: "/listings/offer-retail-03", advId: "90023",
    images: [{ src: img(6), alt: "Loyalty double points" }],
    priceLabel: "Double Points",
    title: "Double Loyalty Points This Weekend — In-Store & Online, All Departments",
    detailsLabel: "RETAIL • DOUBLE POINTS • LOYALTY OFFER",
    locationLabel: "London & Online (UK-wide)",
    postedAt: hrsAgo(2),
    description: "<p>This weekend only (28–29 June 2026): earn <strong>double loyalty points</strong> on every purchase in-store and online across all departments. Points worth 1p each, redeemable on future purchases. No minimum spend — just shop as normal with your loyalty card.</p>",
    keyDetails: [
      { key: "Offer",     value: "2× points on all spends"  },
      { key: "Valid",     value: "28–29 June 2026 only"     },
      { key: "Points",    value: "Worth 1p each"            },
      { key: "Min Spend", value: "None"                    },
    ],
    goodToKnow: [
      { key: "How",       value: "Scan loyalty card / app" },
      { key: "Redeem",    value: "Next visit, any purchase" },
      { key: "Online",    value: "Log in before checkout"  },
      { key: "Terms",     value: "1 account per customer"  },
    ],
    coordinates: { lat: 51.5152, lng: -0.1422 },
    seller: SELLERS.dealsPro,
  },
];


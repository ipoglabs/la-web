import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── gift_cards ────────────────────────────────────────────────────────────────
export const TICKETS_GIFTCARDS: MockListing[] = [
  {
    id: "tick-gift-01", href: "/listings/tick-gift-01", advId: "22021",
    images: [{ src: img(4), alt: "John Lewis gift card" }],
    priceLabel: "£220",
    title: "John Lewis Gift Card — £250 Balance, Unused, No Expiry",
    detailsLabel: "GIFT CARD • JOHN LEWIS • £250",
    locationLabel: "London",
    postedAt: hrsAgo(1),
    description: "<p>Unused <strong>John Lewis gift card with £250 balance</strong>. Received as a work gift — I don't shop there. Valid online and in all John Lewis & Waitrose stores. No expiry date. Balance can be verified on the John Lewis website before purchase.</p>",
    keyDetails: [
      { key: "Retailer",  value: "John Lewis & Partners"    },
      { key: "Balance",   value: "£250"                     },
      { key: "Expiry",    value: "None"                     },
      { key: "Condition", value: "Unused"                   },
    ],
    goodToKnow: [
      { key: "Valid",      value: "JL + Waitrose + online"  },
      { key: "Verify",     value: "Balance checkable online" },
      { key: "Reason",     value: "Unwanted work gift"       },
      { key: "Delivery",   value: "Collection or posted recorded" },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.alice,
  },
  {
    id: "tick-gift-02", href: "/listings/tick-gift-02", advId: "22022",
    images: [{ src: img(5), alt: "Amazon UK gift card" }],
    priceLabel: "£85",
    title: "Amazon UK Gift Card — £100 Credit, Digital Code, Instant Delivery",
    detailsLabel: "GIFT CARD • AMAZON UK • £100",
    locationLabel: "London",
    postedAt: hrsAgo(2),
    description: "<p>Digital <strong>Amazon UK gift card — £100 credit</strong>. Code sent immediately after payment confirmed. Bought as a gift but recipient already has Prime credit. Redeemable on any Amazon UK purchase — codes never expire.</p>",
    keyDetails: [
      { key: "Retailer",  value: "Amazon UK"                 },
      { key: "Balance",   value: "£100"                      },
      { key: "Delivery",  value: "Digital code — instant"    },
      { key: "Expiry",    value: "None"                      },
    ],
    goodToKnow: [
      { key: "Valid on",   value: "All Amazon UK purchases"  },
      { key: "No expiry",  value: "Codes don't expire"       },
      { key: "Transfer",   value: "Code sent via message"    },
      { key: "Reason",     value: "Unwanted gift"            },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.dave,
  },
  {
    id: "tick-gift-03", href: "/listings/tick-gift-03", advId: "22023",
    images: [{ src: img(6), alt: "Tastecard membership" }],
    priceLabel: "£45",
    title: "Tastecard Premium 12-Month Membership — 2-for-1 Dining, Not Activated",
    detailsLabel: "VOUCHERS • DINING • TASTECARD • 12 MONTHS",
    locationLabel: "London",
    postedAt: daysAgo(1),
    description: "<p>Unused <strong>Tastecard Premium 12-month membership</strong> — 2-for-1 meals or 50% off food at 6,000+ UK restaurants, plus cinema deals. Code never activated — valid for 12 months from activation. RRP £34.99.</p>",
    keyDetails: [
      { key: "Product",   value: "Tastecard Premium 12 mo"  },
      { key: "Benefit",   value: "2-for-1 or 50% off food"  },
      { key: "Network",   value: "6,000+ UK restaurants"    },
      { key: "Condition", value: "Unused — not activated"   },
    ],
    goodToKnow: [
      { key: "Cinemas",    value: "Included"                 },
      { key: "Expiry",     value: "12 mo from activation"   },
      { key: "Transfer",   value: "Digital code"            },
      { key: "RRP",        value: "£34.99"                  },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.quickSell,
  },
];

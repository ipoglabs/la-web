import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const SG_PROPERTY_ROOMS: MockListing[] = [
  {
    id: "prop-sg-room-01", href: "/listings/prop-sg-room-01", advId: "30201",
    images: [
      { src: img(1), alt: "Common room" },
    ],
    priceLabel: "S$800", priceSuffix: "/ mo",
    title: "Common Room in HDB Flat — Near Jurong East MRT",
    detailsLabel: "1 ROOM • SHARED BATH • HDB",
    locationLabel: "Jurong East",
    postedAt: hrsAgo(5),
    description: "<p>Furnished <strong>common room</strong> in a 5-room HDB flat, shared with one other tenant. Air-conditioned, with built-in wardrobe and a shared modern kitchen.</p><p>8 minutes' walk to Jurong East MRT interchange and JEM / Westgate malls — great for professionals working in the Jurong Lake District.</p>",
    keyDetails: [
      { key: "Bills Included", value: "Yes — utilities + Wi-Fi" },
      { key: "Min Stay",       value: "3 months"      },
      { key: "Occupants",      value: "1 (no owner-occupier)" },
      { key: "Furnished",      value: "Yes"            },
      { key: "Cooking",        value: "Allowed"        },
      { key: "Deposit",        value: "S$800 (1 month)" },
    ],
    goodToKnow: [
      { key: "Available", value: "Immediately"   },
      { key: "Gender",    value: "No preference"  },
      { key: "Aircon",    value: "Included"       },
      { key: "Visitors",  value: "With prior notice" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.weiMing,
  },
  {
    id: "prop-sg-room-02", href: "/listings/prop-sg-room-02", advId: "30202",
    images: [
      { src: img(2), alt: "Master bedroom" },
    ],
    priceLabel: "S$1,200", priceSuffix: "/ mo",
    title: "Master Room with En-Suite — Condo Facilities, Clementi",
    detailsLabel: "1 ROOM • EN-SUITE • CONDO",
    locationLabel: "Clementi",
    postedAt: daysAgo(1),
    description: "<p>Spacious <strong>master bedroom with en-suite bathroom</strong> in a condo unit close to Clementi MRT and NUS. Full access to condo pool and gym facilities.</p><p>Ideal for working professionals or postgraduate students needing quiet, well-connected accommodation.</p>",
    keyDetails: [
      { key: "Bills Included", value: "Yes — all"      },
      { key: "Min Stay",       value: "6 months"       },
      { key: "Occupants",      value: "1"               },
      { key: "Furnished",      value: "Yes"             },
      { key: "Cooking",        value: "Allowed, shared kitchen" },
      { key: "Deposit",        value: "S$1,200 (1 month)" },
    ],
    goodToKnow: [
      { key: "Available",  value: "Immediately"    },
      { key: "Facilities", value: "Pool, gym access" },
      { key: "Aircon",     value: "Included"        },
      { key: "Gender",     value: "No preference"   },
    ],
    coordinates: { lat: 1.3151, lng: 103.7654 },
    seller: SELLERS.siti,
  },
];

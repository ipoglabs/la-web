import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const IN_PROPERTY_ROOMS: MockListing[] = [
  {
    id: "prop-in-room-01", href: "/listings/prop-in-room-01", advId: "20201",
    images: [
      { src: img(3), alt: "PG room" },
    ],
    priceLabel: "₹12,000", priceSuffix: "/ mo",
    title: "Premium PG for Working Women — Single Occupancy, Meals Included",
    detailsLabel: "1 ROOM • ATTACHED BATH • PG",
    locationLabel: "HSR Layout, Bengaluru",
    postedAt: hrsAgo(4),
    description: "<p>Managed <strong>single-occupancy PG room</strong> for working women with attached bathroom, AC, Wi-Fi, and daily housekeeping. Breakfast and dinner included in the rent.</p><p>2 minutes' walk from HSR Layout Sector 1 — close to bus stops and cab pick-up points for Koramangala/Sarjapur tech offices.</p>",
    keyDetails: [
      { key: "Bills Included", value: "Yes — Wi-Fi + electricity" },
      { key: "Food",           value: "Breakfast & dinner"        },
      { key: "Min Stay",       value: "3 months"                  },
      { key: "Occupancy",      value: "Single"                    },
      { key: "Gender",         value: "Women only"                },
      { key: "Deposit",        value: "₹12,000 (1 month)"         },
    ],
    goodToKnow: [
      { key: "Available",  value: "Immediately"   },
      { key: "Curfew",     value: "11:00 PM"      },
      { key: "Laundry",    value: "Included"      },
      { key: "Housekeeping", value: "Daily"        },
      { key: "Guests",     value: "Not permitted" },
    ],
    coordinates: { lat: 12.9121, lng: 77.6446 },
    seller: SELLERS.pgHomes,
  },
  {
    id: "prop-in-room-02", href: "/listings/prop-in-room-02", advId: "20202",
    images: [
      { src: img(4), alt: "Shared room" },
    ],
    priceLabel: "₹9,500", priceSuffix: "/ mo",
    title: "Sharing Room for Professionals — Near Cyber City, Gurugram",
    detailsLabel: "1 ROOM • SHARED (2) • FURNISHED",
    locationLabel: "DLF Phase 3, Gurugram",
    postedAt: daysAgo(1),
    description: "<p>Twin-sharing <strong>furnished room</strong> in a 3BHK flat share, popular with young professionals working in DLF Cyber City. Common kitchen, RO water, and daily cleaning included.</p><p>Walking distance to DLF Phase 3 metro station and the Cyber Hub restaurant strip.</p>",
    keyDetails: [
      { key: "Bills Included",  value: "Yes — split among flatmates" },
      { key: "Min Stay",        value: "3 months"       },
      { key: "Housemates",      value: "1 professional" },
      { key: "Furnished",       value: "Yes"            },
      { key: "Food",            value: "Not included"   },
      { key: "Deposit",         value: "₹9,500 (1 month)" },
    ],
    goodToKnow: [
      { key: "Available", value: "Immediately"    },
      { key: "Cleaning",  value: "Daily, included" },
      { key: "Parking",   value: "2-wheeler only"  },
      { key: "Gender",    value: "Male preferred"  },
      { key: "Guests",    value: "With prior notice" },
    ],
    coordinates: { lat: 28.4867, lng: 77.0967 },
    seller: SELLERS.gurgaonRealty,
  },
];

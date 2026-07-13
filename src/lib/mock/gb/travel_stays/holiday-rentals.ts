import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── holiday_rentals ────────────────────────────────────────────────────────────
export const TRAVEL_HOLIDAY_RENTALS: MockListing[] = [
  {
    id: "travel-hr-01", href: "/listings/travel-hr-01", advId: "14001",
    images: [{ src: img(1), alt: "Tuscany villa" }],
    priceLabel: "£1,800",
    priceSuffix: "/ week",
    title: "Tuscan Villa with Pool — 4 Bed, Sleeps 8, Stunning Views",
    detailsLabel: "HOLIDAY RENTAL • 4 BED • TUSCANY",
    locationLabel: "Siena Province, Tuscany",
    postedAt: hrsAgo(2),
    description: "<p>Stunning <strong>4-bedroom Tuscan stone villa</strong> set amid vineyards near Siena. Private heated pool (12m×6m), terrace, BBQ, and panoramic valley views. Air-conditioned bedrooms, full kitchen, WiFi. Available July–September.</p>",
    keyDetails: [
      { key: "Bedrooms",   value: "4 (sleeps 8)"             },
      { key: "Pool",       value: "Private heated, 12×6m"    },
      { key: "Location",   value: "Near Siena, Tuscany"      },
      { key: "Available",  value: "July–September 2026"      },
    ],
    goodToKnow: [
      { key: "Deposit",    value: "£500 refundable"          },
      { key: "Check-in",   value: "Sat–Sat bookings"         },
      { key: "Cleaning",   value: "Included"                 },
      { key: "Nearest",    value: "Village 3km, Siena 25km"  },
    ],
    coordinates: { lat: 43.3188, lng: 11.3307 },
    seller: SELLERS.hotelMgr,
  },
  {
    id: "travel-hr-02", href: "/listings/travel-hr-02", advId: "14002",
    images: [{ src: img(2), alt: "Airbnb Edinburgh flat" }],
    priceLabel: "£95",
    priceSuffix: "/ night",
    title: "Stylish Edinburgh New Town Flat — 2 Bed, Central, Parking",
    detailsLabel: "HOLIDAY RENTAL • 2 BED • EDINBURGH",
    locationLabel: "New Town, Edinburgh",
    postedAt: hrsAgo(4),
    description: "<p>Beautiful <strong>2-bedroom Georgian flat</strong> in Edinburgh's prestigious New Town. Fully equipped, high-spec kitchen, fast WiFi, and off-street parking included. Walk to Princes Street and city centre. Superhost — 4.9★.</p>",
    keyDetails: [
      { key: "Bedrooms",  value: "2 (sleeps 4)"       },
      { key: "Location",  value: "New Town, Edinburgh" },
      { key: "Parking",   value: "Off-street, free"   },
      { key: "Rating",    value: "4.9★ Superhost"     },
    ],
    goodToKnow: [
      { key: "Check-in",   value: "3pm / Check-out 11am"    },
      { key: "Min. Stay",  value: "2 nights"                },
      { key: "Pets",       value: "On request"              },
      { key: "Contact",    value: "Message to enquire"      },
    ],
    coordinates: { lat: 55.9561, lng: -3.2091 },
    seller: SELLERS.hotelMgr,
  },
  {
    id: "travel-hr-03", href: "/listings/travel-hr-03", advId: "14003",
    images: [{ src: img(3), alt: "Algarve apartment" }],
    priceLabel: "£650",
    priceSuffix: "/ week",
    title: "Algarve 2-Bed Apartment — Beachfront Complex, Pool, July/Aug",
    detailsLabel: "HOLIDAY RENTAL • 2 BED • ALGARVE",
    locationLabel: "Albufeira, Algarve, Portugal",
    postedAt: hrsAgo(6),
    description: "<p>Light and airy <strong>2-bedroom apartment</strong> in a beachfront complex in Albufeira, Algarve. Shared pool, 5-min walk to beach, air-conditioned, terrace, underground parking. Sleeps 4. A few July/August weeks still available.</p>",
    keyDetails: [
      { key: "Bedrooms",  value: "2 (sleeps 4)"             },
      { key: "Pool",      value: "Shared complex pool"      },
      { key: "Location",  value: "Albufeira, Algarve"       },
      { key: "Available", value: "Select weeks Jul/Aug 2026" },
    ],
    goodToKnow: [
      { key: "Beach",     value: "5-min walk"               },
      { key: "Parking",   value: "Underground, included"    },
      { key: "Check-in",  value: "Sat–Sat bookings"         },
      { key: "Deposit",   value: "£300 refundable"          },
    ],
    coordinates: { lat: 37.0892, lng: -8.2504 },
    seller: SELLERS.hotelMgr,
  },
];


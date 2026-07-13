import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── hotels_guesthouses ─────────────────────────────────────────────────────────
export const TRAVEL_HOTELS: MockListing[] = [
  {
    id: "travel-hotel-01", href: "/listings/travel-hotel-01", advId: "14011",
    images: [{ src: img(3), alt: "Boutique hotel" }],
    priceLabel: "£125",
    priceSuffix: "/ night",
    title: "Boutique Hotel — 4★, Breakfast Included, South Kensington",
    detailsLabel: "HOTEL • 4-STAR • SOUTH KENSINGTON",
    locationLabel: "South Kensington, London",
    postedAt: hrsAgo(3),
    description: "<p>Charming <strong>4-star boutique hotel</strong> a stroll from the Natural History Museum in South Kensington. 32 individually styled rooms, full English breakfast, and complimentary evening wine. Free cancellation up to 48hrs.</p>",
    keyDetails: [
      { key: "Rating",    value: "4-star (AA approved)"     },
      { key: "Rooms",     value: "32 individually styled"   },
      { key: "Includes",  value: "Full English breakfast"   },
      { key: "Location",  value: "South Kensington, SW7"    },
    ],
    goodToKnow: [
      { key: "Cancellation", value: "Free up to 48hrs"      },
      { key: "Check-in",     value: "2pm / Check-out 11am"  },
      { key: "Evening",      value: "Complimentary wine"    },
      { key: "Tube",         value: "S. Kensington (2 min)" },
    ],
    coordinates: { lat: 51.4954, lng: -0.1774 },
    seller: SELLERS.hotelMgr,
  },
  {
    id: "travel-hotel-02", href: "/listings/travel-hotel-02", advId: "14012",
    images: [{ src: img(4), alt: "B&B Yorkshire" }],
    priceLabel: "£68",
    priceSuffix: "/ night",
    title: "Family-Run B&B — En Suite Rooms, Full Yorkshire Breakfast, Harrogate",
    detailsLabel: "HOTEL • B&B • HARROGATE",
    locationLabel: "Harrogate, North Yorkshire",
    postedAt: daysAgo(1),
    description: "<p>Warm, welcoming <strong>family-run B&B</strong> in Harrogate town centre. 6 en suite double and twin rooms, award-winning full Yorkshire breakfast. Walk to the Pump Room, RHS Harlow Carr, and Valley Gardens.</p>",
    keyDetails: [
      { key: "Rooms",     value: "6 en suite (double/twin)" },
      { key: "Breakfast", value: "Full Yorkshire included"  },
      { key: "Location",  value: "Harrogate town centre"    },
      { key: "Parking",   value: "Free on-site"            },
    ],
    goodToKnow: [
      { key: "Check-in",   value: "3pm / Check-out 10:30am" },
      { key: "Dogs",       value: "Welcome in ground floor" },
      { key: "Min. Stay",  value: "1 night"                },
      { key: "Cancellation", value: "Free up to 48hrs"     },
    ],
    coordinates: { lat: 53.9940, lng: -1.5414 },
    seller: SELLERS.hotelMgr,
  },
  {
    id: "travel-hotel-03", href: "/listings/travel-hotel-03", advId: "14013",
    images: [{ src: img(5), alt: "Serviced apartment" }],
    priceLabel: "£110",
    priceSuffix: "/ night",
    title: "Serviced Apartment — 1 Bed, Monthly Stays Welcome, Canary Wharf",
    detailsLabel: "HOTEL • SERVICED APARTMENT • CANARY WHARF",
    locationLabel: "Canary Wharf, London",
    postedAt: hrsAgo(5),
    description: "<p>Modern <strong>1-bedroom serviced apartment</strong> in Canary Wharf — ideal for business travellers and extended stays. Weekly housekeeping, full kitchen, fast WiFi, gym access, and concierge. Monthly rate discounts available.</p>",
    keyDetails: [
      { key: "Type",      value: "1-bed serviced apartment" },
      { key: "Ideal For", value: "Business + extended stays" },
      { key: "Includes",  value: "Weekly housekeeping + gym" },
      { key: "Discount",  value: "Monthly rate available"   },
    ],
    goodToKnow: [
      { key: "Check-in",   value: "Flexible + self-check-in" },
      { key: "WiFi",       value: "1 Gbps included"          },
      { key: "DLR",        value: "Canary Wharf (3 min walk)" },
      { key: "Parking",    value: "Available, chargeable"   },
    ],
    coordinates: { lat: 51.5033, lng: -0.0195 },
    seller: SELLERS.hotelMgr,
  },
];


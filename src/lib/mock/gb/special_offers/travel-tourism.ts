import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── travel_tourism ────────────────────────────────────────────────────────────
export const SPECIAL_OFFERS_TRAVEL: MockListing[] = [
  {
    id: "offer-travel-01", href: "/listings/offer-travel-01", advId: "90011",
    images: [{ src: img(2), alt: "Flight deal" }],
    priceLabel: "From £89",
    priceSuffix: "/ person return",
    title: "Summer Flight Sale — London to Barcelona, Rome, Lisbon from £89 rtn",
    detailsLabel: "TRAVEL • 40% OFF • FLIGHTS",
    locationLabel: "Departing London",
    postedAt: hrsAgo(2),
    description: "<p>Limited-time <strong>summer flight sale</strong> — return flights from London Gatwick/Heathrow to Barcelona, Rome, and Lisbon from just £89/person. Travel Jul–Sep 2026. Book by 30 June to secure these prices.</p>",
    keyDetails: [
      { key: "Routes",    value: "BCN, FCO, LIS from LGW/LHR" },
      { key: "Price",     value: "From £89 return/person"      },
      { key: "Travel",    value: "July–September 2026"         },
      { key: "Book By",   value: "30 June 2026"                },
    ],
    goodToKnow: [
      { key: "Baggage",    value: "Hand luggage only at base"  },
      { key: "Flexibility", value: "Date-flex search available" },
      { key: "Seats",      value: "Limited — act fast"         },
      { key: "ATOL",       value: "ATOL Protected"             },
    ],
    coordinates: { lat: 51.4952, lng: -0.1441 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-travel-02", href: "/listings/offer-travel-02", advId: "90012",
    images: [{ src: img(3), alt: "Hotel deal" }],
    priceLabel: "£79",
    priceSuffix: "/ night",
    title: "Central London Hotel — 3★, 30% Off Summer Rates, Flexible Cancel",
    detailsLabel: "TRAVEL • 30% OFF • HOTEL",
    locationLabel: "Westminster, London",
    postedAt: daysAgo(1),
    description: "<p>Book a <strong>3-star hotel in Westminster</strong> at 30% off rack rates this summer. Double rooms from £79/night (was £113). Free cancellation up to 24 hours before arrival. Breakfast available to add.</p>",
    keyDetails: [
      { key: "Discount",  value: "30% off rack rate"          },
      { key: "Price",     value: "From £79/night (dbl room)"  },
      { key: "Location",  value: "Westminster, Central London" },
      { key: "Valid",     value: "Jul–Aug 2026 stays"         },
    ],
    goodToKnow: [
      { key: "Cancellation", value: "Free up to 24hrs prior" },
      { key: "Breakfast",    value: "£12pp/day to add"       },
      { key: "Check-in",     value: "3pm / Check-out 11am"   },
      { key: "Book By",      value: "31 July 2026"           },
    ],
    coordinates: { lat: 51.4994, lng: -0.1247 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-travel-03", href: "/listings/offer-travel-03", advId: "90013",
    images: [{ src: img(4), alt: "Package holiday" }],
    priceLabel: "From £899",
    priceSuffix: "/ person",
    title: "7-Night Algarve All-Inclusive — Family of 4 From £899pp, August Departures",
    detailsLabel: "TRAVEL • ALL-INCLUSIVE • ALGARVE",
    locationLabel: "Departing London Gatwick",
    postedAt: daysAgo(1),
    description: "<p>Family summer escape — <strong>7 nights all-inclusive in the Algarve</strong> from £899 per person (based on family of 4). Includes return flights from Gatwick, transfers, and a 4-star beachfront hotel. August departures remaining. ATOL protected.</p>",
    keyDetails: [
      { key: "Price",    value: "From £899pp (fam of 4)" },
      { key: "Duration", value: "7 nights"              },
      { key: "Board",    value: "All-inclusive"         },
      { key: "Travel",   value: "August 2026"           },
    ],
    goodToKnow: [
      { key: "Flights",  value: "Return from Gatwick"   },
      { key: "Hotel",    value: "4-star beachfront"     },
      { key: "ATOL",     value: "ATOL Protected"        },
      { key: "Book By",  value: "15 July 2026"          },
    ],
    coordinates: { lat: 51.4952, lng: -0.1441 },
    seller: SELLERS.dealsPro,
  },
];


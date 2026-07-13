import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── tour_packages ──────────────────────────────────────────────────────────────
export const TRAVEL_TOURS: MockListing[] = [
  {
    id: "travel-tour-01", href: "/listings/travel-tour-01", advId: "14021",
    images: [{ src: img(4), alt: "Japan tour group" }],
    priceLabel: "£3,499",
    priceSuffix: "/ person",
    title: "Japan Cherry Blossom Tour — 10 Days, All-Inclusive, Mar/Apr 2027",
    detailsLabel: "TOUR PACKAGE • ALL-INCLUSIVE • JAPAN",
    locationLabel: "Tokyo & Kyoto, Japan",
    postedAt: daysAgo(1),
    description: "<p>Unforgettable <strong>10-day Japan cherry blossom tour</strong> departing March/April 2027. Tokyo, Hakone, Kyoto, Nara, and Osaka. Return flights from London, 4-star hotels, all breakfasts, and expert English-speaking guide included.</p>",
    keyDetails: [
      { key: "Duration",  value: "10 days / 9 nights"      },
      { key: "Departure", value: "Mar–Apr 2027 (flexible)"  },
      { key: "Includes",  value: "Flights, 4★ hotels, B/B"  },
      { key: "Guide",     value: "English-speaking expert"  },
    ],
    goodToKnow: [
      { key: "ATOL",       value: "ATOL Protected #98765"   },
      { key: "Group Size", value: "Max 16"                  },
      { key: "Deposit",    value: "£500 secures place"      },
      { key: "Instalment", value: "Monthly payment plan"    },
    ],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    seller: SELLERS.travelPro,
  },
  {
    id: "travel-tour-02", href: "/listings/travel-tour-02", advId: "14022",
    images: [{ src: img(5), alt: "Morocco tour" }],
    priceLabel: "£1,299",
    priceSuffix: "/ person",
    title: "Morocco Desert & Medina Tour — 7 Days, Small Group, Departs Monthly",
    detailsLabel: "TOUR PACKAGE • 7 DAYS • MOROCCO",
    locationLabel: "Marrakech & Sahara, Morocco",
    postedAt: daysAgo(2),
    description: "<p>Immersive <strong>7-day Morocco small group tour</strong>. Marrakech medina, Atlas Mountains, Merzouga desert camp (camel trek + stargazing), and Fès. Riads, a desert camp, and boutique hotels. Departs monthly from London.</p>",
    keyDetails: [
      { key: "Duration",  value: "7 days / 6 nights"        },
      { key: "Route",     value: "Marrakech, Atlas, Sahara, Fès" },
      { key: "Group",     value: "Max 12"                   },
      { key: "Includes",  value: "Hotels, most meals, guide" },
    ],
    goodToKnow: [
      { key: "Flights",   value: "Not included"             },
      { key: "ATOL",      value: "ATOL Protected"           },
      { key: "Deposit",   value: "£250 to book"             },
      { key: "Departures", value: "Monthly (see dates)"     },
    ],
    coordinates: { lat: 31.6295, lng: -7.9811 },
    seller: SELLERS.travelPro,
  },
  {
    id: "travel-tour-03", href: "/listings/travel-tour-03", advId: "14023",
    images: [{ src: img(6), alt: "Northern Lights Iceland" }],
    priceLabel: "£1,899",
    priceSuffix: "/ person",
    title: "Iceland Northern Lights — 5 Days, Guided, Flights Included, Jan–Mar 2027",
    detailsLabel: "TOUR PACKAGE • 5 DAYS • ICELAND",
    locationLabel: "Reykjavik & South Iceland",
    postedAt: hrsAgo(4),
    description: "<p>Chase the <strong>Northern Lights in Iceland</strong> on this 5-day guided tour departing January–March 2027. Return flights from London, 3-star hotel in Reykjavik, Northern Lights hunt, Golden Circle, and Blue Lagoon entry all included.</p>",
    keyDetails: [
      { key: "Duration",  value: "5 days / 4 nights"        },
      { key: "Departure", value: "Jan–Mar 2027"             },
      { key: "Includes",  value: "Flights, hotel, Blue Lagoon" },
      { key: "Highlights", value: "Golden Circle + Aurora"   },
    ],
    goodToKnow: [
      { key: "ATOL",       value: "ATOL Protected"          },
      { key: "Group Size", value: "Max 14"                  },
      { key: "Deposit",    value: "£300 secures place"      },
      { key: "Aurora",     value: "3 nights to maximise"    },
    ],
    coordinates: { lat: 64.1466, lng: -21.9426 },
    seller: SELLERS.travelPro,
  },
];


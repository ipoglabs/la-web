import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── travel_tourism ────────────────────────────────────────────────────────────
export const SERVICES_TRAVEL: MockListing[] = [
  {
    id: "svc-travel-01", href: "/listings/svc-travel-01", advId: "40051",
    images: [{ src: img(9), alt: "Travel planning" }],
    priceLabel: "From £100",
    priceSuffix: "/ trip",
    title: "Bespoke Holiday Planning — Europe & Far East Specialists",
    detailsLabel: "TRAVEL & TOURISM • ABTA • LONDON",
    locationLabel: "London / Remote",
    postedAt: daysAgo(1),
    description: "<p>ABTA-bonded <strong>independent travel consultants</strong> creating bespoke itineraries for Europe and Far East. Flights, hotels, transfers, and unique experiences — all tailored to your budget and interests.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Holiday Planning"     },
      { key: "Coverage",       value: "Europe & Far East"    },
      { key: "Availability",   value: "Mon–Sat 9am–6pm"      },
      { key: "Qualifications", value: "ABTA bonded, ATOL"    },
    ],
    goodToKnow: [
      { key: "ATOL",       value: "ATOL Protected #98765"   },
      { key: "Free Quote", value: "No obligation"           },
      { key: "Service Fee", value: "From £100/person"       },
      { key: "Deposit",    value: "£50 secures booking"     },
    ],
    coordinates: { lat: 51.5117, lng: -0.1240 },
    seller: SELLERS.travelPro,
  },
  {
    id: "svc-travel-02", href: "/listings/svc-travel-02", advId: "40052",
    images: [{ src: img(1), alt: "Executive chauffeur car" }],
    priceLabel: "From £55",
    priceSuffix: "/ trip",
    title: "Executive Airport Transfers — Heathrow, Gatwick, Stansted & City",
    detailsLabel: "TRAVEL & TOURISM • PCO LICENSED • LONDON",
    locationLabel: "All London & Airports",
    postedAt: hrsAgo(5),
    description: "<p>PCO-licensed <strong>executive chauffeur service</strong> for airport transfers and business travel. All London airports covered. Meet & greet in arrivals, flight monitoring, and complimentary wait time included.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Airport Transfer"     },
      { key: "Coverage",       value: "All London airports"  },
      { key: "Availability",   value: "24/7, 365 days"       },
      { key: "Qualifications", value: "PCO licensed, TfL reg" },
    ],
    goodToKnow: [
      { key: "Flight Track", value: "Monitors your flight"  },
      { key: "Wait Time",    value: "60 min free wait"      },
      { key: "Meet & Greet", value: "Name board in arrivals" },
      { key: "Booking",      value: "24h advance minimum"   },
    ],
    coordinates: { lat: 51.5117, lng: -0.1240 },
    seller: SELLERS.travelPro,
  },
  {
    id: "svc-travel-03", href: "/listings/svc-travel-03", advId: "40053",
    images: [{ src: img(2), alt: "London walking tour group" }],
    priceLabel: "£18",
    priceSuffix: "/ person",
    title: "Guided Walking Tours of London — Hidden History, Street Art & More",
    detailsLabel: "TRAVEL & TOURISM • BLUE BADGE GUIDE • CENTRAL LONDON",
    locationLabel: "Central London",
    postedAt: daysAgo(2),
    description: "<p>Qualified <strong>Blue Badge Tourist Guide</strong> offering themed walking tours of London. Hidden history, street art, and Jack the Ripper tours — small groups of max 12, all led by a passionate local expert.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Walking Tour"         },
      { key: "Coverage",       value: "Central London"       },
      { key: "Availability",   value: "Daily, check website" },
      { key: "Qualifications", value: "Blue Badge Guide"     },
    ],
    goodToKnow: [
      { key: "Group Size",  value: "Max 12 per tour"       },
      { key: "Duration",    value: "2 hours per tour"      },
      { key: "Booking",     value: "Advance booking advised" },
      { key: "Children",    value: "Under 12 half price"   },
    ],
    coordinates: { lat: 51.5074, lng: -0.1078 },
    seller: SELLERS.travelPro,
  },
];


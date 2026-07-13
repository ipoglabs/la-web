import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── experience_days ───────────────────────────────────────────────────────────
export const TICKETS_EXPERIENCES: MockListing[] = [
  {
    id: "tick-exp-01", href: "/listings/tick-exp-01", advId: "22031",
    images: [{ src: img(7), alt: "Silverstone supercar track day" }],
    priceLabel: "£180",
    title: "Silverstone Supercar Track Experience — Ferrari or Lamborghini, 6 Laps",
    detailsLabel: "EXPERIENCE DAY • SUPERCAR • SILVERSTONE",
    locationLabel: "London",
    postedAt: daysAgo(2),
    description: "<p>Supercar <strong>track experience at Silverstone</strong> — choice of Ferrari 488 or Lamborghini Huracán for 6 timed laps with a professional instructor alongside. Voucher valid until December 2027. Received as birthday gift — already done this experience.</p>",
    keyDetails: [
      { key: "Venue",     value: "Silverstone Circuit"       },
      { key: "Cars",      value: "Ferrari 488 or Lamborghini Huracán" },
      { key: "Laps",      value: "6 timed laps"              },
      { key: "Expiry",    value: "December 2027"             },
    ],
    goodToKnow: [
      { key: "Instructor", value: "Professional alongside"   },
      { key: "Transfer",   value: "Voucher name-changeable"  },
      { key: "Reason",     value: "Already done this experience" },
      { key: "Delivery",   value: "Digital voucher"          },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.ticketPrivate,
  },
  {
    id: "tick-exp-02", href: "/listings/tick-exp-02", advId: "22032",
    images: [{ src: img(8), alt: "Hot air balloon experience" }],
    priceLabel: "£120",
    title: "Virgin Experience Days Hot Air Balloon Flight for 2 — 50+ UK Sites",
    detailsLabel: "EXPERIENCE DAY • HOT AIR BALLOON • VIRGIN",
    locationLabel: "London",
    postedAt: daysAgo(1),
    description: "<p>Virgin Experience Days <strong>hot air balloon flight for 2</strong> — valid at 50+ UK launch sites. 1-hour flight with champagne on landing. Valid March 2028. Wedding gift we'd love to use but we have a fear of heights!</p>",
    keyDetails: [
      { key: "Provider",  value: "Virgin Experience Days"    },
      { key: "Flight",    value: "1 hour, 2 passengers"      },
      { key: "Sites",     value: "50+ UK locations"          },
      { key: "Expiry",    value: "March 2028"                },
    ],
    goodToKnow: [
      { key: "Champagne",  value: "On landing — included"    },
      { key: "Transfer",   value: "Transferable voucher"     },
      { key: "Reason",     value: "Fear of heights"          },
      { key: "Delivery",   value: "PDF voucher"              },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.alice,
  },
  {
    id: "tick-exp-03", href: "/listings/tick-exp-03", advId: "22033",
    images: [{ src: img(9), alt: "The Savoy afternoon tea voucher" }],
    priceLabel: "£95",
    title: "Champagne Afternoon Tea for 2 at The Savoy London — Valid Apr 2027",
    detailsLabel: "EXPERIENCE DAY • AFTERNOON TEA • THE SAVOY",
    locationLabel: "London",
    postedAt: hrsAgo(5),
    description: "<p>Gift voucher for <strong>Champagne Afternoon Tea for 2 at The Savoy Hotel</strong>, Strand London — finger sandwiches, pastries, scones, and a glass of Bollinger per person. Valid to April 2027. RRP £145.</p>",
    keyDetails: [
      { key: "Venue",     value: "The Savoy, Strand London"  },
      { key: "Includes",  value: "Tea + Bollinger × 2"       },
      { key: "Persons",   value: "2"                         },
      { key: "Expiry",    value: "April 2027"                },
    ],
    goodToKnow: [
      { key: "RRP",        value: "£145"                     },
      { key: "Transfer",   value: "Name-changeable on request" },
      { key: "Book",       value: "Direct with The Savoy"    },
      { key: "Delivery",   value: "PDF voucher"              },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.quickSell,
  },
];

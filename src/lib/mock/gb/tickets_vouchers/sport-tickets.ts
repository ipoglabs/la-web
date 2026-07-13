import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── sport_tickets ─────────────────────────────────────────────────────────────
export const TICKETS_SPORT: MockListing[] = [
  {
    id: "tick-sport-01", href: "/listings/tick-sport-01", advId: "22011",
    images: [{ src: img(1), alt: "Arsenal vs Man City football tickets" }],
    priceLabel: "£120",
    title: "Arsenal vs Man City PL — Emirates 15 Aug 2026, North Lower × 2",
    detailsLabel: "SPORT TICKET • FOOTBALL • ARSENAL • PL",
    locationLabel: "Islington, London",
    postedAt: hrsAgo(3),
    description: "<p>Two <strong>Arsenal vs Manchester City Premier League</strong> tickets — 15 August 2026, Emirates Stadium. North Lower Block 8, Row 22, Seats 14/15 (aisle pair). Face value. Friend pulled out last minute — need to sell as pair.</p>",
    keyDetails: [
      { key: "Match",    value: "Arsenal vs Man City (PL)"   },
      { key: "Date",     value: "15 August 2026"             },
      { key: "Stand",    value: "North Lower, Block 8"       },
      { key: "Qty",      value: "× 2 (adjacent)"            },
    ],
    goodToKnow: [
      { key: "Transfer",   value: "Arsenal ticketing portal" },
      { key: "Pair",       value: "Must sell together"       },
      { key: "Face value", value: "£120 each"               },
      { key: "Contact",    value: "Message first"            },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.dave,
  },
  {
    id: "tick-sport-02", href: "/listings/tick-sport-02", advId: "22012",
    images: [{ src: img(2), alt: "Wimbledon Centre Court ticket" }],
    priceLabel: "£280",
    title: "Wimbledon 2026 Day 10 Centre Court Debenture Seat — Ladies Semis",
    detailsLabel: "SPORT TICKET • TENNIS • WIMBLEDON • CENTRE COURT",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(2),
    description: "<p>Single <strong>Wimbledon 2026 Centre Court Debenture ticket — Day 10</strong> (Ladies' Semi-finals + Men's Quarter-finals). Premium seat, Row N. Official AELTC transfer paperwork provided. Selling due to a family event on the same date.</p>",
    keyDetails: [
      { key: "Event",    value: "Wimbledon 2026 Day 10"      },
      { key: "Court",    value: "Centre Court"               },
      { key: "Type",     value: "Debenture seat, Row N"      },
      { key: "Qty",      value: "× 1"                        },
    ],
    goodToKnow: [
      { key: "Transfer",   value: "Official AELTC paperwork" },
      { key: "Day",        value: "Ladies Semis + Men's QF"  },
      { key: "Reason",     value: "Family commitment"        },
      { key: "Contact",    value: "Message first"            },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.ticketPrivate,
  },
  {
    id: "tick-sport-03", href: "/listings/tick-sport-03", advId: "22013",
    images: [{ src: img(3), alt: "London Marathon 2027 charity place" }],
    priceLabel: "£450",
    title: "TCS London Marathon 2027 Charity Place — All-In Entry Package",
    detailsLabel: "SPORT TICKET • MARATHON • LONDON 2027",
    locationLabel: "London",
    postedAt: daysAgo(3),
    description: "<p>Charity-entry <strong>TCS London Marathon 2027 place</strong> — official race entry, charity vest, finisher medal and goody bag entitlement. Minimum £2,000 fundraising pledge required. Life-changing experience — sold due to injury.</p>",
    keyDetails: [
      { key: "Event",    value: "TCS London Marathon 2027"   },
      { key: "Entry",    value: "Charity place"              },
      { key: "Includes", value: "Entry + vest + medal entitlement" },
      { key: "Fundraise", value: "Minimum £2,000 pledge"    },
    ],
    goodToKnow: [
      { key: "Charity",    value: "Buyer's chosen charity"   },
      { key: "Transfer",   value: "Official entry transfer"  },
      { key: "Reason",     value: "Injury — cannot run"      },
      { key: "Contact",    value: "Message for details"      },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.ticketPrivate,
  },
];

import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── event_tickets ─────────────────────────────────────────────────────────────
export const TICKETS_EVENTS: MockListing[] = [
  {
    id: "tick-evt-01", href: "/listings/tick-evt-01", advId: "22001",
    images: [{ src: img(7), alt: "Glastonbury festival ticket" }],
    priceLabel: "£290",
    title: "Glastonbury 2026 Weekend Ticket × 1 — Face Value, Official Transfer",
    detailsLabel: "EVENT TICKET • GLASTONBURY 2026 • FESTIVAL",
    locationLabel: "London",
    postedAt: hrsAgo(2),
    description: "<p>One <strong>Glastonbury 2026 weekend ticket</strong> at face value (£290). Cannot attend due to work commitments. Transfer via the official Glastonbury resale system — fully safe and legitimate. Message first to exchange transfer details.</p>",
    keyDetails: [
      { key: "Event",    value: "Glastonbury Festival 2026"  },
      { key: "Ticket",   value: "Weekend (full festival)"    },
      { key: "Qty",      value: "× 1"                        },
      { key: "Price",    value: "Face value — £290"          },
    ],
    goodToKnow: [
      { key: "Transfer",   value: "Official Glastonbury resale" },
      { key: "ID risk",    value: "None — official process"  },
      { key: "Reason",     value: "Work conflict"            },
      { key: "Contact",    value: "Message via LokalAds"     },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.ticketPrivate,
  },
  {
    id: "tick-evt-02", href: "/listings/tick-evt-02", advId: "22002",
    images: [{ src: img(8), alt: "Coldplay BST Hyde Park tickets" }],
    priceLabel: "£185",
    title: "Coldplay BST Hyde Park 4 Jul 2026 — Tier 1 GA Floor × 2, Face Value",
    detailsLabel: "EVENT TICKET • COLDPLAY • BST HYDE PARK",
    locationLabel: "London",
    postedAt: hrsAgo(4),
    description: "<p>Two <strong>Coldplay BST Hyde Park 4 July 2026</strong> tickets — Tier 1 General Admission floor, face value £185 each. My partner is pregnant and we can no longer attend. Legitimate Ticketmaster official transfer — no meet-up required.</p>",
    keyDetails: [
      { key: "Event",    value: "Coldplay BST Hyde Park 2026" },
      { key: "Date",     value: "4 July 2026"                },
      { key: "Type",     value: "Tier 1 GA Floor"            },
      { key: "Qty",      value: "× 2 (pair — together)"      },
    ],
    goodToKnow: [
      { key: "Transfer",   value: "Ticketmaster official"    },
      { key: "Pair",       value: "Both seats together"      },
      { key: "Reason",     value: "Personal — genuine"       },
      { key: "Contact",    value: "Message for TM details"   },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.dave,
  },
  {
    id: "tick-evt-03", href: "/listings/tick-evt-03", advId: "22003",
    images: [{ src: img(9), alt: "The Prodigy O2 Arena ticket" }],
    priceLabel: "£75",
    title: "The Prodigy — Fat of the Land 30th Tour, O2 Arena 12 Sep × 1",
    detailsLabel: "EVENT TICKET • THE PRODIGY • O2 ARENA",
    locationLabel: "London",
    postedAt: daysAgo(1),
    description: "<p>One <strong>The Prodigy O2 Arena</strong> ticket — 'The Fat of the Land' 30th Anniversary Tour, 12 September 2026. Standing, Block A2. Face value £75. Genuine clash with a stag weekend. Ticketmaster e-ticket transfer.</p>",
    keyDetails: [
      { key: "Event",    value: "The Prodigy — O2 Arena"     },
      { key: "Date",     value: "12 September 2026"          },
      { key: "Area",     value: "Standing — Block A2"        },
      { key: "Qty",      value: "× 1"                        },
    ],
    goodToKnow: [
      { key: "Transfer",   value: "Ticketmaster e-ticket"    },
      { key: "Face value", value: "£75 — no markup"          },
      { key: "Reason",     value: "Stag weekend clash"       },
      { key: "Contact",    value: "Message to arrange"       },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.ticketPrivate,
  },
];

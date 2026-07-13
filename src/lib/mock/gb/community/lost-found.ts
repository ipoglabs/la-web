import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── lost_found ────────────────────────────────────────────────────────────────
export const COMMUNITY_LOST_FOUND: MockListing[] = [
  {
    id: "comm-lost-01", href: "/listings/comm-lost-01", advId: "80001",
    images: [{ src: img(1), alt: "Lost keys" }],
    priceLabel: "Reward offered",
    title: "FOUND: Set of House Keys — Near Clapham Common Station",
    detailsLabel: "LOST & FOUND • KEYS • CLAPHAM",
    locationLabel: "Clapham, London",
    postedAt: hrsAgo(2),
    description: "<p>Found a set of house keys near <strong>Clapham Common tube station</strong> (south side) on 26 June. Blue fob attached. If these are yours, please message with a description of the keys to claim them.</p>",
    keyDetails: [
      { key: "Item",     value: "House keys + blue fob"   },
      { key: "Found",    value: "26 June 2026"            },
      { key: "Location", value: "Clapham Common Stn (S)"  },
    ],
    goodToKnow: [
      { key: "Claim",    value: "Describe to identify"   },
      { key: "Contact",  value: "Message via LokalAds"   },
    ],
    coordinates: { lat: 51.4624, lng: -0.1380 },
    seller: SELLERS.alice,
  },
  {
    id: "comm-lost-02", href: "/listings/comm-lost-02", advId: "80002",
    images: [{ src: img(2), alt: "Lost wallet" }],
    priceLabel: "£50 Reward",
    title: "LOST: Black Leather Wallet — Victoria Station Area, 25 Jun",
    detailsLabel: "LOST & FOUND • WALLET • VICTORIA",
    locationLabel: "Victoria, London",
    postedAt: hrsAgo(8),
    description: "<p>Lost a <strong>black leather slim wallet</strong> somewhere around Victoria Station or Victoria Coach Station on 25 June afternoon. Contains driving licence, two bank cards, and personal items. £50 reward for return.</p>",
    keyDetails: [
      { key: "Item",     value: "Black leather slim wallet" },
      { key: "Lost",     value: "25 June 2026, afternoon"   },
      { key: "Location", value: "Victoria Station area"     },
    ],
    goodToKnow: [
      { key: "Reward",   value: "£50 for return"          },
      { key: "Contains", value: "Driving licence + cards" },
      { key: "Contact",  value: "Message via LokalAds"    },
    ],
    coordinates: { lat: 51.4952, lng: -0.1441 },
    seller: SELLERS.dave,
  },
  {
    id: "comm-lost-03", href: "/listings/comm-lost-03", advId: "80003",
    images: [{ src: img(3), alt: "Found bicycle" }],
    priceLabel: "FREE",
    title: "FOUND: Abandoned Bicycle — Locked to Railings, Kennington, 3 Weeks",
    detailsLabel: "LOST & FOUND • BICYCLE • KENNINGTON",
    locationLabel: "Kennington, London",
    postedAt: daysAgo(1),
    description: "<p>There is a <strong>blue hybrid bicycle</strong> locked to railings on Kennington Park Road that appears to have been abandoned for 3+ weeks. Lock is rusty, no lights. Posting in case the owner is looking for it. Reporting to council if no response in 7 days.</p>",
    keyDetails: [
      { key: "Item",     value: "Blue hybrid bicycle"      },
      { key: "Location", value: "Kennington Park Rd SE11"  },
      { key: "Since",    value: "~3 weeks, appears abandoned" },
    ],
    goodToKnow: [
      { key: "Lock",    value: "Still locked to railings"  },
      { key: "Action",  value: "Reporting to council 7 days" },
      { key: "Contact", value: "Message to claim"           },
    ],
    coordinates: { lat: 51.4875, lng: -0.1086 },
    seller: SELLERS.alice,
  },
];


import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── wearables_smart ────────────────────────────────────────────────────────────
export const TECH_WEARABLES: MockListing[] = [
  {
    id: "tech-wear-01", href: "/listings/tech-wear-01", advId: "17061",
    images: [{ src: img(9), alt: "Apple Watch" }],
    priceLabel: "£320",
    title: "Apple Watch Series 9 45mm — GPS, Midnight Aluminium, Like New",
    detailsLabel: "WEARABLES • LIKE NEW • APPLE WATCH",
    locationLabel: "Richmond, London",
    postedAt: hrsAgo(3),
    description: "<p>Near-new <strong>Apple Watch Series 9 45mm GPS</strong> in Midnight Aluminium with Midnight Sport Band. Used for 6 months — 97% battery health. Purchased Jan 2026, AppleCare+ transferable to new owner. Original box.</p>",
    keyDetails: [
      { key: "Model",     value: "Apple Watch Series 9 45mm" },
      { key: "Type",      value: "GPS (Wi-Fi)"               },
      { key: "Colour",    value: "Midnight Aluminium"        },
      { key: "Battery",   value: "97% health"                },
    ],
    goodToKnow: [
      { key: "AppleCare", value: "AppleCare+ transferable"  },
      { key: "Bands",     value: "2 extra bands included"   },
      { key: "Box",       value: "Original box + charger"   },
      { key: "Collection", value: "Richmond TW9"            },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.techPrivate,
  },
  {
    id: "tech-wear-02", href: "/listings/tech-wear-02", advId: "17062",
    images: [{ src: img(1), alt: "Garmin running watch" }],
    priceLabel: "£260",
    title: "Garmin Forerunner 265 GPS Watch — AMOLED, Music, 13-Day Battery",
    detailsLabel: "WEARABLES • EXCELLENT • GARMIN",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(1),
    description: "<p>Excellent <strong>Garmin Forerunner 265 GPS running watch</strong> with AMOLED display, offline music (1,000 songs), HRV status, and Garmin Coach plans. 13-day battery. Used for one marathon training cycle.</p>",
    keyDetails: [
      { key: "Model",    value: "Garmin Forerunner 265"     },
      { key: "GPS",      value: "Multi-band (most accurate)" },
      { key: "Music",    value: "Up to 1,000 songs"         },
      { key: "Battery",  value: "Up to 13 days"             },
    ],
    goodToKnow: [
      { key: "Extra Band", value: "Included"               },
      { key: "Charging",   value: "Cable included"         },
      { key: "Box",        value: "Original"               },
      { key: "Collection", value: "Wimbledon SW19"         },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.techPrivate,
  },
  {
    id: "tech-wear-03", href: "/listings/tech-wear-03", advId: "17063",
    images: [{ src: img(2), alt: "WHOOP 4.0" }],
    priceLabel: "£95",
    title: "WHOOP 4.0 Fitness Tracker + 6 Months Membership — Any Wrist, Excellent",
    detailsLabel: "WEARABLES • EXCELLENT • WHOOP 4.0",
    locationLabel: "Islington, London",
    postedAt: daysAgo(2),
    description: "<p><strong>WHOOP 4.0 fitness tracker</strong> with 6 months membership remaining. Tracks HRV, sleep, recovery, and strain 24/7. 5 band sizes included. Clean and reset — ready for a new owner to transfer the membership.</p>",
    keyDetails: [
      { key: "Device",      value: "WHOOP 4.0"              },
      { key: "Membership",  value: "6 months remaining"     },
      { key: "Bands",       value: "5 sizes included"       },
      { key: "Condition",   value: "Excellent"              },
    ],
    goodToKnow: [
      { key: "Transfer",  value: "Membership transferable" },
      { key: "No Screen", value: "Minimal form factor"     },
      { key: "App",       value: "iOS + Android"           },
      { key: "Collection", value: "Islington N1"           },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.techPrivate,
  },
];


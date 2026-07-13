import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── cars ──────────────────────────────────────────────────────────────────────
export const VEHICLES_CARS: MockListing[] = [
  {
    id: "veh-car-01", href: "/listings/veh-car-01", advId: "20001",
    images: [{ src: img(1), alt: "Toyota Camry" }, { src: img(2), alt: "Interior" }],
    priceLabel: "£18,500",
    title: "2022 Toyota Camry — Hybrid, Full Service History, 1 Owner",
    detailsLabel: "2022 • 22,000 MILES • HYBRID",
    locationLabel: "Bromley, London",
    postedAt: hrsAgo(2),
    description: "<p>Immaculate <strong>2022 Toyota Camry Hybrid</strong> with full Toyota dealer service history and one owner from new. HID headlights, heated seats, Apple CarPlay, and reverse camera. Still under manufacturer warranty.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Toyota Camry 2.5 Hybrid"  },
      { key: "Year / Reg",    value: "2022 / YA22 XXX"          },
      { key: "Mileage",       value: "22,000 miles"             },
      { key: "Fuel Type",     value: "Hybrid (petrol/electric)" },
      { key: "Transmission",  value: "Automatic (CVT)"          },
    ],
    goodToKnow: [
      { key: "Condition",     value: "Excellent"         },
      { key: "MOT Expiry",    value: "Aug 2027"          },
      { key: "Service Hist.", value: "Full Toyota FSH"   },
      { key: "Part Exchange", value: "Considered"        },
      { key: "Finance",       value: "Available via 3rd" },
    ],
    coordinates: { lat: 51.4059, lng: 0.0152 },
    seller: SELLERS.dave,
  },
  {
    id: "veh-car-02", href: "/listings/veh-car-02", advId: "20002",
    images: [{ src: img(3), alt: "BMW 320d front" }, { src: img(4), alt: "Cockpit" }],
    priceLabel: "£24,995",
    title: "2021 BMW 320d M Sport — Diesel, Sunroof, Head-Up Display",
    detailsLabel: "2021 • 38,000 MILES • DIESEL",
    locationLabel: "Croydon, London",
    postedAt: hrsAgo(5),
    description: "<p>Outstanding <strong>2021 BMW 320d M Sport</strong> in Mineral White with red M stitching. Factory sunroof, head-up display, Harman Kardon audio, and live Professional Navigation. Full BMW dealer service history.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "BMW 320d M Sport"  },
      { key: "Year / Reg",    value: "2021 / YA21 XXX"   },
      { key: "Mileage",       value: "38,000 miles"      },
      { key: "Fuel Type",     value: "Diesel"            },
      { key: "Transmission",  value: "8-Speed Auto"      },
    ],
    goodToKnow: [
      { key: "Condition",     value: "Excellent"       },
      { key: "MOT Expiry",    value: "Jul 2026"        },
      { key: "Service Hist.", value: "Full BMW FSH"    },
      { key: "Warranty",      value: "BMW Approved"    },
      { key: "Finance",       value: "Available"       },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.apex,
  },
  {
    id: "veh-car-03", href: "/listings/veh-car-03", advId: "20003",
    images: [{ src: img(5), alt: "Tesla Model 3" }, { src: img(6), alt: "Interior" }],
    priceLabel: "\u00a326,500",
    title: "2020 Tesla Model 3 Long Range \u2014 AWD, Enhanced Autopilot, 35,000 Miles",
    detailsLabel: "2020 \u2022 35,000 MILES \u2022 ELECTRIC",
    locationLabel: "Putney, London",
    postedAt: daysAgo(1),
    description: "<p>Immaculate <strong>2020 Tesla Model 3 Long Range AWD</strong> in Pearl White with black interior. Enhanced Autopilot, panoramic glass roof, and premium audio. One owner from new \u2014 private sale only, no dealers please.</p><p>338-mile WLTP range. Home charging cable (Type 2) and all adaptors included. Full software history visible in-app.</p>",
    keyDetails: [
      { key: "Make / Model",    value: "Tesla Model 3 LR AWD"  },
      { key: "Year / Reg",      value: "2020 / GL20 XXX"        },
      { key: "Mileage",         value: "35,000 miles"           },
      { key: "Fuel Type",       value: "Electric (AWD)"         },
      { key: "Range (WLTP)",    value: "338 miles"              },
      { key: "Transmission",    value: "Single-speed auto"      },
    ],
    goodToKnow: [
      { key: "Condition",      value: "Excellent"                },
      { key: "Battery Health", value: "94% (Tesla app)"          },
      { key: "Charging",       value: "Type 2 cable included"    },
      { key: "Owners",         value: "1 \u2014 private only"   },
      { key: "Part Exchange",  value: "Not considered"           },
    ],
    coordinates: { lat: 51.4618, lng: -0.2156 },
    seller: SELLERS.dave,
  },
];


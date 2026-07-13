import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── boats ─────────────────────────────────────────────────────────────────────
export const VEHICLES_BOATS: MockListing[] = [
  {
    id: "veh-boat-01", href: "/listings/veh-boat-01", advId: "20041",
    images: [{ src: img(3), alt: "Bayliner VR5" }],
    priceLabel: "£22,000",
    title: "2019 Bayliner VR5 Bowrider — 200HP, Wakeboard Tower, Trailer",
    detailsLabel: "2019 • 180 HOURS • PETROL",
    locationLabel: "Kingston upon Thames",
    postedAt: daysAgo(1),
    description: "<p>Superb <strong>2019 Bayliner VR5 Bowrider</strong> with MerCruiser 4.3L V6 200HP. Wakeboard tower, bimini top, shore power, and boarding ladder. Only 180 engine hours. Trailer and full canvas included.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Bayliner VR5 Bowrider" },
      { key: "Year",          value: "2019"                  },
      { key: "Engine Hours",  value: "180 hours"             },
      { key: "Engine",        value: "MerCruiser V6 200HP"   },
      { key: "Length",        value: "5.5m (18ft)"           },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Excellent"         },
      { key: "Trailer",    value: "Included"          },
      { key: "Mooring",    value: "Not included"      },
      { key: "Service",    value: "Serviced 2025"     },
      { key: "Licence",    value: "ICC/RYA recommended" },
    ],
    coordinates: { lat: 51.4123, lng: -0.3007 },
    seller: SELLERS.dave,
  },
  {
    id: "veh-boat-02", href: "/listings/veh-boat-02", advId: "20042",
    images: [{ src: img(4), alt: "Waverunner Jet Ski" }],
    priceLabel: "£8,500",
    title: "2020 Yamaha VX Cruiser HO — Jet Ski, 90HP, 95 Hours",
    detailsLabel: "2020 • 95 HOURS • PETROL",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(2),
    description: "<p>Excellent <strong>2020 Yamaha VX Cruiser HO</strong> jet ski with the 1.8L High Output engine producing 90HP. Only 95 engine hours. Comes with fitted cover, life jackets (2), and hydro-turf mats.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Yamaha VX Cruiser HO" },
      { key: "Year",          value: "2020"                 },
      { key: "Engine Hours",  value: "95 hours"             },
      { key: "Engine",        value: "1.8L HO, 90HP"        },
      { key: "Seats",         value: "3 persons"            },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Excellent"         },
      { key: "Cover",      value: "Fitted, included"  },
      { key: "Life Jackets", value: "2 included"      },
      { key: "Service",    value: "Current"           },
      { key: "Transport",  value: "Trailer available" },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.dave,
  },
  {
    id: "veh-boat-03", href: "/listings/veh-boat-03", advId: "20043",
    images: [{ src: img(5), alt: "Narrowboat River Wren" }],
    priceLabel: "\u00a348,000",
    title: "58ft Narrowboat \"River Wren\" \u2014 Cruiser Stern, Residential Mooring Included",
    detailsLabel: "2014 \u2022 58FT \u2022 DIESEL",
    locationLabel: "Little Venice, London",
    postedAt: daysAgo(5),
    description: "<p>Beautifully fitted <strong>58ft trad-bow narrowboat</strong> built 2014. Cruiser stern, Webasto central heating, solid fuel stove, full double berth cabin, and separate shower/WC. Four-berth layout.</p><p>Residential mooring at Little Venice marina included until December 2026 \u2014 an exceptionally rare find in London.</p>",
    keyDetails: [
      { key: "Length",        value: "58ft (17.7m)"             },
      { key: "Year Built",    value: "2014"                    },
      { key: "Engine",        value: "Beta Marine 43HP diesel" },
      { key: "Berths",        value: "4 (double + 2 singles)"  },
      { key: "Mooring",       value: "Little Venice, to Dec 2026" },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Very Good"             },
      { key: "BSS",        value: "Current until 2027"    },
      { key: "CRT Licence",value: "Active"                },
      { key: "Survey",     value: "Available on request" },
      { key: "Mooring",    value: "Included to Dec 2026" },
    ],
    coordinates: { lat: 51.5225, lng: -0.1819 },
    seller: SELLERS.dave,
  },
];


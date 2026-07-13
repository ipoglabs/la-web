import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── van ───────────────────────────────────────────────────────────────────────
export const VEHICLES_VAN: MockListing[] = [
  {
    id: "veh-van-01", href: "/listings/veh-van-01", advId: "20021",
    images: [{ src: img(7), alt: "Ford Transit Custom" }, { src: img(8), alt: "Load area" }],
    priceLabel: "£16,500",
    title: "2020 Ford Transit Custom L2 H1 — 130PS, Air Con, Ply Lined",
    detailsLabel: "2020 • 65,000 MILES • DIESEL",
    locationLabel: "Croydon, London",
    postedAt: hrsAgo(6),
    description: "<p>Reliable <strong>2020 Ford Transit Custom LWB</strong> in metallic silver. 130PS, air conditioning, reversing sensors, ply-lined with shelving retained. One previous trade owner — well maintained throughout.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Ford Transit Custom L2H1" },
      { key: "Year",          value: "2020"                     },
      { key: "Mileage",       value: "65,000 miles"             },
      { key: "Payload",       value: "1,000 kg"                 },
      { key: "Load Length",   value: "2.6m"                     },
    ],
    goodToKnow: [
      { key: "Condition",     value: "Good working order" },
      { key: "MOT Expiry",    value: "Sep 2026"           },
      { key: "Service Hist.", value: "Available"          },
      { key: "Finance",       value: "Available"          },
      { key: "VAT",           value: "+ VAT (20%)"        },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.fleet,
  },
  {
    id: "veh-van-02", href: "/listings/veh-van-02", advId: "20022",
    images: [{ src: img(9), alt: "VW Transporter T6.1" }],
    priceLabel: "£21,000",
    title: "2021 VW Transporter T6.1 Kombi 9-Seat — DSG, Highline Spec",
    detailsLabel: "2021 • 42,000 MILES • DIESEL",
    locationLabel: "Sutton, London",
    postedAt: daysAgo(1),
    description: "<p>Stunning <strong>2021 VW Transporter T6.1 Kombi Highline DSG</strong>. 9 seats with removable rear bench, bi-xenon headlights, 18-inch alloys, and cruise control. Ideal for a large family or private hire.</p>",
    keyDetails: [
      { key: "Make / Model", value: "VW Transporter T6.1 Kombi" },
      { key: "Year",         value: "2021"                      },
      { key: "Mileage",      value: "42,000 miles"              },
      { key: "Seats",        value: "9 (rear removable)"        },
      { key: "Gearbox",      value: "DSG Automatic"             },
    ],
    goodToKnow: [
      { key: "Condition",   value: "Excellent"       },
      { key: "MOT Expiry",  value: "May 2027"        },
      { key: "Finance",     value: "Available"       },
      { key: "Part Exch.",  value: "Considered"      },
      { key: "VAT",         value: "Exempt (private)" },
    ],
    coordinates: { lat: 51.3605, lng: -0.1945 },
    seller: SELLERS.dave,
  },
  {
    id: "veh-van-03", href: "/listings/veh-van-03", advId: "20023",
    images: [{ src: img(1), alt: "Renault Master fridge van" }],
    priceLabel: "\u00a318,750",
    title: "2021 Renault Master L2H2 Refrigerated Van \u2014 Thermo King, 52,000 Miles",
    detailsLabel: "2021 \u2022 52,000 MILES \u2022 DIESEL",
    locationLabel: "Park Royal, London",
    postedAt: daysAgo(3),
    description: "<p>Purpose-built <strong>2021 Renault Master L2H2 refrigerated van</strong> with Thermo King T-200R unit. Maintains -18\u00b0C to +4\u00b0C, single-phase standby connection, aluminium interior lining, and temperature logger. Ex-food distribution \u2014 serviced history available.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Renault Master L2H2 Fridge" },
      { key: "Year",          value: "2021"                       },
      { key: "Mileage",       value: "52,000 miles"               },
      { key: "Fridge Unit",   value: "Thermo King T-200R"         },
      { key: "Temp Range",    value: "-18\u00b0C to +4\u00b0C"   },
      { key: "Fuel Type",     value: "Diesel"                     },
    ],
    goodToKnow: [
      { key: "Condition",     value: "Good working order" },
      { key: "MOT Expiry",    value: "Aug 2026"           },
      { key: "Standby",       value: "240V single phase"  },
      { key: "Finance",       value: "Available"          },
      { key: "VAT",           value: "+ VAT (20%)"        },
    ],
    coordinates: { lat: 51.5313, lng: -0.2813 },
    seller: SELLERS.fleet,
  },
];


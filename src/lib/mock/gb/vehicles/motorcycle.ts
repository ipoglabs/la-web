import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── motorcycle ────────────────────────────────────────────────────────────────
export const VEHICLES_MOTORCYCLE: MockListing[] = [
  {
    id: "veh-moto-01", href: "/listings/veh-moto-01", advId: "20011",
    images: [{ src: img(5), alt: "Honda CBR600RR" }],
    priceLabel: "£7,200",
    title: "2021 Honda CBR600RR — Sport, 9,500 Miles, Akrapovic Exhaust",
    detailsLabel: "2021 • 9,500 MILES • PETROL",
    locationLabel: "Hackney, London",
    postedAt: hrsAgo(4),
    description: "<p>Clean <strong>2021 Honda CBR600RR</strong> in Tricolour. Akrapovic slip-on exhaust, tinted screen, new Pirelli Diablo tyres. Honda dealer service at 8,000 miles. One owner, no modifications other than exhaust.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Honda CBR600RR"      },
      { key: "Year",          value: "2021"                },
      { key: "Mileage",       value: "9,500 miles"         },
      { key: "Engine CC",     value: "599cc inline-4"      },
      { key: "Category",      value: "Supersport"          },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Very Good"         },
      { key: "MOT Expiry", value: "Mar 2027"          },
      { key: "Licence",    value: "A licence required" },
      { key: "Insurance",  value: "Group 11"          },
      { key: "Part Exch.", value: "Considered"        },
    ],
    coordinates: { lat: 51.5465, lng: -0.0554 },
    seller: SELLERS.moto,
  },
  {
    id: "veh-moto-02", href: "/listings/veh-moto-02", advId: "20012",
    images: [{ src: img(6), alt: "Honda PCX125" }],
    priceLabel: "£3,499",
    title: "2023 Honda PCX125 — Scooter, Only 1,200 Miles, As New",
    detailsLabel: "2023 • 1,200 MILES • PETROL",
    locationLabel: "Islington, London",
    postedAt: daysAgo(1),
    description: "<p>Near-new <strong>2023 Honda PCX125</strong> in pearl black. 1,200 miles — light commute use only. Keyless ignition, LED lights, smart key, and underseat helmet storage. Perfect city commuter.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Honda PCX125"   },
      { key: "Year",         value: "2023"           },
      { key: "Mileage",      value: "1,200 miles"    },
      { key: "Engine CC",    value: "125cc, 4-valve" },
      { key: "Category",     value: "Scooter"        },
    ],
    goodToKnow: [
      { key: "Condition",  value: "As New"          },
      { key: "MOT Expiry", value: "Oct 2026"        },
      { key: "Licence",    value: "A1 / CBT valid"  },
      { key: "Insurance",  value: "Group 2"         },
      { key: "Delivery",   value: "Local delivery"  },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.moto,
  },
  {
    id: "veh-moto-03", href: "/listings/veh-moto-03", advId: "20013",
    images: [{ src: img(7), alt: "Royal Enfield Himalayan" }],
    priceLabel: "\u00a33,850",
    title: "2019 Royal Enfield Himalayan 411 \u2014 Adventure, 12,000 Miles, Panniers",
    detailsLabel: "2019 \u2022 12,000 MILES \u2022 PETROL",
    locationLabel: "Brixton, London",
    postedAt: daysAgo(2),
    description: "<p>Lightly used <strong>2019 Royal Enfield Himalayan 411cc</strong> in Snow White. Genuine Himalayan side panniers, Barkbuster hand guards, and centrestand included. Serviced at 11,500 miles. Upright, relaxed riding position \u2014 ideal for commuting and weekend adventure rides.</p>",
    keyDetails: [
      { key: "Make / Model", value: "Royal Enfield Himalayan"  },
      { key: "Year",         value: "2019"                    },
      { key: "Mileage",      value: "12,000 miles"            },
      { key: "Engine CC",    value: "411cc single-cylinder"   },
      { key: "Category",     value: "Adventure / Touring"     },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Very Good"               },
      { key: "MOT Expiry", value: "Jan 2027"                },
      { key: "Licence",    value: "A licence / A2 eligible" },
      { key: "Extras",     value: "Panniers + hand guards"  },
      { key: "Part Exch.", value: "Considered"              },
    ],
    coordinates: { lat: 51.4613, lng: -0.1157 },
    seller: SELLERS.dave,
  },
];


import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── truck ─────────────────────────────────────────────────────────────────────
export const VEHICLES_TRUCK: MockListing[] = [
  {
    id: "veh-truck-01", href: "/listings/veh-truck-01", advId: "20031",
    images: [{ src: img(1), alt: "DAF LF 7.5T" }],
    priceLabel: "£28,500",
    title: "2019 DAF LF 250 7.5T — Curtainsider, Tail Lift, Fresh MOT",
    detailsLabel: "2019 • 185,000 MILES • DIESEL",
    locationLabel: "Park Royal, London",
    postedAt: daysAgo(2),
    description: "<p>Solid <strong>2019 DAF LF 250 7.5T curtainsider</strong> with Dhollandia tail lift, digital tachograph, and rear sensors. Ex last-mile delivery — good service history. Sold with fresh MOT on completion.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "DAF LF 250 7.5T"    },
      { key: "Year",          value: "2019"               },
      { key: "Mileage",       value: "185,000 miles"      },
      { key: "Body",          value: "Curtainsider"       },
      { key: "GVW",           value: "7,500 kg"           },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Good working order"   },
      { key: "MOT",        value: "Fresh MOT on sale"    },
      { key: "Cat. Lic.",  value: "Cat C required"       },
      { key: "Tail Lift",  value: "Dhollandia, working"  },
      { key: "VAT",        value: "+ VAT"                },
    ],
    coordinates: { lat: 51.5313, lng: -0.2813 },
    seller: SELLERS.fleet,
  },
  {
    id: "veh-truck-02", href: "/listings/veh-truck-02", advId: "20032",
    images: [{ src: img(2), alt: "Mercedes Sprinter tipper" }],
    priceLabel: "£14,995",
    title: "2018 Mercedes Sprinter 3.5T Tipper — Manual, Good Condition",
    detailsLabel: "2018 • 94,000 MILES • DIESEL",
    locationLabel: "Southwark, London",
    postedAt: daysAgo(3),
    description: "<p>Well-maintained <strong>2018 Mercedes Sprinter 3.5T tipper</strong> in white. Twin-rear-wheel, aluminium tipping body, side boards, and toolbox. ULEZ compliant. Ideal for builders, landscapers, or waste removal.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Mercedes Sprinter 3.5T" },
      { key: "Year",          value: "2018"                   },
      { key: "Mileage",       value: "94,000 miles"           },
      { key: "Body",          value: "Tipper"                 },
      { key: "ULEZ",          value: "Compliant"              },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Good"               },
      { key: "MOT Expiry", value: "Nov 2026"           },
      { key: "ULEZ",       value: "Compliant"          },
      { key: "Finance",    value: "Available"          },
      { key: "VAT",        value: "+ VAT"              },
    ],
    coordinates: { lat: 51.4993, lng: -0.0637 },
    seller: SELLERS.fleet,
  },
  {
    id: "veh-truck-03", href: "/listings/veh-truck-03", advId: "20033",
    images: [{ src: img(3), alt: "Iveco Daily dropside" }],
    priceLabel: "\u00a311,500",
    title: "2017 Iveco Daily 35C15 3.5T Dropside \u2014 58,000 Miles, ULEZ Compliant",
    detailsLabel: "2017 \u2022 58,000 MILES \u2022 DIESEL",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(4),
    description: "<p>Well-presented <strong>2017 Iveco Daily 35C15 dropside flatbed</strong> with aluminium side boards and rear board. ULEZ compliant, 150HP, electric windows, and Bluetooth. Ideal for builders, landscapers, or plant hire operators.</p>",
    keyDetails: [
      { key: "Make / Model",  value: "Iveco Daily 35C15"    },
      { key: "Year",          value: "2017"                 },
      { key: "Mileage",       value: "58,000 miles"         },
      { key: "Body",          value: "Dropside flatbed"     },
      { key: "GVW",           value: "3,500 kg"             },
      { key: "ULEZ",          value: "Compliant"            },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Good"              },
      { key: "MOT Expiry", value: "Mar 2027"          },
      { key: "ULEZ",       value: "Compliant"         },
      { key: "Finance",    value: "Available"         },
      { key: "VAT",        value: "+ VAT"             },
    ],
    coordinates: { lat: 51.4607, lng: -0.0126 },
    seller: SELLERS.fleet,
  },
];


import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── parts_accessories ─────────────────────────────────────────────────────────
export const VEHICLES_PARTS: MockListing[] = [
  {
    id: "veh-parts-01", href: "/listings/veh-parts-01", advId: "20051",
    images: [{ src: img(5), alt: "BMW N52 engine" }],
    priceLabel: "£650",
    title: "BMW E90 320i N52 Engine Pull-Out — 78,000 Miles, Tested",
    detailsLabel: "ENGINE • BMW E90 • 2006-2011",
    locationLabel: "Walthamstow, London",
    postedAt: daysAgo(3),
    description: "<p>Low-mileage <strong>BMW N52B20 2.0L straight-six engine</strong> pulled from a 2008 E90 320i ULEZ write-off — engine untouched. 78,000 miles, started and ran before removal.</p>",
    keyDetails: [
      { key: "Part Type",    value: "Complete engine"        },
      { key: "Fits",         value: "BMW E90/E91/E92 320i"  },
      { key: "Engine Code",  value: "N52B20"                 },
      { key: "Mileage",             value: "78,000 miles"           },
      { key: "OEM / Aftermarket",   value: "OEM — genuine BMW unit"  },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Good — tested"           },
      { key: "Warranty",   value: "No warranty"             },
      { key: "Collection", value: "Preferred (Walthamstow)" },
      { key: "Delivery",   value: "Pallet delivery £50"     },
    ],
    coordinates: { lat: 51.5848, lng: -0.0209 },
    seller: SELLERS.dave,
  },
  {
    id: "veh-parts-02", href: "/listings/veh-parts-02", advId: "20052",
    images: [{ src: img(6), alt: "Alloy wheels set" }],
    priceLabel: "£380",
    title: "18-Inch Audi A4 B9 Alloy Wheels × 4 — Tyres 70% Tread",
    detailsLabel: "TYRES & RIMS • AUDI A4 B9 • 18 INCH",
    locationLabel: "Wimbledon, London",
    postedAt: daysAgo(1),
    description: "<p>Set of four <strong>18-inch Audi A4 B9 alloy wheels</strong> in excellent condition — no kerb damage, no cracks. Fitted with Hankook Ventus tyres at 70% tread life remaining. Genuine OEM wheels.</p>",
    keyDetails: [
      { key: "Part Type",   value: "Alloy wheels × 4"  },
      { key: "Fits",        value: "Audi A4 B9 (2015+)" },
      { key: "Size",        value: "18\" 8J ET39"       },
      { key: "Tyres",              value: "225/40/18, 70% tread"   },
      { key: "OEM / Aftermarket",   value: "OEM — genuine Audi"      },
    ],
    goodToKnow: [
      { key: "Condition",  value: "Excellent"          },
      { key: "Bolts",      value: "Not included"       },
      { key: "Collection", value: "Wimbledon only"     },
      { key: "Delivery",   value: "Not available"      },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.dave,
  },
  {
    id: "veh-parts-03", href: "/listings/veh-parts-03", advId: "20053",
    images: [{ src: img(7), alt: "EBC brake kit" }],
    priceLabel: "\u00a3245",
    title: "BMW 3-Series F30/F31 EBC Yellowstuff Brake Kit \u2014 Front & Rear, New Unopened",
    detailsLabel: "BRAKE KIT \u2022 BMW F30/F31 \u2022 NEW",
    locationLabel: "London",
    postedAt: hrsAgo(12),
    description: "<p>Brand new, sealed <strong>EBC Yellowstuff high-performance brake kit</strong> for BMW F30/F31/F32 3-Series (2012\u20132019). Includes front and rear pads (DP41962R \u00d7 2, DP41963R \u00d7 2) plus four grooved sport discs. Purchased for a car that was written off before fitting \u2014 receipt available.</p>",
    keyDetails: [
      { key: "Part Type",          value: "Brake kit (pads + discs)"    },
      { key: "Fits",               value: "BMW F30/F31/F32 (2012\u20132019)" },
      { key: "Brand",              value: "EBC Yellowstuff"             },
      { key: "Condition",          value: "New \u2014 sealed boxes"     },
      { key: "OEM / Aftermarket",  value: "Aftermarket performance"     },
    ],
    goodToKnow: [
      { key: "Box",        value: "Original sealed boxes"  },
      { key: "Receipt",    value: "Available"              },
      { key: "Collection", value: "Flexible, London area"  },
      { key: "Postage",    value: "\u00a38.50 tracked"    },
      { key: "Returns",    value: "No \u2014 new, unused" },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.quickSell,
  },
];


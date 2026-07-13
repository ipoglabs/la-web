import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const SG_PROPERTY_LAND: MockListing[] = [
  {
    id: "prop-sg-land-01", href: "/listings/prop-sg-land-01", advId: "30601",
    images: [
      { src: img(2), alt: "Landed plot" },
    ],
    priceLabel: "S$3,200,000",
    title: "Freehold Landed Plot — Ready for Rebuild, Chestnut Avenue",
    detailsLabel: "3,800 SQ FT • FREEHOLD • RESIDENTIAL",
    locationLabel: "Chestnut Avenue, Bukit Panjang",
    postedAt: daysAgo(2),
    description: "<p><strong>Freehold residential plot</strong> with an existing bungalow ready for A&A works or full rebuild. Zoned for a good class bungalow-style redevelopment within URA guidelines.</p><p>Close to the future Chestnut MRT extension and Bukit Panjang town centre.</p>",
    keyDetails: [
      { key: "Plot Size", value: "3,800 sq ft"      },
      { key: "Zoning",    value: "Residential (Landed)" },
      { key: "Tenure",    value: "Freehold"           },
      { key: "GPR",       value: "1.4 (per URA Master Plan)" },
      { key: "Road Access", value: "Paved, single lane" },
    ],
    goodToKnow: [
      { key: "Option Fee", value: "S$5,000 (OTP)"    },
      { key: "ABSD",       value: "Applies per buyer profile" },
      { key: "Rebuild",    value: "Subject to URA/BCA approval" },
      { key: "Survey",     value: "Available on request" },
    ],
    coordinates: { lat: 1.3796, lng: 103.7639 },
    seller: SELLERS.huatProperty,
  },
  {
    id: "prop-sg-land-02", href: "/listings/prop-sg-land-02", advId: "30602",
    images: [
      { src: img(3), alt: "Redevelopment site" },
    ],
    priceLabel: "S$5,500,000",
    title: "En-Bloc Redevelopment Site — District 15, Near MRT",
    detailsLabel: "6,500 SQ FT • FREEHOLD • MIXED USE",
    locationLabel: "Marine Parade (District 15)",
    postedAt: daysAgo(5),
    description: "<p>Strategic <strong>freehold redevelopment site</strong> in District 15 suitable for a boutique residential or mixed-use scheme, subject to planning approval.</p><p>Close to the Thomson-East Coast Line and the East Coast Park precinct — strong rental demand catchment.</p>",
    keyDetails: [
      { key: "Plot Size",  value: "6,500 sq ft"        },
      { key: "Zoning",     value: "Residential / Mixed Use" },
      { key: "Tenure",     value: "Freehold"            },
      { key: "GPR Potential", value: "Up to 2.1 (indicative)" },
      { key: "MRT Distance", value: "8 min walk"        },
    ],
    goodToKnow: [
      { key: "Option Fee", value: "S$10,000 (OTP)"     },
      { key: "Approval",   value: "URA outline advice recommended" },
      { key: "ABSD/SSD",   value: "Applies per buyer profile" },
      { key: "Survey",     value: "Available on request" },
    ],
    coordinates: { lat: 1.3006, lng: 103.9068 },
    seller: SELLERS.era,
  },
];

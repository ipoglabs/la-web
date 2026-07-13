import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const SG_PROPERTY_COMMERCIAL: MockListing[] = [
  {
    id: "prop-sg-com-01", href: "/listings/prop-sg-com-01", advId: "30401",
    images: [
      { src: img(5), alt: "Office space" },
      { src: img(6), alt: "Meeting room" },
    ],
    priceLabel: "S$8,500", priceSuffix: "/ mo",
    title: "Grade A Office — 2,200 sq ft, Raffles Place, Fitted",
    detailsLabel: "2,200 SQ FT • OFFICE • FITTED",
    locationLabel: "Raffles Place",
    postedAt: hrsAgo(3),
    description: "<p>Premium <strong>Grade A office</strong> in a landmark Raffles Place tower, Cat A fitted with raised floors and VRV air conditioning. Column-free floor plate with panoramic CBD views.</p><p>Directly connected to Raffles Place MRT interchange — one of Singapore's most prestigious business addresses.</p>",
    keyDetails: [
      { key: "Zoning",     value: "Commercial"      },
      { key: "Floor Area", value: "2,200 sq ft"      },
      { key: "Lease Term", value: "Flexible 2–5 yr" },
      { key: "MRT Distance", value: "Direct link"   },
      { key: "Fit-Out",    value: "Cat A"            },
    ],
    goodToKnow: [
      { key: "Available",  value: "Immediately"    },
      { key: "Service Charge", value: "Included in rent" },
      { key: "Access",     value: "24/7 card access" },
      { key: "Parking",    value: "Limited, on request" },
    ],
    coordinates: { lat: 1.2839, lng: 103.8517 },
    seller: SELLERS.era,
  },
  {
    id: "prop-sg-com-02", href: "/listings/prop-sg-com-02", advId: "30402",
    images: [
      { src: img(7), alt: "Retail shop" },
    ],
    priceLabel: "S$6,200", priceSuffix: "/ mo",
    title: "Ground Floor Retail Unit — High Footfall, Bugis",
    detailsLabel: "750 SQ FT • RETAIL • SHELL",
    locationLabel: "Bugis",
    postedAt: daysAgo(1),
    description: "<p>Prime <strong>ground floor retail unit</strong> along Bugis Street's busy pedestrian mall. Shell condition with a wide glass shopfront, suitable for F&B or fashion retail.</p><p>Directly above Bugis MRT interchange with heavy tourist and shopper footfall throughout the day.</p>",
    keyDetails: [
      { key: "Zoning",     value: "Commercial (Retail)" },
      { key: "Floor Area", value: "750 sq ft"           },
      { key: "Lease Term", value: "New 2–3 yr"         },
      { key: "MRT Distance", value: "Direct link"      },
      { key: "Fit-Out",    value: "Shell"               },
    ],
    goodToKnow: [
      { key: "Available", value: "Immediately"       },
      { key: "Footfall",  value: "Very high — MRT link" },
      { key: "Signage",   value: "Permitted"           },
      { key: "GST",       value: "Applicable"          },
    ],
    coordinates: { lat: 1.3006, lng: 103.8559 },
    seller: SELLERS.era,
  },
];

import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const IN_PROPERTY_LAND: MockListing[] = [
  {
    id: "prop-in-land-01", href: "/listings/prop-in-land-01", advId: "20601",
    images: [
      { src: img(4), alt: "Residential plot" },
    ],
    priceLabel: "₹65 Lakh",
    title: "BMRDA-Approved Residential Plot — Clear Title, Devanahalli",
    detailsLabel: "2,400 SQ FT • FREEHOLD • RESIDENTIAL",
    locationLabel: "Devanahalli, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p><strong>BMRDA-approved plot</strong> in a gated layout near Devanahalli, close to Kempegowda International Airport and the upcoming Aerospace Park. Clear title with khata and EC in hand.</p><p>Ready for immediate construction — water, electricity, and tar roads already in place within the layout.</p>",
    keyDetails: [
      { key: "Plot Area",   value: "2,400 sq ft"          },
      { key: "Approval",    value: "BMRDA approved"       },
      { key: "Khata / EC",  value: "A-khata, clear EC"    },
      { key: "Facing",      value: "East"                  },
      { key: "Road Access",  value: "30 ft tar road"       },
    ],
    goodToKnow: [
      { key: "Registration", value: "Guidance value applies" },
      { key: "Services",     value: "Water & electricity connected" },
      { key: "Layout",       value: "Gated, security available"     },
      { key: "Loan",         value: "Bank finance available"        },
      { key: "Survey",       value: "Available on request"          },
    ],
    coordinates: { lat: 13.2437, lng: 77.7159 },
    seller: SELLERS.rajesh,
  },
  {
    id: "prop-in-land-02", href: "/listings/prop-in-land-02", advId: "20602",
    images: [
      { src: img(5), alt: "Agricultural land" },
    ],
    priceLabel: "₹28 Lakh",
    title: "2-Acre Agricultural Land — Borewell, Near Mulshi Dam",
    detailsLabel: "2 ACRES • FREEHOLD • AGRICULTURAL",
    locationLabel: "Mulshi, Pune",
    postedAt: daysAgo(4),
    description: "<p>Fertile <strong>2-acre agricultural land</strong> near Mulshi Dam with an existing borewell and mature fruit trees. Currently under grape cultivation with drip irrigation infrastructure in place.</p><p>Approx 40 minutes from Pune city — popular for farmhouses and weekend retreats given the scenic backwater views.</p>",
    keyDetails: [
      { key: "Plot Size",   value: "2 acres"          },
      { key: "Zoning",      value: "Agricultural (NA possible)" },
      { key: "Water Source", value: "Borewell + drip irrigation" },
      { key: "Road Access", value: "Kutcha road, 12 ft" },
      { key: "Title",       value: "7/12 extract clear" },
    ],
    goodToKnow: [
      { key: "Registration", value: "Ready reckoner rate applies" },
      { key: "Fencing",      value: "Partial, stone wall"          },
      { key: "Cultivation",  value: "Grapes, currently active"     },
      { key: "NA Conversion", value: "Buyer to apply"              },
      { key: "Survey",       value: "Available on request"        },
    ],
    coordinates: { lat: 18.5089, lng: 73.5108 },
    seller: SELLERS.priya,
  },
];

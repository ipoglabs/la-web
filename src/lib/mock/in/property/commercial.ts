import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const IN_PROPERTY_COMMERCIAL: MockListing[] = [
  {
    id: "prop-in-com-01", href: "/listings/prop-in-com-01", advId: "20401",
    images: [
      { src: img(7), alt: "Office space" },
      { src: img(8), alt: "Workstations" },
    ],
    priceLabel: "₹1,20,000", priceSuffix: "/ mo",
    title: "Grade A Office Space — 3,000 sq ft, Fully Fitted, Cyber City",
    detailsLabel: "3,000 SQ FT • OFFICE • FITTED",
    locationLabel: "DLF Cyber City, Gurugram",
    postedAt: hrsAgo(5),
    description: "<p>Fully fitted <strong>Grade A office</strong> on the 6th floor of a DLF Cyber City tower. Includes 60 workstations, 3 cabins, 2 meeting rooms, and centralised air conditioning.</p><p>Direct access to the Rapid Metro and NH-48 — one of Gurugram's most sought-after commercial addresses.</p>",
    keyDetails: [
      { key: "Built-Up Area", value: "3,000 sq ft"     },
      { key: "Floor",         value: "6th of 12"       },
      { key: "Lease Term",    value: "Flexible 3–9 yr" },
      { key: "Maintenance",   value: "₹18/sq ft/mo"    },
      { key: "Fit-Out",       value: "Fully furnished" },
    ],
    goodToKnow: [
      { key: "Available",    value: "Immediately"     },
      { key: "Power Backup", value: "100% DG backup"  },
      { key: "Parking",      value: "15 covered slots" },
      { key: "Security",     value: "24/7 CCTV"       },
      { key: "Brokerage",    value: "1 month rent"    },
    ],
    coordinates: { lat: 28.4949, lng: 77.0891 },
    seller: SELLERS.gurgaonRealty,
  },
  {
    id: "prop-in-com-02", href: "/listings/prop-in-com-02", advId: "20402",
    images: [
      { src: img(9), alt: "Retail shop" },
    ],
    priceLabel: "₹75,000", priceSuffix: "/ mo",
    title: "High-Street Retail Shop — Ground Floor, Anna Nagar 2nd Avenue",
    detailsLabel: "900 SQ FT • RETAIL • SHELL",
    locationLabel: "Anna Nagar, Chennai",
    postedAt: daysAgo(2),
    description: "<p>Prime <strong>ground floor retail shop</strong> on Anna Nagar's busy 2nd Avenue commercial stretch. Shell condition with a wide frontage, suitable for a showroom, retail brand, or bank branch.</p><p>High daily footfall from nearby residential blocks and the metro station; ample two-wheeler parking outside.</p>",
    keyDetails: [
      { key: "Built-Up Area", value: "900 sq ft"        },
      { key: "Frontage",      value: "30 ft"             },
      { key: "Lease Term",    value: "New 3–5 yr"        },
      { key: "Maintenance",   value: "₹6,000 / mo"       },
      { key: "Fit-Out",       value: "Shell / bare shell"},
    ],
    goodToKnow: [
      { key: "Available",  value: "Immediately"       },
      { key: "Footfall",   value: "High — main road"  },
      { key: "Parking",    value: "Two-wheeler outside" },
      { key: "Signage",    value: "Permitted"          },
      { key: "Brokerage",  value: "1 month rent"       },
    ],
    coordinates: { lat: 13.0850, lng: 80.2101 },
    seller: SELLERS.anita,
  },
];

import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const IN_PROPERTY_NEW_PROJECTS: MockListing[] = [
  {
    id: "prop-in-newp-01", href: "/listings/prop-in-newp-01", advId: "20801",
    images: [
      { src: img(3), alt: "Tower rendering" },
      { src: img(6), alt: "Clubhouse render" },
    ],
    priceLabel: "₹95 Lakh onwards",
    title: "New Launch 2 & 3BHK Towers — RERA Registered, Sarjapur Road",
    detailsLabel: "2-3 BHK • APARTMENT • UNDER CONSTRUCTION",
    locationLabel: "Sarjapur Road, Bengaluru",
    postedAt: hrsAgo(5),
    description: "<p>Freshly launched <strong>2 & 3BHK towers</strong> from Prestige Builders, with prices starting ₹95 Lakh for a 1,150 sq ft unit. Phase 1 possession slated for Dec 2028, with a clubhouse, infinity pool, and dedicated kids' play area.</p><p>15 minutes from Wipro SEZ and Ecoworld tech park — strong end-user and investor demand along this IT corridor.</p>",
    keyDetails: [
      { key: "Developer",     value: "Prestige Builders & Developers" },
      { key: "RERA ID",       value: "PRM/KA/RERA/1251/512"           },
      { key: "Possession",    value: "Dec 2028"                       },
      { key: "Built-up Area", value: "1,150 – 1,850 sq ft"            },
      { key: "Listed By",     value: "Developer"                      },
    ],
    goodToKnow: [
      { key: "Booking Amount", value: "10% of unit price"     },
      { key: "Payment Plan",   value: "Construction-linked"   },
      { key: "Loan Approved",  value: "SBI, HDFC, ICICI"      },
      { key: "Amenities",      value: "Pool, clubhouse, gym"  },
      { key: "Site Visit",     value: "By appointment"        },
    ],
    coordinates: { lat: 12.9010, lng: 77.7877 },
    seller: SELLERS.prestige,
  },
  {
    id: "prop-in-newp-02", href: "/listings/prop-in-newp-02", advId: "20802",
    images: [
      { src: img(1), alt: "Sample flat interior" },
    ],
    priceLabel: "₹1.4 Cr onwards",
    title: "Pre-Launch Luxury Apartments — Booking Open, Golf Course Extension Road",
    detailsLabel: "3-4 BHK • APARTMENT • PRE-LAUNCH",
    locationLabel: "Golf Course Extension Road, Gurugram",
    postedAt: daysAgo(2),
    description: "<p><strong>Pre-launch booking</strong> now open for a premium 3 & 4BHK development with a sample flat ready for viewing. Early-bird pricing available until the official launch event.</p><p>Located minutes from Golf Course Extension Road's retail and office corridor, with excellent connectivity to NH-48 and the upcoming metro extension.</p>",
    keyDetails: [
      { key: "Developer",     value: "Gurugram Realty Partners" },
      { key: "RERA ID",       value: "Applied — pending approval" },
      { key: "Possession",    value: "Jun 2029"                 },
      { key: "Built-up Area", value: "1,900 – 2,600 sq ft"      },
      { key: "Listed By",     value: "Developer"                },
    ],
    goodToKnow: [
      { key: "Booking Amount", value: "₹5 Lakh (pre-launch)" },
      { key: "Payment Plan",   value: "Flexi payment plan"   },
      { key: "Loan Approved",  value: "In process"           },
      { key: "Amenities",      value: "Sky lounge, spa, gym" },
      { key: "Site Visit",     value: "Sample flat ready"    },
    ],
    coordinates: { lat: 28.4041, lng: 77.0946 },
    seller: SELLERS.gurgaonRealty,
  },
];

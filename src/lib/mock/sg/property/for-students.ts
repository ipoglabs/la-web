import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const SG_PROPERTY_STUDENTS: MockListing[] = [
  {
    id: "prop-sg-stu-01", href: "/listings/prop-sg-stu-01", advId: "30301",
    images: [
      { src: img(3), alt: "Student room near NUS" },
    ],
    priceLabel: "S$900", priceSuffix: "/ mo",
    title: "Student Room Near NUS — Shuttle Bus Access, All Bills In",
    detailsLabel: "1 ROOM • SHARED BATH • MANAGED",
    locationLabel: "Kent Ridge (near NUS)",
    postedAt: hrsAgo(6),
    description: "<p>Managed <strong>student room</strong> a 5-minute walk from NUS Kent Ridge campus, with a free shuttle stop nearby. Fully furnished with study desk, all utilities and Wi-Fi included.</p><p>Common lounge and self-service laundry on-site — popular with exchange and postgraduate students.</p>",
    keyDetails: [
      { key: "Bills Included", value: "Yes — all"        },
      { key: "Tenancy Term",   value: "Semester or 12-month" },
      { key: "Deposit",        value: "S$900 (1 month)"  },
      { key: "Occupants",      value: "Single only"      },
      { key: "Student-Only",   value: "Yes"               },
    ],
    goodToKnow: [
      { key: "Available", value: "Aug 2026"      },
      { key: "Shuttle",   value: "Free NUS stop"  },
      { key: "Laundry",   value: "Self-service, on-site" },
      { key: "Security",  value: "Card access"    },
    ],
    coordinates: { lat: 1.2966, lng: 103.7764 },
    seller: SELLERS.campusLiving,
  },
  {
    id: "prop-sg-stu-02", href: "/listings/prop-sg-stu-02", advId: "30302",
    images: [
      { src: img(4), alt: "Student room near NTU" },
    ],
    priceLabel: "S$850", priceSuffix: "/ mo",
    title: "Student Room Near NTU — Furnished, Study Desk Included",
    detailsLabel: "1 ROOM • SHARED BATH • MANAGED",
    locationLabel: "Boon Lay (near NTU)",
    postedAt: daysAgo(2),
    description: "<p>Comfortable <strong>student room</strong> near NTU's Boon Lay side gate, furnished with a single bed, study desk, and wardrobe. All bills and high-speed Wi-Fi included.</p><p>Direct bus service to NTU campus and 10 minutes' walk to Boon Lay MRT and shopping centre.</p>",
    keyDetails: [
      { key: "Bills Included", value: "Yes — all"       },
      { key: "Tenancy Term",   value: "Semester or 12-month" },
      { key: "Deposit",        value: "S$850 (1 month)" },
      { key: "Occupants",      value: "Single only"     },
      { key: "Student-Only",   value: "Yes"              },
    ],
    goodToKnow: [
      { key: "Available", value: "Aug 2026"       },
      { key: "Bus",       value: "Direct to NTU"   },
      { key: "Laundry",   value: "Coin-operated"   },
      { key: "Security",  value: "Card access"     },
    ],
    coordinates: { lat: 1.3483, lng: 103.6831 },
    seller: SELLERS.campusLiving,
  },
];

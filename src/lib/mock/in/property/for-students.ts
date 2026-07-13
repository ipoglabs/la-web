import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const IN_PROPERTY_STUDENTS: MockListing[] = [
  {
    id: "prop-in-stu-01", href: "/listings/prop-in-stu-01", advId: "20301",
    images: [
      { src: img(5), alt: "Student PG room" },
    ],
    priceLabel: "₹10,000", priceSuffix: "/ mo",
    title: "Student PG Near Manipal University — 3 Meals Included",
    detailsLabel: "1 ROOM • SHARED (2) • PG",
    locationLabel: "Manipal, Karnataka",
    postedAt: hrsAgo(8),
    description: "<p>Twin-sharing <strong>student PG</strong> a 5-minute walk from Manipal Academy of Higher Education. All three meals, laundry, and Wi-Fi included; study desks in every room.</p><p>Warden on-site 24/7 with biometric entry — a preferred choice for first-year students and parents.</p>",
    keyDetails: [
      { key: "Bills Included", value: "Yes — all + food" },
      { key: "Tenancy Term",   value: "10-month academic year" },
      { key: "Deposit",        value: "₹10,000 (1 month)" },
      { key: "Occupants",      value: "2 students"       },
      { key: "Student-Only",   value: "Yes"              },
    ],
    goodToKnow: [
      { key: "Available",  value: "Jun 2026"       },
      { key: "Meals",      value: "3x daily"        },
      { key: "Warden",     value: "24/7 on-site"    },
      { key: "Study Desk", value: "In every room"   },
      { key: "Laundry",    value: "Included"        },
    ],
    coordinates: { lat: 13.3525, lng: 74.7935 },
    seller: SELLERS.pgHomes,
  },
  {
    id: "prop-in-stu-02", href: "/listings/prop-in-stu-02", advId: "20302",
    images: [
      { src: img(6), alt: "Hostel room" },
    ],
    priceLabel: "₹8,000", priceSuffix: "/ mo",
    title: "Boys Hostel Room Near IIT Delhi — Single Occupancy Available",
    detailsLabel: "1 ROOM • SINGLE/SHARED • HOSTEL",
    locationLabel: "Hauz Khas, New Delhi",
    postedAt: daysAgo(2),
    description: "<p><strong>Hostel accommodation</strong> a short auto ride from IIT Delhi's main gate, with single and twin-sharing options. Common mess, reading room, and high-speed Wi-Fi included.</p><p>Close to Hauz Khas Village and the Yellow Line metro — popular with IIT and JNU students.</p>",
    keyDetails: [
      { key: "Bills Included", value: "Yes — all"          },
      { key: "Tenancy Term",   value: "11-month academic"  },
      { key: "Deposit",        value: "₹8,000 (1 month)"   },
      { key: "Occupants",      value: "Single or shared"   },
      { key: "Student-Only",   value: "Yes"                },
    ],
    goodToKnow: [
      { key: "Available",  value: "Jul 2026"    },
      { key: "Mess",       value: "Veg + non-veg" },
      { key: "Security",   value: "Biometric entry" },
      { key: "Reading Room", value: "24/7 access" },
      { key: "Laundry",    value: "Extra ₹500/mo" },
    ],
    coordinates: { lat: 28.5459, lng: 77.1926 },
    seller: SELLERS.pgHomes,
  },
];

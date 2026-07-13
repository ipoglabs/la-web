import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const IN_PROPERTY_WANTED: MockListing[] = [
  {
    id: "prop-in-want-01", href: "/listings/prop-in-want-01", advId: "20701",
    images: [
      { src: img(6), alt: "Wanted — 2BHK" },
    ],
    priceLabel: "Up to ₹90 Lakh",
    title: "WANTED: 2BHK Flat in Whitefield — Ready-to-Move Preferred",
    detailsLabel: "2 BHK • APARTMENT",
    locationLabel: "Whitefield, Bengaluru (preferred)",
    postedAt: hrsAgo(10),
    description: "<p>IT professional couple looking for a <strong>ready-to-move 2BHK apartment</strong> in Whitefield or nearby Brookefield/ITPL. Budget firm at ₹90 Lakh — home loan pre-approved.</p><p>Prefer gated communities with good maintenance and clear RERA/OC documentation. Can move fast once the right unit is found.</p>",
    keyDetails: [
      { key: "Max Budget",  value: "₹90 Lakh"                  },
      { key: "Timeline",    value: "Within 6 weeks"            },
      { key: "Finance",     value: "Home loan pre-approved"    },
      { key: "Possession",  value: "Ready-to-move preferred"   },
      { key: "Documentation", value: "RERA / OC required"      },
    ],
    goodToKnow: [
      { key: "Buyer Status", value: "Loan pre-approved"    },
      { key: "Decision",     value: "Within a week"        },
      { key: "Preferred Areas", value: "Whitefield, Brookefield, ITPL" },
      { key: "Contact",      value: "Respond via LokalAds" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.rajesh,
  },
  {
    id: "prop-in-want-02", href: "/listings/prop-in-want-02", advId: "20702",
    images: [
      { src: img(7), alt: "Wanted — office space" },
    ],
    priceLabel: "Up to ₹1,00,000 / mo",
    title: "WANTED: Office Space in Bengaluru CBD — 2,000–3,000 sq ft",
    detailsLabel: "2,000–3,000 SQ FT • OFFICE",
    locationLabel: "MG Road / Indiranagar, Bengaluru",
    postedAt: daysAgo(3),
    description: "<p>Growing startup seeking <strong>fully fitted office space</strong> of 2,000–3,000 sq ft in the MG Road or Indiranagar micro-market. Budget up to ₹1,00,000/month, inclusive of maintenance.</p><p>Metro connectivity and nearby food/retail options for employees are a priority. Ready to sign a 3-year lease immediately.</p>",
    keyDetails: [
      { key: "Max Budget",  value: "₹1,00,000 / mo"          },
      { key: "Area Needed", value: "2,000–3,000 sq ft"       },
      { key: "Lease Term",  value: "3 years, ready to sign"  },
      { key: "Fit-Out",     value: "Furnished preferred"     },
    ],
    goodToKnow: [
      { key: "Occupancy",       value: "Within 1 month"       },
      { key: "Preferred Areas", value: "MG Road, Indiranagar" },
      { key: "Decision",        value: "Fast — pre-approved budget" },
      { key: "Contact",         value: "Respond via LokalAds" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.gurgaonRealty,
  },
];

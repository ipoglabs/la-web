import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const SG_PROPERTY_WANTED: MockListing[] = [
  {
    id: "prop-sg-want-01", href: "/listings/prop-sg-want-01", advId: "30701",
    images: [
      { src: img(4), alt: "Wanted — HDB flat" },
    ],
    priceLabel: "Up to S$550,000",
    title: "WANTED: 3-Room HDB Flat in Bishan — Move-In Ready",
    detailsLabel: "3 ROOM • HDB",
    locationLabel: "Bishan (preferred)",
    postedAt: hrsAgo(9),
    description: "<p>Young couple seeking a <strong>move-in ready 3-room HDB flat</strong> in Bishan or nearby Ang Mo Kio. Budget capped at S$550,000 — HDB loan pre-approved.</p><p>Prefer a mid-to-high floor with good remaining lease. Can proceed to OTP quickly once a suitable flat is found.</p>",
    keyDetails: [
      { key: "Max Budget",   value: "S$550,000"              },
      { key: "Timeline",     value: "Within 2 months"        },
      { key: "Finance",      value: "HDB loan pre-approved"  },
      { key: "Preferred Areas", value: "Bishan, Ang Mo Kio"  },
    ],
    goodToKnow: [
      { key: "Buyer Status", value: "First-timer, loan approved" },
      { key: "Decision",     value: "Within a week"         },
      { key: "Contact",      value: "Respond via LokalAds"  },
    ],
    coordinates: { lat: 1.3526, lng: 103.8352 },
    seller: SELLERS.rajan,
  },
  {
    id: "prop-sg-want-02", href: "/listings/prop-sg-want-02", advId: "30702",
    images: [
      { src: img(5), alt: "Wanted — office space" },
    ],
    priceLabel: "Up to S$9,000 / mo",
    title: "WANTED: Office Space in Raffles Place — 1,500–2,000 sq ft",
    detailsLabel: "1,500–2,000 SQ FT • OFFICE",
    locationLabel: "Raffles Place / CBD",
    postedAt: daysAgo(3),
    description: "<p>Fintech startup looking for <strong>fitted office space</strong> of 1,500–2,000 sq ft in the Raffles Place or Tanjong Pagar CBD area. Budget up to S$9,000/month.</p><p>MRT connectivity and a modern fit-out are priorities. Ready to commit to a 2-year lease immediately.</p>",
    keyDetails: [
      { key: "Max Budget",  value: "S$9,000 / mo"          },
      { key: "Area Needed", value: "1,500–2,000 sq ft"     },
      { key: "Lease Term",  value: "2 years, ready to sign" },
    ],
    goodToKnow: [
      { key: "Occupancy",       value: "Within 1 month"        },
      { key: "Preferred Areas", value: "Raffles Place, Tanjong Pagar" },
      { key: "Contact",         value: "Respond via LokalAds"  },
    ],
    coordinates: { lat: 1.2789, lng: 103.8452 },
    seller: SELLERS.era,
  },
];

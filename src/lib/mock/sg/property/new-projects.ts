import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const SG_PROPERTY_NEW_PROJECTS: MockListing[] = [
  {
    id: "prop-sg-newp-01", href: "/listings/prop-sg-newp-01", advId: "30801",
    images: [
      { src: img(3), alt: "Condo development render" },
      { src: img(6), alt: "Sky garden render"         },
    ],
    priceLabel: "S$1,450,000 onwards",
    title: "New Launch Condo — 2 & 3-Bedders, Preview Booking Open",
    detailsLabel: "2-3 BEDS • CONDO • UNDER CONSTRUCTION",
    locationLabel: "Bukit Timah",
    postedAt: hrsAgo(6),
    description: "<p><strong>Preview booking now open</strong> for a boutique freehold condo with 2 & 3-bedroom layouts, sky garden, and lap pool. Show flat and sales gallery open daily.</p><p>Within 1km of top primary schools; a short drive to Beauty World MRT and the Bukit Timah Nature Reserve.</p>",
    keyDetails: [
      { key: "Developer",    value: "Huat Property Holdings" },
      { key: "TOP",          value: "Q4 2028"                },
      { key: "Tenure",       value: "Freehold"               },
      { key: "PSF",          value: "~S$2,150 psf (indicative)" },
      { key: "Listed By",    value: "Developer"              },
    ],
    goodToKnow: [
      { key: "Option Fee",     value: "S$5,000 (booking)"   },
      { key: "ABSD",           value: "Applies per buyer profile" },
      { key: "Payment Scheme", value: "Progressive payment" },
      { key: "Sales Gallery",  value: "Open daily 10am–6pm" },
      { key: "Vacant Possession", value: "Upon TOP"         },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.huatProperty,
  },
  {
    id: "prop-sg-newp-02", href: "/listings/prop-sg-newp-02", advId: "30802",
    images: [
      { src: img(9), alt: "Mixed-use tower render" },
    ],
    priceLabel: "S$980,000 onwards",
    title: "Upcoming BTO-Alternative Condo — E-Application Open, Punggol Digital District",
    detailsLabel: "1-2 BEDS • CONDO • PRE-LAUNCH",
    locationLabel: "Punggol",
    postedAt: daysAgo(2),
    description: "<p><strong>Pre-launch e-application</strong> open ahead of the official sales weekend, for a mixed-use development next to Punggol Digital District and the future MRT interchange.</p><p>Waterway views, integrated retail podium, and direct connectivity to Punggol MRT/LRT.</p>",
    keyDetails: [
      { key: "Developer",   value: "ERA Realty Network"      },
      { key: "TOP",         value: "2029 (estimated)"        },
      { key: "Tenure",      value: "99-year Leasehold"       },
      { key: "PSF",         value: "~S$1,780 psf (indicative)" },
      { key: "Listed By",   value: "Developer"               },
    ],
    goodToKnow: [
      { key: "E-Application",  value: "Open now"            },
      { key: "Option Fee",     value: "S$1,000 (EOI)"       },
      { key: "Balloting",      value: "If oversubscribed"   },
      { key: "Sales Gallery",  value: "Opening next month"  },
      { key: "Vacant Possession", value: "Upon TOP"         },
    ],
    coordinates: { lat: 1.4043, lng: 103.9021 },
    seller: SELLERS.era,
  },
];

import type { MockListing } from "../../mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";
// ─────────────────────────────────────────────────────────────────────────────
export const PROPERTY_NEW_PROJECTS: MockListing[] = [
  {
    id: "prop-newp-01", href: "/listings/prop-newp-01", advId: "10801",
    images: [
      { src: img(8), alt: "New development render" },
      { src: img(9), alt: "Show apartment"          },
    ],
    priceLabel: "£395,000 onwards",
    title: "New Build Development — 1 & 2-Bed Apartments, Help to Buy Available",
    detailsLabel: "1-2 BEDS • APARTMENT • OFF-PLAN",
    locationLabel: "Bow, London",
    postedAt: hrsAgo(8),
    description: "<p>Brand new development of <strong>1 & 2-bedroom apartments</strong> with a 10-year NHBC warranty, integrated appliances, and a private residents' gym. Show apartment now open for viewing.</p><p>Bow Road and Mile End tube stations within 10 minutes' walk; Canary Wharf and Westfield Stratford both easily reachable.</p>",
    keyDetails: [
      { key: "Developer",   value: "Prime Developments Ltd" },
      { key: "Completion",  value: "Q3 2027"                },
      { key: "Tenure",      value: "Leasehold (999yr)"      },
      { key: "Warranty",    value: "10yr NHBC"              },
      { key: "Listed By",   value: "Developer"              },
    ],
    goodToKnow: [
      { key: "Reservation Fee", value: "£1,000"                 },
      { key: "Help to Buy",     value: "Available on select units" },
      { key: "Service Charge",  value: "£1,800 / yr (est.)"     },
      { key: "Show Apartment",  value: "Open Thu–Sun"           },
      { key: "Chain",           value: "New build — no chain"   },
    ],
    coordinates: { lat: 51.5277, lng: -0.0124 },
    seller: SELLERS.prime,
  },
  {
    id: "prop-newp-02", href: "/listings/prop-newp-02", advId: "10802",
    images: [
      { src: img(2), alt: "Riverside development" },
    ],
    priceLabel: "£620,000 onwards",
    title: "Off-Plan Riverside Apartments — Reserve Now, Completing 2028",
    detailsLabel: "2-3 BEDS • APARTMENT • OFF-PLAN",
    locationLabel: "Nine Elms, London",
    postedAt: daysAgo(3),
    description: "<p><strong>Off-plan riverside apartments</strong> with private balconies and concierge service, reservable now ahead of groundbreaking. Early reservations receive preferential pricing and floor selection.</p><p>Nine Elms is central to two new Northern line stations and Battersea Power Station's retail and dining district.</p>",
    keyDetails: [
      { key: "Developer",   value: "Meridian Commercial"  },
      { key: "Completion",  value: "Spring 2028"          },
      { key: "Tenure",      value: "Leasehold 999yr"      },
      { key: "Deposit",     value: "20% on exchange"      },
      { key: "Listed By",   value: "Developer"            },
    ],
    goodToKnow: [
      { key: "Reservation Fee", value: "£2,500 (refundable)" },
      { key: "Payment Plan",    value: "Staged on completion" },
      { key: "Concierge",       value: "24/7, included"       },
      { key: "Show Suite",      value: "By appointment"       },
      { key: "Chain",           value: "New build — no chain" },
    ],
    coordinates: { lat: 51.4841, lng: -0.1388 },
    seller: SELLERS.comm,
  },
];

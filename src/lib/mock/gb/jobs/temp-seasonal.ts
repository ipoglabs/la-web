import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── temp_seasonal ─────────────────────────────────────────────────────────────
export const JOBS_TEMP_SEASONAL: MockListing[] = [
  {
    id: "job-temp-01", href: "/listings/job-temp-01", advId: "30041",
    images: [{ src: img(8), alt: "Retail Christmas" }],
    priceLabel: "£12.21",
    priceSuffix: "/hr",
    title: "Christmas Retail Assistant — Seasonal Nov–Jan, Immediate Start",
    detailsLabel: "TEMPORARY • ON-SITE • RETAIL",
    locationLabel: "Westfield Stratford, London",
    postedAt: hrsAgo(2),
    description: "<p>Major high-street retailer recruiting <strong>Seasonal Retail Assistants</strong> for the Christmas period (November–January). Duties include stock replenishment, customer service, and till operation. All shifts available.</p>",
    keyDetails: [
      { key: "Contract",    value: "Temporary, seasonal"    },
      { key: "Duration",    value: "Nov 2026 – Jan 2027"    },
      { key: "Hours",       value: "8–40 hrs/week flexible" },
      { key: "Pay",         value: "£12.21/hr (NMW)"        },
      { key: "Start Date",  value: "3 Nov 2026"             },
    ],
    goodToKnow: [
      { key: "Experience",  value: "Retail/customer svc pref." },
      { key: "Shifts",      value: "Days, evenings, weekends"  },
      { key: "Benefits",    value: "20% staff discount"        },
      { key: "Visa",        value: "Right to work required"    },
      { key: "Apply Via",  value: "Message or walk in"        },
    ],
    coordinates: { lat: 51.5428, lng: -0.0019 },
    seller: SELLERS.retailCo,
  },
  {
    id: "job-temp-02", href: "/listings/job-temp-02", advId: "30042",
    images: [{ src: img(9), alt: "Festival crew" }],
    priceLabel: "£14.00",
    priceSuffix: "/hr",
    title: "Summer Festival Bar Staff — June–August, Free Ticket Included",
    detailsLabel: "TEMPORARY • ON-SITE • EVENTS",
    locationLabel: "Hyde Park, London",
    postedAt: daysAgo(1),
    description: "<p>Exciting opportunity for experienced <strong>Bar Staff</strong> at a major summer music festival in Hyde Park. 3-day events throughout June–August. Free event ticket included with each shift worked.</p>",
    keyDetails: [
      { key: "Contract",    value: "Zero-hours, event-based" },
      { key: "Duration",    value: "June–August 2026"        },
      { key: "Hours",       value: "12-hr festival shifts"   },
      { key: "Pay",         value: "£14.00/hr"               },
      { key: "Start Date",  value: "June 2026"               },
    ],
    goodToKnow: [
      { key: "Experience",  value: "Bar/events experience pref." },
      { key: "Personal Lic.", value: "Not required"             },
      { key: "Perks",       value: "Free ticket + meals"         },
      { key: "Visa",        value: "Right to work required"      },
      { key: "Apply Via",  value: "Message ASAP \u2014 limited positions" },
    ],
    coordinates: { lat: 51.5073, lng: -0.1657 },
    seller: SELLERS.retailCo,
  },
  {
    id: "job-temp-03", href: "/listings/job-temp-03", advId: "30043",
    images: [{ src: img(1), alt: "Warehouse logistics" }],
    priceLabel: "\u00a312.21\u2013\u00a313.50",
    priceSuffix: "/ hr",
    title: "Warehouse Operative \u2014 Peak Season, All Shifts, Immediate Start",
    detailsLabel: "TEMPORARY \u2022 ON-SITE \u2022 LOGISTICS",
    locationLabel: "Park Royal, London",
    postedAt: hrsAgo(6),
    description: "<p>Major e-commerce fulfilment centre urgently recruiting <strong>Warehouse Operatives</strong> for the Black Friday and Christmas peak. Roles available in picking, packing, and dispatch. Immediate start for all shift patterns.</p><p>Weekly PAYE pay, on-site canteen and free parking. Strong performers will be considered for permanent positions after the seasonal period.</p>",
    keyDetails: [
      { key: "Contract",   value: "Temporary, 8\u201316 weeks"   },
      { key: "Duration",   value: "Oct 2026 \u2013 Jan 2027"    },
      { key: "Hours",      value: "40 hrs/week, rotating"     },
      { key: "Rate",       value: "\u00a312.21 days / \u00a313.50 nights" },
      { key: "Start Date", value: "Immediate"                 },
    ],
    goodToKnow: [
      { key: "Experience", value: "Preferred but not essential"    },
      { key: "Shifts",     value: "Days, nights, weekends all avail" },
      { key: "Pay Cycle",  value: "Weekly PAYE"                    },
      { key: "Visa",       value: "Right to work required"         },
      { key: "Apply Via",  value: "Walk in or message us"          },
    ],
    coordinates: { lat: 51.5313, lng: -0.2813 },
    seller: SELLERS.recruitPro,
  },
];


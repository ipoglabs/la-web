import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── health_wellness ────────────────────────────────────────────────────────────
export const SPECIAL_OFFERS_HEALTH: MockListing[] = [
  {
    id: "offer-health-01", href: "/listings/offer-health-01", advId: "90051",
    images: [{ src: img(7), alt: "Gym membership" }],
    priceLabel: "£19.99",
    priceSuffix: "/ mo (was £35)",
    title: "Gym Membership — 43% Off, No Joining Fee, Join This Week",
    detailsLabel: "HEALTH & WELLNESS • 43% OFF • GYM",
    locationLabel: "Multiple London Locations",
    postedAt: hrsAgo(1),
    description: "<p>Join any of our <strong>14 London gym locations</strong> for just £19.99/month (was £35) — no joining fee this week only. Access to all clubs, free weights, cardio, pool (selected sites), and unlimited classes.</p>",
    keyDetails: [
      { key: "Offer",    value: "£19.99/mo (was £35)"    },
      { key: "Saving",   value: "43% off"                },
      { key: "Locations", value: "14 London clubs"       },
      { key: "Joining Fee", value: "Waived this week"    },
    ],
    goodToKnow: [
      { key: "Contract",  value: "Monthly rolling"       },
      { key: "Classes",   value: "Unlimited included"    },
      { key: "Pool",      value: "Selected sites"        },
      { key: "Offer Ends", value: "Sunday 28 June 2026"  },
    ],
    coordinates: { lat: 51.4945, lng: -0.1006 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-health-02", href: "/listings/offer-health-02", advId: "90052",
    images: [{ src: img(8), alt: "Spa day deal" }],
    priceLabel: "£45",
    priceSuffix: "(was £110)",
    title: "Luxury Spa Day — Pool, Steam, Sauna + 30-Min Treatment, 59% Off",
    detailsLabel: "HEALTH & WELLNESS • 59% OFF • SPA DAY",
    locationLabel: "Mayfair, London",
    postedAt: hrsAgo(4),
    description: "<p>Full-day <strong>luxury spa experience</strong> in Mayfair for just £45 (was £110) — includes pool, steam room, sauna, and a 30-minute Swedish or back massage. Weekdays only. Robe and towel included.</p>",
    keyDetails: [
      { key: "Price",     value: "£45 (was £110)"          },
      { key: "Includes",  value: "Pool, steam, sauna + massage" },
      { key: "Days",      value: "Weekdays only"            },
      { key: "Treatment", value: "30-min Swedish or back"   },
    ],
    goodToKnow: [
      { key: "Robe",      value: "Robe + towel included"   },
      { key: "Booking",   value: "Advance booking required" },
      { key: "Arrival",   value: "Arrive 15 mins early"    },
      { key: "Expires",   value: "Book by 31 Aug 2026"     },
    ],
    coordinates: { lat: 51.5094, lng: -0.1476 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-health-03", href: "/listings/offer-health-03", advId: "90053",
    images: [{ src: img(9), alt: "Online GP consultation" }],
    priceLabel: "FREE",
    priceSuffix: "first consultation",
    title: "Online GP — First Consultation Free, Prescriptions to Any UK Pharmacy",
    detailsLabel: "HEALTH & WELLNESS • FREE FIRST CONSULT • ONLINE GP",
    locationLabel: "Online (UK-wide)",
    postedAt: daysAgo(2),
    description: "<p>See a <strong>UK-registered GP online</strong> within 2 hours — your first consultation is completely free. Video or phone appointment. Electronic prescriptions sent to any UK pharmacy. Available 7 days, 8am–10pm.</p>",
    keyDetails: [
      { key: "First Appt", value: "FREE"                  },
      { key: "Wait Time",  value: "Within 2 hours"        },
      { key: "Format",     value: "Video or phone"        },
      { key: "Hours",      value: "8am–10pm, 7 days"      },
    ],
    goodToKnow: [
      { key: "Prescriptions", value: "Any UK pharmacy"   },
      { key: "GPs",       value: "UK-registered doctors" },
      { key: "After Free", value: "From £25/consultation" },
      { key: "Records",    value: "Secure, GDPR-compliant" },
    ],
    coordinates: { lat: 51.4945, lng: -0.1006 },
    seller: SELLERS.dealsPro,
  },
];


import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── other_services ────────────────────────────────────────────────────────────
export const SERVICES_OTHER: MockListing[] = [
  {
    id: "svc-other-01", href: "/listings/svc-other-01", advId: "40081",
    images: [{ src: img(4), alt: "Cleaning service" }],
    priceLabel: "From £18",
    priceSuffix: "/ hr",
    title: "Professional Home Cleaning — Weekly, Fortnightly, or One-Off",
    detailsLabel: "HOME SERVICES • INSURED • LONDON",
    locationLabel: "Greater London",
    postedAt: hrsAgo(2),
    description: "<p>Reliable, fully-insured <strong>domestic cleaning service</strong> covering Greater London. Regular weekly or fortnightly cleans, one-off deep cleans, and end-of-tenancy cleaning. All equipment and eco products supplied.</p>",
    keyDetails: [
      { key: "Service Type",  value: "Domestic Cleaning"    },
      { key: "Coverage",      value: "Greater London"       },
      { key: "Availability",  value: "Mon–Sat 8am–6pm"      },
      { key: "Min. Hours",    value: "3 hours per visit"    },
    ],
    goodToKnow: [
      { key: "Insurance",  value: "£1M public liability"   },
      { key: "DBS",        value: "All cleaners DBS checked" },
      { key: "Supplies",   value: "Eco products supplied"  },
      { key: "Rates",      value: "Discount for regulars"  },
    ],
    coordinates: { lat: 51.4934, lng: -0.2671 },
    seller: SELLERS.handyFix,
  },
  {
    id: "svc-other-02", href: "/listings/svc-other-02", advId: "40082",
    images: [{ src: img(5), alt: "Ironing service" }],
    priceLabel: "£1.50",
    priceSuffix: "/ item",
    title: "Collection & Delivery Ironing Service — Same-Week, West London",
    detailsLabel: "HOME SERVICES • IRONING & LAUNDRY • WEST LONDON",
    locationLabel: "West & South-West London",
    postedAt: daysAgo(1),
    description: "<p>Professional <strong>ironing and laundry service</strong> with free collection and delivery across West and South-West London. Shirts, suits, bedding, and household linen — all finished to a professional standard.</p>",
    keyDetails: [
      { key: "Service Type",  value: "Ironing & Laundry"     },
      { key: "Coverage",      value: "West & SW London"      },
      { key: "Availability",  value: "Mon–Fri 8am–7pm"       },
      { key: "Turnaround",    value: "48-hour standard"      },
    ],
    goodToKnow: [
      { key: "Collection",  value: "Free C&D both ways"     },
      { key: "Min. Order",  value: "10 items"               },
      { key: "Insurance",   value: "Covered for damage"     },
      { key: "Regulars",    value: "15% weekly discount"    },
    ],
    coordinates: { lat: 51.4927, lng: -0.2231 },
    seller: SELLERS.handyFix,
  },
  {
    id: "svc-other-03", href: "/listings/svc-other-03", advId: "40083",
    images: [{ src: img(6), alt: "Mobile dog grooming van" }],
    priceLabel: "From £45",
    priceSuffix: "/ session",
    title: "Mobile Dog Grooming Van — No-Stress Salon at Your Door, East London",
    detailsLabel: "OTHER SERVICES • PET GROOMING • EAST LONDON",
    locationLabel: "East & North-East London",
    postedAt: daysAgo(4),
    description: "<p>Fully equipped <strong>mobile dog grooming van</strong> that comes directly to your home. Bathing, clipping, nail trim, and ear cleaning for all breeds. No stressful waiting rooms — City & Guilds qualified groomer.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Mobile Dog Grooming"   },
      { key: "Coverage",       value: "East & NE London"      },
      { key: "Availability",   value: "Tue–Sat 9am–5pm"       },
      { key: "Qualifications", value: "City & Guilds grooming" },
    ],
    goodToKnow: [
      { key: "Booking",    value: "48h advance notice"      },
      { key: "First",      value: "10% off intro discount"  },
      { key: "Insurance",  value: "Pet care insured"        },
      { key: "Breeds",     value: "All breeds welcome"      },
    ],
    coordinates: { lat: 51.5453, lng: -0.0553 },
    seller: SELLERS.handyFix,
  },
];


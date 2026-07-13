import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── health_fitness ────────────────────────────────────────────────────────────
export const SERVICES_HEALTH_FITNESS: MockListing[] = [
  {
    id: "svc-hf-01", href: "/listings/svc-hf-01", advId: "40021",
    images: [{ src: img(5), alt: "Personal trainer" }],
    priceLabel: "£50",
    priceSuffix: "/ session",
    title: "Personal Trainer — 1-to-1 & Online Coaching, All Levels",
    detailsLabel: "HEALTH & FITNESS • REPS CERTIFIED • LONDON",
    locationLabel: "West London",
    postedAt: hrsAgo(3),
    description: "<p>Level 3 REPs-certified <strong>Personal Trainer</strong> offering 1-to-1 sessions in West London (home visits or local parks) and online coaching UK-wide. Specialising in weight loss, strength, and sports conditioning.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Personal Training"      },
      { key: "Coverage",       value: "West London / Online"   },
      { key: "Availability",   value: "7 days, flexible hours" },
      { key: "Qualifications", value: "REPs Level 3, First Aid" },
    ],
    goodToKnow: [
      { key: "Trial",      value: "Free 30-min consultation"  },
      { key: "Bundle",     value: "10 sessions for £450"      },
      { key: "Online",     value: "Zoom / MyFitnessPal plans" },
      { key: "Insurance",  value: "£1M public liability"      },
    ],
    coordinates: { lat: 51.5113, lng: -0.1971 },
    seller: SELLERS.wellnessHub,
  },
  {
    id: "svc-hf-02", href: "/listings/svc-hf-02", advId: "40022",
    images: [{ src: img(6), alt: "Yoga class in studio" }],
    priceLabel: "£15",
    priceSuffix: "/ session",
    title: "Morning Yoga & Pilates Studio — All Levels, 7 Days a Week",
    detailsLabel: "HEALTH & FITNESS • YOGA ALLIANCE • WEST LONDON",
    locationLabel: "Hammersmith, London",
    postedAt: hrsAgo(8),
    description: "<p><strong>Yoga Alliance registered</strong> studio offering morning yoga and pilates classes seven days a week in Hammersmith. All levels welcome, from complete beginners to experienced practitioners. Block booking discounts available.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Yoga & Pilates"        },
      { key: "Coverage",       value: "Hammersmith studio"    },
      { key: "Availability",   value: "7 days, 6am–noon"      },
      { key: "Qualifications", value: "Yoga Alliance RYT-500" },
    ],
    goodToKnow: [
      { key: "Block",    value: "10 classes for £120"      },
      { key: "First",    value: "First class free"          },
      { key: "Booking",  value: "Book via app or online"   },
      { key: "Mats",     value: "Provided in studio"       },
    ],
    coordinates: { lat: 51.4927, lng: -0.2231 },
    seller: SELLERS.wellnessHub,
  },
  {
    id: "svc-hf-03", href: "/listings/svc-hf-03", advId: "40023",
    images: [{ src: img(7), alt: "Nutrition coaching online" }],
    priceLabel: "£85",
    priceSuffix: "/ mo",
    title: "Online Nutrition Coaching & Meal Planning — Weight Loss & Sports",
    detailsLabel: "HEALTH & FITNESS • REGISTERED NUTRITIONIST • ONLINE",
    locationLabel: "Online (UK)",
    postedAt: daysAgo(3),
    description: "<p>Registered <strong>nutritionist and performance coach</strong> providing personalised meal plans and weekly check-ins. Specialising in weight management, sports performance, and chronic fatigue recovery.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Nutrition Coaching"   },
      { key: "Coverage",       value: "Online (UK-wide)"     },
      { key: "Availability",   value: "Async + weekly calls" },
      { key: "Qualifications", value: "BSc Nutrition, ANutr" },
    ],
    goodToKnow: [
      { key: "Includes",  value: "Weekly meal plans"       },
      { key: "Check-in",  value: "Weekly video call"        },
      { key: "Trial",     value: "Free 20-min consult"     },
      { key: "Contract",  value: "Monthly rolling"         },
    ],
    coordinates: { lat: 51.5054, lng: -0.0235 },
    seller: SELLERS.gymPro,
  },
];


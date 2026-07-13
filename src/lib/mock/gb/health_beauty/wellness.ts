import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── wellness ────────────────────────────────────────────────────────────────────
export const HEALTH_WELLNESS: MockListing[] = [
  {
    id: "hb-well-01", href: "/listings/hb-well-01", advId: "12041",
    images: [{ src: img(7), alt: "Meditation class" }],
    priceLabel: "£15",
    priceSuffix: "/ session",
    title: "Mindfulness & Meditation Classes — Beginner Friendly, Soho",
    detailsLabel: "WELLNESS • MINDFULNESS • SOHO",
    locationLabel: "Soho, London",
    postedAt: hrsAgo(5),
    description: "<p>Weekly <strong>mindfulness and meditation classes</strong> for all levels. Tuesday evenings 7–8pm and Saturday mornings 9–10am. Small groups (max 12), guided sessions, breathing exercises, and body scan techniques. No experience needed.</p>",
    keyDetails: [
      { key: "Session",    value: "Mindfulness meditation"   },
      { key: "Schedule",   value: "Tue 7pm + Sat 9am"        },
      { key: "Duration",   value: "60 minutes"               },
      { key: "Group Size", value: "Max 12"                   },
    ],
    goodToKnow: [
      { key: "Experience",  value: "No experience needed"    },
      { key: "Booking",     value: "Book at least day before" },
      { key: "Mat",         value: "Provided"                },
      { key: "First Class", value: "50% off introduction"    },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.wellnessHub,
  },
  {
    id: "hb-well-02", href: "/listings/hb-well-02", advId: "12042",
    images: [{ src: img(8), alt: "Nutrition consultant" }],
    priceLabel: "£80",
    priceSuffix: "/ consultation",
    title: "Registered Nutritionist — 1:1 Plans, Weight Loss & Sports Perf.",
    detailsLabel: "WELLNESS • NUTRITION • LONDON / ONLINE",
    locationLabel: "London / Online",
    postedAt: daysAgo(1),
    description: "<p>ANutr-registered <strong>nutritionist</strong> offering personalised nutrition plans for weight management, gut health, and sports performance. 1-hour initial consultation, full dietary analysis, and follow-up support.</p>",
    keyDetails: [
      { key: "Service",       value: "Nutrition Consultation" },
      { key: "Specialities",  value: "Weight loss, sports, gut" },
      { key: "Format",        value: "In-person or Zoom"      },
      { key: "Qualifications", value: "ANutr, BSc Nutrition"  },
    ],
    goodToKnow: [
      { key: "Includes",   value: "Meal plan + recipe pack"   },
      { key: "Follow-up",  value: "1 free 30-min follow-up"   },
      { key: "Insurance",  value: "PI insured"                },
      { key: "Book",       value: "Message via LokalAds"      },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.wellnessHub,
  },
  {
    id: "hb-well-03", href: "/listings/hb-well-03", advId: "12043",
    images: [{ src: img(9), alt: "Acupuncture" }],
    priceLabel: "£70",
    priceSuffix: "/ session",
    title: "Traditional Acupuncture — BAcC Member, Pain, Sleep & Stress, Greenwich",
    detailsLabel: "WELLNESS • ACUPUNCTURE • GREENWICH",
    locationLabel: "Greenwich, London",
    postedAt: daysAgo(2),
    description: "<p>British Acupuncture Council (BAcC) member offering <strong>traditional acupuncture</strong> in Greenwich. Specialising in chronic pain, insomnia, stress, and hormonal balance. Initial 90-min consultation includes treatment; follow-ups 60 mins.</p>",
    keyDetails: [
      { key: "Specialisms",   value: "Pain, sleep, stress, hormones" },
      { key: "Initial",       value: "90-min consultation + Tx"      },
      { key: "Follow-up",     value: "60-min sessions"               },
      { key: "Registration",  value: "BAcC member"                   },
    ],
    goodToKnow: [
      { key: "Insurance",  value: "AXA & BUPA recognised"    },
      { key: "Needles",    value: "Single-use sterile only"  },
      { key: "Location",   value: "Greenwich, SE10"          },
      { key: "Booking",    value: "Message via LokalAds"     },
    ],
    coordinates: { lat: 51.4826, lng: -0.0077 },
    seller: SELLERS.wellnessHub,
  },
];


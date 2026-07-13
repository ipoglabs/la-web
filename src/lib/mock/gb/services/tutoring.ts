import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── tutoring ──────────────────────────────────────────────────────────────────
export const SERVICES_TUTORING: MockListing[] = [
  {
    id: "svc-tutor-01", href: "/listings/svc-tutor-01", advId: "40031",
    images: [{ src: img(6), alt: "Tutor with student" }],
    priceLabel: "£35",
    priceSuffix: "/ hr",
    title: "GCSE & A-Level Maths Tutor — 10 Yrs Exp, Outstanding Results",
    detailsLabel: "TUTORING • MATHS • LONDON / ONLINE",
    locationLabel: "North London / Online",
    postedAt: hrsAgo(5),
    description: "<p>Experienced <strong>Maths tutor</strong> with 10 years and hundreds of successful GCSE and A-Level students. 95% of students improve by at least one grade within 8 weeks. Sessions in North London or via Zoom.</p>",
    keyDetails: [
      { key: "Service Type",   value: "GCSE & A-Level Maths" },
      { key: "Coverage",       value: "North London / Online" },
      { key: "Availability",   value: "Evenings & weekends"   },
      { key: "Qualifications", value: "BSc Maths, PGCE"       },
    ],
    goodToKnow: [
      { key: "Success Rate",  value: "95% improve ≥1 grade"  },
      { key: "Materials",     value: "Provided free"         },
      { key: "First Lesson",  value: "Free taster session"   },
      { key: "DBS",           value: "Enhanced DBS checked"  },
    ],
    coordinates: { lat: 51.5650, lng: -0.1022 },
    seller: SELLERS.tutorAce,
  },
  {
    id: "svc-tutor-02", href: "/listings/svc-tutor-02", advId: "40032",
    images: [{ src: img(7), alt: "Language class" }],
    priceLabel: "£30",
    priceSuffix: "/ hr",
    title: "French & Spanish Language Tutor — All Levels, Exam Prep",
    detailsLabel: "TUTORING • LANGUAGES • ONLINE",
    locationLabel: "Online (UK)",
    postedAt: daysAgo(1),
    description: "<p>Native-level bilingual tutor offering <strong>French and Spanish lessons</strong> for all levels — beginner through A-Level and IELTS. Conversation practice, grammar, and specific exam preparation. Very flexible scheduling.</p>",
    keyDetails: [
      { key: "Service Type",   value: "French & Spanish"    },
      { key: "Coverage",       value: "Online (UK-wide)"    },
      { key: "Availability",   value: "7 days, flexible"    },
      { key: "Qualifications", value: "MA Languages, CELTA" },
    ],
    goodToKnow: [
      { key: "Levels",     value: "Beginner to A-Level"     },
      { key: "Trial",      value: "50% off first lesson"    },
      { key: "Materials",  value: "Custom lesson plans"     },
      { key: "Platform",   value: "Zoom / Google Meet"      },
    ],
    coordinates: { lat: 51.5289, lng: -0.1039 },
    seller: SELLERS.tutorAce,
  },
  {
    id: "svc-tutor-03", href: "/listings/svc-tutor-03", advId: "40033",
    images: [{ src: img(8), alt: "11-plus exam tutor" }],
    priceLabel: "£45",
    priceSuffix: "/ hr",
    title: "11+ & Common Entrance Exam Prep — Grammar & Independent Schools",
    detailsLabel: "TUTORING • 11-PLUS • SW LONDON / ONLINE",
    locationLabel: "South-West London / Online",
    postedAt: daysAgo(2),
    description: "<p>Former grammar school admissions advisor offering <strong>intensive 11+ and Common Entrance preparation</strong>. Verbal reasoning, non-verbal reasoning, Maths, and English — tailored practice papers and mock exams included.</p>",
    keyDetails: [
      { key: "Service Type",   value: "11+ / CE Prep"         },
      { key: "Coverage",       value: "SW London / Online"    },
      { key: "Availability",   value: "Weekends & school hols" },
      { key: "Qualifications", value: "Former admissions advisor" },
    ],
    goodToKnow: [
      { key: "Mock Exams",  value: "Included in programme"  },
      { key: "Materials",   value: "All papers supplied"    },
      { key: "Trial",       value: "Diagnostic session £25" },
      { key: "DBS",         value: "Enhanced DBS checked"   },
    ],
    coordinates: { lat: 51.4441, lng: -0.1744 },
    seller: SELLERS.tutorAce,
  },
];


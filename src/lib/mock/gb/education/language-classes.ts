import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── language_classes ────────────────────────────────────────────────────────────
export const EDUCATION_LANGUAGES: MockListing[] = [
  {
    id: "edu-lang-01", href: "/listings/edu-lang-01", advId: "11041",
    images: [{ src: img(6), alt: "Language class" }],
    priceLabel: "£120",
    priceSuffix: "/ 6-week course",
    title: "Conversational Mandarin Classes — Beginner to Intermediate, London",
    detailsLabel: "LANGUAGE CLASS • MANDARIN • LONDON",
    locationLabel: "Soho, London",
    postedAt: hrsAgo(4),
    description: "<p>Small-group <strong>Mandarin Chinese evening classes</strong> for beginners and intermediate learners. Max 8 students per class. Focus on spoken Mandarin, tones, and everyday conversation. Native-speaker teacher, cultural context included.</p>",
    keyDetails: [
      { key: "Language",    value: "Mandarin Chinese"       },
      { key: "Level",       value: "Beginner & Intermediate" },
      { key: "Format",      value: "Evening (6 weeks)"       },
      { key: "Class Size",  value: "Max 8 students"         },
    ],
    goodToKnow: [
      { key: "Teacher",    value: "Native speaker"          },
      { key: "Materials",  value: "Included in fee"         },
      { key: "Trial",      value: "First class free"        },
      { key: "Next Cohort", value: "September 2026"         },
    ],
    coordinates: { lat: 51.5134, lng: -0.1310 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-lang-02", href: "/listings/edu-lang-02", advId: "11042",
    images: [{ src: img(7), alt: "IELTS prep" }],
    priceLabel: "£199",
    priceSuffix: "/ 8-week course",
    title: "IELTS Preparation Course — Band 7+ Target, Online, Flexible",
    detailsLabel: "LANGUAGE CLASS • IELTS • ONLINE",
    locationLabel: "Online (UK)",
    postedAt: daysAgo(1),
    description: "<p>Structured <strong>IELTS preparation programme</strong> targeting Band 7+. 8-week online course covering all four skills (Reading, Writing, Listening, Speaking) with practice tests, essay marking, and speaking feedback.</p>",
    keyDetails: [
      { key: "Exam",       value: "IELTS Academic & GT"    },
      { key: "Target",     value: "Band 7+"                },
      { key: "Format",     value: "Online, self-paced + live" },
      { key: "Duration",   value: "8 weeks"               },
    ],
    goodToKnow: [
      { key: "Practice Tests", value: "10 full mocks"      },
      { key: "Marking",       value: "Essay marking incl." },
      { key: "Refund",        value: "7-day refund policy" },
      { key: "Certificate",   value: "Completion cert."    },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-lang-03", href: "/listings/edu-lang-03", advId: "11043",
    images: [{ src: img(8), alt: "BSL class" }],
    priceLabel: "£150",
    priceSuffix: "/ 10-week course",
    title: "British Sign Language Level 1 — 10-Week Evening Course, Lewisham",
    detailsLabel: "LANGUAGE CLASS • BSL LEVEL 1 • LEWISHAM",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(2),
    description: "<p>Accredited <strong>BSL Level 1</strong> evening course at Lewisham Adult Education — 10 weeks, Tuesday evenings 6:30–8:30pm. Taught by a Deaf instructor. No prior knowledge needed. BQF Level 1 qualification awarded on completion.</p>",
    keyDetails: [
      { key: "Course",     value: "BSL Level 1 (BQF)"     },
      { key: "Duration",   value: "10 weeks"              },
      { key: "Schedule",   value: "Tue evenings 6:30pm"   },
      { key: "Instructor", value: "Deaf BSL teacher"      },
    ],
    goodToKnow: [
      { key: "Entry",      value: "No prior BSL needed"   },
      { key: "Venue",      value: "Lewisham Adult Ed Centre" },
      { key: "Exam",       value: "Included in fee"       },
      { key: "Next Start", value: "September 2026"        },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.eduPro,
  },
];


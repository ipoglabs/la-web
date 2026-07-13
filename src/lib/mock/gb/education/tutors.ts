import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── tutors ─────────────────────────────────────────────────────────────────────
export const EDUCATION_TUTORS: MockListing[] = [
  {
    id: "edu-tutor-01", href: "/listings/edu-tutor-01", advId: "11001",
    images: [{ src: img(1), alt: "Physics tutor" }],
    priceLabel: "£45",
    priceSuffix: "/ hr",
    title: "A-Level Physics Tutor — Oxford Grad, 98% Pass Rate, Online/London",
    detailsLabel: "TUTOR • A-LEVEL PHYSICS • LONDON / ONLINE",
    locationLabel: "North London / Online",
    postedAt: hrsAgo(2),
    description: "<p>Oxford Physics graduate with 7 years tutoring experience offering <strong>A-Level Physics tuition</strong>. 98% of students achieve A*/A. Exam board expertise: AQA, OCR, Edexcel. Sessions in North London or online via Zoom.</p>",
    keyDetails: [
      { key: "Subject",       value: "Physics (A-Level)"    },
      { key: "Exam Boards",   value: "AQA, OCR, Edexcel"   },
      { key: "Availability",  value: "Evenings & weekends"  },
      { key: "Qualifications", value: "MPhys Oxford, PGCE" },
    ],
    goodToKnow: [
      { key: "Pass Rate",    value: "98% A*/A"              },
      { key: "First Lesson", value: "Free taster"           },
      { key: "Materials",    value: "Provided free"         },
      { key: "DBS",          value: "Enhanced DBS checked"  },
    ],
    coordinates: { lat: 51.5650, lng: -0.1022 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-tutor-02", href: "/listings/edu-tutor-02", advId: "11002",
    images: [{ src: img(2), alt: "11+ tutor" }],
    priceLabel: "£40",
    priceSuffix: "/ hr",
    title: "11+ & 13+ Entrance Exam Tutor — Grammar & Independent Schools",
    detailsLabel: "TUTOR • 11+ / 13+ • LONDON",
    locationLabel: "South London / Online",
    postedAt: hrsAgo(5),
    description: "<p>Experienced <strong>11+ and 13+ tutor</strong> with outstanding success rates for grammar and top independent school entry. English, Maths, and Verbal/Non-Verbal Reasoning. Mock exam sessions available.</p>",
    keyDetails: [
      { key: "Subject",      value: "11+, 13+ prep"         },
      { key: "Covers",       value: "English, Maths, VR/NVR" },
      { key: "Availability", value: "Weekends + school hols" },
      { key: "Experience",   value: "12 years"              },
    ],
    goodToKnow: [
      { key: "Mock Exams",   value: "Full mocks available"  },
      { key: "First Lesson", value: "Assessment session"    },
      { key: "DBS",          value: "Enhanced DBS checked"  },
      { key: "References",   value: "Available on request"  },
    ],
    coordinates: { lat: 51.4613, lng: -0.1157 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-tutor-03", href: "/listings/edu-tutor-03", advId: "11003",
    images: [{ src: img(3), alt: "SEN tutor" }],
    priceLabel: "£50",
    priceSuffix: "/ hr",
    title: "SEN Specialist Tutor — Reading, Writing & Phonics, KS1/KS2, East London",
    detailsLabel: "TUTOR • SEN SPECIALIST • EAST LONDON",
    locationLabel: "Hackney / Online",
    postedAt: daysAgo(3),
    description: "<p>SENCO-qualified teacher offering specialist <strong>reading, writing, and phonics support</strong> for children with dyslexia, ADHD, and other learning needs. KS1 and KS2 (ages 5–11). In-home sessions in East London or online. Evidence-based approaches throughout.</p>",
    keyDetails: [
      { key: "Specialisms",   value: "Dyslexia, ADHD, SpLD"  },
      { key: "Level",         value: "KS1 & KS2 (ages 5–11)" },
      { key: "Methods",       value: "Phonics, evidence-based" },
      { key: "Location",      value: "East London / Online"   },
    ],
    goodToKnow: [
      { key: "Qualification", value: "SENCO qualified, PGCE"  },
      { key: "DBS",           value: "Enhanced DBS checked"   },
      { key: "Reports",       value: "Termly progress reports" },
      { key: "First Session", value: "Free assessment consult" },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.eduPro,
  },
];


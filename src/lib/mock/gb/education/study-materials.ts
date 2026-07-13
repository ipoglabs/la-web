import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── study_materials ────────────────────────────────────────────────────────────
export const EDUCATION_STUDY_MATERIALS: MockListing[] = [
  {
    id: "edu-study-01", href: "/listings/edu-study-01", advId: "11021",
    images: [{ src: img(4), alt: "Revision guides" }],
    priceLabel: "£45",
    priceSuffix: "(bundle of 10)",
    title: "GCSE Revision Guide Bundle — All Subjects, CGP Brand, VG Cond.",
    detailsLabel: "STUDY MATERIALS • GCSE • REVISION",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(2),
    description: "<p>Bundle of <strong>10 CGP GCSE revision guides</strong> — Maths, English, Biology, Chemistry, Physics, History, Geography, French, and Spanish. All matching 9-1 grade spec. Very good condition, minimal highlighting.</p>",
    keyDetails: [
      { key: "Quantity",  value: "10 CGP books"              },
      { key: "Level",     value: "GCSE (9-1 grade spec)"      },
      { key: "Subjects",  value: "Core + humanities + MFL"   },
      { key: "Condition", value: "Very good — minimal marks" },
    ],
    goodToKnow: [
      { key: "Bundle",    value: "All 10 — not split"       },
      { key: "Postage",   value: "Available (£6 tracked)"   },
      { key: "Collection", value: "Lewisham, SE13"          },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-study-02", href: "/listings/edu-study-02", advId: "11022",
    images: [{ src: img(5), alt: "Medical textbooks" }],
    priceLabel: "£120",
    title: "Medical Textbook Bundle — 8 Books, BNF, Oxford Handbook Set",
    detailsLabel: "STUDY MATERIALS • GOOD • MEDICAL",
    locationLabel: "Bethnal Green, London",
    postedAt: daysAgo(2),
    description: "<p>Bundle of <strong>8 core medical textbooks</strong> including current BNF, Oxford Handbook of Clinical Medicine (10th ed.), Oxford Clinical Specialties, Kumar & Clark, and more. Good condition — ideal for medical students.</p>",
    keyDetails: [
      { key: "Quantity",  value: "8 books"            },
      { key: "Includes",  value: "BNF, Oxford series" },
      { key: "Condition", value: "Good, minor marks"  },
      { key: "For",       value: "Medical students"   },
    ],
    goodToKnow: [
      { key: "Edition",    value: "2024–2025 editions" },
      { key: "Bundle",     value: "All 8 — not split"  },
      { key: "Collection", value: "Bethnal Green, E2"  },
      { key: "Postage",    value: "Available (£8)"     },
    ],
    coordinates: { lat: 51.5276, lng: -0.0538 },
    seller: SELLERS.quickSell,
  },
  {
    id: "edu-study-03", href: "/listings/edu-study-03", advId: "11023",
    images: [{ src: img(6), alt: "Music exam books" }],
    priceLabel: "£25",
    title: "ABRSM Piano Grade 3–5 + Theory Books Bundle — 2023/24 Syllabus, Forest Hill",
    detailsLabel: "STUDY MATERIALS • GOOD • MUSIC",
    locationLabel: "Forest Hill, London",
    postedAt: daysAgo(1),
    description: "<p>Bundle of <strong>5 ABRSM piano exam books</strong> — Grade 3, 4, and 5 selected pieces (2023–2024 syllabus), plus ABRSM Theory Grades 3 and 4. All in good condition, minimal pencil marks. Ideal for a student progressing through grades.</p>",
    keyDetails: [
      { key: "Quantity",  value: "5 books"                },
      { key: "Includes",  value: "Piano grades 3–5 + theory" },
      { key: "Syllabus",  value: "ABRSM 2023–2024"       },
      { key: "Condition", value: "Good, minor pencil marks" },
    ],
    goodToKnow: [
      { key: "Bundle",     value: "All 5 — not split"     },
      { key: "Collection", value: "Forest Hill, SE23"     },
      { key: "Postage",    value: "Available (£4 2nd class)" },
      { key: "Negotiable", value: "Sensible offers welcome" },
    ],
    coordinates: { lat: 51.4393, lng: -0.0551 },
    seller: SELLERS.alice,
  },
];


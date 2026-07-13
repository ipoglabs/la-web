import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── schools_colleges ────────────────────────────────────────────────────────────
export const EDUCATION_SCHOOLS: MockListing[] = [
  {
    id: "edu-school-01", href: "/listings/edu-school-01", advId: "11031",
    images: [{ src: img(5), alt: "Drama school" }],
    priceLabel: "From £80",
    priceSuffix: "/ term",
    title: "Weekend Drama & Performing Arts School — Ages 5–18, SE London",
    detailsLabel: "SCHOOL • PERFORMING ARTS • SE LONDON",
    locationLabel: "Greenwich, London",
    postedAt: daysAgo(1),
    description: "<p>Award-winning <strong>weekend performing arts school</strong> offering drama, musical theatre, and dance for children and teens aged 5–18. LAMDA exam preparation available. Saturday mornings in Greenwich — accepting new students.</p>",
    keyDetails: [
      { key: "Ages",       value: "5–18 years"              },
      { key: "Subjects",   value: "Drama, musical theatre, dance" },
      { key: "Schedule",   value: "Saturday mornings"       },
      { key: "Exams",      value: "LAMDA available"         },
    ],
    goodToKnow: [
      { key: "Term Dates", value: "Sep–Jul (following school)" },
      { key: "Trial",      value: "Free trial class"           },
      { key: "DBS",        value: "All staff DBS checked"      },
      { key: "Ofsted",     value: "Good (last inspection)"     },
    ],
    coordinates: { lat: 51.4826, lng: -0.0077 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-school-02", href: "/listings/edu-school-02", advId: "11032",
    images: [{ src: img(6), alt: "Tuition centre" }],
    priceLabel: "£85",
    priceSuffix: "/ mo",
    title: "KS2 & KS3 Maths + Science Tuition Centre — After School, Walthamstow",
    detailsLabel: "SCHOOL • TUITION CENTRE • WALTHAMSTOW",
    locationLabel: "Walthamstow, London",
    postedAt: daysAgo(2),
    description: "<p>Small-group <strong>maths and science tuition</strong> for KS2 and KS3 pupils at our Walthamstow centre. Max 6 per group. Sessions Mon/Wed/Fri after school, 4–5:30pm. Monthly assessments and progress reports sent to parents.</p>",
    keyDetails: [
      { key: "Subjects",   value: "Maths + Science"        },
      { key: "Level",      value: "KS2 & KS3"              },
      { key: "Schedule",   value: "Mon/Wed/Fri, 4–5:30pm"  },
      { key: "Group Size", value: "Max 6 pupils"           },
    ],
    goodToKnow: [
      { key: "Reports",    value: "Monthly parent updates" },
      { key: "Assessment", value: "Entry test required"    },
      { key: "DBS",        value: "All staff checked"      },
      { key: "Trial",      value: "Free assessment week"   },
    ],
    coordinates: { lat: 51.5860, lng: -0.0207 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-school-03", href: "/listings/edu-school-03", advId: "11033",
    images: [{ src: img(7), alt: "Sixth form open evening" }],
    priceLabel: "FREE",
    title: "Sixth Form Open Evening — 3 July 2026, A-Level & Vocational Courses",
    detailsLabel: "SCHOOL • OPEN EVENING • SIXTH FORM",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>Join us for our <strong>Sixth Form Open Evening on 3 July 2026</strong> (5:30–8pm) to explore A-Level, T-Level, and vocational course options for September 2026 entry. Meet subject teachers, current students, and tour our facilities.</p>",
    keyDetails: [
      { key: "Date",       value: "3 July 2026"            },
      { key: "Time",       value: "5:30pm – 8:00pm"        },
      { key: "Courses",    value: "A-Level, T-Level, Vocational" },
      { key: "Entry",      value: "September 2026"         },
    ],
    goodToKnow: [
      { key: "No Booking", value: "Just turn up"           },
      { key: "Transport",  value: "Overground + bus links" },
      { key: "Apply",      value: "Applications open Aug"  },
      { key: "Contact",    value: "admissions@school.ac.uk" },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.eduPro,
  },
];


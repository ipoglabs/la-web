import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── online_courses ─────────────────────────────────────────────────────────────
export const EDUCATION_ONLINE_COURSES: MockListing[] = [
  {
    id: "edu-course-01", href: "/listings/edu-course-01", advId: "11011",
    images: [{ src: img(3), alt: "Coding bootcamp" }],
    priceLabel: "£1,499",
    priceSuffix: "/ course",
    title: "Full-Stack Web Dev Bootcamp — 16 Weeks, Live Sessions, Job Support",
    detailsLabel: "ONLINE COURSE • WEB DEV • 16 WEEKS",
    locationLabel: "Online (UK)",
    postedAt: hrsAgo(3),
    description: "<p>Intensive <strong>16-week full-stack web development bootcamp</strong>. Learn HTML/CSS, JavaScript, React, Node.js, and SQL through live weekly sessions, projects, and mentoring. Career support and interview prep included.</p>",
    keyDetails: [
      { key: "Duration",    value: "16 weeks (part-time)"   },
      { key: "Stack",       value: "HTML, CSS, JS, React, Node" },
      { key: "Format",      value: "Live + recorded sessions" },
      { key: "Start",       value: "September 2026"          },
    ],
    goodToKnow: [
      { key: "Career",     value: "Job support + CV review" },
      { key: "Certificate", value: "Industry-recognised"   },
      { key: "Instalment",  value: "3× £500/month"         },
      { key: "Refund",     value: "7-day cooling-off period" },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-course-02", href: "/listings/edu-course-02", advId: "11012",
    images: [{ src: img(4), alt: "Project management course" }],
    priceLabel: "£299",
    priceSuffix: "/ course",
    title: "PMP Exam Prep — Project Management Professional Certification, Online",
    detailsLabel: "ONLINE COURSE • PMP • CERTIFICATION",
    locationLabel: "Online (UK)",
    postedAt: daysAgo(1),
    description: "<p>Comprehensive <strong>PMP exam preparation course</strong> aligned to PMBOK 7 and ECO. 35 contact hours certificate included. Covers predictive, agile, and hybrid project management. 1,000+ practice questions with detailed explanations.</p>",
    keyDetails: [
      { key: "Cert.",       value: "PMP (PMI)"            },
      { key: "Hours",       value: "35 contact hours"     },
      { key: "Format",      value: "Self-paced + live Q&A" },
      { key: "Pass Rate",   value: "94% first attempt"    },
    ],
    goodToKnow: [
      { key: "Contact Hrs", value: "35-hr cert included" },
      { key: "Practice",   value: "1,000+ exam questions" },
      { key: "Refund",     value: "14-day money-back"    },
      { key: "Access",     value: "12 months access"     },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.eduPro,
  },
  {
    id: "edu-course-03", href: "/listings/edu-course-03", advId: "11013",
    images: [{ src: img(5), alt: "Digital marketing course" }],
    priceLabel: "£499",
    priceSuffix: "/ course",
    title: "Digital Marketing Intensive — 4-Weekend Cohort, London / Online",
    detailsLabel: "ONLINE COURSE • DIGITAL MARKETING • 4 WEEKS",
    locationLabel: "Central London / Online",
    postedAt: hrsAgo(6),
    description: "<p>Hands-on <strong>digital marketing intensive</strong> covering SEO, PPC, social media, email, and analytics. 4-weekend cohort with live projects, agency mentors, and a portfolio piece. In-person in London or fully online. Next cohort August 2026.</p>",
    keyDetails: [
      { key: "Duration",   value: "4 weekends (Sat + Sun)" },
      { key: "Topics",     value: "SEO, PPC, Social, Email" },
      { key: "Format",     value: "In-person or online"    },
      { key: "Next Start", value: "August 2026"            },
    ],
    goodToKnow: [
      { key: "Projects",   value: "Live client brief"     },
      { key: "Certificate", value: "CIM aligned"         },
      { key: "Mentors",    value: "Agency professionals"  },
      { key: "Refund",     value: "7-day cooling-off"     },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.eduPro,
  },
];


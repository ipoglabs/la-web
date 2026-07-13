import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── internship ────────────────────────────────────────────────────────────────
export const JOBS_INTERNSHIP: MockListing[] = [
  {
    id: "job-intern-01", href: "/listings/job-intern-01", advId: "30031",
    images: [{ src: img(7), alt: "FinTech office" }],
    priceLabel: "£22,000",
    priceSuffix: "/yr (pro-rata)",
    title: "Marketing Intern — FinTech StartUp, 6-Month Paid Placement",
    detailsLabel: "INTERNSHIP • HYBRID • MARKETING",
    locationLabel: "Canary Wharf, London",
    postedAt: hrsAgo(4),
    description: "<p>Fast-growing FinTech startup offering a structured <strong>6-month Marketing Internship</strong>. You will support campaigns, manage social media channels, and help produce content. A great stepping stone into a permanent role.</p>",
    keyDetails: [
      { key: "Contract",    value: "Fixed-term, 6 months"  },
      { key: "Hours",       value: "37.5 hrs/week"          },
      { key: "Arrangement", value: "Hybrid (2 days office)" },
      { key: "Salary",      value: "£22,000 pro-rata"       },
      { key: "Start Date",  value: "September 2026"         },
    ],
    goodToKnow: [
      { key: "Education",  value: "2nd/3rd year undergrad or grad" },
      { key: "Skills",     value: "Social media, Canva, Excel"     },
      { key: "Benefits",   value: "Mentorship + free lunch"        },
      { key: "Conversion", value: "Permanent role possible"        },
      { key: "Deadline",   value: "Apply by 31 July 2026"          },
    ],
    coordinates: { lat: 51.5055, lng: -0.0235 },
    seller: SELLERS.techCo,
  },
  {
    id: "job-intern-02", href: "/listings/job-intern-02", advId: "30032",
    images: [{ src: img(8), alt: "Environmental fieldwork" }],
    priceLabel: "\u00a320,000",
    priceSuffix: "/ yr (pro-rata)",
    title: "Environment & Policy Research Intern \u2014 NGO, 12-Month Paid Placement",
    detailsLabel: "INTERNSHIP \u2022 HYBRID \u2022 ENVIRONMENT",
    locationLabel: "Bloomsbury, London",
    postedAt: daysAgo(2),
    description: "<p>GreenFutures Foundation offers a structured <strong>12-month Research Internship</strong> in our Policy & Advocacy team. You will conduct literature reviews, attend parliamentary briefings, and co-author published reports on climate, biodiversity, and circular economy.</p><p>Ideal for recent Geography, Environmental Science, or Politics graduates. Travel bursary available for UK field visits.</p>",
    keyDetails: [
      { key: "Contract",    value: "Fixed-term, 12 months"   },
      { key: "Hours",       value: "35 hrs/week"              },
      { key: "Arrangement", value: "Hybrid (2 days office)"   },
      { key: "Salary",      value: "\u00a320,000 pro-rata"         },
      { key: "Start Date",  value: "September 2026"           },
    ],
    goodToKnow: [
      { key: "Education",  value: "Relevant degree (2:1+)"       },
      { key: "Benefits",   value: "Travel bursary + CPD budget"  },
      { key: "Conversion", value: "Permanent role considered"    },
      { key: "Deadline",   value: "Apply by 15 Aug 2026"         },
      { key: "Apply Via",  value: "LokalAds message + CV"        },
    ],
    coordinates: { lat: 51.5226, lng: -0.1240 },
    seller: SELLERS.ngoOrg,
  },
  {
    id: "job-intern-03", href: "/listings/job-intern-03", advId: "30033",
    images: [{ src: img(9), alt: "Product design studio" }],
    priceLabel: "\u00a324,000",
    priceSuffix: "/ yr (pro-rata)",
    title: "Product Design Intern \u2014 Tech Startup, 3-Month Summer, Paid",
    detailsLabel: "INTERNSHIP \u2022 HYBRID \u2022 PRODUCT DESIGN",
    locationLabel: "Shoreditch, London",
    postedAt: daysAgo(3),
    description: "<p>Nexus Tech is offering a <strong>3-month paid Product Design Internship</strong> for summer 2026. You will work alongside our senior designers, conduct user research, and deliver wireframes and prototypes for a live product feature shipping to real users.</p><p>Strong performers will be fast-tracked for our autumn graduate programme. Portfolio review included in the offer process.</p>",
    keyDetails: [
      { key: "Contract",    value: "Fixed-term, 3 months"      },
      { key: "Hours",       value: "37.5 hrs/week"              },
      { key: "Arrangement", value: "Hybrid (3 days office)"     },
      { key: "Salary",      value: "\u00a324,000 pro-rata"           },
      { key: "Start Date",  value: "July 2026"                 },
    ],
    goodToKnow: [
      { key: "Education",  value: "Design or HCI degree student"  },
      { key: "Tools",      value: "Figma \u2014 essential"          },
      { key: "Portfolio",  value: "Required with application"     },
      { key: "Conversion", value: "Grad programme fast-track"     },
      { key: "Apply Via",  value: "Message with portfolio link"   },
    ],
    coordinates: { lat: 51.5245, lng: -0.0789 },
    seller: SELLERS.techCo,
  },
];


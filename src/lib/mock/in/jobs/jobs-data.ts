import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── full_time ─────────────────────────────────────────────────────────────────
export const IN_JOBS_FULL_TIME: MockListing[] = [
  {
    id: "job-in-ft-01", href: "/listings/job-in-ft-01", advId: "22001",
    images: [{ src: img(1), alt: "Nexalytics office" }],
    priceLabel: "\u20b912-18 LPA", priceSuffix: "/ yr",
    title: "Senior Backend Engineer \u2014 Nexalytics Software Pvt Ltd",
    detailsLabel: "FULL TIME \u2022 HYBRID \u2022 SOFTWARE",
    locationLabel: "Whitefield, Bengaluru",
    postedAt: hrsAgo(4),
    description: "<p>We're hiring a <strong>Senior Backend Engineer</strong> to join our platform team building high-scale APIs in Node.js and Go. Hybrid work model, 3 days in office at our Whitefield campus.</p><p>5+ years experience with distributed systems required.</p>",
    keyDetails: [
      { key: "Contract",    value: "Permanent"        },
      { key: "Hours",       value: "Full Time (40h)"  },
      { key: "Arrangement", value: "Hybrid"           },
      { key: "Start Date",  value: "Immediate"        },
      { key: "Experience",  value: "5+ years"         },
    ],
    goodToKnow: [
      { key: "Notice Period", value: "Negotiable"     },
      { key: "Interview",     value: "3 rounds, virtual" },
      { key: "Benefits",      value: "ESOPs, health cover" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.nexalytics,
  },
  {
    id: "job-in-ft-02", href: "/listings/job-in-ft-02", advId: "22002",
    images: [{ src: img(2), alt: "Retail store floor" }],
    priceLabel: "\u20b94.5-6 LPA", priceSuffix: "/ yr",
    title: "Store Operations Manager \u2014 Prime Retail Solutions",
    detailsLabel: "FULL TIME \u2022 ON-SITE \u2022 RETAIL",
    locationLabel: "Sector 44, Gurugram",
    postedAt: daysAgo(1),
    description: "<p>Prime Retail Solutions is looking for a <strong>Store Operations Manager</strong> for our Gurugram flagship store. Responsible for inventory, staff scheduling, and daily sales targets.</p>",
    keyDetails: [
      { key: "Contract",    value: "Permanent"       },
      { key: "Hours",       value: "Full Time (48h)" },
      { key: "Arrangement", value: "On-site"         },
      { key: "Start Date",  value: "Within 2 weeks"  },
      { key: "Experience",  value: "3+ years retail"  },
    ],
    goodToKnow: [
      { key: "Notice Period", value: "Up to 30 days" },
      { key: "Benefits",      value: "PF, ESI, incentives" },
    ],
    coordinates: { lat: 28.4515, lng: 77.0730 },
    seller: SELLERS.primeRetail,
  },
];

// ── part_time ─────────────────────────────────────────────────────────────────
export const IN_JOBS_PART_TIME: MockListing[] = [
  {
    id: "job-in-pt-01", href: "/listings/job-in-pt-01", advId: "22011",
    images: [{ src: img(3), alt: "Store cashier" }],
    priceLabel: "\u20b9250/hr", priceSuffix: "/ hr",
    title: "Part-Time Cashier \u2014 Weekend Shifts, Prime Retail Solutions",
    detailsLabel: "PART TIME \u2022 ON-SITE \u2022 RETAIL",
    locationLabel: "Sector 44, Gurugram",
    postedAt: hrsAgo(10),
    description: "<p>Weekend cashier role at our Gurugram store, Saturday-Sunday, 10am-8pm. Good for students or those seeking supplementary income.</p>",
    keyDetails: [
      { key: "Contract",    value: "Part-time"     },
      { key: "Hours",       value: "16h / weekend"  },
      { key: "Arrangement", value: "On-site"        },
      { key: "Start Date",  value: "Immediate"      },
    ],
    goodToKnow: [
      { key: "Training", value: "Provided on day 1" },
    ],
    coordinates: { lat: 28.4515, lng: 77.0730 },
    seller: SELLERS.primeRetail,
  },
  {
    id: "job-in-pt-02", href: "/listings/job-in-pt-02", advId: "22012",
    images: [{ src: img(4), alt: "Tutoring session" }],
    priceLabel: "\u20b9500/hr", priceSuffix: "/ hr",
    title: "Part-Time Maths Tutor \u2014 Evenings, Class 9-12",
    detailsLabel: "PART TIME \u2022 REMOTE \u2022 EDUCATION",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Seeking a part-time maths tutor for evening sessions, Class 9-12 CBSE syllabus. Online sessions via video call, flexible scheduling.</p>",
    keyDetails: [
      { key: "Contract",    value: "Part-time"    },
      { key: "Hours",       value: "10-15h / week" },
      { key: "Arrangement", value: "Remote"       },
    ],
    goodToKnow: [
      { key: "Qualification", value: "B.Ed or equivalent preferred" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.jobSeeker,
  },
];

// ── freelance ─────────────────────────────────────────────────────────────────
export const IN_JOBS_FREELANCE: MockListing[] = [
  {
    id: "job-in-free-01", href: "/listings/job-in-free-01", advId: "22021",
    images: [{ src: img(5), alt: "Freelance designer workspace" }],
    priceLabel: "\u20b930,000/project", priceSuffix: "/ project",
    title: "Freelance UI/UX Designer \u2014 Mobile App Redesign",
    detailsLabel: "FREELANCE \u2022 REMOTE \u2022 DESIGN",
    locationLabel: "Powai, Mumbai",
    postedAt: hrsAgo(6),
    description: "<p>Looking for a freelance UI/UX designer to redesign our fintech mobile app. Deliverables: Figma wireframes, high-fidelity screens, and a design system. 4-6 week engagement.</p>",
    keyDetails: [
      { key: "Contract",    value: "Freelance / Project-based" },
      { key: "Duration",    value: "4-6 weeks"                 },
      { key: "Arrangement", value: "Remote"                    },
    ],
    goodToKnow: [
      { key: "Payment", value: "50% upfront, 50% on delivery" },
      { key: "Portfolio", value: "Required with application" },
    ],
    coordinates: { lat: 19.1176, lng: 72.9060 },
    seller: SELLERS.freelanceDesk,
  },
  {
    id: "job-in-free-02", href: "/listings/job-in-free-02", advId: "22022",
    images: [{ src: img(6), alt: "Content writing" }],
    priceLabel: "\u20b93/word", priceSuffix: "/ word",
    title: "Freelance Content Writer \u2014 Tech Blog Articles",
    detailsLabel: "FREELANCE \u2022 REMOTE \u2022 CONTENT",
    locationLabel: "Powai, Mumbai",
    postedAt: daysAgo(3),
    description: "<p>Ongoing freelance opportunity writing SEO-optimised tech articles, 1500-2000 words each. Flexible deadlines, steady monthly volume.</p>",
    keyDetails: [
      { key: "Contract",    value: "Freelance, ongoing" },
      { key: "Arrangement", value: "Remote"             },
    ],
    goodToKnow: [
      { key: "Volume", value: "4-6 articles / month" },
    ],
    coordinates: { lat: 19.1176, lng: 72.9060 },
    seller: SELLERS.freelanceDesk,
  },
];

// ── internship ────────────────────────────────────────────────────────────────
export const IN_JOBS_INTERNSHIP: MockListing[] = [
  {
    id: "job-in-intern-01", href: "/listings/job-in-intern-01", advId: "22031",
    images: [{ src: img(7), alt: "Interns at desk" }],
    priceLabel: "\u20b915,000/mo", priceSuffix: "/ mo",
    title: "Software Engineering Intern \u2014 6-Month Programme",
    detailsLabel: "INTERNSHIP \u2022 HYBRID \u2022 SOFTWARE",
    locationLabel: "Hinjawadi, Pune",
    postedAt: hrsAgo(8),
    description: "<p>Structured 6-month internship for final-year CS/IT students. Work alongside senior engineers on real production features, with mentorship and a pre-placement offer track.</p>",
    keyDetails: [
      { key: "Duration",    value: "6 months"  },
      { key: "Arrangement", value: "Hybrid"    },
      { key: "Stipend",     value: "\u20b915,000/month" },
    ],
    goodToKnow: [
      { key: "PPO", value: "Top performers get pre-placement offer" },
    ],
    coordinates: { lat: 18.5908, lng: 73.7392 },
    seller: SELLERS.campusConnect,
  },
  {
    id: "job-in-intern-02", href: "/listings/job-in-intern-02", advId: "22032",
    images: [{ src: img(8), alt: "Marketing team" }],
    priceLabel: "\u20b98,000/mo", priceSuffix: "/ mo",
    title: "Marketing Intern \u2014 Social Media & Content, 3 Months",
    detailsLabel: "INTERNSHIP \u2022 ON-SITE \u2022 MARKETING",
    locationLabel: "Hinjawadi, Pune",
    postedAt: daysAgo(4),
    description: "<p>3-month marketing internship covering social media calendars, content creation, and campaign analytics. Great for MBA/mass-comm students.</p>",
    keyDetails: [
      { key: "Duration",    value: "3 months" },
      { key: "Arrangement", value: "On-site"  },
      { key: "Stipend",     value: "\u20b98,000/month" },
    ],
    goodToKnow: [
      { key: "Certificate", value: "Provided on completion" },
    ],
    coordinates: { lat: 18.5908, lng: 73.7392 },
    seller: SELLERS.campusConnect,
  },
];

// ── temp_seasonal ──────────────────────────────────────────────────────────────
export const IN_JOBS_TEMP_SEASONAL: MockListing[] = [
  {
    id: "job-in-temp-01", href: "/listings/job-in-temp-01", advId: "22041",
    images: [{ src: img(9), alt: "Festival staff" }],
    priceLabel: "\u20b9600/day", priceSuffix: "/ day",
    title: "Diwali Season Retail Staff \u2014 4 Weeks, Multiple Stores",
    detailsLabel: "TEMPORARY \u2022 ON-SITE \u2022 RETAIL",
    locationLabel: "Andheri East, Mumbai",
    postedAt: hrsAgo(12),
    description: "<p>Hiring temporary retail staff for the Diwali shopping season across our partner stores in Mumbai. 4-week contract, daily wages paid weekly.</p>",
    keyDetails: [
      { key: "Contract", value: "Temporary, 4 weeks" },
      { key: "Hours",    value: "8h shifts"          },
    ],
    goodToKnow: [
      { key: "Payment", value: "Weekly, in cash or bank transfer" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8697 },
    seller: SELLERS.festiveStaffing,
  },
  {
    id: "job-in-temp-02", href: "/listings/job-in-temp-02", advId: "22042",
    images: [{ src: img(1), alt: "Event staff" }],
    priceLabel: "\u20b9700/day", priceSuffix: "/ day",
    title: "Wedding Season Event Staff \u2014 Weekends, Dec-Feb",
    detailsLabel: "SEASONAL \u2022 ON-SITE \u2022 EVENTS",
    locationLabel: "Andheri East, Mumbai",
    postedAt: daysAgo(2),
    description: "<p>Seasonal event staff needed for wedding season (Dec-Feb), weekend assignments across Mumbai venues. Roles include hospitality, guest coordination, and setup crew.</p>",
    keyDetails: [
      { key: "Contract", value: "Seasonal, weekends only" },
      { key: "Hours",    value: "10-12h per event"        },
    ],
    goodToKnow: [
      { key: "Transport", value: "Provided to/from venue" },
    ],
    coordinates: { lat: 19.1197, lng: 72.8697 },
    seller: SELLERS.festiveStaffing,
  },
];

// ── wanted ────────────────────────────────────────────────────────────────────
export const IN_JOBS_WANTED: MockListing[] = [
  {
    id: "job-in-want-01", href: "/listings/job-in-want-01", advId: "22051",
    images: [{ src: img(2), alt: "Job seeker profile" }],
    priceLabel: "\u20b98-10 LPA expected", priceSuffix: "/ yr",
    title: "WANTED: Full-Time Product Analyst Role \u2014 4 Years Experience",
    detailsLabel: "WANTED \u2022 HYBRID \u2022 PRODUCT/ANALYTICS",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: hrsAgo(15),
    description: "<p>Experienced product analyst (4 years, SQL + Python + dashboards) seeking a full-time role in Bengaluru. Open to hybrid arrangements. Available to join within 30 days.</p>",
    keyDetails: [
      { key: "Experience",       value: "4 years"       },
      { key: "Expected Salary",  value: "\u20b98-10 LPA" },
      { key: "Notice Period",    value: "30 days"       },
    ],
    goodToKnow: [
      { key: "Resume", value: "Available on request" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.jobSeeker,
  },
  {
    id: "job-in-want-02", href: "/listings/job-in-want-02", advId: "22052",
    images: [{ src: img(3), alt: "Graphic designer portfolio" }],
    priceLabel: "\u20b925,000/mo expected", priceSuffix: "/ mo",
    title: "WANTED: Freelance Graphic Design Assignments",
    detailsLabel: "WANTED \u2022 REMOTE \u2022 DESIGN",
    locationLabel: "Whitefield, Bengaluru",
    postedAt: daysAgo(3),
    description: "<p>Freelance graphic designer with 3 years of experience in branding and social media creatives, seeking new client assignments. Portfolio available on request.</p>",
    keyDetails: [
      { key: "Experience",      value: "3 years"        },
      { key: "Expected Rate",   value: "\u20b925,000/month equivalent" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Immediate" },
    ],
    coordinates: { lat: 12.9698, lng: 77.7500 },
    seller: SELLERS.jobSeeker,
  },
];

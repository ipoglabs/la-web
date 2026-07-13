import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── full_time ─────────────────────────────────────────────────────────────────
export const SG_JOBS_FULL_TIME: MockListing[] = [
  {
    id: "job-sg-ft-01", href: "/listings/job-sg-ft-01", advId: "32001",
    images: [{ src: img(1), alt: "BrightPath office" }],
    priceLabel: "S$6,500-8,500", priceSuffix: "/ mo",
    title: "Senior Backend Engineer \u2014 BrightPath Technologies",
    detailsLabel: "FULL TIME \u2022 HYBRID \u2022 SOFTWARE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Hiring a <strong>Senior Backend Engineer</strong> for our fintech platform team. Hybrid model, 3 days in office at Raffles Place. EP/S Pass sponsorship available for the right candidate.</p>",
    keyDetails: [
      { key: "Contract",    value: "Permanent"       },
      { key: "Hours",       value: "Full Time (44h)" },
      { key: "Arrangement", value: "Hybrid"          },
      { key: "Experience",  value: "5+ years"        },
    ],
    goodToKnow: [
      { key: "Work Pass", value: "EP sponsorship available" },
      { key: "CPF",       value: "Contributed for citizens/PR" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.brightPathTech,
  },
  {
    id: "job-sg-ft-02", href: "/listings/job-sg-ft-02", advId: "32002",
    images: [{ src: img(2), alt: "Retail store" }],
    priceLabel: "S$3,200-3,800", priceSuffix: "/ mo",
    title: "Store Supervisor \u2014 Marina Retail Group",
    detailsLabel: "FULL TIME \u2022 ON-SITE \u2022 RETAIL",
    locationLabel: "Marina Bay, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Marina Retail Group is hiring a <strong>Store Supervisor</strong> for our Marina Bay outlet. Responsible for team scheduling, stock management, and daily sales targets.</p>",
    keyDetails: [
      { key: "Contract",    value: "Permanent"       },
      { key: "Hours",       value: "Full Time (44h)" },
      { key: "Arrangement", value: "On-site"         },
      { key: "Experience",  value: "2+ years retail"  },
    ],
    goodToKnow: [
      { key: "CPF",    value: "Contributed for citizens/PR" },
      { key: "Bonus",  value: "AWS + performance bonus"     },
    ],
    coordinates: { lat: 1.2838, lng: 103.8591 },
    seller: SELLERS.marinaRetail,
  },
];

// ── part_time ─────────────────────────────────────────────────────────────────
export const SG_JOBS_PART_TIME: MockListing[] = [
  {
    id: "job-sg-pt-01", href: "/listings/job-sg-pt-01", advId: "32011",
    images: [{ src: img(3), alt: "Cashier at counter" }],
    priceLabel: "S$10/hr", priceSuffix: "/ hr",
    title: "Part-Time Retail Assistant \u2014 Weekend Shifts",
    detailsLabel: "PART TIME \u2022 ON-SITE \u2022 RETAIL",
    locationLabel: "Marina Bay, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>Weekend retail assistant role at our Marina Bay outlet, Saturday-Sunday 10am-9pm. Suitable for students or part-time job seekers.</p>",
    keyDetails: [
      { key: "Contract", value: "Part-time"    },
      { key: "Hours",    value: "18h / weekend" },
    ],
    goodToKnow: [
      { key: "Training", value: "Provided on day 1" },
    ],
    coordinates: { lat: 1.2838, lng: 103.8591 },
    seller: SELLERS.marinaRetail,
  },
  {
    id: "job-sg-pt-02", href: "/listings/job-sg-pt-02", advId: "32012",
    images: [{ src: img(4), alt: "Tutoring session" }],
    priceLabel: "S$40/hr", priceSuffix: "/ hr",
    title: "Part-Time Maths Tutor \u2014 Secondary Level",
    detailsLabel: "PART TIME \u2022 ON-SITE \u2022 EDUCATION",
    locationLabel: "Bishan, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Seeking a part-time maths tutor for secondary school students, evening sessions at student's home in Bishan. MOE syllabus experience preferred.</p>",
    keyDetails: [
      { key: "Contract", value: "Part-time"     },
      { key: "Hours",    value: "6-8h / week"   },
    ],
    goodToKnow: [
      { key: "Qualification", value: "Degree holder preferred" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8485 },
    seller: SELLERS.jobSeekerSG,
  },
];

// ── freelance ─────────────────────────────────────────────────────────────────
export const SG_JOBS_FREELANCE: MockListing[] = [
  {
    id: "job-sg-free-01", href: "/listings/job-sg-free-01", advId: "32021",
    images: [{ src: img(5), alt: "Freelance designer" }],
    priceLabel: "S$4,500/project", priceSuffix: "/ project",
    title: "Freelance UI/UX Designer \u2014 Fintech App Redesign",
    detailsLabel: "FREELANCE \u2022 REMOTE \u2022 DESIGN",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Looking for a freelance UI/UX designer to redesign our fintech mobile app. Deliverables: Figma prototypes and design system. 4-6 week engagement.</p>",
    keyDetails: [
      { key: "Contract", value: "Freelance / Project-based" },
      { key: "Duration", value: "4-6 weeks"                 },
    ],
    goodToKnow: [
      { key: "Payment", value: "50% upfront, 50% on delivery" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.freelanceHubSG,
  },
  {
    id: "job-sg-free-02", href: "/listings/job-sg-free-02", advId: "32022",
    images: [{ src: img(6), alt: "Content writing" }],
    priceLabel: "S$0.30/word", priceSuffix: "/ word",
    title: "Freelance Content Writer \u2014 Tech Blog Articles",
    detailsLabel: "FREELANCE \u2022 REMOTE \u2022 CONTENT",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Ongoing freelance opportunity writing SEO-optimised tech articles, 1500-2000 words each. Flexible deadlines, steady monthly volume.</p>",
    keyDetails: [
      { key: "Contract", value: "Freelance, ongoing" },
    ],
    goodToKnow: [
      { key: "Volume", value: "4-6 articles / month" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.freelanceHubSG,
  },
];

// ── internship ────────────────────────────────────────────────────────────────
export const SG_JOBS_INTERNSHIP: MockListing[] = [
  {
    id: "job-sg-intern-01", href: "/listings/job-sg-intern-01", advId: "32031",
    images: [{ src: img(7), alt: "Interns at desk" }],
    priceLabel: "S$1,200/mo", priceSuffix: "/ mo",
    title: "Software Engineering Intern \u2014 6-Month Programme",
    detailsLabel: "INTERNSHIP \u2022 HYBRID \u2022 SOFTWARE",
    locationLabel: "Jurong East, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>Structured 6-month internship for penultimate/final-year students. Work alongside senior engineers on production features with mentorship.</p>",
    keyDetails: [
      { key: "Duration",    value: "6 months"       },
      { key: "Arrangement", value: "Hybrid"          },
      { key: "Stipend",     value: "S$1,200/month"   },
    ],
    goodToKnow: [
      { key: "PPO", value: "Top performers get a return offer" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.ntuCareers,
  },
  {
    id: "job-sg-intern-02", href: "/listings/job-sg-intern-02", advId: "32032",
    images: [{ src: img(8), alt: "Marketing team" }],
    priceLabel: "S$900/mo", priceSuffix: "/ mo",
    title: "Marketing Intern \u2014 Social Media & Content, 3 Months",
    detailsLabel: "INTERNSHIP \u2022 ON-SITE \u2022 MARKETING",
    locationLabel: "Jurong East, Singapore",
    postedAt: daysAgo(4),
    description: "<p>3-month marketing internship covering social media calendars, content creation, and campaign analytics. Great for business/mass-comm students.</p>",
    keyDetails: [
      { key: "Duration",    value: "3 months"     },
      { key: "Arrangement", value: "On-site"      },
      { key: "Stipend",     value: "S$900/month"  },
    ],
    goodToKnow: [
      { key: "Certificate", value: "Provided on completion" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.ntuCareers,
  },
];

// ── temp_seasonal ──────────────────────────────────────────────────────────────
export const SG_JOBS_TEMP_SEASONAL: MockListing[] = [
  {
    id: "job-sg-temp-01", href: "/listings/job-sg-temp-01", advId: "32041",
    images: [{ src: img(9), alt: "Festive retail staff" }],
    priceLabel: "S$12/hr", priceSuffix: "/ hr",
    title: "Christmas Season Retail Staff \u2014 4 Weeks, Orchard Road",
    detailsLabel: "TEMPORARY \u2022 ON-SITE \u2022 RETAIL",
    locationLabel: "Orchard, Singapore",
    postedAt: hrsAgo(12),
    description: "<p>Hiring temporary retail staff for the year-end shopping season across our Orchard Road outlets. 4-week contract, hourly wages paid biweekly.</p>",
    keyDetails: [
      { key: "Contract", value: "Temporary, 4 weeks" },
      { key: "Hours",    value: "8h shifts"          },
    ],
    goodToKnow: [
      { key: "Payment", value: "Biweekly, PayNow or bank transfer" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.festiveStaffingSG,
  },
  {
    id: "job-sg-temp-02", href: "/listings/job-sg-temp-02", advId: "32042",
    images: [{ src: img(1), alt: "F&B event staff" }],
    priceLabel: "S$14/hr", priceSuffix: "/ hr",
    title: "F&B Event Staff \u2014 Weekends, Marina Bay Events Calendar",
    detailsLabel: "SEASONAL \u2022 ON-SITE \u2022 F&B/EVENTS",
    locationLabel: "Orchard, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Seasonal F&B event staff needed for the Marina Bay events calendar, weekend assignments. Roles include hospitality, guest coordination, and setup crew.</p>",
    keyDetails: [
      { key: "Contract", value: "Seasonal, weekends only" },
      { key: "Hours",    value: "8-10h per event"         },
    ],
    goodToKnow: [
      { key: "Meals", value: "Provided during shift" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.festiveStaffingSG,
  },
];

// ── wanted ────────────────────────────────────────────────────────────────────
export const SG_JOBS_WANTED: MockListing[] = [
  {
    id: "job-sg-want-01", href: "/listings/job-sg-want-01", advId: "32051",
    images: [{ src: img(2), alt: "Job seeker profile" }],
    priceLabel: "S$5,500-6,500 expected", priceSuffix: "/ mo",
    title: "WANTED: Full-Time Product Analyst Role \u2014 4 Years Experience",
    detailsLabel: "WANTED \u2022 HYBRID \u2022 PRODUCT/ANALYTICS",
    locationLabel: "Bishan, Singapore",
    postedAt: hrsAgo(15),
    description: "<p>Experienced product analyst (4 years, SQL + Python + dashboards) seeking a full-time role in Singapore. Open to hybrid arrangements. Available to join within 4 weeks.</p>",
    keyDetails: [
      { key: "Experience",       value: "4 years"      },
      { key: "Expected Salary",  value: "S$5,500-6,500/mo" },
      { key: "Notice Period",    value: "4 weeks"      },
    ],
    goodToKnow: [
      { key: "Resume", value: "Available on request" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8485 },
    seller: SELLERS.jobSeekerSG,
  },
  {
    id: "job-sg-want-02", href: "/listings/job-sg-want-02", advId: "32052",
    images: [{ src: img(3), alt: "Graphic design portfolio" }],
    priceLabel: "S$1,800/mo expected", priceSuffix: "/ mo",
    title: "WANTED: Freelance Graphic Design Assignments",
    detailsLabel: "WANTED \u2022 REMOTE \u2022 DESIGN",
    locationLabel: "Raffles Place, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Freelance graphic designer with 3 years of experience in branding and social media creatives, seeking new client assignments. Portfolio available on request.</p>",
    keyDetails: [
      { key: "Experience",    value: "3 years"     },
      { key: "Expected Rate", value: "S$1,800/month equivalent" },
    ],
    goodToKnow: [
      { key: "Availability", value: "Immediate" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.jobSeekerSG,
  },
];

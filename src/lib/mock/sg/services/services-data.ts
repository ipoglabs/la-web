import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── home_services ─────────────────────────────────────────────────────────────
export const SG_SERVICES_HOME: MockListing[] = [
  {
    id: "svc-sg-home-01", href: "/listings/svc-sg-home-01", advId: "33001",
    images: [{ src: img(1), alt: "Electrician at work" }],
    priceLabel: "S$50", priceSuffix: "/ visit",
    title: "Licensed Electrician \u2014 Same-Day Callouts, Singapore",
    detailsLabel: "HOME SERVICES \u2022 LICENSED \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>PUB-licensed electricians for wiring, switch/socket repairs, and lighting installation. Same-day service island-wide with upfront pricing.</p>",
    keyDetails: [
      { key: "Service Type", value: "Electrical repair" },
      { key: "Coverage",     value: "Island-wide"        },
      { key: "Response Time", value: "Same day"          },
    ],
    goodToKnow: [
      { key: "Call-Out Fee", value: "S$0 with booking" },
      { key: "Reviews",      value: "4.8 \u2605 (410 reviews)" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.urbanHomeSG,
  },
  {
    id: "svc-sg-home-02", href: "/listings/svc-sg-home-02", advId: "33002",
    images: [{ src: img(2), alt: "Home cleaning" }],
    priceLabel: "S$120", priceSuffix: "/ job",
    title: "Deep Home Cleaning \u2014 HDB/Condo, Trained Staff",
    detailsLabel: "HOME SERVICES \u2022 VERIFIED \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Professional deep cleaning for HDB flats and condos. Background-verified staff with own equipment and eco-friendly products.</p>",
    keyDetails: [
      { key: "Service Type", value: "Deep cleaning" },
      { key: "Duration",     value: "3-4 hours"     },
    ],
    goodToKnow: [
      { key: "Reviews", value: "4.7 \u2605 (280 reviews)" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.urbanHomeSG,
  },
];

// ── business_services ────────────────────────────────────────────────────────
export const SG_SERVICES_BUSINESS: MockListing[] = [
  {
    id: "svc-sg-biz-01", href: "/listings/svc-sg-biz-01", advId: "33011",
    images: [{ src: img(3), alt: "Accounting office" }],
    priceLabel: "S$300", priceSuffix: "/ mo",
    title: "GST Filing & Accounting \u2014 Monthly Retainer for SMEs",
    detailsLabel: "BUSINESS SERVICES \u2022 ACCA-BACKED \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: hrsAgo(5),
    description: "<p>Monthly GST return filing, bookkeeping, and IRAS compliance for small businesses. ACCA-backed team serving Singapore SMEs.</p>",
    keyDetails: [
      { key: "Service Type", value: "GST & accounting" },
      { key: "Coverage",     value: "Singapore-wide"   },
    ],
    goodToKnow: [
      { key: "Contract", value: "Monthly, cancel anytime" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.bizConsultSG,
  },
  {
    id: "svc-sg-biz-02", href: "/listings/svc-sg-biz-02", advId: "33012",
    images: [{ src: img(4), alt: "Company incorporation" }],
    priceLabel: "S$600", priceSuffix: "/ job",
    title: "Private Limited Company Incorporation \u2014 ACRA End-to-End",
    detailsLabel: "BUSINESS SERVICES \u2022 ACRA-COMPLIANT \u2022 SINGAPORE",
    locationLabel: "Raffles Place, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Complete Pte Ltd incorporation service \u2014 ACRA filing, company secretary appointment, and registered address options.</p>",
    keyDetails: [
      { key: "Service Type", value: "Company incorporation" },
      { key: "Turnaround",   value: "1-3 working days"      },
    ],
    goodToKnow: [
      { key: "Includes", value: "Govt. fees extra" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.bizConsultSG,
  },
];

// ── health_fitness ────────────────────────────────────────────────────────────
export const SG_SERVICES_HEALTH_FITNESS: MockListing[] = [
  {
    id: "svc-sg-health-01", href: "/listings/svc-sg-health-01", advId: "33021",
    images: [{ src: img(5), alt: "Personal trainer session" }],
    priceLabel: "S$70", priceSuffix: "/ session",
    title: "Certified Personal Trainer \u2014 Home & Gym Sessions",
    detailsLabel: "HEALTH & FITNESS \u2022 CERTIFIED \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: hrsAgo(7),
    description: "<p>ACE-certified personal trainer offering strength training and weight-loss programmes with home visits across central Singapore.</p>",
    keyDetails: [
      { key: "Service Type", value: "Personal training" },
      { key: "Qualification",value: "ACE Certified"     },
    ],
    goodToKnow: [
      { key: "Package", value: "10-session packs discounted" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8485 },
    seller: SELLERS.fitZoneSG,
  },
  {
    id: "svc-sg-health-02", href: "/listings/svc-sg-health-02", advId: "33022",
    images: [{ src: img(6), alt: "Yoga session" }],
    priceLabel: "S$60", priceSuffix: "/ session",
    title: "Home Yoga Instructor \u2014 Beginners to Advanced",
    detailsLabel: "HEALTH & FITNESS \u2022 CERTIFIED \u2022 SINGAPORE",
    locationLabel: "Bishan, Singapore",
    postedAt: daysAgo(1),
    description: "<p>RYT-200 certified yoga instructor offering home sessions covering Hatha, Vinyasa, and breathing techniques.</p>",
    keyDetails: [
      { key: "Service Type", value: "Yoga instruction" },
    ],
    goodToKnow: [
      { key: "Package", value: "Monthly packages available" },
    ],
    coordinates: { lat: 1.3508, lng: 103.8485 },
    seller: SELLERS.fitZoneSG,
  },
];

// ── tutoring ──────────────────────────────────────────────────────────────────
export const SG_SERVICES_TUTORING: MockListing[] = [
  {
    id: "svc-sg-tutor-01", href: "/listings/svc-sg-tutor-01", advId: "33031",
    images: [{ src: img(7), alt: "Maths tutoring" }],
    priceLabel: "S$60", priceSuffix: "/ hr",
    title: "Maths & Science Tutor \u2014 PSLE & O-Level, MOE-Trained",
    detailsLabel: "TUTORING \u2022 EXPERIENCED \u2022 SINGAPORE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>8 years of MOE teaching experience covering Maths and Science for PSLE and O-Level students. Home visits or online sessions.</p>",
    keyDetails: [
      { key: "Subjects",   value: "Maths, Science" },
      { key: "Experience", value: "8 years"        },
    ],
    goodToKnow: [
      { key: "Mode", value: "Home visit or online" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.tutorProSG,
  },
  {
    id: "svc-sg-tutor-02", href: "/listings/svc-sg-tutor-02", advId: "33032",
    images: [{ src: img(8), alt: "English tutoring" }],
    priceLabel: "S$50", priceSuffix: "/ hr",
    title: "English & Composition Tutor \u2014 Primary & Secondary",
    detailsLabel: "TUTORING \u2022 EXPERIENCED \u2022 SINGAPORE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: daysAgo(2),
    description: "<p>English composition and comprehension coaching for primary and secondary students. Flexible scheduling, online or in-person.</p>",
    keyDetails: [
      { key: "Subjects", value: "English, Composition" },
    ],
    goodToKnow: [
      { key: "Mode", value: "Home visit or online" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.tutorProSG,
  },
];

// ── education_learning ────────────────────────────────────────────────────────
export const SG_SERVICES_EDUCATION: MockListing[] = [
  {
    id: "svc-sg-edu-01", href: "/listings/svc-sg-edu-01", advId: "33041",
    images: [{ src: img(9), alt: "Tuition class" }],
    priceLabel: "S$400", priceSuffix: "/ mo",
    title: "PSLE Preparation Programme \u2014 Small-Group Classes",
    detailsLabel: "EDUCATION & LEARNING \u2022 CENTRE \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: hrsAgo(11),
    description: "<p>Structured PSLE preparation programme with small-group classes, weekly assessments, and exam techniques coaching.</p>",
    keyDetails: [
      { key: "Course",   value: "PSLE Preparation" },
      { key: "Duration", value: "Ongoing, monthly" },
    ],
    goodToKnow: [
      { key: "Batch Size", value: "Max 8 students" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.eduLearnSG,
  },
  {
    id: "svc-sg-edu-02", href: "/listings/svc-sg-edu-02", advId: "33042",
    images: [{ src: img(1), alt: "O-Level coaching" }],
    priceLabel: "S$450", priceSuffix: "/ mo",
    title: "O-Level Science Coaching \u2014 Weekend Batch",
    detailsLabel: "EDUCATION & LEARNING \u2022 CENTRE \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Weekend O-Level science coaching batch covering Physics, Chemistry, and Biology with topical worksheets.</p>",
    keyDetails: [
      { key: "Course",   value: "O-Level Science" },
      { key: "Schedule", value: "Weekends only"    },
    ],
    goodToKnow: [
      { key: "Batch Size", value: "Max 10 students" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.eduLearnSG,
  },
];

// ── travel_tourism ────────────────────────────────────────────────────────────
export const SG_SERVICES_TRAVEL: MockListing[] = [
  {
    id: "svc-sg-travel-01", href: "/listings/svc-sg-travel-01", advId: "33051",
    images: [{ src: img(2), alt: "Bali holiday" }],
    priceLabel: "S$680", priceSuffix: "/ package",
    title: "4D3N Bali Getaway \u2014 Hotel + Sightseeing Included",
    detailsLabel: "TRAVEL & TOURISM \u2022 AGENCY \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>4 days, 3 nights Bali package including 4-star hotel stay, breakfast, airport transfers, and Ubud/Seminyak sightseeing.</p>",
    keyDetails: [
      { key: "Duration", value: "4D3N" },
      { key: "Includes", value: "Hotel, transfers, sightseeing" },
    ],
    goodToKnow: [
      { key: "Group Size", value: "2-6 persons" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8560 },
    seller: SELLERS.wanderSG,
  },
  {
    id: "svc-sg-travel-02", href: "/listings/svc-sg-travel-02", advId: "33052",
    images: [{ src: img(3), alt: "Bangkok tour" }],
    priceLabel: "S$520", priceSuffix: "/ package",
    title: "3D2N Bangkok Shopping & Food Tour",
    detailsLabel: "TRAVEL & TOURISM \u2022 AGENCY \u2022 SINGAPORE",
    locationLabel: "Bugis, Singapore",
    postedAt: daysAgo(2),
    description: "<p>3 days, 2 nights Bangkok package focused on shopping districts and street food tours, with hotel and transfers included.</p>",
    keyDetails: [
      { key: "Duration", value: "3D2N" },
      { key: "Includes", value: "Hotel, transfers, guided tour" },
    ],
    goodToKnow: [
      { key: "Group Size", value: "2-8 persons" },
    ],
    coordinates: { lat: 1.3006, lng: 103.8560 },
    seller: SELLERS.wanderSG,
  },
];

// ── food_dining ───────────────────────────────────────────────────────────────
export const SG_SERVICES_FOOD: MockListing[] = [
  {
    id: "svc-sg-food-01", href: "/listings/svc-sg-food-01", advId: "33061",
    images: [{ src: img(4), alt: "Home cooked meals" }],
    priceLabel: "S$280", priceSuffix: "/ mo",
    title: "Daily Home-Cooked Peranakan Meals \u2014 Monthly Plan",
    detailsLabel: "FOOD & DINING \u2022 HOME CHEF \u2022 SINGAPORE",
    locationLabel: "Katong, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Fresh home-cooked Peranakan meals, delivered daily for lunch and dinner. Monthly subscription with weekend rest days.</p>",
    keyDetails: [
      { key: "Cuisine",  value: "Peranakan" },
      { key: "Delivery", value: "Lunch + Dinner" },
    ],
    goodToKnow: [
      { key: "Trial", value: "1-day trial available" },
    ],
    coordinates: { lat: 1.3037, lng: 103.9036 },
    seller: SELLERS.homeCookSG,
  },
  {
    id: "svc-sg-food-02", href: "/listings/svc-sg-food-02", advId: "33062",
    images: [{ src: img(5), alt: "Catering service" }],
    priceLabel: "S$18", priceSuffix: "/ pax",
    title: "Home Catering for Small Events \u2014 Peranakan & Local Menus",
    detailsLabel: "FOOD & DINING \u2022 CATERING \u2022 SINGAPORE",
    locationLabel: "Katong, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Catering for birthdays and small gatherings up to 40 guests. Customisable Peranakan and local Singaporean menus.</p>",
    keyDetails: [
      { key: "Min. Order", value: "20 pax" },
    ],
    goodToKnow: [
      { key: "Notice", value: "48 hours advance booking" },
    ],
    coordinates: { lat: 1.3037, lng: 103.9036 },
    seller: SELLERS.homeCookSG,
  },
];

// ── tech_gadgets ──────────────────────────────────────────────────────────────
export const SG_SERVICES_TECH: MockListing[] = [
  {
    id: "svc-sg-tech-01", href: "/listings/svc-sg-tech-01", advId: "33071",
    images: [{ src: img(6), alt: "Laptop repair" }],
    priceLabel: "S$60", priceSuffix: "/ visit",
    title: "Laptop & Mobile Repair \u2014 Doorstep Service, Singapore",
    detailsLabel: "TECH & GADGETS \u2022 CERTIFIED \u2022 SINGAPORE",
    locationLabel: "Sim Lim Square, Singapore",
    postedAt: hrsAgo(8),
    description: "<p>Screen replacement, battery swap, and software troubleshooting for laptops and smartphones \u2014 doorstep diagnosis and repair island-wide.</p>",
    keyDetails: [
      { key: "Service Type", value: "Repair & diagnostics" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "30 days on repair" },
    ],
    coordinates: { lat: 1.3032, lng: 103.8500 },
    seller: SELLERS.techFixSG,
  },
  {
    id: "svc-sg-tech-02", href: "/listings/svc-sg-tech-02", advId: "33072",
    images: [{ src: img(7), alt: "Smart home setup" }],
    priceLabel: "S$180", priceSuffix: "/ job",
    title: "Smart Home Setup \u2014 WiFi Cameras, Smart Lights, Google Home",
    detailsLabel: "TECH & GADGETS \u2022 CERTIFIED \u2022 SINGAPORE",
    locationLabel: "Sim Lim Square, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Full smart home installation covering WiFi cameras, smart plugs, and Google Home/Alexa integration.</p>",
    keyDetails: [
      { key: "Service Type", value: "Smart home setup" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "90 days on installation" },
    ],
    coordinates: { lat: 1.3032, lng: 103.8500 },
    seller: SELLERS.techFixSG,
  },
];

// ── other_services ────────────────────────────────────────────────────────────
export const SG_SERVICES_OTHER: MockListing[] = [
  {
    id: "svc-sg-other-01", href: "/listings/svc-sg-other-01", advId: "33081",
    images: [{ src: img(8), alt: "Painting service" }],
    priceLabel: "S$3", priceSuffix: "/ sq.ft",
    title: "Home Painting Service \u2014 Interior & Exterior, Singapore",
    detailsLabel: "OTHER SERVICES \u2022 EXPERIENCED \u2022 SINGAPORE",
    locationLabel: "Ang Mo Kio, Singapore",
    postedAt: hrsAgo(10),
    description: "<p>Complete home painting service including wall prep, filler work, and 2 coats of premium emulsion. Free colour consultation.</p>",
    keyDetails: [
      { key: "Service Type", value: "Painting" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "1 year on workmanship" },
    ],
    coordinates: { lat: 1.3691, lng: 103.8454 },
    seller: SELLERS.otherServicesSG,
  },
  {
    id: "svc-sg-other-02", href: "/listings/svc-sg-other-02", advId: "33082",
    images: [{ src: img(9), alt: "Carpentry work" }],
    priceLabel: "S$60", priceSuffix: "/ hr",
    title: "Carpentry & Furniture Repair \u2014 Home Visits",
    detailsLabel: "OTHER SERVICES \u2022 EXPERIENCED \u2022 SINGAPORE",
    locationLabel: "Ang Mo Kio, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Furniture repair, custom shelving, and door/window fitting services with own tools and materials sourced on request.</p>",
    keyDetails: [
      { key: "Service Type", value: "Carpentry" },
    ],
    goodToKnow: [
      { key: "Call-Out Fee", value: "Free with booking" },
    ],
    coordinates: { lat: 1.3691, lng: 103.8454 },
    seller: SELLERS.otherServicesSG,
  },
];

// ── wanted ────────────────────────────────────────────────────────────────────
export const SG_SERVICES_WANTED: MockListing[] = [
  {
    id: "svc-sg-want-01", href: "/listings/svc-sg-want-01", advId: "33091",
    images: [{ src: img(1), alt: "Wanted plumber" }],
    priceLabel: "Budget S$80", priceSuffix: "/ job",
    title: "WANTED: Reliable Plumber \u2014 Kitchen Sink Repair",
    detailsLabel: "WANTED \u2022 HOME SERVICES \u2022 SINGAPORE",
    locationLabel: "Clementi, Singapore",
    postedAt: hrsAgo(13),
    description: "<p>Looking for an experienced plumber to fix a leaking kitchen sink and replace a tap. Budget around S$80, available this week.</p>",
    keyDetails: [
      { key: "Budget",   value: "S$80 approx." },
      { key: "Timeline", value: "This week"     },
    ],
    goodToKnow: [
      { key: "Contact", value: "Message via LokalAds" },
    ],
    coordinates: { lat: 1.3151, lng: 103.7649 },
    seller: SELLERS.wantedServiceSeekerSG,
  },
  {
    id: "svc-sg-want-02", href: "/listings/svc-sg-want-02", advId: "33092",
    images: [{ src: img(2), alt: "Wanted maths tutor" }],
    priceLabel: "Budget S$50/hr", priceSuffix: "/ hr",
    title: "WANTED: Weekend Maths Tutor for Secondary 2 Student",
    detailsLabel: "WANTED \u2022 TUTORING \u2022 SINGAPORE",
    locationLabel: "Clementi, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Seeking a patient maths tutor for weekend sessions for a Secondary 2 student. Budget around S$50/hr.</p>",
    keyDetails: [
      { key: "Budget",  value: "S$50/hr approx." },
      { key: "Subject", value: "Maths, Sec 2"    },
    ],
    goodToKnow: [
      { key: "Contact", value: "Message via LokalAds" },
    ],
    coordinates: { lat: 1.3151, lng: 103.7649 },
    seller: SELLERS.wantedServiceSeekerSG,
  },
];

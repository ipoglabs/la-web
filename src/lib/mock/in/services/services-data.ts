import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── home_services ─────────────────────────────────────────────────────────────
export const IN_SERVICES_HOME: MockListing[] = [
  {
    id: "svc-in-home-01", href: "/listings/svc-in-home-01", advId: "23001",
    images: [{ src: img(1), alt: "Electrician at work" }],
    priceLabel: "\u20b9299", priceSuffix: "/ visit",
    title: "Certified Electrician \u2014 Same-Day Callouts, Bengaluru",
    detailsLabel: "HOME SERVICES \u2022 CERTIFIED \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: hrsAgo(3),
    description: "<p>Verified electricians for wiring, switchboard repairs, and fan/light installation. Same-day service across Bengaluru with upfront pricing.</p><ul><li>Wiring & rewiring</li><li>Switchboard & MCB repair</li><li>Fan/AC point installation</li></ul>",
    keyDetails: [
      { key: "Service Type",  value: "Electrical repair"  },
      { key: "Coverage",      value: "All Bengaluru"      },
      { key: "Availability",  value: "Mon-Sun 8am-8pm"    },
      { key: "Response Time", value: "Same day"           },
    ],
    goodToKnow: [
      { key: "Call-Out Fee", value: "\u20b9 free with booking" },
      { key: "Payment",      value: "UPI / Cash / Card"   },
      { key: "Reviews",      value: "4.7 \u2605 (860 reviews)" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.urbanHome,
  },
  {
    id: "svc-in-home-02", href: "/listings/svc-in-home-02", advId: "23002",
    images: [{ src: img(2), alt: "Deep cleaning service" }],
    priceLabel: "\u20b91,499", priceSuffix: "/ job",
    title: "Deep Home Cleaning \u2014 2BHK/3BHK, Trained Staff",
    detailsLabel: "HOME SERVICES \u2022 VERIFIED \u2022 BENGALURU",
    locationLabel: "Indiranagar, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Professional deep-cleaning for kitchens, bathrooms, and living areas. Background-verified staff with own equipment and eco-friendly cleaning agents.</p>",
    keyDetails: [
      { key: "Service Type", value: "Deep cleaning"   },
      { key: "Coverage",     value: "Bengaluru city"  },
      { key: "Duration",     value: "3-4 hours"       },
    ],
    goodToKnow: [
      { key: "Payment", value: "UPI / Cash" },
      { key: "Reviews", value: "4.6 \u2605 (520 reviews)" },
    ],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    seller: SELLERS.urbanHome,
  },
];

// ── business_services ────────────────────────────────────────────────────────
export const IN_SERVICES_BUSINESS: MockListing[] = [
  {
    id: "svc-in-biz-01", href: "/listings/svc-in-biz-01", advId: "23011",
    images: [{ src: img(3), alt: "Accounting office" }],
    priceLabel: "\u20b95,000", priceSuffix: "/ mo",
    title: "GST Filing & Accounting \u2014 Monthly Retainer for SMEs",
    detailsLabel: "BUSINESS SERVICES \u2022 CA-BACKED \u2022 MUMBAI",
    locationLabel: "Nariman Point, Mumbai",
    postedAt: hrsAgo(5),
    description: "<p>Monthly GST return filing, bookkeeping, and TDS compliance for small businesses. CA-backed team with 10+ years serving Mumbai SMEs.</p>",
    keyDetails: [
      { key: "Service Type", value: "GST & accounting"  },
      { key: "Coverage",     value: "Pan-India, remote" },
      { key: "Team",         value: "CA-led, 6 staff"   },
    ],
    goodToKnow: [
      { key: "Contract", value: "Monthly, cancel anytime" },
      { key: "Reviews",  value: "4.8 \u2605 (140 reviews)" },
    ],
    coordinates: { lat: 18.9256, lng: 72.8242 },
    seller: SELLERS.bizConsult,
  },
  {
    id: "svc-in-biz-02", href: "/listings/svc-in-biz-02", advId: "23012",
    images: [{ src: img(4), alt: "Company registration" }],
    priceLabel: "\u20b912,000", priceSuffix: "/ job",
    title: "Private Limited Company Registration \u2014 End-to-End",
    detailsLabel: "BUSINESS SERVICES \u2022 MCA-COMPLIANT \u2022 MUMBAI",
    locationLabel: "Nariman Point, Mumbai",
    postedAt: daysAgo(2),
    description: "<p>Complete Pvt Ltd company incorporation service \u2014 DIN, DSC, MOA/AOA drafting, and MCA filing. Turnaround in 10-15 working days.</p>",
    keyDetails: [
      { key: "Service Type", value: "Company registration" },
      { key: "Turnaround",   value: "10-15 working days"   },
    ],
    goodToKnow: [
      { key: "Includes", value: "Govt. fees extra" },
    ],
    coordinates: { lat: 18.9256, lng: 72.8242 },
    seller: SELLERS.bizConsult,
  },
];

// ── health_fitness ────────────────────────────────────────────────────────────
export const IN_SERVICES_HEALTH_FITNESS: MockListing[] = [
  {
    id: "svc-in-health-01", href: "/listings/svc-in-health-01", advId: "23021",
    images: [{ src: img(5), alt: "Personal trainer session" }],
    priceLabel: "\u20b9800", priceSuffix: "/ session",
    title: "Certified Personal Trainer \u2014 Home & Gym Sessions",
    detailsLabel: "HEALTH & FITNESS \u2022 CERTIFIED \u2022 BENGALURU",
    locationLabel: "HSR Layout, Bengaluru",
    postedAt: hrsAgo(7),
    description: "<p>ACE-certified personal trainer offering strength training, weight-loss programmes, and home visits across HSR Layout and nearby areas.</p>",
    keyDetails: [
      { key: "Service Type", value: "Personal training" },
      { key: "Qualification",value: "ACE Certified"     },
    ],
    goodToKnow: [
      { key: "Package", value: "12-session packs discounted" },
      { key: "Reviews", value: "4.9 \u2605 (95 reviews)" },
    ],
    coordinates: { lat: 12.9121, lng: 77.6446 },
    seller: SELLERS.fitZonePT,
  },
  {
    id: "svc-in-health-02", href: "/listings/svc-in-health-02", advId: "23022",
    images: [{ src: img(6), alt: "Yoga session" }],
    priceLabel: "\u20b9500", priceSuffix: "/ session",
    title: "Home Yoga Instructor \u2014 Beginners to Advanced",
    detailsLabel: "HEALTH & FITNESS \u2022 CERTIFIED \u2022 BENGALURU",
    locationLabel: "HSR Layout, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>RYT-200 certified yoga instructor offering home sessions covering Hatha, Vinyasa, and breathing techniques for all levels.</p>",
    keyDetails: [
      { key: "Service Type", value: "Yoga instruction" },
      { key: "Qualification",value: "RYT-200 Certified" },
    ],
    goodToKnow: [
      { key: "Package", value: "Monthly packages available" },
    ],
    coordinates: { lat: 12.9121, lng: 77.6446 },
    seller: SELLERS.fitZonePT,
  },
];

// ── tutoring ──────────────────────────────────────────────────────────────────
export const IN_SERVICES_TUTORING: MockListing[] = [
  {
    id: "svc-in-tutor-01", href: "/listings/svc-in-tutor-01", advId: "23031",
    images: [{ src: img(7), alt: "Physics tutoring" }],
    priceLabel: "\u20b9600", priceSuffix: "/ hr",
    title: "Physics & Chemistry Tutor \u2014 CBSE/ICSE Class 9-12",
    detailsLabel: "TUTORING \u2022 EXPERIENCED \u2022 CHENNAI",
    locationLabel: "Adyar, Chennai",
    postedAt: hrsAgo(9),
    description: "<p>10 years of experience teaching Physics and Chemistry for CBSE/ICSE board exams. Home visits or online sessions available.</p>",
    keyDetails: [
      { key: "Subjects",  value: "Physics, Chemistry" },
      { key: "Board",     value: "CBSE / ICSE"        },
      { key: "Experience",value: "10 years"           },
    ],
    goodToKnow: [
      { key: "Mode", value: "Home visit or online" },
    ],
    coordinates: { lat: 13.0012, lng: 80.2565 },
    seller: SELLERS.tutorPro,
  },
  {
    id: "svc-in-tutor-02", href: "/listings/svc-in-tutor-02", advId: "23032",
    images: [{ src: img(8), alt: "English tutoring" }],
    priceLabel: "\u20b9450", priceSuffix: "/ hr",
    title: "Spoken English & Grammar Tutor \u2014 All Ages",
    detailsLabel: "TUTORING \u2022 EXPERIENCED \u2022 CHENNAI",
    locationLabel: "Adyar, Chennai",
    postedAt: daysAgo(2),
    description: "<p>Spoken English and grammar coaching for school students and working professionals. Flexible scheduling, online or in-person.</p>",
    keyDetails: [
      { key: "Subjects", value: "Spoken English, Grammar" },
    ],
    goodToKnow: [
      { key: "Mode", value: "Home visit or online" },
    ],
    coordinates: { lat: 13.0012, lng: 80.2565 },
    seller: SELLERS.tutorPro,
  },
];

// ── education_learning ────────────────────────────────────────────────────────
export const IN_SERVICES_EDUCATION: MockListing[] = [
  {
    id: "svc-in-edu-01", href: "/listings/svc-in-edu-01", advId: "23041",
    images: [{ src: img(9), alt: "JEE coaching batch" }],
    priceLabel: "\u20b945,000", priceSuffix: "/ yr",
    title: "JEE Main & Advanced Coaching \u2014 Structured Yearly Batch",
    detailsLabel: "EDUCATION & LEARNING \u2022 INSTITUTE \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: hrsAgo(11),
    description: "<p>Comprehensive yearly JEE coaching batch with weekly tests, doubt-clearing sessions, and study material included.</p>",
    keyDetails: [
      { key: "Course",   value: "JEE Main & Advanced" },
      { key: "Duration", value: "12 months"           },
    ],
    goodToKnow: [
      { key: "Batch Size", value: "Max 30 students" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.eduLearn,
  },
  {
    id: "svc-in-edu-02", href: "/listings/svc-in-edu-02", advId: "23042",
    images: [{ src: img(1), alt: "NEET coaching" }],
    priceLabel: "\u20b950,000", priceSuffix: "/ yr",
    title: "NEET Biology & Chemistry Coaching \u2014 Weekend Batch",
    detailsLabel: "EDUCATION & LEARNING \u2022 INSTITUTE \u2022 PUNE",
    locationLabel: "Kothrud, Pune",
    postedAt: daysAgo(3),
    description: "<p>Weekend-only NEET coaching batch covering Biology and Chemistry with mock tests every fortnight.</p>",
    keyDetails: [
      { key: "Course",   value: "NEET" },
      { key: "Schedule", value: "Weekends only" },
    ],
    goodToKnow: [
      { key: "Batch Size", value: "Max 25 students" },
    ],
    coordinates: { lat: 18.5074, lng: 73.8077 },
    seller: SELLERS.eduLearn,
  },
];

// ── travel_tourism ────────────────────────────────────────────────────────────
export const IN_SERVICES_TRAVEL: MockListing[] = [
  {
    id: "svc-in-travel-01", href: "/listings/svc-in-travel-01", advId: "23051",
    images: [{ src: img(2), alt: "Goa beach tour" }],
    priceLabel: "\u20b915,000", priceSuffix: "/ package",
    title: "4N/5D Goa Holiday Package \u2014 Hotel + Sightseeing Included",
    detailsLabel: "TRAVEL & TOURISM \u2022 AGENCY \u2022 GOA",
    locationLabel: "Panjim, Goa",
    postedAt: hrsAgo(6),
    description: "<p>4 nights, 5 days Goa package including 3-star hotel stay, breakfast, airport transfers, and North/South Goa sightseeing.</p>",
    keyDetails: [
      { key: "Duration",  value: "4N/5D"        },
      { key: "Includes",  value: "Hotel, transfers, sightseeing" },
    ],
    goodToKnow: [
      { key: "Group Size", value: "2-6 persons" },
    ],
    coordinates: { lat: 15.4909, lng: 73.8278 },
    seller: SELLERS.wanderIndia,
  },
  {
    id: "svc-in-travel-02", href: "/listings/svc-in-travel-02", advId: "23052",
    images: [{ src: img(3), alt: "Kerala backwater tour" }],
    priceLabel: "\u20b922,000", priceSuffix: "/ package",
    title: "3N/4D Kerala Backwaters Tour \u2014 Houseboat Stay Included",
    detailsLabel: "TRAVEL & TOURISM \u2022 AGENCY \u2022 KERALA",
    locationLabel: "Panjim, Goa",
    postedAt: daysAgo(2),
    description: "<p>3 nights, 4 days Kerala tour with one night on a traditional houseboat in Alleppey plus Munnar hill station stay.</p>",
    keyDetails: [
      { key: "Duration", value: "3N/4D" },
      { key: "Includes", value: "Houseboat, hotel, transfers" },
    ],
    goodToKnow: [
      { key: "Group Size", value: "2-8 persons" },
    ],
    coordinates: { lat: 15.4909, lng: 73.8278 },
    seller: SELLERS.wanderIndia,
  },
];

// ── food_dining ───────────────────────────────────────────────────────────────
export const IN_SERVICES_FOOD: MockListing[] = [
  {
    id: "svc-in-food-01", href: "/listings/svc-in-food-01", advId: "23061",
    images: [{ src: img(4), alt: "Tiffin delivery" }],
    priceLabel: "\u20b93,500", priceSuffix: "/ mo",
    title: "Daily Home-Cooked Tiffin \u2014 North Indian Veg, Monthly Plan",
    detailsLabel: "FOOD & DINING \u2022 HOME CHEF \u2022 DELHI",
    locationLabel: "Malviya Nagar, Delhi",
    postedAt: hrsAgo(4),
    description: "<p>Fresh home-cooked North Indian vegetarian tiffin, delivered daily for lunch and dinner. Monthly subscription with Sunday off.</p>",
    keyDetails: [
      { key: "Cuisine",  value: "North Indian, Veg" },
      { key: "Delivery", value: "Lunch + Dinner"    },
    ],
    goodToKnow: [
      { key: "Trial", value: "1-day trial available" },
    ],
    coordinates: { lat: 28.5355, lng: 77.2093 },
    seller: SELLERS.tiffinWala,
  },
  {
    id: "svc-in-food-02", href: "/listings/svc-in-food-02", advId: "23062",
    images: [{ src: img(5), alt: "Catering service" }],
    priceLabel: "\u20b9250", priceSuffix: "/ plate",
    title: "Home Catering for Small Events \u2014 Veg & Non-Veg Menus",
    detailsLabel: "FOOD & DINING \u2022 CATERING \u2022 DELHI",
    locationLabel: "Malviya Nagar, Delhi",
    postedAt: daysAgo(3),
    description: "<p>Catering for birthdays, kitty parties, and small gatherings up to 50 guests. Customisable veg and non-veg menus.</p>",
    keyDetails: [
      { key: "Min. Order", value: "20 plates" },
    ],
    goodToKnow: [
      { key: "Notice", value: "48 hours advance booking" },
    ],
    coordinates: { lat: 28.5355, lng: 77.2093 },
    seller: SELLERS.tiffinWala,
  },
];

// ── tech_gadgets ──────────────────────────────────────────────────────────────
export const IN_SERVICES_TECH: MockListing[] = [
  {
    id: "svc-in-tech-01", href: "/listings/svc-in-tech-01", advId: "23071",
    images: [{ src: img(6), alt: "Laptop repair" }],
    priceLabel: "\u20b9399", priceSuffix: "/ visit",
    title: "Laptop & Mobile Repair \u2014 Doorstep Service, Noida",
    detailsLabel: "TECH & GADGETS \u2022 CERTIFIED \u2022 NOIDA",
    locationLabel: "Sector 18, Noida",
    postedAt: hrsAgo(8),
    description: "<p>Screen replacement, battery swap, and software troubleshooting for laptops and smartphones \u2014 doorstep diagnosis and repair.</p>",
    keyDetails: [
      { key: "Service Type", value: "Repair & diagnostics" },
      { key: "Response Time", value: "Same day"           },
    ],
    goodToKnow: [
      { key: "Warranty", value: "30 days on repair" },
    ],
    coordinates: { lat: 28.5697, lng: 77.3260 },
    seller: SELLERS.techFixIndia,
  },
  {
    id: "svc-in-tech-02", href: "/listings/svc-in-tech-02", advId: "23072",
    images: [{ src: img(7), alt: "Smart home setup" }],
    priceLabel: "\u20b91,200", priceSuffix: "/ job",
    title: "Smart Home Setup \u2014 WiFi Cameras, Smart Lights, Alexa",
    detailsLabel: "TECH & GADGETS \u2022 CERTIFIED \u2022 NOIDA",
    locationLabel: "Sector 18, Noida",
    postedAt: daysAgo(1),
    description: "<p>Full smart home installation covering WiFi cameras, smart plugs, and Alexa/Google Home integration.</p>",
    keyDetails: [
      { key: "Service Type", value: "Smart home setup" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "90 days on installation" },
    ],
    coordinates: { lat: 28.5697, lng: 77.3260 },
    seller: SELLERS.techFixIndia,
  },
];

// ── other_services ────────────────────────────────────────────────────────────
export const IN_SERVICES_OTHER: MockListing[] = [
  {
    id: "svc-in-other-01", href: "/listings/svc-in-other-01", advId: "23081",
    images: [{ src: img(8), alt: "Painting service" }],
    priceLabel: "\u20b915", priceSuffix: "/ sq.ft",
    title: "Home Painting Service \u2014 Interior & Exterior, Delhi NCR",
    detailsLabel: "OTHER SERVICES \u2022 EXPERIENCED \u2022 DELHI",
    locationLabel: "Rajouri Garden, Delhi",
    postedAt: hrsAgo(10),
    description: "<p>Complete home painting service including wall prep, putty, and 2 coats of premium emulsion. Free colour consultation.</p>",
    keyDetails: [
      { key: "Service Type", value: "Painting" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "1 year on workmanship" },
    ],
    coordinates: { lat: 28.6469, lng: 77.1201 },
    seller: SELLERS.otherServicesProvider,
  },
  {
    id: "svc-in-other-02", href: "/listings/svc-in-other-02", advId: "23082",
    images: [{ src: img(9), alt: "Carpentry work" }],
    priceLabel: "\u20b9500", priceSuffix: "/ hr",
    title: "Carpentry & Furniture Repair \u2014 Home Visits",
    detailsLabel: "OTHER SERVICES \u2022 EXPERIENCED \u2022 DELHI",
    locationLabel: "Rajouri Garden, Delhi",
    postedAt: daysAgo(2),
    description: "<p>Furniture repair, custom shelving, and door/window fitting services with own tools and materials sourced on request.</p>",
    keyDetails: [
      { key: "Service Type", value: "Carpentry" },
    ],
    goodToKnow: [
      { key: "Call-Out Fee", value: "Free with booking" },
    ],
    coordinates: { lat: 28.6469, lng: 77.1201 },
    seller: SELLERS.otherServicesProvider,
  },
];

// ── wanted ────────────────────────────────────────────────────────────────────
export const IN_SERVICES_WANTED: MockListing[] = [
  {
    id: "svc-in-want-01", href: "/listings/svc-in-want-01", advId: "23091",
    images: [{ src: img(1), alt: "Wanted plumber" }],
    priceLabel: "Budget \u20b9800", priceSuffix: "/ job",
    title: "WANTED: Reliable Plumber \u2014 Bathroom Leak Repair",
    detailsLabel: "WANTED \u2022 HOME SERVICES \u2022 HYDERABAD",
    locationLabel: "Jubilee Hills, Hyderabad",
    postedAt: hrsAgo(13),
    description: "<p>Looking for an experienced plumber to fix a bathroom leak and replace a tap. Budget around \u20b9800, available for a visit this week.</p>",
    keyDetails: [
      { key: "Budget",   value: "\u20b9800 approx." },
      { key: "Timeline", value: "This week"     },
    ],
    goodToKnow: [
      { key: "Contact", value: "Message via LokalAds" },
    ],
    coordinates: { lat: 17.4326, lng: 78.4071 },
    seller: SELLERS.wantedServiceSeeker,
  },
  {
    id: "svc-in-want-02", href: "/listings/svc-in-want-02", advId: "23092",
    images: [{ src: img(2), alt: "Wanted maths tutor" }],
    priceLabel: "Budget \u20b9400/hr", priceSuffix: "/ hr",
    title: "WANTED: Weekend Maths Tutor for Class 8 Student",
    detailsLabel: "WANTED \u2022 TUTORING \u2022 HYDERABAD",
    locationLabel: "Jubilee Hills, Hyderabad",
    postedAt: daysAgo(1),
    description: "<p>Seeking a patient maths tutor for weekend sessions for a Class 8 student following CBSE syllabus. Budget around \u20b9400/hr.</p>",
    keyDetails: [
      { key: "Budget",  value: "\u20b9400/hr approx." },
      { key: "Subject", value: "Maths, Class 8"  },
    ],
    goodToKnow: [
      { key: "Contact", value: "Message via LokalAds" },
    ],
    coordinates: { lat: 17.4326, lng: 78.4071 },
    seller: SELLERS.wantedServiceSeeker,
  },
];

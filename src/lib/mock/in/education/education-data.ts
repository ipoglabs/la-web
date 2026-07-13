import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── tutors ──────────────────────────────────────────────────────────────────────
export const IN_EDU_TUTORS: MockListing[] = [
  {
    id: "edu-in-tutors-01", href: "/listings/edu-in-tutors-01", advId: "28001",
    images: [{ src: img(1), alt: "Maths tutor" }],
    priceLabel: "\u20b9800", priceSuffix: "/ hr",
    title: "Maths & Science Tutor \u2014 Grades 6-10, Home Visits Available",
    detailsLabel: "TUTOR \u2022 MATHS & SCIENCE \u2022 BENGALURU",
    locationLabel: "Malleswaram, Bengaluru",
    postedAt: hrsAgo(3),
    description: "<p>Experienced private tutor for Maths and Science, grades 6-10. Home visits available within 5km, online sessions also offered.</p>",
    keyDetails: [
      { key: "Subjects", value: "Maths & Science" },
      { key: "Grades", value: "6-10" },
    ],
    goodToKnow: [
      { key: "Mode", value: "Home visit or online" },
    ],
    coordinates: { lat: 13.0037, lng: 77.5730 },
    seller: SELLERS.mathsTutorIndia,
  },
  {
    id: "edu-in-tutors-02", href: "/listings/edu-in-tutors-02", advId: "28002",
    images: [{ src: img(2), alt: "English tutor" }],
    priceLabel: "\u20b9600", priceSuffix: "/ hr",
    title: "Spoken English & Grammar Tutor \u2014 All Ages",
    detailsLabel: "TUTOR \u2022 ENGLISH \u2022 BENGALURU",
    locationLabel: "Malleswaram, Bengaluru",
    postedAt: daysAgo(1),
    description: "<p>Spoken English and grammar tutoring for students and working professionals looking to improve fluency and confidence.</p>",
    keyDetails: [
      { key: "Subject", value: "Spoken English" },
    ],
    goodToKnow: [
      { key: "Batch Size", value: "1-on-1 or small groups" },
    ],
    coordinates: { lat: 13.0037, lng: 77.5730 },
    seller: SELLERS.mathsTutorIndia,
  },
];

// ── online_courses ──────────────────────────────────────────────────────────────
export const IN_EDU_ONLINE_COURSES: MockListing[] = [
  {
    id: "edu-in-online-01", href: "/listings/edu-in-online-01", advId: "28011",
    images: [{ src: img(3), alt: "Web development course" }],
    priceLabel: "\u20b912,999",
    title: "Full-Stack Web Development Certification Course \u2014 6 Months",
    detailsLabel: "ONLINE COURSE \u2022 TECH \u2022 HYDERABAD",
    locationLabel: "HITEC City, Hyderabad",
    postedAt: hrsAgo(6),
    description: "<p>Comprehensive 6-month full-stack web development course covering React, Node.js, and databases. Includes certification on completion.</p>",
    keyDetails: [
      { key: "Duration", value: "6 months" },
      { key: "Certification", value: "Included" },
    ],
    goodToKnow: [
      { key: "Format", value: "Self-paced + live doubt sessions" },
    ],
    coordinates: { lat: 17.4483, lng: 78.3915 },
    seller: SELLERS.onlineCourseHubIndia,
  },
  {
    id: "edu-in-online-02", href: "/listings/edu-in-online-02", advId: "28012",
    images: [{ src: img(4), alt: "Digital marketing course" }],
    priceLabel: "\u20b97,999",
    title: "Digital Marketing Masterclass \u2014 3 Months, Beginner Friendly",
    detailsLabel: "ONLINE COURSE \u2022 BUSINESS \u2022 HYDERABAD",
    locationLabel: "HITEC City, Hyderabad",
    postedAt: daysAgo(2),
    description: "<p>Learn SEO, social media marketing, and paid ads in this beginner-friendly 3-month digital marketing course.</p>",
    keyDetails: [
      { key: "Duration", value: "3 months" },
    ],
    goodToKnow: [
      { key: "Level", value: "Beginner friendly" },
    ],
    coordinates: { lat: 17.4483, lng: 78.3915 },
    seller: SELLERS.onlineCourseHubIndia,
  },
];

// ── study_materials ──────────────────────────────────────────────────────────────
export const IN_EDU_STUDY_MATERIALS: MockListing[] = [
  {
    id: "edu-in-materials-01", href: "/listings/edu-in-materials-01", advId: "28021",
    images: [{ src: img(5), alt: "NCERT books set" }],
    priceLabel: "\u20b91,200",
    title: "NCERT Textbook Set \u2014 Grade 10, All Subjects, Like New",
    detailsLabel: "STUDY MATERIALS \u2022 TEXTBOOKS \u2022 CHENNAI",
    locationLabel: "Nungambakkam, Chennai",
    postedAt: hrsAgo(9),
    description: "<p>Complete set of NCERT textbooks for Grade 10, covering all subjects. Used for one year, in like-new condition with no markings.</p>",
    keyDetails: [
      { key: "Grade", value: "10" },
      { key: "Condition", value: "Like new" },
    ],
    goodToKnow: [
      { key: "Includes", value: "All 5 core subjects" },
    ],
    coordinates: { lat: 13.0569, lng: 80.2425 },
    seller: SELLERS.studyMaterialsIndia,
  },
  {
    id: "edu-in-materials-02", href: "/listings/edu-in-materials-02", advId: "28022",
    images: [{ src: img(6), alt: "JEE prep books" }],
    priceLabel: "\u20b92,500",
    title: "JEE Main & Advanced Prep Books \u2014 Complete Set",
    detailsLabel: "STUDY MATERIALS \u2022 EXAM PREP \u2022 CHENNAI",
    locationLabel: "Nungambakkam, Chennai",
    postedAt: daysAgo(3),
    description: "<p>Complete set of JEE Main and Advanced preparation books including Physics, Chemistry, and Maths modules with solved papers.</p>",
    keyDetails: [
      { key: "Exam", value: "JEE Main & Advanced" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Solved previous year papers" },
    ],
    coordinates: { lat: 13.0569, lng: 80.2425 },
    seller: SELLERS.studyMaterialsIndia,
  },
];

// ── schools_colleges ──────────────────────────────────────────────────────────────
export const IN_EDU_SCHOOLS_COLLEGES: MockListing[] = [
  {
    id: "edu-in-schools-01", href: "/listings/edu-in-schools-01", advId: "28031",
    images: [{ src: img(7), alt: "Admissions counselling" }],
    priceLabel: "\u20b95,000", priceSuffix: "/ session",
    title: "School Admissions Counselling \u2014 Nursery to Grade 8",
    detailsLabel: "SCHOOLS & COLLEGES \u2022 ADMISSIONS \u2022 KOLKATA",
    locationLabel: "Salt Lake, Kolkata",
    postedAt: hrsAgo(11),
    description: "<p>Guidance through the school admissions process for Nursery to Grade 8, including shortlisting, interview prep, and form filling assistance.</p>",
    keyDetails: [
      { key: "Levels", value: "Nursery to Grade 8" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Interview preparation" },
    ],
    coordinates: { lat: 22.5726, lng: 88.4172 },
    seller: SELLERS.admissionsCounsellorIndia,
  },
  {
    id: "edu-in-schools-02", href: "/listings/edu-in-schools-02", advId: "28032",
    images: [{ src: img(8), alt: "College application help" }],
    priceLabel: "\u20b98,000", priceSuffix: "/ package",
    title: "College Application & SOP Writing Assistance",
    detailsLabel: "SCHOOLS & COLLEGES \u2022 ADMISSIONS \u2022 KOLKATA",
    locationLabel: "Salt Lake, Kolkata",
    postedAt: daysAgo(4),
    description: "<p>Complete college application assistance including statement of purpose writing, form filling, and mock interview practice.</p>",
    keyDetails: [
      { key: "Includes", value: "SOP + mock interviews" },
    ],
    goodToKnow: [
      { key: "Turnaround", value: "2 weeks" },
    ],
    coordinates: { lat: 22.5726, lng: 88.4172 },
    seller: SELLERS.admissionsCounsellorIndia,
  },
];

// ── language_classes ──────────────────────────────────────────────────────────────
export const IN_EDU_LANGUAGE_CLASSES: MockListing[] = [
  {
    id: "edu-in-language-01", href: "/listings/edu-in-language-01", advId: "28041",
    images: [{ src: img(9), alt: "French class" }],
    priceLabel: "\u20b96,500", priceSuffix: "/ term",
    title: "French Language Classes \u2014 Beginner to Intermediate",
    detailsLabel: "LANGUAGE CLASS \u2022 FRENCH \u2022 DELHI",
    locationLabel: "Vasant Vihar, Delhi",
    postedAt: hrsAgo(14),
    description: "<p>3-month French language course covering beginner to intermediate levels, taught by certified native-level instructors.</p>",
    keyDetails: [
      { key: "Level", value: "Beginner to Intermediate" },
      { key: "Duration", value: "3 months" },
    ],
    goodToKnow: [
      { key: "Batch Size", value: "Max 10 students" },
    ],
    coordinates: { lat: 28.5605, lng: 77.1589 },
    seller: SELLERS.languageClassesIndia,
  },
  {
    id: "edu-in-language-02", href: "/listings/edu-in-language-02", advId: "28042",
    images: [{ src: img(1), alt: "Japanese class" }],
    priceLabel: "\u20b98,000", priceSuffix: "/ term",
    title: "Japanese Language Classes \u2014 JLPT N5 Preparation",
    detailsLabel: "LANGUAGE CLASS \u2022 JAPANESE \u2022 DELHI",
    locationLabel: "Vasant Vihar, Delhi",
    postedAt: daysAgo(5),
    description: "<p>Japanese language course focused on JLPT N5 exam preparation, covering reading, writing, and conversational basics.</p>",
    keyDetails: [
      { key: "Focus", value: "JLPT N5 preparation" },
    ],
    goodToKnow: [
      { key: "Materials", value: "Included in course fee" },
    ],
    coordinates: { lat: 28.5605, lng: 77.1589 },
    seller: SELLERS.languageClassesIndia,
  },
];

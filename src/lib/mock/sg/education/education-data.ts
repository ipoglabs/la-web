import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── tutors ──────────────────────────────────────────────────────────────────────
export const SG_EDU_TUTORS: MockListing[] = [
  {
    id: "edu-sg-tutors-01", href: "/listings/edu-sg-tutors-01", advId: "38001",
    images: [{ src: img(1), alt: "Maths tutor" }],
    priceLabel: "S$60", priceSuffix: "/ hr",
    title: "Maths & Science Tutor \u2014 Primary to Secondary, Home Visits Available",
    detailsLabel: "TUTOR \u2022 MATHS & SCIENCE \u2022 SINGAPORE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: hrsAgo(3),
    description: "<p>Experienced private tutor for Maths and Science, Primary to Secondary levels. Home visits available, online sessions also offered.</p>",
    keyDetails: [
      { key: "Subjects", value: "Maths & Science" },
      { key: "Levels", value: "Primary to Secondary" },
    ],
    goodToKnow: [
      { key: "Mode", value: "Home visit or online" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.mathsTutorSG,
  },
  {
    id: "edu-sg-tutors-02", href: "/listings/edu-sg-tutors-02", advId: "38002",
    images: [{ src: img(2), alt: "English tutor" }],
    priceLabel: "S$50", priceSuffix: "/ hr",
    title: "English Composition & Grammar Tutor \u2014 All Ages",
    detailsLabel: "TUTOR \u2022 ENGLISH \u2022 SINGAPORE",
    locationLabel: "Bukit Timah, Singapore",
    postedAt: daysAgo(1),
    description: "<p>English composition and grammar tutoring for students and working professionals looking to improve fluency and confidence.</p>",
    keyDetails: [
      { key: "Subject", value: "English Composition" },
    ],
    goodToKnow: [
      { key: "Batch Size", value: "1-on-1 or small groups" },
    ],
    coordinates: { lat: 1.3294, lng: 103.8021 },
    seller: SELLERS.mathsTutorSG,
  },
];

// ── online_courses ──────────────────────────────────────────────────────────────
export const SG_EDU_ONLINE_COURSES: MockListing[] = [
  {
    id: "edu-sg-online-01", href: "/listings/edu-sg-online-01", advId: "38011",
    images: [{ src: img(3), alt: "Web development course" }],
    priceLabel: "S$1,200",
    title: "Full-Stack Web Development Certification Course \u2014 6 Months",
    detailsLabel: "ONLINE COURSE \u2022 TECH \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>Comprehensive 6-month full-stack web development course covering React, Node.js, and databases. Includes certification on completion.</p>",
    keyDetails: [
      { key: "Duration", value: "6 months" },
      { key: "Certification", value: "Included" },
    ],
    goodToKnow: [
      { key: "Format", value: "Self-paced + live doubt sessions" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.onlineCourseHubSG,
  },
  {
    id: "edu-sg-online-02", href: "/listings/edu-sg-online-02", advId: "38012",
    images: [{ src: img(4), alt: "Digital marketing course" }],
    priceLabel: "S$750",
    title: "Digital Marketing Masterclass \u2014 3 Months, Beginner Friendly",
    detailsLabel: "ONLINE COURSE \u2022 BUSINESS \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Learn SEO, social media marketing, and paid ads in this beginner-friendly 3-month digital marketing course.</p>",
    keyDetails: [
      { key: "Duration", value: "3 months" },
    ],
    goodToKnow: [
      { key: "Level", value: "Beginner friendly" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.onlineCourseHubSG,
  },
];

// ── study_materials ──────────────────────────────────────────────────────────────
export const SG_EDU_STUDY_MATERIALS: MockListing[] = [
  {
    id: "edu-sg-materials-01", href: "/listings/edu-sg-materials-01", advId: "38021",
    images: [{ src: img(5), alt: "Assessment books set" }],
    priceLabel: "S$80",
    title: "Primary 6 Assessment Book Set \u2014 All Subjects, Like New",
    detailsLabel: "STUDY MATERIALS \u2022 TEXTBOOKS \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>Complete set of Primary 6 assessment books, covering all subjects. Used for one year, in like-new condition with no markings.</p>",
    keyDetails: [
      { key: "Level", value: "Primary 6" },
      { key: "Condition", value: "Like new" },
    ],
    goodToKnow: [
      { key: "Includes", value: "All core subjects" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.studyMaterialsSG,
  },
  {
    id: "edu-sg-materials-02", href: "/listings/edu-sg-materials-02", advId: "38022",
    images: [{ src: img(6), alt: "A Level prep books" }],
    priceLabel: "S$150",
    title: "A Level H2 Maths & Physics Prep Books \u2014 Complete Set",
    detailsLabel: "STUDY MATERIALS \u2022 EXAM PREP \u2022 SINGAPORE",
    locationLabel: "Toa Payoh, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Complete set of A Level H2 Maths and Physics preparation books with ten-year series and solved papers.</p>",
    keyDetails: [
      { key: "Level", value: "A Level H2" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Ten-year series" },
    ],
    coordinates: { lat: 1.3343, lng: 103.8563 },
    seller: SELLERS.studyMaterialsSG,
  },
];

// ── schools_colleges ──────────────────────────────────────────────────────────────
export const SG_EDU_SCHOOLS_COLLEGES: MockListing[] = [
  {
    id: "edu-sg-schools-01", href: "/listings/edu-sg-schools-01", advId: "38031",
    images: [{ src: img(7), alt: "Admissions counselling" }],
    priceLabel: "S$300", priceSuffix: "/ session",
    title: "Primary School Admissions Counselling \u2014 P1 Registration",
    detailsLabel: "SCHOOLS & COLLEGES \u2022 ADMISSIONS \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: hrsAgo(11),
    description: "<p>Guidance through the P1 registration process, including phase selection strategy and volunteer/alumni criteria advice.</p>",
    keyDetails: [
      { key: "Focus", value: "P1 Registration" },
    ],
    goodToKnow: [
      { key: "Includes", value: "Phase strategy consultation" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.admissionsCounsellorSG,
  },
  {
    id: "edu-sg-schools-02", href: "/listings/edu-sg-schools-02", advId: "38032",
    images: [{ src: img(8), alt: "University application help" }],
    priceLabel: "S$500", priceSuffix: "/ package",
    title: "University Application & Personal Statement Assistance",
    detailsLabel: "SCHOOLS & COLLEGES \u2022 ADMISSIONS \u2022 SINGAPORE",
    locationLabel: "Novena, Singapore",
    postedAt: daysAgo(4),
    description: "<p>Complete university application assistance including personal statement writing, form filling, and mock interview practice.</p>",
    keyDetails: [
      { key: "Includes", value: "Personal statement + mock interviews" },
    ],
    goodToKnow: [
      { key: "Turnaround", value: "2 weeks" },
    ],
    coordinates: { lat: 1.3204, lng: 103.8437 },
    seller: SELLERS.admissionsCounsellorSG,
  },
];

// ── language_classes ──────────────────────────────────────────────────────────────
export const SG_EDU_LANGUAGE_CLASSES: MockListing[] = [
  {
    id: "edu-sg-language-01", href: "/listings/edu-sg-language-01", advId: "38041",
    images: [{ src: img(9), alt: "French class" }],
    priceLabel: "S$400", priceSuffix: "/ term",
    title: "French Language Classes \u2014 Beginner to Intermediate",
    detailsLabel: "LANGUAGE CLASS \u2022 FRENCH \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: hrsAgo(14),
    description: "<p>3-month French language course covering beginner to intermediate levels, taught by certified native-level instructors.</p>",
    keyDetails: [
      { key: "Level", value: "Beginner to Intermediate" },
      { key: "Duration", value: "3 months" },
    ],
    goodToKnow: [
      { key: "Batch Size", value: "Max 10 students" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.languageClassesSG,
  },
  {
    id: "edu-sg-language-02", href: "/listings/edu-sg-language-02", advId: "38042",
    images: [{ src: img(1), alt: "Japanese class" }],
    priceLabel: "S$480", priceSuffix: "/ term",
    title: "Japanese Language Classes \u2014 JLPT N5 Preparation",
    detailsLabel: "LANGUAGE CLASS \u2022 JAPANESE \u2022 SINGAPORE",
    locationLabel: "Orchard, Singapore",
    postedAt: daysAgo(5),
    description: "<p>Japanese language course focused on JLPT N5 exam preparation, covering reading, writing, and conversational basics.</p>",
    keyDetails: [
      { key: "Focus", value: "JLPT N5 preparation" },
    ],
    goodToKnow: [
      { key: "Materials", value: "Included in course fee" },
    ],
    coordinates: { lat: 1.3048, lng: 103.8318 },
    seller: SELLERS.languageClassesSG,
  },
];

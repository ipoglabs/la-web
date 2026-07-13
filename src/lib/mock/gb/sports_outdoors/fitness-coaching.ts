import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── fitness_coaching ───────────────────────────────────────────────────────────
export const SPORTS_COACHING: MockListing[] = [
  {
    id: "sport-coach-01", href: "/listings/sport-coach-01", advId: "16051",
    images: [{ src: img(8), alt: "Running coach" }],
    priceLabel: "£40",
    priceSuffix: "/ session",
    title: "Running Coach — 5K to Marathon, Personalised Plans, London",
    detailsLabel: "FITNESS COACHING • RUNNING • LONDON",
    locationLabel: "Greenwich & Victoria Park",
    postedAt: hrsAgo(1),
    description: "<p>UK Athletics-qualified <strong>running coach</strong> supporting runners from beginner 5K to marathon. Interval sessions in Greenwich Park and Victoria Park, personalised training plans, and nutrition guidance. Online remote coaching also available.</p>",
    keyDetails: [
      { key: "Coaching",     value: "Running 5K to Marathon"  },
      { key: "Locations",    value: "Greenwich & Victoria Park" },
      { key: "Qualifications", value: "UK Athletics Level 2"  },
      { key: "Online",       value: "Remote coaching available" },
    ],
    goodToKnow: [
      { key: "Free Trial",  value: "Intro session free"       },
      { key: "Plans",       value: "Personalised 12-week"     },
      { key: "Group",       value: "1:1 or small group"       },
      { key: "Bundle",      value: "8 sessions for £280"      },
    ],
    coordinates: { lat: 51.4826, lng: -0.0077 },
    seller: SELLERS.coachPro,
  },
  {
    id: "sport-coach-02", href: "/listings/sport-coach-02", advId: "16052",
    images: [{ src: img(9), alt: "Tennis coaching" }],
    priceLabel: "£50",
    priceSuffix: "/ hr",
    title: "Tennis Coach — LTA Certified, All Levels, Private Lessons London",
    detailsLabel: "FITNESS COACHING • TENNIS • LONDON",
    locationLabel: "Wimbledon / Battersea",
    postedAt: daysAgo(1),
    description: "<p>LTA Level 3-certified <strong>tennis coach</strong> offering private lessons for all ages and abilities across South West London. One-to-one and small-group sessions available at local parks and private clubs.</p>",
    keyDetails: [
      { key: "Sport",         value: "Tennis"               },
      { key: "Qualifications", value: "LTA Level 3"         },
      { key: "Locations",     value: "Wimbledon, Battersea" },
      { key: "Ages",          value: "6+ to adults"         },
    ],
    goodToKnow: [
      { key: "Rackets",    value: "Loan rackets available"  },
      { key: "Balls",      value: "Included in rate"        },
      { key: "Trial",      value: "First lesson 50% off"    },
      { key: "Group",      value: "Up to 4 players"         },
    ],
    coordinates: { lat: 51.4213, lng: -0.2062 },
    seller: SELLERS.coachPro,
  },
  {
    id: "sport-coach-03", href: "/listings/sport-coach-03", advId: "16053",
    images: [{ src: img(1), alt: "Personal trainer" }],
    priceLabel: "£60",
    priceSuffix: "/ hr",
    title: "NASM-Certified Personal Trainer — Strength & Fat Loss, Clapham / Online",
    detailsLabel: "FITNESS COACHING • PERSONAL TRAINER • CLAPHAM",
    locationLabel: "Clapham / Online",
    postedAt: daysAgo(1),
    description: "<p>NASM-certified <strong>personal trainer</strong> specialising in strength training and fat loss. In-person sessions in Clapham and Battersea Park, plus fully-remote 12-week programmes. Nutrition coaching included with all packages.</p>",
    keyDetails: [
      { key: "Speciality",  value: "Strength & fat loss"    },
      { key: "Cert.",       value: "NASM CPT + L3 PT"       },
      { key: "Format",      value: "In-person or online"    },
      { key: "Programme",   value: "12-week structured"     },
    ],
    goodToKnow: [
      { key: "First",       value: "Free consultation"      },
      { key: "Nutrition",   value: "Basic guidance included" },
      { key: "Insurance",   value: "PI insured"             },
      { key: "DBS",         value: "Enhanced DBS checked"   },
    ],
    coordinates: { lat: 51.4624, lng: -0.1380 },
    seller: SELLERS.coachPro,
  },
];


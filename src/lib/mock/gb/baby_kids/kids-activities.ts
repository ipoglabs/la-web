import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── kids_activities ────────────────────────────────────────────────────────────
export const BABY_ACTIVITIES: MockListing[] = [
  {
    id: "baby-act-01", href: "/listings/baby-act-01", advId: "15051",
    images: [{ src: img(8), alt: "Kids swimming" }],
    priceLabel: "£80",
    priceSuffix: "/ term (8 lessons)",
    title: "Baby & Toddler Swimming Lessons — Certified Instructor, Wandsworth",
    detailsLabel: "KIDS ACTIVITY • SWIMMING • WANDSWORTH",
    locationLabel: "Wandsworth, London",
    postedAt: hrsAgo(2),
    description: "<p>STA-certified <strong>baby and toddler swimming instructor</strong> running small-group lessons (max 4 per class) at Wandsworth Leisure Centre. Ages 3 months to 4 years. Parent/carer accompanies in water for under 3s.</p>",
    keyDetails: [
      { key: "Ages",       value: "3 months – 4 years"    },
      { key: "Class Size", value: "Max 4"                 },
      { key: "Location",   value: "Wandsworth LC pool"    },
      { key: "Schedule",   value: "Sat & Sun mornings"    },
    ],
    goodToKnow: [
      { key: "Qualification", value: "STA Level 2 cert."  },
      { key: "Trial",         value: "Free trial lesson"  },
      { key: "Parent/Carer",  value: "In water for <3yr"  },
      { key: "Swimwear",      value: "Swim nappy required" },
    ],
    coordinates: { lat: 51.4552, lng: -0.1942 },
    seller: SELLERS.nurseAna,
  },
  {
    id: "baby-act-02", href: "/listings/baby-act-02", advId: "15052",
    images: [{ src: img(9), alt: "Football coaching" }],
    priceLabel: "£5",
    priceSuffix: "/ session",
    title: "Junior Football Coaching — Ages 4–9, Saturday Mornings, Lewisham",
    detailsLabel: "KIDS ACTIVITY • FOOTBALL • LEWISHAM",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(1),
    description: "<p>FA-qualified coach running <strong>junior football sessions</strong> for children aged 4–9 in Lewisham. Saturday mornings 9–10:30am at Ladywell Fields. Focus on fun, fundamentals, and teamwork. All abilities welcome.</p>",
    keyDetails: [
      { key: "Ages",       value: "4–9 years"             },
      { key: "Schedule",   value: "Saturdays 9–10:30am"    },
      { key: "Location",   value: "Ladywell Fields, SE13" },
      { key: "Coach",      value: "FA Level 2 qualified"  },
    ],
    goodToKnow: [
      { key: "Ability",    value: "All levels welcome"    },
      { key: "Equipment",  value: "Bring shin pads + boots" },
      { key: "Trial",      value: "Free first session"    },
      { key: "DBS",        value: "Enhanced DBS checked"  },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.nurseAna,
  },
  {
    id: "baby-act-03", href: "/listings/baby-act-03", advId: "15053",
    images: [{ src: img(1), alt: "Coding club for kids" }],
    priceLabel: "£18",
    priceSuffix: "/ session",
    title: "Kids Coding Club — Scratch, Python, Ages 7–14, Weekly, Islington",
    detailsLabel: "KIDS ACTIVITY • CODING • ISLINGTON",
    locationLabel: "Islington, London",
    postedAt: daysAgo(2),
    description: "<p>Weekly <strong>kids coding club</strong> in Islington for ages 7–14. Beginners start with Scratch, progress to Python and game development. Small classes (max 8). Led by a qualified primary computing teacher. Laptops provided.</p>",
    keyDetails: [
      { key: "Ages",       value: "7–14 years"            },
      { key: "Languages",  value: "Scratch + Python"      },
      { key: "Class Size", value: "Max 8"                 },
      { key: "Laptops",    value: "Provided"              },
    ],
    goodToKnow: [
      { key: "Teacher",   value: "Qualified computing"   },
      { key: "Progress",  value: "Certificate each level" },
      { key: "Trial",     value: "First session £10"     },
      { key: "Schedule",  value: "Saturday afternoons"   },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.nurseAna,
  },
];


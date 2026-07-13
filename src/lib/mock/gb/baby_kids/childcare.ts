import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── childcare ──────────────────────────────────────────────────────────────────
export const BABY_CHILDCARE: MockListing[] = [
  {
    id: "baby-care-01", href: "/listings/baby-care-01", advId: "15031",
    images: [{ src: img(5), alt: "Childminder" }],
    priceLabel: "£7.50",
    priceSuffix: "/ hr",
    title: "OFSTED Registered Childminder — 0–5 Years, Wandsworth",
    detailsLabel: "CHILDCARE • OFSTED • WANDSWORTH",
    locationLabel: "Wandsworth, London",
    postedAt: hrsAgo(4),
    description: "<p>Experienced and <strong>OFSTED Good-rated childminder</strong> with spaces for children aged 0–5 in Wandsworth. Flexible full-day, part-time, and wrap-around care. Home-cooked meals, outdoor play, and a warm, nurturing environment.</p>",
    keyDetails: [
      { key: "Ages",        value: "0–5 years"             },
      { key: "Spaces",      value: "2 currently available" },
      { key: "Hours",       value: "7:30am–6pm flexible"   },
      { key: "OFSTED",      value: "Good rating"           },
    ],
    goodToKnow: [
      { key: "Meals",      value: "Home-cooked included"   },
      { key: "Tax-Free",   value: "Childcare vouchers acc." },
      { key: "Trial",      value: "Settling-in sessions"   },
      { key: "First Aid",  value: "Paediatric certified"   },
    ],
    coordinates: { lat: 51.4552, lng: -0.1942 },
    seller: SELLERS.nurseAna,
  },
  {
    id: "baby-care-02", href: "/listings/baby-care-02", advId: "15032",
    images: [{ src: img(6), alt: "Nanny" }],
    priceLabel: "£16–£18",
    priceSuffix: "/ hr (net)",
    title: "Experienced Nanny Available — Newborns to School Age, Norland Trained",
    detailsLabel: "CHILDCARE • NANNY • LONDON",
    locationLabel: "Chelsea, London",
    postedAt: daysAgo(1),
    description: "<p>Norland College-trained <strong>nanny</strong> with 8 years experience seeking a new family position. Expert with newborns, Montessori-inspired play, and school-age children. Enhanced DBS, first aid certified, and impeccable references.</p>",
    keyDetails: [
      { key: "Training",   value: "Norland College grad."  },
      { key: "Experience", value: "8 years (newborn–8yr)"  },
      { key: "Rate",       value: "£16–£18/hr (net)"       },
      { key: "Location",   value: "Chelsea / SW London"    },
    ],
    goodToKnow: [
      { key: "DBS",        value: "Enhanced DBS cleared"   },
      { key: "First Aid",  value: "Paediatric certified"   },
      { key: "References", value: "Excellent — available"  },
      { key: "Available",  value: "September 2026"         },
    ],
    coordinates: { lat: 51.4876, lng: -0.1749 },
    seller: SELLERS.nurseAna,
  },
  {
    id: "baby-care-03", href: "/listings/baby-care-03", advId: "15033",
    images: [{ src: img(7), alt: "After school club" }],
    priceLabel: "£12",
    priceSuffix: "/ session",
    title: "After-School & Holiday Club — Ages 4–11, OFSTED Registered, Hackney",
    detailsLabel: "CHILDCARE • AFTER SCHOOL CLUB • HACKNEY",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(1),
    description: "<p>OFSTED-registered <strong>after-school and holiday club</strong> for children aged 4–11 in Hackney. Monday–Friday 3:15–6pm after-school; full-day holiday clubs in all school breaks. Snacks included, homework help available.</p>",
    keyDetails: [
      { key: "Ages",       value: "4–11 years"             },
      { key: "Hours",      value: "3:15–6pm after school"  },
      { key: "Holidays",   value: "Full-day holiday clubs" },
      { key: "OFSTED",     value: "Registered + inspected" },
    ],
    goodToKnow: [
      { key: "Snacks",     value: "Healthy snack included" },
      { key: "Homework",   value: "Quiet time + help"      },
      { key: "Tax-Free",   value: "Childcare vouchers acc." },
      { key: "Booking",    value: "Weekly or termly"       },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.nurseAna,
  },
];


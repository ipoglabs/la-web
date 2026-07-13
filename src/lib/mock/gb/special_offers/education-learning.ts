import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── education_learning ─────────────────────────────────────────────────────────
export const SPECIAL_OFFERS_EDUCATION: MockListing[] = [
  {
    id: "offer-edu-01", href: "/listings/offer-edu-01", advId: "90061",
    images: [{ src: img(8), alt: "Online course" }],
    priceLabel: "£12.99",
    priceSuffix: "(was £89.99)",
    title: "All Online Courses £12.99 — Python, Excel, Graphic Design + 500 More",
    detailsLabel: "EDUCATION • 86% OFF • ONLINE COURSES",
    locationLabel: "Online (Worldwide)",
    postedAt: hrsAgo(3),
    description: "<p>Flash sale: <strong>access any of 500+ online courses for £12.99</strong> (normally up to £89.99). Python, Excel, Graphic Design, Digital Marketing, Project Management and more. Lifetime access + certificate on completion.</p>",
    keyDetails: [
      { key: "Offer",     value: "£12.99 per course"     },
      { key: "Courses",   value: "500+ available"        },
      { key: "Access",    value: "Lifetime"              },
      { key: "Cert.",     value: "Included on completion" },
    ],
    goodToKnow: [
      { key: "Ends",      value: "28 June 2026"          },
      { key: "Mobile",    value: "iOS & Android app"     },
      { key: "Language",  value: "English"               },
      { key: "Refund",    value: "30-day money back"     },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-edu-02", href: "/listings/offer-edu-02", advId: "90062",
    images: [{ src: img(9), alt: "Language learning app" }],
    priceLabel: "3 Months FREE",
    priceSuffix: "(annual plan)",
    title: "Language App Annual Plan — Get 3 Months Extra Free, 12 Languages",
    detailsLabel: "EDUCATION • 3 MONTHS FREE • LANGUAGE",
    locationLabel: "Online (Worldwide)",
    postedAt: hrsAgo(6),
    description: "<p>Buy a 12-month language learning subscription and get <strong>3 extra months free</strong> — 15 months for the price of 12. Spanish, French, German, Italian, Mandarin and 7 more. AI-adaptive lessons at your level.</p>",
    keyDetails: [
      { key: "Offer",     value: "15 months for price of 12" },
      { key: "Languages", value: "12 available"              },
      { key: "Learning",  value: "AI-adaptive lessons"       },
      { key: "Price",     value: "From £47.99/year"         },
    ],
    goodToKnow: [
      { key: "Devices",   value: "iOS, Android, Web"       },
      { key: "Levels",    value: "Beginner to advanced"    },
      { key: "Expires",   value: "Offer ends 31 Jul 2026"  },
      { key: "Refund",    value: "20-day money-back"       },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-edu-03", href: "/listings/offer-edu-03", advId: "90063",
    images: [{ src: img(1), alt: "First aid course" }],
    priceLabel: "£64",
    priceSuffix: "(was £80)",
    title: "Emergency First Aid at Work — 20% Off, Hackney, Next Date 12 July",
    detailsLabel: "EDUCATION • 20% OFF • FIRST AID",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(2),
    description: "<p><strong>EFAW (Emergency First Aid at Work)</strong> one-day certificated course — 20% off for LokalAds readers. HSE-compliant Level 3 Award. Covers CPR, AED, choking, bleeding, and shock. Certificate valid 3 years. Max 12 per class.</p>",
    keyDetails: [
      { key: "Course",    value: "EFAW Level 3 (1 day)"   },
      { key: "Date",      value: "12 July 2026"           },
      { key: "Location",  value: "Hackney, E8"            },
      { key: "Price",     value: "£64 (was £80)"          },
    ],
    goodToKnow: [
      { key: "Certificate", value: "Valid 3 years"        },
      { key: "Compliance", value: "HSE-approved"          },
      { key: "Class Size", value: "Max 12 delegates"      },
      { key: "Booking",    value: "Must book in advance"  },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.dealsPro,
  },
];


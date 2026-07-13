import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── full_time ─────────────────────────────────────────────────────────────────
export const JOBS_FULL_TIME: MockListing[] = [
  {
    id: "job-ft-01", href: "/listings/job-ft-01", advId: "30001",
    images: [{ src: img(1), alt: "Tech office" }],
    priceLabel: "£65,000",
    priceSuffix: "/yr",
    title: "Senior React Developer — Hybrid London, Great Benefits",
    detailsLabel: "FULL TIME • HYBRID • TECH",
    locationLabel: "City of London",
    postedAt: hrsAgo(3),
    description: "<p>Acme Tech Ltd is hiring a <strong>Senior React Developer</strong> to join our growing product team. You will own frontend features end-to-end, mentor junior engineers, and contribute to our design system.</p><p>5+ years React experience required. TypeScript, Node.js, and GraphQL are a strong advantage.</p>",
    keyDetails: [
      { key: "Contract",    value: "Permanent, full-time"  },
      { key: "Hours",       value: "37.5 hrs/week"         },
      { key: "Arrangement", value: "Hybrid (3 days office)" },
      { key: "Salary",      value: "£60,000–£70,000"       },
      { key: "Start Date",  value: "ASAP / negotiable"     },
    ],
    goodToKnow: [
      { key: "Benefits",    value: "25 days AL, pension, BUPA" },
      { key: "Team Size",   value: "12 engineers"              },
      { key: "Stack",       value: "React, TS, Node, GraphQL"  },
      { key: "Visa",        value: "Sponsorship not available" },
      { key: "Deadline",    value: "Rolling — apply now"       },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.techCo,
  },
  {
    id: "job-ft-02", href: "/listings/job-ft-02", advId: "30002",
    images: [{ src: img(2), alt: "Retail store" }],
    priceLabel: "£28,000",
    priceSuffix: "/yr",
    title: "Store Manager — Fashion Retail, Central London, Competitive",
    detailsLabel: "FULL TIME • ON-SITE • RETAIL",
    locationLabel: "Oxford Street, London",
    postedAt: hrsAgo(5),
    description: "<p>Leading fashion retailer seeking an experienced <strong>Store Manager</strong> for our busy Oxford Street flagship. You will drive sales targets, manage a team of 15+, and ensure an excellent customer experience.</p>",
    keyDetails: [
      { key: "Contract",    value: "Permanent, full-time" },
      { key: "Hours",       value: "40 hrs/week incl. wkds" },
      { key: "Arrangement", value: "On-site (Oxford Street)" },
      { key: "Salary",      value: "£26,000–£30,000 + bonus" },
      { key: "Start Date",  value: "4 weeks notice"          },
    ],
    goodToKnow: [
      { key: "Benefits",   value: "40% staff discount, pension" },
      { key: "Experience", value: "2+ yrs retail management"    },
      { key: "Team",       value: "15 sales associates"         },
      { key: "Visa",       value: "Right to work UK required"   },
      { key: "Deadline",   value: "Open until filled"           },
    ],
    coordinates: { lat: 51.5152, lng: -0.1422 },
    seller: SELLERS.retailCo,
  },
  {
    id: "job-ft-03", href: "/listings/job-ft-03", advId: "30003",
    images: [{ src: img(3), alt: "NGO team meeting" }],
    priceLabel: "\u00a338,000",
    priceSuffix: "/ yr",
    title: "Sustainability Communications Manager \u2014 NGO, Hybrid London",
    detailsLabel: "FULL TIME \u2022 HYBRID \u2022 NGO",
    locationLabel: "Bloomsbury, London",
    postedAt: daysAgo(1),
    description: "<p>GreenFutures Foundation is seeking a passionate <strong>Sustainability Communications Manager</strong> to lead our public engagement, media relations, and campaign messaging across print, digital, and social channels.</p><p>You will join a 30-person team working on climate policy, biodiversity, and circular economy projects. A genuine belief in the mission is as important as the skills.</p>",
    keyDetails: [
      { key: "Contract",    value: "Permanent, full-time"   },
      { key: "Hours",       value: "35 hrs/week"            },
      { key: "Arrangement", value: "Hybrid (2 days office)" },
      { key: "Salary",      value: "\u00a336,000\u2013\u00a340,000"   },
      { key: "Start Date",  value: "October 2026"           },
    ],
    goodToKnow: [
      { key: "Benefits",    value: "28 days AL, cycle scheme, pension" },
      { key: "Experience",  value: "3+ yrs in comms or NGO sector"     },
      { key: "Values",      value: "Mission-driven culture"            },
      { key: "Visa",        value: "Right to work in UK required"      },
      { key: "Apply Via",   value: "LokalAds message + CV"             },
    ],
    coordinates: { lat: 51.5226, lng: -0.1240 },
    seller: SELLERS.ngoOrg,
  },
];


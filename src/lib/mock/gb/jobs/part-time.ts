import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── part_time ─────────────────────────────────────────────────────────────────
export const JOBS_PART_TIME: MockListing[] = [
  {
    id: "job-pt-01", href: "/listings/job-pt-01", advId: "30011",
    images: [{ src: img(3), alt: "Coffee shop" }],
    priceLabel: "£12.50",
    priceSuffix: "/hr",
    title: "Weekend Barista — Artisan Coffee Shop, Flexible Shifts",
    detailsLabel: "PART TIME • ON-SITE • HOSPITALITY",
    locationLabel: "Shoreditch, London",
    postedAt: hrsAgo(2),
    description: "<p>Popular London food-to-go chain looking for a friendly <strong>Weekend Barista</strong>. You will prepare specialty coffee and hot drinks, serve customers, and keep the counter looking great. Previous barista or café experience preferred but full training given.</p>",
    keyDetails: [
      { key: "Contract",    value: "Part-time, permanent"   },
      { key: "Hours",       value: "16–20 hrs (Sat/Sun)"    },
      { key: "Arrangement", value: "On-site"                },
      { key: "Pay",         value: "£12.50/hr + tips"       },
      { key: "Start Date",  value: "ASAP"                   },
    ],
    goodToKnow: [
      { key: "Experience",  value: "Barista/cafe preferred" },
      { key: "Training",    value: "Full training provided" },
      { key: "Benefits",    value: "Free drinks on shift"   },
      { key: "Visa",        value: "Right to work required" },
      { key: "Apply Via",   value: "LokalAds message"        },
    ],
    coordinates: { lat: 51.5245, lng: -0.0789 },
    seller: SELLERS.retailCo,
  },
  {
    id: "job-pt-02", href: "/listings/job-pt-02", advId: "30012",
    images: [{ src: img(4), alt: "Tutoring session" }],
    priceLabel: "£20–£30",
    priceSuffix: "/hr",
    title: "After-School Maths & Science Tutor — Primary Level, Part-Time",
    detailsLabel: "PART TIME • FLEXIBLE • EDUCATION",
    locationLabel: "Richmond, London",
    postedAt: daysAgo(1),
    description: "<p>Learning centre seeking part-time <strong>Primary Maths & Science Tutors</strong> for after-school sessions (Mon–Fri 3:30–7:30pm). Strong subject knowledge and a patient, encouraging teaching style essential.</p>",
    keyDetails: [
      { key: "Contract",    value: "Part-time, ongoing"   },
      { key: "Hours",       value: "10–20 hrs/wk (eves)"  },
      { key: "Arrangement", value: "Centre or home visits" },
      { key: "Pay",         value: "£20–£30/hr"           },
      { key: "Start Date",  value: "September intake"      },
    ],
    goodToKnow: [
      { key: "Qualification", value: "Degree or QTS pref."  },
      { key: "DBS",           value: "Enhanced DBS required" },
      { key: "Training",      value: "Induction provided"   },
      { key: "Visa",          value: "UK right to work"     },
      { key: "Apply Via",   value: "Message with CV"       },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.eduPro,
  },
  {
    id: "job-pt-03", href: "/listings/job-pt-03", advId: "30013",
    images: [{ src: img(5), alt: "Bookkeeping" }],
    priceLabel: "\u00a318\u2013\u00a322",
    priceSuffix: "/ hr",
    title: "Part-Time Bookkeeper \u2014 SME Accountancy Practice, 20 hrs/wk",
    detailsLabel: "PART TIME \u2022 HYBRID \u2022 FINANCE",
    locationLabel: "Canary Wharf, London",
    postedAt: daysAgo(2),
    description: "<p>Boutique accountancy practice seeking a part-time <strong>Bookkeeper</strong> to manage accounts for a portfolio of 15\u201320 SME clients. Duties include bank reconciliation, VAT returns, payroll support, and client liaison.</p><p>Flexible hours \u2014 ideally 20 hrs/week across 3\u20134 days. Xero experience is essential.</p>",
    keyDetails: [
      { key: "Contract",    value: "Part-time, permanent"     },
      { key: "Hours",       value: "20 hrs/week (3\u20134 days)" },
      { key: "Arrangement", value: "Hybrid"                   },
      { key: "Rate",        value: "\u00a318\u2013\u00a322 / hr DOE"   },
      { key: "Start Date",  value: "ASAP"                     },
    ],
    goodToKnow: [
      { key: "Software",    value: "Xero \u2014 essential"           },
      { key: "Qualif.",     value: "AAT or ACCA part-qualified"   },
      { key: "Experience",  value: "2+ yrs bookkeeping"          },
      { key: "Visa",        value: "Right to work in UK"         },
      { key: "Apply Via",   value: "Message with CV"             },
    ],
    coordinates: { lat: 51.5055, lng: -0.0235 },
    seller: SELLERS.bizConsult,
  },
];


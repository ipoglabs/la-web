import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── education_learning ────────────────────────────────────────────────────────
export const SERVICES_EDUCATION: MockListing[] = [
  {
    id: "svc-edu-01", href: "/listings/svc-edu-01", advId: "40041",
    images: [{ src: img(8), alt: "Online course" }],
    priceLabel: "£199",
    priceSuffix: "/ course",
    title: "AWS Cloud Practitioner & Solutions Architect — Bootcamp",
    detailsLabel: "EDUCATION • AWS CERTIFIED • ONLINE",
    locationLabel: "Online (UK & Global)",
    postedAt: hrsAgo(4),
    description: "<p>12-week intensive <strong>AWS Cloud bootcamp</strong> covering Cloud Practitioner and Solutions Architect (Associate). Live online sessions, hands-on labs, mock exams, and career support. Next cohort starts September.</p>",
    keyDetails: [
      { key: "Service Type",   value: "AWS Cloud Bootcamp"     },
      { key: "Coverage",       value: "Online, global"          },
      { key: "Duration",       value: "12 weeks (evenings)"     },
      { key: "Qualifications", value: "AWS accredited content"  },
    ],
    goodToKnow: [
      { key: "Outcome",     value: "AWS Certifications ×2"   },
      { key: "Next Cohort", value: "Sept 2026"               },
      { key: "Refund",      value: "Pass or money back"      },
      { key: "Instalment",  value: "Pay in 3 (£67/month)"   },
    ],
    coordinates: { lat: 51.5165, lng: -0.0948 },
    seller: SELLERS.eduPro,
  },
  {
    id: "svc-edu-02", href: "/listings/svc-edu-02", advId: "40042",
    images: [{ src: img(9), alt: "Training room" }],
    priceLabel: "£595",
    priceSuffix: "/ course",
    title: "PRINCE2 Foundation Training — 2-Day Intensive, Central London",
    detailsLabel: "EDUCATION • PRINCE2 • CENTRAL LONDON",
    locationLabel: "Moorgate, London",
    postedAt: daysAgo(2),
    description: "<p>Axelos-accredited <strong>PRINCE2 Foundation training</strong> delivered over 2 days at our Central London training centre. Includes exam voucher, official manual, and mock papers. ATO-accredited provider with 98% first-time pass rate.</p>",
    keyDetails: [
      { key: "Service Type",   value: "PRINCE2 Foundation"    },
      { key: "Coverage",       value: "Moorgate, in-person"   },
      { key: "Duration",       value: "2 days"                },
      { key: "Qualifications", value: "Axelos ATO accredited" },
    ],
    goodToKnow: [
      { key: "Outcome",    value: "PRINCE2 Foundation cert" },
      { key: "Includes",   value: "Exam voucher + manual"   },
      { key: "Pass Rate",  value: "98% first attempt"       },
      { key: "Cancellation", value: "Full refund if 7+ days" },
    ],
    coordinates: { lat: 51.5181, lng: -0.0877 },
    seller: SELLERS.eduPro,
  },
  {
    id: "svc-edu-03", href: "/listings/svc-edu-03", advId: "40043",
    images: [{ src: img(1), alt: "English language tutoring" }],
    priceLabel: "£40",
    priceSuffix: "/ hr",
    title: "IELTS & English Language Coaching — Guaranteed Band Improvement",
    detailsLabel: "EDUCATION • IELTS • ONLINE / CENTRAL LONDON",
    locationLabel: "Online / Central London",
    postedAt: daysAgo(4),
    description: "<p>British Council-endorsed <strong>IELTS coach</strong> with a 100% client improvement record. Intensive grammar, writing, speaking, and listening practice tailored to your target band score. Online or face-to-face in Central London.</p>",
    keyDetails: [
      { key: "Service Type",   value: "IELTS Coaching"        },
      { key: "Coverage",       value: "Online + Central Lon." },
      { key: "Availability",   value: "Evenings & weekends"   },
      { key: "Qualifications", value: "CELTA, British Council" },
    ],
    goodToKnow: [
      { key: "Guarantee",  value: "0.5 band min improvement" },
      { key: "Trial",      value: "First 30 min free"        },
      { key: "Materials",  value: "Cambridge prep books"     },
      { key: "Booking",    value: "Direct via LokalAds"      },
    ],
    coordinates: { lat: 51.5165, lng: -0.0948 },
    seller: SELLERS.tutorAce,
  },
];


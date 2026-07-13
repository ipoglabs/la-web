import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── startup_support ────────────────────────────────────────────────────────────
export const BUSINESS_STARTUP: MockListing[] = [
  {
    id: "biz-startup-01", href: "/listings/biz-startup-01", advId: "70051",
    images: [{ src: img(8), alt: "Startup accelerator" }],
    priceLabel: "From £500",
    priceSuffix: "/ mo",
    title: "Startup Mentorship & Business Coaching — Seed to Series A",
    detailsLabel: "STARTUP SUPPORT • MENTOR • LONDON",
    locationLabel: "London / Remote",
    postedAt: daysAgo(1),
    description: "<p>Experienced <strong>startup coach and angel investor</strong> with 4 successful exits offering structured mentorship programmes. Fundraising, GTM strategy, product-market fit, and investor pitch preparation. Regular cohorts and 1:1 sessions available.</p>",
    keyDetails: [
      { key: "Service",   value: "Startup Mentorship"    },
      { key: "Stage",     value: "Pre-seed to Series A"  },
      { key: "Format",    value: "1:1 or cohort groups"  },
      { key: "Sessions",  value: "2× per month"          },
    ],
    goodToKnow: [
      { key: "Track Record", value: "4 successful exits"  },
      { key: "Angel",        value: "Investment possible" },
      { key: "Trial",        value: "Free intro session"  },
      { key: "Network",      value: "VC introductions"    },
    ],
    coordinates: { lat: 51.5245, lng: -0.0789 },
    seller: SELLERS.startupHub,
  },
  {
    id: "biz-startup-02", href: "/listings/biz-startup-02", advId: "70052",
    images: [{ src: img(9), alt: "Co-working space" }],
    priceLabel: "From £250",
    priceSuffix: "/ mo",
    title: "Flexible Co-Working & Hot Desks — Shoreditch, All-Inclusive",
    detailsLabel: "STARTUP SUPPORT • CO-WORKING • SHOREDITCH",
    locationLabel: "Shoreditch, London",
    postedAt: hrsAgo(3),
    description: "<p>Vibrant <strong>co-working space in Shoreditch</strong> offering hot desks, dedicated desks, and private offices. All-inclusive pricing covers Wi-Fi, printing, meeting rooms (8 hrs/mo), and a thriving community of 200+ founders and freelancers.</p>",
    keyDetails: [
      { key: "Service",    value: "Co-working / Hot desks"  },
      { key: "Location",   value: "Shoreditch EC2"           },
      { key: "Options",    value: "Hot desk / dedicated / office" },
      { key: "Includes",   value: "Wi-Fi, print, meeting rooms" },
    ],
    goodToKnow: [
      { key: "Contract",  value: "Monthly rolling"         },
      { key: "24/7",      value: "Access included"         },
      { key: "Events",    value: "Weekly networking events" },
      { key: "Trial",     value: "Free day pass"           },
    ],
    coordinates: { lat: 51.5245, lng: -0.0789 },
    seller: SELLERS.startupHub,
  },
  {
    id: "biz-startup-03", href: "/listings/biz-startup-03", advId: "70053",
    images: [{ src: img(1), alt: "Startup grant funding" }],
    priceLabel: "Free",
    title: "Innovate UK Edge — Free Grant Writing & R&D Tax Credit Support",
    detailsLabel: "STARTUP SUPPORT • FUNDING • UK-WIDE",
    locationLabel: "UK-wide (Remote)",
    postedAt: daysAgo(2),
    description: "<p>Innovate UK Edge-funded <strong>business support programme</strong> helping UK startups and SMEs access grant funding and R&D tax credits. Free to eligible businesses. Our advisors have secured over £12M in grants for clients.</p>",
    keyDetails: [
      { key: "Service",   value: "Grant & R&D Tax Support"  },
      { key: "Coverage",  value: "UK-wide (remote)"         },
      { key: "Cost",      value: "Free (Innovate UK funded)" },
      { key: "Eligibility", value: "UK registered businesses" },
    ],
    goodToKnow: [
      { key: "Track Record", value: "£12M+ grants secured"    },
      { key: "R&D Tax",      value: "HMRC compliant claims"    },
      { key: "Timeline",     value: "3–6 month process"       },
      { key: "Contact",      value: "Free eligibility check"  },
    ],
    coordinates: { lat: 51.5054, lng: -0.0235 },
    seller: SELLERS.startupHub,
  },
];


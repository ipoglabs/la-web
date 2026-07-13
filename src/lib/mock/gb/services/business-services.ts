import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── business_services ─────────────────────────────────────────────────────────
export const SERVICES_BUSINESS: MockListing[] = [
  {
    id: "svc-biz-01", href: "/listings/svc-biz-01", advId: "40011",
    images: [{ src: img(3), alt: "Accountant office" }],
    priceLabel: "From £150",
    priceSuffix: "/ mo",
    title: "Small Business Accountancy & Tax Returns — Cloud-Based",
    detailsLabel: "BUSINESS SERVICES • ACCA • LONDON",
    locationLabel: "Central London / Remote",
    postedAt: hrsAgo(2),
    description: "<p>ACCA-qualified <strong>small business accountant</strong> specialising in sole traders, partnerships, and Ltd companies. Bookkeeping, VAT returns, self-assessment, and annual accounts. All work done remotely via Xero or QuickBooks.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Accountancy & Tax"   },
      { key: "Coverage",       value: "UK-wide (remote)"    },
      { key: "Availability",   value: "Mon–Fri 9am–5pm"     },
      { key: "Qualifications", value: "ACCA, MTD compliant" },
    ],
    goodToKnow: [
      { key: "First Month",  value: "Free trial period"    },
      { key: "Software",     value: "Xero / QuickBooks"    },
      { key: "SA Deadline",  value: "Jan 31 filing covered" },
      { key: "VAT",          value: "MTD compliant"        },
    ],
    coordinates: { lat: 51.5054, lng: -0.0235 },
    seller: SELLERS.bizConsult,
  },
  {
    id: "svc-biz-02", href: "/listings/svc-biz-02", advId: "40012",
    images: [{ src: img(4), alt: "Digital marketing" }],
    priceLabel: "From £500",
    priceSuffix: "/ mo",
    title: "SEO & Google Ads Management — Small Business Specialists",
    detailsLabel: "BUSINESS SERVICES • GOOGLE PARTNER • LONDON",
    locationLabel: "London / Remote",
    postedAt: daysAgo(1),
    description: "<p>Certified <strong>Google Partner agency</strong> offering end-to-end SEO and Google Ads management for small businesses. Monthly reporting, transparent pricing, and no long-term lock-in contracts.</p>",
    keyDetails: [
      { key: "Service Type",   value: "SEO & PPC"           },
      { key: "Coverage",       value: "UK-wide (remote)"    },
      { key: "Availability",   value: "Dedicated account mgr" },
      { key: "Qualifications", value: "Google Partner cert."  },
    ],
    goodToKnow: [
      { key: "Contract",    value: "Monthly rolling"       },
      { key: "Min. Spend",  value: "£500/month ad spend"   },
      { key: "Reporting",   value: "Monthly dashboards"    },
      { key: "First Month", value: "50% off setup fee"     },
    ],
    coordinates: { lat: 51.5226, lng: -0.0794 },
    seller: SELLERS.bizConsult,
  },
  {
    id: "svc-biz-03", href: "/listings/svc-biz-03", advId: "40013",
    images: [{ src: img(5), alt: "Virtual PA working" }],
    priceLabel: "From £25",
    priceSuffix: "/ hr",
    title: "Virtual PA & Executive Assistant — Admin, Diary & Email Management",
    detailsLabel: "BUSINESS SERVICES • VIRTUAL PA • REMOTE",
    locationLabel: "Remote (UK-wide)",
    postedAt: daysAgo(2),
    description: "<p>Highly organised <strong>Virtual PA</strong> offering email management, diary management, travel booking, and general admin support for busy professionals and small business owners. 10 years PA/EA experience.</p>",
    keyDetails: [
      { key: "Service Type",  value: "Virtual PA / EA"        },
      { key: "Coverage",      value: "Remote (UK-wide)"       },
      { key: "Availability",  value: "Mon–Fri 9am–6pm"        },
      { key: "Experience",    value: "10 years PA/EA"         },
    ],
    goodToKnow: [
      { key: "Trial",      value: "5-hour trial block"      },
      { key: "Contract",   value: "Monthly rolling"         },
      { key: "Min. Hours", value: "10 hrs/month"            },
      { key: "Tools",      value: "GSuite, Outlook, Trello" },
    ],
    coordinates: { lat: 51.5054, lng: -0.0235 },
    seller: SELLERS.bizConsult,
  },
];


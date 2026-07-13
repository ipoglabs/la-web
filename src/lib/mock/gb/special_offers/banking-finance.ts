import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── banking_finance ───────────────────────────────────────────────────────────
export const SPECIAL_OFFERS_BANKING: MockListing[] = [
  {
    id: "offer-bank-01", href: "/listings/offer-bank-01", advId: "90001",
    images: [{ src: img(1), alt: "Credit card offer" }],
    priceLabel: "0% APR",
    priceSuffix: "for 24 months",
    title: "0% Purchase Credit Card — 24-Month Intro, No Annual Fee",
    detailsLabel: "BANKING • 0% APR • CREDIT CARD",
    locationLabel: "UK-wide",
    postedAt: hrsAgo(1),
    description: "<p>Promotional offer: <strong>0% interest on purchases for 24 months</strong> with this award-winning credit card. No annual fee, cashback on grocery spend, and free travel insurance. Apply online in minutes — representative APR 22.9% after intro period.</p>",
    keyDetails: [
      { key: "Offer",          value: "0% APR for 24 months"    },
      { key: "Annual Fee",     value: "None"                    },
      { key: "Cashback",       value: "0.5% on groceries"       },
      { key: "Rep. APR",       value: "22.9% after intro"       },
    ],
    goodToKnow: [
      { key: "Eligibility",  value: "UK residents, 18+"        },
      { key: "Credit Check", value: "Hard search on apply"     },
      { key: "Decision",     value: "Online, instant"          },
      { key: "Expires",      value: "Offer ends 31 Aug 2026"   },
    ],
    coordinates: { lat: 51.5055, lng: -0.0754 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-bank-02", href: "/listings/offer-bank-02", advId: "90002",
    images: [{ src: img(2), alt: "Savings account offer" }],
    priceLabel: "5.2% AER",
    priceSuffix: "(easy access)",
    title: "High-Interest Easy Access Savings — 5.2% AER, FSCS Protected, Open Online",
    detailsLabel: "BANKING • 5.2% AER • SAVINGS",
    locationLabel: "Online (UK-wide)",
    postedAt: hrsAgo(3),
    description: "<p>New customer offer: open an <strong>easy-access savings account</strong> paying 5.2% AER variable. No notice period, withdraw any time. FSCS protected up to £85,000. Apply in under 5 minutes online.</p>",
    keyDetails: [
      { key: "Rate",        value: "5.2% AER (variable)"   },
      { key: "Type",        value: "Easy access"           },
      { key: "Limit",       value: "Up to £85,000"         },
      { key: "Min Deposit", value: "£1"                   },
    ],
    goodToKnow: [
      { key: "FSCS",       value: "Protected up to £85K"  },
      { key: "Customers",  value: "New customers only"    },
      { key: "Rate Type",  value: "Variable — may change" },
      { key: "Expires",    value: "Offer ends 31 Aug 2026" },
    ],
    coordinates: { lat: 51.5055, lng: -0.0754 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-bank-03", href: "/listings/offer-bank-03", advId: "90003",
    images: [{ src: img(3), alt: "Business bank switch" }],
    priceLabel: "£200 Cashback",
    title: "Switch Business Account — £200 Cash Reward + 12 Months Free Banking",
    detailsLabel: "BANKING • £200 CASHBACK • BUSINESS ACCOUNT",
    locationLabel: "UK-wide",
    postedAt: daysAgo(1),
    description: "<p>Switch your <strong>business current account</strong> and receive £200 cashback within 30 days, plus 12 months of free banking. Sole traders and limited companies (up to 10 staff) eligible. CASS 7-day guaranteed switch.</p>",
    keyDetails: [
      { key: "Reward",      value: "£200 cashback"         },
      { key: "Free Banking", value: "12 months included"  },
      { key: "Eligible",    value: "Sole traders + LTDs"  },
      { key: "Employees",   value: "Up to 10"             },
    ],
    goodToKnow: [
      { key: "Switch",     value: "CASS 7-day guarantee"  },
      { key: "Cashback",   value: "Paid within 30 days"   },
      { key: "After",      value: "£7.50/mo after 12mo"   },
      { key: "Expires",    value: "Offer ends 30 Sep 2026" },
    ],
    coordinates: { lat: 51.5055, lng: -0.0754 },
    seller: SELLERS.dealsPro,
  },
];


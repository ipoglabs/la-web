import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── electronics_gadgets ────────────────────────────────────────────────────────
export const SPECIAL_OFFERS_ELECTRONICS: MockListing[] = [
  {
    id: "offer-tech-01", href: "/listings/offer-tech-01", advId: "90041",
    images: [{ src: img(6), alt: "Tech sale" }],
    priceLabel: "Up to 35% OFF",
    title: "Summer Tech Sale — Apple, Samsung, Sony Up to 35% Off",
    detailsLabel: "ELECTRONICS • UP TO 35% OFF • TECH",
    locationLabel: "Online / London",
    postedAt: hrsAgo(2),
    description: "<p>Big summer savings on top tech brands — <strong>Apple, Samsung, and Sony</strong> products up to 35% off. MacBooks, iPads, Galaxy phones, and Sony headphones all reduced. 2-year warranty included on all items.</p>",
    keyDetails: [
      { key: "Discount",  value: "Up to 35% off RRP"      },
      { key: "Brands",    value: "Apple, Samsung, Sony"   },
      { key: "Warranty",  value: "2-year included"        },
      { key: "Delivery",  value: "Next day free"          },
    ],
    goodToKnow: [
      { key: "Returns",   value: "30-day hassle-free"     },
      { key: "Finance",   value: "0% over 12 months"      },
      { key: "Ends",      value: "30 July 2026"           },
      { key: "Stock",     value: "Subject to availability" },
    ],
    coordinates: { lat: 51.5176, lng: -0.1314 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-tech-02", href: "/listings/offer-tech-02", advId: "90042",
    images: [{ src: img(7), alt: "Refurbished smartphone" }],
    priceLabel: "From £349",
    priceSuffix: "(save £200)",
    title: "Certified Refurbished iPhones — Grade A, 1-Year Warranty, Save up to £200",
    detailsLabel: "ELECTRONICS • SAVE £200 • REFURBISHED",
    locationLabel: "Online (UK-wide)",
    postedAt: hrsAgo(5),
    description: "<p>Grade A <strong>certified refurbished iPhones</strong> from £349 — saving up to £200 vs buying new. Every device tested, cleaned, and reset to factory settings. Includes 1-year warranty and charger. Dispatched within 24 hours.</p>",
    keyDetails: [
      { key: "Condition", value: "Grade A (excellent)"    },
      { key: "Price",     value: "From £349"             },
      { key: "Saving",    value: "Up to £200 vs new"     },
      { key: "Warranty",  value: "1-year included"       },
    ],
    goodToKnow: [
      { key: "Battery",   value: "Original spec or better" },
      { key: "Includes",  value: "Charger in box"        },
      { key: "Dispatch",  value: "Within 24 hours"       },
      { key: "Returns",   value: "30-day hassle-free"    },
    ],
    coordinates: { lat: 51.5176, lng: -0.1314 },
    seller: SELLERS.dealsPro,
  },
  {
    id: "offer-tech-03", href: "/listings/offer-tech-03", advId: "90043",
    images: [{ src: img(8), alt: "Smart home bundle" }],
    priceLabel: "£149",
    priceSuffix: "(save £60)",
    title: "Smart Home Starter Bundle — Smart Speaker + 3 Colour Bulbs + Smart Plug",
    detailsLabel: "ELECTRONICS • SAVE £60 • SMART HOME",
    locationLabel: "Online (UK-wide)",
    postedAt: daysAgo(1),
    description: "<p>Everything to kickstart your <strong>smart home</strong> in one bundle: smart speaker, 3 colour LED bulbs, and a smart plug — normally £209, now £149. Works with Alexa and Google Home. App guided setup in under 10 minutes.</p>",
    keyDetails: [
      { key: "Bundle",    value: "Speaker + 3 bulbs + plug" },
      { key: "Price",     value: "£149 (was £209)"        },
      { key: "Saving",    value: "£60 off individual RRP" },
      { key: "Compatible", value: "Alexa + Google Home"  },
    ],
    goodToKnow: [
      { key: "Setup",     value: "App-guided, under 10 min" },
      { key: "Delivery",  value: "Free, 1–2 working days" },
      { key: "Returns",   value: "30-day free returns"    },
      { key: "Ends",      value: "While stocks last"      },
    ],
    coordinates: { lat: 51.5176, lng: -0.1314 },
    seller: SELLERS.dealsPro,
  },
];


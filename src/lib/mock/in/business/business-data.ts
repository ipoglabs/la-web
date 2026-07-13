import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── biz_for_sale ──────────────────────────────────────────────────────────────
export const IN_BUSINESS_FOR_SALE: MockListing[] = [
  {
    id: "biz-in-sale-01", href: "/listings/biz-in-sale-01", advId: "25001",
    images: [{ src: img(1), alt: "Cafe for sale" }],
    priceLabel: "\u20b935 Lakh",
    title: "Running Cafe for Sale \u2014 Prime Location, Profitable, 3 Years Old",
    detailsLabel: "F&B \u2022 CAFE \u2022 ESTABLISHED",
    locationLabel: "Connaught Place, Delhi",
    postedAt: hrsAgo(4),
    description: "<p>Well-established cafe in a high-footfall location, running profitably for 3 years. Sale includes full kitchen equipment, furniture, and existing staff willing to continue.</p>",
    keyDetails: [
      { key: "Business Type", value: "Cafe / F&B" },
      { key: "Established",   value: "3 years"    },
      { key: "Monthly Revenue", value: "\u20b94.5 Lakh avg." },
    ],
    goodToKnow: [
      { key: "Lease",   value: "5 years remaining, transferable" },
      { key: "Staff",   value: "6 staff, willing to continue"    },
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    seller: SELLERS.bizBrokerIndia,
  },
  {
    id: "biz-in-sale-02", href: "/listings/biz-in-sale-02", advId: "25002",
    images: [{ src: img(2), alt: "Printing business" }],
    priceLabel: "\u20b918 Lakh",
    title: "Printing & Signage Business for Sale \u2014 With Equipment",
    detailsLabel: "PRINTING \u2022 ESTABLISHED \u2022 EQUIPMENT INCLUDED",
    locationLabel: "Connaught Place, Delhi",
    postedAt: daysAgo(1),
    description: "<p>Established printing and signage business with existing corporate clients. Sale includes large-format printer, laminator, and cutting machines.</p>",
    keyDetails: [
      { key: "Business Type", value: "Printing & Signage" },
      { key: "Established",   value: "5 years"            },
    ],
    goodToKnow: [
      { key: "Includes", value: "All equipment & client list" },
    ],
    coordinates: { lat: 28.6315, lng: 77.2167 },
    seller: SELLERS.bizBrokerIndia,
  },
];

// ── b2b_service ───────────────────────────────────────────────────────────────
export const IN_BUSINESS_B2B: MockListing[] = [
  {
    id: "biz-in-b2b-01", href: "/listings/biz-in-b2b-01", advId: "25011",
    images: [{ src: img(3), alt: "Warehouse logistics" }],
    priceLabel: "\u20b98/kg", priceSuffix: "/ kg",
    title: "Bulk Freight & Warehousing \u2014 Chennai Port Access",
    detailsLabel: "B2B SERVICE \u2022 LOGISTICS \u2022 CHENNAI",
    locationLabel: "Guindy, Chennai",
    postedAt: hrsAgo(6),
    description: "<p>End-to-end freight and warehousing services with direct access to Chennai Port. Suitable for manufacturers needing bulk import/export handling.</p>",
    keyDetails: [
      { key: "Service Type", value: "Freight & warehousing" },
      { key: "Coverage",     value: "Pan-India + export"    },
    ],
    goodToKnow: [
      { key: "Contract", value: "Monthly or per-shipment" },
    ],
    coordinates: { lat: 13.0067, lng: 80.2206 },
    seller: SELLERS.b2bSupplyChain,
  },
  {
    id: "biz-in-b2b-02", href: "/listings/biz-in-b2b-02", advId: "25012",
    images: [{ src: img(4), alt: "Raw material sourcing" }],
    priceLabel: "Quote on request",
    title: "Raw Material Sourcing \u2014 Textiles & Packaging, Bulk Orders",
    detailsLabel: "B2B SERVICE \u2022 SOURCING \u2022 CHENNAI",
    locationLabel: "Guindy, Chennai",
    postedAt: daysAgo(2),
    description: "<p>Bulk sourcing service for textile and packaging raw materials, with vetted supplier network across South India.</p>",
    keyDetails: [
      { key: "Service Type", value: "Sourcing" },
    ],
    goodToKnow: [
      { key: "MOQ", value: "Varies by material" },
    ],
    coordinates: { lat: 13.0067, lng: 80.2206 },
    seller: SELLERS.b2bSupplyChain,
  },
];

// ── freelance_contractors ─────────────────────────────────────────────────────
export const IN_BUSINESS_FREELANCE: MockListing[] = [
  {
    id: "biz-in-freelance-01", href: "/listings/biz-in-freelance-01", advId: "25021",
    images: [{ src: img(5), alt: "IT contractor" }],
    priceLabel: "\u20b91,500", priceSuffix: "/ hr",
    title: "Independent IT Infrastructure Contractor \u2014 Short-Term Projects",
    detailsLabel: "CONTRACTOR \u2022 IT INFRASTRUCTURE \u2022 BENGALURU",
    locationLabel: "Electronic City, Bengaluru",
    postedAt: hrsAgo(9),
    description: "<p>Experienced IT infrastructure contractor available for network setup, server migration, and short-term consulting engagements.</p>",
    keyDetails: [
      { key: "Specialty",  value: "IT Infrastructure" },
      { key: "Experience", value: "12 years"          },
    ],
    goodToKnow: [
      { key: "Availability", value: "2-week notice"  },
    ],
    coordinates: { lat: 12.8452, lng: 77.6602 },
    seller: SELLERS.freelanceContractorHub,
  },
  {
    id: "biz-in-freelance-02", href: "/listings/biz-in-freelance-02", advId: "25022",
    images: [{ src: img(6), alt: "Financial consultant" }],
    priceLabel: "\u20b92,000", priceSuffix: "/ hr",
    title: "Freelance Financial Consultant \u2014 Startup Finance & Fundraising",
    detailsLabel: "CONTRACTOR \u2022 FINANCE \u2022 BENGALURU",
    locationLabel: "Electronic City, Bengaluru",
    postedAt: daysAgo(3),
    description: "<p>Independent financial consultant specialising in startup finance modelling, cap tables, and fundraising deck preparation.</p>",
    keyDetails: [
      { key: "Specialty", value: "Startup Finance" },
    ],
    goodToKnow: [
      { key: "Engagement", value: "Project-based or hourly" },
    ],
    coordinates: { lat: 12.8452, lng: 77.6602 },
    seller: SELLERS.freelanceContractorHub,
  },
];

// ── partnership ───────────────────────────────────────────────────────────────
export const IN_BUSINESS_PARTNERSHIP: MockListing[] = [
  {
    id: "biz-in-partner-01", href: "/listings/biz-in-partner-01", advId: "25031",
    images: [{ src: img(7), alt: "Startup pitch" }],
    priceLabel: "Seeking \u20b950 Lakh investment",
    title: "Seeking Co-Founder & Seed Investment \u2014 D2C Skincare Brand",
    detailsLabel: "PARTNERSHIP \u2022 D2C BRAND \u2022 KOCHI",
    locationLabel: "Kochi",
    postedAt: hrsAgo(11),
    description: "<p>Early-stage D2C skincare brand with existing product line and initial traction, seeking a technical co-founder and seed investment of \u20b950 Lakh.</p>",
    keyDetails: [
      { key: "Sector",  value: "D2C Skincare"     },
      { key: "Stage",   value: "Seed"             },
    ],
    goodToKnow: [
      { key: "Equity Offered", value: "Negotiable" },
    ],
    coordinates: { lat: 9.9312, lng: 76.2673 },
    seller: SELLERS.partnerSeeker,
  },
  {
    id: "biz-in-partner-02", href: "/listings/biz-in-partner-02", advId: "25032",
    images: [{ src: img(8), alt: "Restaurant partnership" }],
    priceLabel: "Seeking \u20b915 Lakh partner investment",
    title: "Seeking Business Partner \u2014 Cloud Kitchen Expansion",
    detailsLabel: "PARTNERSHIP \u2022 CLOUD KITCHEN \u2022 KOCHI",
    locationLabel: "Kochi",
    postedAt: daysAgo(4),
    description: "<p>Profitable single-location cloud kitchen looking for a partner to fund expansion into 2 new cities. Existing operations and recipes proven.</p>",
    keyDetails: [
      { key: "Sector", value: "Cloud Kitchen / F&B" },
    ],
    goodToKnow: [
      { key: "Equity Offered", value: "30% for investment" },
    ],
    coordinates: { lat: 9.9312, lng: 76.2673 },
    seller: SELLERS.partnerSeeker,
  },
];

// ── equipment_supplies ────────────────────────────────────────────────────────
export const IN_BUSINESS_EQUIPMENT: MockListing[] = [
  {
    id: "biz-in-equip-01", href: "/listings/biz-in-equip-01", advId: "25041",
    images: [{ src: img(9), alt: "Commercial kitchen equipment" }],
    priceLabel: "\u20b91.2 Lakh",
    title: "Commercial Kitchen Equipment Set \u2014 Fryer, Griddle, Prep Tables",
    detailsLabel: "EQUIPMENT \u2022 COMMERCIAL KITCHEN \u2022 BENGALURU",
    locationLabel: "Peenya, Bengaluru",
    postedAt: hrsAgo(7),
    description: "<p>Complete commercial kitchen equipment set including deep fryer, flat-top griddle, and stainless steel prep tables. Refurbished and tested.</p>",
    keyDetails: [
      { key: "Category",   value: "Commercial Kitchen" },
      { key: "Condition",  value: "Refurbished, tested"},
    ],
    goodToKnow: [
      { key: "Warranty", value: "6 months on compressors" },
    ],
    coordinates: { lat: 13.0284, lng: 77.5205 },
    seller: SELLERS.equipSupplyIndia,
  },
  {
    id: "biz-in-equip-02", href: "/listings/biz-in-equip-02", advId: "25042",
    images: [{ src: img(1), alt: "Office furniture" }],
    priceLabel: "\u20b985,000",
    title: "Office Furniture Bulk Lot \u2014 20 Workstations, Chairs Included",
    detailsLabel: "EQUIPMENT \u2022 OFFICE FURNITURE \u2022 BENGALURU",
    locationLabel: "Peenya, Bengaluru",
    postedAt: daysAgo(2),
    description: "<p>Bulk lot of 20 modular office workstations with ergonomic chairs, from a downsizing office. Good condition, minor wear.</p>",
    keyDetails: [
      { key: "Category",  value: "Office Furniture" },
      { key: "Quantity",  value: "20 sets"          },
    ],
    goodToKnow: [
      { key: "Delivery", value: "Available at extra cost" },
    ],
    coordinates: { lat: 13.0284, lng: 77.5205 },
    seller: SELLERS.equipSupplyIndia,
  },
];

// ── startup_support ────────────────────────────────────────────────────────────
export const IN_BUSINESS_STARTUP: MockListing[] = [
  {
    id: "biz-in-startup-01", href: "/listings/biz-in-startup-01", advId: "25051",
    images: [{ src: img(2), alt: "Co-working space" }],
    priceLabel: "\u20b98,000", priceSuffix: "/ mo",
    title: "Startup Co-Working Desk \u2014 Mentorship Programme Included",
    detailsLabel: "STARTUP SUPPORT \u2022 CO-WORKING \u2022 BENGALURU",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: hrsAgo(13),
    description: "<p>Dedicated desk in a startup-focused co-working space, with access to monthly mentorship sessions and investor networking events.</p>",
    keyDetails: [
      { key: "Includes", value: "Desk + mentorship + events" },
    ],
    goodToKnow: [
      { key: "Contract", value: "Monthly, no lock-in" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.startupSupportHub,
  },
  {
    id: "biz-in-startup-02", href: "/listings/biz-in-startup-02", advId: "25052",
    images: [{ src: img(3), alt: "Pitch deck workshop" }],
    priceLabel: "\u20b95,000", priceSuffix: "/ workshop",
    title: "Pitch Deck & Fundraising Workshop \u2014 For Early-Stage Founders",
    detailsLabel: "STARTUP SUPPORT \u2022 WORKSHOP \u2022 BENGALURU",
    locationLabel: "Koramangala, Bengaluru",
    postedAt: daysAgo(3),
    description: "<p>Half-day workshop covering pitch deck structure, valuation basics, and how to approach angel investors. Small-group format.</p>",
    keyDetails: [
      { key: "Duration",   value: "4 hours" },
      { key: "Batch Size", value: "Max 15 founders" },
    ],
    goodToKnow: [
      { key: "Includes", value: "1-on-1 feedback session" },
    ],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    seller: SELLERS.startupSupportHub,
  },
];

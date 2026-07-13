import type { MockListing } from "@/lib/mock/mock-listing-schema";
import { SELLERS, img, daysAgo, hrsAgo } from "./sellers";

// ── biz_for_sale ──────────────────────────────────────────────────────────────
export const SG_BUSINESS_FOR_SALE: MockListing[] = [
  {
    id: "biz-sg-sale-01", href: "/listings/biz-sg-sale-01", advId: "35001",
    images: [{ src: img(1), alt: "Cafe for sale" }],
    priceLabel: "S$180,000",
    title: "Running Cafe for Sale \u2014 CBD Location, Profitable, 3 Years Old",
    detailsLabel: "F&B \u2022 CAFE \u2022 ESTABLISHED",
    locationLabel: "Raffles Place, Singapore",
    postedAt: hrsAgo(4),
    description: "<p>Well-established cafe in a high-footfall CBD location, running profitably for 3 years. Sale includes full kitchen equipment, furniture, and existing staff willing to continue.</p>",
    keyDetails: [
      { key: "Business Type",   value: "Cafe / F&B" },
      { key: "Established",     value: "3 years"    },
      { key: "Monthly Revenue", value: "S$28,000 avg." },
    ],
    goodToKnow: [
      { key: "Lease", value: "3 years remaining, transferable" },
      { key: "Staff", value: "5 staff, willing to continue"    },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.bizBrokerSG,
  },
  {
    id: "biz-sg-sale-02", href: "/listings/biz-sg-sale-02", advId: "35002",
    images: [{ src: img(2), alt: "Printing business" }],
    priceLabel: "S$95,000",
    title: "Printing & Signage Business for Sale \u2014 With Equipment",
    detailsLabel: "PRINTING \u2022 ESTABLISHED \u2022 EQUIPMENT INCLUDED",
    locationLabel: "Raffles Place, Singapore",
    postedAt: daysAgo(1),
    description: "<p>Established printing and signage business with existing corporate clients. Sale includes large-format printer, laminator, and cutting machines.</p>",
    keyDetails: [
      { key: "Business Type", value: "Printing & Signage" },
      { key: "Established",   value: "5 years"            },
    ],
    goodToKnow: [
      { key: "Includes", value: "All equipment & client list" },
    ],
    coordinates: { lat: 1.2840, lng: 103.8515 },
    seller: SELLERS.bizBrokerSG,
  },
];

// ── b2b_service ───────────────────────────────────────────────────────────────
export const SG_BUSINESS_B2B: MockListing[] = [
  {
    id: "biz-sg-b2b-01", href: "/listings/biz-sg-b2b-01", advId: "35011",
    images: [{ src: img(3), alt: "Warehouse logistics" }],
    priceLabel: "Quote on request",
    title: "Bulk Freight & Warehousing \u2014 PSA Port Access",
    detailsLabel: "B2B SERVICE \u2022 LOGISTICS \u2022 SINGAPORE",
    locationLabel: "Jurong, Singapore",
    postedAt: hrsAgo(6),
    description: "<p>End-to-end freight and warehousing services with direct access to PSA terminals. Suitable for SMEs needing bulk import/export handling.</p>",
    keyDetails: [
      { key: "Service Type", value: "Freight & warehousing" },
      { key: "Coverage",     value: "Regional + export"    },
    ],
    goodToKnow: [
      { key: "Contract", value: "Monthly or per-shipment" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.b2bSupplyChainSG,
  },
  {
    id: "biz-sg-b2b-02", href: "/listings/biz-sg-b2b-02", advId: "35012",
    images: [{ src: img(4), alt: "Raw material sourcing" }],
    priceLabel: "Quote on request",
    title: "Raw Material Sourcing \u2014 Electronics & Packaging, Bulk Orders",
    detailsLabel: "B2B SERVICE \u2022 SOURCING \u2022 SINGAPORE",
    locationLabel: "Jurong, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Bulk sourcing service for electronics components and packaging materials, with vetted supplier network across the region.</p>",
    keyDetails: [
      { key: "Service Type", value: "Sourcing" },
    ],
    goodToKnow: [
      { key: "MOQ", value: "Varies by material" },
    ],
    coordinates: { lat: 1.3329, lng: 103.7436 },
    seller: SELLERS.b2bSupplyChainSG,
  },
];

// ── freelance_contractors ─────────────────────────────────────────────────────
export const SG_BUSINESS_FREELANCE: MockListing[] = [
  {
    id: "biz-sg-freelance-01", href: "/listings/biz-sg-freelance-01", advId: "35021",
    images: [{ src: img(5), alt: "IT contractor" }],
    priceLabel: "S$120", priceSuffix: "/ hr",
    title: "Independent IT Infrastructure Contractor \u2014 Short-Term Projects",
    detailsLabel: "CONTRACTOR \u2022 IT INFRASTRUCTURE \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: hrsAgo(9),
    description: "<p>Experienced IT infrastructure contractor available for network setup, server migration, and short-term consulting engagements.</p>",
    keyDetails: [
      { key: "Specialty",  value: "IT Infrastructure" },
      { key: "Experience", value: "12 years"          },
    ],
    goodToKnow: [
      { key: "Availability", value: "2-week notice"  },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.freelanceContractorHubSG,
  },
  {
    id: "biz-sg-freelance-02", href: "/listings/biz-sg-freelance-02", advId: "35022",
    images: [{ src: img(6), alt: "Financial consultant" }],
    priceLabel: "S$150", priceSuffix: "/ hr",
    title: "Freelance Financial Consultant \u2014 Startup Finance & Fundraising",
    detailsLabel: "CONTRACTOR \u2022 FINANCE \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Independent financial consultant specialising in startup finance modelling, cap tables, and fundraising deck preparation.</p>",
    keyDetails: [
      { key: "Specialty", value: "Startup Finance" },
    ],
    goodToKnow: [
      { key: "Engagement", value: "Project-based or hourly" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.freelanceContractorHubSG,
  },
];

// ── partnership ───────────────────────────────────────────────────────────────
export const SG_BUSINESS_PARTNERSHIP: MockListing[] = [
  {
    id: "biz-sg-partner-01", href: "/listings/biz-sg-partner-01", advId: "35031",
    images: [{ src: img(7), alt: "Startup pitch" }],
    priceLabel: "Seeking S$200,000 investment",
    title: "Seeking Co-Founder & Seed Investment \u2014 D2C Skincare Brand",
    detailsLabel: "PARTNERSHIP \u2022 D2C BRAND \u2022 SINGAPORE",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: hrsAgo(11),
    description: "<p>Early-stage D2C skincare brand with existing product line and initial traction, seeking a technical co-founder and seed investment of S$200,000.</p>",
    keyDetails: [
      { key: "Sector", value: "D2C Skincare" },
      { key: "Stage",  value: "Seed"         },
    ],
    goodToKnow: [
      { key: "Equity Offered", value: "Negotiable" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.partnerSeekerSG,
  },
  {
    id: "biz-sg-partner-02", href: "/listings/biz-sg-partner-02", advId: "35032",
    images: [{ src: img(8), alt: "Restaurant partnership" }],
    priceLabel: "Seeking S$80,000 partner investment",
    title: "Seeking Business Partner \u2014 Cloud Kitchen Expansion",
    detailsLabel: "PARTNERSHIP \u2022 CLOUD KITCHEN \u2022 SINGAPORE",
    locationLabel: "Tanjong Pagar, Singapore",
    postedAt: daysAgo(4),
    description: "<p>Profitable single-location cloud kitchen looking for a partner to fund expansion into 2 new locations. Existing operations and recipes proven.</p>",
    keyDetails: [
      { key: "Sector", value: "Cloud Kitchen / F&B" },
    ],
    goodToKnow: [
      { key: "Equity Offered", value: "30% for investment" },
    ],
    coordinates: { lat: 1.2766, lng: 103.8459 },
    seller: SELLERS.partnerSeekerSG,
  },
];

// ── equipment_supplies ────────────────────────────────────────────────────────
export const SG_BUSINESS_EQUIPMENT: MockListing[] = [
  {
    id: "biz-sg-equip-01", href: "/listings/biz-sg-equip-01", advId: "35041",
    images: [{ src: img(9), alt: "Commercial kitchen equipment" }],
    priceLabel: "S$4,500",
    title: "Commercial Kitchen Equipment Set \u2014 Fryer, Griddle, Prep Tables",
    detailsLabel: "EQUIPMENT \u2022 COMMERCIAL KITCHEN \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: hrsAgo(7),
    description: "<p>Complete commercial kitchen equipment set including deep fryer, flat-top griddle, and stainless steel prep tables. Refurbished and tested.</p>",
    keyDetails: [
      { key: "Category",  value: "Commercial Kitchen" },
      { key: "Condition", value: "Refurbished, tested" },
    ],
    goodToKnow: [
      { key: "Warranty", value: "6 months on compressors" },
    ],
    coordinates: { lat: 1.3298, lng: 103.8925 },
    seller: SELLERS.equipSupplySG,
  },
  {
    id: "biz-sg-equip-02", href: "/listings/biz-sg-equip-02", advId: "35042",
    images: [{ src: img(1), alt: "Office furniture" }],
    priceLabel: "S$3,200",
    title: "Office Furniture Bulk Lot \u2014 20 Workstations, Chairs Included",
    detailsLabel: "EQUIPMENT \u2022 OFFICE FURNITURE \u2022 SINGAPORE",
    locationLabel: "Ubi, Singapore",
    postedAt: daysAgo(2),
    description: "<p>Bulk lot of 20 modular office workstations with ergonomic chairs, from a downsizing office. Good condition, minor wear.</p>",
    keyDetails: [
      { key: "Category", value: "Office Furniture" },
      { key: "Quantity", value: "20 sets"          },
    ],
    goodToKnow: [
      { key: "Delivery", value: "Available at extra cost" },
    ],
    coordinates: { lat: 1.3298, lng: 103.8925 },
    seller: SELLERS.equipSupplySG,
  },
];

// ── startup_support ────────────────────────────────────────────────────────────
export const SG_BUSINESS_STARTUP: MockListing[] = [
  {
    id: "biz-sg-startup-01", href: "/listings/biz-sg-startup-01", advId: "35051",
    images: [{ src: img(2), alt: "Co-working space" }],
    priceLabel: "S$450", priceSuffix: "/ mo",
    title: "Startup Co-Working Desk \u2014 Mentorship Programme Included",
    detailsLabel: "STARTUP SUPPORT \u2022 CO-WORKING \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: hrsAgo(13),
    description: "<p>Dedicated desk in a startup-focused co-working space, with access to monthly mentorship sessions and investor networking events.</p>",
    keyDetails: [
      { key: "Includes", value: "Desk + mentorship + events" },
    ],
    goodToKnow: [
      { key: "Contract", value: "Monthly, no lock-in" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.startupSupportHubSG,
  },
  {
    id: "biz-sg-startup-02", href: "/listings/biz-sg-startup-02", advId: "35052",
    images: [{ src: img(3), alt: "Pitch deck workshop" }],
    priceLabel: "S$250", priceSuffix: "/ workshop",
    title: "Pitch Deck & Fundraising Workshop \u2014 For Early-Stage Founders",
    detailsLabel: "STARTUP SUPPORT \u2022 WORKSHOP \u2022 SINGAPORE",
    locationLabel: "One-North, Singapore",
    postedAt: daysAgo(3),
    description: "<p>Half-day workshop covering pitch deck structure, valuation basics, and how to approach angel investors. Small-group format.</p>",
    keyDetails: [
      { key: "Duration",   value: "4 hours" },
      { key: "Batch Size", value: "Max 15 founders" },
    ],
    goodToKnow: [
      { key: "Includes", value: "1-on-1 feedback session" },
    ],
    coordinates: { lat: 1.2996, lng: 103.7876 },
    seller: SELLERS.startupSupportHubSG,
  },
];

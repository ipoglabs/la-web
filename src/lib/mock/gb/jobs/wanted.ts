import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── wanted ────────────────────────────────────────────────────────────────────
export const JOBS_WANTED: MockListing[] = [
  {
    id: "job-want-01", href: "/listings/job-want-01", advId: "30051",
    images: [{ src: img(1), alt: "Data analyst" }],
    priceLabel: "\u00a345,000\u2013\u00a355,000",
    priceSuffix: "/ yr",
    title: "SEEKING: Remote Data Analyst Role — 5 Yrs Exp, SQL & Python",
    detailsLabel: "WANTED • REMOTE • DATA",
    locationLabel: "London (Remote preferred)",
    postedAt: hrsAgo(6),
    description: "<p>Experienced <strong>Data Analyst</strong> with 5 years in FinTech seeking a new fully-remote or hybrid role. Proficient in SQL, Python (pandas, matplotlib), Tableau, and Power BI. Available for interviews immediately.</p>",
    keyDetails: [
      { key: "Experience",  value: "5 years, FinTech"       },
      { key: "Skills",      value: "SQL, Python, Tableau"   },
      { key: "Arrangement", value: "Remote / Hybrid"        },
      { key: "Salary",      value: "£45,000–£55,000"        },
    ],
    goodToKnow: [
      { key: "Availability",   value: "4 weeks notice"          },
      { key: "Education",      value: "BSc Mathematics"          },
      { key: "References",     value: "Available on request"     },
      { key: "Right to Work",  value: "UK permanent"             },
      { key: "Contact Via",    value: "LokalAds message"         },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.recruitPro,
  },
  {
    id: "job-want-02", href: "/listings/job-want-02", advId: "30052",
    images: [{ src: img(2), alt: "Healthcare professional" }],
    priceLabel: "\u00a338,000\u2013\u00a345,000",
    priceSuffix: "/ yr",
    title: "SEEKING: Registered Nurse (Band 5/6) \u2014 London, NHS or Private, Immediate",
    detailsLabel: "WANTED \u2022 ON-SITE \u2022 NURSING",
    locationLabel: "London",
    postedAt: daysAgo(1),
    description: "<p>NMC-registered <strong>Adult Nurse (Band 5/6)</strong> with 6 years post-qualification experience seeking a new position in London. Background in acute medical wards and community care. Available immediately \u2014 enhanced DBS clear, PIN fully active.</p><p>Open to NHS trusts, private hospitals, and community nursing roles. Flexible on hours and shift patterns including nights and weekends.</p>",
    keyDetails: [
      { key: "Experience",   value: "6 years post-qualification" },
      { key: "Registration", value: "NMC \u2014 active PIN"         },
      { key: "Speciality",   value: "Adult general medical"      },
      { key: "Arrangement",  value: "Any \u2014 flexible on shifts"  },
      { key: "Salary",       value: "\u00a338,000\u2013\u00a345,000 sought"  },
    ],
    goodToKnow: [
      { key: "Availability",  value: "Immediate"              },
      { key: "DBS",           value: "Enhanced \u2014 clear"      },
      { key: "References",    value: "2 available on request" },
      { key: "Right to Work", value: "UK permanent"           },
      { key: "Contact Via",   value: "LokalAds message"       },
    ],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    seller: SELLERS.recruitPro,
  },
  {
    id: "job-want-03", href: "/listings/job-want-03", advId: "30053",
    images: [{ src: img(3), alt: "Programme manager" }],
    priceLabel: "\u00a3600\u2013\u00a3750",
    priceSuffix: "/ day",
    title: "SEEKING: Interim Programme Manager \u2014 Digital Transformation, \u00a3600\u2013\u00a3750/day",
    detailsLabel: "WANTED \u2022 HYBRID \u2022 PROGRAMME MANAGEMENT",
    locationLabel: "London",
    postedAt: daysAgo(2),
    description: "<p>Experienced <strong>Senior Programme Manager</strong> (MSP / PRINCE2 Practitioner, SAFe 5) with 12 years in digital transformation and ERP implementations. Sectors: financial services, retail, and public sector.</p><p>Available in 2 weeks. Own Ltd company \u2014 outside IR35 determinations welcome. LinkedIn and 3 references available on request.</p>",
    keyDetails: [
      { key: "Experience",   value: "12 years \u2014 digital transformation" },
      { key: "Certifications", value: "MSP, PRINCE2, SAFe 5 Agilist"  },
      { key: "Arrangement",  value: "Hybrid or remote preferred"      },
      { key: "Day Rate",     value: "\u00a3600\u2013\u00a3750 / day"           },
      { key: "Availability", value: "2 weeks from agreement"          },
    ],
    goodToKnow: [
      { key: "IR35",          value: "Outside \u2014 Ltd company"      },
      { key: "Clearance",     value: "SC cleared (lapsed 2024)"      },
      { key: "References",    value: "3 \u2014 available on request"   },
      { key: "Right to Work", value: "UK permanent"                  },
      { key: "Contact Via",   value: "LokalAds message"              },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.recruitPro,
  },
];


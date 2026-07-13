import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── tech_gadgets ──────────────────────────────────────────────────────────────
export const SERVICES_TECH: MockListing[] = [
  {
    id: "svc-tech-01", href: "/listings/svc-tech-01", advId: "40071",
    images: [{ src: img(2), alt: "Phone repair" }],
    priceLabel: "From £35",
    priceSuffix: "/ repair",
    title: "Phone, Tablet & Laptop Repair — Same-Day London, No Fix No Fee",
    detailsLabel: "TECH SERVICES • CERTIFIED • LONDON",
    locationLabel: "Central London",
    postedAt: hrsAgo(1),
    description: "<p><strong>Certified repair technicians</strong> fixing all major brands — Apple, Samsung, Huawei, Dell, HP, and more. Cracked screens, battery replacements, water damage, and software issues. No fix, no fee guarantee.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Device Repair"       },
      { key: "Coverage",       value: "Central London"      },
      { key: "Turnaround",     value: "Same day possible"   },
      { key: "Qualifications", value: "Apple AASP trained"  },
    ],
    goodToKnow: [
      { key: "Guarantee",  value: "90-day parts warranty"   },
      { key: "No Fix",     value: "No fee charged"          },
      { key: "Walk-in",    value: "No appointment needed"   },
      { key: "Data",       value: "Data preserved always"   },
    ],
    coordinates: { lat: 51.5155, lng: -0.0922 },
    seller: SELLERS.techRepair,
  },
  {
    id: "svc-tech-02", href: "/listings/svc-tech-02", advId: "40072",
    images: [{ src: img(3), alt: "IT support" }],
    priceLabel: "£75",
    priceSuffix: "/ hr",
    title: "Remote IT Support & Setup — Home & Small Business, Same Day",
    detailsLabel: "TECH SERVICES • MICROSOFT • REMOTE / LONDON",
    locationLabel: "London / Remote",
    postedAt: hrsAgo(3),
    description: "<p>Microsoft-certified <strong>IT support technician</strong> offering remote and on-site assistance for homes and small businesses. PC/Mac setup, virus removal, network configuration, Microsoft 365, and CCTV installation.</p>",
    keyDetails: [
      { key: "Service Type",   value: "IT Support"           },
      { key: "Coverage",       value: "Remote + London"      },
      { key: "Availability",   value: "7 days 8am–9pm"       },
      { key: "Qualifications", value: "Microsoft MCSA"        },
    ],
    goodToKnow: [
      { key: "Response",   value: "Within 1 hour remote"    },
      { key: "Remote",     value: "Via AnyDesk/TeamViewer"  },
      { key: "On-site",    value: "London within M25"       },
      { key: "Contract",   value: "Monthly support plans"   },
    ],
    coordinates: { lat: 51.5152, lng: -0.1420 },
    seller: SELLERS.techRepair,
  },
  {
    id: "svc-tech-03", href: "/listings/svc-tech-03", advId: "40073",
    images: [{ src: img(4), alt: "Smart home installation" }],
    priceLabel: "From £150",
    priceSuffix: "/ job",
    title: "Smart Home & Home Automation — Alexa, Hive, Ring & CCTV Install",
    detailsLabel: "TECH SERVICES • SMART HOME • GREATER LONDON",
    locationLabel: "Greater London",
    postedAt: daysAgo(2),
    description: "<p>Certified <strong>smart home installer</strong> covering Greater London. Alexa/Google Home ecosystems, Hive heating, Ring doorbells, CCTV, and multi-room audio. Full setup, testing, and user training included.</p>",
    keyDetails: [
      { key: "Service Type",   value: "Smart Home Install"   },
      { key: "Coverage",       value: "Greater London"       },
      { key: "Availability",   value: "Mon–Sat 9am–6pm"      },
      { key: "Qualifications", value: "Google Pro, trained"   },
    ],
    goodToKnow: [
      { key: "Quote",     value: "Free on-site survey"     },
      { key: "Warranty",  value: "12 months on install"    },
      { key: "Training",  value: "User training included"  },
      { key: "Support",   value: "30-day aftercare hotline" },
    ],
    coordinates: { lat: 51.5181, lng: -0.0820 },
    seller: SELLERS.techRepair,
  },
];


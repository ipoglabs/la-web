import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── medical ────────────────────────────────────────────────────────────────────
export const HEALTH_MEDICAL: MockListing[] = [
  {
    id: "hb-med-01", href: "/listings/hb-med-01", advId: "12021",
    images: [{ src: img(5), alt: "Private clinic" }],
    priceLabel: "From £150",
    priceSuffix: "/ consultation",
    title: "Private GP Clinic — Same-Day Appointments, Full Health Checks",
    detailsLabel: "MEDICAL • PRIVATE GP • LONDON",
    locationLabel: "Harley Street, London",
    postedAt: hrsAgo(3),
    description: "<p>CQC-registered <strong>private GP clinic</strong> on Harley Street offering same-day and next-day appointments. GP consultations, full health MOTs, travel vaccinations, STI testing, and repeat prescriptions. Easy online booking.</p>",
    keyDetails: [
      { key: "Services",      value: "GP, health MOTs, vaccines" },
      { key: "Location",      value: "Harley Street, W1"         },
      { key: "Appointments",  value: "Same/next day available"   },
      { key: "Registered",    value: "CQC registered"            },
    ],
    goodToKnow: [
      { key: "Insurance",  value: "All major insurers accepted" },
      { key: "Online",     value: "Video consultations avail."  },
      { key: "Prescriptions", value: "Electronic, same day"    },
      { key: "Parking",    value: "NCP Welbeck Street"         },
    ],
    coordinates: { lat: 51.5218, lng: -0.1466 },
    seller: SELLERS.wellnessHub,
  },
  {
    id: "hb-med-02", href: "/listings/hb-med-02", advId: "12022",
    images: [{ src: img(6), alt: "Dental clinic" }],
    priceLabel: "From £65",
    priceSuffix: "/ check-up",
    title: "Private Dental Practice — NHS + Private, Invisalign Provider, Clapham",
    detailsLabel: "MEDICAL • DENTAL • CLAPHAM",
    locationLabel: "Clapham, London",
    postedAt: daysAgo(1),
    description: "<p>GDC-registered <strong>private and NHS dental practice</strong> in Clapham accepting new patients. Check-ups, hygienist, fillings, teeth whitening, and Invisalign. Emergency appointments available. Family-friendly practice.</p>",
    keyDetails: [
      { key: "Services",   value: "Check-up, hygiene, Invisalign" },
      { key: "NHS",        value: "NHS + Private patients"       },
      { key: "Emergency",  value: "Same-day when available"     },
      { key: "Registered", value: "GDC registered"              },
    ],
    goodToKnow: [
      { key: "New Patients", value: "Accepting now"            },
      { key: "X-rays",       value: "Digital, on-site"         },
      { key: "Finance",      value: "0% dental finance avail." },
      { key: "Parking",      value: "Free 30-min outside"      },
    ],
    coordinates: { lat: 51.4624, lng: -0.1380 },
    seller: SELLERS.wellnessHub,
  },
  {
    id: "hb-med-03", href: "/listings/hb-med-03", advId: "12023",
    images: [{ src: img(7), alt: "Physiotherapy clinic" }],
    priceLabel: "£85",
    priceSuffix: "/ session",
    title: "Sports Physiotherapy Clinic — MSc Physio, Online Booking, Hackney",
    detailsLabel: "MEDICAL • PHYSIOTHERAPY • HACKNEY",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(2),
    description: "<p>HCPC-registered <strong>sports physiotherapist</strong> in Hackney specialising in running injuries, back pain, and post-surgical rehab. 45-minute assessment sessions. Sports massage also available. Online booking, late evening slots.</p>",
    keyDetails: [
      { key: "Specialisms",  value: "Sports injuries, back pain" },
      { key: "Session",      value: "45-min assessment"          },
      { key: "Registered",   value: "HCPC + CSP member"          },
      { key: "Booking",      value: "Online, same week avail."   },
    ],
    goodToKnow: [
      { key: "Evening Slots", value: "Until 9pm Tue/Thu"        },
      { key: "Massage",      value: "Sports massage from £60"   },
      { key: "Insurance",    value: "AXA, BUPA, Vitality"       },
      { key: "Rehab Plans",  value: "Included in assessment"    },
    ],
    coordinates: { lat: 51.5478, lng: -0.0759 },
    seller: SELLERS.wellnessHub,
  },
];


import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── service ───────────────────────────────────────────────────────────────────
export const PETS_SERVICE: MockListing[] = [
  {
    id: "pet-svc-01", href: "/listings/pet-svc-01", advId: "60021",
    images: [{ src: img(5), alt: "Dog groomer" }],
    priceLabel: "From £35",
    priceSuffix: "/ groom",
    title: "Mobile Dog Groomer — All Breeds, Doorstep Service, London",
    detailsLabel: "PET SERVICE • CERTIFIED • LONDON",
    locationLabel: "Greater London",
    postedAt: hrsAgo(2),
    description: "<p>Fully qualified, insured <strong>mobile dog groomer</strong> coming directly to your door. Fully-equipped van, stress-free environment, and no salon waiting. All breeds and sizes. Puppy intro sessions available.</p>",
    keyDetails: [
      { key: "Service",       value: "Mobile dog grooming"  },
      { key: "Coverage",      value: "Greater London"       },
      { key: "Availability",  value: "Mon–Sat by appt."     },
      { key: "Qualifications", value: "City & Guilds cert." },
    ],
    goodToKnow: [
      { key: "Insurance",   value: "£1M public liability" },
      { key: "Puppy Intro", value: "Available on request" },
      { key: "Booking",     value: "48hr advance notice"  },
      { key: "Payment",     value: "Card or cash"         },
    ],
    coordinates: { lat: 51.4934, lng: -0.2671 },
    seller: SELLERS.petShop,
  },
  {
    id: "pet-svc-02", href: "/listings/pet-svc-02", advId: "60022",
    images: [{ src: img(6), alt: "Dog boarding kennels" }],
    priceLabel: "From £25",
    priceSuffix: "/ night",
    title: "Licensed Dog Boarding — Home Environment, Max 4 Dogs, Croydon",
    detailsLabel: "PET SERVICE • LICENSED • CROYDON",
    locationLabel: "Croydon, Surrey",
    postedAt: daysAgo(1),
    description: "<p>Licensed <strong>home dog boarder</strong> offering overnight and holiday care in a family home environment. Maximum 4 dogs at a time. Daily walks, updates, and photos included. First meet required before booking.</p>",
    keyDetails: [
      { key: "Service",      value: "Dog boarding"           },
      { key: "Coverage",     value: "Croydon + Surrey"       },
      { key: "Availability", value: "365 days"               },
      { key: "Licence",      value: "Council licensed"       },
    ],
    goodToKnow: [
      { key: "Max Dogs",  value: "4 at a time"           },
      { key: "Meet",      value: "Required before first stay" },
      { key: "Updates",   value: "Daily photos via WhatsApp" },
      { key: "Vaccines",  value: "Up-to-date req."        },
    ],
    coordinates: { lat: 51.3762, lng: -0.0982 },
    seller: SELLERS.petShop,
  },
  {
    id: "pet-svc-03", href: "/listings/pet-svc-03", advId: "60023",
    images: [{ src: img(7), alt: "Dog training class" }],
    priceLabel: "£18",
    priceSuffix: "/ session",
    title: "Dog Training Classes — Puppy to Advanced, IMDT Accredited, Hackney",
    detailsLabel: "PET SERVICE • IMDT ACCREDITED • HACKNEY",
    locationLabel: "Hackney, London",
    postedAt: daysAgo(3),
    description: "<p>IMDT-accredited <strong>dog trainer</strong> offering group and 1-to-1 classes in Hackney. Puppy socialisation, basic obedience, recall, and advanced skills. Positive reinforcement methods only.</p>",
    keyDetails: [
      { key: "Service",       value: "Dog training classes"  },
      { key: "Coverage",      value: "Hackney, E London"     },
      { key: "Availability",  value: "Weekday eves + Sat"    },
      { key: "Qualifications", value: "IMDT accredited"      },
    ],
    goodToKnow: [
      { key: "Method",    value: "Positive reinforcement only" },
      { key: "Class Size", value: "Max 6 dogs"               },
      { key: "Trial",     value: "First class 50% off"       },
      { key: "Booking",   value: "Via LokalAds message"      },
    ],
    coordinates: { lat: 51.5465, lng: -0.0554 },
    seller: SELLERS.petShop,
  },
];


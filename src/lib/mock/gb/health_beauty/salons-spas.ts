import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── salons_spas ────────────────────────────────────────────────────────────────
export const HEALTH_SALONS: MockListing[] = [
  {
    id: "hb-salon-01", href: "/listings/hb-salon-01", advId: "12011",
    images: [{ src: img(3), alt: "Luxury spa" }],
    priceLabel: "From £60",
    priceSuffix: "/ treatment",
    title: "Luxury Day Spa — Massages, Facials, Body Wraps, Central London",
    detailsLabel: "SPA • LUXURY • CENTRAL LONDON",
    locationLabel: "Mayfair, London",
    postedAt: hrsAgo(2),
    description: "<p>Award-winning <strong>luxury day spa</strong> in the heart of Mayfair. Signature Swedish and hot stone massages, HydraFacials, body wraps, and more. Private treatment suites, relaxation lounge, and refreshments included.</p>",
    keyDetails: [
      { key: "Services",    value: "Massage, facials, wraps" },
      { key: "Location",    value: "Mayfair, W1"             },
      { key: "Hours",       value: "Mon–Sun 9am–8pm"         },
      { key: "Duration",    value: "60–120 min treatments"   },
    ],
    goodToKnow: [
      { key: "Booking",    value: "Advance booking advised"  },
      { key: "Gift Cards", value: "Available"                },
      { key: "Packages",   value: "Couples packages £150+"  },
      { key: "Parking",    value: "NCP discounted nearby"   },
    ],
    coordinates: { lat: 51.5107, lng: -0.1471 },
    seller: SELLERS.spaLux,
  },
  {
    id: "hb-salon-02", href: "/listings/hb-salon-02", advId: "12012",
    images: [{ src: img(4), alt: "Hair salon" }],
    priceLabel: "From £45",
    priceSuffix: "/ cut",
    title: "Award-Winning Hair Salon — Colour Specialists, Islington",
    detailsLabel: "SALON • HAIR & COLOUR • ISLINGTON",
    locationLabel: "Islington, London",
    postedAt: daysAgo(1),
    description: "<p>Creative <strong>colour specialist hair salon</strong> in Islington. Balayage, highlights, fashion colour, and keratin treatments. All stylists trained at L'Oréal Academie. New clients: 20% off first appointment.</p>",
    keyDetails: [
      { key: "Services",   value: "Cut, colour, treatments"  },
      { key: "Speciality", value: "Balayage & fashion colour" },
      { key: "Hours",      value: "Tue–Sat 9am–7pm"          },
      { key: "Training",   value: "L'Oréal Academie"         },
    ],
    goodToKnow: [
      { key: "New Client",  value: "20% off first visit"     },
      { key: "Products",    value: "L'Oréal & Olaplex"       },
      { key: "Booking",     value: "Online or call"          },
      { key: "Parking",     value: "Pay & display nearby"    },
    ],
    coordinates: { lat: 51.5369, lng: -0.1027 },
    seller: SELLERS.spaLux,
  },
  {
    id: "hb-salon-03", href: "/listings/hb-salon-03", advId: "12013",
    images: [{ src: img(5), alt: "Mobile beauty therapist" }],
    priceLabel: "From £35",
    priceSuffix: "/ treatment",
    title: "Mobile Beauty Therapist — Nails, Lashes & Waxing at Your Home, SE London",
    detailsLabel: "SALON • MOBILE BEAUTY • SE LONDON",
    locationLabel: "SE London (mobile)",
    postedAt: hrsAgo(4),
    description: "<p>Fully qualified, insured <strong>mobile beauty therapist</strong> covering SE London. Gel nails, classic and hybrid lashes, waxing, and brow shaping — all in the comfort of your home. Weekday and weekend slots available.</p>",
    keyDetails: [
      { key: "Services",    value: "Nails, lashes, waxing, brows" },
      { key: "Coverage",    value: "SE London (mobile)"           },
      { key: "Availability", value: "Weekdays + weekends"         },
      { key: "Travel Fee",  value: "Free within SE postcode"      },
    ],
    goodToKnow: [
      { key: "Qualifications", value: "NVQ Level 3 Beauty"      },
      { key: "Insurance",     value: "Fully insured"            },
      { key: "Products",      value: "CND, Lash Perfect"        },
      { key: "Booking",       value: "24hrs+ notice required"   },
    ],
    coordinates: { lat: 51.4741, lng: -0.0686 },
    seller: SELLERS.spaLux,
  },
];


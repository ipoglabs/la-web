import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── wanted ────────────────────────────────────────────────────────────────────
export const VEHICLES_WANTED: MockListing[] = [
  {
    id: "veh-want-01", href: "/listings/veh-want-01", advId: "20061",
    images: [{ src: img(7), alt: "Wanted estate car" }],
    priceLabel: "Up to £5,000",
    title: "WANTED: Reliable Estate Car — Low Mileage, Any Brand",
    detailsLabel: "WANTED • ESTATE • ANY FUEL",
    locationLabel: "South London",
    postedAt: hrsAgo(8),
    description: "<p>Growing family seeking a reliable <strong>estate car</strong> in good condition. Budget up to £5,000. Prefer under 80,000 miles and a clean MOT. Happy to view immediately — cash ready.</p>",
    keyDetails: [
      { key: "Budget",     value: "Up to \u00a35,000"        },
      { key: "Body Type",  value: "Estate"              },
      { key: "Mileage",    value: "< 80,000 preferred"  },
      { key: "Year Range", value: "2010 or newer"       },
      { key: "Fuel",       value: "Petrol or Diesel"    },
      { key: "Timeline",   value: "ASAP"                },
    ],
    goodToKnow: [
      { key: "Cash Buyer",  value: "Yes — immediate"       },
      { key: "Finance",     value: "Not required"          },
      { key: "Inspection",  value: "Happy to view today"   },
      { key: "Contact",     value: "Message via LokalAds"  },
    ],
    coordinates: { lat: 51.4613, lng: -0.1157 },
    seller: SELLERS.dave,
  },
  {
    id: "veh-want-02", href: "/listings/veh-want-02", advId: "20062",
    images: [{ src: img(8), alt: "Wanted naked sports bike" }],
    priceLabel: "Up to \u00a34,500",
    title: "WANTED: Naked Sports Bike \u2014 A Licence Holder, Budget \u00a34,500",
    detailsLabel: "WANTED \u2022 NAKED BIKE \u2022 ANY BRAND",
    locationLabel: "East London",
    postedAt: hrsAgo(10),
    description: "<p>Full A-licence holder seeking a <strong>naked sports or roadster motorcycle</strong> up to 750cc. Ideal makes: Yamaha MT-07, Honda CB650R, Kawasaki Z650, or similar. Budget firm at \u00a34,500. Cash ready, can view today or tomorrow.</p>",
    keyDetails: [
      { key: "Budget",     value: "Up to \u00a34,500"           },
      { key: "Style",      value: "Naked / Roadster"          },
      { key: "Engine CC",  value: "Up to 750cc"               },
      { key: "Year Range", value: "2016 or newer"             },
      { key: "Mileage",    value: "< 25,000 preferred"        },
      { key: "Timeline",   value: "ASAP"                      },
    ],
    goodToKnow: [
      { key: "Cash Buyer", value: "Yes \u2014 immediate"    },
      { key: "Licence",    value: "Full A licence"           },
      { key: "Inspection", value: "Can view today"          },
      { key: "Contact",    value: "Message via LokalAds"    },
    ],
    coordinates: { lat: 51.5277, lng: -0.0124 },
    seller: SELLERS.dave,
  },
  {
    id: "veh-want-03", href: "/listings/veh-want-03", advId: "20063",
    images: [{ src: img(9), alt: "Wanted panel van" }],
    priceLabel: "Up to \u00a312,000",
    title: "WANTED: Medium Panel Van \u2014 ULEZ Compliant, Under 80K Miles",
    detailsLabel: "WANTED \u2022 PANEL VAN \u2022 ULEZ",
    locationLabel: "North London",
    postedAt: daysAgo(1),
    description: "<p>Small plumbing business seeking a <strong>Transit or Vivaro-size panel van</strong> for tool and equipment transport in London. Must be ULEZ compliant and under 80,000 miles. Budget up to \u00a312,000 including VAT. No auction vehicles or ex-rental please.</p>",
    keyDetails: [
      { key: "Budget",     value: "Up to \u00a312,000 inc VAT"  },
      { key: "Size",       value: "Medium panel van (L2)"      },
      { key: "ULEZ",       value: "Must be compliant"          },
      { key: "Mileage",    value: "< 80,000 miles"             },
      { key: "Year Range", value: "2016 or newer"              },
      { key: "Timeline",   value: "Within 2 weeks"             },
    ],
    goodToKnow: [
      { key: "Cash Buyer", value: "Yes"                     },
      { key: "Finance",    value: "Open to part-finance"    },
      { key: "Inspection", value: "Can view any time"       },
      { key: "Contact",    value: "Message via LokalAds"   },
    ],
    coordinates: { lat: 51.5535, lng: -0.1073 },
    seller: SELLERS.dave,
  },
];


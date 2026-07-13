import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── staycations ────────────────────────────────────────────────────────────────
export const TRAVEL_STAYCATIONS: MockListing[] = [
  {
    id: "travel-stay-01", href: "/listings/travel-stay-01", advId: "14031",
    images: [{ src: img(6), alt: "Lake District cottage" }],
    priceLabel: "£220",
    priceSuffix: "/ night",
    title: "Lake District Stone Cottage — 3 Bed, Dog-Friendly, Hot Tub",
    detailsLabel: "STAYCATION • 3 BED • LAKE DISTRICT",
    locationLabel: "Ambleside, Lake District",
    postedAt: hrsAgo(5),
    description: "<p>Gorgeous <strong>renovated stone cottage</strong> near Ambleside with private hot tub, open fire, and stunning fell views. 3 bedrooms (sleeps 6), fully equipped kitchen, fast WiFi, and enclosed garden. Dogs very welcome.</p>",
    keyDetails: [
      { key: "Bedrooms",  value: "3 (sleeps 6)"            },
      { key: "Hot Tub",   value: "Private — included"      },
      { key: "Dogs",      value: "Welcome (max 2)"         },
      { key: "Fire",      value: "Wood-burning stove"      },
    ],
    goodToKnow: [
      { key: "Min. Stay",  value: "3 nights"               },
      { key: "Check-in",   value: "4pm / Check-out 10am"   },
      { key: "Nearest",    value: "Ambleside village 1 mile" },
      { key: "Booking",    value: "Advance booking advised" },
    ],
    coordinates: { lat: 54.4299, lng: -2.9624 },
    seller: SELLERS.hotelMgr,
  },
  {
    id: "travel-stay-02", href: "/listings/travel-stay-02", advId: "14032",
    images: [{ src: img(7), alt: "Glamping pod" }],
    priceLabel: "£95",
    priceSuffix: "/ night",
    title: "Luxury Glamping Pod — Hot Tub, Fire Pit, Countryside, Surrey Hills",
    detailsLabel: "STAYCATION • GLAMPING • SURREY HILLS",
    locationLabel: "Surrey Hills, Surrey",
    postedAt: daysAgo(1),
    description: "<p>Stunning <strong>insulated glamping pod</strong> in the Surrey Hills AONB. King bed, underfloor heating, private hot tub, and fire pit. Breakfast hamper included. 45 minutes from London by train — perfect 2-night escape.</p>",
    keyDetails: [
      { key: "Type",      value: "Luxury insulated pod"    },
      { key: "Hot Tub",   value: "Private, always on"     },
      { key: "Breakfast", value: "Hamper included"        },
      { key: "From London", value: "45 min by train"       },
    ],
    goodToKnow: [
      { key: "Min. Stay",  value: "2 nights"               },
      { key: "Adults Only", value: "18+ guests"            },
      { key: "Pets",       value: "Not permitted"          },
      { key: "Check-in",   value: "3pm / Check-out 11am"   },
    ],
    coordinates: { lat: 51.2095, lng: -0.4254 },
    seller: SELLERS.hotelMgr,
  },
  {
    id: "travel-stay-03", href: "/listings/travel-stay-03", advId: "14033",
    images: [{ src: img(8), alt: "Canal boat" }],
    priceLabel: "£175",
    priceSuffix: "/ night",
    title: "Narrowboat Holiday — Self-Drive Canal Boat, Oxford Canal, 3–7 Nights",
    detailsLabel: "STAYCATION • CANAL BOAT • OXFORD CANAL",
    locationLabel: "Banbury, Oxfordshire",
    postedAt: daysAgo(2),
    description: "<p>Hire a <strong>self-drive narrowboat</strong> from Banbury on the Oxford Canal. 58ft boat sleeps 4–6. Full training provided — no licence needed. Cruise through villages, countryside, and market towns at your own pace.</p>",
    keyDetails: [
      { key: "Boat",      value: "58ft narrowboat"          },
      { key: "Sleeps",    value: "4–6"                     },
      { key: "Duration",  value: "3–7 nights"              },
      { key: "Licence",   value: "None required"           },
    ],
    goodToKnow: [
      { key: "Training",  value: "Full handover included"  },
      { key: "Linen",     value: "Provided"               },
      { key: "Fuel",      value: "Diesel topped up by you" },
      { key: "Dogs",      value: "Welcome (one small–med)" },
    ],
    coordinates: { lat: 52.0629, lng: -1.3396 },
    seller: SELLERS.hotelMgr,
  },
];


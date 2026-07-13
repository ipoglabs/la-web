import type { MockListing } from "../../mock-listing-schema";
import { SELLERS } from "../shared-sellers";

const img     = (n: number) => `/img/img${((n - 1) % 9) + 1}.jpg`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const hrsAgo  = (n: number) => new Date(Date.now() - n *  3_600_000).toISOString();
// ── kids_clothing ──────────────────────────────────────────────────────────────
export const BABY_CLOTHING: MockListing[] = [
  {
    id: "baby-cloth-01", href: "/listings/baby-cloth-01", advId: "15021",
    images: [{ src: img(4), alt: "Kids clothing bundle" }],
    priceLabel: "£30",
    title: "Boys Clothing Bundle Age 3-4 — 20 Items, Next/M&S, Good Cond.",
    detailsLabel: "KIDS CLOTHING • GOOD • BOYS AGE 3-4",
    locationLabel: "Tooting, London",
    postedAt: daysAgo(2),
    description: "<p>Large <strong>boys clothing bundle age 3-4</strong> — 20 items including t-shirts, joggers, jeans, pyjamas, and lightweight jacket. Mainly Next and M&S. Good condition throughout — washed and ready. Non-smoking home.</p>",
    keyDetails: [
      { key: "Quantity",   value: "20 items"              },
      { key: "Age",        value: "3–4 years"             },
      { key: "Brands",     value: "Next, M&S"             },
      { key: "Condition",  value: "Good"                  },
    ],
    goodToKnow: [
      { key: "Smoke Free", value: "Yes"                   },
      { key: "Washed",     value: "Yes — ready to wear"   },
      { key: "Collection", value: "Tooting, SW17"         },
      { key: "Bundle",     value: "Sold as whole lot"     },
    ],
    coordinates: { lat: 51.4275, lng: -0.1670 },
    seller: SELLERS.babyShop,
  },
  {
    id: "baby-cloth-02", href: "/listings/baby-cloth-02", advId: "15022",
    images: [{ src: img(5), alt: "Girls party dresses" }],
    priceLabel: "£22",
    title: "Girls Party Dresses Bundle — Age 6–7, 5 Dresses, Excellent Cond.",
    detailsLabel: "KIDS CLOTHING • EXCELLENT • GIRLS AGE 6-7",
    locationLabel: "Richmond, London",
    postedAt: hrsAgo(4),
    description: "<p>Bundle of <strong>5 girls party and occasion dresses</strong>, age 6–7. Includes: 2 John Lewis, 1 Monsoon, 1 H&M Conscious, 1 Zara. All in excellent condition — each worn once or twice. Colours: white, pink, ivory, coral, and navy.</p>",
    keyDetails: [
      { key: "Quantity",  value: "5 dresses"              },
      { key: "Age",       value: "6–7 years"              },
      { key: "Brands",    value: "JL, Monsoon, Zara, H&M" },
      { key: "Condition", value: "Excellent — worn once"  },
    ],
    goodToKnow: [
      { key: "Washed",     value: "Yes, freshly laundered" },
      { key: "Collection", value: "Richmond, TW10"         },
      { key: "Postage",    value: "Available (£4 tracked)" },
      { key: "Bundle",     value: "Sold as lot or singles" },
    ],
    coordinates: { lat: 51.4613, lng: -0.3037 },
    seller: SELLERS.alice,
  },
  {
    id: "baby-cloth-03", href: "/listings/baby-cloth-03", advId: "15023",
    images: [{ src: img(6), alt: "Baby winter bundle" }],
    priceLabel: "£18",
    title: "Baby Winter Bundle 9–12 Months — 25+ Items inc. Snowsuit, Hats, Mittens",
    detailsLabel: "KIDS CLOTHING • GOOD • BABY 9-12 MONTHS",
    locationLabel: "Lewisham, London",
    postedAt: daysAgo(3),
    description: "<p>Huge <strong>baby winter bundle 9–12 months</strong> — 25+ items including a Joules snowsuit (worn twice), bodysuits, sleepsuits, hats, mittens, and a fleece jacket. Mix of boy-neutral colours (whites, creams, grey). Smoke-free pet-free home.</p>",
    keyDetails: [
      { key: "Quantity",  value: "25+ items"                   },
      { key: "Age",       value: "9–12 months"                 },
      { key: "Includes",  value: "Snowsuit, sleepsuits, hats"  },
      { key: "Condition", value: "Good — thoroughly cleaned"   },
    ],
    goodToKnow: [
      { key: "Smoke Free", value: "Yes"                      },
      { key: "Pet Free",   value: "Yes"                      },
      { key: "Collection", value: "Lewisham, SE13"           },
      { key: "Bundle",     value: "All items together only"  },
    ],
    coordinates: { lat: 51.4613, lng: -0.0116 },
    seller: SELLERS.babyShop,
  },
];


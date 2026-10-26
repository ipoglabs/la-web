import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are what the Fashion & Clothing forms save
// (posting/form-schema/defaults/fashion.ts). Market-specific options
// (Traditional wear, Shoe Size) carry every market's here and are trimmed per
// market in lib/listing-filters.ts.

/** The item Condition scale the marketplace forms save; fashion says "New with Tags". */
const condition: FilterConfig = {
  id: "condition",
  label: "Condition",
  type: "toggle",
  options: [
    { label: "New with Tags", value: "new"          },
    { label: "Like New",      value: "like-new"     },
    { label: "Lightly Used",  value: "lightly-used" },
    { label: "Well Used",     value: "used"         },
    { label: "Heavily Used",  value: "heavily-used" },
  ],
};

const toggle = (id: string, label: string, options: FilterOption[]): FilterConfig => ({ id, label, type: "toggle", options });

const clothingSize = toggle(
  "size",
  "Size",
  ["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((s) => ({ label: s, value: s.toLowerCase() })).concat({ label: "Mixed sizes", value: "mixed" }),
);

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const fashionClothing: MainCategory = {
  id: "fashion_clothing",
  label: "Fashion & Clothing",
  description: "Clothes, shoes, bags, jewellery, and designer finds.",
  icon: "shirt",
  iconBg: "bg-purple-100",
  iconColor: "text-purple-600",
  subcategories: [
    {
      id: "mens_clothing",
      label: "Men's Clothing",
      icon: "shirt",
      filters: [
        toggle("type", "Type", [
          { label: "T-Shirts & Tops",  value: "tops"     },
          { label: "Shirts",           value: "shirts"   },
          { label: "Knitwear",         value: "knitwear" },
          { label: "Jeans & Trousers", value: "bottoms"  },
          { label: "Shorts",           value: "shorts"   },
          { label: "Jackets & Coats",  value: "jackets"  },
          { label: "Suits & Blazers",  value: "suits"    },
          { label: "Sportswear",       value: "sport"    },
          { label: "Other",            value: "other"    },
        ]),
        clothingSize,
        condition,
      ],
    },
    {
      id: "womens_clothing",
      label: "Women's Clothing",
      icon: "shirt",
      filters: [
        toggle("type", "Type", [
          { label: "Tops & Blouses",   value: "tops"     },
          { label: "Dresses",          value: "dresses"  },
          { label: "Skirts",           value: "skirts"   },
          { label: "Jeans & Trousers", value: "bottoms"  },
          { label: "Knitwear",         value: "knitwear" },
          { label: "Jackets & Coats",  value: "jackets"  },
          { label: "Workwear & Suits", value: "workwear" },
          { label: "Activewear",       value: "active"   },
          { label: "Other",            value: "other"    },
        ]),
        clothingSize,
        condition,
      ],
    },
    {
      id: "ethnic_traditional",
      label: "Traditional & Ethnic Wear",
      icon: "star",
      filters: [
        toggle("type", "Type", [
          { label: "Saree",          value: "saree"     },
          { label: "Kurta & Salwar", value: "kurta"     },
          { label: "Lehenga",        value: "lehenga"   },
          { label: "Sherwani",       value: "sherwani"  },
          { label: "Abaya",          value: "abaya"     },
          { label: "African Wear",   value: "african"   },
          { label: "Kebaya",         value: "kebaya"    },
          { label: "Baju Kurung",    value: "baju"      },
          { label: "Cheongsam",      value: "cheongsam" },
          { label: "Other",          value: "other"     },
        ]),
        toggle("gender", "For", [
          { label: "Women", value: "women" },
          { label: "Men",   value: "men"   },
          { label: "Kids",  value: "kids"  },
        ]),
        toggle("occasion", "Occasion", [
          { label: "Wedding",  value: "wedding"  },
          { label: "Festive",  value: "festive"  },
          { label: "Party",    value: "party"    },
          { label: "Everyday", value: "everyday" },
        ]),
        condition,
      ],
    },
    {
      id: "shoes_footwear",
      label: "Shoes & Footwear",
      icon: "footprints",
      filters: [
        toggle("gender", "For", [
          { label: "Men",    value: "men"    },
          { label: "Women",  value: "women"  },
          { label: "Kids",   value: "kids"   },
          { label: "Unisex", value: "unisex" },
        ]),
        toggle("type", "Type", [
          { label: "Trainers & Sneakers", value: "trainers" },
          { label: "Boots",               value: "boots"    },
          { label: "Heels",               value: "heels"    },
          { label: "Flats & Loafers",     value: "flats"    },
          { label: "Sandals",             value: "sandals"  },
          { label: "Formal",              value: "formal"   },
          { label: "Sports Shoes",        value: "sports"   },
          { label: "Slippers",            value: "slippers" },
          { label: "Other",               value: "other"    },
        ]),
        // UK sizes (UK, India) and EU sizes (Singapore); trimmed per market.
        toggle(
          "shoe_size",
          "Shoe Size",
          [...range(3, 13).map((n) => ({ label: `UK ${n}`, value: `uk_${n}` })), ...range(35, 46).map((n) => ({ label: `EU ${n}`, value: `eu_${n}` }))],
        ),
        condition,
      ],
    },
    {
      id: "bags_accessories",
      label: "Bags & Accessories",
      icon: "bag",
      filters: [
        toggle("type", "Type", [
          { label: "Handbag",               value: "handbag"    },
          { label: "Shoulder & Crossbody",  value: "shoulder"   },
          { label: "Tote",                  value: "tote"       },
          { label: "Backpack",              value: "backpack"   },
          { label: "Wallets & Purses",      value: "wallet"     },
          { label: "Luggage & Travel Bags", value: "luggage"    },
          { label: "Belts",                 value: "belt"       },
          { label: "Sunglasses",            value: "sunglasses" },
          { label: "Scarves & Hats",        value: "scarf"      },
          { label: "Other",                 value: "other"      },
        ]),
        toggle("material", "Material", [
          { label: "Leather",        value: "leather"      },
          { label: "Faux Leather",   value: "faux_leather" },
          { label: "Canvas",         value: "canvas"       },
          { label: "Nylon & Fabric", value: "nylon"        },
          { label: "Other",          value: "other"        },
        ]),
        condition,
      ],
    },
    {
      id: "jewellery_watches",
      label: "Jewellery & Watches",
      icon: "gem",
      filters: [
        toggle("type", "Type", [
          { label: "Necklace",      value: "necklace" },
          { label: "Earrings",      value: "earrings" },
          { label: "Bracelet",      value: "bracelet" },
          { label: "Ring",          value: "ring"     },
          { label: "Watch",         value: "watch"    },
          { label: "Jewellery Set", value: "set"      },
          { label: "Other",         value: "other"    },
        ]),
        toggle("metal", "Metal", [
          { label: "Gold",              value: "gold"     },
          { label: "Silver",            value: "silver"   },
          { label: "Platinum",          value: "platinum" },
          { label: "Stainless Steel",   value: "steel"    },
          { label: "Fashion / Costume", value: "costume"  },
          { label: "Other",             value: "other"    },
        ]),
        condition,
      ],
    },
    {
      id: "designer_luxury",
      label: "Designer & Luxury",
      icon: "crown",
      filters: [
        toggle("brand_tier", "Designer", [
          { label: "Louis Vuitton",  value: "lv"       },
          { label: "Gucci",          value: "gucci"    },
          { label: "Prada",          value: "prada"    },
          { label: "Chanel",         value: "chanel"   },
          { label: "Hermès",         value: "hermes"   },
          { label: "Dior",           value: "dior"     },
          { label: "Burberry",       value: "burberry" },
          { label: "Rolex",          value: "rolex"    },
          { label: "Cartier",        value: "cartier"  },
          { label: "Other designer", value: "other"    },
        ]),
        toggle("category", "Category", [
          { label: "Bag",         value: "bag"         },
          { label: "Clothing",    value: "clothing"    },
          { label: "Shoes",       value: "shoes"       },
          { label: "Watch",       value: "watch"       },
          { label: "Jewellery",   value: "jewellery"   },
          { label: "Accessories", value: "accessories" },
        ]),
        toggle("authenticity", "Proof of Authenticity", [
          { label: "Original receipt",           value: "receipt"       },
          { label: "Authenticity certificate",   value: "certificate"   },
          { label: "Authenticated by a service", value: "authenticated" },
          { label: "No proof",                   value: "none"          },
        ]),
        condition,
      ],
    },
    {
      id: "vintage_secondhand",
      label: "Vintage & Preloved",
      icon: "recycle",
      filters: [
        toggle("decade", "Era", [
          { label: "1970s & Earlier", value: "pre70"    },
          { label: "1980s",           value: "80s"      },
          { label: "1990s",           value: "90s"      },
          { label: "2000s (Y2K)",     value: "y2k"      },
          { label: "Recent Preloved", value: "preloved" },
        ]),
        toggle("type", "Type", [
          { label: "Clothing",           value: "clothing"  },
          { label: "Shoes",              value: "shoes"     },
          { label: "Bags & Accessories", value: "bags"      },
          { label: "Jewellery",          value: "jewellery" },
        ]),
        condition,
      ],
    },
  ],
};

import type { FilterConfig, FilterOption, MainCategory } from "../types";

// Option values are what the Home & Furniture forms save
// (posting/form-schema/defaults/home-furniture.ts). Market-specific options
// (Bed Size, Water Purifier) carry every market's here and are trimmed per
// market in lib/listing-filters.ts.

/** The item Condition scale the marketplace forms save. */
const condition: FilterConfig = {
  id: "condition",
  label: "Condition",
  type: "toggle",
  options: [
    { label: "Brand New",    value: "new"          },
    { label: "Like New",     value: "like-new"     },
    { label: "Lightly Used", value: "lightly-used" },
    { label: "Well Used",    value: "used"         },
    { label: "Heavily Used", value: "heavily-used" },
  ],
};

const type = (options: FilterOption[], id = "type", label = "Type"): FilterConfig => ({ id, label, type: "toggle", options });

const seats = (values: string[]): FilterConfig => ({
  id: "seats",
  label: "Seats",
  type: "toggle",
  options: values.map((v) => ({ label: v.replace("plus", "+"), value: v })),
});

const powerSource = (corded: string): FilterConfig => ({
  id: "power_source",
  label: "Power Source",
  type: "toggle",
  options: [
    { label: "Petrol",             value: "petrol"   },
    { label: corded,               value: "corded"   },
    { label: "Cordless (Battery)", value: "cordless" },
    { label: "Manual",             value: "manual"   },
  ],
});

export const homeFurniture: MainCategory = {
  id: "home_furniture",
  label: "Home & Furniture",
  description: "Sofas, appliances, garden gear, decor, and DIY tools.",
  icon: "sofa",
  iconBg: "bg-stone-100",
  iconColor: "text-stone-600",
  subcategories: [
    {
      id: "sofas_seating",
      label: "Sofas & Seating",
      icon: "armchair",
      filters: [
        type([
          { label: "Sofa",                value: "sofa"      },
          { label: "Corner Sofa",         value: "corner"    },
          { label: "Sofa Bed",            value: "sofa_bed"  },
          { label: "Armchair",            value: "armchair"  },
          { label: "Recliner",            value: "recliner"  },
          { label: "Footstool & Ottoman", value: "footstool" },
          { label: "Bench",               value: "bench"     },
          { label: "Other",               value: "other"     },
        ]),
        seats(["1", "2", "3", "4", "5plus"]),
        {
          id: "upholstery",
          label: "Upholstery",
          type: "toggle",
          options: [
            { label: "Fabric",       value: "fabric"       },
            { label: "Leather",      value: "leather"      },
            { label: "Faux Leather", value: "faux_leather" },
            { label: "Velvet",       value: "velvet"       },
            { label: "Other",        value: "other"        },
          ],
        },
        condition,
      ],
    },
    {
      id: "beds_bedroom",
      label: "Beds & Bedroom",
      icon: "bed",
      filters: [
        type(
          [
            { label: "Bed Frame",         value: "bed_frame"    },
            { label: "Mattress",          value: "mattress"     },
            { label: "Bed with Mattress", value: "bed_mattress" },
            { label: "Wardrobe",          value: "wardrobe"     },
            { label: "Chest of Drawers",  value: "drawers"      },
            { label: "Bedside Table",     value: "bedside"      },
            { label: "Dressing Table",    value: "dressing"     },
            { label: "Other",             value: "other"        },
          ],
          "item_type",
          "Item Type",
        ),
        {
          id: "bed_size",
          label: "Bed Size",
          type: "toggle",
          options: [
            { label: "Single",       value: "single"       },
            { label: "Super Single", value: "super_single" },
            { label: "Small Double", value: "small_double" },
            { label: "Double",       value: "double"       },
            { label: "Queen",        value: "queen"        },
            { label: "King",         value: "king"         },
            { label: "Super King",   value: "super_king"   },
          ],
        },
        condition,
      ],
    },
    {
      id: "tables_dining",
      label: "Tables, Desks & Dining",
      icon: "table",
      filters: [
        type([
          { label: "Dining Table",                value: "dining"       },
          { label: "Dining Set (Table + Chairs)", value: "dining_set"   },
          { label: "Desk",                        value: "desk"         },
          { label: "Coffee Table",                value: "coffee"       },
          { label: "Side Table",                  value: "side"         },
          { label: "Dining Chairs",               value: "chairs"       },
          { label: "Office Chair",                value: "office_chair" },
          { label: "Other",                       value: "other"        },
        ]),
        seats(["2", "4", "6", "8plus"]),
        condition,
      ],
    },
    {
      id: "kitchen_appliances",
      label: "Kitchen & Appliances",
      icon: "microwave",
      filters: [
        type([
          { label: "Fridge & Freezer",         value: "fridge"     },
          { label: "Washing Machine",          value: "washing"    },
          { label: "Tumble Dryer",             value: "dryer"      },
          { label: "Dishwasher",               value: "dishwasher" },
          { label: "Microwave & Oven",         value: "microwave"  },
          { label: "Hob & Cooker",             value: "cooker"     },
          { label: "Air Conditioner",          value: "ac"         },
          { label: "Water Purifier",           value: "purifier"   },
          { label: "Vacuum & Air Purifier",    value: "vacuum"     },
          { label: "Small Kitchen Appliances", value: "small"      },
          { label: "Cookware & Kitchenware",   value: "cookware"   },
          { label: "Other",                    value: "other"      },
        ]),
        condition,
      ],
    },
    {
      id: "storage_shelving",
      label: "Storage & Shelving",
      icon: "archive",
      filters: [
        type([
          { label: "Bookcase & Shelving",     value: "bookcase" },
          { label: "Cube Unit",               value: "cube"     },
          { label: "Cabinet & Sideboard",     value: "cabinet"  },
          { label: "TV Unit",                 value: "tv"       },
          { label: "Shoe Rack",               value: "shoe"     },
          { label: "Rack & Utility Shelving", value: "rack"     },
          { label: "Storage Boxes",           value: "box"      },
          { label: "Other",                   value: "other"    },
        ]),
        condition,
      ],
    },
    {
      id: "home_decor",
      label: "Home Decor & Accessories",
      icon: "sparkles",
      filters: [
        type([
          { label: "Rugs & Carpets",       value: "rugs"     },
          { label: "Curtains & Blinds",    value: "curtains" },
          { label: "Wall Art & Prints",    value: "art"      },
          { label: "Mirrors",              value: "mirrors"  },
          { label: "Cushions & Throws",    value: "cushions" },
          { label: "Lamps & Lighting",     value: "lighting" },
          { label: "Vases & Ornaments",    value: "vases"    },
          { label: "Clocks",               value: "clocks"   },
          { label: "Indoor Plants & Pots", value: "plants"   },
          { label: "Festive & Seasonal",   value: "festive"  },
          { label: "Other",                value: "other"    },
        ]),
        condition,
      ],
    },
    {
      id: "garden_outdoor",
      label: "Garden & Outdoor",
      icon: "tree",
      filters: [
        type([
          { label: "Garden Furniture",         value: "furniture" },
          { label: "BBQ & Grills",             value: "bbq"       },
          { label: "Lawnmowers & Power Tools", value: "power"     },
          { label: "Hand Tools",               value: "hand"      },
          { label: "Plants & Seeds",           value: "plants"    },
          { label: "Pots & Planters",          value: "pots"      },
          { label: "Sheds & Storage",          value: "sheds"     },
          { label: "Decking & Fencing",        value: "decking"   },
          { label: "Other",                    value: "other"     },
        ]),
        powerSource("Corded Electric"),
        condition,
      ],
    },
    {
      id: "diy_tools",
      label: "DIY, Tools & Hardware",
      icon: "wrench",
      filters: [
        type([
          { label: "Power Tools",           value: "power"     },
          { label: "Hand Tools",            value: "hand"      },
          { label: "Measuring & Levelling", value: "measuring" },
          { label: "Ladders & Access",      value: "ladders"   },
          { label: "Plumbing",              value: "plumbing"  },
          { label: "Electrical",            value: "electric"  },
          { label: "Flooring & Tiles",      value: "flooring"  },
          { label: "Paint & Decorating",    value: "paint"     },
          { label: "Building Materials",    value: "materials" },
          { label: "Other",                 value: "other"     },
        ]),
        powerSource("Corded"),
        condition,
      ],
    },
  ],
};

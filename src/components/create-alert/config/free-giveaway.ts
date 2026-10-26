import type { FilterConfig, MainCategory } from "../types";

// Option values are what the Free & Giveaway forms save
// (posting/form-schema/defaults/free-giveaway.ts). Market-specific labels
// and options are trimmed per market in lib/listing-filters.ts.

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

export const freeGiveaway: MainCategory = {
  id: "free_giveaway",
  label: "Free & Giveaway",
  description: "Free items — furniture, clothing, electronics, food, and more.",
  icon: "gift",
  iconBg: "bg-green-100",
  iconColor: "text-green-600",
  subcategories: [
    {
      id: "furniture_free",
      label: "Furniture",
      icon: "sofa",
      filters: [
        {
          id: "item_type",
          label: "Item Type",
          type: "toggle",
          options: [
            { label: "Seating",          value: "seating" },
            { label: "Bed & Mattress",   value: "bed"     },
            { label: "Table & Desk",     value: "table"   },
            { label: "Storage",          value: "storage" },
            { label: "Outdoor & Garden", value: "outdoor" },
            { label: "Other",            value: "other"   },
          ],
        },
        condition,
      ],
    },
    {
      id: "clothing_free",
      label: "Clothing",
      icon: "shirt",
      filters: [
        {
          id: "gender",
          label: "For",
          type: "toggle",
          options: [
            { label: "Men",    value: "men"    },
            { label: "Women",  value: "women"  },
            { label: "Kids",   value: "kids"   },
            { label: "Unisex", value: "unisex" },
          ],
        },
        {
          id: "clothing_type",
          label: "Clothing Type",
          type: "toggle",
          options: [
            { label: "Tops",             value: "tops"        },
            { label: "Bottoms",          value: "bottoms"     },
            { label: "Dresses",          value: "dresses"     },
            { label: "Outerwear",        value: "outerwear"   },
            { label: "Shoes",            value: "shoes"       },
            { label: "Traditional Wear", value: "traditional" },
            { label: "Mixed Bundle",     value: "mixed"       },
          ],
        },
        condition,
      ],
    },
    {
      id: "electronics_free",
      label: "Electronics",
      icon: "monitor",
      filters: [
        {
          id: "item_type",
          label: "Item Type",
          type: "toggle",
          options: [
            { label: "Phone & Tablet",           value: "phone"     },
            { label: "Laptop & PC",              value: "laptop"    },
            { label: "TV & Monitor",             value: "tv"        },
            { label: "Audio & Speakers",         value: "audio"     },
            { label: "Console & Games",          value: "gaming"    },
            { label: "Printers & Accessories",   value: "printer"   },
            { label: "Home & Kitchen Appliance", value: "appliance" },
            { label: "Other",                    value: "other"     },
          ],
        },
        {
          id: "working_status",
          label: "Working Status",
          type: "toggle",
          options: [
            { label: "Fully working",           value: "working" },
            { label: "Partly working",          value: "partly"  },
            { label: "Not working (for parts)", value: "parts"   },
          ],
        },
      ],
    },
    {
      id: "food_free",
      label: "Food",
      icon: "utensils",
      filters: [
        {
          id: "food_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Fresh Produce", value: "fresh"    },
            { label: "Packaged",      value: "packaged" },
            { label: "Cooked Meal",   value: "cooked"   },
            { label: "Baked Goods",   value: "baked"    },
            { label: "Other",         value: "other"    },
          ],
        },
        {
          id: "dietary",
          label: "Dietary",
          type: "toggle",
          options: [
            { label: "Vegetarian",  value: "vegetarian"  },
            { label: "Vegan",       value: "vegan"       },
            { label: "Halal",       value: "halal"       },
            { label: "Gluten-Free", value: "gluten_free" },
            { label: "Jain",        value: "jain"        },
            { label: "Eggless",     value: "eggless"     },
          ],
        },
      ],
    },
    {
      id: "kids_items",
      label: "Kids Items",
      icon: "baby",
      filters: [
        {
          id: "item_type",
          label: "Item Type",
          type: "toggle",
          options: [
            { label: "Toys & Games",      value: "toys"     },
            { label: "Strollers & Gear",  value: "gear"     },
            { label: "Nursery & Feeding", value: "nursery"  },
            { label: "Books",             value: "books"    },
            { label: "Clothing",          value: "clothing" },
            { label: "Other",             value: "other"    },
          ],
        },
        {
          id: "age_group",
          label: "Age Group",
          type: "toggle",
          options: [
            { label: "0–2 yrs",  value: "0_2"    },
            { label: "3–5 yrs",  value: "3_5"    },
            { label: "6–12 yrs", value: "6_12"   },
            { label: "12+ yrs",  value: "12plus" },
          ],
        },
        condition,
      ],
    },
    {
      id: "general_free",
      label: "General",
      icon: "package",
      filters: [
        {
          id: "item_category",
          label: "Category",
          type: "toggle",
          options: [
            { label: "Household & Kitchen", value: "household" },
            { label: "Moving & Packing",    value: "packing"   },
            { label: "Books & Media",       value: "books"     },
            { label: "Tools",               value: "tools"     },
            { label: "Garden",              value: "garden"    },
            { label: "DIY & Building",      value: "diy"       },
            { label: "Hobbies & Crafts",    value: "hobbies"   },
            { label: "Other",               value: "other"     },
          ],
        },
        condition,
      ],
    },
  ],
};

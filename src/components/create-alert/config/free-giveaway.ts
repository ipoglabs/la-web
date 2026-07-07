import type { MainCategory } from "../types";

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
            { label: "Sofa / Chair",  value: "seating"  },
            { label: "Bed / Mattress",value: "bed"      },
            { label: "Table / Desk",  value: "table"    },
            { label: "Wardrobe",      value: "wardrobe" },
            { label: "Appliance",     value: "appliance"},
            { label: "Other",         value: "other"    },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",  value: "any"  },
            { label: "Good", value: "good" },
            { label: "Fair", value: "fair" },
            { label: "Worn", value: "worn" },
          ],
        },
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
            { label: "Men",   value: "men"   },
            { label: "Women", value: "women" },
            { label: "Kids",  value: "kids"  },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",  value: "any"  },
            { label: "Good", value: "good" },
            { label: "Fair", value: "fair" },
            { label: "Worn", value: "worn" },
          ],
        },
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
            { label: "Phone / Tablet",  value: "phone"    },
            { label: "Laptop / PC",     value: "laptop"   },
            { label: "TV / Monitor",    value: "tv"       },
            { label: "Console / Games", value: "gaming"   },
            { label: "Kitchen Gadget",  value: "kitchen"  },
            { label: "Other",           value: "other"    },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",       value: "any"      },
            { label: "Working",   value: "working"  },
            { label: "For Parts", value: "parts"    },
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
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Vegan",      value: "vegan"      },
            { label: "Halal",      value: "halal"      },
            { label: "Gluten-Free",value: "gluten_free"},
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
            { label: "Clothing", value: "clothing" },
            { label: "Toys",     value: "toys"     },
            { label: "Gear",     value: "gear"     },
            { label: "Books",    value: "books"    },
            { label: "Other",    value: "other"    },
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
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",  value: "any"  },
            { label: "Good", value: "good" },
            { label: "Fair", value: "fair" },
          ],
        },
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
            { label: "Furniture",    value: "furniture"    },
            { label: "Clothing",     value: "clothing"     },
            { label: "Electronics",  value: "electronics"  },
            { label: "Books / Media",value: "books"        },
            { label: "Tools",        value: "tools"        },
            { label: "Garden",       value: "garden"       },
            { label: "Other",        value: "other"        },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",  value: "any"  },
            { label: "Good", value: "good" },
            { label: "Fair", value: "fair" },
            { label: "Worn", value: "worn" },
          ],
        },
      ],
    },
  ],
};

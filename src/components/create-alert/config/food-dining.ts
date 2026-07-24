import type { MainCategory } from "../types";

export const foodDining: MainCategory = {
  id: "food_dining",
  label: "Food & Dining",
  description: "Home-cooked meals, catering, cloud kitchens, and restaurant deals.",
  icon: "utensils",
  iconBg: "bg-lime-100",
  iconColor: "text-lime-600",
  subcategories: [
    {
      id: "home_cooked",
      label: "Home Cooked Meals",
      icon: "cooking-pot",
      filters: [
        {
          id: "cuisine",
          label: "Cuisine",
          type: "toggle",
          options: [
            { label: "Indian",    value: "indian"    },
            { label: "Chinese",   value: "chinese"   },
            { label: "Western",   value: "western"   },
            { label: "Malay",     value: "malay"     },
            { label: "Other",     value: "other"     },
          ],
        },
        {
          id: "dietary",
          label: "Dietary",
          type: "toggle",
          options: [
            { label: "Veg",      value: "veg"      },
            { label: "Vegan",    value: "vegan"    },
            { label: "Non-Veg",  value: "nonveg"   },
            { label: "Halal",    value: "halal"    },
          ],
        },
      ],
    },
    {
      id: "catering",
      label: "Catering Services",
      icon: "cake",
      filters: [
        {
          id: "event_type",
          label: "Event Type",
          type: "toggle",
          options: [
            { label: "Wedding",    value: "wedding"    },
            { label: "Corporate",  value: "corporate"  },
            { label: "Birthday",   value: "birthday"   },
            { label: "Other",      value: "other"      },
          ],
        },
      ],
    },
    {
      id: "tiffin_services",
      label: "Tiffin Services",
      icon: "package",
      filters: [
        {
          id: "dietary",
          label: "Dietary",
          type: "toggle",
          options: [
            { label: "Veg",     value: "veg"    },
            { label: "Vegan",   value: "vegan"  },
            { label: "Non-Veg", value: "nonveg" },
            { label: "Jain",    value: "jain"   },
          ],
        },
        {
          id: "plan",
          label: "Plan",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "One-off",  value: "oneoff"  },
            { label: "Daily",    value: "daily"   },
            { label: "Weekly",   value: "weekly"  },
            { label: "Monthly",  value: "monthly" },
          ],
        },
      ],
    },
    {
      id: "restaurant_deals",
      label: "Restaurant Deals",
      icon: "tag",
      filters: [
        {
          id: "cuisine",
          label: "Cuisine",
          type: "toggle",
          options: [
            { label: "Indian",    value: "indian"    },
            { label: "Chinese",   value: "chinese"   },
            { label: "Italian",   value: "italian"   },
            { label: "Mexican",   value: "mexican"   },
            { label: "Other",     value: "other"     },
          ],
        },
      ],
    },
    {
      id: "cloud_kitchens",
      label: "Cloud Kitchens",
      icon: "store",
      filters: [],
    },
    {
      id: "baked_goods",
      label: "Baked Goods & Desserts",
      icon: "cookie",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Cakes",     value: "cakes"     },
            { label: "Bread",     value: "bread"     },
            { label: "Cookies",   value: "cookies"   },
            { label: "Pastries",  value: "pastries"  },
            { label: "Other",     value: "other"     },
          ],
        },
      ],
    },
  ],
};

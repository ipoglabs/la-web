import type { MainCategory } from "../types";

export const healthBeauty: MainCategory = {
  id: "health_beauty",
  label: "Health & Beauty",
  description: "Gyms, salons, wellness, fitness, and medical services.",
  icon: "heart",
  iconBg: "bg-fuchsia-100",
  iconColor: "text-fuchsia-600",
  subcategories: [
    {
      id: "gyms_fitness",
      label: "Gyms & Fitness",
      icon: "activity",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Gym",       value: "gym"       },
            { label: "Yoga",      value: "yoga"      },
            { label: "Pilates",   value: "pilates"   },
            { label: "CrossFit",  value: "crossfit"  },
            { label: "Personal Trainer", value: "pt" },
            { label: "Other",     value: "other"     },
          ],
        },
      ],
    },
    {
      id: "salons_spas",
      label: "Salons & Spas",
      icon: "scissors",
      filters: [
        {
          id: "service",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Hair",     value: "hair"     },
            { label: "Nails",    value: "nails"    },
            { label: "Massage",  value: "massage"  },
            { label: "Skincare", value: "skincare" },
            { label: "Other",    value: "other"    },
          ],
        },
      ],
    },
    {
      id: "medical",
      label: "Medical & Therapy",
      icon: "stethoscope",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Doctor",      value: "doctor"      },
            { label: "Dentist",     value: "dentist"     },
            { label: "Physio",      value: "physio"      },
            { label: "Counselling", value: "counselling" },
            { label: "Other",       value: "other"       },
          ],
        },
      ],
    },
    {
      id: "beauty_products",
      label: "Beauty Products",
      icon: "shopping-bag",
      filters: [
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",  value: "any"  },
            { label: "New",  value: "new"  },
            { label: "Used", value: "used" },
          ],
        },
      ],
    },
    {
      id: "wellness",
      label: "Wellness & Nutrition",
      icon: "leaf",
      filters: [
        {
          id: "wellness_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Supplements",   value: "supplements" },
            { label: "Vitamins",      value: "vitamins"    },
            { label: "Protein",       value: "protein"     },
            { label: "Weight Loss",   value: "weight_loss" },
            { label: "Herbal / CBD",  value: "herbal"      },
            { label: "Meal Plans",    value: "meal_plans"  },
            { label: "Other",         value: "other"       },
          ],
        },
        {
          id: "condition",
          label: "Condition",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",  value: "any"  },
            { label: "New",  value: "new"  },
            { label: "Used", value: "used" },
          ],
        },
      ],
    },
  ],
};

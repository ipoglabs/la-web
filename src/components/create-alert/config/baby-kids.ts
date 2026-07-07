import type { MainCategory } from "../types";

export const babyKids: MainCategory = {
  id: "baby_kids",
  label: "Baby & Kids",
  description: "Toys, clothing, childcare, baby gear, and school supplies.",
  icon: "baby",
  iconBg: "bg-yellow-100",
  iconColor: "text-yellow-600",
  subcategories: [
    {
      id: "toys_games",
      label: "Toys & Games",
      icon: "puzzle",
      filters: [
        {
          id: "age_group",
          label: "Age Group",
          type: "toggle",
          options: [
            { label: "0–2 yrs",  value: "0_2"   },
            { label: "3–5 yrs",  value: "3_5"   },
            { label: "6–9 yrs",  value: "6_9"   },
            { label: "10+ yrs",  value: "10plus" },
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
    {
      id: "baby_gear",
      label: "Baby Gear & Equipment",
      icon: "shopping-cart",
      filters: [
        {
          id: "item_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Pram / Stroller", value: "pram"       },
            { label: "Car Seat",        value: "car_seat"   },
            { label: "Cot / Crib",      value: "cot"        },
            { label: "High Chair",      value: "high_chair" },
            { label: "Baby Monitor",    value: "monitor"    },
            { label: "Other",           value: "other"      },
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
    {
      id: "kids_clothing",
      label: "Baby & Kids Clothing",
      icon: "shirt",
      filters: [
        {
          id: "age_group",
          label: "Age Group",
          type: "toggle",
          options: [
            { label: "0–12 months", value: "infant"  },
            { label: "1–3 yrs",     value: "toddler" },
            { label: "4–7 yrs",     value: "young"   },
            { label: "8–14 yrs",    value: "older"   },
          ],
        },
        {
          id: "gender",
          label: "Gender",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Boy",    value: "boy"    },
            { label: "Girl",   value: "girl"   },
            { label: "Unisex", value: "unisex" },
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
    {
      id: "childcare",
      label: "Childcare & Nurseries",
      icon: "heart",
      filters: [
        {
          id: "care_type",
          label: "Care Type",
          type: "toggle",
          options: [
            { label: "Nursery",        value: "nursery"    },
            { label: "Childminder",    value: "childminder"},
            { label: "Nanny / Au Pair",value: "nanny"      },
            { label: "After School",   value: "afterschool"},
            { label: "Holiday Care",   value: "holiday"    },
          ],
        },
      ],
    },
    {
      id: "school_supplies",
      label: "School Supplies & Books",
      icon: "book-open",
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
      id: "kids_activities",
      label: "Kids Classes & Activities",
      icon: "star",
      filters: [
        {
          id: "activity_type",
          label: "Activity",
          type: "toggle",
          options: [
            { label: "Sports",   value: "sports"   },
            { label: "Arts",     value: "arts"     },
            { label: "Music",    value: "music"    },
            { label: "Dance",    value: "dance"    },
            { label: "Coding",   value: "coding"   },
            { label: "Other",    value: "other"    },
          ],
        },
      ],
    },
  ],
};

import type { MainCategory } from "../types";

export const sportsOutdoors: MainCategory = {
  id: "sports_outdoors",
  label: "Sports & Outdoors",
  description: "Equipment, fitness gear, sportswear, and outdoor activities.",
  icon: "trophy",
  iconBg: "bg-green-100",
  iconColor: "text-green-600",
  subcategories: [
    {
      id: "gym_fitness_equipment",
      label: "Fitness Equipment",
      icon: "dumbbell",
      filters: [
        {
          id: "item_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Weights",       value: "weights"    },
            { label: "Treadmill",     value: "treadmill"  },
            { label: "Bike",          value: "bike"       },
            { label: "Bench / Rack",  value: "bench"      },
            { label: "Yoga / Mat",    value: "yoga"       },
            { label: "Other",         value: "other"      },
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
      id: "team_sports",
      label: "Team Sports",
      icon: "users",
      filters: [
        {
          id: "sport",
          label: "Sport",
          type: "toggle",
          options: [
            { label: "Football",  value: "football"  },
            { label: "Cricket",   value: "cricket"   },
            { label: "Basketball",value: "basketball"},
            { label: "Tennis",    value: "tennis"    },
            { label: "Badminton", value: "badminton" },
            { label: "Other",     value: "other"     },
          ],
        },
      ],
    },
    {
      id: "outdoor_adventure",
      label: "Outdoor & Adventure",
      icon: "mountain",
      filters: [
        {
          id: "activity",
          label: "Activity",
          type: "toggle",
          options: [
            { label: "Hiking",    value: "hiking"    },
            { label: "Camping",   value: "camping"   },
            { label: "Climbing",  value: "climbing"  },
            { label: "Cycling",   value: "cycling"   },
            { label: "Running",   value: "running"   },
            { label: "Other",     value: "other"     },
          ],
        },
      ],
    },
    {
      id: "water_sports",
      label: "Water Sports",
      icon: "waves",
      filters: [
        {
          id: "activity",
          label: "Activity",
          type: "toggle",
          options: [
            { label: "Swimming",   value: "swimming"  },
            { label: "Surfing",    value: "surfing"   },
            { label: "Kayaking",   value: "kayaking"  },
            { label: "Diving",     value: "diving"    },
            { label: "Other",      value: "other"     },
          ],
        },
      ],
    },
    {
      id: "sportswear",
      label: "Sportswear & Footwear",
      icon: "shirt",
      filters: [
        {
          id: "gender",
          label: "Gender",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",   value: "any"   },
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
            { label: "New",  value: "new"  },
            { label: "Used", value: "used" },
          ],
        },
      ],
    },
    {
      id: "fitness_coaching",
      label: "Fitness Classes & Coaching",
      icon: "zap",
      filters: [
        {
          id: "type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Personal Training", value: "pt"         },
            { label: "Group Class",       value: "group"      },
            { label: "Online Coaching",   value: "online"     },
            { label: "Martial Arts",      value: "martial"    },
            { label: "Other",             value: "other"      },
          ],
        },
      ],
    },
  ],
};

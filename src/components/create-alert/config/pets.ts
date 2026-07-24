import type { MainCategory } from "../types";
import { conditionFull } from "./shared";

export const pets: MainCategory = {
  id: "pets",
  label: "Pets",
  description: "Adopt, buy or find pet services near you.",
  icon: "paw-print",
  iconBg: "bg-pink-100",
  iconColor: "text-pink-600",
  subcategories: [
    {
      id: "for_sale",
      label: "For Sale",
      icon: "tag",
      filters: [
        {
          id: "animal_type",
          label: "Animal",
          type: "toggle",
          options: [
            { label: "Dog",          value: "dog"     },
            { label: "Cat",          value: "cat"     },
            { label: "Bird",         value: "bird"    },
            { label: "Fish",         value: "fish"    },
            { label: "Rabbit",       value: "rabbit"  },
            { label: "Reptile",      value: "reptile" },
            { label: "Small Animal", value: "small"   },
            { label: "Other",        value: "other"   },
          ],
        },
        {
          id: "pet_age",
          label: "Age",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",    value: "any"    },
            { label: "Baby",   value: "baby"   },
            { label: "Young",  value: "young"  },
            { label: "Adult",  value: "adult"  },
            { label: "Senior", value: "senior" },
          ],
        },
        {
          id: "breed_type",
          label: "Breed",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",         value: "any"   },
            { label: "Pure Breed",  value: "pure"  },
            { label: "Mixed Breed", value: "mixed" },
          ],
        },
        {
          id: "pet_gender",
          label: "Gender",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",    value: "any"    },
            { label: "Male",   value: "male"   },
            { label: "Female", value: "female" },
          ],
        },
      ],
    },
    {
      id: "adoption",
      label: "Adoption",
      icon: "heart",
      filters: [
        {
          id: "animal_type",
          label: "Animal",
          type: "toggle",
          options: [
            { label: "Dog",          value: "dog"    },
            { label: "Cat",          value: "cat"    },
            { label: "Bird",         value: "bird"   },
            { label: "Rabbit",       value: "rabbit" },
            { label: "Small Animal", value: "small"  },
            { label: "Other",        value: "other"  },
          ],
        },
        {
          id: "pet_age",
          label: "Age",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",    value: "any"    },
            { label: "Baby",   value: "baby"   },
            { label: "Young",  value: "young"  },
            { label: "Adult",  value: "adult"  },
            { label: "Senior", value: "senior" },
          ],
        },
        {
          id: "vaccinated",
          label: "Vaccinated",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Yes",      value: "yes"      },
            { label: "No",       value: "no"       },
            { label: "Not Sure", value: "not_sure" },
          ],
        },
        {
          id: "pet_gender",
          label: "Gender",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",    value: "any"    },
            { label: "Male",   value: "male"   },
            { label: "Female", value: "female" },
          ],
        },
      ],
    },
    {
      id: "service",
      label: "Pet Care",
      icon: "scissors",
      filters: [
        {
          id: "service_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Grooming",    value: "grooming"  },
            { label: "Boarding",    value: "boarding"  },
            { label: "Pet Hotel",   value: "hotel"     },
            { label: "Pet Sitting", value: "sitting"   },
            { label: "Walking",     value: "walking"   },
            { label: "Training",    value: "training"  },
            { label: "Vet",         value: "vet"       },
            { label: "Transport",   value: "transport" },
          ],
        },
        {
          id: "for_animal",
          label: "For Animal",
          type: "toggle",
          options: [
            { label: "Dog",   value: "dog"   },
            { label: "Cat",   value: "cat"   },
            { label: "Bird",  value: "bird"  },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "service_mode",
          label: "How",
          type: "toggle",
          options: [
            { label: "Walk-in",    value: "walkin"    },
            { label: "Home Visit", value: "homevisit" },
          ],
        },
      ],
    },
    {
      id: "accessories",
      label: "Accessories",
      icon: "shopping-bag",
      filters: [
        {
          id: "for_animal",
          label: "For Animal",
          type: "toggle",
          options: [
            { label: "Dog",    value: "dog"    },
            { label: "Cat",    value: "cat"    },
            { label: "Bird",   value: "bird"   },
            { label: "Fish",   value: "fish"   },
            { label: "Rabbit", value: "rabbit" },
            { label: "Other",  value: "other"  },
          ],
        },
        conditionFull,
        {
          id: "acc_category",
          label: "Category",
          type: "toggle",
          options: [
            { label: "Food & Treats",  value: "food"     },
            { label: "Cage & Housing", value: "housing"  },
            { label: "Clothing",       value: "clothing" },
            { label: "Toys",           value: "toys"     },
            { label: "Health & Care",  value: "health"   },
            { label: "Grooming",       value: "grooming" },
            { label: "Travel & Carry", value: "travel"   },
          ],
        },
      ],
    },
    {
      id: "lost_found",
      label: "Lost & Found",
      icon: "search",
      filters: [
        {
          id: "lf_status",
          label: "Status",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Lost",  value: "lost"  },
            { label: "Found", value: "found" },
          ],
        },
        {
          id: "animal_type",
          label: "Animal",
          type: "toggle",
          options: [
            { label: "Dog",   value: "dog"   },
            { label: "Cat",   value: "cat"   },
            { label: "Bird",  value: "bird"  },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "pet_size",
          label: "Size",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Small",  value: "small"  },
            { label: "Medium", value: "medium" },
            { label: "Large",  value: "large"  },
          ],
        },
      ],
    },
    {
      id: "wanted",
      label: "Wanted",
      icon: "search",
      filters: [
        {
          id: "pet_intent",
          label: "Looking to",
          type: "toggle",
          options: [
            { label: "Buy",         value: "buy"   },
            { label: "Adopt",       value: "adopt" },
            { label: "Stud / Mate", value: "stud"  },
          ],
        },
        {
          id: "animal_type",
          label: "Animal",
          type: "toggle",
          options: [
            { label: "Dog",          value: "dog"     },
            { label: "Cat",          value: "cat"     },
            { label: "Bird",         value: "bird"    },
            { label: "Fish",         value: "fish"    },
            { label: "Rabbit",       value: "rabbit"  },
            { label: "Reptile",      value: "reptile" },
            { label: "Small Animal", value: "small"   },
            { label: "Other",        value: "other"   },
          ],
        },
        {
          id: "breed_type",
          label: "Breed",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Pure Breed",  value: "pure"  },
            { label: "Mixed Breed", value: "mixed" },
            { label: "Any",         value: "any"   },
          ],
        },
      ],
    },
  ],
};

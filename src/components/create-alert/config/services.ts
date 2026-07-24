import type { MainCategory } from "../types";
import { serviceMode } from "./shared";

export const services: MainCategory = {
  id: "services",
  label: "Services",
  description: "Skilled professionals for every need, from home repairs to tutoring.",
  icon: "wrench",
  iconBg: "bg-teal-100",
  iconColor: "text-teal-600",
  subcategories: [
    {
      id: "home_services",
      label: "Home Services",
      icon: "hammer",
      filters: [
        {
          id: "service_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Cleaning",     value: "cleaning"    },
            { label: "Plumbing",     value: "plumbing"    },
            { label: "Electrical",   value: "electrical"  },
            { label: "Painting",     value: "painting"    },
            { label: "Renovation",   value: "renovation"  },
            { label: "Pest Control", value: "pest"        },
            { label: "AC Service",   value: "ac"          },
            { label: "Landscaping",  value: "landscaping" },
            { label: "Handyman",     value: "handyman"    },
          ],
        },
        {
          id: "frequency",
          label: "Frequency",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",      value: "any"     },
            { label: "One-time", value: "once"    },
            { label: "Weekly",   value: "weekly"  },
            { label: "Monthly",  value: "monthly" },
          ],
        },
        {
          id: "provider",
          label: "Provider",
          type: "toggle",
          options: [
            { label: "Individual", value: "individual" },
            { label: "Company",    value: "company"    },
          ],
        },
      ],
    },
    {
      id: "business_services",
      label: "Business Services",
      icon: "briefcase",
      filters: [
        {
          id: "service_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Accounting", value: "accounting" },
            { label: "Legal",      value: "legal"      },
            { label: "Marketing",  value: "marketing"  },
            { label: "IT Support", value: "it_support" },
            { label: "Logistics",  value: "logistics"  },
            { label: "Security",   value: "security"   },
            { label: "Consulting", value: "consulting" },
            { label: "Printing",   value: "printing"   },
          ],
        },
        {
          id: "provider",
          label: "Provider",
          type: "toggle",
          options: [
            { label: "Freelancer", value: "freelancer" },
            { label: "Agency",     value: "agency"     },
            { label: "Company",    value: "company"    },
          ],
        },
      ],
    },
    {
      id: "health_fitness",
      label: "Health & Fitness",
      icon: "heart-pulse",
      filters: [
        {
          id: "service_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Personal Training", value: "pt"            },
            { label: "Yoga / Pilates",    value: "yoga"          },
            { label: "Massage",           value: "massage"       },
            { label: "Spa",               value: "spa"           },
            { label: "Nutrition",         value: "nutrition"     },
            { label: "Mental Health",     value: "mental_health" },
            { label: "Physiotherapy",     value: "physio"        },
            { label: "Meditation",        value: "meditation"    },
          ],
        },
        serviceMode,
      ],
    },
    {
      id: "tutoring",
      label: "Tutoring",
      icon: "book-open",
      filters: [
        {
          id: "subject",
          label: "Subject",
          type: "toggle",
          options: [
            { label: "Maths",     value: "maths"     },
            { label: "Science",   value: "science"   },
            { label: "English",   value: "english"   },
            { label: "Languages", value: "languages" },
            { label: "Music",     value: "music"     },
            { label: "Coding",    value: "coding"     },
            { label: "Other",     value: "other"     },
          ],
        },
        {
          id: "level",
          label: "Level",
          type: "toggle",
          options: [
            { label: "Primary",   value: "primary"   },
            { label: "Secondary", value: "secondary" },
            { label: "College",   value: "college"   },
            { label: "Adult",     value: "adult"      },
          ],
        },
        serviceMode,
      ],
    },
    {
      id: "education_learning",
      label: "Education & Learning",
      icon: "graduation-cap",
      filters: [
        {
          id: "category",
          label: "Category",
          type: "toggle",
          options: [
            { label: "Languages",       value: "languages" },
            { label: "Music",           value: "music"     },
            { label: "Arts & Crafts",   value: "arts"      },
            { label: "Tech & Coding",   value: "tech"      },
            { label: "Cooking",         value: "cooking"   },
            { label: "Business Skills", value: "business"  },
            { label: "Personal Dev",    value: "personal"  },
          ],
        },
        {
          id: "format",
          label: "Format",
          type: "toggle",
          options: [
            { label: "Class",      value: "class"    },
            { label: "Workshop",   value: "workshop" },
            { label: "Course",     value: "course"   },
            { label: "One-on-one", value: "onetoone" },
          ],
        },
        serviceMode,
      ],
    },
    {
      id: "travel_tourism",
      label: "Travel & Tourism",
      icon: "plane",
      filters: [
        {
          id: "service_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Tour Guide",       value: "tour_guide"   },
            { label: "Travel Agent",     value: "travel_agent" },
            { label: "Visa Assistance",  value: "visa"         },
            { label: "Airport Transfer", value: "transfer"     },
            { label: "Trip Planning",    value: "planning"     },
          ],
        },
        {
          id: "destination_type",
          label: "Destination",
          type: "toggle",
          options: [
            { label: "Domestic",      value: "domestic"      },
            { label: "International", value: "international" },
          ],
        },
      ],
    },
    {
      id: "food_dining",
      label: "Food & Dining",
      icon: "utensils-crossed",
      filters: [
        {
          id: "service_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Catering",      value: "catering"   },
            { label: "Personal Chef", value: "chef"       },
            { label: "Meal Prep",     value: "meal_prep"  },
            { label: "Baking",        value: "baking"     },
            { label: "Bartending",    value: "bartending" },
          ],
        },
        {
          id: "for_event",
          label: "For Event",
          type: "toggle",
          options: [
            { label: "Wedding",   value: "wedding"   },
            { label: "Corporate", value: "corporate" },
            { label: "Birthday",  value: "birthday"  },
            { label: "Daily",     value: "daily"     },
          ],
        },
      ],
    },
    {
      id: "tech_gadgets",
      label: "Technology & Gadgets",
      icon: "cpu",
      filters: [
        {
          id: "service_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Phone Repair",  value: "phone_repair"  },
            { label: "Laptop Repair", value: "laptop_repair" },
            { label: "Smart Home",    value: "smart_home"    },
            { label: "Data Recovery", value: "data"          },
            { label: "IT Support",    value: "it_support"    },
            { label: "3D Printing",   value: "3d_print"      },
          ],
        },
        serviceMode,
      ],
    },
    {
      id: "creative_services",
      label: "Creative Services",
      icon: "palette",
      filters: [
        {
          id: "creative_type",
          label: "Service",
          type: "toggle",
          options: [
            { label: "Photography",    value: "photography"    },
            { label: "Videography",    value: "videography"    },
            { label: "Graphic Design", value: "graphic_design" },
            { label: "Video Editing",  value: "video_editing"  },
            { label: "Copywriting",    value: "copywriting"    },
            { label: "Social Media",   value: "social_media"   },
          ],
        },
        serviceMode,
      ],
    },
    {
      id: "other_services",
      label: "Other Services",
      icon: "more-horizontal",
      filters: [
        {
          id: "service_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Photography", value: "photography" },
            { label: "Videography", value: "videography" },
            { label: "Moving",      value: "moving"      },
            { label: "Pet Care",    value: "pet_care"    },
            { label: "Event Mgmt",  value: "event_mgmt"  },
            { label: "Other",       value: "other"       },
          ],
        },
        serviceMode,
      ],
    },
    {
      id: "wanted",
      label: "Wanted",
      icon: "search",
      filters: [
        {
          id: "service_category",
          label: "Looking For",
          type: "toggle",
          options: [
            { label: "Home Services",    value: "home"      },
            { label: "Business Svcs",    value: "business"  },
            { label: "Health & Fitness", value: "health"    },
            { label: "Tutoring",         value: "tutoring"  },
            { label: "Education",        value: "education" },
            { label: "Travel",           value: "travel"    },
            { label: "Food & Dining",    value: "food"      },
            { label: "Tech & Gadgets",   value: "tech"      },
            { label: "Other",            value: "other"     },
          ],
        },
        serviceMode,
      ],
    },
  ],
};

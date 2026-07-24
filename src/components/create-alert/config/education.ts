import type { MainCategory } from "../types";
import { conditionFull } from "./shared";

export const education: MainCategory = {
  id: "education",
  label: "Education",
  description: "Tutors, courses, coaching centres, and study materials.",
  icon: "graduation-cap",
  iconBg: "bg-sky-100",
  iconColor: "text-sky-600",
  subcategories: [
    {
      id: "tutors",
      label: "Tutors & Coaching",
      icon: "user",
      filters: [
        {
          id: "subject",
          label: "Subject",
          type: "toggle",
          options: [
            { label: "Maths",    value: "maths"    },
            { label: "Science",  value: "science"  },
            { label: "English",  value: "english"  },
            { label: "Languages",value: "languages"},
            { label: "Arts",     value: "arts"     },
            { label: "Other",    value: "other"    },
          ],
        },
        {
          id: "mode",
          label: "Mode",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "In-person", value: "inperson" },
            { label: "Online",    value: "online"   },
            { label: "Both",      value: "both"     },
          ],
        },
      ],
    },
    {
      id: "online_courses",
      label: "Online Courses",
      icon: "monitor",
      filters: [
        {
          id: "category",
          label: "Category",
          type: "toggle",
          options: [
            { label: "Tech",      value: "tech"      },
            { label: "Business",  value: "business"  },
            { label: "Design",    value: "design"    },
            { label: "Languages", value: "languages" },
            { label: "Other",     value: "other"     },
          ],
        },
      ],
    },
    {
      id: "study_materials",
      label: "Study Materials",
      icon: "book",
      filters: [
        {
          id: "material_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Textbooks",   value: "textbooks"   },
            { label: "Notes",       value: "notes"       },
            { label: "Past Papers", value: "past_papers" },
            { label: "Guides",      value: "guides"      },
            { label: "Other",       value: "other"       },
          ],
        },
        conditionFull,
      ],
    },
    {
      id: "schools_colleges",
      label: "Schools & Colleges",
      icon: "building",
      filters: [],
    },
    {
      id: "language_classes",
      label: "Language Classes",
      icon: "globe",
      filters: [
        {
          id: "language",
          label: "Language",
          type: "toggle",
          options: [
            { label: "English",  value: "english"  },
            { label: "Hindi",    value: "hindi"    },
            { label: "Mandarin", value: "mandarin" },
            { label: "French",   value: "french"   },
            { label: "Spanish",  value: "spanish"  },
            { label: "Other",    value: "other"    },
          ],
        },
      ],
    },
  ],
};

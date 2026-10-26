import type { FilterConfig, MainCategory } from "../types";
import { serviceMode } from "./shared";

// Option values are what the Education forms save
// (posting/form-schema/defaults/education.ts). Market-specific lists
// (Level, Curriculum, Language) carry every market's options here and are
// trimmed per market in lib/listing-filters.ts.

/** The item Condition scale the marketplace forms save. */
const itemCondition: FilterConfig = {
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

const format: FilterConfig = {
  id: "format",
  label: "Format",
  type: "toggle",
  options: [
    { label: "In-person", value: "inperson" },
    { label: "Online",    value: "online", icon: "laptop" },
    { label: "Both",      value: "both"     },
  ],
};

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
            { label: "Maths",     value: "maths"     },
            { label: "Science",   value: "science"   },
            { label: "English",   value: "english"   },
            { label: "Languages", value: "languages" },
            { label: "Music",     value: "music"     },
            { label: "Coding",    value: "coding"    },
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
            { label: "Adult",     value: "adult"     },
          ],
        },
        serviceMode,
      ],
    },
    {
      id: "online_courses",
      label: "Courses",
      icon: "monitor",
      filters: [
        {
          id: "category",
          label: "Category",
          type: "toggle",
          options: [
            { label: "Tech & Coding",        value: "tech"      },
            { label: "Business & Marketing", value: "business"  },
            { label: "Design & Creative",    value: "design"    },
            { label: "Languages",            value: "languages" },
            { label: "Exam Prep",            value: "exam"      },
            { label: "Other",                value: "other"     },
          ],
        },
        {
          id: "course_format",
          label: "Format",
          type: "toggle",
          options: [
            { label: "Self-paced",          value: "selfpaced"       },
            { label: "Live online",         value: "live"            },
            { label: "Self-paced + live",   value: "blended"         },
            { label: "In person or online", value: "inperson_online" },
          ],
        },
        {
          id: "duration",
          label: "Duration",
          type: "toggle",
          options: [
            { label: "Under 1 month", value: "1m"        },
            { label: "1–3 months",    value: "3m"        },
            { label: "3–6 months",    value: "6m"        },
            { label: "6+ months",     value: "6mup"      },
            { label: "Self-paced",    value: "selfpaced" },
          ],
        },
        {
          id: "certificate",
          label: "Certificate",
          type: "toggle",
          options: [
            { label: "Accredited",            value: "accredited" },
            { label: "Certificate of completion", value: "completion" },
            { label: "None",                  value: "none"       },
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
            { label: "Textbooks",       value: "textbooks"   },
            { label: "Revision Guides", value: "guides"      },
            { label: "Past Papers",     value: "past_papers" },
            { label: "Own Notes",       value: "notes"       },
            { label: "Other",           value: "other"       },
          ],
        },
        {
          id: "level",
          label: "Level",
          type: "toggle",
          options: [
            { label: "Primary",                 value: "primary"          },
            { label: "Secondary (10th)",        value: "secondary"        },
            { label: "Higher Secondary (12th)", value: "higher-secondary" },
            { label: "Competitive Exams",       value: "competitive"      },
            { label: "GCSE",                    value: "gcse"             },
            { label: "O-Level",                 value: "o_level"          },
            { label: "A-Level",                 value: "a_level"          },
            { label: "University",              value: "university"       },
            { label: "Professional",            value: "professional"     },
          ],
        },
        itemCondition,
      ],
    },
    {
      id: "schools_colleges",
      label: "Schools & Colleges",
      icon: "building",
      filters: [
        {
          id: "ad_type",
          label: "Ad Type",
          type: "toggle",
          options: [
            { label: "Admissions Open", value: "admissions" },
            { label: "Open Day / Event", value: "openday"   },
            { label: "Places Available", value: "places"    },
          ],
        },
        {
          id: "institution_type",
          label: "Type",
          type: "toggle",
          options: [
            { label: "Nursery / Pre-school", value: "nursery"    },
            { label: "Primary",              value: "primary"    },
            { label: "Secondary",            value: "secondary"  },
            { label: "Sixth Form",           value: "sixth"      },
            { label: "College / University", value: "university" },
            { label: "Tuition Centre",       value: "tuition"    },
            { label: "Activity School",      value: "activity"   },
            { label: "Vocational",           value: "vocational" },
          ],
        },
        {
          id: "curriculum",
          label: "Curriculum",
          type: "toggle",
          options: [
            { label: "CBSE",                value: "cbse"        },
            { label: "ICSE",                value: "icse"        },
            { label: "State Board",         value: "state"       },
            { label: "MOE",                 value: "moe"         },
            { label: "National Curriculum", value: "national"    },
            { label: "Independent",         value: "independent" },
            { label: "IB",                  value: "ib"          },
            { label: "IGCSE",               value: "igcse"       },
          ],
        },
      ],
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
            { label: "English",               value: "english"  },
            { label: "Hindi",                 value: "hindi"    },
            { label: "Mandarin",              value: "mandarin" },
            { label: "Malay",                 value: "malay"    },
            { label: "Tamil",                 value: "tamil"    },
            { label: "French",                value: "french"   },
            { label: "Spanish",               value: "spanish"  },
            { label: "German",                value: "german"   },
            { label: "Japanese",              value: "japanese" },
            { label: "Korean",                value: "korean"   },
            { label: "Arabic",                value: "arabic"   },
            { label: "British Sign Language", value: "bsl"      },
            { label: "Other",                 value: "other"    },
          ],
        },
        {
          id: "level",
          label: "Level",
          type: "toggle",
          options: [
            { label: "Beginner",     value: "beginner"     },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced",     value: "advanced"     },
            { label: "All Levels",   value: "all"          },
          ],
        },
        format,
        {
          id: "exam_prep",
          label: "Exam Prep",
          type: "toggle",
          options: [
            { label: "IELTS",       value: "ielts" },
            { label: "TOEFL",       value: "toefl" },
            { label: "JLPT",        value: "jlpt"  },
            { label: "HSK",         value: "hsk"   },
            { label: "DELF / DALF", value: "delf"  },
            { label: "Other",       value: "other" },
          ],
        },
      ],
    },
  ],
};

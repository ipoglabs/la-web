import type { MainCategory } from "../types";
import { field, experience, workArrangement } from "./shared";

export const jobs: MainCategory = {
  id: "jobs",
  label: "Jobs",
  description: "Discover full-time, part-time, and freelance opportunities.",
  icon: "briefcase",
  iconBg: "bg-violet-100",
  iconColor: "text-violet-600",
  subcategories: [
    {
      id: "full_time",
      label: "Full Time",
      icon: "briefcase",
      filters: [field, experience, workArrangement],
    },
    {
      id: "part_time",
      label: "Part Time",
      icon: "clock",
      filters: [field, experience, workArrangement],
    },
    {
      id: "freelance",
      label: "Freelance",
      icon: "zap",
      filters: [
        field,
        experience,
        {
          id: "engagement",
          label: "Engagement",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",     value: "any"     },
            { label: "One-off", value: "oneoff"  },
            { label: "Ongoing", value: "ongoing" },
            { label: "Project", value: "project" },
          ],
        },
        workArrangement,
      ],
    },
    {
      id: "internship",
      label: "Internship",
      icon: "graduation-cap",
      filters: [
        field,
        {
          id: "stipend",
          label: "Stipend",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",    value: "any"    },
            { label: "Paid",   value: "paid"   },
            { label: "Unpaid", value: "unpaid" },
          ],
        },
        {
          id: "duration",
          label: "Duration",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",       value: "any" },
            { label: "3 months",  value: "3m"  },
            { label: "6 months",  value: "6m"  },
            { label: "12 months", value: "12m" },
          ],
        },
        workArrangement,
      ],
    },
    {
      id: "temp_seasonal",
      label: "Temporary / Seasonal",
      icon: "calendar",
      filters: [
        field,
        {
          id: "duration",
          label: "Duration",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",          value: "any" },
            { label: "< 1 month",    value: "1m"  },
            { label: "1-3 months",   value: "3m"  },
            { label: "3-6 months",   value: "6m"  },
            { label: "6-12 months",  value: "12m" },
          ],
        },
        workArrangement,
      ],
    },
    {
      id: "wanted",
      label: "Wanted",
      icon: "search",
      filters: [
        {
          id: "job_type",
          label: "Looking For",
          type: "toggle",
          options: [
            { label: "Full Time",  value: "fulltime"  },
            { label: "Part Time",  value: "parttime"  },
            { label: "Freelance",  value: "freelance" },
            { label: "Internship", value: "intern"    },
            { label: "Temporary",  value: "temp"      },
          ],
        },
        field,
        experience,
        workArrangement,
      ],
    },
  ],
};

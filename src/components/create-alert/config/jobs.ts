import type { FilterConfig, MainCategory } from "../types";
import { field as sharedField, experience, workArrangement } from "./shared";

// The Jobs post forms' Job Category list (posting/form-schema/defaults/jobs.ts) — wider than Business's Field.
const field: FilterConfig = {
  ...sharedField,
  options: [
    ...sharedField.options,
    { label: "Retail",          value: "retail"           },
    { label: "Logistics",       value: "logistics"        },
    { label: "Construction",    value: "construction"     },
    { label: "Customer Service", value: "customer-service" },
    { label: "Other",           value: "other"            },
  ],
};

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
            { label: "One-off task",       value: "oneoff"  },
            { label: "Fixed-term project", value: "project" },
            { label: "Ongoing",            value: "ongoing" },
          ],
        },
        {
          // Picks whether the price range compares fixed or hourly budgets
          id: "budget_type",
          label: "Budget Type",
          type: "toggle",
          singleSelect: true,
          options: [
            { label: "Any",    value: "any"    },
            { label: "Fixed",  value: "fixed"  },
            { label: "Hourly", value: "hourly" },
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

import type { CategoryItem } from "./types";

export const jobs: CategoryItem = {
  id: "jobs",
  label: "Jobs",
  description: "Discover full-time, part-time, and freelance opportunities.",
  color: "violet",
  cardIcon: "briefcase",
  subcategories: [
  { id: "full_time", label: "Full Time" },
  { id: "part_time", label: "Part Time" },
  { id: "freelance", label: "Freelance" },
  { id: "internship", label: "Internship" },
  { id: "temp_seasonal", label: "Temporary / Seasonal" },
  { id: "wanted", label: "Wanted" },
  ],
};
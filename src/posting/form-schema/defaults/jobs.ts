// Default "Jobs" post-form schemas — mirror components/form/job/*.

import { getJobConfig } from "@/config/job";
import type { FormFieldDef, FormSection } from "../types";
import { basics, opts, pairs } from "./shared";

const SKILLS = opts(["JavaScript", "React", "Node.js", "TypeScript", "SQL", "Python", "Communication", "Leadership", "Sales", "Customer Service"]);
const SHIFTS = opts(["Morning", "Evening", "Night", "Weekend", "Rotational"]);

const workMode: FormFieldDef = {
  key: "workMode",
  type: "select",
  label: "Work Mode",
  options: pairs([
    ["onsite", "On-site"],
    ["hybrid", "Hybrid"],
    ["remote", "Remote"],
  ]),
};

const company: FormFieldDef = { key: "company", type: "text", label: "Company", required: true };
const skills: FormFieldDef = { key: "skills", type: "multiselect", label: "Skills", options: SKILLS };
const applyLink: FormFieldDef = { key: "applyLink", type: "text", label: "Apply Link", placeholder: "https://" };
const dates: FormFieldDef[] = [
  { key: "startDate", type: "date", label: "Start Date", width: "half" },
  { key: "endDate", type: "date", label: "End Date", width: "half" },
];

export const JOBS_SUBCATEGORIES = ["Full Time", "Part Time", "Freelance", "Internship", "Temporary / Seasonal", "Wanted"];

export function jobsSections(subcategory: string, country: string): FormSection[] | null {
  const c = getJobConfig(country);

  switch (subcategory) {
    case "Full Time":
      return [
        basics,
        {
          title: "Job",
          fields: [
            company,
            { key: "salary", type: "currency", label: "Salary", min: 1, width: "half" },
            { key: "experience", type: "text", label: "Experience", placeholder: "e.g. 2-4 years", width: "half" },
            workMode,
            skills,
            { key: "benefits", type: "multiselect", label: "Benefits", options: opts(c.benefits) },
            { key: "deadline", type: "date", label: "Application Deadline", width: "half" },
            applyLink,
          ],
        },
      ];

    case "Part Time":
      return [
        basics,
        {
          title: "Job",
          fields: [
            company,
            { key: "hourlyRate", type: "currency", label: "Hourly Rate", min: 1, width: "half" },
            { key: "workingHours", type: "text", label: "Working Hours", placeholder: "e.g. 20 hrs/week", width: "half" },
            workMode,
            { key: "shifts", type: "multiselect", label: "Shifts", options: SHIFTS },
            skills,
            { key: "deadline", type: "date", label: "Application Deadline", width: "half" },
            applyLink,
          ],
        },
      ];

    case "Freelance":
      return [
        basics,
        {
          title: "Project",
          fields: [
            company,
            {
              key: "projectType",
              type: "select",
              label: "Project Type",
              options: pairs([["web-development", "Web Development"], ["design", "Design"], ["writing", "Writing"], ["marketing", "Marketing"], ["other", "Other"]]),
            },
            workMode,
            { key: "budgetType", type: "select", label: "Budget Type", options: pairs([["fixed", "Fixed"], ["hourly", "Hourly"]]), width: "half" },
            { key: "budgetAmount", type: "currency", label: "Budget", min: 1, width: "half" },
            { key: "contractDuration", type: "text", label: "Contract Duration", placeholder: "e.g. 3 months" },
            skills,
            applyLink,
          ],
        },
      ];

    case "Internship":
      return [
        basics,
        {
          title: "Internship",
          fields: [
            company,
            workMode,
            { key: "duration", type: "text", label: "Duration", placeholder: "e.g. 6 months" },
            ...dates,
            { key: "stipendType", type: "select", label: "Stipend Type", options: pairs([["unpaid", "Unpaid"], ["stipend", "Stipend"], ["salary", "Salary"]]), width: "half" },
            { key: "stipendAmount", type: "currency", label: "Stipend", min: 0, width: "half" },
            skills,
            applyLink,
          ],
        },
      ];

    case "Temporary / Seasonal":
      return [
        basics,
        {
          title: "Job",
          fields: [
            company,
            workMode,
            ...dates,
            { key: "workingHours", type: "text", label: "Working Hours", width: "half" },
            { key: "salary", type: "currency", label: "Pay", min: 1, width: "half" },
            skills,
          ],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "About You",
          fields: [
            { key: "candidateName", type: "text", label: "Your Name", required: true },
            {
              key: "employmentType",
              type: "select",
              label: "Employment Type",
              options: pairs([["full-time", "Full Time"], ["part-time", "Part Time"], ["internship", "Internship"], ["freelance", "Freelance"], ["temporary", "Temporary"], ["contract", "Contract"]]),
            },
            { key: "experience", type: "text", label: "Experience", width: "half" },
            { key: "salary", type: "currency", label: "Expected Salary", min: 1, width: "half" },
            { key: "available_from", type: "date", label: "Available From", width: "half" },
            skills,
            { key: "preferred_locations", type: "tags", label: "Preferred Locations", placeholder: "Type a location and press Enter" },
          ],
        },
      ];

    default:
      return null;
  }
}

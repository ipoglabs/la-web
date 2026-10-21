// Default "Jobs" post-form schemas.

import { getJobConfig } from "@/config/job";
import type { FormFieldDef, FormSection } from "../types";
import { basics, opts, pairs, YES_NO } from "./shared";

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

/** Values match the Jobs search's Field filter (components/create-alert/config/jobs.ts). */
const jobCategory: FormFieldDef = {
  key: "jobCategory",
  type: "select",
  label: "Job Category",
  required: true,
  display: "dropdown",
  options: pairs([
    ["it", "IT & Tech"],
    ["finance", "Finance & Accounts"],
    ["sales", "Sales & Marketing"],
    ["engineering", "Engineering"],
    ["healthcare", "Healthcare"],
    ["education", "Education"],
    ["admin", "Admin & Office"],
    ["creative", "Creative & Design"],
    ["hospitality", "Hospitality & Food"],
    ["retail", "Retail"],
    ["logistics", "Driving & Logistics"],
    ["construction", "Construction & Trades"],
    ["customer-service", "Customer Service"],
    ["other", "Other"],
  ]),
};

/** Values match the Jobs search's Experience Level filter; India says Fresher for entry level. */
const experienceLevel = (country: string): FormFieldDef => ({
  key: "experience",
  type: "select",
  label: "Experience Level",
  options: pairs([
    ["entry", country === "IN" ? "Fresher" : "Entry"],
    ["mid", "Mid"],
    ["senior", "Senior"],
    ["lead", "Lead"],
    ["manager", "Manager"],
  ]),
});

const listedBy = (country: string): FormFieldDef => ({
  key: "listedBy",
  type: "select",
  label: "Listed By",
  required: true,
  options: pairs([
    ["Employer", "Employer"],
    ["Agency", country === "IN" ? "Consultancy" : "Recruitment Agency"],
  ]),
});

/**
 * How a salary is quoted, beside each salary field. New posts start on the
 * market's usual period: GB pay is quoted per year, IN and SG per month.
 * Search compares salaries per month (lib/postFilterQuery.ts).
 */
const PAY_PERIOD_LABELS: Record<string, string> = {
  hour: "Per hour",
  day: "Per day",
  week: "Per week",
  month: "Per month",
  year: "Per year",
};
const payPeriod = (country: string, periods: string[]): FormFieldDef => {
  const usual = country === "GB" ? "year" : "month";
  return {
    key: "salaryPeriod",
    type: "select",
    label: "Pay Period",
    options: periods.map((v) => ({ value: v, label: PAY_PERIOD_LABELS[v] })),
    defaultValue: periods.includes(usual) ? usual : "month",
    width: "half",
  };
};

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
            listedBy(country),
            company,
            jobCategory,
            // Salary From stays `salary`, so search and the listing price keep reading it
            { key: "salary", type: "currency", label: "Salary From", min: 1, width: "third" },
            { key: "salaryMax", type: "currency", label: "Salary To", min: 1, gteField: "salary", width: "third" },
            { ...payPeriod(country, ["hour", "month", "year"]), width: "third" },
            experienceLevel(country),
            workMode,
            { key: "openings", type: "number", label: "Openings", min: 1, max: 999, width: "half" },
            { key: "startDate", type: "date", label: "Start Date", immediateOption: "Immediately" },
            ...(country === "IN"
              ? [{
                  key: "minEducation",
                  type: "select",
                  label: "Minimum Education",
                  options: opts(["10th Pass", "12th Pass", "Diploma / ITI", "Graduate", "Post Graduate", "Any"]),
                } satisfies FormFieldDef]
              : []),
            ...(country === "GB"
              ? [{ key: "visaSponsorship", type: "select", label: "Visa Sponsorship", options: YES_NO } satisfies FormFieldDef]
              : []),
            {
              key: "skills",
              type: "tags",
              label: "Skills",
              placeholder: "Type a skill and press Enter",
              maxItems: 10,
            },
            { key: "benefits", type: "multiselect", label: "Benefits", options: opts(c.benefits) },
            { key: "deadline", type: "date", label: "Application Deadline", width: "half" },
            { ...applyLink, format: "url" },
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
            // Same choices as the Freelance search's Engagement filter
            {
              key: "engagement",
              type: "select",
              label: "Engagement",
              options: pairs([["oneoff", "One-off"], ["ongoing", "Ongoing"], ["project", "Project"]]),
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
            // A choice, not free text, so the Internship search's Duration filter can match it
            {
              key: "duration",
              type: "select",
              label: "Duration",
              options: pairs([["1", "1 month"], ["2", "2 months"], ["3", "3 months"], ["6", "6 months"], ["12", "12 months"]]),
              width: "half",
            },
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
            payPeriod(country, ["hour", "day", "week", "month"]),
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
            payPeriod(country, ["hour", "month", "year"]),
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

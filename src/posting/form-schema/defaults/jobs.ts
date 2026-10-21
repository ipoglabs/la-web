// Default "Jobs" post-form schemas.

import { getJobConfig } from "@/config/job";
import type { FormFieldDef, FormSection } from "../types";
import { basics, opts, pairs, YES_NO } from "./shared";

const SHIFTS = opts(["Morning", "Afternoon", "Evening", "Night", "Rotational"]);

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
/** Posters type their own skills. */
const skillTags: FormFieldDef = {
  key: "skills",
  type: "tags",
  label: "Skills",
  placeholder: "Type a skill and press Enter",
  maxItems: 10,
};
const startDate: FormFieldDef = { key: "startDate", type: "date", label: "Start Date", immediateOption: "Immediately" };
const applyLink: FormFieldDef = { key: "applyLink", type: "text", label: "Apply Link", placeholder: "https://" };

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
 * market's usual period (`usual`, else GB per year, IN and SG per month).
 * Search compares salaries per month (lib/postFilterQuery.ts).
 */
const PAY_PERIOD_LABELS: Record<string, string> = {
  hour: "Per hour",
  day: "Per day",
  week: "Per week",
  month: "Per month",
  year: "Per year",
};
const payPeriod = (country: string, periods: string[], usual = country === "GB" ? "year" : "month"): FormFieldDef => {
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
            startDate,
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
            skillTags,
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
            listedBy(country),
            company,
            jobCategory,
            // India quotes part-time pay mostly per month; search turns it into an hourly rate
            ...(country === "IN"
              ? [
                  { key: "salary", type: "currency", label: "Pay", min: 1, width: "half" } satisfies FormFieldDef,
                  payPeriod(country, ["hour", "day", "month"]),
                ]
              : [{ key: "hourlyRate", type: "currency", label: "Hourly Rate", min: 1, width: "half" } satisfies FormFieldDef]),
            { key: "hoursPerWeek", type: "number", label: "Hours per Week", unit: "hrs", min: 1, max: 48, width: "half" },
            experienceLevel(country),
            workMode,
            { key: "workDays", type: "multiselect", label: "Days", options: opts(["Weekdays", "Weekends", "Flexible"]) },
            { key: "shifts", type: "multiselect", label: "Shifts", options: SHIFTS },
            startDate,
            { key: "studentFriendly", type: "select", label: "Student Friendly", options: YES_NO, width: "half" },
            skillTags,
            { key: "deadline", type: "date", label: "Application Deadline", width: "half" },
            { ...applyLink, format: "url" },
          ],
        },
      ];

    case "Freelance":
      return [
        basics,
        {
          title: "Project",
          fields: [
            // Many gigs come from individuals, so the client's company is optional
            {
              key: "listedBy",
              type: "select",
              label: "Posted By",
              required: true,
              options: pairs([["Business", "Business"], ["Individual", "Individual"]]),
            },
            { ...company, label: "Client / Company", required: false },
            jobCategory,
            // Same choices as the Freelance search's Engagement filter
            {
              key: "engagement",
              type: "select",
              label: "Engagement",
              options: pairs([["oneoff", "One-off task"], ["project", "Fixed-term project"], ["ongoing", "Ongoing"]]),
            },
            experienceLevel(country),
            workMode,
            { key: "budgetType", type: "select", label: "Budget Type", options: pairs([["fixed", "Fixed"], ["hourly", "Hourly"]]), width: "half" },
            { key: "budgetAmount", type: "currency", label: "Budget", min: 1, width: "half" },
            {
              key: "contractDuration",
              type: "select",
              label: "Contract Duration",
              options: pairs([["under-1w", "Under 1 week"], ["1-4w", "1–4 weeks"], ["1-3m", "1–3 months"], ["3-6m", "3–6 months"], ["6m-plus", "6+ months"]]),
            },
            startDate,
            { key: "deadline", type: "date", label: "Application Deadline", width: "half" },
            skillTags,
            { ...applyLink, format: "url" },
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
            jobCategory,
            workMode,
            { key: "hours", type: "select", label: "Hours", options: pairs([["full-time", "Full-time"], ["part-time", "Part-time"]]) },
            // A choice, not free text, so the Internship search's Duration filter can match it.
            // No End Date: Start Date + Duration give it.
            {
              key: "duration",
              type: "select",
              label: "Duration",
              options: pairs([["1", "1 month"], ["2", "2 months"], ["3", "3 months"], ["6", "6 months"], ["12", "12 months"]]),
              width: "half",
            },
            { ...startDate, width: "half" },
            // "Stipend" is Indian wording; elsewhere Paid saves as "stipend" too, so search reads one value
            {
              key: "stipendType",
              type: "select",
              label: "Stipend Type",
              options: pairs([["unpaid", "Unpaid"], ["stipend", country === "IN" ? "Stipend" : "Paid"]]),
              ...(country === "GB"
                ? { hint: "Most UK interns count as workers and must be paid at least the National Minimum Wage." }
                : {}),
              width: "half",
            },
            // Search compares stipends per month
            {
              key: "stipendAmount",
              type: "currency",
              label: "Stipend (per month)",
              min: 1,
              showWhen: { field: "stipendType", notIn: ["unpaid"] },
              width: "half",
            },
            {
              key: "openTo",
              type: "select",
              label: "Open To",
              options: pairs([["students", "Current students"], ["graduates", "Recent graduates"], ["both", "Both"]]),
            },
            {
              key: "jobOffer",
              type: "select",
              label: country === "IN" ? "Pre-Placement Offer (PPO)" : "Job Offer Possible",
              options: YES_NO,
              width: "half",
            },
            { key: "deadline", type: "date", label: "Application Deadline", width: "half" },
            skillTags,
            { ...applyLink, format: "url" },
          ],
        },
      ];

    case "Temporary / Seasonal":
      return [
        basics,
        {
          title: "Job",
          fields: [
            listedBy(country),
            company,
            jobCategory,
            workMode,
            // Same buckets as the Temporary / Seasonal search's Duration filter
            {
              key: "duration",
              type: "select",
              label: "Duration",
              options: pairs([["1m", "Under 1 month"], ["3m", "1–3 months"], ["6m", "3–6 months"], ["12m", "6–12 months"]]),
            },
            { ...startDate, width: "half" },
            { key: "endDate", type: "date", label: "End Date", width: "half" },
            { key: "hoursPerWeek", type: "number", label: "Hours per Week", unit: "hrs", min: 1, max: 60, width: "half" },
            { key: "openings", type: "number", label: "Openings", min: 1, max: 999, width: "half" },
            // Temp pay is quoted per day in India, per hour in the UK and Singapore
            { key: "salary", type: "currency", label: "Pay", min: 1, width: "half" },
            payPeriod(country, ["hour", "day", "week", "month"], country === "IN" ? "day" : "hour"),
            { key: "deadline", type: "date", label: "Application Deadline", width: "half" },
            skillTags,
            { ...applyLink, format: "url" },
          ],
        },
      ];

    case "Wanted":
      return [
        basics,
        {
          title: "About You",
          fields: [
            // No name field: the ad already shows the poster's profile name
            jobCategory,
            // Values match the Wanted search's Looking For filter (lib/postFilterQuery.ts maps them)
            {
              key: "employmentType",
              type: "multiselect",
              label: "Open To",
              options: pairs([["full-time", "Full Time"], ["part-time", "Part Time"], ["internship", "Internship"], ["freelance", "Freelance"], ["temporary", "Temporary"], ["contract", "Contract"]]),
            },
            experienceLevel(country),
            // Several choices, so it's saved apart from the single-choice Work Mode
            {
              key: "preferredWorkMode",
              type: "multiselect",
              label: "Preferred Work Mode",
              options: workMode.options,
            },
            { key: "salary", type: "currency", label: "Expected Salary", min: 1, width: "half" },
            payPeriod(country, ["hour", "month", "year"]),
            { key: "available_from", type: "date", label: "Available From", immediateOption: "Immediately", width: "half" },
            ...(country === "IN"
              ? [{
                  key: "education",
                  type: "select",
                  label: "Highest Education",
                  options: opts(["10th Pass", "12th Pass", "Diploma / ITI", "Graduate", "Post Graduate"]),
                } satisfies FormFieldDef]
              : []),
            ...(country === "GB"
              ? [{ key: "rightToWork", type: "select", label: "Right to Work", options: pairs([["yes", "Yes"], ["sponsorship", "Need sponsorship"]]) } satisfies FormFieldDef]
              : []),
            ...(country === "SG"
              ? [{
                  key: "rightToWork",
                  type: "select",
                  label: "Right to Work",
                  options: pairs([["citizen-pr", "Citizen / PR"], ["work-pass", "Have a work pass"], ["need-pass", "Need a work pass"]]),
                } satisfies FormFieldDef]
              : []),
            skillTags,
            { key: "languages", type: "tags", label: "Languages", placeholder: "Type a language and press Enter", maxItems: 5 },
            {
              key: "preferred_locations",
              type: "tags",
              label: "Preferred Locations",
              placeholder: "Type a location and press Enter",
              format: "place",
              maxItems: 5,
            },
          ],
        },
      ];

    default:
      return null;
  }
}

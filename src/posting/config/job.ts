import type { FieldSpec } from "./types";

export const jobConfig: Record<string, FieldSpec[]> = {
  "full time": [
    { key: "company", type: "string", label: "Company" },
    { key: "jobType", type: "string", label: "Job Type" },
    { key: "workMode", type: "string", label: "Work Mode" },
    { key: "salary", type: "currency", label: "Salary (₹)" },
    { key: "experience", type: "string", label: "Experience" },
    { key: "skills", type: "array", label: "Skills" },
    { key: "benefits", type: "array", label: "Benefits" },
    { key: "deadline", type: "date", label: "Deadline" },
    { key: "applyLink", type: "string", label: "Apply Link" },
  ],

  "part time": [
    { key: "company", type: "string", label: "Company" },
    { key: "jobType", type: "string", label: "Job Type" },
    { key: "workMode", type: "string", label: "Work Mode" },
    { key: "hourlyRate", type: "currency", label: "Hourly Rate (₹)" },
    { key: "workingHours", type: "string", label: "Working Hours" },
    { key: "shifts", type: "array", label: "Shifts" },
    { key: "skills", type: "array", label: "Skills" },
    { key: "deadline", type: "date", label: "Deadline" },
    { key: "applyLink", type: "string", label: "Apply Link" },
  ],

  internship: [
    { key: "company", type: "string", label: "Company" },
    { key: "workMode", type: "string", label: "Work Mode" },
    { key: "duration", type: "string", label: "Duration" },
    { key: "startDate", type: "date", label: "Start Date" },
    { key: "endDate", type: "date", label: "End Date" },
    { key: "stipendType", type: "string", label: "Stipend Type" },
    { key: "stipendAmount", type: "currency", label: "Stipend (₹)" },
    { key: "skills", type: "array", label: "Skills" },
    { key: "applyLink", type: "string", label: "Apply Link" },
  ],

  freelance: [
    { key: "company", type: "string", label: "Company" },
    { key: "workMode", type: "string", label: "Work Mode" },
    { key: "projectType", type: "string", label: "Project Type" },
    { key: "budgetType", type: "string", label: "Budget Type" },
    { key: "budgetAmount", type: "currency", label: "Budget (₹)" },
    { key: "contractDuration", type: "string", label: "Contract Duration" },
    { key: "skills", type: "array", label: "Skills" },
    { key: "applyLink", type: "string", label: "Apply Link" },
  ],

  temporary: [
    { key: "company", type: "string", label: "Company" },
    { key: "workMode", type: "string", label: "Work Mode" },
    { key: "startDate", type: "date", label: "Start Date" },
    { key: "endDate", type: "date", label: "End Date" },
    { key: "workingHours", type: "string", label: "Working Hours" },
    { key: "salary", type: "currency", label: "Salary (₹)" },
    { key: "skills", type: "array", label: "Skills" },
  ],

  wanted: [
    { key: "candidateName", type: "string", label: "Candidate Name" },
    { key: "experience", type: "string", label: "Experience" },
    { key: "skills", type: "array", label: "Skills" },
    { key: "preferred_locations", type: "array", label: "Preferred Locations" },
    { key: "salary", type: "currency", label: "Expected Salary (₹)" },
    { key: "available_from", type: "date", label: "Available From" },
  ],
};

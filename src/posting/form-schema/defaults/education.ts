// Default "Education" post-form schemas.
//
// Option values are what the Education search filters match
// (components/create-alert/config/education.ts, lib/postFilterQuery.ts
// EDUCATION_FORM_FILTERS). Fees are `salePrice`, the field listing prices and
// the price filter read. Tutors & Coaching shares Services › Tutoring's lists,
// so a tutor is described the same way in either place.

import type { FormFieldDef, FormSection } from "../types";
import { basics, pairs, YES_NO } from "./shared";
import { CURRICULA, howServiceMode, TUTORING_LEVELS, TUTORING_SUBJECTS } from "./services";

const fee = (label = "Fee", required = true): FormFieldDef => ({
  key: "salePrice",
  type: "currency",
  label,
  required,
  min: required ? 1 : 0,
  width: "half",
  ...(required ? {} : { hint: "Leave blank if free" }),
});
const feePer = (entries: [string, string][], label = "Fee Per"): FormFieldDef => ({ key: "priceUnit", type: "select", label, options: pairs(entries), width: "half" });
const yesNo = (key: string, label: string): FormFieldDef => ({ key, type: "select", label, options: YES_NO, width: "half" });
const providerName = (label = "Business / Provider Name"): FormFieldDef => ({ key: "providerName", type: "text", label, width: "half" });
const qualification: FormFieldDef = { key: "qualification", type: "text", label: "Teacher Qualification", width: "half" };
const FORMAT = pairs([["inperson", "In Person"], ["online", "Online"], ["both", "Both"]]);

/** A tutor's background check in each market's own words; SG has no common one. */
const backgroundCheck = (country: string): FormFieldDef[] =>
  country === "GB"
    ? [yesNo("dbsChecked", "DBS Checked")]
    : country === "IN"
      ? [yesNo("policeVerified", "Police Verified")]
      : [];

/** Study levels in each market's words, matching the Study Materials Level filter. */
const STUDY_LEVELS: Record<string, [string, string][]> = {
  IN: [["primary", "Primary"], ["secondary", "Secondary (10th)"], ["higher-secondary", "Higher Secondary (12th)"], ["competitive", "Competitive Exams"], ["university", "University"]],
  GB: [["primary", "Primary"], ["gcse", "GCSE"], ["a_level", "A-Level"], ["university", "University"], ["professional", "Professional"]],
  SG: [["primary", "Primary (PSLE)"], ["o_level", "O-Level"], ["a_level", "A-Level"], ["university", "University"], ["professional", "Professional"]],
};

/** Curricula a school follows: Services' tutoring boards, GB's in school terms. */
const SCHOOL_CURRICULA: Record<string, [string, string][]> = {
  ...CURRICULA,
  GB: [["national", "National Curriculum"], ["ib", "IB"], ["independent", "Independent"]],
};

/** Languages taught in each market, matching the Language filter. */
const LANGUAGES: Record<string, [string, string][]> = {
  IN: [["english", "English"], ["hindi", "Hindi"], ["french", "French"], ["german", "German"], ["spanish", "Spanish"], ["japanese", "Japanese"], ["mandarin", "Mandarin"], ["other", "Other"]],
  GB: [
    ["english", "English (ESOL)"],
    ["french", "French"],
    ["spanish", "Spanish"],
    ["german", "German"],
    ["mandarin", "Mandarin"],
    ["japanese", "Japanese"],
    ["arabic", "Arabic"],
    ["bsl", "British Sign Language"],
    ["other", "Other"],
  ],
  SG: [["english", "English"], ["mandarin", "Mandarin"], ["malay", "Malay"], ["tamil", "Tamil"], ["japanese", "Japanese"], ["korean", "Korean"], ["french", "French"], ["other", "Other"]],
};

/** The year before university in each market's words. */
const SIXTH_FORM_LABEL: Record<string, string> = { IN: "Higher Secondary", GB: "Sixth Form", SG: "Junior College" };

export const EDUCATION_SUBCATEGORIES = ["Tutors & Coaching", "Courses", "Study Materials", "Schools & Colleges", "Language Classes"];

export function educationSections(subcategory: string, country: string): FormSection[] | null {
  switch (subcategory) {
    case "Tutors & Coaching":
      return [
        basics,
        {
          title: "Tutoring",
          // Subjects / Levels are lists, saved in attributes, as in Services › Tutoring.
          fields: [
            providerName(),
            { key: "subjects", type: "multiselect", label: "Subjects", required: true, options: pairs(TUTORING_SUBJECTS) },
            { key: "otherSubject", type: "text", label: "Other Subject", placeholder: "e.g. Economics, 11+ prep", showWhen: { field: "subjects", in: ["other"] } },
            { key: "levels", type: "multiselect", label: "Level", options: pairs(TUTORING_LEVELS[country] ?? TUTORING_LEVELS.IN) },
            { key: "curriculum", type: "multiselect", label: country === "GB" ? "Exam Board" : "Curriculum / Board", options: pairs(CURRICULA[country] ?? CURRICULA.IN) },
            { key: "lessonFormat", type: "multiselect", label: "Lesson Format", options: pairs([["one_to_one", "One-to-one"], ["group", "Small group"]]) },
            howServiceMode("Student's home"),
            qualification,
            ...backgroundCheck(country),
            yesNo("freeTrial", "Free Trial Lesson"),
            fee(),
            feePer([["hour", "Per hour"], ["session", "Per session"], ["month", "Per month"]]),
            { key: "availability", type: "text", label: "Availability", placeholder: "e.g. Evenings & weekends", width: "half" },
          ],
        },
      ];

    case "Courses":
      return [
        basics,
        {
          title: "Course",
          fields: [
            providerName(),
            {
              key: "courseCategory",
              type: "select",
              label: "Category",
              required: true,
              options: pairs([
                ["tech", "Tech & Coding"],
                ["business", "Business & Marketing"],
                ["design", "Design & Creative"],
                ["languages", "Languages"],
                ["exam", "Exam Prep & Certification"],
                ["other", "Other"],
              ]),
            },
            {
              key: "deliveryFormat",
              type: "select",
              label: "Format",
              required: true,
              options: pairs([["selfpaced", "Self-paced"], ["live", "Live online"], ["blended", "Self-paced + live"], ["inperson_online", "In person or online"]]),
            },
            {
              key: "duration",
              type: "select",
              label: "Duration",
              required: true,
              options: pairs([["1m", "Under 1 month"], ["3m", "1–3 months"], ["6m", "3–6 months"], ["6mup", "6+ months"], ["selfpaced", "Self-paced"]]),
            },
            {
              key: "certificate",
              type: "select",
              label: "Certificate",
              options: pairs([["accredited", "Accredited"], ["completion", "Certificate of completion"], ["none", "None"]]),
            },
            { key: "startDate", type: "date", label: "Start Date", immediateOption: "Start any time", width: "half" },
            fee(),
            feePer([["course", "Full course"], ["month", "Per month"]]),
            yesNo("instalments", "Pay in Instalments"),
            { key: "refundPolicy", type: "text", label: "Refund Policy", placeholder: "e.g. 14-day money-back", width: "half" },
          ],
        },
      ];

    case "Study Materials":
      return [
        basics,
        {
          title: "Item",
          fields: [
            {
              key: "materialType",
              type: "select",
              label: "Material Type",
              required: true,
              hint: "Originals and your own notes only, no photocopies.",
              options: pairs([["textbooks", "Textbooks"], ["guides", "Revision Guides"], ["past_papers", "Past Papers"], ["notes", "My Own Notes"], ["other", "Other"]]),
            },
            { key: "level", type: "select", label: "Level", options: pairs(STUDY_LEVELS[country] ?? STUDY_LEVELS.IN) },
            { key: "subject", type: "text", label: "Subject / Exam", placeholder: "e.g. JEE Physics, GCSE Biology", width: "half" },
            {
              key: "condition",
              type: "select",
              label: "Condition",
              required: true,
              options: pairs([["new", "Brand New"], ["like-new", "Like New"], ["lightly-used", "Lightly Used"], ["used", "Well Used"], ["heavily-used", "Heavily Used"]]),
            },
            { key: "quantity", type: "number", label: "Number of Items", min: 1, width: "half" },
            { key: "soldAs", type: "select", label: "Sold As", options: pairs([["bundle", "Bundle only"], ["split", "Can split"]]), width: "half" },
            { key: "edition", type: "text", label: "Edition / Syllabus Year", placeholder: "e.g. 2024–25", width: "half" },
          ],
        },
        {
          title: "Price & Delivery",
          fields: [
            fee("Price"),
            yesNo("negotiable", "Negotiable"),
            {
              key: "dealMethod",
              type: "multiselect",
              label: "Deal Method",
              options: pairs([["meetup", "Meet-up / Collection"], ["delivery", "Delivery / Courier"]]),
            },
          ],
        },
      ];

    case "Schools & Colleges":
      return [
        basics,
        {
          title: "School",
          fields: [
            {
              key: "adType",
              type: "select",
              label: "Ad Type",
              required: true,
              options: pairs([["admissions", "Admissions Open"], ["openday", "Open Day / Event"], ["places", "Places Available"]]),
            },
            providerName("School / Institution Name"),
            {
              key: "institutionType",
              type: "select",
              label: "Institution Type",
              required: true,
              options: pairs([
                ["nursery", "Nursery / Pre-school"],
                ["primary", "Primary"],
                ["secondary", "Secondary"],
                ["sixth", SIXTH_FORM_LABEL[country] ?? SIXTH_FORM_LABEL.GB],
                ["university", "College / University"],
                ["tuition", "Tuition Centre"],
                ["activity", "Activity School"],
                ["vocational", "Vocational"],
              ]),
            },
            { key: "curriculum", type: "multiselect", label: "Curriculum", options: pairs(SCHOOL_CURRICULA[country] ?? SCHOOL_CURRICULA.IN) },
            { key: "startDate", type: "date", label: "Event Date", required: true, width: "half", showWhen: { field: "adType", in: ["openday"] } },
            { key: "ageRange", type: "text", label: "Ages / Levels", placeholder: "e.g. Ages 5–18, KS2 & KS3", width: "half" },
            {
              key: "accreditation",
              type: "text",
              label: "Inspection / Accreditation",
              placeholder: country === "GB" ? "e.g. Ofsted Good" : "e.g. Affiliation no.",
              width: "half",
            },
            fee("Fees", false),
            feePer([["term", "Per term"], ["year", "Per year"], ["month", "Per month"]], "Fees Per"),
          ],
        },
      ];

    case "Language Classes":
      return [
        basics,
        {
          title: "Classes",
          fields: [
            providerName(),
            { key: "language", type: "select", label: "Language", required: true, options: pairs(LANGUAGES[country] ?? LANGUAGES.IN) },
            { key: "level", type: "select", label: "Level", options: pairs([["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"], ["all", "All Levels"]]) },
            { key: "mode", type: "select", label: "Format", required: true, options: FORMAT },
            {
              key: "examPrep",
              type: "select",
              label: "Exam Prep",
              options: pairs([["none", "None"], ["ielts", "IELTS"], ["toefl", "TOEFL"], ["jlpt", "JLPT"], ["hsk", "HSK"], ["delf", "DELF / DALF"], ["other", "Other"]]),
            },
            { key: "classSize", type: "select", label: "Class Size", options: pairs([["one_to_one", "One-to-one"], ["small", "Small group (up to 10)"], ["class", "Class"]]) },
            { key: "schedule", type: "text", label: "Schedule", placeholder: "e.g. Tue evenings, 10 weeks", width: "half" },
            yesNo("nativeSpeaker", "Native Speaker Teacher"),
            qualification,
            fee(),
            feePer([["hour", "Per hour"], ["term", "Per term"], ["course", "Full course"], ["month", "Per month"]]),
          ],
        },
      ];

    default:
      return null;
  }
}

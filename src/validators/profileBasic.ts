import { z } from "zod";

/* ===== helper ===== */
const isAdult = (dob: string) => {
  const date = new Date(dob);
  if (isNaN(date.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age >= 18;
};

/* ===== regex ===== */
const ALPHA_ONLY = /^[A-Za-z]+$/;

/* ===== schema ===== */
export const basicProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .refine(
        (v) => v.trim().split(/\s+/).filter(Boolean).every((p) => ALPHA_ONLY.test(p)),
        "Only alphabets (A–Z) allowed"
      ),

    role: z
      .string()
      .min(1, "Please select a role"),

    roleTitle: z
      .string()
      .optional()
      .or(z.literal("")),

    roleDescription: z
      .string()
      .optional()
      .or(z.literal("")),

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine(isAdult, {
        message: "You must be at least 18 years old",
      }),
  })

  /* ===== CONDITIONAL VALIDATION ===== */
  .superRefine((data, ctx) => {
    if (data.role === "other") {
      const title = (data.roleTitle || "").trim();
      const desc = (data.roleDescription || "").trim();

      /* ===== roleTitle ===== */
      if (!title) {
        ctx.addIssue({
          path: ["roleTitle"],
          message: "Role title is required",
          code: "custom",
        });
      } else if (title.length < 2) {
        ctx.addIssue({
          path: ["roleTitle"],
          message: "Minimum 2 characters required",
          code: "custom",
        });
      } else if (title.length > 80) {
        ctx.addIssue({
          path: ["roleTitle"],
          message: "Max 80 characters allowed",
          code: "custom",
        });
      }

      /* ===== roleDescription ===== */
      if (!desc) {
        ctx.addIssue({
          path: ["roleDescription"],
          message: "Role description is required",
          code: "custom",
        });
      } else if (desc.length < 2) {
        ctx.addIssue({
          path: ["roleDescription"],
          message: "Minimum 2 characters required",
          code: "custom",
        });
      } else if (desc.length > 300) {
        ctx.addIssue({
          path: ["roleDescription"],
          message: "Max 300 characters allowed",
          code: "custom",
        });
      }
    }
  });
import { z } from "zod";

/* ----------------------------- Helpers ----------------------------- */
function isAdult(dobISO: string) {
  const dob = new Date(dobISO);
  if (Number.isNaN(dob.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age >= 18;
}

const ALPHA_ONLY = /^[A-Za-z]+$/;
const optionalString = z.string().trim().optional().or(z.literal(""));

/**
 * Schema for the "basic info" section of the profile edit form:
 * full name, date of birth, and role (+ custom role title/description).
 */
export const basicProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Please enter your full name.")
      .refine((v) => {
        const parts = v.trim().split(/\s+/).filter(Boolean);
        return parts.every((p) => ALPHA_ONLY.test(p));
      }, "Only alphabets (A–Z) allowed"),

    dateOfBirth: z
      .string()
      .refine((v) => !Number.isNaN(new Date(v).getTime()), {
        message: "Invalid date",
      })
      .refine((v) => isAdult(v), {
        message: "You must be 18 or older",
      }),

    role: z.enum(["individual", "business", "agency", "other"] as const, {
      error: "Please select a role.",
    }),

    roleTitle: optionalString,
    roleDescription: optionalString,
  })
  .superRefine((data, ctx) => {
    if (data.role === "other") {
      const title = data.roleTitle?.trim() || "";
      const desc = data.roleDescription?.trim() || "";

      if (!title) {
        ctx.addIssue({
          code: "custom",
          path: ["roleTitle"],
          message: "Role title required",
        });
      } else if (title.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["roleTitle"],
          message: "Minimum 2 characters required",
        });
      } else if (title.length > 80) {
        ctx.addIssue({
          code: "custom",
          path: ["roleTitle"],
          message: "Max 80 characters allowed",
        });
      } else if (!/^[A-Za-z0-9\s,|&()\-]+$/.test(title)) {
        ctx.addIssue({
          code: "custom",
          path: ["roleTitle"],
          message: "Invalid characters used",
        });
      }

      if (!desc) {
        ctx.addIssue({
          code: "custom",
          path: ["roleDescription"],
          message: "Description is required",
        });
      } else if (desc.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["roleDescription"],
          message: "Minimum 2 characters required",
        });
      } else if (desc.length > 300) {
        ctx.addIssue({
          code: "custom",
          path: ["roleDescription"],
          message: "Max 300 characters allowed",
        });
      }
    }
  });

export type BasicProfileForm = z.infer<typeof basicProfileSchema>;
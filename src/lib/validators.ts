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

// ✅ alphabets only (A-Z). (No spaces/hyphens)
const ALPHA_ONLY = /^[A-Za-z]+$/;

/**
 * Step 1 – General Information
 */
export const generalInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Please enter your first name.")
    .regex(ALPHA_ONLY, "First name must contain only alphabets (A–Z)."),

  lastName: z
    .string()
    .trim()
    .min(1, "Please enter your last name.")
    .regex(ALPHA_ONLY, "Last name must contain only alphabets (A–Z)."),

  dateOfBirth: z
    .string()
    .min(1, "Please enter your date of birth.")
    .refine((v) => isAdult(v), {
      message: "You must be 18 or older to use Lokalads.",
    }),

  gender: z.enum(["male", "female", "prefer-not-to-say", "other"], {
    errorMap: () => ({ message: "Please select a gender option." }),
  }),

  // Optional fields
  nationality: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  residency: z.string().optional().or(z.literal("")),

  email: z.string().trim().email("Please enter a valid email address."),
});

export type GeneralInfoForm = z.infer<typeof generalInfoSchema>;

/**
 * Step 3 – Phone Verification
 */
export const phoneSchema = z.object({
  primaryNumber: z
    .string()
    .trim()
    .min(7, "Primary number must be valid")
    .regex(/^[0-9+\- ]+$/, "Only digits, +, - and spaces allowed"),

  secondaryNumber1: z.string().optional().or(z.literal("")),
  secondaryNumber2: z.string().optional().or(z.literal("")),
});

export type PhoneForm = z.infer<typeof phoneSchema>;

/**
 * Step 4 – Profile Setup
 * locality + password + role (+ optional roleTitle / roleDescription)
 */
export const profileSchema = z
  .object({
    locality: z
      .string()
      .trim()
      .min(2, "Please enter your locality.")
      .max(80, "Locality is too long — keep it under 80 characters."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(24, "Password must be at most 24 characters")
      .refine((v) => /[A-Za-z]/.test(v), "Password must include at least one letter")
      .refine((v) => /\d/.test(v), "Password must include at least one number")
      .refine(
        (v) => /[^A-Za-z0-9]/.test(v),
        "Password must include at least one special character"
      ),

    role: z.enum(["individual", "business", "agency", "other"], {
      errorMap: () => ({ message: "Role is required" }),
    }),

    // These are optional; validation enforced only when role === "other"
    roleTitle: z.string().optional().or(z.literal("")),
    roleDescription: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.role === "other") {
      const title = (data.roleTitle || "").trim();
      const desc = (data.roleDescription || "").trim();

      // roleTitle: min 2, max 24
      if (!title) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roleTitle"],
          message: "Please enter a role title.",
        });
      } else if (title.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roleTitle"],
          message: "Role title must be at least 2 characters.",
        });
      } else if (title.length > 24) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roleTitle"],
          message: "Role title must be at most 24 characters.",
        });
      }

      // roleDescription: min 8, max 300
      if (!desc) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roleDescription"],
          message: "Please describe how you plan to use Lokalads.",
        });
      } else if (desc.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roleDescription"],
          message: "Role description must be at least 8 characters.",
        });
      } else if (desc.length > 300) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roleDescription"],
          message: "Role description must be at most 300 characters.",
        });
      }
    }
  });

export type ProfileForm = z.infer<typeof profileSchema>;

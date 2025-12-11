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

/**
 * Step 1 – General Information
 */
export const generalInfoSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
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

  email: z.string().email("Please enter a valid email address."),
});

export type GeneralInfoForm = z.infer<typeof generalInfoSchema>;

/**
 * Step 3 – Phone Verification
 */
export const phoneSchema = z.object({
  primaryNumber: z
    .string()
    .min(7, "Primary number must be valid")
    .regex(/^[0-9+\- ]+$/, "Only digits, +, - and spaces allowed"),
  secondaryNumber1: z.string().optional(),
  secondaryNumber2: z.string().optional(),
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
      .min(2, "Please enter your locality.")
      .max(80, "Locality is too long — keep it under 80 characters."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(24, "Password must be at most 24 characters")
      .refine(
        (v) => /[A-Za-z]/.test(v),
        "Password must include at least one letter"
      )
      .refine(
        (v) => /\d/.test(v),
        "Password must include at least one number"
      )
      .refine(
        (v) => /[^A-Za-z0-9]/.test(v),
        "Password must include at least one special character"
      ),
    role: z.enum(["individual", "business", "agency", "other"], {
      errorMap: () => ({ message: "Role is required" }),
    }),

    // Only required when role === "other"
    roleTitle: z
      .string()
      .max(80, "Role title is too long")
      .optional()
      .or(z.literal("")),
    roleDescription: z
      .string()
      .max(400, "Role description is too long")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.role === "other") {
      if (!data.roleTitle || !data.roleTitle.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roleTitle"],
          message: "Please enter a role title.",
        });
      }
      if (!data.roleDescription || !data.roleDescription.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roleDescription"],
          message: "Please describe how you plan to use Lokalads.",
        });
      }
    }
  });

export type ProfileForm = z.infer<typeof profileSchema>;

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

/* ================= STEP 1 ================= */
export const generalInfoSchema = z.object({
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

  gender: z.enum(["male", "female", "prefer-not-to-say", "other"] as const, {
    error: "Please select a gender option.",
  }),

  nationality: optionalString,
  country: optionalString,
  state: optionalString,
  residency: optionalString,

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address." }),
});

export type GeneralInfoForm = z.infer<typeof generalInfoSchema>;

/* ================= STEP 3 ================= */
export const phoneSchema = z.object({
  primaryNumber: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, "Enter a valid phone number"), // ✅ strict E.164

  secondaryNumber1: optionalString,
  secondaryNumber2: optionalString,
});

export type PhoneForm = z.infer<typeof phoneSchema>;

/* ================= STEP 4 ================= */
export const profileSchema = z
  .object({
    locality: z
      .string()
      .trim()
      .min(2, "Please enter your locality.")
      .max(80, "Max 80 characters"),

    password: z
      .string()
      .min(8, "Min 8 characters")
      .max(24, "Max 24 characters")
      .refine((v) => /[A-Za-z]/.test(v), "Must include a letter")
      .refine((v) => /\d/.test(v), "Must include a number")
      .refine(
        (v) => /[^A-Za-z0-9]/.test(v),
        "Must include a special character"
      ),

    role: z.enum(["individual", "business", "agency", "other"]),

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
          message: "Min 2 characters",
        });
      } else if (title.length > 24) {
        ctx.addIssue({
          code: "custom",
          path: ["roleTitle"],
          message: "Max 24 characters",
        });
      }

      if (!desc) {
        ctx.addIssue({
          code: "custom",
          path: ["roleDescription"],
          message: "Description required",
        });
      } else if (desc.length < 8) {
        ctx.addIssue({
          code: "custom",
          path: ["roleDescription"],
          message: "Min 8 characters",
        });
      } else if (desc.length > 300) {
        ctx.addIssue({
          code: "custom",
          path: ["roleDescription"],
          message: "Max 300 characters",
        });
      }
    }
  });

export type ProfileForm = z.infer<typeof profileSchema>;
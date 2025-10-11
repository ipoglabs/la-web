import { z } from 'zod';

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
 * Step 1 – General Information validation
 * - Nationality removed
 * - Country + State required (Locality)
 * - Residency kept for backend (you derive `${state}, ${country}` before submit/route change)
 */
export const generalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Please enter your first name so people know who you are.'),
  lastName: z
    .string()
    .min(1, 'Please enter your last name.'),
  dateOfBirth: z
    .string()
    .min(1, 'Please enter your date of birth.')
    .refine((v) => isAdult(v), {
      message:
        'Sorry — you need to be 18 or older to use Lokalads. If that’s wrong, double-check your birth date.',
    }),
  gender: z.enum(['male', 'female', 'prefer-not-to-say', 'other'], {
    errorMap: () => ({ message: 'Please select a gender option.' }),
  }),

  // Locality (required)
  country: z.string().min(1, 'Select your country.'),
  state: z.string().min(1, 'Select your state/region.'),

  // Keep for backend compatibility (you set it from country/state in the UI)
  residency: z
    .string()
    .min(1, 'Tell us where you’re based so we can show local listings.'),

  email: z
    .string()
    .email('Please enter a valid email address.'),
});

export type GeneralInfoForm = z.infer<typeof generalInfoSchema>;

/**
 * Step 3 – Phone Verification validation
 */
export const phoneSchema = z.object({
  primaryNumber: z
    .string()
    .min(7, 'Primary number must be valid')
    .regex(/^[0-9+\- ]+$/, 'Only digits, +, - and spaces allowed'),
  secondaryNumber1: z.string().optional(),
  secondaryNumber2: z.string().optional(),
});

export type PhoneForm = z.infer<typeof phoneSchema>;

/**
 * Step 4 – Profile Setup validation
 */
export const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (val) =>
        /[A-Z]/.test(val) &&
        /[a-z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      'Password must include uppercase, lowercase, number, and special character'
    ),
  role: z.string().min(1, 'Role is required'),
});

export type ProfileForm = z.infer<typeof profileSchema>;

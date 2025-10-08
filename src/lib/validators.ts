// lib/validators.ts
import { z } from 'zod';

/**
 * Step 1 – General Information validation
 */
export const generalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z
    .enum(['male', 'female', 'other'])
    .or(z.literal(''))
    .refine((v) => !!v, 'Gender is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  residency: z.string().min(1, 'Residency is required'),
  email: z.string().email('Enter a valid email address'),
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

import { z } from "zod";

export const userIdSchema = z
  .string()
  .trim()
  .min(1, "Profile ID is required")
  .max(18, "Max 18 characters allowed")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscore allowed");

export type UserIdForm = z.infer<typeof userIdSchema>;
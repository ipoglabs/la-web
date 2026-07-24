import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Country } from "@/lib/data/countries"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(country: Country, phone: string) {
  return `${country.dial} ${phone}`
}

/**
 * Controls how the email is displayed in the verify-otp stage.
 *
 * - `"local-first"` (Option A): `j***@gmail.com`         — first char only + domain
 * - `"partial"`     (Option B): `jo***ne@gmail.com`       — first 2 + last 1 of local part
 * - `"full"`        (Option C): `johndoe@gmail.com`       — unmasked (default)
 */
export type EmailMaskMode = "local-first" | "partial" | "full"

/** Masks an email address according to the chosen mode. */
export function maskEmail(email: string, mode: EmailMaskMode): string {
  if (mode === "full") return email
  const atIndex = email.lastIndexOf("@")
  if (atIndex < 1) return email
  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex) // includes the @
  if (mode === "local-first") return `${local[0]}***${domain}`
  // partial — show first 2 + last 1 of local (fallback to local-first if too short)
  if (local.length <= 3) return `${local[0]}***${domain}`
  return `${local.slice(0, 2)}***${local.slice(-1)}${domain}`
}

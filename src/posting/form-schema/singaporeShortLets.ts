// Singapore homes can't be let for under 3 months (URA: private homes;
// HDB flats need 6 months), so a Travel & Stays › Holiday Rentals ad pinned
// in Singapore may only offer monthly lets of 90+ nights. Holiday homes
// abroad (Bintan, Batam, Johor Bahru…) keep nightly and weekly lets.
//
// The pin is chosen after the details step, so the preview page runs this
// before submitting, and addPost / updatePost run it again on the server.
// Property › Holiday Rental needs no check: its Singapore form is monthly only.

import { resolveCategoryId, resolveSubcategoryId } from "@/lib/category-map";

export const SG_MIN_LET_NIGHTS = 90;

export const SG_SHORT_LET_MESSAGE =
  "Homes in Singapore can't be let for under 3 months. Choose Monthly lets only, a Minimum Stay of at least 90 nights and a price per month, or pin a holiday home outside Singapore.";

/** Whether a Google-formatted address is in Singapore ("Tampines, Singapore", "… Singapore 529510"). */
export function isSingaporeAddress(address: string | undefined | null): boolean {
  return /(^|,)\s*Singapore(\s+\d{6})?\s*$/i.test(String(address ?? "").trim());
}

const asList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(String) : typeof v === "string" && v ? v.split(",").map((s) => s.trim()) : [];

/**
 * The error to show, or null when the ad is fine. `data` is the post as it
 * will be saved, attributes flattened in (stayLengths, minNights, priceUnit).
 */
export function singaporeShortLetError(
  category: string | undefined,
  subcategory: string | undefined,
  data: Record<string, unknown>,
  address: string | undefined | null,
): string | null {
  const cat = resolveCategoryId(String(category ?? ""));
  if (cat !== "travel_stays" || resolveSubcategoryId(cat, String(subcategory ?? "")) !== "holiday_rentals") return null;
  if (!isSingaporeAddress(address)) return null;

  const lets = asList(data.stayLengths);
  const minNights = Number(data.minNights);
  const unit = String(data.priceUnit ?? "");
  const ok =
    lets.length > 0 &&
    lets.every((l) => l === "monthly") &&
    Number.isFinite(minNights) &&
    minNights >= SG_MIN_LET_NIGHTS &&
    (unit === "" || unit === "month");
  return ok ? null : SG_SHORT_LET_MESSAGE;
}

// Shared handling of "goodToKnow" field values (the seller's own label/value
// points from components/good-to-know) — used by the form, the FormData
// builder, the server actions and validation so they all agree on its shape.

import { GOOD_TO_KNOW, type GoodToKnowValue } from "./types";

/**
 * Accepts the store value, or its JSON string from FormData, and returns it
 * trimmed with fully-empty rows dropped — or undefined when nothing is left.
 */
export function normalizeGoodToKnow(raw: unknown): GoodToKnowValue | undefined {
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  if (!value || typeof value !== "object") return undefined;

  const { title, points } = value as Partial<GoodToKnowValue>;
  const cleaned = (Array.isArray(points) ? points : [])
    .map((p) => ({ label: String(p?.label ?? "").trim(), value: String(p?.value ?? "").trim() }))
    .filter((p) => p.label || p.value);
  if (!cleaned.length) return undefined;

  return { title: typeof title === "string" && title.trim() ? title.trim() : GOOD_TO_KNOW.titles[0], points: cleaned };
}

/** Error message for an invalid value, or null. */
export function goodToKnowError(value: GoodToKnowValue): string | null {
  if (!(GOOD_TO_KNOW.titles as readonly string[]).includes(value.title)) return "Good To Know has an invalid title.";
  if (value.points.length > GOOD_TO_KNOW.maxPoints) return `Good To Know allows up to ${GOOD_TO_KNOW.maxPoints} points.`;
  for (const p of value.points) {
    if (!p.label || !p.value) return "Each Good To Know point needs both a label and a value.";
    if (p.label.length > GOOD_TO_KNOW.labelMax || p.value.length > GOOD_TO_KNOW.valueMax) {
      return `Good To Know labels are limited to ${GOOD_TO_KNOW.labelMax} and values to ${GOOD_TO_KNOW.valueMax} characters.`;
    }
  }
  return null;
}

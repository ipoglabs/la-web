export type StepKey =
  | "select-category"
  | "details"
  | "upload-photo"
  | "pick-location"
  | "preview";

export const STEPS: StepKey[] = [
  "select-category",
  "details",
  "upload-photo",
  "pick-location",
  "preview",
];

export const STEP_ROUTES: Record<StepKey, string> = {
  "select-category": "/post/select-category",
  details: "/post/details",
  "upload-photo": "/post/upload-photo",
  "pick-location": "/post/pick-location",
  preview: "/post/preview",
};

export function stepIndex(step: StepKey) {
  return STEPS.indexOf(step);
}

export function prevStep(step: StepKey): StepKey | null {
  const i = stepIndex(step);
  return i > 0 ? STEPS[i - 1] : null;
}

export function nextStep(step: StepKey): StepKey | null {
  const i = stepIndex(step);
  return i >= 0 && i < STEPS.length - 1 ? STEPS[i + 1] : null;
}

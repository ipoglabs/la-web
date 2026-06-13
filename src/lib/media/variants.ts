export const VARIANT_NAMES = ["small", "medium", "large", "extra-large"] as const;
export type ImageVariant = (typeof VARIANT_NAMES)[number];

export const VARIANT_SIZES: Record<ImageVariant, number> = {
  small: 150,
  medium: 400,
  large: 800,
  "extra-large": 1200,
};

export const VARIANT_NAMES = ["thumbnail", "small", "medium", "large"] as const;
export type ImageVariant = (typeof VARIANT_NAMES)[number];

export const VARIANT_SIZES: Record<ImageVariant, number> = {
  thumbnail: 150,
  small: 400,
  medium: 800,
  large: 1200,
};

import type { Listing, KeyValueRow } from "@/types/listing";
import type { IPost } from "@/models/post";
import { type LeanPost, resolvePostId, resolvePrice, resolveDetailsLabel, mapStatus } from "@/lib/mapPostToFeaturedItem";
import { sanitizeDescriptionToHtml } from "@/lib/sanitizeDescription";

/** Subset of the real User doc this mapper needs — pass a `.populate("ownerId", ...)` result. */
export type LeanOwner = {
  _id: unknown;
  fullName?: string;
  image?: string;
  role?: string;
  isEmailVerified?: boolean;
  isPrimaryNumberVerified?: boolean;
  createdAt?: Date;
};

const COUNTRY_CENTERS: Record<string, { lat: number; lng: number }> = {
  in: { lat: 20.5937, lng: 78.9629 },
  gb: { lat: 54.0, lng: -2.0 },
  sg: { lat: 1.3521, lng: 103.8198 },
};

// Best-effort, generic across categories — not the rich per-category field
// set the mock data has (see mock-listing-schema.ts's per-category
// skeletons). Picks whichever of these are actually present on the post,
// always including Category/Subcategory (guaranteed present) so the table
// is never empty even for a post with no category-specific fields captured.
const KEY_DETAIL_FIELDS: { key: string; field: keyof IPost; format?: (v: unknown) => string }[] = [
  { key: "Property Type", field: "propertyType" },
  { key: "Bedrooms", field: "beds" },
  { key: "Bathrooms", field: "baths" },
  { key: "Furnishing", field: "furnishing" },
  { key: "Make", field: "make" },
  { key: "Model", field: "model" },
  { key: "Year", field: "year" },
  { key: "Mileage", field: "kms", format: (v) => `${v} km` },
  { key: "Fuel Type", field: "fuelType" },
  { key: "Transmission", field: "transmission" },
  { key: "Job Type", field: "jobType" },
  { key: "Work Mode", field: "workMode" },
  { key: "Experience", field: "experience" },
  { key: "Company", field: "company" },
  { key: "Service Type", field: "serviceType" },
  { key: "Availability", field: "availability" },
  { key: "Pet Type", field: "petType" },
  { key: "Breed", field: "breed" },
  { key: "Condition", field: "condition" },
];

function buildKeyDetails(post: LeanPost): KeyValueRow[] {
  const rows: KeyValueRow[] = [
    { key: "Category", value: post.category },
    { key: "Subcategory", value: post.subcategory },
  ];
  for (const { key, field, format } of KEY_DETAIL_FIELDS) {
    if (rows.length >= 6) break;
    const value = post[field];
    if (value == null || value === "") continue;
    rows.push({ key, value: format ? format(value) : String(value) });
  }
  return rows;
}

function buildGoodToKnow(post: LeanPost, sellerName: string): KeyValueRow[] {
  const rows: KeyValueRow[] = [
    { key: "Listed By", value: sellerName },
    { key: "Ad ID", value: post.adsId || String((post as { _id: unknown })._id) },
  ];
  if (post.negotiable) rows.push({ key: "Negotiable", value: post.negotiable });
  if (post.condition) rows.push({ key: "Condition", value: post.condition });
  if (post.deliveryAvailable) rows.push({ key: "Delivery", value: post.deliveryAvailable });
  return rows.slice(0, 6);
}

export function mapPostToListing(post: LeanPost, ownerUser?: LeanOwner | null): Listing {
  const id = resolvePostId(post);
  const { priceLabel, priceSuffix } = resolvePrice(post);

  const coordinates =
    post.location?.lat != null && post.location?.lng != null
      ? { lat: post.location.lat, lng: post.location.lng }
      : (COUNTRY_CENTERS[post.country ?? ""] ?? { lat: 0, lng: 0 });

  const sellerName = ownerUser?.fullName || post.seller_info?.name || "Seller";

  return {
    id,
    href: `/listings/${id}`,
    advId: id,
    images: (post.images ?? []).map((src) => ({ src, alt: post.name })),
    priceLabel,
    priceSuffix,
    title: post.name,
    detailsLabel: resolveDetailsLabel(post),
    locationLabel: post.location?.address ?? "",
    postedAt: new Date(post.createdAt ?? Date.now()).toISOString(),
    status: mapStatus(post.status),
    description: sanitizeDescriptionToHtml(post.description ?? ""),
    keyDetails: buildKeyDetails(post),
    goodToKnow: buildGoodToKnow(post, sellerName),
    coordinates,
    seller: {
      // Real Mongo User id when the owner is populated — this is what lets
      // ChitChat (listings/[listingId]/ChitChat.tsx) recognize a real,
      // messageable seller instead of falling back to its "not set up yet"
      // state (it validates seller.id looks like a real ObjectId).
      id: ownerUser ? String(ownerUser._id) : undefined,
      name: sellerName,
      role: ownerUser?.role ? ownerUser.role[0].toUpperCase() + ownerUser.role.slice(1) : "Individual",
      location: post.location?.address ?? "",
      tagline: "LokalAds member",
      memberSince: String(new Date(ownerUser?.createdAt ?? post.createdAt ?? Date.now()).getFullYear()),
      activeListings: 1,
      lastActive: "Recently",
      likes: "0",
      followers: "0",
      verified: Boolean(ownerUser?.isEmailVerified || ownerUser?.isPrimaryNumberVerified),
      cover: post.images?.[0] ?? "/img/img1.jpg",
      avatar: ownerUser?.image || post.images?.[0] || "/img/img1.jpg",
    },
  };
}

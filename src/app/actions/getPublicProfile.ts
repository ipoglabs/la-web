"use server";

/**
 * Public-safe lookup for the `/u/[handle]` public profile page — the real
 * (non-demo) counterpart to `handle-map.ts`'s hardcoded seller pool. Handle
 * IS the User's `userId` field (there's no separate `handle` field on the
 * schema — see models/user.ts). Deliberately selects a narrow allowlist:
 * never email, phone, dateOfBirth, nationality/residency, savedLocations —
 * unlike getCurrentUser.ts, this result is served to anyone, logged in or
 * not.
 */

import connectDB from "@/config/database";
import User from "@/models/user";
import Post from "@/models/post";
import Review from "@/models/review";
import { mapPostToListing, type LeanOwner } from "@/lib/mapPostToListing";
import type { LeanPost } from "@/lib/mapPostToFeaturedItem";
import type { Listing } from "@/types/listing";
import { BASE_ROLE, getRoleLabel } from "@/config/roles";

type LeanReview = {
  _id: unknown;
  name: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
};

export type PublicReview = {
  id: string;
  author: string;
  rating: number;
  date: string; // ISO
  comment: string;
};

export type PublicProfile = {
  userId: string; // the /u/[handle] slug
  // Real Mongo ObjectId (as a string) — never derivable from `userId` above.
  // Needed client-side so "Send a message" can start a real conversation via
  // POST /api/conversations, which requires the recipient's actual `_id`.
  id: string;
  name: string;
  avatar: string;
  // Public-facing "hats worn" badges — from the Roles editor's roles[] +
  // customRole (see models/user.ts), formatted with any specialty attached
  // (e.g. "Agent / Broker · Real Estate Agent"). Falls back to BASE_ROLE's
  // label ("Individual") when the user hasn't picked any explicit roles —
  // same convention as ProfilePageScreen's buildDisplayedRoleBadges.
  roleLabels: string[];
  tagline: string;
  location: string;
  memberSinceYear: number;
  verified: boolean;
};

export type PublicProfileResult = {
  profile: PublicProfile;
  listings: Listing[];
  reviews: PublicReview[];
};

export async function getPublicProfileByHandle(
  handle: string
): Promise<PublicProfileResult | null> {
  if (!handle) return null;
  await connectDB();

  const user = await User.findOne({
    userId: handle,
    isDeleted: { $ne: true },
    isSuspended: { $ne: true },
    accountStatus: "Active",
  })
    .select(
      "userId fullName image publicRole roleTitle roleDescription roles roleSpecialties customRole locality address isEmailVerified isPrimaryNumberVerified createdAt"
    )
    .lean();

  if (!user) return null;

  const ownerUser: LeanOwner = {
    _id: user._id,
    userId: user.userId,
    fullName: user.fullName,
    image: user.image,
    publicRole: user.publicRole,
    isEmailVerified: user.isEmailVerified,
    isPrimaryNumberVerified: user.isPrimaryNumberVerified,
    createdAt: user.createdAt,
  };

  const [posts, reviews] = await Promise.all([
    Post.find({ ownerId: user._id, status: "active" })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    Review.find({ userId: user.userId }).sort({ createdAt: -1 }).limit(50).lean(),
  ]);

  const listings = posts.map((post) => mapPostToListing(post as LeanPost, ownerUser));

  const location =
    [user.address?.city, user.address?.country].filter(Boolean).join(", ") ||
    user.locality ||
    "";

  const roleIds: string[] = Array.isArray(user.roles) ? user.roles : [];
  const specialties: Record<string, unknown> =
    user.roleSpecialties && typeof user.roleSpecialties === "object" ? user.roleSpecialties : {};
  const explicitRoleLabels = [
    ...roleIds.map((id) => {
      const specialty = typeof specialties[id] === "string" ? (specialties[id] as string).trim() : "";
      return specialty ? `${getRoleLabel(id)} · ${specialty}` : getRoleLabel(id);
    }),
    ...(user.customRole ? [user.customRole] : []),
  ];
  const roleLabels = explicitRoleLabels.length > 0 ? explicitRoleLabels : [BASE_ROLE.label];

  return {
    profile: {
      userId: user.userId,
      id: String(user._id),
      name: user.fullName,
      avatar: user.image || "",
      roleLabels,
      tagline: user.roleDescription || "LokalAds member",
      location,
      memberSinceYear: new Date(user.createdAt).getFullYear(),
      verified: Boolean(user.isEmailVerified || user.isPrimaryNumberVerified),
    },
    listings,
    reviews: (reviews as LeanReview[]).map((r) => ({
      id: String(r._id),
      author: r.name,
      rating: r.rating,
      date: r.createdAt?.toISOString?.() || new Date().toISOString(),
      comment: r.comment || "",
    })),
  };
}

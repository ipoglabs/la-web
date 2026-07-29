"use server";

import connectDB from "@/config/database";
import Review from "@/models/review";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

/**
 * One review per (profile, reviewer) pair — upserts so re-submitting edits
 * your existing review instead of stacking duplicates. `reviewerId`/`userId`
 * are both the stable `User.userId` handle (see models/review.ts), matching
 * how every other identity reference in this app works.
 */
export async function submitReview(
  profileHandle: string,
  rating: number,
  comment: string
): Promise<{ error: string } | { success: true }> {
  const reviewer = await getCurrentUser();
  if (!reviewer) {
    return { error: "Sign in to leave a review." };
  }
  if (reviewer.profileId === profileHandle) {
    return { error: "You can't review your own profile." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Pick a rating between 1 and 5 stars." };
  }
  const trimmedComment = comment.trim();
  if (!trimmedComment) {
    return { error: "Add a comment before submitting." };
  }

  await connectDB();
  await Review.findOneAndUpdate(
    { userId: profileHandle, reviewerId: reviewer.profileId },
    {
      userId: profileHandle,
      reviewerId: reviewer.profileId,
      name: reviewer.fullName,
      rating,
      comment: trimmedComment,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { success: true };
}

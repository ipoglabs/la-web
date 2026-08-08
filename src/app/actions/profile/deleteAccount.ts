"use server";

import connectDB from "@/lib/db";
import User from "@/models/user";
import Post from "@/models/post";
import { getSession, clearSession } from "@/lib/auth";
import { sendDeleteAccountEmail } from "@/lib/profile/deleteAccountEmail";

export async function softDeleteAccount(feedback?: string) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user: any = await User.findById(session.userId).select("isDeleted email fullName primaryNumber");
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.isDeleted) {
      await clearSession();
      return { success: false, message: "Account already deleted" };
    }

    const { email, fullName, primaryNumber } = user;

    // Anonymize immediately (no grace period): $unset — not null/undefined —
    // is required so the sparse unique indexes on email/primaryNumber/
    // appleEmailId treat this account as if the field were never set,
    // freeing the identifier for a genuinely fresh re-registration. Bypasses
    // the pre-validate hook (which would otherwise reject a doc with neither
    // email nor primaryNumber) since updateOne doesn't run document
    // middleware — that invariant only matters for live, loggable-in accounts.
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          fullName: "Deleted User",
          isDeleted: true,
          accountStatus: "Deleted",
          isSuspended: false,
          deletedAt: new Date(),
          deleteFeedback: feedback || "",
          isEmailVerified: false,
          isPrimaryNumberVerified: false,
          deletedIdentitySnapshot: { email, primaryNumber, fullName },
        },
        $unset: {
          email: "",
          primaryNumber: "",
          appleEmailId: "",
          secondaryNumber1: "",
          secondaryNumber2: "",
          image: "",
        },
        $push: {
          audit: { action: "ACCOUNT_DELETED", at: new Date() },
        },
      }
    );

    // Hide this user's listings from every public/owner-facing read path —
    // getPublicProfile, /api/listings, etc. all filter on status: "active".
    // The documents (and their seller_info/chat history) stay in Mongo, just
    // no longer reachable outside a direct DB/admin lookup.
    await Post.updateMany(
      { ownerId: user._id, status: { $ne: "deleted" } },
      { $set: { status: "deleted", deletedAt: new Date() } }
    );

    await clearSession();

    try {
      if (email) {
        await sendDeleteAccountEmail({ fullName: fullName || "", email });
      }
    } catch (err) {
      console.error(err);
    }

    return { success: true };

  } catch (err) {
    console.error(err);
    return { success: false, message: "Something went wrong" };
  }
}

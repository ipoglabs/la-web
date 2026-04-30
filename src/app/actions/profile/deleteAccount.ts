"use server";

import connectDB from "@/config/database";
import User from "@/models/user";
import { getSession, clearSession } from "@/lib/auth";
import { sendDeleteAccountEmail } from "@/lib/profile/deleteAccountEmail";

export async function softDeleteAccount(feedback?: string) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user: any = await User.findById(session.userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.isDeleted) {
      await clearSession();
      return { success: false, message: "Account already deleted" };
    }

    user.isDeleted = true;
    user.accountStatus = "Deleted";
    user.isSuspended = false;

    user.deletedAt = new Date();
    user.deleteFeedback = feedback || "";

    user.audit.push({
      action: "ACCOUNT_DELETED",
      at: new Date(),
    });

    await user.save();

    await clearSession();

    try {
      if (user.email) {
        await sendDeleteAccountEmail({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
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
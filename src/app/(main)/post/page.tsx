import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import connectDB from "@/config/database";
import User from "@/models/user";

/**
 * `/post` is the wizard's entry point — every "+ POST" click lands here
 * before the first real step. Verification is checked right here rather
 * than only at final submit (addPost.ts:120-131 has the same check) so an
 * unverified user isn't let through 5 steps of category/details/photos/
 * location only to be blocked at the very last click.
 */
export default async function PostPage() {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login?redirect=/post");
  }

  await connectDB();
  const accountUser = await User.findById(session.userId).select(
    "isEmailVerified isPrimaryNumberVerified"
  );
  if (!accountUser || !accountUser.isEmailVerified || !accountUser.isPrimaryNumberVerified) {
    redirect("/account-settings?verify=1");
  }

  redirect("/post/select-category");
}

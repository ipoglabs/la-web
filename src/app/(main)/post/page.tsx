import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getVerificationStatus } from "@/lib/verification";

/**
 * `/post` is the wizard's entry point — every "+ POST" click lands here
 * before the first real step. Verification is checked right here rather
 * than only at final submit (addPost.ts has the same check) so an
 * unverified user isn't let through 5 steps of category/details/photos/
 * location only to be blocked at the very last click.
 */
export default async function PostPage() {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login?redirect=/post");
  }

  const verification = await getVerificationStatus(session.userId);
  if (!verification?.isFullyVerified) {
    redirect("/account-settings?verify=1");
  }

  redirect("/post/select-category");
}

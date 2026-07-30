import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getVerificationStatus } from "@/lib/verification";
import ChatPageClient from "./ChatPageClient";

/**
 * `/chat` is gated the same way as `/post` (see post/page.tsx) — a signed-in
 * but not-fully-verified account (missing/unverified email or phone) can't
 * open the inbox at all. The API routes (`/api/conversations`,
 * `/api/conversations/[id]/messages`) enforce the same rule server-side as
 * a second layer, since this page-level check only covers the `/chat` entry
 * point and not the inline ChitChat widget on listing pages.
 */
export default async function ChatPage() {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login?redirect=/chat");
  }

  const verification = await getVerificationStatus(session.userId);
  if (!verification?.isFullyVerified) {
    redirect("/account-settings?verify=1");
  }

  return <ChatPageClient />;
}

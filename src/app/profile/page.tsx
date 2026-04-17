import { getCurrentUser } from "@/app/actions/getCurrentUser";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  // ✅ handle unauthenticated / deleted users safely
  if (!user) {
    redirect("/login"); // or "/account-deleted"
  }

  return <ProfileClient user={user} />;
}
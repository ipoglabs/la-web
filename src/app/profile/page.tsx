import { getCurrentUser } from "@/app/actions/getCurrentUser";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) return null;

  return <ProfileClient user={user} />;
}
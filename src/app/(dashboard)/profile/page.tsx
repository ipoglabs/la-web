import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { ProfilePageScreen } from "./ProfilePageScreen";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/profile");

  return <ProfilePageScreen mode="profile" user={user} />;
}

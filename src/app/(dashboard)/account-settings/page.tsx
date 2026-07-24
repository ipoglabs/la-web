import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { ProfilePageScreen } from "../profile/ProfilePageScreen";

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/account-settings");

  return <ProfilePageScreen mode="account-settings" user={user} />;
}

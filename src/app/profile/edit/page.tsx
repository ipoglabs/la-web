import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import ClientProfile from "../ClientProfile";

export const metadata = { title: "Edit Profile" };

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
        <div className="border rounded p-4 bg-slate-50">
          You are not logged in.
          <div className="mt-3">
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <Link href="/profile">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <ClientProfile user={user} />
    </main>
  );
}

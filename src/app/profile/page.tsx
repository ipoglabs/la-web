import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
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
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <Link href="/profile/edit">
          <Button>Edit</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user.image || "/avatar-placeholder.png"}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <p className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-slate-600">@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Primary Number</p>
              <p className="font-medium">{user.primaryNumber}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Secondary Number 1</p>
              <p className="font-medium">{user.secondaryNumber1 || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Secondary Number 2</p>
              <p className="font-medium">{user.secondaryNumber2 || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Date of Birth</p>
              <p className="font-medium">{user.dateOfBirth || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Gender</p>
              <p className="font-medium">{user.gender || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Nationality</p>
              <p className="font-medium">{user.nationality || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Residency</p>
              <p className="font-medium">{user.residency || "—"}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs text-slate-500">Marketing Opt-in</p>
              <p className="font-medium">{user.marketingOptIn ? "Subscribed" : "Not subscribed"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientList from "./ClientList";
import { getMyPosts } from "@/app/actions/getMyPosts";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MyAdsPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">My Ads</h1>
        <div className="border rounded-md p-4 bg-slate-50">
          You are not logged in.{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </main>
    );
  }

  const ownerId = session.userId || session.id;
  const email = session.email;

  let rows: any[] = [];

  try {
    const data = await getMyPosts({ ownerId, email });
    rows = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("❌ getMyPosts failed:", e);
    rows = [];
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">My Ads</h1>
        <Link href="/post/select-category">
          <Button>New Post</Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <p>No ads found.</p>
      ) : (
        <ClientList
          initialRows={rows}
          ownerEmail={email ?? ""}
          ownerId={ownerId ?? ""}
        />
      )}
    </main>
  );
}

import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientList from "./ClientList";
import { getMyPosts } from "@/app/actions/getMyPosts";
import { verifyToken } from "@/lib/auth";

function extractEmailFromDecoded(decoded: any): string | undefined {
  if (!decoded || typeof decoded !== "object") return undefined;
  return (
    decoded.email ||
    decoded.user?.email ||
    (typeof decoded.sub === "string" && decoded.sub.includes("@") ? decoded.sub : undefined)
  );
}

function toPlain(row: any) {
  // defensive normalize if server action didn’t already do it
  const clone = JSON.parse(JSON.stringify(row));
  clone.id = String(clone.id ?? clone._id ?? "");
  delete clone._id;
  return clone;
}

export default async function MyAdsPage() {
  const cookieStore = cookies();
  let raw = cookieStore.get("token")?.value;
  if (raw?.startsWith("Bearer ")) raw = raw.slice("Bearer ".length);

  const decoded = raw ? verifyToken(raw) : null;
  const email = extractEmailFromDecoded(decoded);

  if (!email) {
    return (
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Ads</h1>
          <Link href="/post/select-category">
            <Button>New Post</Button>
          </Link>
        </div>
        <div className="border rounded-md p-4 text-slate-700 bg-slate-50">
          You are not logged in or your session expired.
          <div className="mt-3 text-sm">
            Please <Link href="/login" className="underline">log in</Link> again.
          </div>
        </div>
      </main>
    );
  }

  const rows = await getMyPosts({ email });
  const safeRows = rows.map(toPlain);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Ads</h1>
        <Link href="/post/select-category">
          <Button>New Post</Button>
        </Link>
      </div>

      {safeRows.length === 0 ? (
        <p className="text-slate-600">
          No ads found for <b>{email}</b>.{" "}
          <Link href="/post/select-category" className="underline">
            Create your first ad
          </Link>
          .
        </p>
      ) : (
        <ClientList initialRows={safeRows} ownerEmail={email} />
      )}
    </main>
  );
}

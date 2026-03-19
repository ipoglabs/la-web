import { cookies, headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientList from "./ClientList";
import { getMyPosts } from "@/app/actions/getMyPosts";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function extractEmailFromDecoded(decoded: any): string | undefined {
  if (!decoded || typeof decoded !== "object") return undefined;
  return (
    decoded.email ||
    decoded.user?.email ||
    (typeof decoded.sub === "string" && decoded.sub.includes("@")
      ? decoded.sub
      : undefined)
  );
}

function extractUserIdFromDecoded(decoded: any): string | undefined {
  if (!decoded || typeof decoded !== "object") return undefined;
  return (
    decoded.id ||
    decoded.userId ||
    decoded.user?.id ||
    (typeof decoded.sub === "string" && !decoded.sub.includes("@")
      ? decoded.sub
      : undefined)
  );
}

export default async function MyAdsPage() {
  let raw = "";

  try {
    const cookieStore = await cookies();
    const hdrs = await headers();

    raw =
      cookieStore?.get("token")?.value ||
      cookieStore?.get("session")?.value ||
      hdrs?.get("authorization") ||
      "";
  } catch (e) {
    console.error("❌ Cookie/Header read failed:", e);
  }

  if (raw?.startsWith("Bearer ")) {
    raw = raw.slice(7).trim();
  }

  let decoded: any = null;

  try {
    decoded = raw ? verifyToken(raw) : null;
  } catch (e) {
    console.error("❌ Token decode failed:", e);
  }

  const email = extractEmailFromDecoded(decoded);
  const ownerId = extractUserIdFromDecoded(decoded);

  if (!ownerId && !email) {
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

  let rows: any[] = [];

  try {
    const data = await getMyPosts({ ownerId, email });
    rows = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("❌ getMyPosts failed:", e);
    rows = [];
  }

  // ✅ DEBUG: SERVER LOG
  console.log(
    "✅ SERVER - DB STATUS:",
    rows.map((r) => ({ id: r.id, status: r.status }))
  );

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
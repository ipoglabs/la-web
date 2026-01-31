// src/app/admin/users/[id]/page.tsx
import connectDB from "@/config/database";
import Post from "@/models/post";
import User from "@/models/user";
import { notFound } from "next/navigation";
import { toClientPost } from "@/lib/serialize";
import AdminUserAdCard from "./AdminUserAdCard";
import { Types } from "mongoose";
import Link from "next/link";
import AdminUserActions from "./AdminUserActions"; // ✅ correct import

function fmtDate(d?: any) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(dt);
}

function fmtDateTime(d?: any) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(dt);
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
        ok
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      {label}
    </span>
  );
}

export default async function AdminUserAds({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();

  const user = await User.findById(params.id)
    .select([
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "nationality",
      "residency",
      "country",
      "state",
      "locality",
      "email",
      "isEmailVerified",
      "primaryNumber",
      "secondaryNumber1",
      "secondaryNumber2",
      "isPhoneVerified",
      "role",
      "roleTitle",
      "roleDescription",
      "image",
      "provider",
      "marketingOptIn",
      "createdAt",
      "updatedAt",
    ])
    .lean();

  if (!user) return notFound();

  // ✅ find posts by ownerId OR seller_info.email (same as getMyPosts)
  const or: any[] = [];

  if (Types.ObjectId.isValid(params.id)) {
    or.push({ ownerId: new Types.ObjectId(params.id) });
  }

  if (user.email) {
    or.push({
      $and: [
        { "seller_info.email": { $type: "string" } },
        { "seller_info.email": new RegExp(`^${user.email}$`, "i") },
      ],
    });
  }

  const posts =
    or.length === 0
      ? []
      : await Post.find({ $or: or }).sort({ updatedAt: -1 }).lean();

  const safePosts = posts.map((p: any) => toClientPost(p));

  return (
    <div className="space-y-6">
      {/* Top bar: Back + Delete */}
      <div className="flex items-center justify-between">
        <Link href="/admin/users" className="text-sm text-blue-600 underline">
          ← Back to users
        </Link>

        {/* ✅ Delete button top-right */}
        <AdminUserActions userId={params.id} userEmail={user.email} />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">
            Ads by {user.firstName} {user.lastName}
          </h1>
          <div className="text-sm text-slate-600">{user.email}</div>
          <div className="mt-2 flex gap-2">
            <Pill
              ok={!!user.isEmailVerified}
              label={user.isEmailVerified ? "Email verified" : "Email not verified"}
            />
            <Pill
              ok={!!user.isPhoneVerified}
              label={user.isPhoneVerified ? "Phone verified" : "Phone not verified"}
            />
          </div>
        </div>

        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-16 w-16 rounded-full object-cover border"
          />
        ) : null}
      </div>

      {/* User details */}
      <div className="bg-white rounded-xl shadow border p-5">
        <h2 className="font-semibold mb-4">User Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-500 text-xs">Date of Birth</div>
            <div className="font-medium">{fmtDate((user as any).dateOfBirth)}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Gender</div>
            <div className="font-medium">{(user as any).gender || "-"}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Locality</div>
            <div className="font-medium">{(user as any).locality || "-"}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Country / State</div>
            <div className="font-medium">
              {[(user as any).country, (user as any).state].filter(Boolean).join(" / ") || "-"}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Primary Number</div>
            <div className="font-medium">{(user as any).primaryNumber || "-"}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs">Joined</div>
            <div className="font-medium">{fmtDateTime((user as any).createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Ads list */}
      <div className="bg-white rounded-xl shadow border p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Ads</h2>
          <div className="text-sm text-slate-600">
            Total: <b>{safePosts.length}</b>
          </div>
        </div>

        {safePosts.length === 0 ? (
          <div className="text-sm text-slate-500">No ads found for this user.</div>
        ) : (
          <div className="space-y-3">
            {safePosts.map((p: any) => (
              <AdminUserAdCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

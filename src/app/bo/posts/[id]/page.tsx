import connectDB from "@/config/database";
import Post from "@/models/post";
import User from "@/models/user";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdminPostActions from "./AdminPostActions";

function fmt(d?: any) {
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

export default async function AdminPostDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();

  const post = await Post.findById(params.id).lean();
  if (!post) return notFound();

  const owner = post.ownerId ? await User.findById(post.ownerId).lean() : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/bo/posts" className="text-sm text-blue-600 underline">
        ← Back to posts
      </Link>

      {/* Header */}
      <div className="bg-white p-5 rounded-xl shadow border">
        <h1 className="text-2xl font-semibold">{post.name}</h1>
        <p className="text-sm text-slate-600 mt-1">
          {post.category} • {post.subcategory}
        </p>

        <div className="mt-3 text-sm">
          Status: <b className="capitalize text-blue-700">{post.status}</b>
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Created: {fmt(post.createdAt)} <br />
          Updated: {fmt(post.updatedAt)}
        </div>
      </div>

      {/* Owner */}
      <div className="bg-white p-5 rounded-xl shadow border">
        <h2 className="font-semibold mb-2">Posted By</h2>
        {owner ? (
          <div className="text-sm space-y-1">
            <div>
              Name: <b>{owner.firstName} {owner.lastName}</b>
            </div>
            <div>Email: {owner.email}</div>
            <div>Phone: {owner.primaryNumber}</div>
            <div>Role: {owner.role}</div>
          </div>
        ) : (
          <div className="text-sm">
            Email: {post.seller_info?.email}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white p-5 rounded-xl shadow border">
        <h2 className="font-semibold mb-2">Description</h2>
        <p className="text-sm whitespace-pre-line">{post.description || "-"}</p>
      </div>

      {/* Location */}
      {post.location && (
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-2">Location</h2>
          <pre className="text-sm text-slate-700 whitespace-pre-wrap">
            {JSON.stringify(post.location, null, 2)}
          </pre>
        </div>
      )}

      {/* Images */}
      {Array.isArray(post.images) && post.images.length > 0 && (
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-3">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {post.images.map((img: string, i: number) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={img}
                alt=""
                className="rounded border object-cover h-40 w-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* Admin actions */}
      <AdminPostActions postId={post._id.toString()} status={String(post.status)} />
    </div>
  );
}

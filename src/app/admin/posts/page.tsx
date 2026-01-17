import connectDB from "@/config/database";
import Post from "@/models/post";
import AdminPostRow from "./AdminPostRow";
import { toClientPost } from "@/lib/serialize";

export default async function AdminPostsPage() {
  await connectDB();

  const posts = await Post.find()
    .sort({ updatedAt: -1 })
    .populate("ownerId", "email")
    .lean();

  // ✅ Stable JSON-safe shape for client component
  const safePosts = posts.map((p: any) => {
    const obj: any = toClientPost(p);

    const ownerEmail =
      (p.ownerId && typeof p.ownerId === "object" ? p.ownerId.email : null) ||
      p.seller_info?.email ||
      "";

    return {
      id: obj.id,
      name: obj.name,
      category: obj.category,
      subcategory: obj.subcategory,
      status: obj.status,
      ownerEmail,
    };
  });

  return (
    <div className="space-y-3">
      {safePosts.map((p: any) => (
        <AdminPostRow key={p.id} post={p} />
      ))}
    </div>
  );
}

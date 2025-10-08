import connectDB from "@/lib/db";
import Post from "@/models/post";
import { notFound } from "next/navigation";

export default async function PostDetails({ params }: { params: { id: string } }) {
  await connectDB();
  const post = await Post.findById(params.id).lean();
  if (!post) return notFound();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold">{post.name}</h1>
      {/* ...rest of your details UI */}
    </div>
  );
}

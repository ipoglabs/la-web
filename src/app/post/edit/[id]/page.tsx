// src/app/post/edit/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditHydrator from "./ui/EditHydrator";
import { getPostById } from "@/app/actions/getPostById";

// Ensure this route is fully dynamic (no accidental static/ISR snapshot with stale data)
export const revalidate = 0;

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostById(params.id); // returns a plain object (already serialized)
  return {
    title: post?.name ? `Edit: ${post.name}` : "Edit Post",
  };
}

export default async function EditPostPage({ params }: PageProps) {
  const post = await getPostById(params.id);
  if (!post) return notFound();

  // Double-defense: even though getPostById returns plain JSON, stringify/parse
  // guarantees removal of any sneaky class instances before crossing the boundary.
  const safePost = JSON.parse(JSON.stringify(post));

  return <EditHydrator post={safePost} />;
}

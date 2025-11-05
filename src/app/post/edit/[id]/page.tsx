// src/app/post/edit/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditHydrator from "./ui/EditHydrator";
import { getPostById } from "@/app/actions/getPostById";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostById(params.id);
  return {
    title: post?.name ? `Edit: ${post.name}` : "Edit Post",
  };
}

export default async function EditPostPage({ params }: PageProps) {
  const post = await getPostById(params.id);
  if (!post) return notFound();

  return <EditHydrator post={post} />;
}

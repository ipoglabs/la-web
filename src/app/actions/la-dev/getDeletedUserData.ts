"use server";

import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import Conversation from "@/models/Conversation";
import type { LaDevDeletedUserData } from "./types";

type PostLean = {
  _id: unknown;
  adsId?: string;
  name: string;
  category: string;
  subcategory: string;
  status?: string;
  seller_info?: { name?: string; phone?: string; email?: string };
  createdAt: Date;
};

type PopulatedParticipant = { _id: Types.ObjectId; fullName?: string };

type ConversationLean = {
  _id: unknown;
  adId: string;
  adTitle: string;
  lastMessage: string;
  lastMessageAt?: Date;
  participants: (PopulatedParticipant | null)[];
};

/**
 * Listings + conversations belonging to a deleted user — admin-only lookup,
 * see src/app/la-dev/page.tsx. Unlike every public/user-facing read path,
 * this deliberately does NOT filter Post by status: "active" — the whole
 * point is to see the listing as it originally was, including the
 * status: "deleted" flip softDeleteAccount applies on account deletion.
 */
export async function getDeletedUserData(userId: string): Promise<LaDevDeletedUserData> {
  if (!Types.ObjectId.isValid(userId)) return { listings: [], conversations: [] };
  await dbConnect();

  const uid = new Types.ObjectId(userId);

  const posts = await Post.find({ ownerId: uid }).sort({ createdAt: -1 }).lean<PostLean[]>();
  const listings = posts.map((p) => ({
    id: String(p._id),
    adsId: p.adsId || undefined,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    status: p.status || "",
    sellerInfo: {
      name: p.seller_info?.name || "",
      phone: p.seller_info?.phone || "",
      email: p.seller_info?.email || "",
    },
    createdAt: new Date(p.createdAt).toISOString(),
  }));

  const convos = await Conversation.find({ participants: uid })
    .sort({ lastMessageAt: -1 })
    .populate<{ participants: PopulatedParticipant[] }>("participants", "fullName _id")
    .lean<ConversationLean[]>();

  const conversations = convos.map((c) => {
    const other = c.participants.find((p) => p != null && !p._id.equals(uid));
    return {
      id: String(c._id),
      adId: c.adId,
      adTitle: c.adTitle,
      otherParticipant: {
        id: other?._id ? String(other._id) : "",
        name: other?.fullName || "Unknown",
      },
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt).toISOString() : "",
    };
  });

  return { listings, conversations };
}

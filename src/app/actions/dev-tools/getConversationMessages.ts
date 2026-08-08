"use server";

import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import type { DevToolsConversationDetail } from "./types";

type PopulatedSender = { _id: Types.ObjectId; fullName?: string } | Types.ObjectId;

type MessageLean = {
  _id: unknown;
  senderId: PopulatedSender;
  text: string;
  createdAt: Date;
};

type PopulatedParticipant = { _id: Types.ObjectId; fullName?: string };

type ConversationLean = {
  adId: string;
  adTitle: string;
  participants: (PopulatedParticipant | null)[];
};

/** Full message thread + who/what it's about (ad, both participants) for one
 * conversation — admin-only lookup, see getDeletedUserData.ts. */
export async function getConversationMessages(conversationId: string): Promise<DevToolsConversationDetail> {
  if (!Types.ObjectId.isValid(conversationId)) return { conversation: null, messages: [] };
  await dbConnect();

  const [convo, messages] = await Promise.all([
    Conversation.findById(conversationId)
      .populate<{ participants: PopulatedParticipant[] }>("participants", "fullName _id")
      .lean<ConversationLean | null>(),
    Message.find({ conversationId })
      .sort({ _id: 1 })
      .populate<{ senderId: { _id: Types.ObjectId; fullName?: string } }>("senderId", "fullName")
      .lean<MessageLean[]>(),
  ]);

  return {
    conversation: convo
      ? {
          adId: convo.adId,
          adTitle: convo.adTitle,
          participants: convo.participants
            .filter((p): p is PopulatedParticipant => p != null)
            .map((p) => ({ id: String(p._id), fullName: p.fullName || "Unknown" })),
        }
      : null,
    messages: messages.map((m) => {
      const sender = m.senderId as { _id: Types.ObjectId; fullName?: string };
      return {
        id: String(m._id),
        senderId: String(sender._id),
        senderName: sender.fullName || "Unknown",
        text: m.text,
        createdAt: new Date(m.createdAt).toISOString(),
      };
    }),
  };
}

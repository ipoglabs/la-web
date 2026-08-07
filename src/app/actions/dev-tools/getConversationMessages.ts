"use server";

import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import type { DevToolsConversationMessage } from "./types";

type PopulatedSender = { _id: Types.ObjectId; fullName?: string } | Types.ObjectId;

type MessageLean = {
  _id: unknown;
  senderId: PopulatedSender;
  text: string;
  createdAt: Date;
};

/** Full message thread for one conversation — admin-only lookup, see getDeletedUserData.ts. */
export async function getConversationMessages(conversationId: string): Promise<DevToolsConversationMessage[]> {
  if (!Types.ObjectId.isValid(conversationId)) return [];
  await dbConnect();

  const messages = await Message.find({ conversationId })
    .sort({ _id: 1 })
    .populate<{ senderId: { _id: Types.ObjectId; fullName?: string } }>("senderId", "fullName")
    .lean<MessageLean[]>();

  return messages.map((m) => {
    const sender = m.senderId as { _id: Types.ObjectId; fullName?: string };
    return {
      id: String(m._id),
      senderId: String(sender._id),
      senderName: sender.fullName || "Unknown",
      text: m.text,
      createdAt: new Date(m.createdAt).toISOString(),
    };
  });
}

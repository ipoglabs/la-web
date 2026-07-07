import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { wsEmit } from "@/lib/wsEmit";
import mongoose from "mongoose";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const myId = new mongoose.Types.ObjectId(session.userId);
  await connectDB();

  const conv = await Conversation.findOne({ _id: id, participants: myId }).lean();
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await Message.updateMany(
    {
      conversationId: id,
      senderId:       { $ne: myId },
      readBy:         { $ne: myId },
      deletedAt:      null,
    },
    { $addToSet: { readBy: myId } }
  );

  await wsEmit(`conv:${id}`, "message:read", { readerId: session.userId });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import User from "@/models/user";
import { wsEmit } from "@/lib/wsEmit";
import { notifyRecipient } from "@/lib/notifyMessage";
import mongoose from "mongoose";

// GET /api/conversations/[id]/messages?cursor=<msgId>&limit=30
export async function GET(
  req: NextRequest,
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

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit  = Math.min(parseInt(searchParams.get("limit") ?? "30"), 50);

  const query: Record<string, unknown> = { conversationId: id, deletedAt: null };

  // ObjectIDs are time-ordered — compare _id directly, no extra findById needed
  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const raw = await Message.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = raw.length > limit;
  const page    = raw.slice(0, limit).reverse();

  const messages = page.map((m) => ({
    _id:            m._id.toString(),
    conversationId: m.conversationId.toString(),
    senderId:       m.senderId.toString(),
    text:           m.text,
    tempId:         m.tempId ?? null,
    readBy:         m.readBy.map((rid) => rid.toString()),
    attachments:    m.attachments ?? [],
    createdAt:      (m.createdAt as Date).toISOString(),
    updatedAt:      (m.updatedAt as Date).toISOString(),
  }));

  return NextResponse.json({
    messages,
    hasMore,
    nextCursor: hasMore ? page[0]._id.toString() : null,
  });
}

// POST /api/conversations/[id]/messages
export async function POST(
  req: NextRequest,
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

  if (conv.blockedBy.length > 0) {
    return NextResponse.json({ error: "Conversation is blocked" }, { status: 403 });
  }

  let body: { text: string; tempId?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const trimmed = (body.text ?? "").trim();
  if (!trimmed)              return NextResponse.json({ error: "Message cannot be empty" },  { status: 400 });
  if (trimmed.length > 1000) return NextResponse.json({ error: "Message too long" },         { status: 400 });

  const msg = await Message.create({
    conversationId: id,
    senderId:       myId,
    text:           trimmed,
    tempId:         body.tempId ?? undefined,
    readBy:         [myId],
  });

  await Conversation.findByIdAndUpdate(id, {
    lastMessage:   trimmed.length > 80 ? trimmed.slice(0, 80) + "…" : trimmed,
    lastMessageAt: new Date(),
  });

  const serialized = {
    _id:            msg._id.toString(),
    conversationId: id,
    senderId:       session.userId,
    text:           msg.text,
    tempId:         msg.tempId ?? null,
    readBy:         [session.userId],
    attachments:    [],
    createdAt:      msg.createdAt.toISOString(),
    updatedAt:      msg.updatedAt.toISOString(),
  };

  // Fetch sender name once (used in socket event + email notification)
  const sender = await User.findById(myId).select("fullName").lean() as { fullName?: string } | null;
  const senderName = sender?.fullName ?? "Someone";

  // Emit to conversation room (all members — client filters own messages by senderId)
  await wsEmit(`conv:${id}`, "message:new", { message: serialized });

  // Notify each recipient's personal room for unread badge + in-app toast
  const recipients = conv.participants.filter((p) => !p.equals(myId));
  await Promise.all(
    recipients.map((rid) =>
      wsEmit(`user:${rid.toString()}`, "conversation:updated", {
        conversationId: id,
        lastMessage:    serialized.text,
        lastMessageAt:  serialized.createdAt,
        senderName,
      })
    )
  );

  // Fire-and-forget offline email notification — does not block the response
  recipients.forEach((rid) => {
    notifyRecipient({
      conversationId: id,
      recipientId:    rid.toString(),
      senderName,
      messageText:    trimmed,
    }).catch(() => {});
  });

  return NextResponse.json({ message: serialized }, { status: 201 });
}

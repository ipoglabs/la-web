/**
 * app/api/conversations/[id]/messages/route.ts
 *
 * GET  /api/conversations/[id]/messages?cursor=<msgId>&limit=30 — cursor-
 *   paginated message history, oldest-first within the page (see
 *   models/Message.ts's `{conversationId:1,_id:-1}` index note). No cursor
 *   = most recent page.
 * POST /api/conversations/[id]/messages { text, tempId? } — send a message.
 *
 * REST-only port — see app/api/conversations/route.ts header for why this
 * doesn't emit socket events (no ws-server running). chat/page.tsx already
 * tolerates a missing socket gracefully (every getSocket() call is
 * `.catch()`-guarded), so messages still send/receive correctly on
 * fetch/refresh — they just don't push live to an already-open tab.
 *
 * Responses:
 *   200 { messages, hasMore, nextCursor }        — GET
 *   201 { message }                                — POST
 *   400 { error }                                   — validation error
 *   401 { error }                                   — not signed in
 *   403 { error }                                   — conversation blocked
 *   404 { error }                                   — not found / not a participant
 *   500 { error }                                   — server error
 */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

type MessageLike = {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  tempId?: string | null;
  readBy: mongoose.Types.ObjectId[];
  attachments?: unknown[];
  createdAt: Date;
  updatedAt: Date;
};

function serializeMessage(m: MessageLike, overrides: Partial<Record<string, unknown>> = {}) {
  return {
    _id: m._id.toString(),
    conversationId: m.conversationId.toString(),
    senderId: m.senderId.toString(),
    text: m.text,
    tempId: m.tempId ?? null,
    readBy: m.readBy.map((rid) => rid.toString()),
    attachments: m.attachments ?? [],
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
    ...overrides,
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await dbConnect();
    const myId = new mongoose.Types.ObjectId(session.userId);

    const conv = await Conversation.findOne({ _id: id, participants: myId }).lean();
    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "30", 10) || 30, 50);

    const query: Record<string, unknown> = { conversationId: id, deletedAt: null };
    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const raw = await Message.find(query).sort({ _id: -1 }).limit(limit + 1).lean();
    const hasMore = raw.length > limit;
    const page = raw.slice(0, limit).reverse();

    return NextResponse.json({
      messages: page.map((m) => serializeMessage(m)),
      hasMore,
      nextCursor: hasMore ? page[0]._id.toString() : null,
    });
  } catch (err) {
    console.error("[GET /api/conversations/[id]/messages]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await dbConnect();
    const myId = new mongoose.Types.ObjectId(session.userId);

    const conv = await Conversation.findOne({ _id: id, participants: myId }).lean();
    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (conv.blockedBy.length > 0) {
      return NextResponse.json({ error: "Conversation is blocked" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const trimmed = String(body?.text ?? "").trim();
    const tempId = body?.tempId ? String(body.tempId) : undefined;

    if (!trimmed) return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    if (trimmed.length > 1000) return NextResponse.json({ error: "Message is too long" }, { status: 400 });

    const msg = await Message.create({
      conversationId: id,
      senderId: myId,
      text: trimmed,
      tempId,
      readBy: [myId],
    });

    await Conversation.findByIdAndUpdate(id, {
      lastMessage: trimmed.length > 80 ? `${trimmed.slice(0, 80)}…` : trimmed,
      lastMessageAt: new Date(),
    });

    return NextResponse.json(
      { message: serializeMessage(msg, { senderId: session.userId, readBy: [session.userId] }) },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/conversations/[id]/messages]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

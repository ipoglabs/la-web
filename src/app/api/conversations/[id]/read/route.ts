/**
 * app/api/conversations/[id]/read/route.ts
 *
 * POST /api/conversations/[id]/read — marks every unread message in this
 * conversation (sent by the other participant) as read by the caller.
 * Called by chat/page.tsx on open and whenever a new message arrives.
 *
 * Responses:
 *   200 { ok: true }
 *   400 { error }   — invalid id
 *   401 { error }   — not signed in
 *   404 { error }   — not found / not a participant
 *   500 { error }   — server error
 */
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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

    await Message.updateMany(
      { conversationId: id, senderId: { $ne: myId }, readBy: { $ne: myId }, deletedAt: null },
      { $addToSet: { readBy: myId } }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/conversations/[id]/read]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

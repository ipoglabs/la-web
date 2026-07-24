/**
 * app/api/conversations/[id]/route.ts
 *
 * GET    /api/conversations/[id]    — single conversation, participants populated.
 * DELETE /api/conversations/[id]    — soft-delete for the CALLER only (adds
 *   them to `deletedBy`); the other participant still sees the conversation
 *   and its history until they delete it too.
 *
 * Responses:
 *   200 { conversation } | { ok: true }
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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await dbConnect();
    const myId = new mongoose.Types.ObjectId(session.userId);

    const conv = await Conversation.findOne({ _id: id, participants: myId })
      .populate("participants", "fullName username image _id")
      .lean();

    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ conversation: conv });
  } catch (err) {
    console.error("[GET /api/conversations/[id]]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await dbConnect();
    const myId = new mongoose.Types.ObjectId(session.userId);

    const updated = await Conversation.findOneAndUpdate(
      { _id: id, participants: myId },
      { $addToSet: { deletedBy: myId } }
    );

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/conversations/[id]]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

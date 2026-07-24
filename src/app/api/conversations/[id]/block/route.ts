/**
 * app/api/conversations/[id]/block/route.ts
 *
 * POST /api/conversations/[id]/block — toggles the CALLER's block on this
 * conversation (i.e. "I blocked them" / "I unblocked them"). Symmetric:
 * both participants can independently block; either party's active block
 * disables sending (see the [id]/messages POST route's blockedBy check).
 *
 * Responses:
 *   200 { iBlockedThem: boolean }   — new state after toggling
 *   400 { error }                    — invalid id
 *   401 { error }                    — not signed in
 *   404 { error }                    — not found / not a participant
 *   500 { error }                    — server error
 */
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";

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

    const conv = await Conversation.findOne({ _id: id, participants: myId });
    if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const alreadyBlocked = conv.blockedBy.some((bid: mongoose.Types.ObjectId) => bid.equals(myId));

    if (alreadyBlocked) {
      await Conversation.findByIdAndUpdate(id, { $pull: { blockedBy: myId } });
    } else {
      await Conversation.findByIdAndUpdate(id, { $addToSet: { blockedBy: myId } });
    }

    return NextResponse.json({ iBlockedThem: !alreadyBlocked });
  } catch (err) {
    console.error("[POST /api/conversations/[id]/block]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

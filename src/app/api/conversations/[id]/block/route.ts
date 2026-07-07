import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import mongoose from "mongoose";

// POST /api/conversations/[id]/block — toggle block for current user
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

  const conv = await Conversation.findOne({ _id: id, participants: myId });
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const alreadyBlocked = conv.blockedBy.some((bid) => bid.equals(myId));

  if (alreadyBlocked) {
    await Conversation.findByIdAndUpdate(id, { $pull:       { blockedBy: myId } });
  } else {
    await Conversation.findByIdAndUpdate(id, { $addToSet:   { blockedBy: myId } });
  }

  return NextResponse.json({ iBlockedThem: !alreadyBlocked });
}

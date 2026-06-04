import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import mongoose from "mongoose";

export async function GET(
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

  const conv = await Conversation.findOne({ _id: id, participants: myId })
    .populate("participants", "fullName username image _id")
    .lean();

  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ conversation: conv });
}

// Soft-delete for the current user only
export async function DELETE(
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

  const updated = await Conversation.findOneAndUpdate(
    { _id: id, participants: myId },
    { $addToSet: { deletedBy: myId } }
  );

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPusherServer } from "@/lib/pusher";
import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.text();
  const params = new URLSearchParams(body);
  const socketId   = params.get("socket_id");
  const channelName = params.get("channel_name");

  if (!socketId || !channelName) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // private-conversation-{id} — verify user is a participant
  if (channelName.startsWith("private-conversation-")) {
    const conversationId = channelName.replace("private-conversation-", "");
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
    }
    await connectDB();
    const conv = await Conversation.findOne({
      _id:          conversationId,
      participants: new mongoose.Types.ObjectId(session.userId),
    }).lean();
    if (!conv) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // private-user-{userId} — only the owner may subscribe
  if (channelName.startsWith("private-user-")) {
    const channelUserId = channelName.replace("private-user-", "");
    if (channelUserId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const auth = getPusherServer().authorizeChannel(socketId, channelName);
    return NextResponse.json(auth);
  } catch {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import mongoose from "mongoose";

// GET /api/conversations — list my conversations
export async function GET() {
  try {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const myId = new mongoose.Types.ObjectId(session.userId);
  await connectDB();

  type PopulatedUser = { _id: mongoose.Types.ObjectId; fullName: string; username: string; image: string };

  const conversations = await Conversation.find({
    participants: myId,
    deletedBy:    { $ne: myId },
  })
    .sort({ lastMessageAt: -1 })
    .populate<{ participants: PopulatedUser[] }>("participants", "fullName username image _id")
    .lean();

  // Unread counts in parallel
  const unreadCounts = await Promise.all(
    conversations.map((conv) =>
      Message.countDocuments({
        conversationId: conv._id,
        senderId:       { $ne: myId },
        readBy:         { $ne: myId },
        deletedAt:      null,
      })
    )
  );

  const result = conversations.map((conv, i) => {
    // Populate can return null for a participant whose user doc was deleted — guard against it
    const other = conv.participants.find((p) => p != null && !p._id.equals(myId));

    // blockedBy contains raw ObjectIds (not populated) — use optional chaining for safety
    const iBlocked    = conv.blockedBy?.some((id) => id?.equals?.(myId)) ?? false;
    const theyBlocked = conv.blockedBy?.some((id) => id != null && !id.equals(myId)) ?? false;

    return {
      id:       (conv._id as mongoose.Types.ObjectId).toString(),
      otherUser: {
        id:    other?._id?.toString() ?? "",
        name:  other?.fullName || other?.username || "Unknown",
        image: other?.image ?? "",
      },
      adId:          conv.adId,
      adTitle:       conv.adTitle,
      adPrice:       conv.adPrice,
      adImage:       conv.adImage,
      lastMessage:   conv.lastMessage,
      lastMessageAt: conv.lastMessageAt ?? new Date(),
      unreadCount:   unreadCounts[i],
      iBlockedThem:  iBlocked,
      blockedByOther: theyBlocked,
      isBlocked:     iBlocked || theyBlocked,
      createdBy:     (conv.createdBy as mongoose.Types.ObjectId | undefined)?.toString(),
    };
  });

  return NextResponse.json({ conversations: result });
  } catch (err) {
    console.error("[GET /api/conversations]", err);
    return NextResponse.json({ error: "Server error", conversations: [] }, { status: 500 });
  }
}

// POST /api/conversations — find-or-create conversation about an ad
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { otherUserId: string; adId: string; adTitle?: string; adPrice?: string; adImage?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { otherUserId, adId, adTitle = "", adPrice = "", adImage = "" } = body;
  if (!otherUserId || !adId) {
    return NextResponse.json({ error: "otherUserId and adId required" }, { status: 400 });
  }
  if (otherUserId === session.userId) {
    return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });
  }

  const myId    = new mongoose.Types.ObjectId(session.userId);
  const otherId = new mongoose.Types.ObjectId(otherUserId);
  await connectDB();

  let conv = await Conversation.findOne({
    participants: { $all: [myId, otherId] },
    adId,
  }).lean();

  if (!conv) {
    const created = await Conversation.create({
      participants: [myId, otherId],
      adId, adTitle, adPrice, adImage,
      createdBy: myId,
    });
    conv = created.toObject();
  }

  return NextResponse.json({
    conversationId: (conv._id as mongoose.Types.ObjectId).toString(),
  });
}

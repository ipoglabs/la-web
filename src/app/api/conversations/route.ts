/**
 * app/api/conversations/route.ts
 *
 * GET  /api/conversations — list the caller's conversations (chat/page.tsx's
 *   left-hand list). Excludes conversations the caller has soft-deleted.
 * POST /api/conversations { otherUserId, adId, adTitle?, adPrice?, adImage? }
 *   — find-or-create the conversation about a given ad between the caller
 *   and otherUserId. Used by "message seller" entry points (e.g. ChitChat,
 *   once that's wired to real data — currently still mock).
 *
 * REST-only port (no realtime): unlike la-web/develop, this does not emit
 * socket events — la-staging isn't running the standalone ws-server, so
 * chat/page.tsx's socket listeners simply never fire and the UI relies on
 * its own polling/refresh instead of push updates. See models/Conversation.ts
 * and models/Message.ts for the schema this reads/writes.
 *
 * Responses:
 *   200 { conversations: [...] }               — GET
 *   200 { conversationId }                      — POST, found or created
 *   400 { error }                                — validation error
 *   401 { error }                                — not signed in
 *   500 { error }                                — server error
 */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const myId = new mongoose.Types.ObjectId(session.userId);

    type PopulatedConversation = {
      _id: mongoose.Types.ObjectId;
      participants: { _id: mongoose.Types.ObjectId; fullName: string; username: string; image: string }[];
      blockedBy: mongoose.Types.ObjectId[];
      adId: string;
      adTitle: string;
      adPrice: string;
      adImage: string;
      lastMessage: string;
      lastMessageAt: Date;
      createdBy?: mongoose.Types.ObjectId;
    };

    const conversations = (await Conversation.find({
      participants: myId,
      deletedBy: { $ne: myId },
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "fullName username image _id")
      .lean()) as unknown as PopulatedConversation[];

    const unreadAgg = await Message.aggregate([
      {
        $match: {
          conversationId: { $in: conversations.map((c) => c._id) },
          senderId: { $ne: myId },
          readBy: { $ne: myId },
          deletedAt: null,
        },
      },
      { $group: { _id: "$conversationId", count: { $sum: 1 } } },
    ]);
    const unreadMap = new Map<string, number>(unreadAgg.map((a) => [a._id.toString(), a.count]));

    const result = conversations.map((conv) => {
      const other = conv.participants.find((p) => p != null && !p._id.equals(myId));
      const iBlocked = conv.blockedBy?.some((id) => id?.equals?.(myId)) ?? false;
      const theyBlocked = conv.blockedBy?.some((id) => id != null && !id.equals(myId)) ?? false;
      const convId = (conv._id as mongoose.Types.ObjectId).toString();

      return {
        id: convId,
        otherUser: {
          id: other?._id?.toString() ?? "",
          name: other?.fullName || other?.username || "Unknown",
          image: other?.image ?? "",
        },
        adId: conv.adId,
        adTitle: conv.adTitle,
        adPrice: conv.adPrice,
        adImage: conv.adImage,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt ?? new Date(),
        unreadCount: unreadMap.get(convId) ?? 0,
        iBlockedThem: iBlocked,
        blockedByOther: theyBlocked,
        isBlocked: iBlocked || theyBlocked,
        createdBy: conv.createdBy?.toString(),
      };
    });

    return NextResponse.json({ conversations: result });
  } catch (err) {
    console.error("[GET /api/conversations]", err);
    return NextResponse.json({ error: "Something went wrong", conversations: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const otherUserId = String(body?.otherUserId || "");
    const adId = String(body?.adId || "");
    const adTitle = String(body?.adTitle || "");
    const adPrice = String(body?.adPrice || "");
    const adImage = String(body?.adImage || "");

    if (!otherUserId || !adId) {
      return NextResponse.json({ error: "otherUserId and adId are required" }, { status: 400 });
    }
    if (otherUserId === session.userId) {
      return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return NextResponse.json({ error: "Invalid otherUserId" }, { status: 400 });
    }

    await dbConnect();
    const myId = new mongoose.Types.ObjectId(session.userId);
    const otherId = new mongoose.Types.ObjectId(otherUserId);

    let conv = await Conversation.findOne({
      participants: { $all: [myId, otherId] },
      adId,
    }).lean();

    if (!conv) {
      const created = await Conversation.create({
        participants: [myId, otherId],
        adId,
        adTitle,
        adPrice,
        adImage,
        createdBy: myId,
      });
      conv = created.toObject();
    }

    return NextResponse.json({ conversationId: (conv._id as mongoose.Types.ObjectId).toString() });
  } catch (err) {
    console.error("[POST /api/conversations]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

import { isUserOnline } from "@/lib/wsPresence";
import { sendMessageNotificationEmail } from "@/lib/notifyEmail";
import connectDB from "@/config/database";
import Conversation from "@/models/Conversation";
import User from "@/models/user";
import mongoose from "mongoose";

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes per recipient per conversation

export async function notifyRecipient({
  conversationId,
  recipientId,
  senderName,
  messageText,
}: {
  conversationId: string;
  recipientId:    string;
  senderName:     string;
  messageText:    string;
}): Promise<void> {
  try {
    // Skip if the recipient is currently connected — socket + AppHeader toast handles it
    const online = await isUserOnline(recipientId);
    if (online) return;

    await connectDB();

    // Cooldown check — avoid spamming a burst of messages
    const conv = await Conversation.findById(conversationId).lean() as any;
    if (!conv) return;

    const lastSent: Date | undefined = conv.notificationSentAt?.[recipientId];
    if (lastSent && Date.now() - new Date(lastSent).getTime() < COOLDOWN_MS) return;

    // Fetch recipient contact details
    const recipient = await User
      .findById(new mongoose.Types.ObjectId(recipientId))
      .select("email fullName")
      .lean() as { email: string; fullName: string } | null;

    if (!recipient?.email) return;

    // Send email (errors are caught so one failure doesn't affect the other)
    await sendMessageNotificationEmail({
      toEmail:        recipient.email,
      toName:         recipient.fullName,
      senderName,
      messagePreview: messageText,
    }).catch((err) => console.error("[notifyEmail] failed:", err));

    // Record the send time so the cooldown applies to subsequent messages
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`notificationSentAt.${recipientId}`]: new Date() },
    });
  } catch (err) {
    console.error("[notifyRecipient] error:", err);
  }
}

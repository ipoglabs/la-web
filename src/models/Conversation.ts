import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConversation extends Document {
  participants:        Types.ObjectId[];
  adId:                string;
  adTitle:             string;
  adPrice:             string;
  adImage:             string;
  lastMessage:         string;
  lastMessageAt:       Date;
  blockedBy:           Types.ObjectId[];
  deletedBy:           Types.ObjectId[];
  createdBy:           Types.ObjectId;
  notificationSentAt:  Map<string, Date>;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants:  [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    adId:          { type: String, required: true },
    adTitle:       { type: String, default: "" },
    adPrice:       { type: String, default: "" },
    adImage:       { type: String, default: "" },
    lastMessage:   { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
    blockedBy:           [{ type: Schema.Types.ObjectId, ref: "User" }],
    deletedBy:           [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy:           { type: Schema.Types.ObjectId, ref: "User" },
    notificationSentAt:  { type: Map, of: Date, default: {} },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ participants: 1, adId: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

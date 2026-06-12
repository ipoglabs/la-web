import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId:       Types.ObjectId;
  text:           string;
  tempId?:        string;
  readBy:         Types.ObjectId[];
  deletedAt?:     Date;
  attachments:    Array<{ url: string; publicId: string; mimeType: string; fileSize: number }>;
  createdAt:      Date;
  updatedAt:      Date;
}

const AttachmentSchema = new Schema(
  { url: String, publicId: String, mimeType: String, fileSize: Number },
  { _id: false }
);

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId:       { type: Schema.Types.ObjectId, ref: "User",         required: true },
    text:           { type: String, required: true, maxlength: 1000 },
    tempId:         { type: String },
    readBy:         [{ type: Schema.Types.ObjectId, ref: "User" }],
    deletedAt:      { type: Date },
    attachments:    [AttachmentSchema],
  },
  { timestamps: true }
);

// Kept for any legacy queries sorted by createdAt
MessageSchema.index({ conversationId: 1, createdAt: -1 });

// Cursor-based pagination (sorted by _id desc)
MessageSchema.index({ conversationId: 1, _id: -1 });

// Unread-count aggregation: conversationId IN [...], senderId ≠ me, readBy ≠ me, deletedAt null
MessageSchema.index({ conversationId: 1, senderId: 1, deletedAt: 1 });

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);

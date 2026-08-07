// Temporary — seeds one deleted user + listing + chat for a dev-tools UI smoke test.
import mongoose from "mongoose";
import dbConnect from "../src/lib/db";
import User from "../src/models/user";
import Post from "../src/models/post";
import Conversation from "../src/models/Conversation";
import Message from "../src/models/Message";
import fs from "fs";

const TAG = `devtoolssmoke${Date.now()}`;

async function main() {
  await dbConnect();

  const seller = await User.create({
    userId: `${TAG}-seller`,
    fullName: "Smoke Test Seller",
    dateOfBirth: new Date("1990-01-01"),
    email: `${TAG}-seller@example.com`,
    publicRole: "individual",
    accountStatus: "Active",
  });

  await User.updateOne(
    { _id: seller._id },
    {
      $set: {
        fullName: "Deleted User",
        isDeleted: true,
        accountStatus: "Deleted",
        deletedAt: new Date(),
        deleteFeedback: "Smoke test — moving abroad",
      },
      $unset: { email: "", primaryNumber: "" },
      $push: { audit: { action: "ACCOUNT_DELETED", at: new Date() } },
    }
  );

  const buyer = await User.create({
    userId: `${TAG}-buyer`,
    fullName: "Smoke Test Buyer",
    dateOfBirth: new Date("1992-01-01"),
    email: `${TAG}-buyer@example.com`,
    publicRole: "individual",
    accountStatus: "Active",
  });

  const post = await Post.create({
    name: "Smoke Test Listing (old bike)",
    description: "posted before deletion",
    category: "Vehicles",
    subcategory: "Bikes",
    adsId: `${TAG}-ad`,
    ownerId: seller._id,
    status: "deleted",
    seller_info: { name: "Deleted User", phone: "+10000000000", email: "deleted@example.com" },
  });

  const conversation = await Conversation.create({
    participants: [seller._id, buyer._id],
    adId: post.adsId,
    adTitle: post.name,
    adPrice: "500",
    adImage: "",
    lastMessage: "Sounds good, see you then!",
    lastMessageAt: new Date(),
    createdBy: buyer._id,
  });

  await Message.create({ conversationId: conversation._id, senderId: buyer._id, text: "Is this still available?", readBy: [buyer._id] });
  await Message.create({ conversationId: conversation._id, senderId: seller._id, text: "Yes, still have it.", readBy: [seller._id] });
  await Message.create({ conversationId: conversation._id, senderId: buyer._id, text: "Sounds good, see you then!", readBy: [buyer._id] });

  const ids = { seller: String(seller._id), buyer: String(buyer._id), post: String(post._id), conversation: String(conversation._id) };
  fs.writeFileSync("/tmp/dev-tools-smoke-ids.json", JSON.stringify(ids, null, 2));
  console.log("Seeded:", ids);
  console.log("Open /dev-tools, Deleted users tab, look for userId:", `${TAG}-seller`);

  await mongoose.connection.close();
}

main();

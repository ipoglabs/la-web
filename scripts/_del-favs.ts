// Throwaway: npx tsx --env-file=.env.local scripts/_del-favs.ts
import dbConnect from "../src/lib/db";
import mongoose from "mongoose";
import User from "../src/models/user";
import Favourite from "../src/models/Favourite";

const EMAIL = "ipoglabs@gmail.com";
const LISTING_IDS = ["prop-in-rent-03", "63338294", "prop-sg-room-02"];

async function main() {
  await dbConnect();
  console.log("DB:", mongoose.connection.name);

  const user = await User.findOne({ email: EMAIL }).lean<any>();
  if (!user) throw new Error(`No user for ${EMAIL}`);
  console.log("User:", String(user._id), user.email);

  const before = await Favourite.find({ userId: user._id }).select("listingId title").lean<any[]>();
  console.log("Before:", before.map((f) => f.listingId));

  const res = await Favourite.deleteMany({
    userId: user._id,
    listingId: { $in: LISTING_IDS },
  });
  console.log("deletedCount:", res.deletedCount);

  const after = await Favourite.find({ userId: user._id }).select("listingId title").lean<any[]>();
  console.log("After:", after.map((f) => f.listingId));

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });

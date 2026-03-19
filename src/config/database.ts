import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI missing in env");

// 🔥 GLOBAL CACHE (WORKS IN NEXT.JS)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  // ✅ already connected
  if (cached.conn) {
    return cached.conn;
  }

  // ✅ create connection once
  if (!cached.promise) {
    console.log("🚀 Creating MongoDB connection...");

    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  // ✅ wait for connection
  cached.conn = await cached.promise;

  console.log("✅ MongoDB connected (cached)");

  return cached.conn;
}

export default connectDB;
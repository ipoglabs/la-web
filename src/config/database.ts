import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI missing in env");

let cached = (global as any).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

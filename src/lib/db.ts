import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI missing in env");

type MongooseGlobal = typeof globalThis & { _mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };

const g = global as MongooseGlobal;

if (!g._mongoose) {
  g._mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (g._mongoose!.conn) return g._mongoose!.conn;

  if (!g._mongoose!.promise) {
    g._mongoose!.promise = mongoose
      .connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined })
      .then((m) => m);
  }
  g._mongoose!.conn = await g._mongoose!.promise;
  return g._mongoose!.conn;
}

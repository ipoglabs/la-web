/**
 * lib/db.ts
 *
 * Singleton MongoDB connection for Next.js.
 *
 * Next.js hot-reloads modules in development, which would create a new
 * Mongoose connection on every reload. The globalThis cache prevents that.
 *
 * SETUP — add to .env.local:
 *   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/mydb?retryWrites=true&w=majority
 *
 * USAGE:
 *   import dbConnect from "@/lib/db";
 *   await dbConnect();
 */

import mongoose from "mongoose";

// Extend globalThis to cache the connection across hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const cached = globalThis._mongooseCache ?? { conn: null, promise: null };
globalThis._mongooseCache = cached;

export default async function dbConnect(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      'Missing MONGODB_URI — add it to .env.local:\n  MONGODB_URI=mongodb+srv://...',
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  console.log("Connected DB:", cached.conn.connection.db?.databaseName);
  return cached.conn;
}
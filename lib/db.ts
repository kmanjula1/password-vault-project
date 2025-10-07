// lib/db.ts
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Use const and fully typed
const cached: MongooseCache =
  global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI in .env.local or Vercel Environment Variables"
  );
}
const MONGODB_URI_STR: string = MONGODB_URI;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI_STR).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

